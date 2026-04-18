export class Email {
  private readonly value!: string;
  constructor(email: string) {
    if (!Email.isValid(email)) {
      throw new Error(`Invalid email: ${email}`);
    }
    this.value = email.toLowerCase().trim();
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  toString(): string {
    return this.value;
  }
}
