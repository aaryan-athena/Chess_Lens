import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import GetStartedSection from "./GetStartedSection";
import LandingFooter from "./LandingFooter";

const Home = () => {
  return (
    <div className="landing-page">
      <LandingNavbar />
      <HeroSection />
      <div className="section-divider" />
      <FeaturesSection />
      <HowItWorksSection />
      <div className="section-divider" />
      <GetStartedSection />
      <LandingFooter />
    </div>
  );
};

export default Home;
