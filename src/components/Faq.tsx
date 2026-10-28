const STEPS = [
  { n: '01', t: 'Pick & reserve', d: 'Choose your school and size, pay a 10 000 ₸ deposit in the bag.' },
  { n: '02', t: 'Try it on campus', d: 'We bring sample sizes to KBTU (Tole bi 59) every Tuesday and Thursday.' },
  { n: '03', t: 'Batch production', d: 'Orders close on the 25th of each month; jackets are sewn in 3 weeks.' },
  { n: '04', t: 'Pick up', d: 'Collect at the campus pop-up or get Yandex delivery within Almaty.' },
]

const QA = [
  {
    q: 'How does sizing work?',
    a: 'The cut is unisex and slightly oversized, like the sample. If you usually wear M in a hoodie, take M. Chest (cm): XS 104 · S 108 · M 112 · L 116 · XL 120 · XXL 126. Fitting on campus is free.',
  },
  {
    q: 'Can I change the school after ordering?',
    a: 'Yes, up to the batch closing date (25th). After that the patches are already made for your jacket.',
  },
  {
    q: 'Is the embroidered name refundable?',
    a: 'Personalised jackets can be exchanged for size but not returned. Non-personalised jackets can be returned within 14 days unworn.',
  },
  {
    q: 'Is this an official KBTU product?',
    a: 'KBTU Varsity is a student-run project and is not affiliated with the university administration. School names are used to identify colourways.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="cv-auto scroll-mt-16 border-t border-line bg-cream/40 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">04 — Pre-order</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-5xl">How it works</h2>
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
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Questions</h3>
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
