import { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, Loader, FileText, User, Hash, School, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const Issue = () => {
    const [formData, setFormData] = useState({
        studentName: '',
        studentId: '',
        course: '',
        issuer: 'Amrita Vishwa Vidyapeetham' // Default
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please upload a certificate PDF");

        setLoading(true);
        setError(null);
        setResult(null);

        const data = new FormData();
        data.append('studentName', formData.studentName);
        data.append('studentId', formData.studentId);
        data.append('course', formData.course);
        data.append('issuer', formData.issuer);
        data.append('certificate', file);

        try {
            const res = await axios.post('http://localhost:5000/api/certificates/issue', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || 'Issuance failed');
        }
        setLoading(false);
    };

    return (
        <div className="flex-grow flex items-center justify-center p-6 w-full max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row"
            >
                {/* Left Side: Form */}
                <div className="p-8 md:w-3/5">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Issue Certificate</h2>
                        <p className="text-gray-500 mt-2">Enter student details and upload the certificate file.</p>
                    </div>

                    {error && (
                        <div className="p-4 mb-6 rounded-lg bg-red-50 text-red-700 flex items-center border border-red-100">
                            <AlertCircle className="mr-2 w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    name="studentName"
                                    placeholder="Student Name"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    name="studentId"
                                    placeholder="Student ID / Reg No"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                <input
                                    name="course"
                                    placeholder="Course / Degree Program"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Certificate (PDF)</label>
                            <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-yellow-50 hover:border-yellow-400 transition-all group">
                                <div className="flex flex-col items-center justify-center pt-7 pb-6">
                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-yellow-500 transition-colors mb-2" />
                                    <p className="text-sm text-gray-500 group-hover:text-gray-700">
                                        {file ? <span className="text-yellow-600 font-medium">{file.name}</span> : "Click to upload PDF"}
                                    </p>
                                </div>
                                <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/30 flex justify-center items-center"
                        >
                            {loading ? <Loader className="animate-spin mr-2" /> : "Issue Certificate on Blockchain"}
                        </button>
                    </form>
                </div>

                {/* Right Side: Result / Info */}
                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-8 md:w-2/5 text-white flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <School className="w-64 h-64" />
                    </div>

                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative z-10"
                        >
                            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                                <div className="flex items-center mb-4 text-white">
                                    <CheckCircle className="w-6 h-6 mr-2" />
                                    <h3 className="text-lg font-bold">Success!</h3>
                                </div>
                                <p className="text-yellow-50 text-sm mb-4">Certificate successfully anchored on the blockchain.</p>

                                <div className="space-y-3">
                                    <div className="bg-black/20 p-3 rounded-lg">
                                        <p className="text-xs text-yellow-200 uppercase tracking-wider mb-1">Items Generated</p>
                                        <div className="flex items-center space-x-2 text-sm font-mono">
                                            <Hash className="w-4 h-4" />
                                            <span className="truncate">Hash: {result.certificateHash.substring(0, 16)}...</span>
                                        </div>
                                    </div>

                                    {result.qrCode && (
                                        <div className="bg-white p-4 rounded-lg flex flex-col items-center">
                                            <img src={result.qrCode} alt="QR Code" className="w-32 h-32 mb-2" />
                                            <p className="text-xs text-gray-500">Scan to Verify</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="relative z-10 text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-4">Secure Issuance</h3>
                            <ul className="space-y-3 text-yellow-50">
                                <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-yellow-200" /> Double SHA-256 Hashing</li>
                                <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-yellow-200" /> IPFS Storage Integration</li>
                                <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-yellow-200" /> Immutable Records</li>
                                <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-yellow-200" /> Instant QR Verification</li>
                            </ul>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Issue;
