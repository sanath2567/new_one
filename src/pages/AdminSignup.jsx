import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, MapPin, Shield, AlertCircle } from 'lucide-react'

const AdminSignup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [region, setRegion] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signup } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            return setError('Passwords do not match')
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters')
        }

        if (!region) {
            return setError('Please select your region')
        }

        setLoading(true)

        try {
            await signup(email, password, 'ADMIN', region)
            navigate('/admin')
        } catch (err) {
            console.error('Admin signup error:', err)
            // Handle specific Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists.')
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address.')
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Please use a stronger password.')
            } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
                setError('Authentication not enabled. Please enable "Email/Password" in Firebase Console.')
            } else {
                setError(`Failed to create account: ${err.message} (${err.code})`)
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
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold gradient-text mb-2">Admin Registration</h2>
                    <p className="text-gray-600">For law enforcement personnel only</p>
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
                            Official Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="officer@police.gov"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Region/State
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                required
                            >
                                <option value="">Select your region</option>
                                <option value="karnataka">Karnataka</option>
                                <option value="maharashtra">Maharashtra</option>
                                <option value="tamil nadu">Tamil Nadu</option>
                                <option value="west bengal">West Bengal</option>
                                <option value="telangana">Telangana</option>
                                <option value="gujarat">Gujarat</option>
                                <option value="madhya pradesh">Madhya Pradesh</option>
                                <option value="uttar pradesh">Uttar Pradesh</option>
                            </select>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? 'Creating Account...' : 'Register as Admin'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                            Sign in
                        </a>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default AdminSignup
