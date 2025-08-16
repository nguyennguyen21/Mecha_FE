import SideBar from "../../modules/Admin/SideBar";
import ProfileForm from "../ShowApi/ShowProfile";
const DasboardPage = () =>{
    return(
        <div className="flex">
            <SideBar/>
            <div className="">
                <ProfileForm/>
            </div>
        </div>
    )
}
export default DasboardPage