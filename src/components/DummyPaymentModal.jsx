import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, X, CheckCircle, XCircle, Loader } from 'lucide-react'

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
        await new Promise(resolve => setTimeout(resolve, 1500))

        setPaymentStatus('success')
        setProcessing(false)

        // Call success callback after showing success message
        setTimeout(() => {
            onSuccess(plan)
            handleClose()
        }, 2000)
    }

    const handleSimulateFailure = async () => {
        setProcessing(true)

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500))

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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card p-6 max-w-md w-full relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={processing}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Payment Status Display */}
                    {paymentStatus === 'success' && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
                            <p className="text-gray-600">
                                Your {plan?.name} subscription has been activated.
                            </p>
                        </div>
                    )}

                    {paymentStatus === 'failed' && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h3>
                            <p className="text-gray-600 mb-6">
                                There was an issue processing your payment. Please try again.
                            </p>
                            <button
                                onClick={handleRetry}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Payment Form */}
                    {!paymentStatus && (
                        <>
                            {/* Razorpay-style Header */}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <CreditCard className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Razorpay Payment Gateway</h3>
                                    <p className="text-sm text-gray-600">
                                        {plan?.name} - ₹{plan?.price}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <strong>Demo Mode:</strong> This is a simulated payment gateway. Use the buttons below to simulate success or failure.
                                </p>
                            </div>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={cardholderName}
                                        onChange={(e) => setCardholderName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={processing}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Card Number
                                    </label>
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={processing}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={processing}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '')
                                                if (value.length <= 3) {
                                                    setCvv(value)
                                                }
                                            }}
                                            placeholder="123"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={processing}
                                        />
                                    </div>
                                </div>

                                {/* Simulation Buttons */}
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-3 text-center">
                                        Choose payment outcome:
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={handleSimulateSuccess}
                                            disabled={processing}
                                            className={`px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${processing
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
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
                                                    Simulate Success
                                                </>
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSimulateFailure}
                                            disabled={processing}
                                            className={`px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${processing
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
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
                                                    Simulate Failure
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default DummyPaymentModal
