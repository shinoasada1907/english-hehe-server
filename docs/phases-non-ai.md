# English HEHE Server — Non-AI Phases

> Tài liệu mô tả chi tiết các phase backend **không liên quan đến AI** đã hoàn thành.
> Kiến trúc: **NestJS + TypeORM + PostgreSQL + Redis**, theo mô hình Clean Architecture (Domain → Application → Infrastructure → Presentation).

---

## Tổng quan kiến trúc

```
src/
├── config/              # Cấu hình app, database, redis, jwt, google
├── database/
│   ├── migrations/      # 10 migration files (001→010)
│   └── data-source.ts
├── redis/               # RedisModule + RedisService
├── health/              # Health check endpoint
├── shared/              # Base classes, guards, interceptors, filters, decorators
└── modules/
    ├── auth/            # Phase 1
    ├── vocabulary/      # Phase 2
    ├── lesson/          # Phase 3
    ├── test/            # Phase 4
    ├── toeic/           # Phase 5
    ├── analytics/       # Phase 6
    └── admin/           # Phase 7
```

### Infrastructure chung (main.ts)

| Thành phần | Chi tiết |
|---|---|
| Global prefix | `/api` |
| Swagger UI | `/docs` |
| Validation | `ValidationPipe` — whitelist, forbidNonWhitelisted, transform |
| Response chuẩn | `ResponseInterceptor` bọc tất cả response |
| Lỗi chuẩn | `HttpExceptionFilter` |
| Security | `helmet`, `compression`, CORS có cấu hình |
| Rate limiting | Throttler: short (10/1s), medium (50/10s), long (200/60s) |

---

## Phase 1 — Auth

**Module:** `src/modules/auth/`

### Domain

```
User entity:
  id, email (Email VO), passwordHash, fullName
  role: 'user' | 'admin' | 'super_admin'
  currentLevel: 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced'
  streakDays, totalXp, dailyGoal (mặc định 20)
  googleId (nullable), isActive
```

### Endpoints

| Method | Path | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký email/password, trả về access + refresh token |
| POST | `/api/auth/login` | Đăng nhập, trả về access + refresh token |
| POST | `/api/auth/refresh` | Làm mới access token bằng refresh token |
| GET | `/api/auth/me` | Lấy profile người dùng (JWT required) |
| GET | `/api/auth/google` | Bắt đầu Google OAuth flow |
| GET | `/api/auth/google/callback` | Callback Google OAuth, trả về JWT tokens |

### Use Cases

- **RegisterUseCase** — hash password (bcrypt), tạo User, cấp access + refresh token
- **LoginUseCase** — so sánh password, cấp tokens
- **RefreshTokenUseCase** — verify refresh token, cấp access token mới, rotate refresh token
- **GetProfileUseCase** — trả về profile từ DB
- **GoogleLoginUseCase** — upsert user từ Google profile, cấp tokens

### Infrastructure

- **JWT Strategy** — xác thực Bearer token
- **Google Strategy** — OAuth 2.0 via Passport
- **JwtGuard** — guard bảo vệ route
- **RolesGuard** — kiểm tra role (`@Roles(...)` decorator)
- Refresh token lưu DB với hash, hỗ trợ revoke

### Migrations

- `001_create_users` — bảng `users`
- `002_create_refresh_tokens` — bảng `refresh_tokens`

---

## Phase 2 — Vocabulary

**Module:** `src/modules/vocabulary/`

### Domain

```
Vocabulary entity:
  id, word, ipa, definitionVi, definitionEn
  exampleSentence, audioUrl, imageUrl
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  topicTags: string[], wordType

UserVocabularyProgress entity:
  id, userId, vocabularyId
  status: 'learning' | 'review' | 'mastered'
  easeFactor, intervalDays, repetitions, nextReviewAt
```

### Endpoints

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/vocab/daily` | Từ mới hôm nay theo level người dùng (cache Redis 1h) |
| GET | `/api/vocab/review` | Từ cần ôn tập (`nextReviewAt <= now`) |
| GET | `/api/vocab/search` | Tìm kiếm theo từ khóa |
| GET | `/api/vocab/:id` | Chi tiết một từ vựng |
| POST | `/api/vocab/:id/status` | Cập nhật tiến độ học (SM-2 algorithm) |

### Logic quan trọng

**SM-2 Spaced Repetition** (`Sm2Service`):
- Input: `easeFactor`, `intervalDays`, `repetitions`, `quality` (0–5)
- Nếu `quality < 3`: reset về learning (interval = 1 ngày)
- Nếu `quality >= 3`: tính lại interval theo công thức SM-2 chuẩn
- `easeFactor` min = 1.3, tính lại theo: `EF + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)`
- Status: `learning` (rep=0), `review` (interval<21d), `mastered` (interval≥21d)

**Get Daily Words**:
- Map user level → vocab level: `beginner→A1`, `elementary→A2`, `intermediate→B1`, `upper_intermediate→B2`, `advanced→C1`
- Lấy 10 từ chưa học, cache Redis key `daily_words:{userId}:{date}` TTL 3600s

### Migrations

- `003_create_vocabularies` — bảng `vocabularies`
- `004_create_user_vocabulary_progress` — bảng `user_vocabulary_progress`

---

## Phase 3 — Lesson

**Module:** `src/modules/lesson/`

### Domain

```
Lesson entity:
  id, title, description, level, category
  contentJson (JSONB), orderIndex, xpReward, isPublished

