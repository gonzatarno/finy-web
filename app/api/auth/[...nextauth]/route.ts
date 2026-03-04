import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import { createClient } from "@supabase/supabase-js"

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET
const nextAuthSecret = process.env.NEXTAUTH_SECRET || "finy-development-secret-change-in-production-min-32-chars"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const isGoogleConfigured = clientId && clientSecret && clientId.length > 0 && clientSecret.length > 0

if (!isGoogleConfigured && process.env.NODE_ENV === "development") {
  console.warn(
    "[NextAuth] Google OAuth not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your environment variables.",
  )
}

// Initialize Supabase client for service role operations
const supabase = supabaseUrl && supabaseServiceRoleKey ? 
  createClient(supabaseUrl, supabaseServiceRoleKey) : 
  null

export const authOptions: NextAuthOptions = {
  providers: isGoogleConfigured
    ? [
        GoogleProvider({
          clientId: clientId!,
          clientSecret: clientSecret!,
        }),
      ]
    : [],
  secret: nextAuthSecret,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // Add email from token
        session.user.email = token.email as string
        
        // Try to get user ID from Supabase
        if (supabase && token.email) {
          try {
            const { data: user, error } = await supabase
              .from("users")
              .select("id")
              .eq("email", token.email as string)
              .single()
            
            if (!error && user) {
              ;(session.user as any).id = user.id
            } else if (error) {
              console.log("[NextAuth] User not found in Supabase, using email as fallback ID:", token.email)
              // Use email as fallback ID
              ;(session.user as any).id = token.email
            }
          } catch (err) {
            console.error("[NextAuth] Error fetching user from Supabase:", err)
            // Use email as fallback
            ;(session.user as any).id = token.email
          }
        } else {
          // Fallback: use email as ID if Supabase not available
          ;(session.user as any).id = token.email
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.email = profile.email
      }
      return token
    },
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
