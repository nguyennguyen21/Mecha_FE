import Button from "../../modules/Core/components/button/Button";
import Search from "../../modules/Core/components/Search/Search";
import profile from "../../../src/assets/imgs/undraw_github-profile_abde (1).svg";

const HeroSection = () => {
  const handleClaimClick = () => {
    alert("Primary Button Clicked!");
  };

  return (
    <div className="px-6 md:px-20 mt-15 flex flex-col md:flex-row items-center text-white gap-10">
      <div className="md:w-2/5 flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
        <h1 className="text-6xl font-bold leading-tight">
          Welcome to the Home Page
        </h1>
        <p className="text-lg text-gray-300">
          This is the home page content.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <Search />
          <Button variant="primary" onClick={handleClaimClick}>
            Claim now
          </Button>
        </div>
      </div>

      <div className="md:w-3/5 flex justify-center">
        <img
          src={profile}
          alt="Profile"
          className="w-full max-w-2xl object-contain rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default HeroSection;
