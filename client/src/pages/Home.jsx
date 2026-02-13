import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, School, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 sm:p-12 w-full max-w-7xl mx-auto">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center max-w-4xl px-4"
            >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-xs md:text-sm font-medium mb-6">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Trusted by Top Institutions
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                    Credential Verification <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 block md:inline mt-2 md:mt-0">Reimagined on Blockchain</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 px-2">
                    Issue tamper-proof certificates and allow instant, trustless verification using decentralized technology.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                    <Link to="/issue" className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center">
                        Get Started
                    </Link>
                    <Link to="/verify" className="px-8 py-3 bg-white text-gray-700 hover:text-yellow-600 font-semibold rounded-lg shadow hover:shadow-md border border-gray-200 transition-all text-center">
                        Verify a Document
                    </Link>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
                {[
                    {
                        to: "/issue",
                        title: "Issue Certificates",
                        desc: "For Universities & Institutions to issue verifiable credentials.",
                        icon: School,
                        color: "yellow"
                    },
                    {
                        to: "/verify",
                        title: "Verify Instantly",
                        desc: "For Employers to check authenticity without third parties.",
                        icon: ShieldCheck,
                        color: "orange"
                    },
                    {
                        to: "/admin",
                        title: "Admin Control",
                        desc: "Manage system parameters and revoke invalid certificates.",
                        icon: FileCheck,
                        color: "red"
                    }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                        <Link to={item.to} className={`group block h-full p-6 md:p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-${item.color}-200 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <item.icon className={`w-20 h-20 md:w-24 md:h-24 text-${item.color}-500`} />
                            </div>
                            <div className="relative z-10">
                                <div className={`p-3 bg-${item.color}-50 rounded-xl w-fit mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={`w-6 h-6 md:w-8 md:h-8 text-${item.color}-600`} />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-yellow-600 transition-colors">
                                    {item.title}
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 mb-6">
                                    {item.desc}
                                </p>
                                <div className={`flex items-center text-${item.color}-600 font-medium group-hover:translate-x-2 transition-transform text-sm md:text-base`}>
                                    Access Portal <ArrowRight className="w-4 h-4 ml-2" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Home;
