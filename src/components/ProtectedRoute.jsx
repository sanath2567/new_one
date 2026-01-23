import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, hasAccess, refreshUserData } = useAuth()
    const navigate = useNavigate()

    // Force permission refresh on mount to prevent stale permissions
    useEffect(() => {
        const checkAccess = async () => {
            if (user) {
                await refreshUserData()
            }
        }
        checkAccess()
    }, [user?.uid]) // Re-run when user ID changes

    // Check authentication
    if (!user) {
        return <Navigate to="/login" replace />
    }

    // CRITICAL: Check access permissions FIRST (before role check)
    // This ensures disabled admins can't bypass access control
    const accessStatus = hasAccess()

    if (!accessStatus.valid) {
        // Handle different denial reasons
        if (accessStatus.reason === 'trials_exhausted') {
            // USER with exhausted trials - redirect to pricing
            return <Navigate to="/pricing" replace />
        }

        if (accessStatus.reason === 'admin_disabled') {
            // ADMIN with access disabled
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="glass-card p-8 max-w-md text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-orange-600 mb-4">Admin Access Restricted</h2>
                        <p className="text-gray-600 mb-6">
                            Your admin access is currently disabled. Please contact Super Admin for approval or purchase a subscription.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => navigate('/pricing')}
                                className="btn-primary"
                            >
                                View Plans
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        // Generic access denied
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="glass-card p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this resource.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        )
    }

    // NOW check if user's role is allowed for this route
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="glass-card p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page. This dashboard is restricted to {allowedRoles.join(', ')} users only.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn-primary"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return children
}

export default ProtectedRoute
