import type { ReactNode } from 'react';

const Form = ({children}: {children: ReactNode}) =>{
return(
    <div className=" w-md rounded-3xl bg-[#072607] outline-none">
        <div className="p-5  ">
        {children}
        </div>
    </div>
)
}
export default Form;