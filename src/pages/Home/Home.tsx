import Header from "../../modules/User/components/Header/Headerr";
import Title from "../../modules/Core/Components/Titile/Titile";
import Content from "../../modules/Core/Components/Content/content";
import  Button from "../../modules/Core/Components/button/Button";
const Home = () => {
  return (
    <div className="">
      <Header />
      <div className="m-5 p-10">
      <div className=" items-center justify-center flex flex-col   bg-gray-100">
        <Title text="Welcome to the Home Page" />
        <Content text="This is the home page content." />
      </div>
        <div className="flex items-center justify-center mt-10">
            <Button variant="primary" onClick={() => alert('Primary Button Clicked!')}>
                Primary Button
            </Button>
                             
        </div>
      </div>
    </div>
  );
}

export default Home;
