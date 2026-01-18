import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, BarChart3, Users, Lock, TrendingUp, MapPin, Filter, Brain, Database, Zap } from 'lucide-react'

const Home = () => {
    const features = [
        {
            icon: Filter,
            title: 'Dynamic Filtering',
            description: 'Advanced filtering by state, city, crime type, month, and year for precise, actionable insights',
            color: 'blue'
        },
        {
            icon: BarChart3,
            title: 'Interactive Dashboards',
            description: 'Real-time visualizations with interactive charts, graphs, and comprehensive crime analytics',
            color: 'green'
        },
        {
            icon: Shield,
            title: 'Secure Role Access',
            description: 'Role-based authentication with Firebase ensuring data security and privacy protection',
            color: 'purple'
        },
        {
            icon: TrendingUp,
            title: 'Trend Analysis',
            description: 'Identify patterns and trends across time, location, and crime types with ML-powered insights',
            color: 'red'
        },
        {
            icon: MapPin,
            title: 'Geographic Insights',
            description: 'State and city-level crime distribution analysis with hotspot identification',
            color: 'orange'
        },
        {
            icon: Brain,
            title: 'AI-Powered Insights',
            description: 'Machine learning algorithms to predict crime patterns and provide intelligent recommendations',
            color: 'indigo'
        },
        {
            icon: Database,
            title: 'Comprehensive Data',
            description: 'Access to 1M+ crime records across multiple states with historical data spanning years',
            color: 'cyan'
        },
        {
            icon: Zap,
            title: 'Real-Time Updates',
            description: 'Instant dashboard updates as you apply filters, with no page reloads required',
            color: 'yellow'
        }
    ]

    const benefits = [
        {
            title: 'For Researchers',
            description: 'Access comprehensive crime data for academic research and policy analysis',
            icon: Users
        },
        {
            title: 'For Law Enforcement',
            description: 'Advanced analytics to identify crime hotspots and optimize resource allocation',
            icon: Shield
        },
        {
            title: 'For Public Safety',
            description: 'Empower communities with data-driven insights for enhanced safety awareness',
            icon: Lock
        }
    ]

    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        red: 'from-red-500 to-red-600',
        orange: 'from-orange-500 to-orange-600',
        indigo: 'from-indigo-500 to-indigo-600',
        cyan: 'from-cyan-500 to-cyan-600',
        yellow: 'from-yellow-500 to-yellow-600',
    }

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
            >
                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-8">
                    <Shield className="w-16 h-16 text-blue-600" />
                </div>
                <h1 className="text-5xl font-bold gradient-text mb-6">
                    Crime Rate Analysis And Public Safety
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                    Empowering communities and law enforcement with data-driven insights
                    to understand, analyze, and prevent crime through advanced analytics
                </p>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
                    Transform raw crime data into actionable intelligence with our comprehensive
                    platform featuring dynamic filtering, interactive dashboards, and AI-powered insights
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/pricing" className="btn-primary">
                        View Plans
                    </Link>
                    <Link to="/signup" className="btn-secondary">
                        Sign Up Free
                    </Link>
                    <Link to="/login" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all">
                        Login
                    </Link>
                </div>
            </motion.section>

            {/* Stats Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                <div className="glass-card p-8 text-center">
                    <h3 className="text-4xl font-bold text-blue-600 mb-2">1M+</h3>
                    <p className="text-gray-600">Crime Records Analyzed</p>
                </div>
                <div className="glass-card p-8 text-center">
                    <h3 className="text-4xl font-bold text-green-600 mb-2">9</h3>
                    <p className="text-gray-600">States Covered</p>
                </div>
                <div className="glass-card p-8 text-center">
                    <h3 className="text-4xl font-bold text-purple-600 mb-2">3</h3>
                    <p className="text-gray-600">Years of Data</p>
                </div>
            </motion.section>

            {/* Benefits Section */}
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold gradient-text mb-4">
                        Who Benefits from CrimeWatch?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our platform serves diverse stakeholders with tailored insights for their specific needs
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            className="glass-card p-6 text-center"
                        >
                            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
                                <benefit.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold gradient-text mb-4">
                        Powerful Features
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Everything you need to understand crime patterns and make informed decisions
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            className="glass-card p-6 relative overflow-hidden group"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[feature.color]} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />

                            <div className="relative">
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[feature.color]} mb-4`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="glass-card p-12 bg-gradient-to-r from-blue-50 to-indigo-50"
            >
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold gradient-text mb-6">
                        Our Mission
                    </h2>
                    <p className="text-lg text-gray-700 mb-4">
                        At CrimeWatch Analytics, we believe that data-driven insights are key to creating safer communities.
                        Our mission is to democratize access to crime analytics, empowering everyone from researchers to
                        law enforcement agencies with the tools they need to understand and address crime effectively.
                    </p>
                    <p className="text-gray-600">
                        Through advanced filtering, interactive visualizations, and AI-powered insights, we transform
                        complex crime data into actionable intelligence that drives real-world impact.
                    </p>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="glass-card p-12 text-center relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5" />
                <div className="relative">
                    <h2 className="text-3xl font-bold gradient-text mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of users and law enforcement agencies using CrimeWatch
                        to make data-driven decisions. Start with a free trial today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/pricing" className="btn-primary">
                            View Pricing
                        </Link>
                        <Link to="/signup" className="btn-secondary">
                            Create Account
                        </Link>
                        <Link to="/contact" className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </motion.section>
        </div>
    )
}

export default Home
