import { PasswordGeneratorPort } from '@domain/@shared/ports/password-generator.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordGeneratorService implements PasswordGeneratorPort {
  getRandomPassword(length: number = 12): string {
    const numbers = '0123456789';
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*(),.?":{}|<>';
    const allChars = numbers + letters + specialChars;

    const finalLength = Math.max(length, 8);

    const passwordChars: string[] = [];

    // 1. Ensure at least one of each required character type
    passwordChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
    passwordChars.push(letters[Math.floor(Math.random() * letters.length)]);
    passwordChars.push(
      specialChars[Math.floor(Math.random() * specialChars.length)],
    );

    // 2. Fill the rest of the password length with random characters from all types
    for (let i = 3; i < finalLength; i++) {
      passwordChars.push(
        allChars[Math.floor(Math.random() * allChars.length)],
      );
    }

    // 3. Shuffle the password array to ensure randomness
    for (let i = passwordChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordChars[i], passwordChars[j]] = [
        passwordChars[j],
        passwordChars[i],
      ]; // Fisher-Yates shuffle
    }

    return passwordChars.join('');
  }
}
