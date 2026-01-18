import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { motion } from 'framer-motion'

const Layout = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
            >
                <Outlet />
            </motion.main>
            <footer className="mt-20 py-8 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
                    <p>&copy; 2024 CrimeWatch Analytics. All rights reserved.</p>
                    <p className="text-sm mt-2">Empowering communities through data-driven insights</p>
                </div>
            </footer>
        </div>
    )
}

export default Layout
