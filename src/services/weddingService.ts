// services/weddingService.ts
import { Agenda, FinalWedding } from '../models/wedding';
import { decryptData } from '../lib/crypto';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:4000/api';

// Menambahkan anotasi tipe data ': Record<string, string>' agar dikenali oleh HeadersInit bawaan fetch
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
export const AgendaService = {
  async getAgendas() {
    try {
      const response = await fetch(`${API_BASE_URL}/agenda/list`, {
        method: 'GET',
        headers: getAuthHeader(), // Menggunakan helper decrypt cookie "auth" sebelumnya
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Gagal mengambil data');
      return result; // mengembalikan { success: true, data: [...] }
    } catch (error) {
      console.error("Error fetching agendas:", error);
      throw error;
    }
  },

  async saveAgenda(data: Agenda) {
    try {
      const response = await fetch(`${API_BASE_URL}/agenda/create`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("Error saving agenda:", error);
      throw error;
    }
  },

  async deleteMultipleAgendas(ids: number[]) {
    try {
      const response = await fetch(`${API_BASE_URL}/agenda/delete-multiple`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ ids: ids }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting multiple agendas:", error);
      throw error;
    }
  }
};

// Service khusus Wedding (Satu Attention/Unit)
export const WeddingService = {
   async saveFinalWedding(data: FinalWedding) {
    try {
      const response = await fetch(`${API_BASE_URL}/wedding/final`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error("Error saving agenda:", error);
      throw error;
    }
  },

  async FinalWeddingMe() {
    try {
      const response = await fetch(`${API_BASE_URL}/wedding/final/me`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error saving agenda:", error);
      throw error;
    }
  },

  deleteFinalWedding: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wedding/delete`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error saving agenda:", error);
      throw error;
    }
  }
};