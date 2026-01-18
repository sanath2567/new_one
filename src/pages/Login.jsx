import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, AlertCircle } from 'lucide-react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const userCredential = await login(email, password)

            // Redirect based on role after login completes
            // Need to wait a moment for user state to update
            setTimeout(() => {
                // Get user from auth context after login
                const loggedInUser = userCredential

                // Redirect to appropriate dashboard based on role
                if (email.toLowerCase() === 'superadmin@crimewatch.com') {
                    navigate('/super-admin')
                } else {
                    // For now, default to dashboard, will be enhanced when user object is available
                    navigate('/dashboard')
                }
            }, 100)
        } catch (err) {
            console.error('Login error:', err)
            // Handle specific Firebase errors
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email.')
            } else if (err.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.')
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address.')
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.')
            } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
                setError('Authentication not enabled. Please enable "Email/Password" in Firebase Console.')
            } else {
                setError(`Failed to login: ${err.message} (${err.code})`)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h2>
                    <p className="text-gray-600">Sign in to access your dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Sign up
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
