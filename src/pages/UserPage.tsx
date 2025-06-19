"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Alert, AlertDescription } from "../components/ui/alert"
import {
  Search,
  RefreshCw,
  Users,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react"
import { fetchAllUsers } from "../lib/api"
import { useToast } from "../hooks/use-toast"
import { ExtendedUserType } from "@/lib/types"


export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<ExtendedUserType[]>([])
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof ExtendedUserType>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch users from API
      const data = await fetchAllUsers()

      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load user data. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = [...users]
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (userData) =>
          userData.name.toLowerCase().includes(query) ||
          userData.email.toLowerCase().includes(query) ||
          userData.username?.toLowerCase().includes(query) ||
          userData.phone?.toLowerCase().includes(query) ||
          userData.id.toString().toLowerCase().includes(query),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue === undefined || bValue === undefined) return 0

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return sortDirection === "asc" ? comparison : -comparison
    })

    setFilteredUsers(filtered)
  }, [users, searchQuery, sortField, sortDirection])

  const handleRefresh = async () => {
    await loadUsers()
    toast({
      title: "Success",
      description: "Users refreshed successfully",
    })
  }

  const handleSort = (field: keyof ExtendedUserType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }


  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8" />
            <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8" />
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredUsers.length !== users.length && `${filteredUsers.length} filtered`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Comprehensive view of all users with detailed information and management capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, username, phone, or ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("id")}>
                        ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                        Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("username")}>
                        Username {sortField === "username" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("email")}>
                        Email {sortField === "email" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Company</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((userData) => (
                        <TableRow key={userData.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{userData.id}</TableCell>
                          <TableCell className="font-medium">{userData.name}</TableCell>
                          <TableCell className="font-mono text-sm">@{userData.username}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[200px]">{userData.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-sm">{userData.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[150px] truncate text-sm">{userData.company?.name}</div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} className="h-24 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-8 w-8 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                No users found.
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
