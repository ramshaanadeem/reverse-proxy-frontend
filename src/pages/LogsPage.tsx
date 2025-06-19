"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { Search, Filter, RefreshCw } from "lucide-react"
import { fetchLogs } from "../lib/api"
import { useToast } from "../hooks/use-toast"
import type { LogEntry } from "../lib/types"

export default function LogsPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setIsLoading(true)
    try {
      const data = await fetchLogs()
      setLogs(data.logs)
      setFilteredLogs(data.logs)
    } catch (error) {
      console.error("Error fetching logs:", error)
      toast({
        title: "Error",
        description: "Failed to load logs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = logs

    // // Apply level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter((log) => {
        const status = log.statusCode
  
        if (levelFilter === "info") return status >= 100 && status < 300
        if (levelFilter === "warning") return status >= 300 && status < 400
        if (levelFilter === "debug") return status >= 400 && status < 500
        if (levelFilter === "error") return status >= 500 && status < 600
  
        return status.toString() === levelFilter
      })
    }

    // // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
  
      filtered = filtered.filter((log) => {
        const methodMatch = log.method?.toLowerCase().includes(query)
        const urlMatch = log.url?.toLowerCase().includes(query)
        const timestampMatch = new Date(log.timestamp).toLocaleString().toLowerCase().includes(query)
  
        return methodMatch || urlMatch || timestampMatch
      })
    }
  
    setFilteredLogs(filtered)
  }, [logs, searchQuery, levelFilter])

  const handleRefresh = async () => {
    await loadLogs()
    toast({
      title: "Success",
      description: "Logs refreshed successfully",
    })
  }

  const getLevelBadge = (statusCode: number) => {
    if (statusCode >= 500) {
      return <Badge variant="destructive">{statusCode}</Badge> // Server errors
    }
  
    if (statusCode >= 400) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          {statusCode}
        </Badge>
      ) // Client errors
    }
  
    if (statusCode >= 300) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          {statusCode}
        </Badge>
      ) // Redirects
    }
  
    if (statusCode >= 200) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          {statusCode}
        </Badge>
      ) // Success
    }
  
    return <Badge variant="outline">{statusCode}</Badge>
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Logs</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>View and filter system logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="mt-6 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Level</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-[180px]">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{getLevelBadge(log.statusCode)}</TableCell>
                        <TableCell className="font-medium">{log.method}</TableCell>
                        <TableCell>{log.url}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No logs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
