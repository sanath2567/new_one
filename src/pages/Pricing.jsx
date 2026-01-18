import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X, Shield, Users, TrendingUp, Database, Lock, BarChart3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import DummyPaymentModal from '../components/DummyPaymentModal'

const Pricing = () => {
    const [billingCycle, setBillingCycle] = useState('monthly')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const { user, updateSubscription, refreshUserData } = useAuth()
    const navigate = useNavigate()

    // Redirect Super Admin to their panel
    useEffect(() => {
        if (user?.role === 'SUPER_ADMIN') {
            navigate('/super-admin')
        }
    }, [user, navigate])

    const handlePayment = async (planType, planPrice) => {
        if (!user) {
            navigate('/login')
            return
        }

        // Open dummy payment modal
        setSelectedPlan({
            name: planType,
            price: billingCycle === 'monthly' ? planPrice.monthly : planPrice.yearly,
            duration: billingCycle === 'monthly' ? 1 : 12
        })
        setPaymentModalOpen(true)
    }

    const handlePaymentSuccess = async (plan) => {
        try {
            await updateSubscription(plan.name.toLowerCase(), plan.duration)
            // Refresh user data to sync subscription state
            await refreshUserData()
            alert(`Payment successful! Your ${plan.name} subscription is now active.`)
            navigate('/dashboard')
        } catch (err) {
            console.error('Error updating subscription:', err)
            alert('Payment received but failed to update subscription. Please contact support.')
        }
    }

    const plans = [
        {
            name: 'User Plan',
            icon: Users,
            color: 'blue',
            monthlyPrice: 99,
            yearlyPrice: 999,
            description: 'Perfect for individuals and researchers',
            roleFilter: ['USER', null], // Show for USER and not logged in
            features: [
                'Access to user dashboards',
                'State-wise crime analytics',
                'City-wise filtered views',
                'Read-only analytical insights',
                'Monthly crime trends',
                'Crime type distribution',
                'Geographic analysis',
                'Export basic reports'
            ],
            limitations: [
                'No admin analytics',
                'No data upload',
                'No user management',
                'Limited historical data'
            ],
            trial: {
                available: true,
                description: '3 State filter trials free',
                limitations: 'Limited data range and sample data only'
            },
            signupLink: '/signup',
            popular: false
        },
        {
            name: 'Admin Plan',
            icon: Shield,
            color: 'purple',
            monthlyPrice: 299,
            yearlyPrice: 2999,
            description: 'For law enforcement and organizations',
            roleFilter: ['ADMIN', null], // Show for ADMIN and not logged in
            features: [
                'Full dashboard access',
                'Advanced analytics',
                'User management',
                'Data upload and updates',
                'Real-time monitoring',
                'Advanced filtering',
                'Custom reports',
                'Police station performance',
                'Case management insights',
                'Arrest and response statistics',
                'Priority support',
                'API access'
            ],
            limitations: [],
            trial: {
                available: false,
                description: 'Contact us for demo',
                limitations: ''
            },
            signupLink: '/admin-signup',
            popular: true
        }
    ]

    // Filter plans based on user role
    const visiblePlans = plans.filter(plan => {
        if (!user) return true // Show all plans if not logged in (visitor)
        if (user.role === 'USER') return plan.roleFilter.includes('USER') // USER sees only User plan
        if (user.role === 'ADMIN') return plan.roleFilter.includes('ADMIN') // ADMIN sees only Admin plan
        return false // SUPER_ADMIN sees nothing (redirected above)
    })

    const colorClasses = {
        blue: {
            gradient: 'from-blue-500 to-blue-600',
            bg: 'bg-blue-100',
            text: 'text-blue-600',
            border: 'border-blue-500',
            button: 'bg-blue-600 hover:bg-blue-700'
        },
        purple: {
            gradient: 'from-purple-500 to-purple-600',
            bg: 'bg-purple-100',
            text: 'text-purple-600',
            border: 'border-purple-500',
            button: 'bg-purple-600 hover:bg-purple-700'
        }
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-4xl font-bold gradient-text mb-4">Plans & Pricing</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Choose the perfect plan for your crime analytics needs
                </p>

                {/* Billing Toggle */}
                <div className="inline-flex items-center gap-4 p-1 bg-gray-100 rounded-lg">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-md transition-all ${billingCycle === 'monthly'
                            ? 'bg-white shadow-md text-gray-900 font-semibold'
                            : 'text-gray-600'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-md transition-all ${billingCycle === 'yearly'
                            ? 'bg-white shadow-md text-gray-900 font-semibold'
                            : 'text-gray-600'
                            }`}
                    >
                        Yearly
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Save 17%
                        </span>
                    </button>
                </div>
            </motion.div>

            {/* Error Display */}
            {error && (
                <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                    {error}
                </div>
            )}

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {visiblePlans.map((plan, index) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className={`glass-card p-8 relative ${plan.popular ? 'ring-2 ' + colorClasses[plan.color].border : ''
                            }`}
                    >
                        {plan.popular && (
                            <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r ${colorClasses[plan.color].gradient} text-white text-sm font-semibold rounded-full`}>
                                Most Popular
                            </div>
                        )}

                        {/* Plan Header */}
                        <div className="text-center mb-6">
                            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${colorClasses[plan.color].gradient} mb-4`}>
                                <plan.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                            <p className="text-gray-600">{plan.description}</p>
                        </div>

                        {/* Pricing */}
                        <div className="text-center mb-6">
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-4xl font-bold text-gray-900">
                                    ₹{billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                                </span>
                                <span className="text-gray-600">
                                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                                </span>
                            </div>
                            {billingCycle === 'yearly' && (
                                <p className="text-sm text-green-600 mt-2">
                                    Save ₹{(plan.monthlyPrice * 12) - plan.yearlyPrice} per year
                                </p>
                            )}
                        </div>

                        {/* Free Trial */}
                        {plan.trial.available && (
                            <div className={`${colorClasses[plan.color].bg} rounded-lg p-4 mb-6`}>
                                <p className={`font-semibold ${colorClasses[plan.color].text} mb-1`}>
                                    🎉 Free Trial Available
                                </p>
                                <p className="text-sm text-gray-700">{plan.trial.description}</p>
                                <p className="text-xs text-gray-600 mt-1">{plan.trial.limitations}</p>
                            </div>
                        )}

                        {/* Features */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3">What's included:</h4>
                            <ul className="space-y-2">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Limitations */}
                        {plan.limitations.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-800 mb-3">Not included:</h4>
                                <ul className="space-y-2">
                                    {plan.limitations.map((limitation, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-500">{limitation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* CTA Button */}
                        <button
                            onClick={() => handlePayment(plan.name.split(' ')[0], { monthly: plan.monthlyPrice, yearly: plan.yearlyPrice })}
                            disabled={loading}
                            className={`block w-full text-center px-6 py-3 ${colorClasses[plan.color].button} text-white font-semibold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                        >
                            {loading ? 'Processing...' : 'Get Started'}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Dummy Payment Modal */}
            <DummyPaymentModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                plan={selectedPlan}
                onSuccess={handlePaymentSuccess}
            />

            {/* Features Comparison */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Why Choose CrimeWatch Analytics?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Dynamic Filtering
                        </h3>
                        <p className="text-gray-600">
                            Filter crime data by state, city, type, month, and year for precise insights
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 mb-4">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Interactive Dashboards
                        </h3>
                        <p className="text-gray-600">
                            Real-time visualizations with charts, graphs, and comprehensive analytics
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Secure Role Access
                        </h3>
                        <p className="text-gray-600">
                            Role-based authentication with Firebase ensuring data security
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* FAQ or Contact */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center glass-card p-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Need Help Choosing?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Not sure which plan is right for you? Contact us for a personalized demo
                    and we'll help you find the perfect solution for your needs.
                </p>
                <Link
                    to="/contact"
                    className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                    Contact Us
                </Link>
            </motion.div>
        </div>
    )
}

export default Pricing
