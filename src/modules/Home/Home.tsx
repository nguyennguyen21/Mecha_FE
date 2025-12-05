import Background from "../../modules/Core/Components/Background/Background";
import Header from "../../modules/Core/layout/Header";
import Footer from "../../modules/Core/layout/Footer";
import Pricing from "./Pricing";
import HeroSection from "./HeroSection";
import CommunityPage from "./CommunityPage";
import FAQSection from "./FAQSection";

const Home = () => {
  return (
    <Background>
      <div className="font-inte min-h-screen flex flex-col">
        <Header />

        {/* Hero Section */}
        <HeroSection />

        {/* Pricing Section */}
        <Pricing />

        {/* Community Section */}
        <CommunityPage />

        {/* FAQ Section */}
        <FAQSection />

        {/* Footer */}
        <Footer />
      </div>
    </Background>
  );
};

export default Home;
