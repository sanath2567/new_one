import { motion } from 'framer-motion'

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        red: 'from-red-500 to-red-600',
        green: 'from-green-500 to-green-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
        indigo: 'from-indigo-500 to-indigo-600',
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card p-6 relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -mr-16 -mt-16`} />

            <div className="relative">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                        {subtitle && (
                            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                        )}
                        {trend && (
                            <p className={`text-sm mt-2 ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last period
                            </p>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default StatCard
