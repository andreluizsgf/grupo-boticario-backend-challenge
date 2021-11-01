export function formatCpf(cpf: string) {
  return cpf.replace(/[.-]/g, "");
}

export function formatPercentageValue(value: number) {
  return Math.round(value / 100);
}
