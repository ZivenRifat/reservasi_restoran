const API_BASE_URL = 'http://127.0.0.1:8000/api';
const ADMIN_TOKEN = 'KuPta8XYi8wRRJz17Cggo3IW7m2fXFOic6i0GIZZ4de1e7d9';

// Types
export interface DashboardStats {
  total_pelanggan: number;
  total_restoran: number;
  restoran_baru: {
    id: string;
    email: string;
    restoran: any;
  }[];
  user_baru: {
    nama: string;
    email: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "pelanggan" | "customer" | "restaurant_owner";
  phone?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at?: string;
  last_login?: string;
}

export interface Restaurant {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at?: string;
  owner_name?: string;
}

// Helpers
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

function createRequestOptions(method: string = 'GET', body?: any): RequestInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  };

  return {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };
}

// API Calls

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE_URL}/penyedia/dashboard`, createRequestOptions());
  return await handleApiResponse<DashboardStats>(response);
}

export async function fetchCustomers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.search) query.append('search', params.search);

  const response = await fetch(
    `${API_BASE_URL}/admin/customers${query.toString() ? `?${query.toString()}` : ''}`,
    createRequestOptions()
  );
  return await handleApiResponse(response);
}

export async function fetchRestaurantOwners(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  if (params?.search) query.append('search', params.search);

  const response = await fetch(
    `${API_BASE_URL}/admin/users${query.toString() ? `?${query.toString()}` : ''}`,
    createRequestOptions()
  );
  return await handleApiResponse(response);
}

export async function fetchCustomerById(id: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/admin/customers/${id}`, createRequestOptions());
  return await handleApiResponse<User>(response);
}

export async function fetchRestaurantOwnerById(id: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, createRequestOptions());
  return await handleApiResponse<User>(response);
}

export async function updateUserStatus(id: string, status: 'active' | 'inactive'): Promise<User> {
  const response = await fetch(
    `${API_BASE_URL}/admin/users/${id}/status`,
    createRequestOptions('PUT', { status })
  );
  return await handleApiResponse<User>(response);
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, createRequestOptions('DELETE'));
  await handleApiResponse(response);
}

// Utilities

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return "Baru saja";
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  if (diffInDays === 1) return "1 hari lalu";
  return `${diffInDays} hari lalu`;
}

export function getInitials(name: string): string {
  return name.split(" ").map(w => w.charAt(0)).join("").toUpperCase().slice(0, 2);
}

export function getColorClass(index: number): string {
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-yellow-100 text-yellow-600",
    "bg-red-100 text-red-600",
    "bg-indigo-100 text-indigo-600",
    "bg-pink-100 text-pink-600",
    "bg-teal-100 text-teal-600"
  ];
  return colors[index % colors.length];
}
export async function fetchRecentUsers(limit: number = 5): Promise<User[]> {
  const response = await fetch('http://127.0.0.1:8000/api/admin/pelanggan', {
    headers: {
      Authorization: `Bearer KuPta8XYi8wRRJz17Cggo3IW7m2fXFOic6i0GIZZ4de1e7d9`,
    },
  });

  const result = await response.json();
  return result.data.slice(0, limit);
}
