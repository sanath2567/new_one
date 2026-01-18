import { useAuth } from '../context/AuthContext'

const Debug = () => {
    const { user } = useAuth()

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Debug User Info</h1>
            <div className="glass-card p-6">
                <pre className="bg-gray-100 p-4 rounded overflow-auto">
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default Debug
