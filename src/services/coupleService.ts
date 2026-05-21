// services/coupleService.ts
import { Agenda, FinalWedding } from '../models/wedding';
import { decryptData } from '../lib/crypto';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:4000/api';

// Menambahkan anotasi tipe data ': Record<string, string>' agar dikenali dengan baik oleh fetch headers
const getAuthHeader = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 1. Ambil cookie terenkripsi "auth"
  const encryptedAuth = Cookies.get("auth");
  
  if (!encryptedAuth) {
    return headers;
  }

  try {
    // 2. Dekripsi data cookie untuk mendapatkan token asli
    const decryptedData = decryptData(encryptedAuth);
    const token = decryptedData?.token; // Ambil properti token

    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Kirim token asli ke backend Go
    }
    
    return headers;
  } catch (error) {
    console.error("Gagal mendeskripsi token auth:", error);
    return headers;
  }
};

// Service khusus Agenda
export const CoupleService = {
  async getCouple() {
    try {
      const response = await fetch(`${API_BASE_URL}/couple/me`, {
        method: 'GET',
        headers: getAuthHeader(), // Sekarang tipe data sudah match dan aman
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching agendas:", error);
      throw error;
    }
  },
};