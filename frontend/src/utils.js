export function calcularIdadeCorrigida(dataNascimento, idadeGestacional) {
  if (!dataNascimento || !idadeGestacional) return null;

  const referenciaSemanas = 40;
  const nascimento = new Date(dataNascimento);
  const diasPrematuridade = (referenciaSemanas - idadeGestacional) * 7;
  const dataCorrigida = new Date(nascimento.getTime() + diasPrematuridade * 24 * 60 * 60 * 1000);

  const hoje = new Date();
  let diffMeses = (hoje.getFullYear() - dataCorrigida.getFullYear()) * 12;
  diffMeses += hoje.getMonth() - dataCorrigida.getMonth();

  let diffDias = hoje.getDate() - dataCorrigida.getDate();
  if (diffDias < 0) {
    diffMeses -= 1;
    diffDias += new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
  }

  return { meses: diffMeses, dias: diffDias };
}