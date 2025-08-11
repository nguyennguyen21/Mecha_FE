import Header from "../../modules/User/components/Header/Headerr";
import Title from "../../modules/Core/Components/Titile/Titile";
import Content from "../../modules/Core/Components/Content/content";
import  Button from "../../modules/Core/Components/button/Button";
import Search from "../../modules/Core/Components/Search/Search";
import profile from "../../../src/assets/imgs/undraw_github-profile_abde (1).svg"
const Home = () => {
  return (
    <div className="">
      <Header />
      <div className=" p-10 mt-10">
        <div className="top-20">
      <div className=" items-center justify-center flex flex-col text-white   ">
        <Title text="Welcome to the Home Page" />
        <Content text="This is the home page content." />
        <div className="flex items-center justify-center mt-10 p-10">
            <Search />
            <div className="px-5">
            <Button variant="primary"  onClick={() => alert('Primary Button Clicked!')}>
                Primary Button
            </Button>  
            </div>  
            </div>  
             <div className="grid grid-cols-2 gap-2">
  <div>
    <img src={profile} alt="" />
  </div>       
   <div>
    <img src={profile} alt="" />
  </div>        
        </div>
      </div>
      
       
      </div>
      </div>
    </div>
  );
}

export default Home;
