export interface VocabularySeedItem {
  word: string;
  ipa: string;
  definitionVi: string;
  definitionEn: string;
  exampleSentence: string;
  level: string;
  wordType: string;
  topicTags: string[];
  audioUrl: string;
}

export const VOCABULARY_SEED_DATA: VocabularySeedItem[] = [
  // A1
  { word: 'book', ipa: '/bʊk/', definitionVi: 'sách', definitionEn: 'A written or printed work', exampleSentence: 'I read a book every week.', level: 'A1', wordType: 'noun', topicTags: ['education'], audioUrl: '' },
  { word: 'water', ipa: '/ˈwɔːtər/', definitionVi: 'nước', definitionEn: 'A clear liquid essential for life', exampleSentence: 'Please give me a glass of water.', level: 'A1', wordType: 'noun', topicTags: ['daily'], audioUrl: '' },
  { word: 'house', ipa: '/haʊs/', definitionVi: 'nhà', definitionEn: 'A building where people live', exampleSentence: 'My house has three bedrooms.', level: 'A1', wordType: 'noun', topicTags: ['home'], audioUrl: '' },
  { word: 'eat', ipa: '/iːt/', definitionVi: 'ăn', definitionEn: 'To put food in your mouth and swallow it', exampleSentence: 'I eat breakfast every morning.', level: 'A1', wordType: 'verb', topicTags: ['daily'], audioUrl: '' },
  { word: 'happy', ipa: '/ˈhæpi/', definitionVi: 'vui vẻ, hạnh phúc', definitionEn: 'Feeling or showing pleasure', exampleSentence: 'She is happy today.', level: 'A1', wordType: 'adjective', topicTags: ['emotion'], audioUrl: '' },
  { word: 'school', ipa: '/skuːl/', definitionVi: 'trường học', definitionEn: 'A place where children go to study', exampleSentence: 'He goes to school every day.', level: 'A1', wordType: 'noun', topicTags: ['education'], audioUrl: '' },
  { word: 'friend', ipa: '/frend/', definitionVi: 'bạn bè', definitionEn: 'A person you know and like', exampleSentence: 'She is my best friend.', level: 'A1', wordType: 'noun', topicTags: ['social'], audioUrl: '' },
  { word: 'work', ipa: '/wɜːrk/', definitionVi: 'làm việc', definitionEn: 'To do a job or task', exampleSentence: 'I work from nine to five.', level: 'A1', wordType: 'verb', topicTags: ['work'], audioUrl: '' },
  { word: 'good', ipa: '/ɡʊd/', definitionVi: 'tốt', definitionEn: 'Of high quality or an acceptable standard', exampleSentence: 'This is a good idea.', level: 'A1', wordType: 'adjective', topicTags: ['general'], audioUrl: '' },
  { word: 'time', ipa: '/taɪm/', definitionVi: 'thời gian', definitionEn: 'The indefinite continued progress of existence', exampleSentence: 'What time is it?', level: 'A1', wordType: 'noun', topicTags: ['general'], audioUrl: '' },
  // A2
  { word: 'library', ipa: '/ˈlaɪbreri/', definitionVi: 'thư viện', definitionEn: 'A building with a collection of books', exampleSentence: 'I borrow books from the library.', level: 'A2', wordType: 'noun', topicTags: ['education'], audioUrl: '' },
  { word: 'travel', ipa: '/ˈtrævl/', definitionVi: 'du lịch', definitionEn: 'To go from one place to another', exampleSentence: 'I love to travel abroad.', level: 'A2', wordType: 'verb', topicTags: ['travel'], audioUrl: '' },
  { word: 'breakfast', ipa: '/ˈbrekfəst/', definitionVi: 'bữa sáng', definitionEn: 'The first meal of the day', exampleSentence: 'I have toast for breakfast.', level: 'A2', wordType: 'noun', topicTags: ['food'], audioUrl: '' },
  { word: 'weather', ipa: '/ˈweðər/', definitionVi: 'thời tiết', definitionEn: 'The state of the atmosphere at a place and time', exampleSentence: 'The weather is nice today.', level: 'A2', wordType: 'noun', topicTags: ['nature'], audioUrl: '' },
  { word: 'together', ipa: '/təˈɡeðər/', definitionVi: 'cùng nhau', definitionEn: 'With or in proximity to another person or group', exampleSentence: 'We work together every day.', level: 'A2', wordType: 'adverb', topicTags: ['social'], audioUrl: '' },
  { word: 'shopping', ipa: '/ˈʃɒpɪŋ/', definitionVi: 'mua sắm', definitionEn: 'The activity of buying goods from shops', exampleSentence: 'She goes shopping on weekends.', level: 'A2', wordType: 'noun', topicTags: ['daily'], audioUrl: '' },
  { word: 'tired', ipa: '/ˈtaɪərd/', definitionVi: 'mệt mỏi', definitionEn: 'In need of sleep or rest', exampleSentence: 'I feel tired after work.', level: 'A2', wordType: 'adjective', topicTags: ['emotion'], audioUrl: '' },
  { word: 'explain', ipa: '/ɪkˈspleɪn/', definitionVi: 'giải thích', definitionEn: 'To make something clear by describing it', exampleSentence: 'Can you explain this rule?', level: 'A2', wordType: 'verb', topicTags: ['communication'], audioUrl: '' },
  { word: 'message', ipa: '/ˈmesɪdʒ/', definitionVi: 'tin nhắn', definitionEn: 'A written or spoken communication', exampleSentence: 'She sent me a message.', level: 'A2', wordType: 'noun', topicTags: ['communication'], audioUrl: '' },
  { word: 'decide', ipa: '/dɪˈsaɪd/', definitionVi: 'quyết định', definitionEn: 'To make a choice between alternatives', exampleSentence: 'I need to decide quickly.', level: 'A2', wordType: 'verb', topicTags: ['general'], audioUrl: '' },
  // B1
  { word: 'achievement', ipa: '/əˈtʃiːvmənt/', definitionVi: 'thành tích, thành tựu', definitionEn: 'A thing done successfully with effort', exampleSentence: 'Winning the award was a great achievement.', level: 'B1', wordType: 'noun', topicTags: ['success'], audioUrl: '' },
  { word: 'environment', ipa: '/ɪnˈvaɪrənmənt/', definitionVi: 'môi trường', definitionEn: 'The natural world around us', exampleSentence: 'We must protect the environment.', level: 'B1', wordType: 'noun', topicTags: ['nature'], audioUrl: '' },
  { word: 'opportunity', ipa: '/ˌɒpəˈtjuːnɪti/', definitionVi: 'cơ hội', definitionEn: 'A set of circumstances that makes it possible to do something', exampleSentence: 'This is a great opportunity to learn.', level: 'B1', wordType: 'noun', topicTags: ['general'], audioUrl: '' },
  { word: 'recommend', ipa: '/ˌrekəˈmend/', definitionVi: 'đề xuất, giới thiệu', definitionEn: 'To suggest that someone do something', exampleSentence: 'I recommend this book to everyone.', level: 'B1', wordType: 'verb', topicTags: ['communication'], audioUrl: '' },
  { word: 'community', ipa: '/kəˈmjuːnɪti/', definitionVi: 'cộng đồng', definitionEn: 'A group of people living in the same place', exampleSentence: 'The community organized a festival.', level: 'B1', wordType: 'noun', topicTags: ['social'], audioUrl: '' },
  { word: 'challenge', ipa: '/ˈtʃælɪndʒ/', definitionVi: 'thách thức', definitionEn: 'A difficult situation requiring effort', exampleSentence: 'Learning English is a challenge.', level: 'B1', wordType: 'noun', topicTags: ['general'], audioUrl: '' },
  { word: 'consider', ipa: '/kənˈsɪdər/', definitionVi: 'xem xét', definitionEn: 'To think carefully about something', exampleSentence: 'Please consider my suggestion.', level: 'B1', wordType: 'verb', topicTags: ['general'], audioUrl: '' },
  { word: 'experience', ipa: '/ɪkˈspɪəriəns/', definitionVi: 'kinh nghiệm', definitionEn: 'Practical contact with and observation of facts', exampleSentence: 'She has years of experience in teaching.', level: 'B1', wordType: 'noun', topicTags: ['work'], audioUrl: '' },
  { word: 'successful', ipa: '/səkˈsesfʊl/', definitionVi: 'thành công', definitionEn: 'Having achieved popularity or profit', exampleSentence: 'He is a successful businessman.', level: 'B1', wordType: 'adjective', topicTags: ['success'], audioUrl: '' },
  { word: 'responsible', ipa: '/rɪˈspɒnsɪbl/', definitionVi: 'có trách nhiệm', definitionEn: 'Having an obligation to do something', exampleSentence: 'Be responsible for your actions.', level: 'B1', wordType: 'adjective', topicTags: ['general'], audioUrl: '' },
  // B2
  { word: 'ambiguous', ipa: '/æmˈbɪɡjuəs/', definitionVi: 'mơ hồ, không rõ ràng', definitionEn: 'Open to more than one interpretation', exampleSentence: 'The contract terms were ambiguous.', level: 'B2', wordType: 'adjective', topicTags: ['communication'], audioUrl: '' },
  { word: 'collaborate', ipa: '/kəˈlæbəreɪt/', definitionVi: 'hợp tác', definitionEn: 'To work jointly with others', exampleSentence: 'The teams collaborate on the project.', level: 'B2', wordType: 'verb', topicTags: ['work'], audioUrl: '' },
  { word: 'negotiate', ipa: '/nɪˈɡəʊʃieɪt/', definitionVi: 'thương lượng, đàm phán', definitionEn: 'To try to reach an agreement through discussion', exampleSentence: 'They negotiated a better salary.', level: 'B2', wordType: 'verb', topicTags: ['business'], audioUrl: '' },
  { word: 'sophisticated', ipa: '/səˈfɪstɪkeɪtɪd/', definitionVi: 'tinh vi, phức tạp', definitionEn: 'Developed to a high degree of complexity', exampleSentence: 'The software uses sophisticated algorithms.', level: 'B2', wordType: 'adjective', topicTags: ['technology'], audioUrl: '' },
  { word: 'fundamental', ipa: '/ˌfʌndəˈmentl/', definitionVi: 'cơ bản, căn bản', definitionEn: 'Forming a necessary base or core', exampleSentence: 'Trust is fundamental to any relationship.', level: 'B2', wordType: 'adjective', topicTags: ['general'], audioUrl: '' },
  { word: 'controversial', ipa: '/ˌkɒntrəˈvɜːʃl/', definitionVi: 'gây tranh cãi', definitionEn: 'Giving rise to public disagreement', exampleSentence: 'The policy is controversial.', level: 'B2', wordType: 'adjective', topicTags: ['social'], audioUrl: '' },
  { word: 'implement', ipa: '/ˈɪmplɪment/', definitionVi: 'thực hiện, triển khai', definitionEn: 'To put a decision into effect', exampleSentence: 'We need to implement the new plan.', level: 'B2', wordType: 'verb', topicTags: ['business'], audioUrl: '' },
  { word: 'perspective', ipa: '/pəˈspektɪv/', definitionVi: 'quan điểm, góc nhìn', definitionEn: 'A particular way of considering something', exampleSentence: 'Consider it from a different perspective.', level: 'B2', wordType: 'noun', topicTags: ['general'], audioUrl: '' },
  { word: 'significant', ipa: '/sɪɡˈnɪfɪkənt/', definitionVi: 'quan trọng, đáng kể', definitionEn: 'Important or large enough to be noticed', exampleSentence: 'There has been a significant improvement.', level: 'B2', wordType: 'adjective', topicTags: ['general'], audioUrl: '' },
  { word: 'inevitable', ipa: '/ɪnˈevɪtəbl/', definitionVi: 'không thể tránh khỏi', definitionEn: 'Certain to happen; unavoidable', exampleSentence: 'Change is inevitable in life.', level: 'B2', wordType: 'adjective', topicTags: ['general'], audioUrl: '' },
  // C1
  { word: 'paradox', ipa: '/ˈpærədɒks/', definitionVi: 'nghịch lý', definitionEn: 'A statement that contradicts itself but may be true', exampleSentence: 'It is a paradox that war brings peace.', level: 'C1', wordType: 'noun', topicTags: ['philosophy'], audioUrl: '' },
  { word: 'eloquent', ipa: '/ˈeləkwənt/', definitionVi: 'hùng hồn, lưu loát', definitionEn: 'Fluent or persuasive in speaking or writing', exampleSentence: 'She gave an eloquent speech.', level: 'C1', wordType: 'adjective', topicTags: ['communication'], audioUrl: '' },
  { word: 'mitigate', ipa: '/ˈmɪtɪɡeɪt/', definitionVi: 'giảm nhẹ, hạn chế', definitionEn: 'To make less severe or serious', exampleSentence: 'Measures to mitigate climate change are needed.', level: 'C1', wordType: 'verb', topicTags: ['environment'], audioUrl: '' },
  { word: 'unprecedented', ipa: '/ʌnˈpresɪdentɪd/', definitionVi: 'chưa từng có tiền lệ', definitionEn: 'Never done or known before', exampleSentence: 'The crisis was unprecedented in scale.', level: 'C1', wordType: 'adjective', topicTags: ['general'], audioUrl: '' },
  { word: 'contemplate', ipa: '/ˈkɒntəmpleɪt/', definitionVi: 'suy ngẫm, chiêm nghiệm', definitionEn: 'To think deeply or carefully about', exampleSentence: 'She contemplated the meaning of life.', level: 'C1', wordType: 'verb', topicTags: ['philosophy'], audioUrl: '' },
  { word: 'pragmatic', ipa: '/præɡˈmætɪk/', definitionVi: 'thực dụng', definitionEn: 'Dealing with things sensibly and realistically', exampleSentence: 'We need a pragmatic approach.', level: 'C1', wordType: 'adjective', topicTags: ['general'], audioUrl: '' },
  { word: 'implicit', ipa: '/ɪmˈplɪsɪt/', definitionVi: 'ngầm hiểu, ẩn chứa', definitionEn: 'Suggested though not directly expressed', exampleSentence: 'There was an implicit threat in his words.', level: 'C1', wordType: 'adjective', topicTags: ['communication'], audioUrl: '' },
  { word: 'scrutinize', ipa: '/ˈskruːtɪnaɪz/', definitionVi: 'xem xét kỹ lưỡng', definitionEn: 'To examine or inspect closely', exampleSentence: 'The committee scrutinized the report.', level: 'C1', wordType: 'verb', topicTags: ['work'], audioUrl: '' },
  { word: 'resilience', ipa: '/rɪˈzɪliəns/', definitionVi: 'khả năng phục hồi', definitionEn: 'The ability to recover quickly from difficulties', exampleSentence: 'The team showed great resilience.', level: 'C1', wordType: 'noun', topicTags: ['psychology'], audioUrl: '' },
  { word: 'nuance', ipa: '/ˈnjuːɑːns/', definitionVi: 'sắc thái tinh tế', definitionEn: 'A subtle difference in meaning or expression', exampleSentence: 'Poetry is full of nuance.', level: 'C1', wordType: 'noun', topicTags: ['language'], audioUrl: '' },
  // C2
  { word: 'quintessential', ipa: '/ˌkwɪntɪˈsenʃl/', definitionVi: 'tiêu biểu nhất, điển hình', definitionEn: 'Representing the most perfect example', exampleSentence: 'She is the quintessential professional.', level: 'C2', wordType: 'adjective', topicTags: ['general'], audioUrl: '' },
  { word: 'pervasive', ipa: '/pəˈveɪsɪv/', definitionVi: 'lan tràn, phổ biến khắp nơi', definitionEn: 'Present or spreading widely throughout', exampleSentence: 'Social media has a pervasive influence.', level: 'C2', wordType: 'adjective', topicTags: ['social'], audioUrl: '' },
  { word: 'dichotomy', ipa: '/daɪˈkɒtəmi/', definitionVi: 'sự phân đôi, mâu thuẫn nhị phân', definitionEn: 'A division into two contrasted things', exampleSentence: 'There is a dichotomy between theory and practice.', level: 'C2', wordType: 'noun', topicTags: ['philosophy'], audioUrl: '' },
  { word: 'ineffable', ipa: '/ɪnˈefəbl/', definitionVi: 'không thể diễn đạt bằng lời', definitionEn: 'Too great or extreme to be expressed in words', exampleSentence: 'There was an ineffable sense of joy.', level: 'C2', wordType: 'adjective', topicTags: ['emotion'], audioUrl: '' },
  { word: 'obfuscate', ipa: '/ˈɒbfʌskeɪt/', definitionVi: 'làm mờ tối, làm khó hiểu', definitionEn: 'To make unclear or confusing', exampleSentence: 'The jargon obfuscates the real issue.', level: 'C2', wordType: 'verb', topicTags: ['communication'], audioUrl: '' },
  { word: 'ephemeral', ipa: '/ɪˈfemərəl/', definitionVi: 'phù du, thoáng qua', definitionEn: 'Lasting for a very short time', exampleSentence: 'Fame can be ephemeral.', level: 'C2', wordType: 'adjective', topicTags: ['philosophy'], audioUrl: '' },
  { word: 'solipsism', ipa: '/ˈsɒlɪpsɪzəm/', definitionVi: 'thuyết duy ngã', definitionEn: 'The view that only oneself exists or can be known', exampleSentence: 'Solipsism is a philosophical position.', level: 'C2', wordType: 'noun', topicTags: ['philosophy'], audioUrl: '' },
  { word: 'recalcitrant', ipa: '/rɪˈkælsɪtrənt/', definitionVi: 'cứng đầu, bướng bỉnh', definitionEn: 'Uncooperative and resistant to authority', exampleSentence: 'The recalcitrant employee refused to comply.', level: 'C2', wordType: 'adjective', topicTags: ['behavior'], audioUrl: '' },
  { word: 'perspicacious', ipa: '/ˌpɜːspɪˈkeɪʃəs/', definitionVi: 'sắc sảo, tinh tường', definitionEn: 'Having a ready insight into things; shrewd', exampleSentence: 'A perspicacious observer notices subtle details.', level: 'C2', wordType: 'adjective', topicTags: ['intelligence'], audioUrl: '' },
  { word: 'sycophant', ipa: '/ˈsɪkəfænt/', definitionVi: 'kẻ nịnh hót', definitionEn: 'A person who acts obsequiously towards someone', exampleSentence: 'The boss was surrounded by sycophants.', level: 'C2', wordType: 'noun', topicTags: ['behavior'], audioUrl: '' },
];
