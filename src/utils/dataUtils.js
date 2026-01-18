// Import the crime data
import crimeDataRaw from '../../crime-data.json'

// Data processing utilities
export const crimeData = crimeDataRaw

// ============================================
// FILTERING UTILITIES
// ============================================

/**
 * Apply filters to crime data
 * @param {Object} filters - Filter criteria { state, city, crime_type, month, year }
 * @returns {Array} Filtered crime data
 */
export const applyFilters = (filters = {}) => {
    if (!filters || Object.keys(filters).length === 0) {
        return crimeData
    }

    return crimeData.filter(crime => {
        // State filter (supports array for multi-select)
        if (filters.state && filters.state !== 'all') {
            if (Array.isArray(filters.state)) {
                const normalizedStates = filters.state.map(s => s.toLowerCase())
                if (!normalizedStates.includes(crime.state?.toLowerCase())) return false
            } else {
                if (crime.state?.toLowerCase() !== filters.state.toLowerCase()) return false
            }
        }

        // City filter
        if (filters.city && filters.city !== 'all') {
            if (crime.city?.toLowerCase() !== filters.city.toLowerCase()) return false
        }

        // Crime type filter
        if (filters.crime_type && filters.crime_type !== 'all') {
            if (crime.crime_type !== filters.crime_type) return false
        }

        // Month filter
        if (filters.month && filters.month !== 'all') {
            if (crime.month?.toString() !== filters.month.toString()) return false
        }

        // Year filter
        if (filters.year && filters.year !== 'all') {
            if (crime.year?.toString() !== filters.year.toString()) return false
        }

        return true
    })
}

/**
 * Get unique states from dataset
 */
export const getUniqueStates = () => {
    const states = [...new Set(crimeData.map(item => item.state))]
    return states
        .filter(s => s && s !== 'Unknown')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .sort()
}

/**
 * Get unique cities from dataset, optionally filtered by state
 */
export const getUniqueCities = (state = null) => {
    let data = crimeData
    if (state && state !== 'all') {
        data = crimeData.filter(c => c.state?.toLowerCase() === state.toLowerCase())
    }
    const cities = [...new Set(data.map(item => item.city))]
    return cities
        .filter(c => c && c !== 'Unknown')
        .map(c => c.charAt(0).toUpperCase() + c.slice(1))
        .sort()
}

/**
 * Get unique crime types from dataset
 */
export const getUniqueCrimeTypes = () => {
    const types = [...new Set(crimeData.map(item => item.crime_type))]
    return types.filter(t => t && t !== 'Unknown').sort()
}

/**
 * Get unique months from dataset
 */
export const getUniqueMonths = () => {
    const months = [...new Set(crimeData.map(item => item.month))]
    return months
        .filter(m => m && m !== 'Unknown')
        .map(m => parseInt(m))
        .sort((a, b) => a - b)
}

/**
 * Get unique years from dataset
 */
export const getUniqueYears = () => {
    const years = [...new Set(crimeData.map(item => item.year))]
    return years
        .filter(y => y && y !== 'Unknown')
        .map(y => parseInt(y))
        .sort((a, b) => a - b)
}

// Get unique values for filters (legacy support)
export const getUniqueValues = (field) => {
    const values = [...new Set(crimeData.map(item => item[field]))]
    return values.filter(v => v && v !== 'Unknown').sort()
}


// ============================================
// ANALYTICS FUNCTIONS (with filter support)
// ============================================

// Calculate total crimes
export const getTotalCrimes = (filters = {}) => {
    const filteredData = applyFilters(filters)
    return filteredData.length
}

// Get crimes by type
export const getCrimesByType = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const typeCount = {}
    filteredData.forEach(crime => {
        const type = crime.crime_type
        typeCount[type] = (typeCount[type] || 0) + 1
    })
    return Object.entries(typeCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
}


// Get crimes by category
export const getCrimesByCategory = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const categoryCount = {}
    filteredData.forEach(crime => {
        const category = crime.crime_category
        categoryCount[category] = (categoryCount[category] || 0) + 1
    })
    return Object.entries(categoryCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
}

