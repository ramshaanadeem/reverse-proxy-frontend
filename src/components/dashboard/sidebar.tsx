"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../lib/auth-context"
import { Button } from "../ui/button"
import { LayoutDashboard, FileText, Settings, User, Menu } from "lucide-react"
import { useState } from "react"

export function DashboardSidebar() {
  const location = useLocation()
  const { user } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Logs",
      href: "/dashboard/logs",
      icon: FileText,
    },
    // ...(user?.role === "admin"
      //  [
          {
            title: "Configuration",
            href: "/dashboard/config",
            icon: Settings,
          },
        // ]
      // : []),
      {
        title: "Users",
        href: "/dashboard/users",
        icon: User,
      },
  ]

  return (
    <div className={`flex h-screen flex-col border-r bg-muted/40 ${isCollapsed ? "w-16" : "w-64"} transition-all`}>
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="text-xl">Admin</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={`${isCollapsed ? "mx-auto" : "ml-auto"}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        {!isCollapsed && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-muted p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.username}</span>
              {/* <span className="text-xs text-muted-foreground capitalize">{user?.role}</span> */}
            </div>
          </div>
        )}
        {/* <Button
          variant="outline"
          className={`${isCollapsed ? "w-8 h-8 p-0" : "w-full justify-start"}`}
          onClick={logout}
        > */}
          {/* <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>} */}
        {/* </Button> */}
      </div>
    </div>
  )
}
