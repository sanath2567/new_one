import { createContext, useContext, useState, useEffect } from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { isSuperAdmin } from '../config/superAdminConfig'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in, fetch their profile from Firestore
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid)
                    const userDoc = await getDoc(userDocRef)

                    if (userDoc.exists()) {
                        const userData = userDoc.data()
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            displayName: userData.displayName || firebaseUser.email.split('@')[0],
                            role: userData.role || 'USER',
                            region: userData.region || null,
                            preferences: userData.preferences || {},
                            createdAt: userData.createdAt,
                            // Trial and subscription fields - USING trialsRemaining MODEL
                            trialsRemaining: userData.trialsRemaining !== undefined ? userData.trialsRemaining : 3,
                            trialStartDate: userData.trialStartDate || null,
                            trialExpiryDate: userData.trialExpiryDate || null,
                            subscriptionStatus: userData.subscriptionStatus || 'none',
                            subscriptionPlan: userData.subscriptionPlan || null,
                            subscriptionStartDate: userData.subscriptionStartDate || null,
                            subscriptionExpiryDate: userData.subscriptionExpiryDate || null,
                            accessEnabled: userData.accessEnabled !== undefined ? userData.accessEnabled : true,
                            premiumOverride: userData.premiumOverride || false,
                            lastDashboardAccess: userData.lastDashboardAccess || null
                        })
                    } else {
                        // If user document doesn't exist, create a basic one
                        const basicUserData = {
                            email: firebaseUser.email,
                            displayName: firebaseUser.email.split('@')[0],
                            role: 'USER',
                            createdAt: new Date().toISOString(),
                            trialsRemaining: 3,
                            trialStartDate: null,
                            trialExpiryDate: null,
                            subscriptionStatus: 'none',
                            subscriptionPlan: null,
                            subscriptionStartDate: null,
                            subscriptionExpiryDate: null,
                            accessEnabled: true,
                            premiumOverride: false,
                            lastDashboardAccess: null
                        }
                        await setDoc(userDocRef, basicUserData)
                        setUser({
                            uid: firebaseUser.uid,
                            ...basicUserData
                        })
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error)
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.email.split('@')[0],
                        role: 'USER',
                        trialsRemaining: 3,
                        subscriptionStatus: 'none',
                        accessEnabled: true,
                        premiumOverride: false
                    })
                }
            } else {
                // User is signed out
                setUser(null)
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])

    const signup = async (email, password, role = 'USER', region = null) => {
        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user

            // Determine actual role - auto-detect Super Admin by email
            const actualRole = isSuperAdmin(email) ? 'SUPER_ADMIN' : role

            // Create user profile in Firestore
            const userData = {
                email: firebaseUser.email,
                displayName: email.split('@')[0],
                role: actualRole,
                region: region,
                createdAt: new Date().toISOString(),
                // Initialize trial/subscription fields - USING trialsRemaining MODEL
                trialsRemaining: actualRole === 'USER' ? 3 : 0,
                trialStartDate: null,
                trialExpiryDate: null,
                subscriptionStatus: actualRole === 'USER' ? 'none' : 'active', // Admins don't need subscription
                subscriptionPlan: null,
                subscriptionStartDate: null,
                subscriptionExpiryDate: null,
                accessEnabled: actualRole === 'ADMIN' ? false : true, // Admins start disabled
                premiumOverride: false,
                lastDashboardAccess: null
            }

            await setDoc(doc(db, 'users', firebaseUser.uid), userData)

            // Update local user state
            setUser({
                uid: firebaseUser.uid,
                ...userData
            })

            return firebaseUser
        } catch (error) {
            console.error('Signup error:', error.code, error.message)
            throw error
        }
    }

    const login = async (email, password) => {
        try {
            // Sign in with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const firebaseUser = userCredential.user

            // Fetch user profile from Firestore
            const userDocRef = doc(db, 'users', firebaseUser.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
                const userData = userDoc.data()
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: userData.displayName || firebaseUser.email.split('@')[0],
                    role: userData.role || 'USER',
                    region: userData.region || null,
                    preferences: userData.preferences || {},
                    createdAt: userData.createdAt,
                    trialsRemaining: userData.trialsRemaining !== undefined ? userData.trialsRemaining : 3,
                    trialStartDate: userData.trialStartDate || null,
                    trialExpiryDate: userData.trialExpiryDate || null,
                    subscriptionStatus: userData.subscriptionStatus || 'none',
                    subscriptionPlan: userData.subscriptionPlan || null,
                    subscriptionStartDate: userData.subscriptionStartDate || null,
                    subscriptionExpiryDate: userData.subscriptionExpiryDate || null,
                    accessEnabled: userData.accessEnabled !== undefined ? userData.accessEnabled : true,
                    premiumOverride: userData.premiumOverride || false,
                    lastDashboardAccess: userData.lastDashboardAccess || null
                })
            }

            return firebaseUser
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
            setUser(null)
        } catch (error) {
            console.error('Logout error:', error)
            throw error
        }
    }

    const updateUserPreferences = async (preferences) => {
        if (!user) return

        try {
            const userDocRef = doc(db, 'users', user.uid)
            await setDoc(userDocRef, { preferences }, { merge: true })

            // Update local user state
            setUser(prev => ({
                ...prev,
                preferences: { ...prev.preferences, ...preferences }
            }))
        } catch (error) {
            console.error('Error updating preferences:', error)
            throw error
        }
    }

    // CENTRALIZED ACCESS CHECK - ROLE-FIRST LOGIC
    const hasAccess = () => {
        if (!user) return { valid: false, reason: 'not_authenticated' }

        // Priority 1: Premium override bypasses everything
        if (user.premiumOverride) return { valid: true, reason: null }

        // Priority 2: Active subscription
        if (user.subscriptionStatus === 'active') {
            const expiryDate = user.subscriptionExpiryDate ? new Date(user.subscriptionExpiryDate) : null
            if (!expiryDate || expiryDate > new Date()) {
                return { valid: true, reason: null }
            }
        }

        // Priority 3: SUPER_ADMIN always has access
        if (user.role === 'SUPER_ADMIN') return { valid: true, reason: null }

        // Priority 4: ADMIN role - requires explicit enablement OR premium override
        if (user.role === 'ADMIN') {
            if (user.accessEnabled === true || user.premiumOverride === true) {
                return { valid: true, reason: null }
            }
            return { valid: false, reason: 'admin_disabled' }
        }

        // Priority 5: USER role - check trialsRemaining
        if (user.role === 'USER') {
            if (user.trialsRemaining > 0) return { valid: true, reason: null }
            return { valid: false, reason: 'trials_exhausted' }
        }

        return { valid: false, reason: 'unknown' }
    }

    // Decrement trialsRemaining when USER applies State filter - USER role ONLY
    const decrementTrialCount = async () => {
        // Only apply to USER role
        if (!user || user.role !== 'USER') return

        // Don't decrement if user has premium override or active subscription
        if (user.premiumOverride || user.subscriptionStatus === 'active') return

        // Don't decrement if no trials remaining
        if (user.trialsRemaining <= 0) return

        try {
            const userDocRef = doc(db, 'users', user.uid)
            const now = new Date()

            // Decrement trialsRemaining
            const updates = {
                trialsRemaining: user.trialsRemaining - 1,
                lastDashboardAccess: now.toISOString()
            }

            // If this is the first trial use, set start and expiry dates
            if (!user.trialStartDate) {
                const expiryDate = new Date(now)
                expiryDate.setDate(expiryDate.getDate() + 7) // 7 days from now

                updates.trialStartDate = now.toISOString()
                updates.trialExpiryDate = expiryDate.toISOString()
                updates.subscriptionStatus = 'trial'
            }

            await updateDoc(userDocRef, updates)

            // Update local state
            setUser(prev => ({
                ...prev,
                ...updates,
                trialStartDate: updates.trialStartDate || prev.trialStartDate,
                trialExpiryDate: updates.trialExpiryDate || prev.trialExpiryDate,
                subscriptionStatus: updates.subscriptionStatus || prev.subscriptionStatus
            }))
        } catch (error) {
            console.error('Error decrementing trial count:', error)
            throw error
        }
    }

    // Update subscription status after payment
    const updateSubscription = async (plan, durationMonths = 1) => {
        if (!user) return

        try {
            const userDocRef = doc(db, 'users', user.uid)
            const now = new Date()
            const expiryDate = new Date(now)
            expiryDate.setMonth(expiryDate.getMonth() + durationMonths)

            const updates = {
                subscriptionStatus: 'active',
                subscriptionPlan: plan,
                subscriptionStartDate: now.toISOString(),
                subscriptionExpiryDate: expiryDate.toISOString()
            }

            await updateDoc(userDocRef, updates)

            // Update local state
            setUser(prev => ({
                ...prev,
                ...updates
            }))
        } catch (error) {
            console.error('Error updating subscription:', error)
            throw error
        }
    }

    // Super Admin: Grant premium access override to any user/admin
    const grantPremiumAccess = async (userId) => {
        if (!user || user.role !== 'SUPER_ADMIN') {
            throw new Error('Only Super Admin can grant premium access')
        }

        try {
            const targetUserRef = doc(db, 'users', userId)
            await updateDoc(targetUserRef, {
                premiumOverride: true,
                accessEnabled: true
            })

            console.log('Premium access granted to user:', userId)
        } catch (error) {
            console.error('Error granting premium access:', error)
            throw error
        }
    }

    // Super Admin: Revoke premium access override
    const revokePremiumAccess = async (userId) => {
        if (!user || user.role !== 'SUPER_ADMIN') {
            throw new Error('Only Super Admin can revoke premium access')
        }

        try {
            const targetUserRef = doc(db, 'users', userId)
            await updateDoc(targetUserRef, {
                premiumOverride: false
            })

            console.log('Premium access revoked from user:', userId)
        } catch (error) {
            console.error('Error revoking premium access:', error)
            throw error
        }
    }

    // Refresh user data from Firestore - for real-time state sync
    const refreshUserData = async () => {
        if (!user) return

        try {
            const userDocRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
                const userData = userDoc.data()
                setUser(prev => ({
                    ...prev,
                    trialsRemaining: userData.trialsRemaining !== undefined ? userData.trialsRemaining : prev.trialsRemaining,
                    subscriptionStatus: userData.subscriptionStatus || prev.subscriptionStatus,
                    subscriptionPlan: userData.subscriptionPlan || prev.subscriptionPlan,
                    subscriptionStartDate: userData.subscriptionStartDate || prev.subscriptionStartDate,
                    subscriptionExpiryDate: userData.subscriptionExpiryDate || prev.subscriptionExpiryDate,
                    accessEnabled: userData.accessEnabled !== undefined ? userData.accessEnabled : prev.accessEnabled,
                    premiumOverride: userData.premiumOverride || prev.premiumOverride
                }))
            }
        } catch (error) {
            console.error('Error refreshing user data:', error)
        }
    }

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        updateUserPreferences,
        hasAccess,
        decrementTrialCount,
        updateSubscription,
        grantPremiumAccess,
        revokePremiumAccess,
        refreshUserData
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
