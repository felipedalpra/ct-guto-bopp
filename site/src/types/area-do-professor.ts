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
