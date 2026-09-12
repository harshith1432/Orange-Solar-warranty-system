import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Smartphone,
  Clock,
  FileCheck,
  Search,
  Camera,
  Sparkles,
  Sun,
  BatteryCharging,
  Zap,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  MessageSquare,
  Shield,
  ExternalLink,
  Award,
  Flame
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { isAuthenticated, isAdmin } from '../utils/auth';
import OrangeSolarLogo from '../components/OrangeSolarLogo';
import SolarWatermark from '../components/SolarWatermark';
import SunZoneCertifications from '../components/SunZoneCertifications';

export default function HomePage() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const isAdministrator = isAdmin();

  // Interactive States
  const [activeCategory, setActiveCategory] = useState('waterHeater');
  const [openFaq, setOpenFaq] = useState(0);

  const categories = {
    waterHeater: {
      name: 'Orange Diamond Glass Line Solar Water Heater',
      shortName: 'Solar Water Heaters',
      icon: Sun,
      image: '/assets/images/solar.png',
      warranty: '20-Year Guarantee (Special Glass Coated)',
      highlight: 'Withstands water hardness up to 3000 PPM',
      specs: [
        'Furnace coated glass lining at 850°C',
        'High-density PUF insulation for overnight heat retention',
        '3-Target Copper, Aluminum & Nickel coated ETC tubes',
        'Heavy-gauge inner tank with special inspection manhole'
      ],
      tag: '20 Year Guarantee'
    },
    chimney: {
      name: 'Orange Thermal Auto-Clean Kitchen Chimneys',
      shortName: 'Kitchen Chimneys',
      icon: Flame,
      image: '/assets/images/chimney.png',
      warranty: 'Lifetime Motor & 5-Year Comprehensive',
      highlight: 'Thermal auto-clean with touch & motion sensor',
      specs: [
        'High suction power with low-noise copper motor',
        'Thermal auto-clean with stainless steel oil collector',
        'Tough curved tempered glass designer hood',
        'Touch panel with intuitive hand gesture controls'
      ],
      tag: 'Auto-Clean'
    },
    purifier: {
      name: 'Orange Aqua Advanced RO+UV+UF Water Purifier',
      shortName: 'Water Purifiers',
      icon: Zap,
      image: '/assets/images/purifier.png',
      warranty: '5-Year Manufacturer Warranty',
      highlight: '100% Pure Drinking Water with Active Minerals',
      specs: [
        'Multi-stage RO+UV+UF+TDS membrane filtration',
        'Active copper & alkaline mineral fortification',
        'Food-grade transparent high capacity storage tank',
        'Smart LED filter life & water purification alerts'
      ],
      tag: '100% Pure Water'
    },
    geyser: {
      name: 'Orange Glass-Lined High Pressure Electric Geysers',
      shortName: 'Electric Geysers',
      icon: Shield,
      image: '/assets/images/geyser.png',
      warranty: '7-Year Tank & 2-Year Element Warranty',
      highlight: '8-Bar Working Pressure Suitable for High-Rises',
      specs: [
        'Vitreous enamel coated inner tank fused at 850°C',
        'Incoloy 800 quick-heating element',
        'High-density PUF insulation for energy conservation',
        'Multi-function safety valve with thermal cut-out'
      ],
      tag: '8-Bar Pressure'
    },
    rooftop: {
      name: 'Orange Solar Rooftop On-Grid & PM Surya Ghar',
      shortName: 'Solar Rooftop',
      icon: Award,
      image: '/assets/images/solar.png',
      warranty: '25+ Years High-Performance German Technology',
      highlight: 'PM Surya Ghar / Muft Bijli Yojana Subsidy Eligible',
      specs: [
        'Government subsidy assistance up to ₹78,000',
        'Bidirectional Net-Metering with DISCOM grid export',
        'Commercial & industrial 40% accelerated depreciation',
        'Zero battery maintenance with seamless net metering'
      ],
      tag: 'PM Surya Ghar'
    }
  };

  const faqs = [
    {
      q: 'How do I register my product for an e-warranty?',
      a: 'Simply click "Register Warranty", log into your authorized account, enter your product serial number or upload a picture of the QR barcode on your purchase invoice. Verification takes under 60 seconds.'
    },
    {
      q: 'How does an inspector or customer verify the authenticity of an E-Warranty card?',
      a: 'Every issued certificate contains a 256-bit encrypted digital QR code. Anyone can scan the QR code with a smartphone or enter the Certificate ID into our public verification portal to inspect real-time coverage.'
    },
    {
      q: 'Which notification channels are sent when my warranty is approved?',
      a: 'Once verified and approved by the engineering team, the official certificate is automatically dispatched simultaneously across WhatsApp, SMS, and Email with a verifiable PDF download link.'
    },
    {
      q: 'What if I need to make a warranty claim or repair request?',
      a: 'Log into your customer dashboard, select the registered system, and click "File Claim / Request Service". You can track every milestone in real time from submission, technical inspection, to replacement dispatch.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfd] text-slate-800 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
      <Navbar />

      {/* Radiant Background Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-100/40 via-orange-100/25 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-orange-200/20 via-amber-100/15 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-[70%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-sky-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none -z-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 95%)'
        }}
      />

      {/* HERO SECTION */}
      <div className="flex-1 max-w-6xl mx-auto px-4 pt-10 pb-16 sm:pt-14 sm:pb-20 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Official Company Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-orange-200 shadow-xs text-orange-900 text-[11px] sm:text-xs font-semibold mb-6 max-w-full">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          <span className="truncate max-w-[220px] sm:max-w-none">Sun Zone Solar System India Pvt. Ltd.</span>
          <span className="text-orange-300">|</span>
          <span className="text-orange-700 font-bold whitespace-nowrap shrink-0">Official E-Warranty Platform</span>
        </div>

        {/* Official Brand Logo */}
        <div className="mb-6 flex flex-col items-center">
          <OrangeSolarLogo className="h-16 sm:h-20 md:h-24 w-auto drop-shadow-sm" />
          <div className="mt-2 text-xs sm:text-sm font-black tracking-widest text-orange-600 uppercase">
            Powering Infinity
          </div>
          <div className="text-[11px] sm:text-xs font-medium text-slate-500 italic mt-0.5">
            Transforming solar energy towards a sustainable future...
          </div>
        </div>

        {/* Hero Headlines - Professional Corporate Hierarchy */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-3">
          Digital E-Warranty Issuance & Verification
        </h1>
        
        <p className="text-base sm:text-lg font-bold tracking-tight text-orange-600 mb-4">
          Direct Manufacturer Assurance • Tamper-Proof QR Cards • Instant Mobile Claim
        </p>

        <p className="max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-8">
          The centralized warranty registry for Orange Solar water heaters, high-efficiency domestic & industrial heat pumps, and solar rooftop systems manufactured by Sun Zone Solar System India Pvt. Ltd.
        </p>

        {/* Official Certifications Row from Brochure */}
        <div className="w-full max-w-3xl mb-10">
          <SunZoneCertifications />
        </div>

        {/* FEATURE HIGHLIGHTS GRID - Clean Corporate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl text-left mb-14">
          
          {/* Card 1: Instant Registration */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                Instant Registration
              </h3>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                Paperless
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Select your solar panel or inverter model, attach your invoice details, and submit a registered warranty claim in under 60 seconds.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-orange-600">
              <span>Digital Submission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Milestone Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                Milestone Timeline
              </h3>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                Live Audit
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Track live progress of your claim verification across submission, technical inspection, authorization, to card issuance.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-700">
              <span>Real-Time Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: 3-Way Notification */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                3-Way Notification
              </h3>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Instant
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Official certificate dispatch sent simultaneously across WhatsApp, Email, and SMS with instant QR code verification.
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <span>Multi-Channel Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* INTERACTIVE PRODUCT WARRANTY COVERAGE SECTION */}
        <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs mb-14 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold mb-1.5">
                <Sun className="w-3.5 h-3.5 text-orange-600" />
                Equipment Warranty Matrix
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Comprehensive Protection Matrix
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Standard coverage terms, linear performance warranties, and service level guarantees
              </p>
            </div>

            <Link
              to="/customer/products"
              className="px-3.5 py-2 rounded-lg border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-orange-600 text-xs font-semibold inline-flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <span>View Product Catalog</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 bg-slate-100/70 p-1.5 rounded-xl">
            {Object.entries(categories).map(([key, cat]) => {
              const Icon = cat.icon;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isActive
                      ? 'bg-white text-orange-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  <span className="truncate">{cat.shortName || cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Details Panel */}
          {categories[activeCategory] && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="space-y-3 max-w-lg flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-orange-600 text-white">
                    {categories[activeCategory].tag}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {categories[activeCategory].name}
                  </h3>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 font-normal block">Standard Coverage Term</span>
                  <span className="text-sm font-bold text-orange-700">
                    {categories[activeCategory].warranty}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {categories[activeCategory].specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-normal">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authentic Product Image */}
              {categories[activeCategory].image && (
                <div className="w-48 h-44 bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                  <img
                    src={categories[activeCategory].image}
                    alt={categories[activeCategory].name}
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                  />
                </div>
              )}

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs w-full lg:w-60 shrink-0 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Direct Action
                  </span>
                  <p className="text-xs text-slate-600 mb-3 font-normal">
                    Have this equipment installed? Register its serial number now for official certification.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="w-full py-2.5 btn-supreme text-center text-xs font-bold rounded-lg shadow-2xs block transition-all active:scale-95"
                >
                  Register Warranty Now
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 3-STEP PROCESS SECTION */}
        <div className="w-full max-w-5xl mb-14 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Simple 3-Step Process
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            How The E-Warranty System Works
          </h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto mb-8 font-normal">
            From product purchase to official digital certificate delivery in three verified stages.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                01
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Scan & Submit</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Scan the QR barcode or enter the serial number. Attach your purchase invoice copy.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                02
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Automated Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                System validates dealer authentications, calculates exact coverage timelines, and submits for authorization.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                03
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">Multi-Channel Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Official digital warranty certificate arrives immediately on WhatsApp, Email, and SMS with verifiable QR code.
              </p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE FAQ ACCORDION */}
        <div className="w-full max-w-3xl mb-14 text-left">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 font-normal">General inquiries regarding Sun Zone Solar System warranty coverage</p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-orange-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5 font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FINAL CALL TO ACTION BANNER */}
        <div className="w-full max-w-4xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 rounded-2xl p-6 sm:p-10 text-white text-center shadow-lg shadow-orange-600/15 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold mb-2 tracking-tight">
              Ready to Protect Your Solar Assets?
            </h2>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              Register your solar equipment today for lifetime central record verification and dedicated technical support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-50 text-orange-700 font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-all"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-2.5 bg-orange-700/60 hover:bg-orange-700/80 border border-white/20 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* TRUST BADGES ROW */}
        <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-5 w-full max-w-4xl text-center">
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1.5" />
            <span className="text-xs font-semibold text-slate-800">Fast Approval</span>
            <span className="text-[11px] text-slate-500 font-normal">Under 60s Processing</span>
          </div>
          <div className="flex flex-col items-center">
            <QrCode className="w-4 h-4 text-orange-600 mb-1.5" />
            <span className="text-xs font-semibold text-slate-800">Public QR Verification</span>
            <span className="text-[11px] text-slate-500 font-normal">Instant Camera Scan</span>
          </div>
          <div className="flex flex-col items-center">
            <Smartphone className="w-4 h-4 text-amber-600 mb-1.5" />
            <span className="text-xs font-semibold text-slate-800">3-Way Dispatch</span>
            <span className="text-[11px] text-slate-500 font-normal">WhatsApp, SMS & Email</span>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-4 h-4 text-orange-600 mb-1.5" />
            <span className="text-xs font-semibold text-slate-800">Secure Digital Cards</span>
            <span className="text-[11px] text-slate-500 font-normal">Official Warranty Record</span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-10 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <OrangeSolarLogo variant="white" className="h-9 w-auto" showTagline={true} />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-3 font-normal">
                Manufactured & Marketed by Sun Zone Solar System India Pvt. Ltd. Pioneers in Diamond Glass Line Solar Water Heaters, Heat Pumps, and Rooftop Solar Plants.
              </p>
              <div className="text-orange-400 font-semibold text-xs space-y-0.5">
                <div>📞 Mob: 9164659666 / +91 97400 97000</div>
                <div>✉️ sunzonesolar56@yahoo.co.in</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2.5">Regd. Off. & Works</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-2 font-normal">
                SUN ZONE SOLAR SYSTEM INDIA PVT. LTD.<br />
                # Sy No. 60/3&4, Muneshwara Industrial Layout,<br />
                Puradapalya Village, Tavarekere Hobli,<br />
                Bangalore - 562130, Karnataka, INDIA
              </p>
              <p className="text-slate-400 text-xs font-normal">
                Web: <a href="https://www.orangesolar.co.in" target="_blank" rel="noreferrer" className="text-orange-400 hover:underline">www.orangesolar.co.in</a><br />
                Follow us on Facebook, Instagram, LinkedIn, YouTube
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2.5">Portals & Services</h4>
              <ul className="space-y-1.5 text-xs font-normal">
                <li><Link to="/customer/products" className="hover:text-white transition-colors">Orange Solar Product Catalog</Link></li>
                <li><Link to="/customer/apply" className="hover:text-white transition-colors">Digital Warranty Claim Portal</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Customer Account Registration</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Customer & Dealer Sign In</Link></li>
                <li><Link to="/verify/EW-2024-8841" className="hover:text-white transition-colors">Public QR Verification Registry</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px] font-normal">
            <span>© 2026 Sun Zone Solar System India Pvt. Ltd. • Orange Solar E-Warranty Platform. All rights reserved.</span>
            <span>Tamper-proof Digital QR Certification Engine</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
