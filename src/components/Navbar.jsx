import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, LogOut, BarChart3, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="glass-card sticky top-0 z-50 mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Shield className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-bold gradient-text hidden md:block">
                            Crime Rate 
                        </span>
                        <span className="text-xl font-bold gradient-text md:hidden">
                            Crime Analysis
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
                            About
                        </Link>
                        <Link to="/pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Pricing
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                            Contact
                        </Link>

                        {user ? (
                            <>
                                {/* USER role - show only Dashboard */}
                                {user.role === 'USER' && (
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                )}

                                {/* ADMIN role - show only Admin Panel */}
                                {user.role === 'ADMIN' && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        <Shield className="w-4 h-4" />
                                        <span>Admin Panel</span>
                                    </Link>
                                )}

                                {/* SUPER_ADMIN role - show only Super Admin */}
                                {user.role === 'SUPER_ADMIN' && (
                                    <Link
                                        to="/super-admin"
                                        className="flex items-center space-x-1 text-purple-700 hover:text-purple-800 transition-colors font-semibold"
                                    >
                                        <Shield className="w-4 h-4" />
                                        <span>Super Admin</span>
                                    </Link>
                                )}

                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                                        <User className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-600">{user.displayName}</span>
                                        <span className="text-xs text-gray-500">({user.role})</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn-primary">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-3">
                        <Link
                            to="/"
                            className="block text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className="block text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            to="/pricing"
                            className="block text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            to="/contact"
                            className="block text-gray-700 hover:text-blue-600 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Contact
                        </Link>

                        {user ? (
                            <>
                                {/* USER role - show only Dashboard */}
                                {user.role === 'USER' && (
                                    <Link
                                        to="/dashboard"
                                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                )}

                                {/* ADMIN role - show only Admin Panel */}
                                {user.role === 'ADMIN' && (
                                    <Link
                                        to="/admin"
                                        className="block text-gray-700 hover:text-blue-600 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Admin Panel
                                    </Link>
                                )}

                                {/* SUPER_ADMIN role - show only Super Admin */}
                                {user.role === 'SUPER_ADMIN' && (
                                    <Link
                                        to="/super-admin"
                                        className="block text-purple-700 hover:text-purple-800 transition-colors font-semibold"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Super Admin
                                    </Link>
                                )}

                                <div className="pt-2 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {user.displayName} ({user.role})
                                    </p>
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setMobileMenuOpen(false)
                                        }}
                                        className="block w-full text-left text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block text-gray-700 hover:text-blue-600 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block text-blue-600 font-semibold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
