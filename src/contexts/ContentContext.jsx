import { createContext, useContext, useState, useEffect } from 'react'
import { pageContentAPI } from '../api/client.js'

const ContentContext = createContext()

export const useContent = () => {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)

  const loadPageContent = async (pageName) => {
    try {
      console.log(`Loading content for page: ${pageName}`)
      const result = await pageContentAPI.get(pageName)
      console.log(`Page content result for ${pageName}:`, result)
      if (result.success) {
        return result.data.sections || {}
      }
      return {}
    } catch (error) {
      console.error(`Error loading ${pageName} content:`, error)
      return {}
    }
  }

  const loadAllContent = async () => {
    setLoading(true)
    try {
      const [homeContent, aboutContent, servicesContent, contactContent, productsContent, projectsContent] = await Promise.all([
        loadPageContent('home'),
        loadPageContent('about'),
        loadPageContent('services'),
        loadPageContent('contact'),
        loadPageContent('products'),
        loadPageContent('projects')
      ])

      setContent({
        home: homeContent,
        about: aboutContent,
        services: servicesContent,
        contact: contactContent,
        products: productsContent,
        projects: projectsContent
      })
    } catch (error) {
      console.error('Error loading content:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllContent()
    
    // Listen for content refresh events from admin panel
    const handleContentRefresh = () => {
      loadAllContent()
    }
    
    window.addEventListener('contentRefresh', handleContentRefresh)
    
    return () => {
      window.removeEventListener('contentRefresh', handleContentRefresh)
    }
  }, [])

  const refreshContent = () => {
    loadAllContent()
  }

  const value = {
    content,
    loading,
    refreshContent,
    loadPageContent
  }

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}
