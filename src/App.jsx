import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Product from './components/Product'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './components/Admin'

export default function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const isAdmin = route === '#admin'

  return (
    <>
      <Navbar />
      <main>
        {isAdmin ? (
          <Admin />
        ) : (
          <>
            <Hero />
            <About />
            <Services />
            <Product />
            <Contact />
            <Testimonials />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
