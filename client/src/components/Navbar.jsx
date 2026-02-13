import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path ? "text-yellow-600 font-semibold" : "text-gray-600 hover:text-yellow-600";

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-yellow-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <ShieldCheck className="w-8 h-8 text-yellow-500" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">CertifyBlock</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={isActive('/')}>Home</Link>

                        {user ? (
                            <>
                                <Link to="/issue" className={isActive('/issue')}>Issue</Link>
                                <Link to="/admin" className={isActive('/admin')}>Admin</Link>
                            </>
                        ) : null}

                        <Link to="/verify" className={isActive('/verify')}>Verify</Link>

                        {user ? (
                            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                                <div className="flex items-center text-sm font-medium text-gray-700">
                                    <div className="bg-yellow-100 p-1.5 rounded-full mr-2">
                                        <User className="w-4 h-4 text-yellow-700" />
                                    </div>
                                    <span className="hidden lg:inline">{user.username}</span>
                                </div>
                                <button onClick={handleLogout} className="flex items-center text-gray-500 hover:text-red-600 transition-colors" title="Logout">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-yellow-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg transition-all font-medium shadow-md hover:shadow-lg">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-yellow-600 focus:outline-none">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-yellow-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            <Link to="/" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md ${isActive('/')}`}>Home</Link>

                            {user && (
                                <>
                                    <Link to="/issue" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md ${isActive('/issue')}`}>Issue</Link>
                                    <Link to="/admin" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md ${isActive('/admin')}`}>Admin</Link>
                                </>
                            )}

                            <Link to="/verify" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md ${isActive('/verify')}`}>Verify</Link>

                            {!user ? (
                                <div className="pt-2 border-t border-gray-100 mt-2 space-y-2">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50">Login</Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full text-center px-3 py-2 rounded-md bg-yellow-500 text-white font-medium">Get Started</Link>
                                </div>
                            ) : (
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-red-600 font-medium hover:bg-red-50 mt-2">Logout</button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
