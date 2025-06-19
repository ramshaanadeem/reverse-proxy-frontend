"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import { useToast } from "../hooks/use-toast"
import { fetchConfig, updateConfig } from "../lib/api"
import type { ConfigType } from "../lib/types"
import { Loader2 } from "lucide-react"

export default function ConfigPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [config, setConfig] = useState<ConfigType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [whitelist, setWhitelist] = useState("")
  const { toast } = useToast()

  useEffect(() => {

    const loadConfig = async () => {
      try {
        const data = await fetchConfig()
        setConfig(data)
      } catch (error) {
        console.error("Error fetching config:", error)
        toast({
          title: "Error",
          description: "Failed to load configuration",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [user, navigate, toast])

  const handleSaveConfig = async () => {
    if (!config) return

    setIsSaving(true)
    try {
      // Process whitelist from textarea to array
      const whitelistArray = whitelist
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
      const { __v, _id, ...restConfig } = config;
        
      const updatedConfig = {
        ...restConfig,
        loggingEnabled: config.loggingEnabled,
        whitelistedEndpoints: whitelistArray,
      }

      await updateConfig(updatedConfig)
      toast({
        title: "Success",
        description: "Configuration updated successfully",
      })
    } catch (error) {
      console.error("Error updating config:", error)
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (config) {
      setWhitelist(config.whitelistedEndpoints.join("\n"))
    }
  }, [config])

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
        <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
        <Button onClick={handleSaveConfig} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Manage application settings and configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Logging Settings</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="logging-enabled"
                checked={config?.loggingEnabled || false}
                onCheckedChange={(checked: any) => setConfig((prev) => (prev ? { ...prev, loggingEnabled: checked } : null))}
              />
              <Label htmlFor="logging-enabled">Enable Logging</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, the system will record all actions and events to the logs database.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Caching Settings</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="logging-enabled"
                checked={config?.cacheEnabled || false}
                onCheckedChange={(checked: any) => setConfig((prev) => (prev ? { ...prev, cacheEnabled: checked } : null))}
              />
              <Label htmlFor="logging-enabled">Enable Caching</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, the system will record all actions and events to the logs database.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endpoint Whitelist</h3>
            <p className="text-sm text-muted-foreground">
              Add endpoints that are allowed to access the API (one per line)
            </p>
            <div className="space-y-2">
              <Label htmlFor="whitelist">Whitelisted Endpoints</Label>
              <textarea
                id="whitelist"
                className="h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="https://example.com"
                value={whitelist}
                onChange={(e) => setWhitelist(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handleSaveConfig} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
