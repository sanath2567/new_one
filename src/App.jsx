import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import UserSignup from './pages/UserSignup'
import AdminSignup from './pages/AdminSignup'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import SuperAdminPanel from './pages/SuperAdminPanel'
import ProtectedRoute from './components/ProtectedRoute'
import Debug from './pages/Debug'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<UserSignup />} />
                        <Route path="admin-signup" element={<AdminSignup />} />

                        {/* Protected Routes - STRICT ROLE SEPARATION */}
                        {/* User Dashboard - ONLY for USER role */}
                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['USER']}>
                                    <UserDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Dashboard - ONLY for ADMIN role */}
                        <Route
                            path="admin"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Super Admin Panel - ONLY for SUPER_ADMIN role */}
                        <Route
                            path="super-admin"
                            element={
                                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                                    <SuperAdminPanel />
                                </ProtectedRoute>
                            }
                        />

                        {/* Debug page - shows current user object */}
                        <Route path="debug" element={<Debug />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
