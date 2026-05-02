// Analytics utility functions for tracking events

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_location: url,
    })
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Specific tracking functions for your landing page
export const trackPlanSelection = (planName: string) => {
  trackEvent("plan_selected", "subscription", planName)
}

export const trackPaymentInitiated = (planName: string, amount: number) => {
  trackEvent("payment_initiated", "subscription", planName, amount)
}

export const trackPaymentCompleted = (planName: string, amount: number) => {
  trackEvent("purchase", "subscription", planName, amount)
}

export const trackTelegramBotClick = (source: string) => {
  trackEvent("telegram_bot_click", "engagement", source)
}

export const trackContactFormSubmit = () => {
  trackEvent("contact_form_submit", "engagement", "contact_form")
}

export const trackQRCodeView = () => {
  trackEvent("qr_code_view", "engagement", "hero_section")
}

export const trackSectionView = (sectionName: string) => {
  trackEvent("section_view", "navigation", sectionName)
}
