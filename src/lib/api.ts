// API functions using the authenticated API client
import { apiClient } from "./api-client"
import type { UserType, ConfigType, Logs, ExtendedUserType } from "./types"

export async function fetchUserData(userId: string): Promise<UserType> {
  return await apiClient.get(`/api/users/${userId}`)
}

export async function fetchAllUsers(): Promise<ExtendedUserType[]> {
  return await apiClient.get("/api/users")
}

export async function fetchLogs(): Promise<Logs> {
  return await apiClient.get("/api/logs")
}

export async function fetchConfig(): Promise<ConfigType> {
  return await apiClient.get("/api/config")
}

export async function updateConfig(config: ConfigType): Promise<ConfigType> {
  return await apiClient.put("/api/config", config)
}

export async function fetchDashboardStats(): Promise<any> {
  return await apiClient.get("/api/logs/stats")
}

export async function logoutUser(): Promise<void> {
  return await apiClient.post("/api/auth/logout")
}

export async function createUser(userData: {
  name: string
  username: string
  email: string
  phone: string
  company: string
  address: {
    street: string
    city: string
    zipcode: string
    country: string
  }
}): Promise<UserType> {
  return await apiClient.post("/api/users", userData)
}