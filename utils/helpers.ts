// Gera um número de conta no formato AA-999999
export const generateAccountNumber = (firstName: string): string => {
  const initials = firstName.substring(0, 2).toUpperCase();
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Gera número de 6 dígitos
  return `${initials}-${randomNumber}`;
};
