import { useState } from 'react';
import axios from 'axios';
import { Trash2, Loader, AlertTriangle, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
    const [certificateHash, setCertificateHash] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleRevoke = async (e) => {
        e.preventDefault();
        if (!certificateHash) return;

        setLoading(true);
        setMessage(null);

        try {
            // Call backend API
            const response = await axios.post('http://localhost:5000/api/revoke', { certificateHash });
            // Simulate delay for animation
            await new Promise(r => setTimeout(r, 600));

            setMessage({ type: 'success', text: `Certificate revoked successfully! Tx: ${response.data.txHash}` });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Revocation failed' });
        }
        setLoading(false);
    };

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-lg border border-red-100 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ShieldAlert className="w-32 h-32 text-red-600" />
                </div>

                <div className="flex items-center mb-6 text-red-600 relative z-10">
                    <div className="p-3 bg-red-100 rounded-full mr-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Revoke Certificate</h2>
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-4 mb-6 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                        >
                            <p className="font-medium">{message.text}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-gray-600 mb-8 relative z-10">
                    Enter the uniquely generated Certificate Hash to permanently revoke its validity on the blockchain. <span className="font-semibold text-red-500">This action cannot be undone.</span>
                </p>

                <form onSubmit={handleRevoke} className="relative z-10">
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Certificate Hash</label>
                    <input
                        type="text"
                        required
                        value={certificateHash}
                        onChange={(e) => setCertificateHash(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-6 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none font-mono text-sm transition-all"
                    />

                    <button
                        type="submit"
                        disabled={loading || !certificateHash}
                        className={`w-full font-bold py-4 rounded-xl transition-all flex justify-center items-center shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-red-500/30 active:scale-95'}`}
                    >
                        {loading ? <Loader className="animate-spin mr-2" /> : <Trash2 className="mr-2 w-5 h-5" />}
                        Revoke Certificate
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Admin;
