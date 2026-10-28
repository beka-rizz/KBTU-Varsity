const SPECS = [
  { k: 'Тело', v: '70% шерсть мельтон, 580 г/м² — тепло до −15 °C со стёганой подкладкой' },
  { k: 'Рукава', v: 'Кремовая экокожа: не продувает и легко протирается' },
  { k: 'Отделка', v: 'Резинка воротника, манжет и низа с двумя полосками в цвете школы' },
  { k: 'Буква', v: 'Шеврон на груди с фетровой подложкой и печать школы на рукаве' },
  { k: 'Спина', v: 'КБТУ по дуге, название школы и подпись прописью' },
  { k: 'Фурнитура', v: 'Никелевые кнопки, два прорезных кармана и внутренний карман для телефона' },
]

export function Craft() {
  return (
    <section id="craft" className="cv-auto scroll-mt-16 py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
            <img
              src="/img/jacket-front-960.webp"
              srcSet="/img/jacket-front-480.webp 480w, /img/jacket-front-960.webp 960w"
              sizes="(min-width: 1024px) 30vw, 55vw"
              width={960}
              height={1280}
              loading="lazy"
              decoding="async"
              alt="Перед бомбера: кнопки и прорезные карманы"
              className="aspect-[4/5] w-full rounded-[28px] object-cover shadow-card ring-1 ring-ink/10"
            />
            <img
              src="/img/jacket-back-960.webp"
              srcSet="/img/jacket-back-480.webp 480w, /img/jacket-back-960.webp 960w"
              sizes="(min-width: 1024px) 20vw, 35vw"
              width={960}
              height={1280}
              loading="lazy"
              decoding="async"
              alt="Спинка с вышивкой по дуге"
              className="mt-12 aspect-[4/5] w-full rounded-[28px] object-cover shadow-card ring-1 ring-ink/10"
            />
          </div>
          <p className="mt-4 font-script text-2xl text-ink/60">образец — наш крой повторяет это лекало</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">03 — Пошив</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-5xl">Сшита для алматинской зимы.</h2>
          <p className="mt-4 max-w-lg text-ink/65">
            Бомберы придумали для холодных трибун. Мы оставили классический силуэт и усилили то, что внутри: стёганая
            подкладка и непродуваемые рукава — носить с октября по март.
          </p>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {SPECS.map((s) => (
                <div key={s.k} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4">
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-ink/60">{s.k}</dt>
                <dd className="text-sm font-medium text-ink/85">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
