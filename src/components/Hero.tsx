import { SCHOOLS, formatKZT, PRICE_KZT, type School } from '../data/schools'

export function Hero({ school, onPick }: { school: School; onPick: (s: School) => void }) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft school-coloured glow behind the hero */}
      <div
        aria-hidden="true"
        className="school-transition pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full opacity-[0.11] blur-3xl"
        style={{ background: 'var(--school)' }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-16">
        <div className="animate-rise">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-cream/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ink/70">
            <span className="school-transition h-2 w-2 rounded-full" style={{ background: 'var(--school)' }} />
            Предзаказ · зима 2026/27
          </p>

          <h1 className="text-balance font-display text-[2.6rem] leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            Носи свою
            <br />
            <span className="school-transition text-[var(--school)]">школу.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            Зимний бомбер для студентов КБТУ: шерстяное тело, кожаные рукава, шеврон на груди. Один крой,{' '}
            <strong className="font-semibold text-ink">двенадцать расцветок</strong> — классический тёмно-синий КБТУ и
            по одной на каждую из 11 школ.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#studio"
              className="school-transition inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-bold text-[var(--school-ink)] shadow-float transition hover:-translate-y-0.5"
              style={{ background: 'var(--school)' }}
            >
              Собрать в 3D
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a
              href="#schools"
              className="inline-flex h-12 items-center rounded-full border border-ink/15 bg-cream/60 px-6 text-sm font-bold transition hover:bg-cream"
            >
              Все 11 школ
            </a>
            <span className="ml-1 text-sm font-semibold text-ink/60">{formatKZT(PRICE_KZT)} · примерка в кампусе бесплатно</span>
          </div>

          {/* Colour strip – quick pick */}
          <div className="mt-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Выбери расцветку</p>
            <div className="flex flex-wrap gap-2">
              {SCHOOLS.map((s) => {
                const active = s.id === school.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onPick(s)}
                    title={s.short}
                    aria-label={s.short}
                    aria-pressed={active}
                    className={`h-8 w-8 rounded-full border-2 transition-transform duration-300 hover:scale-110 ${
                      active ? 'scale-110 border-ink shadow-card' : 'border-white/70'
                    }`}
                    style={{ background: s.body }}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Photo stack */}
        <div className="animate-rise relative mx-auto w-full max-w-md lg:max-w-none [animation-delay:120ms]">
          <div className="relative aspect-[4/5] w-[78%] overflow-hidden rounded-[28px] shadow-float ring-1 ring-ink/10">
            <img
              src="/img/jacket-front-960.webp"
              srcSet="/img/jacket-front-480.webp 480w, /img/jacket-front-960.webp 960w"
              sizes="(min-width: 1024px) 40vw, 90vw"
              width={960}
              height={1280}
              alt="Тёмно-синий бомбер с кремовыми кожаными рукавами и шевроном на груди"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur">
              Образец
            </div>
          </div>
          <div className="absolute -bottom-6 right-0 aspect-[4/5] w-[46%] overflow-hidden rounded-[22px] shadow-float ring-1 ring-ink/10 rotate-[4deg]">
            <img
              src="/img/jacket-back-480.webp"
              width={480}
              height={640}
              alt="Спинка бомбера с вышивкой по дуге"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div
            className="school-transition absolute -left-3 bottom-10 hidden rotate-[-6deg] rounded-2xl px-4 py-3 text-[var(--school-ink)] shadow-float sm:block"
            style={{ background: 'var(--school)' }}
          >
            <p className="font-display text-2xl leading-none">11 + 1</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">школ · один крой</p>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="border-y border-line bg-cream/60 py-3">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap px-5 text-xs font-bold uppercase tracking-[0.2em] text-ink/60 motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10">
              {SCHOOLS.map((s) => (
                <span key={s.id} className="inline-flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.body }} />
                  {s.name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
