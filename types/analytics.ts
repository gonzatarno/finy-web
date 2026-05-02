// Type definitions for analytics events

export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export interface PlanSelectionEvent extends AnalyticsEvent {
  action: "plan_selected"
  category: "subscription"
  label: "Finy Basic" | "Finy Plus" | "Finy Pro"
}

export interface PaymentEvent extends AnalyticsEvent {
  action: "payment_initiated" | "purchase"
  category: "subscription"
  label: string
  value: number
}

export interface EngagementEvent extends AnalyticsEvent {
  action: "telegram_bot_click" | "contact_form_submit" | "qr_code_view" | "section_view"
  category: "engagement"
  label: string
}
