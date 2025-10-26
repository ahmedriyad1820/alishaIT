import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Statistics from './components/Statistics'
import About from './components/About'
import WhyChooseUs from './components/WhyChooseUs'
import Services from './components/Services'
import WorkProcess from './components/WorkProcess'
import FAQ from './components/FAQ'
import Testimonials from './components/Testimonials'
import LatestBlog from './components/LatestBlog'
import TeamMembers from './components/TeamMembers'
import RequestQuote from './components/RequestQuote'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AboutPage from './pages/About'
import ServicesPage from './pages/Services'
import ProjectPage from './pages/Project'
import BlogDetailsPage from './pages/BlogDetails'
import ContactPage from './pages/Contact'
import ProductPage from './pages/Product'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const handleNavigation = (page) => {
    setCurrentPage(page)
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />
      case 'services':
        return <ServicesPage onNavigate={handleNavigation} />
      case 'project':
        return <ProjectPage />
      case 'blog-details':
        return <BlogDetailsPage />
      case 'contact':
        return <ContactPage />
      case 'product':
        return <ProductPage />
      case 'home':
      default:
            return (
              <main>
                <Hero onNavigate={handleNavigation} />
                <Statistics />
                <About />
                <WhyChooseUs />
                <Services />
                <WorkProcess />
                <TeamMembers />
                <FAQ />
                <Testimonials />
                <LatestBlog onNavigate={handleNavigation} />
                <RequestQuote />
                <Contact />
              </main>
            )
    }
  }

  return (
    <>
      <Navbar onNavigate={handleNavigation} currentPage={currentPage} />
      {renderPage()}
      <Footer />
    </>
  )
}
