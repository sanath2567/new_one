import { useState, useEffect } from 'react'
import { Filter, X, CheckCircle } from 'lucide-react'
import { getUniqueStates, getUniqueCities, getUniqueCrimeTypes, getUniqueMonths, getUniqueYears } from '../utils/dataUtils'

const FilterPanel = ({
    filters,
    onFilterChange,
    onApply,
    showCityFilter = true,
    multiSelectState = false,
    showApplyButton = false,
    requireState = false,
    userRole = null
}) => {
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [crimeTypes, setCrimeTypes] = useState([])
    const [months, setMonths] = useState([])
    const [years, setYears] = useState([])
    const [isExpanded, setIsExpanded] = useState(true)

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']

    useEffect(() => {
        // Load filter options
        setStates(getUniqueStates())
        setCrimeTypes(getUniqueCrimeTypes())
        setMonths(getUniqueMonths())
        setYears(getUniqueYears())
    }, [])

    useEffect(() => {
        // Update cities when state changes
        if (filters.state && filters.state !== 'all') {
            const selectedState = Array.isArray(filters.state) ? filters.state[0] : filters.state
            setCities(getUniqueCities(selectedState))
        } else {
            setCities(getUniqueCities())
        }
    }, [filters.state])

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value }

        // Reset city if state changes
        if (key === 'state') {
            newFilters.city = 'all'
        }

        onFilterChange(newFilters)
    }

    const handleReset = () => {
        onFilterChange({
            state: 'all',
            city: 'all',
            crime_type: 'all',
            month: 'all',
            year: 'all'
        })
    }

    const hasActiveFilters = Object.values(filters).some(v => v !== 'all' && v !== '')
    const isStateSelected = filters.state && filters.state !== 'all'

    return (
        <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                    {hasActiveFilters && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Active
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={handleReset}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                        >
                            <X className="w-4 h-4" />
                            Reset
                        </button>
                    )}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* State Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State {requireState && <span className="text-red-500">*</span>}
                                {requireState && <span className="text-xs text-gray-500 ml-1">(Required for trial)</span>}
                            </label>
                            <select
                                value={Array.isArray(filters.state) ? filters.state[0] : filters.state || 'all'}
                                onChange={(e) => handleFilterChange('state', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All States</option>
                                {states.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        {/* City Filter */}
                        {showCityFilter && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <select
                                    value={filters.city || 'all'}
                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!filters.state || filters.state === 'all'}
                                >
                                    <option value="all">All Cities</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Crime Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Crime Type
                            </label>
                            <select
                                value={filters.crime_type || 'all'}
                                onChange={(e) => handleFilterChange('crime_type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Types</option>
                                {crimeTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Month Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Month
                            </label>
                            <select
                                value={filters.month || 'all'}
                                onChange={(e) => handleFilterChange('month', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Months</option>
                                {months.map(month => (
                                    <option key={month} value={month}>{monthNames[month - 1]}</option>
                                ))}
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Year
                            </label>
                            <select
                                value={filters.year || 'all'}
                                onChange={(e) => handleFilterChange('year', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Apply Button - Only for USER role */}
                    {showApplyButton && onApply && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={onApply}
                                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${requireState && !isStateSelected
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                    }`}
                                title={requireState && !isStateSelected ? 'Please select a State first' : 'Apply filters and use a trial'}
                            >
                                <CheckCircle className="w-4 h-4" />
                                Apply Filters
                                {requireState && <span className="text-xs">(Uses 1 trial)</span>}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default FilterPanel
