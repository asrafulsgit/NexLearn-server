export const  isValidPassword =(password)=> {
  const minLength = 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  if (!hasUppercase) {
    return { valid: false, message: 'Password must include at least one uppercase letter.' };
  }
  if (!hasLowercase) {
    return { valid: false, message: 'Password must include at least one lowercase letter.' };
  }

  return { valid: true, message: 'Password is valid.' };
}
