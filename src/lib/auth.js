import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import connectDB from "./db"
import User from "@/models/User"

const client = new MongoClient(process.env.MONGODB_URI)
const clientPromise = client.connect()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  pages: {
    signIn:   "/auth",
    error:    "/auth",
    signOut:  "/",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id    = token.id
        session.user.email = token.email
        session.user.name  = token.name
        session.user.image = token.picture
      }
      return session
    },

  },
  trustHost: true,
})
