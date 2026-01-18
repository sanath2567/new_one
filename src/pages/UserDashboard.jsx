import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
    AlertTriangle, TrendingUp, MapPin, Calendar,
    Shield, Clock, Users, Activity
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import FilterPanel from '../components/FilterPanel'
import TrialBanner from '../components/TrialBanner'
import {
    getTotalCrimes,
    getCrimesByType,
    getCrimesByCategory,
    getCrimesBySeverity,
    getCrimesByState,
    getCrimesByCity,
    getCrimesByAreaType,
    getMonthlyTrends,
    getYearlyTrends,
    getWeatherCorrelation,
    getLocationTypeDistribution,
    getDayOfWeekDistribution,
    getWeekendComparison
} from '../utils/dataUtils'

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

const UserDashboard = () => {
    const { user, updateUserPreferences, decrementTrialCount, hasAccess } = useAuth()
    const [stagedFilters, setStagedFilters] = useState({
        state: 'all',
        city: 'all',
        crime_type: 'all',
        month: 'all',
        year: 'all'
    })
    const [appliedFilters, setAppliedFilters] = useState({
        state: 'all',
        city: 'all',
        crime_type: 'all',
        month: 'all',
        year: 'all'
    })
    const [filterMessage, setFilterMessage] = useState('')

    // Load user's preferred state on mount
    useEffect(() => {
        if (user?.preferences?.preferredState) {
            const preferredState = user.preferences.preferredState
            setStagedFilters(prev => ({
                ...prev,
                state: preferredState
            }))
            setAppliedFilters(prev => ({
                ...prev,
                state: preferredState
            }))
        }
    }, [user])

    // Handle filter changes (staged, not applied yet)
    const handleFilterChange = (newFilters) => {
        setStagedFilters(newFilters)
        setFilterMessage('Click "Apply Filters" to update the dashboard')
    }

    // Apply filters - only decrements trial if State is selected (USER role only)
    const handleApplyFilters = async () => {
        // Check if State filter is selected
        if (stagedFilters.state === 'all') {
            setFilterMessage('⚠️ Please select a State to apply filters')
            return
        }

        // For USER role: check access status and decrement if needed
        if (user?.role === 'USER') {
            const accessStatus = hasAccess()

            // If access is not valid, redirect to pricing
            if (!accessStatus.valid) {
                if (accessStatus.reason === 'trials_exhausted') {
                    window.location.href = '/pricing'
                    return
                }
                setFilterMessage('⚠️ Access denied. Please contact support.')
                return
            }

            // Decrement trial count (only if USER, not subscribed, and State selected)
            try {
                await decrementTrialCount()
            } catch (error) {
                console.error('Error decrementing trial:', error)
            }
        }

        // Apply the filters
        setAppliedFilters(stagedFilters)
        setFilterMessage('✓ Filters applied successfully!')

        // Save preferred state to user profile
        if (stagedFilters.state !== 'all') {
            updateUserPreferences({ preferredState: stagedFilters.state })
        }

        // Clear message after 3 seconds
        setTimeout(() => setFilterMessage(''), 3000)
    }

    // Get filtered data using APPLIED filters
    const totalCrimes = getTotalCrimes(appliedFilters)
    const crimesByType = getCrimesByType(appliedFilters).slice(0, 8)
    const crimesByCategory = getCrimesByCategory(appliedFilters)
    const crimesBySeverity = getCrimesBySeverity(appliedFilters)
    const crimesByState = getCrimesByState(appliedFilters).slice(0, 10)
    const crimesByCity = getCrimesByCity(appliedFilters).slice(0, 8)
    const crimesByAreaType = getCrimesByAreaType(appliedFilters)
    const monthlyTrends = getMonthlyTrends(appliedFilters)
    const yearlyTrends = getYearlyTrends(appliedFilters)
    const weatherCorrelation = getWeatherCorrelation(appliedFilters)
    const locationTypes = getLocationTypeDistribution(appliedFilters)
    const dayOfWeek = getDayOfWeekDistribution(appliedFilters)
    const weekendComparison = getWeekendComparison(appliedFilters)

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-4xl font-bold gradient-text mb-2">Crime Analytics Dashboard</h1>
                <p className="text-gray-600">Comprehensive insights into crime patterns and trends</p>
            </motion.div>

            {/* Trial Banner */}
            <TrialBanner />

            {/* Filter Message */}
            {filterMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-center font-medium ${filterMessage.includes('⚠️')
                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                        : filterMessage.includes('✓')
                            ? 'bg-green-100 text-green-800 border-2 border-green-300'
                            : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                        }`}
                >
                    {filterMessage}
                </motion.div>
            )}

            {/* Filter Panel */}
            <FilterPanel
                filters={stagedFilters}
                onFilterChange={handleFilterChange}
                onApply={handleApplyFilters}
                showCityFilter={true}
                showApplyButton={user?.role === 'USER'}
                requireState={user?.role === 'USER'}
                userRole={user?.role}
            />

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={AlertTriangle}
                    title="Total Crimes"
                    value={totalCrimes.toLocaleString()}
                    subtitle="Filtered incidents"
                    color="red"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Crime Types"
                    value={crimesByType.length}
                    subtitle="Different categories"
                    color="blue"
                />
                <StatCard
                    icon={MapPin}
                    title="States Covered"
                    value={crimesByState.length}
                    subtitle="Geographic coverage"
                    color="green"
                />
                <StatCard
                    icon={Calendar}
                    title="Years of Data"
                    value={yearlyTrends.length}
                    subtitle="Historical records"
                    color="purple"
                />
            </div>

            {/* Crime Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Monthly Crime Trends">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="crimes"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Yearly Crime Trends">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={yearlyTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="year" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="crimes" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Crime Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Top Crime Types">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={crimesByType} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis type="number" stroke="#6b7280" />
                            <YAxis dataKey="name" type="category" width={120} stroke="#6b7280" />
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

                <ChartCard title="Crime Categories">
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={crimesByCategory}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {crimesByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Severity and Area Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Crime Severity Levels">
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

                <ChartCard title="Area Type Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={crimesByAreaType}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {crimesByAreaType.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Geographic Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Top States by Crime Count">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={crimesByState}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Top Cities by Crime Count">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={crimesByCity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Environmental Factors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Weather Conditions During Crimes">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weatherCorrelation}>
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
                            <Bar dataKey="value" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Location Type Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={locationTypes}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {locationTypes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Temporal Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Crimes by Day of Week">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dayOfWeek}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="day" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="crimes" fill="#ec4899" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Weekend vs Weekday Crimes">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={weekendComparison}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {weekendComparison.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    )
}

export default UserDashboard
