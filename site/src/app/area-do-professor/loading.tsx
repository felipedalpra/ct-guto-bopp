export default function CarregandoAreaDoProfessor() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 py-4" aria-busy="true" aria-label="Carregando conteúdo">
      <div className="animate-pulse rounded-2xl border border-sand/10 bg-navy-800 p-7">
        <div className="h-3 w-28 rounded bg-lime-ct/25" />
        <div className="mt-4 h-10 w-2/5 rounded bg-sand/15" />
        <div className="mt-3 h-4 w-3/5 rounded bg-sand/10" />
      </div>
      <div className="animate-pulse">
        <div className="h-5 w-36 rounded bg-sand/15" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-48 rounded-xl border border-sand/10 bg-navy-800" />
          ))}
        </div>
      </div>
    </div>
  );
}
