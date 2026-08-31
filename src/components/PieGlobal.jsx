const REPO_URL = 'https://github.com/lucianomartinezok/w3-inicio';

export default function PieGlobal() {
  return <footer className="fixed inset-x-0 bottom-0 z-30 flex h-7 items-center justify-center border-t border-slate-800 bg-slate-950 px-12 text-center text-[11px] text-slate-300">
    <span>Facilitador pedagógico digital <b className="text-white">Luciano Martínez</b> <span aria-hidden="true">›</span> <a href={REPO_URL} target="_blank" rel="noreferrer" className="font-bold text-indigo-300 underline decoration-indigo-500/60 underline-offset-2 hover:text-white">acceso público a este repositorio en GitHub</a></span>
  </footer>;
}
