import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { SCHOOLS, SCHOOL_BY_ID, type School } from './data/schools'
import { CartProvider } from './store/cart'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Studio } from './components/Studio'
import { SchoolsGrid } from './components/SchoolsGrid'
import { Craft } from './components/Craft'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'

const CartDrawer = lazy(() => import('./components/CartDrawer'))

function readSchoolFromUrl(): School {
  const id = new URLSearchParams(window.location.search).get('school')
  return (id && SCHOOL_BY_ID[id]) || SCHOOLS[0]
}

export default function App() {
  const [school, setSchoolState] = useState<School>(readSchoolFromUrl)

  const setSchool = useCallback((next: School) => {
    setSchoolState(next)
    const url = new URL(window.location.href)
    if (next.id === SCHOOLS[0].id) url.searchParams.delete('school')
    else url.searchParams.set('school', next.id)
    window.history.replaceState(null, '', url)
  }, [])

  // Expose the school colour to CSS so the whole UI re-tints
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--school', school.body)
    root.style.setProperty('--school-ink', school.onBody)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', school.body)
  }, [school])

  const selectAndScroll = useCallback(
    (next: School) => {
      setSchool(next)
      document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    [setSchool],
  )

  const ctx = useMemo(() => ({ school, setSchool, selectAndScroll }), [school, setSchool, selectAndScroll])

  return (
    <CartProvider>
      <Header />
      <main>
        <Hero school={ctx.school} onPick={selectAndScroll} />
        <Studio school={ctx.school} onSelect={setSchool} />
        <SchoolsGrid selected={ctx.school} onSelect={selectAndScroll} />
        <Craft />
        <Faq />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
    </CartProvider>
  )
}
