import { useState, useEffect } from 'react'
import { ContentProvider } from './contexts/ContentContext'
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
import Footer from './components/Footer'
import AboutPage from './pages/About'
import ServicesPage from './pages/Services'
import ProjectPage from './pages/Project'
import BlogDetailsPage from './pages/BlogDetails'
import ContactPage from './pages/Contact'
import ProductPage from './pages/Product'
import BlogPage from './pages/Blog'
import AdminPage from './pages/Admin'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // Handle URL-based routing
  useEffect(() => {
    const updatePageFromURL = () => {
      const path = window.location.pathname
      if (path === '/admin') {
        setCurrentPage('admin')
      } else if (path === '/about') {
        setCurrentPage('about')
      } else if (path === '/services') {
        setCurrentPage('services')
      } else if (path === '/project') {
        setCurrentPage('project')
      } else if (path === '/contact') {
        setCurrentPage('contact')
      } else if (path === '/product') {
        setCurrentPage('product')
      } else if (path === '/blog-details') {
        setCurrentPage('blog-details')
      } else {
        setCurrentPage('home')
      }
    }

    // Initial load
    updatePageFromURL()

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', updatePageFromURL)

    return () => {
      window.removeEventListener('popstate', updatePageFromURL)
    }
  }, [])

  const handleNavigation = (page) => {
    // Update URL without page reload (preserve query string if present in page)
    const [base, query] = page.split('?')
    setCurrentPage(base)
    const newPath = base === 'home' ? '/' : `/${base}`
    const newURL = query ? `${newPath}?${query}` : newPath
    window.history.pushState({}, '', newURL)
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
      case 'blog':
        return <BlogPage onNavigate={handleNavigation} />
      case 'admin':
        return <AdminPage />
      case 'home':
      default:
        return (
          <main>
            <Hero onNavigate={handleNavigation} />
            <Statistics />
            <About onNavigate={handleNavigation} />
            <WhyChooseUs />
            <Services />
            <WorkProcess />
            <TeamMembers />
            <FAQ />
            <RequestQuote />
            <Testimonials />
            <LatestBlog onNavigate={handleNavigation} />
          </main>
        )
    }
  }

  return (
    <ContentProvider>
      {currentPage !== 'admin' && <Navbar onNavigate={handleNavigation} currentPage={currentPage} />}
      {renderPage()}
      {currentPage !== 'admin' && <Footer />}
    </ContentProvider>
  )
}
