// services/auth-service.ts

import { authManager } from '@/lib/auth-manager';
import { encryptData } from '@/lib/crypto';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/models/auth';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:4000/api';

export const authService = {
  /**
   * Fungsi Login dengan Type Safety
   */
  login: async (loginData: LoginRequest): Promise<AuthResponse> => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });
    const data = await res.json();

    if (data.success) {
      const fiveHours = 5 / 24; // js-cookie menggunakan satuan hari (5 jam = 5/24 hari)
      // encrypt data user
      const encryptedUser =
        encryptData({
          id: data.user?.id,
          token: data.token,
          role: data.user?.role,
          email: data.user?.email,
        });

      Cookies.set(
        "auth",
        encryptedUser,
        {
          expires: fiveHours,
          path: "/",
        }
      );
    }
    return data;
  },

  // checkSession: async () => {
  //   const token = Cookies.get('Token');
  //   const res = await fetch(`${API_BASE_URL}/auth/check-session`, {
  //     method: 'GET',
  //     headers: { 
  //       'Authorization': `Bearer ${token}`, // Kirim via Header
  //       'Content-Type': 'application/json' 
  //     }
  //   });
  //   return await res.json();
  // },

  /**
   * Fungsi Register dengan Type Safety
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      // Ganti URL dengan endpoint API Golang Anda
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Melemparkan error agar ditangkap oleh blok catch
        throw new Error(data.error || 'Registrasi Gagal');
      }

      return {
        success: true,
        message: data.message,
        // data lain jika diperlukan
      };
    } catch (error: any) {
      console.error("Auth Service Error:", error.message);
      throw error; // Lempar error agar ditangkap UI untuk menampilkan pesan error
    }
  },

  logout: (): void => {
    authManager.removeToken();
    window.location.href = '/login';
  }
};