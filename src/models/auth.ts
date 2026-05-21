import { AccountData } from "../models/account";

export interface AuthResponse extends AccountData {
  success: boolean;
  token?: string;
  user?: AccountData;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest extends LoginRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  nik?: number;
  phone?: number;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}