/**
 * A próxima turma do Conexão BT.
 *
 * É o único dado com prazo de validade no site inteiro: turma marcada, data
 * marcada, e depois dela a informação vira mentira. Por isso mora sozinho num
 * arquivo, e por isso existe `turmaAberta()` — passada a data, a seção e o aviso
 * somem sem ninguém precisar lembrar de apagar nada.
 *
 * Fonte: post do CT no Instagram (23/08/2026) anunciando a turma de setembro.
 *
 * Para trocar de turma: mude as datas e o nível aqui. Para desligar tudo (turma
 * encerrada e a próxima ainda sem data), ponha `ativa: false`.
 */
export const proximaTurma = {
  ativa: true,

  nivel: "Iniciante / Intermediário",

  /** Primeiro e último dia, em horário local. Mês é 0-based no Date do JS. */
  inicio: new Date(2026, 8, 25),
  fim: new Date(2026, 8, 27),

  /** Como as datas aparecem escritas. */
  dias: "25, 26 e 27",
  mes: "de setembro",
  ano: "2026",

  local: "Prainha Beach Tennis",
  cidade: "Porto Alegre — RS",

  carga: "+20 horas",
  formato: "de capacitação presencial",

  chamada: "A metodologia que conecta professores e transforma jogadores.",

  /**
   * Foto do cartaz da turma, se houver — o mesmo material do post do Instagram,
   * salvo em `public/img/`. Com `null`, o cartaz é desenhado em código (o que no
   * celular lê melhor do que um JPEG de texto).
   */
  foto: null as string | null,

  mensagem:
    "Olá! Vi o Conexão BT de 25, 26 e 27 de setembro no site e quero garantir minha vaga.",
} as const;

/**
 * A turma ainda está por vir?
 *
 * Vale até o fim do último dia — durante o curso o anúncio continua de pé, que é
 * quando aparece gente perguntando se dá para entrar.
 */
export function turmaAberta(agora: Date = new Date()): boolean {
  if (!proximaTurma.ativa) return false;
  const ultimoInstante = new Date(proximaTurma.fim);
  ultimoInstante.setHours(23, 59, 59, 999);
  return agora <= ultimoInstante;
}

/** Quantos dias faltam para o primeiro dia. Negativo se já começou. */
export function diasParaTurma(agora: Date = new Date()): number {
  const dia = 24 * 60 * 60 * 1000;
  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const inicio = new Date(proximaTurma.inicio);
  return Math.round((inicio.getTime() - hoje.getTime()) / dia);
}
