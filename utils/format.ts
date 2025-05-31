export const formatCPF = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 11);

  const part1 = digitsOnly.slice(0, 3);
  const part2 = digitsOnly.slice(3, 6);
  const part3 = digitsOnly.slice(6, 9);
  const part4 = digitsOnly.slice(9, 11);

  let formatted = part1;
  if (part2) formatted += `.${part2}`;
  if (part3) formatted += `.${part3}`;
  if (part4) formatted += `-${part4}`;

  return formatted;
};

export const formatTelefone = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 11);

  if (digitsOnly.length === 0) return "";

  if (digitsOnly.length <= 2) return `(${digitsOnly}`;

  if (digitsOnly.length <= 6)
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`;

  if (digitsOnly.length <= 10)
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(
      2,
      6
    )}-${digitsOnly.slice(6)}`;

  // 11 dígitos (celular com 9 dígitos)
  return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(
    2,
    7
  )}-${digitsOnly.slice(7, 11)}`;
};

export const cleanCPF = (cpf: string) => {
  return cpf.replace(/[^\d]/g, "");
};
