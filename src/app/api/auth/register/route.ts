import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Import dữ liệu giả lập
import { mockUsers, addUser } from '@/src/data/mockData'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let { email, password } = body

    // 1️⃣ Validate
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ email và mật khẩu.' },
        { status: 400 }
      )
    }

    email = email.toLowerCase().trim()

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự.' },
        { status: 400 }
      )
    }

    // 2️⃣ Check email tồn tại
    const isExisted = mockUsers.find((u: any) => u.email === email)

    if (isExisted) {
      return NextResponse.json(
        { error: 'Email này đã được sử dụng.' },
        { status: 400 }
      )
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4️⃣ Tạo userId
    const newUserId = `USR-${Math.floor(1000 + Math.random() * 9000)}`

    // 5️⃣ Tạo user
    const newUser = {
      id: newUserId,
      email: email,
      password: hashedPassword,
      role: 'customer' as const,
      shopStatus: 'none' as const,
    }

    const newProfile = {
      fullName: '',
      nickname: '',
      dob_day: '1',
      dob_month: '1',
      dob_year: '2000',
      gender: 'other',
      nationality: 'VN',
      phone: '',
      avatar: '',
    }

    addUser(newUser, newProfile)

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công!',
      data: {
        userId: newUserId,
        email: email,
      },
    })
  } catch (error) {
    console.error('Registration Error:', error)

    return NextResponse.json(
      { error: 'Đã có lỗi xảy ra trong quá trình đăng ký.' },
      { status: 500 }
    )
  }
}