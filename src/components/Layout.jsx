import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { motion } from 'framer-motion'

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
                <Outlet />
            </motion.main>

            {/* Modern Two-Tone Footer */}
            <footer className="mt-auto">
                {/* Dark Section */}
                <div className="bg-gradient-to-br bg-blue-50 border-t border-blue-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Brand & Tagline */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-600 mb-3">
                                    CrimeWatch Analytics
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                                    Empowering communities through data-driven insights.
                                    Building safer neighborhoods with advanced analytics and real-time crime data.
                                </p>
                            </div>

                            {/* Quick Navigation */}
                            <div className="grid grid-cols-2 gap-4 md:justify-self-end">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Platform</h4>
                                    <div className="space-y-2">
                                        <a href="/" className="block text-sm text-gray-900 hover:text-blue-500 transition-colors">Home</a>
                                        <a href="/about" className="block text-sm text-gray-600 hover:text-blue-500 transition-colors">About</a>
                                        <a href="/pricing" className="block text-sm text-gray-800 hover:text-blue-500 transition-colors">Pricing</a>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Support</h4>
                                    <div className="space-y-2">
                                        <a href="/contact" className="block text-sm text-gray-600 hover:text-blue-500 transition-colors">Contact</a>
                                        <a href="#" className="block text-sm text-gray-600 hover:text-blue-500 transition-colors">Help Center</a>
                                        <a href="#" className="block text-sm text-gray-600 hover:text-blue-500 transition-colors">FAQ</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Light Bottom Bar */}
                <div className="bg-blue-50 border-t border-blue-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                            <p className="text-sm text-gray-600">
                                &copy; 2026 CrimeWatch Analytics. All rights reserved.
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                                <span className="text-gray-300">•</span>
                                <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                                <span className="text-gray-300">•</span>
                                <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Layout
