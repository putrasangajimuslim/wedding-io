// services/coupleService.ts
import { Agenda, FinalWedding } from '../models/wedding';
import { decryptData } from '../lib/crypto';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:4000/api';

const getAuthHeader = () => {
  // 1. Ambil cookie terenkripsi "auth"
  const encryptedAuth = Cookies.get("auth");
  
  if (!encryptedAuth) {
    return { 'Content-Type': 'application/json' };
  }

  try {
    // 2. Dekripsi data cookie untuk mendapatkan token asli
    const decryptedData = decryptData(encryptedAuth);
    const token = decryptedData?.token; // Ambil properti token

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Kirim token asli ke backend Go
    };
  } catch (error) {
    console.error("Gagal mendeskripsi token auth:", error);
    return { 'Content-Type': 'application/json' };
  }
};

// Service khusus Agenda
export const CoupleService = {
  async getCouple() {
    try {
      const response = await fetch(`${API_BASE_URL}/couple/me`, {
        method: 'GET',
        headers: getAuthHeader(), // Menggunakan helper decrypt cookie "auth" sebelumnya
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching agendas:", error);
      throw error;
    }
  },
};