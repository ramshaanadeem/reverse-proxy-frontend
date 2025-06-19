class ApiClient {
  private baseURL = "http://localhost:5000"
  private navigateFunction: ((path: string) => void) | null = null

  setNavigateFunction(navigate: (path: string) => void) {
    this.navigateFunction = navigate
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem("token")
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      // Check if token is expired
      const tokenExpiry = localStorage.getItem("tokenExpiry")
      if (tokenExpiry && new Date(tokenExpiry) <= new Date()) {
        // Token is expired, try to refresh
        const refreshed = await this.refreshToken()
        if (refreshed) {
          const newToken = localStorage.getItem("token")
          if (newToken) {
            headers.Authorization = `Bearer ${newToken}`
          }
        } else {
          // Refresh failed, redirect to login
          this.handleAuthError()
          throw new Error("Authentication failed")
        }
      } else {
        headers.Authorization = `Bearer ${token}`
      }
    }

    return headers
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("refreshToken")

      if (!refreshToken) {
        return false
      }

      const response = await fetch(`${this.baseURL}/api/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()

      // Update stored tokens
      localStorage.setItem("token", data.token)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("tokenExpiry", data.expiresAt)

      return true
    } catch (error) {
      console.error("Token refresh error:", error)
      return false
    }
  }

  private handleAuthError() {
    // Clear auth data
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("tokenExpiry")

    // Redirect to login if router is available
    if (this.navigateFunction) {
      this.navigateFunction("/login")
    } else {
      // Fallback for when navigate function isn't set
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
  }

  async get(endpoint: string): Promise<any> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers,
      })

      if (response.status === 401) {
        // Try to refresh token once
        const refreshed = await this.refreshToken()
        if (refreshed) {
          const newHeaders = await this.getAuthHeaders()
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            method: "GET",
            headers: newHeaders,
          })

          if (retryResponse.status === 401) {
            this.handleAuthError()
            throw new Error("Authentication failed")
          }

          return await retryResponse.json()
        } else {
          this.handleAuthError()
          throw new Error("Authentication failed")
        }
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error)
      throw error
    }
  }

  async post(endpoint: string, data?: any): Promise<any> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      })

      if (response.status === 401) {
        // Try to refresh token once
        const refreshed = await this.refreshToken()
        if (refreshed) {
          const newHeaders = await this.getAuthHeaders()
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            method: "POST",
            headers: newHeaders,
            body: JSON.stringify(data),
          })

          if (retryResponse.status === 401) {
            this.handleAuthError()
            throw new Error("Authentication failed")
          }

          return await retryResponse.json()
        } else {
          this.handleAuthError()
          throw new Error("Authentication failed")
        }
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error)
      throw error
    }
  }

  async put(endpoint: string, data: any): Promise<any> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      })

      if (response.status === 401) {
        // Try to refresh token once
        const refreshed = await this.refreshToken()
        if (refreshed) {
          const newHeaders = await this.getAuthHeaders()
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            method: "PUT",
            headers: newHeaders,
            body: JSON.stringify(data),
          })

          if (retryResponse.status === 401) {
            this.handleAuthError()
            throw new Error("Authentication failed")
          }

          return await retryResponse.json()
        } else {
          this.handleAuthError()
          throw new Error("Authentication failed")
        }
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error)
      throw error
    }
  }

  async delete(endpoint: string): Promise<any> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers,
      })

      if (response.status === 401) {
        // Try to refresh token once
        const refreshed = await this.refreshToken()
        if (refreshed) {
          const newHeaders = await this.getAuthHeaders()
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            method: "DELETE",
            headers: newHeaders,
          })

          if (retryResponse.status === 401) {
            this.handleAuthError()
            throw new Error("Authentication failed")
          }

          return await retryResponse.json()
        } else {
          this.handleAuthError()
          throw new Error("Authentication failed")
        }
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error)
      throw error
    }
  }
}

export const apiClient = new ApiClient()
