import { ShieldCheck, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <ShieldCheck className="w-8 h-8 text-yellow-500" />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-600">CertifyBlock</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Empowering institutions with secure, tamper-proof credential verification using blockchain technology.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="/" className="hover:text-yellow-600 transition-colors">Home</a></li>
                            <li><a href="/issue" className="hover:text-yellow-600 transition-colors">Issue Certificate</a></li>
                            <li><a href="/verify" className="hover:text-yellow-600 transition-colors">Verify Document</a></li>
                            <li><a href="/admin" className="hover:text-yellow-600 transition-colors">Admin Portal</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-yellow-600 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-yellow-600 transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-yellow-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-yellow-600 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-yellow-600 transition-colors"><Github className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} CertifyBlock. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
