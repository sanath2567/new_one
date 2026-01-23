import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, X, CheckCircle, XCircle, Loader, Lock } from 'lucide-react'

const DummyPaymentModal = ({ isOpen, onClose, plan, onSuccess }) => {
    const [processing, setProcessing] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState(null) // 'success' | 'failed' | null
    const [cardNumber, setCardNumber] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')
    const [cardholderName, setCardholderName] = useState('')

    const handleSimulateSuccess = async () => {
        setProcessing(true)

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        setPaymentStatus('success')
        setProcessing(false)

        // Call success callback after showing success message
        setTimeout(() => {
            onSuccess(plan)
            handleClose()
        }, 2500)
    }

    const handleSimulateFailure = async () => {
        setProcessing(true)

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        setPaymentStatus('failed')
        setProcessing(false)
    }

    const handleClose = () => {
        setCardNumber('')
        setExpiryDate('')
        setCvv('')
        setCardholderName('')
        setPaymentStatus(null)
        setProcessing(false)
        onClose()
    }

    const handleRetry = () => {
        setPaymentStatus(null)
        setProcessing(false)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black bg-opacity-60"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '100%', opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 max-w-md w-full relative overflow-hidden"
                >
                    {/* Razorpay-style header gradient */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"></div>

                    {/* Processing Animation - Razorpay Style */}
                    {processing && !paymentStatus && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            {/* Razorpay Logo Animation */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl mb-6"
                            >
                                <CreditCard className="w-12 h-12 text-white" />
                            </motion.div>

                            {/* Processing Text */}
                            <motion.h3
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-2xl font-bold text-gray-800 mb-2"
                            >
                                Processing Payment
                            </motion.h3>
                            <p className="text-gray-600 mb-6">Please wait while we process your transaction...</p>

                            {/* Animated Progress Bar */}
                            <div className="max-w-xs mx-auto mb-6">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                                    />
                                </div>
                            </div>

                            {/* Shimmer Card Effect */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 20px rgba(59, 130, 246, 0.3)",
                                        "0 0 40px rgba(59, 130, 246, 0.6)",
                                        "0 0 20px rgba(59, 130, 246, 0.3)"
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block px-8 py-4 bg-white rounded-lg border-2 border-blue-200"
                            >
                                <div className="flex items-center gap-3">
                                    <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Securing your payment...
                                    </span>
                                </div>
                            </motion.div>

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
                                <Lock className="w-3 h-3" />
                                <span>256-bit SSL Encrypted</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        disabled={processing}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Success Animation */}
                    {paymentStatus === 'success' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ type: 'spring', duration: 0.6 }}
                                className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4"
                            >
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </motion.div>
                            <motion.h3
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl font-bold text-gray-800 mb-2"
                            >
                                Payment Successful!
                            </motion.h3>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-600"
                            >
                                Your {plan?.name} subscription has been activated.
                            </motion.p>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ delay: 0.5, duration: 2 }}
                                className="h-1 bg-green-500 rounded-full mt-4"
                            />
                        </motion.div>
                    )}

                    {/* Failure Animation */}
                    {paymentStatus === 'failed' && (
                        <motion.div
                            initial={{ x: 0 }}
                            animate={{ x: [-10, 10, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4"
                            >
                                <XCircle className="w-16 h-16 text-red-600" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h3>
                            <p className="text-gray-600 mb-6">
                                There was an issue processing your payment. Please try again.
                            </p>
                            <button
                                onClick={handleRetry}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}

                    {/* Payment Form */}
                    {!paymentStatus && (
                        <>
                            {/* Razorpay-style Header */}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-gray-800">Razorpay</h3>
                                        <Lock className="w-4 h-4 text-green-600" />
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {plan?.name} - ₹{plan?.price}
                                    </p>
                                </div>
                            </div>

                            {/* Demo Mode Banner with Test Credentials */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                            >
                                <p className="text-sm text-yellow-800 font-bold mb-2">⚡ Demo Mode - Test Credentials</p>
                                <div className="text-xs text-yellow-700 space-y-1">
                                    <p><strong>Card Number:</strong> 4111 1111 1111 1111 (Visa)</p>
                                    <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
                                    <p><strong>CVV:</strong> Any 3 digits (e.g., 123)</p>
                                    <p className="text-yellow-600 italic mt-2">Click "Success" or "Failure" to simulate payment outcome</p>
                                </div>
                            </motion.div>

                            <form className="space-y-4">
                                {/* Cardholder Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={cardholderName}
                                        onChange={(e) => setCardholderName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                        disabled={processing}
                                    />
                                </div>

                                {/* Card Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Card Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
                                                if (value.replace(/\s/g, '').length <= 16) {
                                                    setCardNumber(value)
                                                }
                                            }}
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                            disabled={processing}
                                        />
                                        <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>

                                {/* Expiry and CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            value={expiryDate}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '')
                                                if (value.length <= 4) {
                                                    setExpiryDate(value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value)
                                                }
                                            }}
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                            disabled={processing}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            CVV
                                        </label>
                                        <input
                                            type="password"
                                            value={cvv}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '')
                                                if (value.length <= 3) {
                                                    setCvv(value)
                                                }
                                            }}
                                            placeholder="123"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                            disabled={processing}
                                        />
                                    </div>
                                </div>

                                {/* Simulation Buttons */}
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-3 text-center font-medium">
                                        Choose payment outcome:
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={handleSimulateSuccess}
                                            disabled={processing}
                                            className={`px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform ${processing
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                                }`}
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Success
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSimulateFailure}
                                            disabled={processing}
                                            className={`px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform ${processing
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                                }`}
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader className="w-5 h-5 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-5 h-5" />
                                                    Failure
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Secure Payment Badge */}
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                                    <Lock className="w-3 h-3" />
                                    <span>Secured by Razorpay SSL encryption</span>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default DummyPaymentModal
