// src/components/api/restaurantAPI.ts

import { DashboardData, ApiResponse, Reservasi } from '../types/index'; // Path disesuaikan

// Define constants for token and base URL
const API_TOKEN = 'Gpotbiq8ZYrT1GcQ4hNvuOCDFuifAS2BBnout6so7463063e';
const BASE_API_URL = 'http://127.0.0.1:8000';

export class RestaurantAPI {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorData = { message: 'Unknown error' };
      try {
        errorData = await response.json();
      } catch (e) {
        errorData.message = response.statusText;
      }
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
    }

    return response.json();
  }

  async getDashboard(): Promise<DashboardData> {
    const response: ApiResponse = await this.request('/api/penyedia/dashboard');
    const data = response.data;

    if (typeof data.status === 'number') {
        data.status = data.status === 1 ? 'buka' : 'tutup';
    }
    return data as DashboardData;
  }

  async updateOperasional(restoranId: string, data: { status?: number, jam_buka?: string, jam_tutup?: string }) {
    return this.request(`/api/penyedia/dashboard/${restoranId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async konfirmasiReservasi(id: string) {
    return this.request(`/api/penyedia/reservasi/konfirmasi/${id}`, {
      method: 'PUT',
    });
  }

  async batalkanReservasi(id: string) {
    return this.request(`/api/penyedia/reservasi/batalkan/${id}`, {
      method: 'PUT',
    });
  }

  async getAllReservations(): Promise<Reservasi[]> {
      const response: ApiResponse = await this.request('/api/penyedia/reservasi');
      return response.data as Reservasi[];
  }
}

export const restaurantApi = new RestaurantAPI(BASE_API_URL, API_TOKEN);