import NextAuth, { type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/src/lib/mongodb'
import { User } from '@/src/models/Users' // Đảm bảo import đúng model MongoDB
import { Profile } from '@/src/models/Profile' // Đảm bảo import đúng model MongoDB


export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Vui lòng nhập đầy đủ thông tin')
        }

        // 1. Kết nối DB
        await connectDB()

        // 2. Tìm User trong MongoDB
        const user = await User.findOne({ 
          email: credentials.email.toLowerCase().trim() 
        }).lean()

        if (!user) {
          throw new Error('Email không tồn tại')
        }

        // 3. So sánh mật khẩu
        // Nếu trong file Seed bạn để password là "123" (chưa hash), hãy dùng:
        // const isValidPassword = credentials.password === user.password;
        
        // Nếu đã dùng bcrypt trong Seed, hãy dùng:
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          throw new Error('Sai mật khẩu')
        }

        // 4. Lấy Profile từ MongoDB
        const profile = await Profile.findOne({ userId: user._id }).lean()

        return {
          id: user._id.toString(),
          name: profile?.fullName || user.email.split('@')[0],
          email: user.email,
          role: user.role,
          shopStatus: user.shopStatus,
          phone: profile?.phone || '',
          image: profile?.avatar || `https://i.pravatar.cc/150?u=${user._id}`,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.shopStatus = user.shopStatus
      }
      // Hỗ trợ cập nhật session nhanh khi update profile
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      return token
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.shopStatus = token.shopStatus
      }
      return session
    },
  },

  pages: {
    signIn: '/auth/signin',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }