import { useAuth } from '../context/AuthContext'
import { AlertCircle, Clock, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const TrialBanner = () => {
    const { user } = useAuth()

    // Only show for USER role
    if (!user || user.role !== 'USER') return null

    // Hide completely for premium override users
    if (user.premiumOverride) return null

    // If user has active subscription, show subscription status
    if (user.subscriptionStatus === 'active') {
        const expiryDate = user.subscriptionExpiryDate ? new Date(user.subscriptionExpiryDate) : null
        if (!expiryDate || expiryDate > new Date()) {
            return (
                <div className="glass-card p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                                <Zap className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-800">Active Subscription</h3>
                                <p className="text-sm text-green-700">
                                    Your {user.subscriptionPlan} plan is active until {expiryDate?.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    // Show trial information - using trialsRemaining
    const trialsRemaining = user.trialsRemaining || 0
    const trialExpiryDate = user.trialExpiryDate ? new Date(user.trialExpiryDate) : null
    const now = new Date()
    const daysRemaining = trialExpiryDate
        ? Math.max(0, Math.ceil((trialExpiryDate - now) / (1000 * 60 * 60 * 24)))
        : 7

    // Determine banner color based on remaining trials
    const isLow = trialsRemaining <= 1 || daysRemaining <= 2
    const bgColor = isLow ? 'from-orange-50 to-red-50' : 'from-blue-50 to-indigo-50'
    const borderColor = isLow ? 'border-orange-500' : 'border-blue-500'
    const iconBg = isLow ? 'bg-orange-100' : 'bg-blue-100'
    const iconColor = isLow ? 'text-orange-600' : 'text-blue-600'
    const textColor = isLow ? 'text-orange-800' : 'text-blue-800'
    const subtextColor = isLow ? 'text-orange-700' : 'text-blue-700'

    return (
        <div className={`glass-card p-4 mb-6 bg-gradient-to-r ${bgColor} border-l-4 ${borderColor}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 ${iconBg} rounded-full`}>
                        <AlertCircle className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                        <h3 className={`font-semibold ${textColor}`}>
                            {user.subscriptionStatus === 'trial' ? 'Free Trial Active' : 'Start Your Free Trial'}
                        </h3>
                        <div className={`text-sm ${subtextColor} flex items-center gap-4 mt-1`}>
                            <span className="flex items-center gap-1">
                                <Zap className="w-4 h-4" />
                                {trialsRemaining}/3 State filter trials remaining
                            </span>
                            {user.subscriptionStatus === 'trial' && (
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <Link
                    to="/pricing"
                    className={`px-4 py-2 ${isLow ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-medium transition-colors`}
                >
                    Upgrade Now
                </Link>
            </div>
        </div>
    )
}

export default TrialBanner
