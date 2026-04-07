// next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Mở rộng interface Session để nhận thêm role và shopStatus
   */
  interface Session {
    user: {
      id: string
      role: string
      shopStatus: string
      phone?: string
      address?: string
    } & DefaultSession["user"]
  }

  /**
   * Mở rộng interface User (dùng trong callback authorize)
   */
  interface User {
    id: string
    role: string
    shopStatus: string
    phone?: string
    address?: string
  }
}

declare module "next-auth/jwt" {
  /**
   * Mở rộng interface JWT để lưu trữ thông tin từ database
   */
  interface JWT {
    id: string
    role: string
    shopStatus: string
    phone?: string
    address?: string
  }
}