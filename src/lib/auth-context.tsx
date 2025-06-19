"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import type { UserType } from "./types"
import { logoutUser } from "./api"

interface AuthContextType {
  user: UserType | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("token")
      const storedRefreshToken = localStorage.getItem("refreshToken")

      if (storedUser && storedToken) {
        try {
          // Verify token is still valid by making a test request
          const response = await fetch("http://localhost:5000/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })

          if (response.ok) {
            setUser(JSON.parse(storedUser))
          } else {
            // Token is invalid, try to refresh
            if (storedRefreshToken) {
              const refreshed = await refreshToken()
              if (!refreshed) {
                clearAuthData()
              }
            } else {
              clearAuthData()
            }
          }
        } catch (error) {
          console.error("Auth initialization error:", error)
          clearAuthData()
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const clearAuthData = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("tokenExpiry")
    setUser(null)
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const data = await response.json()

      // Store user data, tokens, and expiry
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("tokenExpiry", data.expiresAt)

      setUser(data.user)
      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }

      const data = await response.json()

      // Store user data, tokens, and expiry
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("tokenExpiry", data.expiresAt)

      setUser(data.user)
      return data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken")

      if (!storedRefreshToken) {
        return false
      }

      const response = await fetch("http://localhost:5000/api/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
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

  const logout = async () => {
    try {
      // Call the logout API to invalidate the token on the server
      await logoutUser()
    } catch (error) {
      // Even if the API call fails, we should still clear local data
      console.error("Logout API error:", error)
    } finally {
      // Always clear local auth data and redirect
      clearAuthData()
      navigate("/login");
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