// Get crimes by severity
export const getCrimesBySeverity = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const severityCount = {}
    filteredData.forEach(crime => {
        const severity = crime.crime_severity_level
        if (severity && severity !== 'Unknown') {
            severityCount[severity] = (severityCount[severity] || 0) + 1
        }
    })
    return Object.entries(severityCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => {
            const order = { 'low': 1, 'medium': 2, 'high': 3 }
            return order[a.name] - order[b.name]
        })
}

// Get crimes by state
export const getCrimesByState = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const stateCount = {}
    filteredData.forEach(crime => {
        const state = crime.state
        stateCount[state] = (stateCount[state] || 0) + 1
    })
    return Object.entries(stateCount)
        .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
        }))
        .sort((a, b) => b.value - a.value)
}

// Get crimes by city
export const getCrimesByCity = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const cityCount = {}
    filteredData.forEach(crime => {
        const city = crime.city
        cityCount[city] = (cityCount[city] || 0) + 1
    })
    return Object.entries(cityCount)
        .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
        }))
        .sort((a, b) => b.value - a.value)
}

// Get crimes by area type
export const getCrimesByAreaType = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const areaCount = {}
    filteredData.forEach(crime => {
        const area = crime.area_type
        if (area && area !== 'Unknown') {
            areaCount[area] = (areaCount[area] || 0) + 1
        }
    })
    return Object.entries(areaCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
}

// Get monthly trends
export const getMonthlyTrends = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const monthlyCount = {}
    filteredData.forEach(crime => {
        const month = crime.month
        if (month) {
            monthlyCount[month] = (monthlyCount[month] || 0) + 1
        }
    })

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return Object.entries(monthlyCount)
        .map(([month, count]) => ({
            month: monthNames[parseInt(month) - 1],
            crimes: count
        }))
        .sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month))
}

// Get yearly trends
export const getYearlyTrends = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const yearlyCount = {}
    filteredData.forEach(crime => {
        const year = crime.year
        if (year) {
            yearlyCount[year] = (yearlyCount[year] || 0) + 1
        }
    })
    return Object.entries(yearlyCount)
        .map(([year, crimes]) => ({ year: year.toString(), crimes }))
        .sort((a, b) => a.year - b.year)
}

// Get case status distribution
export const getCaseStatusDistribution = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const statusCount = {}
    filteredData.forEach(crime => {
        const status = crime.case_status
        if (status && status !== 'Unknown') {
            statusCount[status] = (statusCount[status] || 0) + 1
        }
    })
    return Object.entries(statusCount)
        .map(([name, value]) => ({ name, value }))
}

// Get arrest statistics
export const getArrestStats = (filters = {}) => {
    const filteredData = applyFilters(filters)
    let arrested = 0
    let notArrested = 0
    let unknown = 0

    filteredData.forEach(crime => {
        if (crime.arrest_made === 'yes') arrested++
        else if (crime.arrest_made === 'no') notArrested++
        else unknown++
    })

    return [
        { name: 'Arrested', value: arrested },
        { name: 'Not Arrested', value: notArrested },
        { name: 'Unknown', value: unknown }
    ]
}

// Get response time statistics
export const getResponseTimeStats = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const bucketCount = {}
    filteredData.forEach(crime => {
        const bucket = crime.response_time_bucket
        if (bucket && bucket !== 'Unknown') {
            bucketCount[bucket] = (bucketCount[bucket] || 0) + 1
        }
    })
    return Object.entries(bucketCount)
        .map(([name, value]) => ({ name, value }))
}

// Get average response time
export const getAverageResponseTime = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const times = filteredData
        .map(c => c.response_time_minutes)
        .filter(t => t && !isNaN(t))

    if (times.length === 0) return 0
    return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)
}

// Get crime hotspots
export const getCrimeHotspots = (filters = {}) => {
    const filteredData = applyFilters(filters)
    let hotspots = 0
    let nonHotspots = 0

    filteredData.forEach(crime => {
        if (crime.crime_hotspot === 'yes') hotspots++
        else if (crime.crime_hotspot === 'no') nonHotspots++
    })

    return [
        { name: 'Hotspot Areas', value: hotspots },
        { name: 'Non-Hotspot Areas', value: nonHotspots }
    ]
}

