import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, Users, Shield, Mail, Database, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react'
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../context/AuthContext'

const SuperAdminPanel = () => {
    const { grantPremiumAccess, revokePremiumAccess } = useAuth()
    const [users, setUsers] = useState([])
    const [admins, setAdmins] = useState([])
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('users')
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAdmins: 0,
        activeSubscriptions: 0,
        trialUsers: 0,
        unreadMessages: 0
    })

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        setLoading(true)
        try {
            // Fetch all users
            const usersSnapshot = await getDocs(collection(db, 'users'))
            const allUsers = []
            const allAdmins = []

            usersSnapshot.forEach((doc) => {
                const userData = { id: doc.id, ...doc.data() }
                if (userData.role === 'USER') {
                    allUsers.push(userData)
                } else if (userData.role === 'ADMIN') {
                    allAdmins.push(userData)
                }
            })

            setUsers(allUsers)
            setAdmins(allAdmins)

            // Fetch contact messages
            const messagesQuery = query(collection(db, 'contact_messages'), orderBy('timestamp', 'desc'))
            const messagesSnapshot = await getDocs(messagesQuery)
            const allMessages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setMessages(allMessages)

            // Calculate stats
            const activeSubscriptions = allUsers.filter(u => u.subscriptionStatus === 'active').length
            const trialUsers = allUsers.filter(u => u.subscriptionStatus === 'trial' || u.subscriptionStatus === 'none').length
            const newMessages = allMessages.filter(m => m.status === 'new').length

            setStats({
                totalUsers: allUsers.length,
                totalAdmins: allAdmins.length,
                activeSubscriptions,
                trialUsers,
                unreadMessages: newMessages
            })
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleUserAccess = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, 'users', userId)
            await updateDoc(userRef, {
                accessEnabled: !currentStatus
            })

            // Refresh data
            fetchAllData()
        } catch (error) {
            console.error('Error updating user access:', error)
            alert('Failed to update user access')
        }
    }

    const togglePremiumOverride = async (userId, currentStatus) => {
        try {
            if (currentStatus) {
                await revokePremiumAccess(userId)
            } else {
                await grantPremiumAccess(userId)
            }

            // Refresh data
            fetchAllData()
        } catch (error) {
            console.error('Error updating premium access:', error)
            alert('Failed to update premium access')
        }
    }

    const markMessageAsRead = async (messageId) => {
        try {
            const messageRef = doc(db, 'contact_messages', messageId)
            await updateDoc(messageRef, {
                status: 'read'
            })

            // Refresh data
            fetchAllData()
        } catch (error) {
            console.error('Error updating message status:', error)
        }
    }

    const updateMessageStatus = async (messageId, newStatus) => {
        try {
            const messageRef = doc(db, 'contact_messages', messageId)
            await updateDoc(messageRef, {
                status: newStatus
            })

            // Refresh data
            fetchAllData()
        } catch (error) {
            console.error('Error updating message status:', error)
            alert('Failed to update message status')
        }
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A'
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const getTrialStatus = (user) => {
        if (user.subscriptionStatus === 'active') return 'Active Subscription'
        if (user.subscriptionStatus === 'trial') {
            const remaining = 3 - (user.trialCount || 0)
            return `Trial (${remaining}/3 uses)`
        }
        return 'No Subscription'
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Super Admin Panel...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mb-4">
                    <Crown className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Super Admin Control Panel</h1>
                <p className="text-gray-600">Complete system management and oversight</p>
            </motion.div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Admins</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.totalAdmins}</p>
                        </div>
                        <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Subscriptions</p>
                            <p className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Trial Users</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.trialUsers}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-600" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Unread Messages</p>
                            <p className="text-2xl font-bold text-red-600">{stats.unreadMessages}</p>
                        </div>
                        <Mail className="w-8 h-8 text-red-600" />
                    </div>
                </motion.div>
            </div>

            {/* Tabs */}
            <div className="glass-card p-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'users'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Users className="w-4 h-4 inline mr-2" />
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('admins')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'admins'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Shield className="w-4 h-4 inline mr-2" />
                        Admin Management
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'messages'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Mail className="w-4 h-4 inline mr-2" />
                        Contact Messages
                        {stats.unreadMessages > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                {stats.unreadMessages}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Trial/Subscription</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Premium Override</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Access</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-gray-800">{user.email}</td>
                                            <td className="py-3 px-4 text-gray-600">{formatDate(user.createdAt)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.accessEnabled
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {user.accessEnabled ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600 text-sm">{getTrialStatus(user)}</td>
                                            <td className="py-3 px-4 text-center">
                                                {user.premiumOverride ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                            ⭐ Premium
                                                        </span>
                                                        <button
                                                            onClick={() => togglePremiumOverride(user.id, true)}
                                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                                                        >
                                                            Revoke
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => togglePremiumOverride(user.id, false)}
                                                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors"
                                                    >
                                                        Grant Premium
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => toggleUserAccess(user.id, user.accessEnabled)}
                                                    className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${user.accessEnabled
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                >
                                                    {user.accessEnabled ? 'Disable' : 'Enable'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && (
                                <p className="text-center text-gray-500 py-8">No users found</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'admins' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Management</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Premium Override</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Access</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((admin) => (
                                        <tr key={admin.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-gray-800">{admin.email}</td>
                                            <td className="py-3 px-4 text-gray-600">{formatDate(admin.createdAt)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.accessEnabled !== false
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {admin.accessEnabled !== false ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {admin.premiumOverride ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                            ⭐ Premium
                                                        </span>
                                                        <button
                                                            onClick={() => togglePremiumOverride(admin.id, true)}
                                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                                                        >
                                                            Revoke
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => togglePremiumOverride(admin.id, false)}
                                                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors"
                                                    >
                                                        Grant Premium
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => toggleUserAccess(admin.id, admin.accessEnabled !== false)}
                                                    className={`px-4 py-1 rounded-lg text-sm font-medium transition-colors ${admin.accessEnabled !== false
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        }`}
                                                >
                                                    {admin.accessEnabled !== false ? 'Disable' : 'Enable'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {admins.length === 0 && (
                                <p className="text-center text-gray-500 py-8">No admins found</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Messages</h2>
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-4 rounded-lg border-2 transition-all ${message.status === 'new'
                                        ? 'border-blue-200 bg-blue-50'
                                        : message.status === 'read'
                                            ? 'border-yellow-200 bg-yellow-50'
                                            : 'border-green-200 bg-green-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-800">{message.name}</h3>
                                                <span className="text-sm text-gray-500">{message.email}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${message.status === 'new'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : message.status === 'read'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {message.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="font-medium text-gray-700 mb-2">{message.subject}</p>
                                            <p className="text-gray-600 text-sm">{message.message}</p>
                                            <p className="text-xs text-gray-500 mt-2">{formatDate(message.timestamp)}</p>
                                        </div>
                                        <div className="ml-4 flex flex-col gap-2">
                                            {message.status === 'new' && (
                                                <button
                                                    onClick={() => updateMessageStatus(message.id, 'read')}
                                                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors"
                                                >
                                                    Mark as Read
                                                </button>
                                            )}
                                            {message.status === 'read' && (
                                                <button
                                                    onClick={() => updateMessageStatus(message.id, 'resolved')}
                                                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                                                >
                                                    Mark as Resolved
                                                </button>
                                            )}
                                            {message.status === 'resolved' && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                                                    Resolved ✓
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {messages.length === 0 && (
                                <p className="text-center text-gray-500 py-8">No messages found</p>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default SuperAdminPanel
