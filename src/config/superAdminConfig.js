// Super Admin Configuration
// This file contains the hardcoded Super Admin credentials

export const SUPER_ADMIN_CONFIG = {
    email: 'superadmin@crimewatch.com',
    // In production, this should be properly hashed and secured
    // For now, using a simple password that should be changed
    password: 'SuperAdmin@2026',
    displayName: 'Super Administrator',
    role: 'SUPER_ADMIN'
}

// Check if a user is the Super Admin
export const isSuperAdmin = (email) => {
    return email?.toLowerCase() === SUPER_ADMIN_CONFIG.email.toLowerCase()
}

// Validate Super Admin credentials
export const validateSuperAdminCredentials = (email, password) => {
    return email?.toLowerCase() === SUPER_ADMIN_CONFIG.email.toLowerCase() &&
        password === SUPER_ADMIN_CONFIG.password
}
