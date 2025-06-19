"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Alert, AlertDescription } from "../components/ui/alert"
import {
  RefreshCw,
  Users,
  Mail,
  Phone,
  AlertCircle,
  UserPlus,
  MapPin,
  Building,
  Loader2,
} from "lucide-react"
import { createUser, fetchAllUsers } from "../lib/api"
import { useToast } from "../hooks/use-toast"
import { ExtendedUserType, UserFormData } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<ExtendedUserType[]>([])
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<keyof ExtendedUserType>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    username: "",
    email: "",
    phone: "",
    company: "",
    street: "",
    city: "",
    zipcode: "",
    country: "USA",
  })
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({})

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

  const handleSort = (field: keyof ExtendedUserType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Form validation
  const validateForm = (): boolean => {
    const errors: Partial<UserFormData> = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.username.trim()) {
      errors.username = "Username is required"
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    }

    if (!formData.company.trim()) {
      errors.company = "Company is required"
    }

    if (!formData.street.trim()) {
      errors.street = "Street address is required"
    }

    if (!formData.city.trim()) {
      errors.city = "City is required"
    }

    if (!formData.zipcode.trim()) {
      errors.zipcode = "Zipcode is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const userData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          zipcode: formData.zipcode.trim(),
          country: formData.country.trim(),
        },
      }

      await createUser(userData)

      toast({
        title: "Success",
        description: "User created successfully",
      })

      // Reset form and close modal
      setFormData({
        name: "",
        username: "",
        email: "",
        phone: "",
        company: "",
        street: "",
        city: "",
        zipcode: "",
        country: "USA",
      })
      setFormErrors({})
      setIsAddUserOpen(false)

      // Refresh users list
      await loadUsers()
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleRefresh = async () => {
    await loadUsers()
    toast({
      title: "Success",
      description: "Users refreshed successfully",
    })
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

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogTrigger asChild>
        <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
        </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account with the required information below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>

                <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                </div>

                <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                    id="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={formErrors.username ? "border-red-500" : ""}
                />
                {formErrors.username && <p className="text-sm text-red-500">{formErrors.username}</p>}
                </div>

                <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                </div>

                <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
                </div>

            </div>

            {/* Company & Address Information */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Company & Address</h3>

                <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <div className="relative">
                    <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="company"
                    placeholder="Tech Corp"
                    className={`pl-8 ${formErrors.company ? "border-red-500" : ""}`}
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                </div>
                {formErrors.company && <p className="text-sm text-red-500">{formErrors.company}</p>}
                </div>

                <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    id="street"
                    placeholder="123 Main Street"
                    className={`pl-8 ${formErrors.street ? "border-red-500" : ""}`}
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    />
                </div>
                {formErrors.street && <p className="text-sm text-red-500">{formErrors.street}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                    id="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={formErrors.city ? "border-red-500" : ""}
                    />
                    {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="zipcode">Zipcode *</Label>
                    <Input
                    id="zipcode"
                    placeholder="10001"
                    value={formData.zipcode}
                    onChange={(e) => handleInputChange("zipcode", e.target.value)}
                    className={formErrors.zipcode ? "border-red-500" : ""}
                    />
                    {formErrors.zipcode && <p className="text-sm text-red-500">{formErrors.zipcode}</p>}
                </div>
                </div>

                <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="USA">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="UK">United Kingdom</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
            </div>

            <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddUserOpen(false)}
                disabled={isSubmitting}
            >
                Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                </>
                ) : (
                <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create User
                </>
                )}
            </Button>
            </DialogFooter>
        </form>
        </DialogContent>
    </Dialog>

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
          {/* <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, username, phone, or ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div> */}

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
