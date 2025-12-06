import React, { useEffect, useRef } from "react";
import Background from "../../modules/Core/Components/Background/Background";
import Header from "../../modules/Core/layout/Header";
import Footer from "../../modules/Core/layout/Footer";
import Pricing from "./Pricing";
import HeroSection from "./HeroSection";
import CommunityPage from "./CommunityPage";
import FAQSection from "./FAQSection";

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const refs = [pricingRef, communityRef, faqRef, footerRef];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    // Hero section hiện ngay
    if (heroRef.current) {
      heroRef.current.classList.add("fade-in-up");
    }

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <Background>
      <div className="font-inte min-h-screen flex flex-col">
        <Header />

        {/* Hero Section */}
        <div ref={heroRef} className="opacity-0">
          <HeroSection />
        </div>

        {/* Pricing Section */}
        <div ref={pricingRef} className="opacity-0 animation-delay-200">
          <Pricing />
        </div>

        {/* Community Section */}
        <div ref={communityRef} className="opacity-0 animation-delay-300">
          <CommunityPage />
        </div>

        {/* FAQ Section */}
        <div ref={faqRef} className="opacity-0 animation-delay-400">
          <FAQSection />
        </div>

        {/* Footer */}
        <div ref={footerRef} className="opacity-0 animation-delay-500">
          <Footer />
        </div>
      </div>
    </Background>
  );
};

export default Home;
