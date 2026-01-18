import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Save to Firestore for Super Admin viewing
            await addDoc(collection(db, 'contact_messages'), {
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                timestamp: new Date().toISOString(),
                status: 'new'
            })

            setSubmitted(true)
            setTimeout(() => {
                setSubmitted(false)
                setFormData({ name: '', email: '', subject: '', message: '' })
            }, 5000)
        } catch (err) {
            console.error('Error submitting form:', err)
            setError('Failed to send message. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-4xl font-bold gradient-text mb-4">Get in Touch</h1>
                <p className="text-xl text-gray-600">
                    Have questions? We'd love to hear from you.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 text-center"
                >
                    <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                        <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                    <p className="text-gray-600 text-sm">contact@crimewatch.com</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 text-center"
                >
                    <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                        <User className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Support</h3>
                    <p className="text-gray-600 text-sm">24/7 Customer Support</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 text-center"
                >
                    <div className="inline-flex p-3 bg-purple-100 rounded-full mb-4">
                        <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Response Time</h3>
                    <p className="text-gray-600 text-sm">Within 24 hours</p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-8"
            >
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {submitted ? (
                    <div className="text-center py-12">
                        <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                        <p className="text-gray-600">We'll get back to you as soon as possible.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="How can we help?"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Tell us more about your inquiry..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-5 h-5" />
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    )
}

export default Contact
