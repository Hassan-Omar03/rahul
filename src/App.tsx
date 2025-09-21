// src/App.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackGround from "./Assests/srv.svg";
import logo from "./Assests/newlogo.png";
import header from "./Assests/HEADER.png"; // toggle icon
import mobileBg from "./Assests/new.jpeg"; // overlay background
import selected from "./Assests/selected.png";
import nonselected from "./Assests/nonselected.png";
import {
  Instagram,
  Facebook,
  Linkedin as LinkedinIcon,
  X,
  Linkedin,
} from "lucide-react";
import QuotationTool from "./components/QuotationTool";

// Framer Motion variants (type-compatible easing values)
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.55 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, y: -30, rotateX: 14, transformOrigin: "top center", scale: 0.995 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 0.8, 0.2, 1] }, // array easing (TS-friendly)
  },
  exit: {
    opacity: 0,
    y: -28,
    rotateX: 12,
    scale: 0.995,
    transition: { duration: 0.22, ease: [0.22, 0.8, 0.2, 1] }, // replaced string with array
  },
};

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
};

const listItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" as any } },
  // Note: for listItem easing "easeOut" as any to avoid over-typing — it's safe here.
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  const menuItems = ["Home", "About Us", "Services", "Blog", "Contact Us"];

  // typed navigationItems so map callbacks are typed (no implicit any)
  const navigationItems: { name: string; href: string }[] = menuItems.map((name) => ({
    name,
    href: "#",
  }));

  const handleWhatsAppClick = () => {
    const phoneNumber = "+352661784276";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Wave link CSS */}
      <style>{`
        .wave-link {
          cursor: pointer;
          font-size: 18px;
          position: relative;
          white-space: nowrap;
          background: transparent;
          border: 0;
          overflow: hidden;
          padding: 7px 0;
        }
        .wave-link:before {
          content: '';
          background: #FFF;
          position: absolute;
          width: 100%;
          height: 1px;
          top: 100%;
          left: 0;
          pointer-events: none;
        }
        .link__graphic {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          fill: none;
          stroke: #FFF;
          stroke-width: 1px;
        }
        .link__graphic--slide {
          top: -3px;
          stroke-width: 2px;
          transition: transform 0.7s;
          transition-timing-function: cubic-bezier(0, 0.25, 0.5, 1);
        }
        .wave-link:hover .link__graphic--slide {
          transform: translate3d(-66.6%, 0, 0);
        }
      `}</style>

      <div className="bg-black/95 backdrop-blur-sm sticky top-0 z-50">
  <div className="bg-black w-full py-2">
    <div className="mx-auto text-white max-w-[1200px] w-[90%] flex items-center justify-between">
      {/* Logo */}
      <div>
        <img
          src={logo}
          className="w-20 sm:w-24 md:w-28 lg:w-[110px]"
          alt="asd"
        />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6 lg:space-x-16 relative">
        {menuItems.map((item) => (
          <div
            key={item}
            className="wave-link relative font-medium text-white text-base"
          >
            {item}
            <svg
              className="link__graphic link__graphic--slide"
              width="300%"
              height="100%"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
            >
              <path
                d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46
                  c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"
                fill="#FF6F61"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* ✅ Buttons visible on ALL screens */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <a
          href="https://quotation.bim.africa/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <button className="text-red-500 border border-red-500 px-4 py-2 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap hover:bg-red-500 hover:text-white">
            Instant Quotation
          </button>
        </a>

        <button
          type="button"
          aria-label="French"
          className="inline-flex items-center gap-2 pl-2 pr-3 h-10
                     rounded-full bg-white text-black
                     outline-none focus:outline-none
                     ring-0 focus:ring-2 focus:ring-red-700
                     hover:shadow-md active:scale-95 transition"
        >
          <span className="inline-flex items-center justify-center
                           w-6 h-6 rounded-full bg-red-600 text-white
                           text-base font-bold leading-none">+</span>
          <span className="text-sm font-medium">FR</span>
        </button>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <img
          src={header}
          alt="menu"
          className="w-8 h-8 cursor-pointer"
          onClick={() => setMenuOpen(true)}
        />
      </div>
    </div>
  </div>

        {/* Mobile Overlay - animated using framer-motion */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                key="backdrop"
                className="fixed inset-0 z-[95] md:hidden bg-black"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />

              <motion.aside
                key="panel"
                className="fixed inset-0 z-[100] md:hidden"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div
                  className="bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url(${mobileBg})`,
                    minHeight: "100svh",
                    height: "100vh",
                  }}
                >
                  <div className="flex flex-col min-h-full pb-6" style={{ position: "relative" }}>
                    <div className="flex items-center justify-between pl-4 pr-4">
                      <img src={logo} className="w-[5rem] object-contain" alt="Logo" />

                      <motion.button
                        onClick={() => setMenuOpen(false)}
                        className="text-white hover:text-red-500 p-2"
                        aria-label="Close menu"
                        whileTap={{ scale: 0.92, rotate: 6 }}
                      >
                        <X size={32} className="block" />
                      </motion.button>
                    </div>

                    <motion.nav
                      className="flex flex-col justify-between h-full px-8 mt-3"
                      variants={listContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* ✅ Upar menu items */}
                      {/* when nav menu is opened the scroll should be disabled like we can only see the websites content when the nav menu is closed */}
                      <div className="flex flex-col min-h-[73vh] justify-between overflow-auto">
                        <div>

                          {navigationItems.map((item, idx) => (
                            <motion.div
                              key={idx}
                              className="flex items-center w-full max-w-full py-3"
                              variants={listItem}
                            >
                              <a
                                href={item.href}
                                onClick={() => {
                                  setActive(item.name);
                                  setMenuOpen(false);
                                }}
                                className={`flex-1 text-left text-lg font-medium transition-colors ${active === item.name ? "text-red-500" : "text-white hover:text-red-300"
                                  }`}
                              >
                                {item.name}
                              </a>

                              <motion.img
                                src={active === item.name ? selected : nonselected}
                                alt=""
                                className="w-6 h-6 ml-4 flex-shrink-0"
                                initial={{ scale: 0.9, opacity: 0.6 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.18 }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* ✅ Neeche button chipka rahega */}
                      <div className=" mb-6">
                        <a
                          href="https://quotation.bim.africa/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-[#ff1f00] hover:bg-red-600 text-white py-4 rounded-full text-lg font-medium inline-block text-center transition-colors"
                          >
                            Instant Quotation
                          </motion.button>
                        </a>
                      </div>
                    </motion.nav>

                    <div
                      className="fixed left-0 right-0 bottom-8 px-6"
                      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 1rem) + 0.75rem)", pointerEvents: "auto" }}
                    >
                      <a href="https://quotation.bim.africa/" target="_blank" rel="noopener noreferrer" className="block w-full">
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-[#ff1f00] hover:bg-red-600 text-white py-4 rounded-full text-lg font-medium inline-block text-center transition-colors"
                        >
                          Instant Quotation
                        </motion.button>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Background */}
        <img
          src={BackGround}
          className="absolute inset-0 z-[-10] w-full h-full object-cover"
          alt=""
        />

        {/* Main content */}
        <div className="relative z-10 box- flex justify-center items-start px-2 sm:px-4 py-8">
          <QuotationTool />
        </div>

        WhatsApp Floating Button
<button
  onClick={handleWhatsAppClick}
  className="fixed right-[20%] top-[65%]   /* 👈 slightly above center */
             bg-[#ff1f00] hover:bg-[#e1291c] text-white 
             rounded-full p-4 shadow-lg 
             transition-all duration-300 hover:shadow-xl z-50"
  title="Chat on WhatsApp"
>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" />
  </svg>
</button>


        <footer className="bg-black py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              {/* Quick Links & Support */}
              <div className="grid grid-cols-2 gap-8 mb-8 text-center">
                <div>
                  <h3 className="text-[#ff1f00] text-sm font-bold uppercase mb-4">
                    QUICK LINK
                  </h3>
                  <div className="space-y-2">
                    <a href="#" className="block text-white text-sm">Home</a>
                    <a href="#" className="block text-white text-sm">About Us</a>
                    <a href="/" className="block text-white text-sm">Services</a>
                    <a href="#" className="block text-white text-sm">BLOG</a>
                  </div>
                </div>

                <div>
                  <h3 className="text-[#ff1f00] text-sm font-bold uppercase mb-4">
                    SUPPORT
                  </h3>
                  <div className="space-y-2">
                    <a href="/contactus" className="block text-white text-sm">Contact us</a>
                    <a href="#" className="block text-white text-sm">Privacy Policy</a>
                    <a href="#" className="block text-white text-sm">Terms&Conditions</a>
                  </div>
                </div>
              </div>

              {/* Referral + Socials */}
              <div className="mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 pr-4">
                    <h3 className="text-[#ff1f00] text-sm font-bold uppercase mb-3">
                      REFFERAL PROGRAM
                    </h3>
                    <p className="text-white text-xs leading-relaxed">
                      Know someone who needs elite digital solutions? Refer them — and earn through our tiered incentive program. Simple to join. Profitable to share.
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-4">
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap">
                      JOIN NOW
                    </button>

                    <div className="flex space-x-3">
                      <a href="https://www.instagram.com/bimafrica" target="_blank" rel="noopener noreferrer">
                        <div className="w-10 h-10 bg-[#ff1f00] rounded-full flex items-center justify-center hover:bg-[#e61c00] transition">
                          <Instagram size={20} className="text-white" />
                        </div>
                      </a>
                      <a href="https://www.facebook.com/share/17Kr1c4mkp/" target="_blank" rel="noopener noreferrer">
                        <div className="w-10 h-10 bg-[#ff1f00] rounded-full flex items-center justify-center hover:bg-[#e61c00] transition">
                          <Facebook size={20} className="text-white" />
                        </div>
                      </a>
                      <a href="https://www.linkedin.com/company/bimafrica/" target="_blank" rel="noopener noreferrer">
                        <div className="w-10 h-10 bg-[#ff1f00] rounded-full flex items-center justify-center">
                          <Linkedin size={20} className="text-white" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo + Info */}
              <div className="text-center mb-8">
                <img src={logo} className="w-48 mx-auto mb-4" alt="BIM Logo" />
                <p className="text-white text-sm mb-1">Copyright © 2025 BIM. All Rights Reserved.</p>
                <p className="text-white text-sm">Mauritius & Luxembourg</p>
              </div>

              {/* Bottom Links */}
              <div className="text-center text-white text-xs border-t border-gray-800 pt-6">
                <a href="#" className="hover:text-[#ff1f00]">Privacy Policy</a>
                <span className="mx-2">|</span>
                <a href="#" className="hover:text-[#ff1f00]">Terms of Use</a>
                <span className="mx-2">|</span>
                <a href="#" className="hover:text-[#ff1f00]">Terms & Conditions</a>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              <div className="text-left">
                <div className="text-[#ff1f00] font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-tight">
                  <img src={logo} className="w-48 sm:w-64 lg:w-80 xl:w-[500px]" alt="" />
                </div>
                <p className="text-white text-xs sm:text-sm mt-3 sm:mt-4">Copyright © 2025 BIM. All Rights Reserved.</p>
                <p className="text-white text-xs sm:text-sm">Mauritius & Luxembourg</p>
              </div>

              <div className="text-left">
                <h3 className="text-[#ff1f00] text-sm sm:text-base lg:text-lg uppercase">QUICL LINKS</h3>
                <div className="space-y-1 sm:space-y-2 lg:space-y-3 mt-3 sm:mt-4">
                  <a href="#" className="block text-white hover:text-white text-xs sm:text-sm lg:text-base">
                    Home
                  </a>
                  <a href="#" className="block text-white hover:text-white text-xs sm:text-sm lg:text-base">
                    About US
                  </a>
                  <a href="/" className="block text-white hover:text-white text-xs sm:text-sm lg:text-base">
                    Services
                  </a>
                  <a href="#" className="block text-white hover:text-white text-xs sm:text-sm lg:text-base">
                    Blog
                  </a>
                </div>
              </div>

              <div className="text-left">
                <h3 className="text-[#ff1f00] text-sm sm:text-base lg:text-lg uppercase">SUPPORT</h3>
                <div className="space-y-1 sm:space-y-2 lg:space-y-3 mt-3 sm:mt-4">
                  <a href="/contactus" className="block text-white hover:text-white text-xs sm:text-sm lg:text-base">
                    Contact Us
                  </a>
                  <a href="#" className="block text-white hover:text-white text-xs sm:text-sm lg:text-base">
                    Privacy Policy
                  </a>
                  <a href="#" className="block text-white hover:text-white text-xs sm:text-sm lg:text-base">
                    Terms & Conditions
                  </a>
                </div>
              </div>

              <div className="text-left">
                <h3 className="text-[#ff1f00] text-sm sm:text-base lg:text-lg uppercase">REFFERAL PROGRAM</h3>
                <p className="text-white text-xs sm:text-sm mt-3 sm:mt-4">
                  Know someone who needs elite digital solutions? Refer them — and earn through our tiered incentive program. Simple to join. Profitable to share.
                </p>

                {/* Button and Social Icons on Same Line */}
                <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <button className="bg-[#333333] border border-transparent hover:border-[#ff1f00] text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-full font-medium whitespace-nowrap text-xs sm:text-sm lg:text-base">JOIN NOW</button>

                  <div className="flex space-x-1 sm:space-x-2">
                    <a href="https://www.instagram.com/bimafrica?igsh=dnpmYXQzNTV2eHE4" target="_blank" rel="noopener noreferrer">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#ff1f00] rounded-full flex items-center justify-center hover:bg-[#e61c00] transition">
                        <Instagram size={12} className="text-white sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                      </div>
                    </a>
                    <a href="https://www.facebook.com/share/17Kr1c4mkp/" target="_blank" rel="noopener noreferrer">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#ff1f00] rounded-full flex items-center justify-center hover:bg-[#e61c00] transition">
                        <Facebook size={12} className="text-white sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                      </div>
                    </a>
                    <a href="https://www.linkedin.com/company/bimafrica/" target="_blank" rel="noopener noreferrer">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-[#ff1f00] rounded-full flex items-center justify-center">
                        <LinkedinIcon size={12} className="text-white sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:block border-t border-gray-800 mt-6 sm:mt-8 lg:mt-12 pt-4 sm:pt-6 lg:pt-8 text-center text-white text-xs sm:text-sm">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-white">
                Terms of Use
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-white">
                Terms & Condition
              </a>
            </div>
          </div>
        </footer>



      </div>
    </>
  );
}

export default App;
