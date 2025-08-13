import Background from "../../modules/Core/components/Background/Background";
import Header from "../../modules/User/components/Header/Headerr";
import Title from "../../modules/Core/components/Titile/Titile";
import Content from "../../modules/Core/components/Content/content";
import Button from "../../modules/Core/components/button/Button";
import Search from "../../modules/Core/components/Search/Search";

import profile from "../../../src/assets/imgs/undraw_github-profile_abde (1).svg";

const Home = () => {
  const handleClaimClick = () => {
    alert("Primary Button Clicked!");
  };

  return (
    <Background>
      <div className="font-inte min-h-screen">
        <Header />

        <div className="p-25 mt-10">
          <div className="flex flex-col md:flex-row items-center text-white gap-10">
            <div className="md:w-2/5 flex flex-col items-start space-y-6">
              <h1 className="text-6xl font-bold leading-tight">
                Welcome to the Home Page
              </h1>
              <p className="text-lg text-gray-300">
                This is the home page content.
              </p>

              <div className="flex items-center">
                <Search />
                <div className="px-5">
                  <Button variant="primary" onClick={handleClaimClick}>
                    Claim now
                  </Button>
                </div>
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
        </div>
      </div>
    </Background>
  );
};

export default Home;