UserLessonProgress entity:
  id, userId, lessonId
  completed, score, completedAt
```

### Endpoints

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/lessons` | Danh sách bài học (filter theo level, category) |
| GET | `/api/lessons/progress` | Progress tất cả bài học của user hiện tại |
| GET | `/api/lessons/:id` | Chi tiết bài học + nội dung JSON |
| POST | `/api/lessons/:id/complete` | Đánh dấu hoàn thành, cộng XP |

### Logic quan trọng

**CompleteLessonUseCase**:
- Kiểm tra lesson tồn tại và `isPublished = true`
- Nếu đã complete trước rồi → trả về kết quả cũ, **không cộng XP lần 2**
- Upsert progress, cộng `lesson.xpReward` vào `user.totalXp`

### Migrations

- `005_create_lessons` — bảng `lessons`
- `006_create_user_lesson_progress` — bảng `user_lesson_progress`

---

## Phase 4 — Test (Grammar / Skill)

**Module:** `src/modules/test/`

### Domain

```
Test entity:
  id, title, description, level, category
  timeLimit (phút), maxXp, isPublished

Question entity:
  id, testId, content, choices: string[]
  correctAnswer (index), explanation, orderIndex

TestResult entity:
  id, userId, testId, score (0-100), correctCount, totalCount
  xpEarned, answers (JSONB map), completedAt
```

### Endpoints

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/tests` | Danh sách bài test (filter level, category) |
| GET | `/api/tests/history` | Lịch sử làm test của user (mới nhất trước) |
| GET | `/api/tests/:id` | Chi tiết test + câu hỏi (KHÔNG có đáp án) |
| POST | `/api/tests/:id/submit` | Nộp bài — chấm điểm server-side |

### Logic quan trọng

**SubmitTestUseCase**:
- Validate số lượng answer phải bằng số câu hỏi
- Chấm điểm server-side: `score = round(correct/total * 100)`
- XP: `xpEarned = round(score/100 * test.maxXp)`
- Lưu result với chi tiết từng câu (`answers` JSONB)
- Cộng XP vào `user.totalXp`

### Migrations

- `007_create_tests` — bảng `tests`
- `008_create_questions` — bảng `questions`
- `009_create_test_results` — bảng `test_results`

---

## Phase 5 — TOEIC

**Module:** `src/modules/toeic/`

### Domain

```
ToeicTest: id, title, description, year, isPublished

ToeicGroup: id, testId, partNumber (1-7), instructions, audioUrl, imageUrl
  → has many ToeicQuestion

ToeicQuestion: id, groupId, content, choices: string[]
  correctAnswer (index), orderIndex

ToeicResult: id, userId, testId
  listeningScore (5-495), readingScore (5-495), totalScore (10-990)
  correctCount, totalCount, answers (JSONB), completedAt
```

### Endpoints

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/toeic` | Danh sách đề thi TOEIC |
| GET | `/api/toeic/history` | Lịch sử thi của user |
| GET | `/api/toeic/:id` | Chi tiết đề theo parts (KHÔNG có đáp án) |
| POST | `/api/toeic/:id/submit` | Nộp bài — tính Listening/Reading/Total score |

### Logic quan trọng

**SubmitToeicUseCase — TOEIC Score Scaling**:
- Parts 1-4 = Listening (100 câu), Parts 5-7 = Reading (100 câu)
- Scaled score: `score = round((correct/total * 490 + 5) / 5) * 5`, min 5 max 495
- Total score = Listening + Reading (max 990)
- Kết quả trả về: `listeningScore`, `readingScore`, `totalScore`, `correctCount`, `totalCount`

### Migration

- `010_create_toeic_tests` — bảng `toeic_tests`, `toeic_groups`, `toeic_questions`, `toeic_results`

---

## Phase 6 — Analytics

**Module:** `src/modules/analytics/`

### Endpoints

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/analytics/dashboard` | Tổng quan: XP, streak, level, dailyGoal, vocab/lesson/test stats |
| GET | `/api/analytics/xp-history?days=N` | Lịch sử XP theo ngày (mặc định 30, max 365) |
| GET | `/api/analytics/test-performance` | Hiệu suất test phân theo category và level |
| GET | `/api/analytics/vocabulary-progress` | Tiến độ từ vựng phân theo status và level |

### Logic quan trọng

**Dashboard** — aggregate song song:
- Vocab stats: count by `status` (learning/review/mastered)
- Lesson stats: completed count + total enrolled
- Test stats: số lần làm + avgScore

**XP History** — merge hai nguồn:
- XP từ test results: `SUM(xp_earned)` grouped by ngày
- XP từ lesson completions: `COUNT(*) * 10` grouped by ngày
- Trả về timeline có `xpFromTests`, `xpFromLessons`, `total` theo từng ngày

---

## Phase 7 — Admin

**Module:** `src/modules/admin/`

> Tất cả endpoint yêu cầu role `admin` hoặc `super_admin` (JWT + RolesGuard).

### Admin Users (`/api/admin/users`)

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/admin/users` | Danh sách users (phân trang, filter role/level/search) |
| GET | `/api/admin/users/:id` | Chi tiết user |
| PATCH | `/api/admin/users/:id` | Cập nhật role, level, trạng thái |
| DELETE | `/api/admin/users/:id` | Vô hiệu hóa tài khoản (soft delete: `isActive=false`) |

