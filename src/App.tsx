import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./lib/auth-context"
import { ThemeProvider } from "./components/theme-provider"
import { Toaster } from "./components/ui/toaster"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardLayout from "./layouts/DashboardLayout"
import DashboardPage from "./pages/DashboardPage"
import LogsPage from "./pages/LogsPage"
import ConfigPage from "./pages/ConfigPage"
import ProtectedRoute from "./components/ProtectedRoute"
import UsersPage from "./pages/UserPage"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="config" element={<ConfigPage />} />
              <Route path="users" element={<UsersPage />} />

            </Route>
          </Routes>
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
