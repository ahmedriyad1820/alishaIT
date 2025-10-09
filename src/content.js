const STORAGE_KEY = 'alisha_site_content_v1'

export const defaultContent = {
  hero: {
    headline: 'Modern IT Solutions, Delivered.',
    subhead: 'We design, build and scale reliable digital systems for your business.',
    slider: {
      intervalMs: 30000,
      images: [
        '/public/vite.svg',
        '/public/logo.png'
      ]
    }
  },
  services: [
    { title: 'Web Apps', desc: 'High-performance SPA/SSR solutions tailored for growth.' },
    { title: 'Cloud & DevOps', desc: 'CI/CD, observability, and scalable infrastructure.' },
    { title: 'Mobile & PWA', desc: 'Cross-platform experiences with native feel.' },
    { title: 'UI/UX Design', desc: 'Accessible, delightful interfaces that convert.' }
  ]
}

export function getContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultContent
    const parsed = JSON.parse(raw)
    return { ...defaultContent, ...parsed, hero: { ...defaultContent.hero, ...(parsed.hero || {}) } }
  } catch {
    return defaultContent
  }
}

export function saveContent(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return true
  } catch {
    return false
  }
}

export const defaultProducts = [
  { title: 'AURA CONNECT X1', features: ['Ultra-High Bandwidth','Global Mesh Network','AI Optimization'], price: 1499 },
]


