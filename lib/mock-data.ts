export interface Transaction {
  id: string
  date: string
  type: "INGRESOS" | "EGRESOS"
  category: string
  amount: number
  method: string
  description: string
}

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15 14:32",
    type: "EGRESOS",
    category: "Supermercado",
    amount: 124.5,
    method: "Visa",
    description: "Compra Walmart",
  },
  {
    id: "2",
    date: "2024-01-15 09:15",
    type: "INGRESOS",
    category: "Otros",
    amount: 2500.0,
    method: "Transferencia",
    description: "Salario Enero",
  },
  {
    id: "3",
    date: "2024-01-14 18:45",
    type: "EGRESOS",
    category: "Ocio",
    amount: 45.0,
    method: "Efectivo",
    description: "Cine - Entradas",
  },
  {
    id: "4",
    date: "2024-01-14 12:20",
    type: "EGRESOS",
    category: "Servicios",
    amount: 89.99,
    method: "Débito",
    description: "Internet Fibra",
  },
  {
    id: "5",
    date: "2024-01-13 16:30",
    type: "EGRESOS",
    category: "Transporte",
    amount: 50.0,
    method: "Efectivo",
    description: "Gasolina",
  },
  {
    id: "6",
    date: "2024-01-13 11:00",
    type: "EGRESOS",
    category: "Supermercado",
    amount: 67.8,
    method: "Visa",
    description: "Mercado Local",
  },
  {
    id: "7",
    date: "2024-01-12 19:15",
    type: "EGRESOS",
    category: "Ocio",
    amount: 120.0,
    method: "Visa",
    description: "Restaurante - Cena",
  },
  {
    id: "8",
    date: "2024-01-12 08:30",
    type: "EGRESOS",
    category: "Otros",
    amount: 25.0,
    method: "Efectivo",
    description: "Farmacia",
  },
  {
    id: "9",
    date: "2024-01-11 15:45",
    type: "INGRESOS",
    category: "Otros",
    amount: 150.0,
    method: "Transferencia",
    description: "Venta Online",
  },
  {
    id: "10",
    date: "2024-01-11 10:20",
    type: "EGRESOS",
    category: "Servicios",
    amount: 35.0,
    method: "Visa",
    description: "Spotify Premium",
  },
  {
    id: "11",
    date: "2024-01-10 17:00",
    type: "EGRESOS",
    category: "Supermercado",
    amount: 98.45,
    method: "Débito",
    description: "Supermercado Express",
  },
  {
    id: "12",
    date: "2024-01-10 13:30",
    type: "EGRESOS",
    category: "Transporte",
    amount: 15.0,
    method: "Efectivo",
    description: "Uber",
  },
]
