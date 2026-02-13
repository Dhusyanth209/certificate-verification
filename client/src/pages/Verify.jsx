import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CheckCircle, XCircle, UploadCloud, Loader, Shield, Search } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Verify = () => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="bg-orange-100 p-4 rounded-full inline-block mb-4">
                    <Shield className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Verify Authenticity</h1>
                <p className="text-sm md:text-base text-gray-600 mt-2 max-w-md mx-auto">Upload the document and enter the student ID to instantly verify against the blockchain.</p>
            </motion.div>
            <VerificationForm />
        </div>
    );
};

const VerificationForm = () => {
    const [studentId, setStudentId] = useState('');
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

    const verify = async () => {
        if (!file || !studentId) return alert("Please provide both file and Student ID");

        setLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('certificate', file);
        formData.append('studentId', studentId);

        try {
            const res = await axios.post('http://localhost:5000/api/certificates/verify', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Add slight delay for animation effect
            await new Promise(r => setTimeout(r, 800));
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setResult({ status: 'Error', msg: 'Verification failed or server error' });
        }
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xl border border-gray-100"
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">Student ID (Required for Salt)</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                            placeholder="e.g. AM.EN.U4.CSE19001"
                        />
                    </div>
                </div>

                <div
                    {...getRootProps()}
                    className={`border-3 border-dashed rounded-xl p-6 md:p-10 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-orange-500 bg-orange-50 scale-105' : 'border-gray-300 hover:border-gray-400 hover:bg-orange-50'}`}
                >
                    <input {...getInputProps()} />
                    {file ? (
                        <div className="flex flex-col items-center">
                            <div className="bg-red-100 p-3 rounded-full mb-3">
                                <p className="text-red-500 font-bold">PDF</p>
                            </div>
                            <p className="text-gray-800 font-semibold">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            <UploadCloud className="w-12 h-12 mb-3 text-gray-400" />
                            <p className="font-medium">Drag & drop certificate PDF</p>
                            <p className="text-sm mt-1">or click to browse</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={verify}
                    disabled={loading || !file || !studentId}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-orange-500/30'}`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <Loader className="animate-spin mr-2" /> Verifying Blockchain Record...
                        </span>
                    ) : "Verify Authenticity"}
                </button>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-8 overflow-hidden"
                    >
                        <div className={`p-6 rounded-2xl border-l-4 ${result.status === 'Valid' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                            <div className="flex items-start mb-4">
                                {result.status === 'Valid' ?
                                    <CheckCircle className="w-8 h-8 text-green-600 mr-3 flex-shrink-0" /> :
                                    <XCircle className="w-8 h-8 text-red-600 mr-3 flex-shrink-0" />
                                }
                                <div>
                                    <h3 className={`text-xl font-bold ${result.status === 'Valid' ? 'text-green-800' : 'text-red-800'}`}>
                                        Certificate is {result.status}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{result.msg}</p>

                                    {result.status !== 'Valid' && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            Double-check the <strong>Student ID</strong> and ensure you uploaded the correct <strong>original PDF</strong>.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {result.certificate && (
                                <div className="mt-4 bg-white/60 p-4 rounded-lg text-sm space-y-2 border border-gray-100">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Student Name</span>
                                        <span className="font-medium">{result.certificate.studentName}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Course</span>
                                        <span className="font-medium">{result.certificate.course}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-500">Issuer</span>
                                        <span className="font-medium">{result.certificate.issuer}</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span className="text-gray-500">Source</span>
                                        <span className={`font-mono text-xs px-2 py-0.5 rounded ${result.source === 'Blockchain' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {result.source || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Verify;
