'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { getSession } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Đăng nhập';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login('credentials', { email, password });

      const session = await getSession();

      if (session?.user) {
        const role = (session.user as any).role;

        if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch {
      setError('Email hoặc mật khẩu không chính xác.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    login('google');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-2xl font-bold">
          Đăng nhập
        </h1>

        {/* Email */}
        <label className="mb-1 block text-sm text-gray-700">
          Email
        </label>
        <input
          type="email"
          className="mb-4 w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label className="mb-1 block text-sm text-gray-700">
          Mật khẩu
        </label>
        <input
          type="password"
          className="mb-4 w-full rounded-lg border border-gray-300 p-2.5 focus:border-blue-500 focus:outline-none"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="mb-4 text-center text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3 text-gray-500">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-sm">hoặc</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-2.5 font-medium hover:bg-gray-50"
        >
          <FaGoogle className="text-red-500" />
          Tiếp tục với Google
        </button>

        {/* Signup */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">
            Chưa có tài khoản?
          </span>
          <Link
            href="/auth/signup"
            className="ml-2 font-semibold text-blue-600 hover:underline"
          >
            Đăng ký
          </Link>
        </div>

        {/* Home */}
        <Link
          href="/"
          className="mt-3 block text-center text-sm text-blue-600 hover:underline"
        >
          Trang chủ
        </Link>
      </form>
    </div>
  );
}