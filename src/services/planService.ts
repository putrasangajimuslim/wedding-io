import axios from 'axios';
import Cookies from 'js-cookie'; // Pastikan nama library cookie Anda sesuai
import { decryptData } from '../lib/crypto'; // Sesuaikan path fungsi dekripsi Anda
import { TaskData } from '@/models/task';

// 1. Konfigurasi Base URL Backend Go
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// 2. Axios Request Interceptor (Otomatis Menyisipkan Token Terdekripsi)
apiClient.interceptors.request.use(
  (config) => {
    // Ambil cookie terenkripsi "auth"
    const encryptedAuth = Cookies.get("auth");
    
    // Set default header
    config.headers['Content-Type'] = 'application/json';

    if (encryptedAuth) {
      try {
        // Dekripsi data cookie untuk mendapatkan token asli
        const decryptedData = decryptData(encryptedAuth);
        const token = decryptedData?.token; // Ambil properti token

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Gagal mendekripsi token auth pada Interceptor:", error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interface Pendukung
export interface PaginationMeta {
  current_page: number;
  limit: number;
  total_pages: number;
  total_rows: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
}

export interface GetPlanParams {
  page?: number;
  limit?: number;
  search?: string;
}

// 4. Implementasi Plan Service Eksternal
export const PlanService = {
  /**
   * Mengambil data tugas/plan dengan dukungan Server-Side Pagination dan Search
   */
  async getPlanList(params: GetPlanParams): Promise<ApiResponse<TaskData[]>> {
    try {
      const response = await apiClient.get<ApiResponse<TaskData[]>>('/plan/list', {
        params: {
          page: params.page || 1,
          limit: params.limit || 5,
          search: params.search || '',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error di PlanService.getPlanList:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Gagal mengambil daftar rencana.',
        data: [],
      };
    }
  },

  /**
   * Mengambil satu data rencana spesifik berdasarkan ID
   */
  async getPlanById(id: number): Promise<ApiResponse<TaskData>> {
    try {
      const response = await apiClient.get<ApiResponse<TaskData>>(`/plans/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error di PlanService.getPlanById (${id}):`, error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Gagal mengambil data rencana.',
      };
    }
  },

  /**
   * Membuat rencana/tugas baru
   */
  async createPlan(data: TaskData): Promise<ApiResponse<TaskData>> {
    try {
      const response = await apiClient.post<ApiResponse<TaskData>>('/plans', data);
      return response.data;
    } catch (error: any) {
      console.error('Error di PlanService.createPlan:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Gagal membuat rencana baru.',
      };
    }
  },

  /**
   * Memperbarui seluruh data rencana berdasarkan ID
   */
  async updatePlan(id: number, data: TaskData): Promise<ApiResponse<TaskData>> {
    try {
      const response = await apiClient.put<ApiResponse<TaskData>>(`/plans/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Error di PlanService.updatePlan (${id}):`, error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Gagal memperbarui rencana.',
      };
    }
  },

  /**
   * Memperbarui status tugas (Pending / Completed) - PATCH
   */
  async updatePlanStatus(id: number, status: string): Promise<ApiResponse<TaskData>> {
    try {
      const response = await apiClient.patch<ApiResponse<TaskData>>(`/plans/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error(`Error di PlanService.updatePlanStatus (${id}):`, error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Gagal memperbarui status rencana.',
      };
    }
  },

  /**
   * Menghapus satu data rencana
   */
  async deletePlan(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.delete<ApiResponse<null>>(`/plans/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error di PlanService.deletePlan (${id}):`, error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Gagal menghapus rencana.',
      };
    }
  },

  /**
   * Menghapus banyak data rencana sekaligus (Bulk Delete)
   */
  async deleteBulkPlans(ids: number[]): Promise<ApiResponse<null>> {
    try {
      const response = await apiClient.post<ApiResponse<null>>('/plans/bulk-delete', { ids });
      return response.data;
    } catch (error: any) {
      console.error('Error di PlanService.deleteBulkPlans:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Gagal menghapus beberapa rencana.',
      };
    }
  }
};