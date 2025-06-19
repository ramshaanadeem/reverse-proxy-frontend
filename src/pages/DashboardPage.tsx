"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Activity, Users, FileText, LogOut } from "lucide-react"
import { fetchDashboardStats } from "../lib/api"
import { useToast } from "../hooks/use-toast"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user) {
        try {
          const statsResponse = await fetchDashboardStats();
          setDashboardStats(statsResponse.overview)
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
          toast({
            title: "Error",
            description: "Failed to load dashboard data",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadDashboardData()
  }, [user, toast])


  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Welcome back, {user?.username}</span>
          <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.totalRequests || 0}</div>
            {/* <p className="text-xs text-muted-foreground">
              {dashboardStats?.userGrowth > 0 ? "+" : ""}
              {dashboardStats?.userGrowth || 0}% from last month
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.avgResponseTime || 0}</div>
            {/* <p className="text-xs text-muted-foreground">
              {dashboardStats?.sessionGrowth > 0 ? "+" : ""}
              {dashboardStats?.sessionGrowth || 0}% from last hour
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats?.successfulRequests || 0}</div>
            {/* <p className="text-xs text-muted-foreground">
              {dashboardStats?.logGrowth > 0 ? "+" : ""}
              {dashboardStats?.logGrowth || 0}% from yesterday
            </p> */}
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuration</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.role === "admin" ? "Admin" : "User"}</div>
            <p className="text-xs text-muted-foreground">Role-based access</p>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role</p>
                  <p className="capitalize">{user?.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p>{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )) || <p className="text-sm text-muted-foreground">No recent activity</p>}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}


