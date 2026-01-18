import { motion } from 'framer-motion'

const ChartCard = ({ title, children, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`glass-card p-6 ${className}`}
        >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="w-full">
                {children}
            </div>
        </motion.div>
    )
}

export default ChartCard
