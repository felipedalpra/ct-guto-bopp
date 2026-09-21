export type PapelUsuario = "lider" | "professor";
export type StatusUsuario = "ativo" | "revogado";

export type Perfil = {
  id: string;
  nome: string;
  email: string;
  role: PapelUsuario;
  status: StatusUsuario;
  criado_em: string;
};

export type TipoMaterial = "arquivo" | "video" | "link" | "texto";

export type Material = {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: TipoMaterial;
  arquivo_path: string | null;
  video_url: string | null;
  link_url: string | null;
  corpo_texto: string | null;
  publicado: boolean;
  criado_em: string;
};

export type Trilha = {
  id: string;
  titulo: string;
  descricao: string | null;
  publicado: boolean;
  criado_em: string;
};

export type TrilhaMaterial = {
  trilha_id: string;
  material_id: string;
  ordem: number;
};

export type ComentarioMaterial = {
  id: string;
  material_id: string;
  professor_id: string;
  autor_nome: string;
  conteudo: string;
  criado_em: string;
};

export type InteracoesDoMaterial = {
  curtidas: number;
  curtiu: boolean;
  comentarios: ComentarioMaterial[];
};
