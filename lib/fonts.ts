import { Poppins, Geist_Mono, Source_Serif_4 } from "next/font/google"

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
})

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-serif",
})
