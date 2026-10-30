export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 text-sm text-ink/60 sm:px-8 md:flex-row md:items-center">
        <div>
          <p className="font-display text-base text-ink">КБТУ ВАРСИТИ</p>
          <p className="mt-1">Студенческий проект. Не связан с администрацией КБТУ.</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a className="hover:text-ink" href="https://kbtu.edu.kz/en/schools" target="_blank" rel="noreferrer">
            Школы КБТУ ↗
          </a>
          <a className="hover:text-ink" href="https://t.me/beka_rizz" target="_blank" rel="noreferrer">
            Telegram ↗
          </a>
        </div>
        <p>© {new Date().getFullYear()} · Алматы</p>
      </div>
    </footer>
  )
}
