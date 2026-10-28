const SPECS = [
  { k: 'Body', v: '70% wool melton, 580 g/m² — warm to −15 °C with the quilted lining' },
  { k: 'Sleeves', v: 'Cream PU leather, wind-proof, wipe-clean' },
  { k: 'Trim', v: 'Two-stripe rib knit collar, cuffs and hem in school colours' },
  { k: 'Letter', v: 'Chenille chest letter with felt backing, school seal on the sleeve' },
  { k: 'Back', v: 'Arched KBTU + school name in tackle-twill, script tagline' },
  { k: 'Hardware', v: 'Nickel snap buttons, two welt pockets, inside phone pocket' },
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
              alt="Front detail of the varsity jacket showing snap buttons and welt pockets"
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
              alt="Back detail with arched lettering"
              className="mt-12 aspect-[4/5] w-full rounded-[28px] object-cover shadow-card ring-1 ring-ink/10"
            />
          </div>
          <p className="mt-4 font-script text-2xl text-ink/60">reference sample — our cut follows the same pattern</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">03 — Craft</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-5xl">Built for an Almaty winter.</h2>
          <p className="mt-4 max-w-lg text-ink/65">
            Varsity jackets were made for cold stadiums. Ours keep the classic silhouette and upgrade what's inside:
            a quilted thermal lining and a wind-proof sleeve so you can wear it from October to March.
          </p>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {SPECS.map((s) => (
              <div key={s.k} className="grid grid-cols-[110px_1fr] gap-4 py-4">
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
