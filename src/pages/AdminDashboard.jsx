import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
    Shield, Clock, CheckCircle, XCircle, AlertTriangle,
    TrendingUp, Users, MapPin, Activity, FileText, Filter
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import FilterPanel from '../components/FilterPanel'
import {
    getTotalCrimes,
    getCaseStatusDistribution,
    getArrestStats,
    getResponseTimeStats,
    getAverageResponseTime,
    getCrimeHotspots,
    getPoliceStationPerformance,
    getRepeatOffenderStats,
    getVictimGenderDistribution,
    getOffenderAgeDistribution,
    getCrimesByType,
    getCrimesBySeverity,
    getCrimesByState
} from '../utils/dataUtils'

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

const AdminDashboard = () => {
    const { user, hasAccess, refreshUserData } = useAuth()
    const [accessDenied, setAccessDenied] = useState(false)
    const [denialReason, setDenialReason] = useState(null)
    const [filters, setFilters] = useState({
        state: 'all',
        city: 'all',
        crime_type: 'all',
        month: 'all',
        year: 'all'
    })

    // Check admin access on mount and refresh data
    useEffect(() => {
        if (user) {
            refreshUserData().then(() => {
                const accessStatus = hasAccess()
                if (!accessStatus.valid) {
                    setAccessDenied(true)
                    setDenialReason(accessStatus.reason)
                }
            })
        }
    }, [user])

    // If access is denied, show restriction message
    if (accessDenied) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 max-w-md text-center"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access Restricted</h2>
                    <p className="text-gray-600 mb-6">
                        {denialReason === 'admin_disabled'
                            ? 'Your admin access is restricted. Please contact Super Admin for approval.'
                            : 'Your admin access has been disabled. Please contact Super Admin for assistance.'}
                    </p>
                    <div className="space-y-3">
                        <Link
                            to="/contact"
                            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Contact Support
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    // Get filtered data
    const totalCrimes = getTotalCrimes(filters)
    const caseStatus = getCaseStatusDistribution(filters)
    const arrestStats = getArrestStats(filters)
    const responseTimeStats = getResponseTimeStats(filters)
    const avgResponseTime = getAverageResponseTime(filters)
    const crimeHotspots = getCrimeHotspots(filters)
    const policeStations = getPoliceStationPerformance(filters)
    const repeatOffenders = getRepeatOffenderStats(filters)
    const victimGender = getVictimGenderDistribution(filters)
    const offenderAge = getOffenderAgeDistribution(filters)
    const crimesByType = getCrimesByType(filters).slice(0, 10)
    const crimesBySeverity = getCrimesBySeverity(filters)

    // Calculate closure rate
    const closedCases = caseStatus.find(s => s.name === 'closed')?.value || 0
    const closureRate = totalCrimes > 0 ? ((closedCases / totalCrimes) * 100).toFixed(1) : 0

    // Calculate arrest rate
    const arrested = arrestStats.find(s => s.name === 'Arrested')?.value || 0
    const arrestRate = totalCrimes > 0 ? ((arrested / totalCrimes) * 100).toFixed(1) : 0

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-4xl font-bold gradient-text mb-2">Admin Control Panel</h1>
                <p className="text-gray-600">Advanced analytics and case management</p>
            </motion.div>

            {/* Filter Panel */}
            <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                showCityFilter={true}
                multiSelectState={false}
            />

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={FileText}
                    title="Total Cases"
                    value={totalCrimes.toLocaleString()}
                    subtitle="Filtered cases"
                    color="blue"
                />
                <StatCard
                    icon={CheckCircle}
                    title="Closure Rate"
                    value={`${closureRate}%`}
                    subtitle={`${closedCases.toLocaleString()} cases closed`}
                    color="green"
                />
                <StatCard
                    icon={Shield}
                    title="Arrest Rate"
                    value={`${arrestRate}%`}
                    subtitle={`${arrested.toLocaleString()} arrests made`}
                    color="purple"
                />
                <StatCard
                    icon={Clock}
                    title="Avg Response Time"
                    value={`${avgResponseTime} min`}
                    subtitle="Average police response"
                    color="orange"
                />
            </div>

            {/* Case Management Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Case Status Distribution">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={caseStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {caseStatus.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.name === 'closed' ? '#10b981' : '#f59e0b'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Arrest Statistics">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={arrestStats}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {arrestStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Response Time Distribution">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={responseTimeStats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Crime Hotspots and Severity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Crime Hotspot Analysis">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={crimeHotspots}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent, value }) => `${name}: ${value.toLocaleString()} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {crimeHotspots.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.name.includes('Hotspot') ? '#ef4444' : '#10b981'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Crime Severity Breakdown">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={crimesBySeverity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {crimesBySeverity.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.name === 'high' ? '#ef4444' : entry.name === 'medium' ? '#f59e0b' : '#10b981'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Offender Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Repeat Offender Statistics">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={repeatOffenders}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {repeatOffenders.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.name.includes('Repeat') ? '#ef4444' : '#10b981'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Victim Gender Distribution">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={victimGender}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="value" fill="#ec4899" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Offender Age Groups">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={offenderAge}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Police Station Performance Table */}
            <ChartCard title="Top 10 Police Stations - Performance Metrics">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Station</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Cases</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Closure Rate</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Arrest Rate</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Response (min)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policeStations.map((station, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                >
                                    <td className="py-3 px-4 font-medium text-gray-800">{station.station}</td>
                                    <td className="text-right py-3 px-4 text-gray-600">{station.total.toLocaleString()}</td>
                                    <td className="text-right py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${parseFloat(station.closureRate) >= 50 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {station.closureRate}%
                                        </span>
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${parseFloat(station.arrestRate) >= 40 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {station.arrestRate}%
                                        </span>
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${parseFloat(station.avgResponseTime) <= 20 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {station.avgResponseTime}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartCard>

            {/* Crime Type Analysis */}
            <ChartCard title="Top 10 Crime Types - Detailed Analysis">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={crimesByType} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" />
                        <YAxis dataKey="name" type="category" width={150} stroke="#6b7280" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    )
}

export default AdminDashboard
