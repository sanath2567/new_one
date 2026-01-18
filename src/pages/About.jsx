import { motion } from 'framer-motion'
import { Database, Target, Users, Shield, BookOpen, TrendingUp, Lock, Filter, CheckCircle } from 'lucide-react'

const About = () => {
    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    About Us
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Empowering communities and law enforcement with data-driven insights for safer neighborhoods
                </p>
            </motion.div>

            {/* Mission Statement */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    We are dedicated to making crime data accessible, understandable, and actionable for everyone. Our platform transforms complex crime statistics into clear visualizations that help communities, researchers, and law enforcement make informed decisions about public safety.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    By democratizing access to crime analytics, we aim to create safer communities through evidence-based decision-making, proactive prevention strategies, and transparent communication between citizens and authorities.
                </p>
            </motion.div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Database className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Comprehensive Data</h3>
                    </div>
                    <p className="text-gray-600">
                        Access to over 1 million crime records from official sources including police departments and government databases. All data is verified, anonymized, and continuously updated to ensure accuracy and privacy.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Target className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Advanced Analytics</h3>
                    </div>
                    <p className="text-gray-600">
                        Statistical analysis and machine learning algorithms identify crime patterns, predict trends, and highlight areas requiring intervention. Our visualizations make complex data accessible to all stakeholders.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Filter className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Dynamic Filtering</h3>
                    </div>
                    <p className="text-gray-600">
                        Filter crime data by state, city, crime type, month, and year. Our real-time filtering engine processes millions of records instantly, updating all charts and visualizations without page reloads.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <Shield className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">Privacy & Security</h3>
                    </div>
                    <p className="text-gray-600">
                        All personal information is anonymized. We implement role-based access control and comply with data protection regulations. Our infrastructure provides enterprise-grade security with encrypted storage.
                    </p>
                </motion.div>
            </div>

            {/* Who We Serve */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Who We Serve</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Researchers & Academics</h3>
                            <p className="text-gray-600 text-sm">
                                Study crime patterns, conduct statistical analysis, and develop evidence-based research on criminology and public safety.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Community Organizations</h3>
                            <p className="text-gray-600 text-sm">
                                Understand local safety trends, identify high-risk areas, and make informed decisions about community safety initiatives.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Policymakers</h3>
                            <p className="text-gray-600 text-sm">
                                Evaluate crime prevention programs, allocate resources efficiently, and develop data-driven policies for public safety.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Shield className="w-5 h-5 text-orange-600" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Law Enforcement</h3>
                            <p className="text-gray-600 text-sm">
                                Identify crime hotspots, optimize patrol routes, improve response times, and enhance community protection strategies.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Impact Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-card p-8 bg-gradient-to-r from-blue-50 to-indigo-50"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
                        <p className="text-gray-700 font-medium">Crime Records Analyzed</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">9</div>
                        <p className="text-gray-700 font-medium">States Covered</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
                        <p className="text-gray-700 font-medium">Police Stations Connected</p>
                    </div>
                </div>
            </motion.div>

            {/* Commitment */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="glass-card p-8 text-center"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Commitment to Excellence</h2>
                <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    We are committed to continuous improvement, regularly updating our platform with new features and expanded data coverage. Our team works tirelessly to ensure this remains the most comprehensive and user-friendly crime analytics platform available, helping create safer communities through the power of data.
                </p>
            </motion.div>
        </div>
    )
}

export default About
