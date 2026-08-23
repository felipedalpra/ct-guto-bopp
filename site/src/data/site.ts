/**
 * Dados de contato e identidade do CT Guto Bopp.
 * Fonte: briefing respondido pelo cliente (ver ../../../memory.md).
 * Alterar aqui reflete no site inteiro e nos dados estruturados de SEO.
 */

export const site = {
  nome: "CT Guto Bopp",
  nomeCompleto: "CT Guto Bopp — Centro de Treinamento de Beach Tennis",
  lema: "Disciplina. Método. Resultado.",
  descricao:
    "Centro de Treinamento de Beach Tennis em Porto Alegre. Mais de 13 anos de quadra transformados na Metodologia Guto Bopp — o Método dos 5 Pilares — para desenvolver atletas e capacitar professores.",
  // TODO: trocar quando o domínio for definido.
  url: "https://ctgutobopp.com.br",
  fundador: "Guto Bopp",
  anosDeExperiencia: 13,

  endereco: {
    local: "Sede Prainha Beach Tennis",
    rua: "Av. Saturnino de Brito, 738",
    cidade: "Porto Alegre",
    estado: "RS",
    estadoNome: "Rio Grande do Sul",
    pais: "BR",
    bairro: "Vila Jardim",
    // CEP confirmado pela ficha do Google do local (Prainha Beach Tennis).
    cep: "91320-000",
    // Coordenadas aproximadas do endereço.
    // TODO: confirmar o ponto exato da quadra antes de publicar.
    lat: -30.0335,
    lng: -51.1585,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Av.+Saturnino+de+Brito,+738,+Porto+Alegre+-+RS",
  },

  horario: {
    texto: "Todos os dias, das 07h às 20h",
    abre: "07:00",
    fecha: "20:00",
  },

  whatsapp: {
    numero: "(51) 99808-6780",
    e164: "+5551998086780",
    link(mensagem: string) {
      return `https://wa.me/5551998086780?text=${encodeURIComponent(mensagem)}`;
    },
  },

  instagram: {
    handle: "@ctgutobopp",
    url: "https://instagram.com/ctgutobopp",
  },
} as const;

/**
 * Formulário de contato.
 *
 * `endpoint` é o destino do POST (JSON) com os campos do formulário. Enquanto
 * estiver vazio, a interface funciona por inteiro mas nada é salvo — é só plugar
 * a URL de um serviço de formulário (Formspree, Basin, Getform) ou de uma rota
 * própria, sem mexer no componente.
 */
export const formulario = {
  endpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",
} as const;

/** Mensagens pré-preenchidas do WhatsApp, por origem do clique. */
export const whatsappMensagens = {
  geral: "Olá! Vim pelo site do CT Guto Bopp e quero saber mais sobre os treinos.",
  treinos: "Olá! Quero saber sobre os treinos no CT Guto Bopp.",
  metodo:
    "Olá! Vi o Método dos 5 Pilares no site e quero entender como funciona o treino.",
  conexaoBT:
    "Olá! Sou professor(a) e quero saber mais sobre o Conexão BT — a capacitação do CT Guto Bopp.",
  professores:
    "Olá! Vim pelo site e quero uma indicação de professor do CT Guto Bopp para o meu nível.",
} as const;