// Get weather correlation
export const getWeatherCorrelation = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const weatherCount = {}
    filteredData.forEach(crime => {
        const weather = crime.weather_condition
        if (weather && weather !== 'Unknown') {
            weatherCount[weather] = (weatherCount[weather] || 0) + 1
        }
    })
    return Object.entries(weatherCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
}

// Get location type distribution
export const getLocationTypeDistribution = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const locationCount = {}
    filteredData.forEach(crime => {
        const location = crime.location_type
        if (location && location !== 'Unknown') {
            locationCount[location] = (locationCount[location] || 0) + 1
        }
    })
    return Object.entries(locationCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
}

// Get repeat offender statistics
export const getRepeatOffenderStats = (filters = {}) => {
    const filteredData = applyFilters(filters)
    let repeat = 0
    let nonRepeat = 0

    filteredData.forEach(crime => {
        if (crime.repeat_offender === 'yes') repeat++
        else if (crime.repeat_offender === 'no') nonRepeat++
    })

    return [
        { name: 'Repeat Offenders', value: repeat },
        { name: 'First-time Offenders', value: nonRepeat }
    ]
}

// Get victim gender distribution
export const getVictimGenderDistribution = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const genderCount = {}
    filteredData.forEach(crime => {
        const gender = crime.victim_gender
        if (gender && gender !== 'Unknown') {
            genderCount[gender] = (genderCount[gender] || 0) + 1
        }
    })
    return Object.entries(genderCount)
        .map(([name, value]) => ({ name, value }))
}

// Get offender age group distribution
export const getOffenderAgeDistribution = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const ageCount = {}
    filteredData.forEach(crime => {
        const age = crime.offender_age_group
        if (age && age !== 'Unknown') {
            ageCount[age] = (ageCount[age] || 0) + 1
        }
    })
    return Object.entries(ageCount)
        .map(([name, value]) => ({ name, value }))
}

// Filter crimes by multiple criteria
export const filterCrimes = (filters) => {
    return crimeData.filter(crime => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value || value === 'all') return true
            return crime[key] === value
        })
    })
}

// Get police station performance
export const getPoliceStationPerformance = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const stationStats = {}

    filteredData.forEach(crime => {
        const station = crime.police_station
        if (!stationStats[station]) {
            stationStats[station] = {
                total: 0,
                closed: 0,
                arrested: 0,
                avgResponseTime: []
            }
        }

        stationStats[station].total++
        if (crime.case_status === 'closed') stationStats[station].closed++
        if (crime.arrest_made === 'yes') stationStats[station].arrested++
        if (crime.response_time_minutes) {
            stationStats[station].avgResponseTime.push(crime.response_time_minutes)
        }
    })

    return Object.entries(stationStats)
        .map(([station, stats]) => ({
            station: station.toUpperCase(),
            total: stats.total,
            closureRate: ((stats.closed / stats.total) * 100).toFixed(1),
            arrestRate: ((stats.arrested / stats.total) * 100).toFixed(1),
            avgResponseTime: stats.avgResponseTime.length > 0
                ? (stats.avgResponseTime.reduce((a, b) => a + b, 0) / stats.avgResponseTime.length).toFixed(1)
                : 0
        }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10) // Top 10 stations
}

// Get day of week distribution
export const getDayOfWeekDistribution = (filters = {}) => {
    const filteredData = applyFilters(filters)
    const dayCount = {}
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    filteredData.forEach(crime => {
        const day = crime.day_of_week
        if (day) {
            dayCount[day] = (dayCount[day] || 0) + 1
        }
    })

    return dayOrder.map(day => ({
        day: day.substring(0, 3),
        crimes: dayCount[day] || 0
    }))
}

// Get weekend vs weekday comparison
export const getWeekendComparison = (filters = {}) => {
    const filteredData = applyFilters(filters)
    let weekend = 0
    let weekday = 0

    filteredData.forEach(crime => {
        if (crime.is_weekend === 1) weekend++
        else weekday++
    })

    return [
        { name: 'Weekday', value: weekday },
        { name: 'Weekend', value: weekend }
    ]
}
