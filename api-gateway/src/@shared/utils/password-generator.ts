export function generateRandomPassword(length: number = 12): string {
  const numbers = '0123456789';
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const specialChars = '!@#$%^&*(),.?":{}|<>';
  const allChars = numbers + letters + specialChars;

  if (length < 8) {
    length = 8; // Ensure minimum length
  }

  let password = '';
  let hasNumber = false;
  let hasLetter = false;
  let hasSpecial = false;

  // Ensure at least one of each required character type
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += letters[Math.floor(Math.random() * letters.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  hasNumber = true;
  hasLetter = true;
  hasSpecial = true;

  // Fill the rest of the password length with random characters
  for (let i = password.length; i < length; i++) {
    const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
    password += randomChar;

    if (numbers.includes(randomChar)) hasNumber = true;
    if (letters.includes(randomChar)) hasLetter = true;
    if (specialChars.includes(randomChar)) hasSpecial = true;
  }

  // Shuffle the password to ensure randomness
  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  // Re-check and add missing character types if shuffling removed them (unlikely but safe)
  if (!hasNumber) {
    const index = Math.floor(Math.random() * password.length);
    password = password.substring(0, index) + numbers[Math.floor(Math.random() * numbers.length)] + password.substring(index + 1);
  }
  if (!hasLetter) {
     const index = Math.floor(Math.random() * password.length);
    password = password.substring(0, index) + letters[Math.floor(Math.random() * letters.length)] + password.substring(index + 1);
  }
  if (!hasSpecial) {
     const index = Math.floor(Math.random() * password.length);
    password = password.substring(0, index) + specialChars[Math.floor(Math.random() * specialChars.length)] + password.substring(index + 1);
  }


  return password;
}