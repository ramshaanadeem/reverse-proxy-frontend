import type { ConfigType } from "./types"

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Get the auth token from localStorage
const getToken = () => localStorage.getItem("token")

export async function fetchConfig(): Promise<ConfigType> {
  await delay(600) // Simulate network delay

  // Mock config data
  return {
    loggingEnabled: true,
    whitelistedEndpoints: ["https://api.example.com", "https://api.trusted-partner.com", "https://cdn.example.com"],
  }
}

export async function updateConfig(config: ConfigType): Promise<ConfigType> {
  await delay(800) // Simulate network delay

  // In a real app, this would send a PUT request to the API
  console.log("Updating config:", config)

  return config
}
