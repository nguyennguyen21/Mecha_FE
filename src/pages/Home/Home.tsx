import Background from "../../modules/Core/components/Background/Background";
import Header from "../../modules/Core/layout/Header";
import Footer from "../../modules/Core/layout/Footer";
import Pricing from "./Pricing";
import HeroSection from "./HeroSection";

const Home = () => {
  return (
    <Background>
      <div className="font-inte min-h-screen flex flex-col">
        <Header />

        {/* Hero Section */}
        <HeroSection />

        {/* Pricing Section */}
        <Pricing />

        {/* Footer */}
        <Footer />
      </div>
    </Background>
  );
};

export default Home;
