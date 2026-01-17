import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Music,
  Headphones,
  Mic,
  Palette,
  Play,
  ArrowRight,
  Star,
  Users,
  CheckCircle,
  Sparkles,
  Waves,
  Shield,
  Clock,
  ShoppingCart,
  Menu,
  Gift,
  ChevronDown,
  CreditCard,
  MessageCircle,
  Instagram,
} from 'lucide-react';
import { Card } from '../components';
import { motion } from 'framer-motion';

const HomePage = () => {
  // Auth logic removed

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Referrals', href: '/referrals' },
  ];

  const moreMenu = [
    { label: 'FAQ', href: '/faq' },
    { label: 'Status', href: '/status' },
    { label: 'Legal', href: '/legal' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Support Discord', href: 'https://discord.gg/Y7utxgaa3Z', external: true },
  ];

  const staticServices = useMemo(
    () => [
      {
        title: 'Mixing & Mastering',
        description: 'Balancing, EQ, compression, dan loudness standar industri untuk rilis digital.',
        price: 300000,
        features: ['Balancing Level & Panning', 'EQ & Compression', '2x Revisi Gratis'],
        popular: false,
      },
      {
        title: 'Full Production',
        description: 'Produksi lengkap dari komposisi, aransemen, inisial, hingga mixing & mastering.',
        price: 150000,
        features: ['Komposisi & Aransemen', 'Free Inisial Profesional', 'Mixing & Mastering', '2x Revisi Gratis'],
        popular: true,
      },
      {
        title: 'Inisial Music',
        description: 'Free Mixing & Mastering Profesional, dan efek vokal yang natural.',
        price: 20000,
        features: ['Profesional', 'Efek Vokal', '0x Revisi Gratis'],
        popular: false,
      },
    ],
    []
  );

  const [services, setServices] = useState(staticServices);

  const testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Musisi Indie',
      content: 'Kualitas produksi yang luar biasa! Lagu saya terdengar profesional dan sesuai dengan visi saya.',
      rating: 5,
    },
    {
      name: 'Siti Rahma',
      role: 'Content Creator',
      content: 'Prosesnya cepat dan hasilnya memuaskan. Tim sangat responsif dan profesional.',
      rating: 5,
    },
    {
      name: 'Andi Pratama',
      role: 'Podcaster',
      content: 'Audio yang dihasilkan sangat bersih dan profesional. Saya akan menggunakan layanan ini lagi.',
      rating: 5,
    },
  ];

  const paymentMethods = [
    'Visa',
    'Mastercard',
    'PayPal',
    'Apple Pay',
    'GPay',
    'Stripe',
    'Bitcoin',
    'Klarna',
  ];

  const musicDrops = [
    { left: '5%', delay: '0s', duration: '13s', size: '22px' },
    { left: '18%', delay: '2s', duration: '11s', size: '20px' },
    { left: '28%', delay: '4s', duration: '12s', size: '24px' },
    { left: '40%', delay: '1s', duration: '15s', size: '19px' },
    { left: '52%', delay: '3.5s', duration: '12s', size: '22px' },
    { left: '63%', delay: '0.8s', duration: '13.5s', size: '20px' },
    { left: '72%', delay: '2.8s', duration: '11.5s', size: '23px' },
    { left: '85%', delay: '1.4s', duration: '14s', size: '21px' },
    { left: '12%', delay: '6s', duration: '13s', size: '20px' },
    { left: '34%', delay: '7s', duration: '12s', size: '22px' },
    { left: '56%', delay: '5.5s', duration: '11.5s', size: '24px' },
    { left: '78%', delay: '6.5s', duration: '13.5s', size: '21px' },
    { left: '90%', delay: '4.2s', duration: '14s', size: '23px' },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const mergeServices = (source = []) => {
    const lower = source.map((s) => ({ ...s, _t: (s.title || '').toLowerCase() }));
    const findMatch = (title) => {
      const t = title.toLowerCase();
      if (t.includes('mix')) return lower.find((s) => s._t.includes('mix'));
      if (t.includes('full')) return lower.find((s) => s._t.includes('full'));
      if (t.includes('inisial') || t.includes('initial')) return lower.find((s) => s._t.includes('inisial') || s._t.includes('initial'));
      return lower.find((s) => s._t === t);
    };

    return staticServices.map((tpl) => {
      const match = findMatch(tpl.title);
      const price = Number(match?.price ?? tpl.price);
      return {
        ...tpl,
        ...match,
        price: Number.isFinite(price) ? price : match?.price || tpl.price,
        features: match?.features || tpl.features,
      };
    });
  };

  const defaultFeatures = useMemo(
    () => ({
      'Mixing & Mastering': ['Balancing Level & Panning', 'EQ & Compression', '2x Revisi Gratis'],
      'Full Production': ['Komposisi & Aransemen', 'Free Inisial Profesional', 'Mixing & Mastering', '2x Revisi Gratis'],
      'Inisial Music': ['Profesional', 'Efek Vokal', '0x Revisi Gratis'],
    }),
    []
  );

  useEffect(() => {
    const loadServices = async () => {
      try {
        // Try backend API for services (requires update to backend to support this if removed, but we removed it. 
        // Actually we removed /api/services in backend. So this will fail.
        // We will default to staticServices immediately.)
        /*
        const res = await fetch(`${API_BASE}/api/services`);
        if (res.ok) {
           // ... logic
        }
        */
      } catch (err) {
        // ...
      }

      // Default to static
      setServices(staticServices);
    };

    loadServices();
  }, [API_BASE, staticServices]);

  const formatPrice = (price) => {
    const num = Number(price);
    if (Number.isFinite(num)) return `Rp ${num.toLocaleString('id-ID')}`;
    if (typeof price === 'string') return price;
    return 'Rp 0';
  };
  const [videoError, setVideoError] = useState('');

  const avatarLetter = 'A';

  const LOGO_FALLBACK =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100"><rect width="100%" height="100%" rx="16" fill="%230b0811"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23e879f9" font-family="Manrope, sans-serif" font-size="28" font-weight="800">E%26T</text><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" fill="%23e0e7ff" font-family="Manrope, sans-serif" font-size="16" font-weight="700">Production</text></svg>';

  const TRUST_BADGE_FALLBACK =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="80"><defs><filter id="g"><feGaussianBlur stdDeviation="12" /></filter></defs><rect width="100%" height="100%" rx="22" fill="%230b0811"/><rect width="94%" height="72%" x="3%" y="14%" rx="18" fill="%23ec4899" opacity="0.8" filter="url(%23g)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="Manrope, sans-serif" font-size="20" font-weight="800">#1 TRUSTED STUDIO</text></svg>';

  useEffect(() => {
    const decode = (txt) =>
      txt
        ? txt
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
        : '';

    const fetchYoutube = async () => {
      const apiBase = import.meta.env.VITE_API_BASE_URL || '';
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      setLoadingVideos(true);
      setVideoError('');

      const mapItems = (items = []) =>
        items.map((item) => ({
          id: item.id?.videoId || item.id,
          title: decode(item.title || item.snippet?.title || 'Tanpa judul'),
          description: decode(item.description || item.snippet?.description || ''),
          thumbnail:
            item.thumbnail ||
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.default?.url,
          published: item.published
            ? new Date(item.published).toLocaleDateString('id-ID')
            : item.snippet?.publishedAt
              ? new Date(item.snippet.publishedAt).toLocaleDateString('id-ID')
              : '',
          views: item.views || item.statistics?.viewCount ? Number(item.statistics.viewCount) : 0,
          likes: item.likes || item.statistics?.likeCount ? Number(item.statistics.likeCount) : 0,
        }));

      // Try backend first
      try {
        const res = await fetch(`${apiBase}/api/youtube/latest`);
        if (res.ok) {
          const data = await res.json();
          const mapped = mapItems(data.items);
          if (mapped.length) {
            setVideos(mapped);
            setLoadingVideos(false);
            return;
          }
        } else {
          throw new Error('Backend not OK');
        }
      } catch (err) {
        // fallback next
      }

      // Fallback to direct YouTube API if key provided
      if (apiKey) {
        try {
          const channelRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=id&maxResults=1&type=channel&q=EANDTPRODUCTIONOFFICIAL&key=${apiKey}`
          );
          const channelData = await channelRes.json();
          const channelId = channelData?.items?.[0]?.id?.channelId;
          const searchParams = new URLSearchParams({
            part: 'snippet',
            order: 'date',
            maxResults: '6',
            type: 'video',
            channelId: channelId || '',
            key: apiKey,
          });
          const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`);
          let mapped = [];
          if (res.ok) {
            const data = await res.json();
            mapped = mapItems(data.items);
          }

          // fetch stats for those video ids
          const ids = mapped.map((v) => v.id).join(',');
          if (ids) {
            const statsParams = new URLSearchParams({
              part: 'statistics',
              id: ids,
              key: apiKey,
            });
            const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?${statsParams.toString()}`);
            if (statsRes.ok) {
              const statsData = await statsRes.json();
              const statsMap = {};
              (statsData.items || []).forEach((it) => {
                statsMap[it.id] = {
                  views: it.statistics?.viewCount ? Number(it.statistics.viewCount) : 0,
                  likes: it.statistics?.likeCount ? Number(it.statistics.likeCount) : 0,
                };
              });
              mapped = mapped.map((v) => ({
                ...v,
                views: statsMap[v.id]?.views ?? v.views,
                likes: statsMap[v.id]?.likes ?? v.likes,
              }));
            }
          }

          if (mapped.length) {
            setVideos(mapped);
            setLoadingVideos(false);
            return;
          }
        } catch (err) {
          // ignore, fallback to error msg
        }
      }

      setVideoError('Tidak bisa memuat video. Pastikan backend /api/youtube/latest aktif atau set VITE_YOUTUBE_API_KEY.');
      setLoadingVideos(false);
    };

    fetchYoutube();
  }, []);

  return (
    <div className="min-h-screen text-white relative bg-black">
      {/* Global Animated Particles & Gradients */}


      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0">

          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "url('https://images.squarespace-cdn.com/content/v1/67cebcc3df9e991140fd9d47/0e124e84-f903-4307-8f23-3126501859ba/ORW09509.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'saturate(1.2) brightness(1.3)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)'
            }}
          />
          {/* Animated particles removed from here to move global */}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative max-w-5xl mx-auto px-4 lg:px-6 pt-28 pb-16 flex flex-col items-center text-center gap-8"
        >
          <motion.div variants={scaleIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_18px_rgba(139,92,246,0.35)] backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Produser Teratas
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight max-w-4xl"
          >
            Produksi Musik{' '}
            <span className="relative inline-block">
              <span className="shine-text relative z-10">Profesional</span>
              <span className="absolute bottom-1 left-0 right-0 h-2 bg-gradient-to-r from-primary to-blue-500 opacity-70 blur-[2px]"></span>
            </span>{' '}
            Untuk Semua Kebutuhan Anda
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-200/80 max-w-2xl">
            Wujudkan karya audio impian Anda dengan kualitas produksi musik terbaik. Dari mixing hingga full production, kami siap membantu.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl justify-center items-stretch sm:items-center mx-auto">
            <a href="https://wa.me/6285814581266" target="_blank" rel="noopener noreferrer" className="btn-neon rounded-[14px] text-base md:text-lg font-black w-full sm:w-auto justify-center min-h-[52px] px-5 md:px-6">
              Pesan Sekarang
              <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full flex flex-col gap-4 overflow-hidden">
            <p className="text-sm text-gray-400 font-semibold uppercase tracking-wide text-center">Metode Pembayaran</p>
            <div className="relative w-full overflow-hidden rounded-xl border border-purple-500/30 bg-white/5 py-3 max-w-4xl mx-auto shadow-[0_0_30px_rgba(139,92,246,0.4)]">
              <div className="flex items-center gap-4 pay-scroll w-max">
                {[0, 1, 2, 3].map((idx) => (
                  <img
                    key={idx}
                    src="/payment.png"
                    alt="Metode pembayaran"
                    className="h-12 md:h-10 w-auto flex-shrink-0 select-none pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] max-w-none"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="services" className="py-16 md:py-20 relative">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-sm text-primary uppercase tracking-[0.3em] mb-2">Layanan</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold">Semua Yang Anda Butuhkan</motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 mt-3 max-w-2xl mx-auto">
              Paket fleksibel dengan kualitas produksi kelas dunia, dari ide mentah sampai rilis.
            </motion.p>
          </motion.div>

          <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x md:snap-none gap-4 md:gap-7 items-stretch pb-4 md:pb-0 custom-scrollbar md:custom-none">
            {services.map((service, idx) => {
              const basePath =
                service.title === 'Mixing & Mastering'
                  ? '/order/new/mastering'
                  : service.title === 'Full Production'
                    ? '/order/new/production'
                    : '/order/new/initial';

              const params = new URLSearchParams();
              if (service.id) params.set('serviceId', service.id);
              params.set('serviceTitle', service.title);
              if (service.price) params.set('servicePrice', Number(service.price) || service.price);

              const orderLink = `${basePath}?${params.toString()}`;

              return (
                <motion.div
                  key={service.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0, transition: { delay: idx * 0.2, duration: 0.5 } }
                  }}
                  className={`relative overflow-hidden h-full flex flex-col rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg p-7 pt-10 space-y-5 transition-transform hover:-translate-y-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] min-w-[280px] md:min-w-0 snap-center ${service.popular ? 'ring-2 ring-primary/80 scale-[1.01]' : ''
                    }`}
                >
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  {service.popular && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center pointer-events-none">
                      <div className="bg-primary text-white px-5 py-1 rounded-full text-xs font-black tracking-wide shadow-lg">
                        Paling Laris
                      </div>
                    </div>
                  )}
                  {!service.popular && idx === 1 && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center pointer-events-none">
                      <div className="bg-white/10 text-white px-5 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/20">
                        Best Value
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/50 to-blue-500/60 flex items-center justify-center shadow-inner">
                      {service.title.includes('Mix') ? (
                        <Headphones className="h-5 w-5" />
                      ) : service.title.includes('Vocal') ? (
                        <Mic className="h-5 w-5" />
                      ) : (
                        <Palette className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <p className="text-gray-300">{service.description}</p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary">{formatPrice(service.price)}</span>
                    <span className="text-gray-400 text-sm">/ per lagu</span>
                  </div>

                  <ul className="space-y-3">
                    {(service.features || defaultFeatures[service.title] || []).map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-gray-200">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <a
                      href={`https://wa.me/6285814581266?text=Halo E %26 T Production, saya ingin memesan layanan ${encodeURIComponent(service.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[50px] rounded-[14px] text-base font-semibold flex items-center justify-center gap-2 btn-glass"
                    >
                      Pesan Sekarang
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      <section id="uploads" className="py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[#0f0c16]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-purple-300 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Official Channel
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                E & T <span className="text-primary drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">PRODUCTION</span>
              </h2>
              <p className="mt-3 text-gray-400 max-w-xl text-sm md:text-base leading-relaxed">
                Koleksi video terbaru, showcase project, dan highlight viral langsung dari YouTube Official kami.
              </p>
            </div>

            <a
              href="https://www.youtube.com/@EANDTPRODUCTIONOFFICIAL"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-red-600/10 hover:border-red-500/50 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 text-white fill-current" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 group-hover:text-red-300 transition-colors">Subscribe Now</p>
                <p className="text-sm font-bold text-white">@EANDTPRODUCTIONOFFICIAL</p>
              </div>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 min-h-[500px]">
            {/* Main Highlight Video */}
            <div className="lg:col-span-8 relative group rounded-3xl overflow-hidden border border-white/10 bg-[#15121e] shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-video lg:aspect-auto">
              {videos[0] ? (
                <a
                  href={`https://www.youtube.com/watch?v=${videos[0].id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full relative"
                >
                  <div className="absolute inset-0 bg-gray-900 animate-pulse" /> {/* Skeleton placeholder underneath */}
                  <img
                    src={videos[0].thumbnail}
                    alt={videos[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c16] via-[#0f0c16]/40 to-transparent opacity-90" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                      <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                        #1 Highlight
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-gray-300 bg-black/40 px-2 py-0.5 md:px-3 md:py-1 rounded-lg backdrop-blur-md border border-white/5">
                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {videos[0].published}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 line-clamp-2 leading-tight drop-shadow-lg">
                      {videos[0].title}
                    </h3>

                    <div className="hidden md:block mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75 relative z-20">
                      <p className="text-gray-300 text-sm md:text-base line-clamp-3 bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-white/10">
                        {videos[0].description.length > 150
                          ? videos[0].description.slice(0, 150) + '...'
                          : videos[0].description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm font-medium text-gray-300 border-t border-white/10 pt-3 md:pt-4">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-400" />
                        <span>{videos[0].views ? videos[0].views.toLocaleString() : '0'}</span>
                        <span className="text-gray-500 hidden sm:inline">Views</span>
                      </div>
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-500 fill-current" />
                          ))}
                        </div>
                        <span className="text-yellow-500">{videos[0].likes ? videos[0].likes.toLocaleString() : '0'}</span>
                        <span className="text-gray-500 hidden sm:inline">Likes</span>
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-10 text-center bg-white/5">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 animate-pulse">
                    <Play className="w-6 h-6 opacity-50" />
                  </div>
                  <p className="text-lg font-medium">{loadingVideos ? 'Sedang memuat highlight...' : 'Video tidak ditemukan'}</p>
                  {videoError && <p className="text-xs text-red-400 mt-2 max-w-xs mx-auto">{videoError}</p>}
                </div>
              )}
            </div>

            {/* Sidebar List */}
            <div className="lg:col-span-4 flex flex-col h-full gap-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Terbaru & Terkurasi
                </h3>
                <span className="text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded">
                  {videos.length > 1 ? `${videos.length - 1} Video Lainnya` : '0 Video'}
                </span>
              </div>

              <div className="flex flex-row overflow-x-auto gap-4 pb-4 snap-x lg:flex-col lg:overflow-y-auto lg:pr-1 lg:space-y-3 lg:pb-0 custom-scrollbar max-h-none lg:max-h-[500px]">
                {videos.slice(1, 5).map((video, idx) => (
                  <a
                    key={video.id || idx}
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col min-w-[220px] w-[220px] snap-center rounded-xl bg-transparent border-0 lg:flex-row lg:w-full lg:gap-4 lg:p-3 lg:bg-white/5 lg:border lg:border-white/5 lg:hover:bg-white/10 lg:hover:border-purple-500/30 transition-all duration-300 lg:hover:-translate-x-1"
                  >
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg lg:w-32 lg:h-20 lg:aspect-auto flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 lg:w-6 lg:h-6 text-white fill-current drop-shadow-md" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 py-2 lg:py-0.5">
                      <h4 className="text-sm font-bold text-gray-200 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors mb-1.5">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {video.published}
                        </span>
                        <span className="flex items-center gap-1">
                          <Play className="w-3 h-3" /> {video.views ? Number(video.views).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}

                {!loadingVideos && videos.length <= 1 && !videoError && (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-gray-500 text-sm w-full">
                    Belum ada video tambahan saat ini.
                  </div>
                )}
              </div>

              <a
                href="https://www.youtube.com/@EANDTPRODUCTIONOFFICIAL/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-full py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-center hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
              >
                Lihat Semua Video <ArrowRight className="w-3 h-3 inline ml-1 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* 
      <section className="py-16 md:py-20 bg-[#0f0c16]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <p className="text-sm text-primary uppercase tracking-[0.3em] mb-2">Keunggulan</p>
            <h2 className="text-3xl md:text-4xl font-bold">Kenapa Pilih Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Music, title: 'Produksi Lengkap', text: 'Dari komposisi hingga mastering dalam satu alur terpadu.' },
              { icon: Shield, title: 'Standar Industri', text: 'Mix & master mengikuti referensi komersial & loudness modern.' },
              { icon: Clock, title: 'Proses Gesit', text: 'Timeline jelas, revisi cepat, komunikasi transparan.' },
              { icon: Palette, title: 'Karakter Unik', text: 'Sound design yang disesuaikan dengan estetika brand Anda.' },
            ].map((item) => (
              <div key={item.title} className="glass-panel rounded-2xl p-6 space-y-3 border border-white/10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/60 to-blue-500/60 flex items-center justify-center">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* <section id="testimonials" className="py-20 bg-[#0b0811]">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <p className="text-sm text-primary uppercase tracking-[0.3em] mb-2">Testimoni</p>
              <h2 className="text-3xl md:text-4xl font-bold">Didengar &amp; Disukai Klien</h2>
            </div>
            <div className="flex items-center gap-2 text-primary">
              <Star className="h-5 w-5 fill-current" />
              <p className="font-semibold">4.9 / 5.0 rating</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="glass-panel rounded-2xl hover:-translate-y-1 transition-transform" glass>
                <Card.Content className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-200 leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      <section id="contact" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#08041b] via-transparent to-transparent opacity-80" />
        <div className="relative max-w-6xl mx-auto px-4 lg:px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-12"
          >
            <motion.p variants={fadeInUp} className="text-sm text-primary uppercase tracking-[0.3em] mb-2">Hubungi Kami</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-white">Siap Memulai Proyek Anda?</motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 mt-3 max-w-2xl mx-auto">
              Konsultasikan kebutuhan musik Anda atau sekadar menyapa. Kami siap membantu mewujudkan visi audio Anda.
            </motion.p>
          </motion.div>

          <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x md:snap-none gap-4 md:gap-6 max-w-4xl mx-auto pb-4 md:pb-0 custom-scrollbar md:custom-none justify-start md:justify-center">
            {/* WhatsApp */}
            {/* WhatsApp */}
            <motion.a
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              href="https://wa.me/6285814581266"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-green-500/50 hover:bg-green-500/10 min-w-[250px] md:min-w-0 snap-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">WhatsApp</h3>
              <p className="text-sm text-gray-400 mb-2">Chat Langsung</p>
              <p className="text-green-400 font-semibold">0858-1458-1266</p>
            </motion.a>

            {/* Email */}
            <motion.a
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              href="mailto:entproductionofficial@gmail.com"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-red-500/50 hover:bg-red-500/10 min-w-[250px] md:min-w-0 snap-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Email</h3>
              <p className="text-sm text-gray-400 mb-2">Kirim Pesan</p>
              <p className="text-red-400 font-semibold text-sm break-all">entproductionofficial@gmail.com</p>
            </motion.a>

            {/* Instagram */}
            <motion.a
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              href="https://instagram.com/entproduction"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-pink-500/50 hover:bg-pink-500/10 min-w-[250px] md:min-w-0 snap-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Instagram className="h-6 w-6 text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Instagram</h3>
              <p className="text-sm text-gray-400 mb-2">Ikuti Kami</p>
              <p className="text-pink-400 font-semibold">@entproduction</p>
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
