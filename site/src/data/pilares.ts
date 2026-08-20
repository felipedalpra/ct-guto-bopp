/**
 * Método dos 5 Pilares — Metodologia Guto Bopp.
 *
 * ⚠️ RASCUNHO — VALIDAR COM O GUTO.
 * O briefing cita os cinco temas em texto corrido ("organização, correção,
 * desenvolvimento técnico e tático, qualidade das aulas"), mas não trouxe o nome
 * oficial nem a descrição de cada pilar. Os nomes e todos os textos abaixo foram
 * redigidos a partir do briefing e precisam do aval do cliente antes de publicar.
 *
 * Cada pilar tem quatro camadas de texto, na ordem em que o leitor as encontra:
 *   resumo     — uma linha, subtítulo do pilar em /metodo
 *   ganho      — o resultado em poucas palavras, para a lista da home
 *   descricao  — o parágrafo do pilar
 *   naAula     — como ele aparece na prática, em quadra
 *   oQueMuda   — o que o aluno ganha quando o pilar está sendo cumprido
 *
 * `zona` posiciona o pilar no diagrama de quadra da seção (coordenadas 0–1,
 * origem no canto superior esquerdo da quadra).
 */

export const RASCUNHO = true;

export type Pilar = {
  numero: string;
  nome: string;
  resumo: string;
  ganho: string;
  descricao: string;
  naAula: string[];
  oQueMuda: string;
  zona: { x: number; y: number };
};

export const pilares: Pilar[] = [
  {
    numero: "01",
    nome: "Organização",
    resumo: "Toda aula tem começo, meio e objetivo.",
    ganho:
      "Cada aula continua a anterior, em vez de recomeçar do zero.",
    descricao:
      "Aula planejada antes de a bola entrar em quadra: objetivo definido, sequência de exercícios encadeada e tempo aproveitado do aquecimento ao último ponto. É o pilar que separa treino de bate-bola.",
    naAula: [
      "O professor chega com o objetivo da aula definido, não escolhe na hora",
      "Os exercícios se encadeiam: cada um prepara o seguinte",
      "O tempo de quadra é distribuído — nada de meia hora na mesma fila de bola",
      "O que foi trabalhado hoje conversa com o que vem na próxima aula",
    ],
    oQueMuda:
      "O aluno para de sentir que cada aula recomeça do zero e passa a perceber uma linha entre uma semana e a outra.",
    zona: { x: 0.22, y: 0.2 },
  },
  {
    numero: "02",
    nome: "Correção",
    resumo: "Apontar o erro certo, na hora certa, com a palavra certa.",
    ganho:
      "O erro para de voltar com outro nome.",
    descricao:
      "Enxergar a causa do erro em vez do sintoma e devolver a correção de forma que o aluno consiga aplicar no próximo ponto. Feedback curto, específico e no tempo do jogo.",
    naAula: [
      "A correção mira a causa — empunhadura, pés, decisão — e não a bola que saiu",
      "Uma coisa por vez: duas correções simultâneas anulam as duas",
      "Frase curta, no intervalo do ponto, no vocabulário do aluno",
      "O professor confere se a correção pegou antes de passar para a próxima",
    ],
    oQueMuda:
      "O erro para de voltar com outro nome. O aluno entende o que causou a bola errada e consegue arrumar sozinho no ponto seguinte.",
    zona: { x: 0.75, y: 0.28 },
  },
  {
    numero: "03",
    nome: "Desenvolvimento técnico",
    resumo: "O gesto construído na base, repetido até virar padrão.",
    ganho:
      "O golpe deixa de depender do dia.",
    descricao:
      "Empunhadura, posição de espera, deslocamento e finalização trabalhados na ordem certa. A técnica é construída por camadas, cada uma consolidada antes da seguinte.",
    naAula: [
      "A base vem antes do golpe: empunhadura e posição de espera não se pulam",
      "O deslocamento é treinado como parte do golpe, não como aquecimento",
      "Repetição com intenção — volume suficiente para o gesto virar padrão",
      "Camada nova só entra quando a anterior aguenta pressão de jogo",
    ],
    oQueMuda:
      "O golpe deixa de depender do dia. O aluno repete o mesmo gesto sob pressão, que é o que sustenta o nível quando o ponto fica difícil.",
    zona: { x: 0.5, y: 0.5 },
  },
  {
    numero: "04",
    nome: "Desenvolvimento tático",
    resumo: "Saber o que fazer com a bola antes de ela chegar.",
    ganho:
      "O aluno joga com intenção, não no reflexo.",
    descricao:
      "Leitura de jogo, posicionamento de dupla, escolha do golpe e construção do ponto. É onde o aluno para de reagir à bola e passa a decidir o jogo.",
    naAula: [
      "Posicionamento de dupla treinado junto, não cada um no seu lado",
      "Exercícios com decisão: mais de uma resposta possível para a mesma bola",
      "Construção de ponto — a bola que prepara vale tanto quanto a que finaliza",
      "Leitura do adversário: onde ele está, o que ele não alcança",
    ],
    oQueMuda:
      "O aluno passa a jogar com intenção. Ganha ponto de quem bate mais forte que ele, porque sabe onde colocar a bola.",
    zona: { x: 0.24, y: 0.74 },
  },
  {
    numero: "05",
    nome: "Qualidade da aula",
    resumo: "O aluno sai da quadra sabendo o que evoluiu.",
    ganho:
      "A evolução vira algo que o aluno consegue nomear.",
    descricao:
      "Intensidade, clima e clareza do que foi trabalhado. Uma aula de qualidade entrega evolução percebida — e é o que faz o aluno voltar na semana seguinte.",
    naAula: [
      "Intensidade compatível com o nível: nem parado, nem afogado",
      "Clima que deixa o aluno tentar e errar sem travar",
      "O objetivo da aula é dito no começo e retomado no fim",
      "O aluno sai sabendo o que treinar até a próxima",
    ],
    oQueMuda:
      "A evolução deixa de ser sensação e vira algo que o aluno consegue nomear — o que faz ele voltar, e é por isso que este pilar fecha o método.",
    zona: { x: 0.77, y: 0.8 },
  },
];
