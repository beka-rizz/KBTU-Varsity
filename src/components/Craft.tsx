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
          <img
            src="/img/jacket-sample-896.jpg"
            srcSet="/img/jacket-sample-480.jpg 480w, /img/jacket-sample-896.jpg 896w"
            sizes="(min-width: 1024px) 40vw, 90vw"
            width={896}
            height={1194}
            loading="lazy"
            decoding="async"
            alt="Образец бомбера спереди и сзади"
            className="w-full rounded-[28px] shadow-card ring-1 ring-ink/10"
          />
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
