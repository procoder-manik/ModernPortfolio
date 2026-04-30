import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Camera, Calendar, MapPin, Sparkles, Phone, Mail, Instagram, ArrowRight, Star, Heart, Award, Play, ChevronDown } from 'lucide-react';

// Custom Cursor Component
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Track hoverable elements
    const hoverables = document.querySelectorAll('a, button, [data-hoverable]');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => setIsHovering(true));
      el.addEventListener('mouseleave', () => setIsHovering(false));
    });

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="cursor-dot"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isHovering ? 2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        style={{ opacity: isVisible ? 1 : 0 }}
      />
      <motion.div
        className={`cursor-ring ${isHovering ? 'hovering' : ''}`}
        animate={{
          x: position.x - 20,
          y: position.y - 20,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        style={{ opacity: isVisible ? 1 : 0 }}
      />
    </>
  );
}

// Particle Background
function ParticleBackground() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(${168 + Math.random() * 50}, ${85 + Math.random() * 50}, ${247 - Math.random() * 50}, ${0.3 + Math.random() * 0.4})`,
          }}
          animate={{
            y: [0, -window.innerHeight * 0.8],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// Scroll Progress Bar
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}

// 3D Tilt Card
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    setRotateX((mouseY / (rect.height / 2)) * -10);
    setRotateY((mouseX / (rect.width / 2)) * 10);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic Button
function MagneticButton({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    setPosition({ x: distanceX * 0.3, y: distanceY * 0.3 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <motion.button
      ref={ref}
      className={`magnetic-btn ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      {children}
    </motion.button>
  );
}