### Admin Vocabulary (`/api/admin/vocabularies`)

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/admin/vocabularies` | Danh sách (phân trang, filter level/search) |
| POST | `/api/admin/vocabularies` | Tạo từ vựng mới |
| PATCH | `/api/admin/vocabularies/:id` | Cập nhật từ vựng |
| DELETE | `/api/admin/vocabularies/:id` | Xóa từ vựng |

### Admin Lessons (`/api/admin/lessons`)

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/admin/lessons` | Danh sách (phân trang, filter level/category/published) |
| GET | `/api/admin/lessons/:id` | Chi tiết lesson |
| POST | `/api/admin/lessons` | Tạo lesson mới |
| PATCH | `/api/admin/lessons/:id` | Cập nhật lesson (bao gồm publish/unpublish) |
| DELETE | `/api/admin/lessons/:id` | Xóa lesson |

### Admin Tests (`/api/admin/tests`)

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/admin/tests` | Danh sách (phân trang, filter level/category) |
| GET | `/api/admin/tests/:id` | Chi tiết test + câu hỏi kèm **đáp án** |
| POST | `/api/admin/tests` | Tạo test + câu hỏi trong một transaction |
| PATCH | `/api/admin/tests/:id` | Cập nhật metadata test |
| DELETE | `/api/admin/tests/:id` | Xóa test (cascade xóa questions + results) |

### Admin Stats (`/api/admin/stats`)

| Method | Path | Mô tả |
|---|---|---|
| GET | `/api/admin/stats` | Tổng quan hệ thống: users, content, activity |

Response mẫu:
```json
{
  "users": {
    "total": 1200,
    "active": 980,
    "newLast7Days": 45,
    "byLevel": { "beginner": 400, "intermediate": 350, ... }
  },
  "content": {
    "lessons": { "total": 80, "published": 65 },
    "tests": { "total": 120, "published": 100 },
    "vocabularies": 5000
  },
  "activity": { "totalTestResults": 8500 }
}
```

---

## Phase 8 — Infrastructure (Health + Redis)

### Health Check (`/api/health`)

- Sử dụng `@nestjs/terminus`
- Kiểm tra kết nối PostgreSQL (`TypeOrmHealthIndicator.pingCheck`)
- Endpoint: `GET /api/health`

### Redis

- `RedisModule` global, inject `RedisService` vào bất kỳ module nào
- Dùng trong: Vocabulary daily words cache (TTL 3600s)
- Cấu hình qua `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`

---

## Database Migrations Summary

| File | Bảng tạo |
|---|---|
| `001_create_users` | `users` |
| `002_create_refresh_tokens` | `refresh_tokens` |
| `003_create_vocabularies` | `vocabularies` |
| `004_create_user_vocabulary_progress` | `user_vocabulary_progress` |
| `005_create_lessons` | `lessons` |
| `006_create_user_lesson_progress` | `user_lesson_progress` |
| `007_create_tests` | `tests` |
| `008_create_questions` | `questions` |
| `009_create_test_results` | `test_results` |
| `010_create_toeic_tests` | `toeic_tests`, `toeic_groups`, `toeic_questions`, `toeic_results` |

---

## XP System

Hệ thống XP nhất quán xuyên suốt các module:

| Nguồn XP | Cách tính |
|---|---|
| Hoàn thành lesson | `lesson.xpReward` (mặc định 10 XP) — chỉ cộng lần đầu |
| Nộp bài test | `round(score/100 * test.maxXp)` — mỗi lần nộp đều tính |
| Analytics XP history | Lesson: `count * 10`, Test: tổng `xp_earned` |

---

## Trạng thái hoàn thành

| Phase | Module | Status |
|---|---|---|
| 1 | Auth (email/password + Google OAuth) | ✅ Done |
| 2 | Vocabulary + SM-2 Spaced Repetition | ✅ Done |
| 3 | Lesson + Progress tracking | ✅ Done |
| 4 | Test (Grammar/Skill) + Grading | ✅ Done |
| 5 | TOEIC + Score scaling | ✅ Done |
| 6 | Analytics dashboard | ✅ Done |
| 7 | Admin panel (CRUD + Stats) | ✅ Done |
| 8 | Health check + Redis + Rate limiting | ✅ Done |
| — | AI features (conversation, pronunciation, adaptive) | ⏳ Pending |
