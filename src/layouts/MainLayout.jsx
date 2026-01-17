import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Youtube,
  Instagram,
  Music2,
  Bell
} from 'lucide-react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import ResizeObserver from 'resize-observer-polyfill';
import useSocket from '../hooks/useSocket';

const SmoothScroll = ({ children }) => {
  const scrollRef = useRef(null);
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setPageHeight(entry.contentRect.height);
      }
    });
    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const transform = useTransform(scrollY, [0, pageHeight], [0, -pageHeight]);
  const spring = useSpring(transform, { damping: 20, stiffness: 150, mass: 0.5 });

  return (
    <>
      <div style={{ height: pageHeight }} />
      <motion.div
        ref={scrollRef}
        style={{ y: spring }}
        className="fixed top-0 left-0 w-full"
      >
        {children}
      </motion.div>
    </>
  );
};


const MainLayout = ({ children }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Use socket for real-time updates
  const { socket } = useSocket();

  // Fetch initial notifications
  const fetchNotifications = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      const res = await fetch(`${API_BASE}/api/notifications`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    if (socket) {
      socket.on('notification:new', (newNotif) => {
        setNotifications(prev => [newNotif, ...prev]);
        // Optional: Play sound or show toast
      });

      socket.on('notification:update', (updatedNotif) => {
        setNotifications(prev => prev.map(n => n.id === updatedNotif.id ? updatedNotif : n));
      });

      socket.on('notification:delete', ({ id }) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      });
    }

    return () => {
      if (socket) {
        socket.off('notification:new');
        socket.off('notification:update');
        socket.off('notification:delete');
      }
    };
  }, [socket]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (id) => (e) => {
    e.preventDefault();
    const scrollToElement = () => {
      const element = document.getElementById(id);
      if (element) {
        // Calculate position: element's current viewport top + current scroll + offset
        // Since SmoothScroll transforms the container, we rely on window.scrollY to track 'virtual' position
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToElement, 300); // Increased timeout to ensure page load
    } else {
      scrollToElement();
    }
  };

  const LOGO_FALLBACK =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100"><rect width="100%" height="100%" rx="16" fill="%230b0811"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23e879f9" font-family="Manrope, sans-serif" font-size="28" font-weight="800">E%26T</text><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" fill="%23e0e7ff" font-family="Manrope, sans-serif" font-size="16" font-weight="700">Production</text></svg>';

  const TRUST_BADGE_FALLBACK =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80"><defs><filter id="g"><feGaussianBlur stdDeviation="12" /></filter></defs><rect width="100%" height="100%" rx="22" fill="%230b0811"/><rect width="94%" height="72%" x="3%" y="14%" rx="18" fill="%23ec4899" opacity="0.8" filter="url(%23g)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="Manrope, sans-serif" font-size="20" font-weight="800">#1 TRUSTED STUDIO</text></svg>';

  return (
    <SmoothScroll>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-purple-600 origin-left z-50" style={{ scaleX }} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40">
          <div className="w-full px-4 md:px-8 mt-4">
            <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <div className="w-full h-16 px-3 md:px-5 flex items-center justify-between md:justify-normal gap-2 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div className="flex items-center gap-2 overflow-hidden md:justify-self-start">
                  <Link to="/" className="flex items-center gap-2 min-w-[5rem]">
                    <img
                      src="/logo.png"
                      alt="E & T Production logo"
                      className="h-16 md:h-17 w-auto object-contain drop-shadow-[0_0_10px_rgba(131,40,249,0.7)] mt-2"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = LOGO_FALLBACK;
                      }}
                    />
                  </Link>
                  <img
                    src="/1trusted.png"
                    alt="#1 Trusted Studio"
                    className="hidden md:block h-20 md:h-28 w-auto object-contain -ml-2 mt-4"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = TRUST_BADGE_FALLBACK;
                    }}
                  />
                </div>

                <nav className="flex items-center justify-center text-center md:justify-self-center mx-auto gap-3 md:gap-6 text-xs md:text-base font-semibold text-gray-200">
                  <a href="/" onClick={handleScroll('top')} className="hover:text-white transition-colors cursor-pointer">Home</a>
                  <a href="#services" onClick={handleScroll('services')} className="hover:text-white transition-colors cursor-pointer">Layanan</a>
                  <a href="#uploads" onClick={handleScroll('uploads')} className="hover:text-white transition-colors cursor-pointer">Upload</a>
                  <a href="#footer" onClick={handleScroll('contact')} className="hover:text-white transition-colors cursor-pointer">Kontak</a>
                </nav>

                <div className="flex items-center gap-2 justify-end ml-auto md:ml-0 md:justify-self-end">
                  {/* Notification System */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-gray-200 hover:text-white"
                    >
                      <Bell className="w-5 h-5 md:w-6 md:h-6" />
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0f0c16] animate-pulse" />
                      )}
                    </button>

                    {/* Dropdown */}
                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-[#1a1625] border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl z-50 origin-top-right overflow-hidden"
                        >
                          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="font-bold text-white">Notifications</h3>
                            <span className="text-xs text-gray-400">{notifications.length} updates</span>
                          </div>
                          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                              <div className="p-8 text-center text-gray-500">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No new notifications</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-white/5">
                                {notifications.map((notif, index) => (
                                  <motion.div
                                    key={notif.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 hover:bg-white/5 transition-colors relative z-10"
                                  >
                                    <div className="flex gap-3">
                                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'success' ? 'bg-green-500' :
                                        notif.type === 'warning' ? 'bg-yellow-500' :
                                          notif.type === 'error' ? 'bg-red-500' :
                                            'bg-blue-500' // info
                                        }`} />
                                      <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">{notif.title}</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">{notif.message}</p>
                                        <span className="text-[10px] text-gray-500 mt-2 block">{new Date(notif.createdAt).toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer id="footer" className="bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2">
                  <Music2 className="h-6 w-6 text-purple-600" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">E & T PRODUCTION</span>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Layanan produksi musik profesional untuk membantu mewujudkan visi kreatif Anda menjadi karya audio yang luar biasa.
                </p>
                <div className="flex space-x-4 mt-6">
                  <a href="https://youtube.com/@EANDTPRODUCTIONOFFICIAL" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a href="https://instagram.com/entproduction" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Layanan</h3>
                <ul className="mt-4 space-y-2">
                  <li><span className="text-sm text-gray-600 cursor-default dark:text-gray-400">Full Production</span></li>
                  <li><span className="text-sm text-gray-600 cursor-default dark:text-gray-400">Mixing & Mastering</span></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Perusahaan</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">Tentang Kami</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400">Portofolio</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Kontak</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <a href="https://wa.me/6285814581266" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400">WhatsApp: 0858-1458-1266</a>
                  </li>
                  <li className="flex items-start">
                    <a href="mailto:entproductionofficial@gmail.com" className="text-sm text-gray-600 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400">Email: entproductionofficial@gmail.com</a>
                  </li>

                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                &copy; 2026 E & T PRODUCTION. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
};

export default MainLayout;
