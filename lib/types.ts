export interface DashboardData {
  kpi: {
    local: {
      balance: number
      ingresos: number
      egresos: number
    }
    usd: {
      balance: number
      ingresos: number
      egresos: number
    }
    mes: string
  }
  analytics: {
    totalCurrent: number
    totalPrevious: number
    current: {
      local: number
      usd: number
    }
    previous: {
      local: number
      usd: number
    }
    methods?: {
      name: string
      value: number
      ars?: number
      usd?: number
    }[]
  }
  chartData: {
    name: string
    value: number
    ars?: number
    usd?: number
  }[]
  recentTransactions: {
    id: string
    fecha: string
    titulo: string
    descripcion: string
    monto: number
    tipo: "INGRESOS" | "EGRESOS"
    categoria: string
    metodo: string
    moneda: "PESOS" | "USD"
    installment_number?: number
    installments_total?: number
    parent_id?: string
  }[]
  allTransactions: {
    id: string
    fecha: string
    titulo: string
    descripcion: string
    monto: number
    tipo: "INGRESOS" | "EGRESOS"
    categoria: string
    metodo: string
    moneda: "PESOS" | "USD"
    installment_number?: number
    installments_total?: number
    parent_id?: string
  }[]
  dailySpending: {
    day: number
    amount: number
    ars?: number
    usd?: number
  }[]
}