// Reveal on Scroll Component
function RevealOnScroll({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container
function StaggerContainer({ children, className = '', staggerDelay = 0.1 }: { children: React.ReactNode; className?: string; staggerDelay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Main App
function App() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const navItems = ['About', 'Experience', 'Gallery', 'Booking'];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <CustomCursor />
      <ScrollProgress />
      <div className="grain-overlay" />
      <div className="mesh-gradient" />

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="floating-orb w-[500px] h-[500px] bg-purple-600/20 top-[-100px] left-[-100px]" />
        <div className="floating-orb w-[400px] h-[400px] bg-pink-600/15 top-[30%] right-[-50px]" style={{ animationDelay: '-5s' }} />
        <div className="floating-orb w-[350px] h-[350px] bg-blue-600/15 bottom-[10%] left-[20%]" style={{ animationDelay: '-10s' }} />
      </div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="glass-strong mx-4 mt-4 rounded-2xl">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <motion.a
                href="#"
                className="flex items-center space-x-3 group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <Camera className="h-6 w-6 text-purple-400" />
                  <motion.div
                    className="absolute inset-0 bg-purple-400/50 blur-lg rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span className="text-lg font-light">
                  <span className="font-semibold">James R. Cobb</span>
                  <span className="text-purple-400">.</span>
                </span>
              </motion.a>

              <div className="hidden md:flex space-x-1">
                {navItems.map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="px-5 py-2 text-sm text-gray-400 hover:text-white transition-colors relative group"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i + 0.3 }}
                    data-hoverable
                  >
                    <span className="relative z-10">{item}</span>
                    <motion.span
                      className="absolute inset-0 bg-white/5 rounded-full"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="about" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <ParticleBackground />

        {/* Floating Photo Cards */}
        <motion.div
          className="absolute top-32 right-[12%] w-36 h-48 rounded-2xl overflow-hidden shadow-2xl hidden lg:block z-10"
          style={{ y: heroY }}
          initial={{ opacity: 0, rotate: 20, x: 100 }}
          animate={{ opacity: 0.8, rotate: 8, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
          data-hoverable
        >
          <img src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-[8%] w-32 h-44 rounded-2xl overflow-hidden shadow-2xl hidden lg:block z-10"
          style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }}
          initial={{ opacity: 0, rotate: -15, x: -100 }}
          animate={{ opacity: 0.7, rotate: -6, x: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
          data-hoverable
        >
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 to-transparent" />
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-[5%] w-28 h-40 rounded-2xl overflow-hidden shadow-2xl hidden lg:block z-10"
          style={{ y: useTransform(scrollY, [0, 500], [0, 80]) }}
          initial={{ opacity: 0, rotate: 25, x: 80 }}
          animate={{ opacity: 0.6, rotate: 12, x: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
          data-hoverable
        >
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{ opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full glass mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </motion.div>
            <span className="text-sm text-gray-300">Professional Senior Photography</span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.9]">
            <div className="overflow-hidden">
              <motion.span
                className="block text-white"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                Senior Photos
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span
                className="block text-gradient mt-2"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                by James R. Cobb
              </motion.span>
            </div>
          </h1>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Welcome to the stunning senior pictures gallery showcasing the artistry and creativity of professional senior portraits.
            James specializes in creating beautiful and timeless senior photos that celebrate this milestone moment in your life.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <MagneticButton
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-10 py-4 text-lg font-medium rounded-full shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-shadow"
              data-hoverable
            >
              <Calendar className="mr-2 h-5 w-5 inline" />
              Book Your Session
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </MagneticButton>
            <MagneticButton
              className="glass text-white px-10 py-4 text-lg font-medium rounded-full hover:bg-white/10 transition-colors"
              data-hoverable
            >
              <Play className="mr-2 h-5 w-5 inline" />
              View Gallery
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="w-7 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-3 bg-white/50 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <ChevronDown className="h-5 w-5 text-white/30 mx-auto mt-2" />
        </motion.div>
      </section>

      {/* Professional Experience Section */}
      <section id="experience" className="relative py-32 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Image Side */}
            <RevealOnScroll>
              <div className="relative">
                <TiltCard className="relative z-10">
                  <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80"
                      alt="Photographer at work"
                      className="w-full aspect-[4/5] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent" />
                  </div>
                </TiltCard>

                {/* Floating Stats Card */}
                <motion.div
                  className="absolute -bottom-8 -right-8 z-20 glass-strong rounded-2xl p-6 shadow-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  data-hoverable
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Award className="h-8 w-8 text-white" />
                    </motion.div>
                    <div>
                      <motion.p
                        className="text-4xl font-bold text-gradient"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        15+
                      </motion.p>
                      <p className="text-sm text-gray-400">Years Experience</p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Blobs */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl -z-10 morph-blob" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl -z-10 morph-blob" style={{ animationDelay: '-4s' }} />
              </div>
            </RevealOnScroll>

            {/* Content Side */}
            <div>
              <RevealOnScroll delay={0.1}>
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sparkles className="h-7 w-7 text-white" />
                  </motion.div>
                  <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">Expertise</span>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Professional Senior<br />
                  <span className="text-gradient">Photographer Experience</span>
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={0.3}>
                <p className="text-lg text-gray-400 leading-relaxed mb-10">
                  Our senior photographer brings years of experience and artistic vision to every senior session,
                  creating beautiful senior pictures that stand the test of time. We understand that choosing the
                  right senior photographer is crucial for capturing portraits that reflect your unique personality
                  and style.
                </p>
              </RevealOnScroll>

              {/* Stats Grid */}
              <StaggerContainer className="grid grid-cols-3 gap-6" staggerDelay={0.1}>
                {[
                  { value: '500+', label: 'Seniors' },
                  { value: '50+', label: 'Locations' },
                  { value: '100%', label: 'Satisfaction' }
                ].map((stat, i) => (
                  <StaggerItem key={i}>
                    <div className="text-center p-4 glass rounded-2xl hover:bg-white/5 transition-colors" data-hoverable>
                      <motion.p
                        className="text-4xl font-bold text-gradient-gold mb-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        {stat.value}
                      </motion.p>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Session Planning Section */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-3 mb-6">
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Calendar className="h-7 w-7 text-white" />
                </motion.div>
                <span className="text-pink-400 text-sm font-medium tracking-widest uppercase">The Process</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Senior Session Planning<br />
                <span className="text-gradient">and Photoshoot Experience</span>
              </h2>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {[
              {
                step: '01',
                title: 'Consultation',
                desc: 'Every senior session is carefully planned to ensure a comfortable and enjoyable experience that produces beautiful senior pictures.',
                gradient: 'from-purple-600 to-indigo-600',
                icon: Phone
              },
              {
                step: '02',
                title: 'Planning',
                desc: 'Our senior photographer works closely with each senior to discuss location preferences, outfit choices, and portrait styles.',
                gradient: 'from-pink-600 to-rose-600',
                icon: MapPin
              },
              {
                step: '03',
                title: 'The Shoot',
                desc: 'A positive experience during your senior session translates into more natural and confident senior photos that truly capture your personality.',
                gradient: 'from-orange-500 to-amber-500',
                icon: Camera
              }
            ].map((item, i) => (
              <StaggerItem key={i}>
                <TiltCard>
                  <div className="group glass rounded-3xl p-8 h-full relative overflow-hidden hover:bg-white/5 transition-all duration-500" data-hoverable>
                    {/* Step Number */}
                    <div className={`text-7xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent opacity-20 mb-4`}>
                      {item.step}
                    </div>

                    {/* Icon */}
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="h-7 w-7 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>

                    {/* Bottom Gradient Line */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Artistic Vision Section */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Content Side */}
            <div className="order-2 lg:order-1">
              <RevealOnScroll>
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <Camera className="h-7 w-7 text-white" />
                  </motion.div>
                  <span className="text-blue-400 text-sm font-medium tracking-widest uppercase">Artistry</span>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Beautiful Senior Portraits<br />
                  <span className="text-gradient">and Artistic Vision</span>
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <p className="text-lg text-gray-400 leading-relaxed mb-10">
                  Our senior portraits are crafted with artistic vision and technical expertise to create beautiful
                  pictures that exceed expectations. Each portrait session is approached with creativity and attention
                  to detail, ensuring your senior photos are both beautiful and meaningful.
                </p>
              </RevealOnScroll>

              {/* Feature List */}
              <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                {[
                  'Professional lighting setups',
                  'Creative composition techniques',
                  'Expert post-processing',
                  'High-resolution deliverables'
                ].map((feature, i) => (
                  <StaggerItem key={i}>
                    <motion.div
                      className="flex items-center space-x-4 group"
                      whileHover={{ x: 10 }}
                      data-hoverable
                    >
                      <motion.div
                        className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Heart className="h-4 w-4 text-white" />
                      </motion.div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Image Grid Side */}
            <div className="order-1 lg:order-2">
              <RevealOnScroll delay={0.2}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <motion.div
                      className="rounded-2xl overflow-hidden shadow-xl"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                      data-hoverable
                    >
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                        alt="Portrait sample"
                        className="w-full aspect-[3/4] object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </motion.div>
                    <motion.div
                      className="rounded-2xl overflow-hidden shadow-xl"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                      data-hoverable
                    >
                      <img
                        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80"
                        alt="Portrait sample"
                        className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <motion.div
                      className="rounded-2xl overflow-hidden shadow-xl"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                      data-hoverable
                    >
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80"
                        alt="Portrait sample"
                        className="w-full aspect-square object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </motion.div>
                    <motion.div
                      className="rounded-2xl overflow-hidden shadow-xl"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                      data-hoverable
                    >
                      <img
                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80"
                        alt="Portrait sample"
                        className="w-full aspect-[3/4] object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </motion.div>
                  </div>
                </div>
              </RevealOnScroll>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl morph-blob" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl morph-blob" style={{ animationDelay: '-4s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Why Choose Our<br />
                <span className="text-gradient">Senior Photography Services?</span>
              </h2>
            </div>
          </RevealOnScroll>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {[
              {
                icon: Sparkles,
                title: 'Artistic Vision',
                desc: 'Technical expertise combined with artistic vision for exceptional senior pictures.',
                gradient: 'from-purple-600 to-indigo-600'
              },
              {
                icon: Heart,
                title: 'Personalized',
                desc: 'Enjoyable and stress-free experience while producing beautiful senior photos.',
                gradient: 'from-pink-600 to-rose-600'
              },
              {
                icon: MapPin,
                title: 'Locations',
                desc: 'Urban settings, natural landscapes, and studio environments available.',
                gradient: 'from-orange-500 to-amber-500'
              },
              {
                icon: Star,
                title: 'Customized',
                desc: 'Each session reflects your personal style preferences.',
                gradient: 'from-cyan-500 to-blue-500'
              }
            ].map((item, i) => (
              <StaggerItem key={i}>
                <TiltCard>
                  <motion.div
                    className="group glass rounded-3xl p-6 h-full relative overflow-hidden"
                    whileHover={{ y: -5 }}
                    data-hoverable
                  >
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>

                    {/* Hover Glow */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                    />
                  </motion.div>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <RevealOnScroll delay={0.4}>
            <div className="mt-16 text-center">
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Our commitment to quality and customer satisfaction makes us the preferred choice for senior
                portraits that truly capture this important milestone.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative py-32 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-relaxed max-w-4xl mx-auto">
                Professional senior pictures are an investment in preserving this important milestone with{' '}
                <span className="text-gradient">beautiful portraits</span> that will be treasured for years to come.
              </h2>
            </div>
          </RevealOnScroll>

          {/* Masonry Gallery */}
          <StaggerContainer className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6" staggerDelay={0.08}>
            {[
              { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80', height: 'aspect-[3/4]' },
              { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80', height: 'aspect-square' },
              { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80', height: 'aspect-[4/5]' },
              { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', height: 'aspect-square' },
              { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80', height: 'aspect-[3/4]' },
              { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80', height: 'aspect-[4/5]' },
            ].map((img, i) => (
              <StaggerItem key={i}>
                <motion.div
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  data-hoverable
                >
                  <img
                    src={img.src}
                    alt={`Senior portrait ${i + 1}`}
                    className={`w-full ${img.height} object-cover group-hover:scale-110 transition-transform duration-700`}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 right-4"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-white font-medium">Senior Portrait {i + 1}</p>
                    <p className="text-gray-300 text-sm">by James R. Cobb</p>
                  </motion.div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealOnScroll>
            <div className="glass-strong rounded-3xl p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Conclusion: <span className="text-gradient">Your Senior Portrait Experience</span>
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Professional senior pictures are an investment in preserving this important milestone with beautiful
                portraits that will be treasured for years to come. Our senior photographer is dedicated to providing
                an exceptional experience that produces stunning senior photos reflecting your unique personality and
                style. Contact us today to begin planning your senior session and create beautiful senior pictures
                that celebrate your achievements and capture your essence.
              </p>
              <motion.div
                className="w-32 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full mx-auto"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="relative py-32 md:py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Content */}
            <div>
              <RevealOnScroll>
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Booking Your<br />
                  <span className="text-gradient">Senior Session</span>
                </h2>
              </RevealOnScroll>

              <RevealOnScroll delay={0.1}>
                <p className="text-lg text-gray-400 leading-relaxed mb-10">
                  Ready to create beautiful senior pictures that celebrate your milestone year? Contact our professional
                  senior photographer to schedule your senior session and discuss your vision for your senior photos.
                </p>
              </RevealOnScroll>

              {/* Contact Cards */}
              <StaggerContainer className="space-y-4 mb-10" staggerDelay={0.1}>
                {[
                  { icon: Phone, label: 'Call Us', value: '(555) 123-4567', gradient: 'from-purple-500 to-pink-500' },
                  { icon: Mail, label: 'Email Us', value: 'info@jamesrcobb.com', gradient: 'from-pink-500 to-orange-500' }
                ].map((contact, i) => (
                  <StaggerItem key={i}>
                    <motion.div
                      className="flex items-center space-x-4 glass rounded-2xl p-5 group"
                      whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)' }}
                      data-hoverable
                    >
                      <motion.div
                        className={`w-14 h-14 bg-gradient-to-br ${contact.gradient} rounded-xl flex items-center justify-center`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <contact.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <p className="text-sm text-gray-500">{contact.label}</p>
                        <p className="text-xl font-medium">{contact.value}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* CTA Buttons */}
              <RevealOnScroll delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <MagneticButton
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-10 py-4 text-lg font-medium rounded-full shadow-lg shadow-purple-600/30"
                    data-hoverable
                  >
                    <Phone className="mr-2 h-5 w-5 inline" />
                    Call to Book
                  </MagneticButton>
                  <MagneticButton
                    className="glass text-white px-10 py-4 text-lg font-medium rounded-full hover:bg-white/10 transition-colors"
                    data-hoverable
                  >
                    <Mail className="mr-2 h-5 w-5 inline" />
                    Email Inquiry
                  </MagneticButton>
                </div>
              </RevealOnScroll>
            </div>

            {/* Decorative Card */}
            <RevealOnScroll delay={0.2}>
              <div className="relative hidden lg:block">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl"
                  animate={{ rotate: [6, 8, 6] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <TiltCard>
                  <div className="relative glass-strong rounded-3xl p-8 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80"
                      alt="Photography studio"
                      className="w-full rounded-2xl mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-4xl font-bold text-gradient">$299</p>
                      </div>
                      <motion.button
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        data-hoverable
                      >
                        View Packages
                      </motion.button>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <motion.div
                className="flex items-center space-x-3 mb-6"
                whileHover={{ x: 5 }}
                data-hoverable
              >
                <Camera className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-light">
                  <span className="font-semibold">James R. Cobb</span>
                  <span className="text-purple-400">.</span>
                </span>
              </motion.div>
              <p className="text-gray-500 leading-relaxed">
                Professional senior portraits that capture your unique personality and style. Creating timeless memories for your milestone moment.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {['About', 'Experience', 'Gallery', 'Booking', 'Contact'].map((link) => (
                  <li key={link}>
                    <motion.a
                      href={`#${link.toLowerCase()}`}
                      className="text-gray-500 hover:text-purple-400 transition-colors inline-block"
                      whileHover={{ x: 5 }}
                      data-hoverable
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <p className="flex items-center text-gray-500">
                  <Phone className="h-4 w-4 mr-3 text-purple-400" />
                  (555) 123-4567
                </p>
                <p className="flex items-center text-gray-500">
                  <Mail className="h-4 w-4 mr-3 text-purple-400" />
                  info@jamesrcobb.com
                </p>
                <p className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-3 text-purple-400" />
                  Studio Location Available
                </p>
              </div>
              <motion.a
                href="#"
                className="inline-flex items-center justify-center w-12 h-12 glass rounded-full mt-6 hover:bg-purple-500/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 10 }}
                data-hoverable
              >
                <Instagram className="h-5 w-5 text-gray-400" />
              </motion.a>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/5 pt-8 text-center">
            <p className="text-gray-600 text-sm">
              &copy; 2026 James R. Cobb Photography. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
