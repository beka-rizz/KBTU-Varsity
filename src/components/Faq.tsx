const STEPS = [
  { n: '01', t: 'Выбери и забронируй', d: 'Школа и размер — в корзине, задаток 10 000 ₸.' },
  { n: '02', t: 'Примерь в кампусе', d: 'Образцы размеров привозим в КБТУ (Толе би 59) каждый вторник и четверг.' },
  { n: '03', t: 'Партия в пошив', d: 'Заказы закрываем 25-го числа каждого месяца, куртки шьём 3 недели.' },
  { n: '04', t: 'Забери', d: 'На кампусной точке или доставкой Яндекса по Алматы.' },
]

const QA = [
  {
    q: 'Как выбрать размер?',
    a: 'Крой унисекс и чуть свободный, как на образце. Если в худи носишь M — бери M. Обхват груди (см): XS 104 · S 108 · M 112 · L 116 · XL 120 · XXL 126. Примерка в кампусе бесплатная.',
  },
  {
    q: 'Можно сменить школу после заказа?',
    a: 'Да, до закрытия партии (25-е число). После этого шевроны для твоей куртки уже изготовлены.',
  },
  {
    q: 'Именная вышивка возвращается?',
    a: 'Куртку с именем можно обменять по размеру, но не вернуть. Без имени — возврат в течение 14 дней, если не носили.',
  },
  {
    q: 'Это официальный мерч КБТУ?',
    a: 'КБТУ Варсити — студенческий проект и не связан с администрацией университета. Названия школ нужны, чтобы отличать расцветки.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="cv-auto scroll-mt-16 border-t border-line bg-cream/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">04 — Предзаказ</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-5xl">Как это работает</h2>
            <ol className="mt-8 space-y-6">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span
                    className="school-transition grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm text-[var(--school-ink)]"
                    style={{ background: 'var(--school)' }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <p className="font-bold">{s.t}</p>
                    <p className="mt-1 text-sm text-ink/65">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Вопросы</h3>
            <div className="divide-y divide-line rounded-3xl border border-line bg-paper">
              {QA.map((item) => (
                <details key={item.q} className="group px-5 py-4 open:bg-cream/50">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-lg leading-none transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
