"use client"

import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { DashboardSidebar } from "../components/dashboard/sidebar"
import { apiClient } from "../lib/api-client"

export default function DashboardLayout() {

  useEffect(() => {
    // Set navigation function for API client to handle auth redirects
    apiClient.setNavigateFunction((path: string) => {
      window.location.href = path
    })
  }, [])

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
