import NextAuth, { type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import type { JWT } from 'next-auth/jwt'
import type { Session } from 'next-auth'

// Import dữ liệu từ nguồn tập trung
import { mockUsers, mockProfiles } from '@/src/data/mockData'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text', placeholder: 'your email' },
        password: { label: 'password', type: 'password', placeholder: 'your password' },
      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Vui lòng nhập đầy đủ thông tin')
        }

        const email = credentials.email.toLowerCase().trim()

        const user = mockUsers.find(
          (u: any) => u.email.toLowerCase() === email
        )

        if (!user) {
          throw new Error('Email không tồn tại')
        }

        // 🔑 so sánh password hash
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          throw new Error('Sai mật khẩu')
        }

        const profile = mockProfiles[user.id] || {}

        return {
          id: user.id,
          name: profile.fullName || user.email.split('@')[0],
          email: user.email,
          role: user.role,
          shopStatus: user.shopStatus,
          phone: profile.phone || '',
          address: profile.address || '',
          image: profile.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {

    async jwt({ token, user }: { token: JWT; user?: any }) {

      if (user) {
        token.id = user.id
        token.role = user.role
        token.shopStatus = user.shopStatus
        token.phone = user.phone
        token.address = user.address
      }

      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {

      if (session.user) {
        (session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).shopStatus = token.shopStatus
        ;(session.user as any).phone = token.phone
        ;(session.user as any).address = token.address
      }

      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }