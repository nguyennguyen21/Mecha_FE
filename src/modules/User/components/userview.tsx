import React from "react";
import { type CustomStyles } from "../../../types";

export interface ProfileStyleProps {
  idUser: number;
  customStyles: CustomStyles;
  setCustomStyles: React.Dispatch<React.SetStateAction<CustomStyles>>;
}

const ProfileStyle: React.FC<ProfileStyleProps> = ({
  idUser,
  customStyles,
  setCustomStyles,
}) => {
  return (
    <div>
      <h1>Profile ID: {idUser}</h1>
      <p>Profile border: {customStyles.profileBorder}</p>
      <button
        onClick={() =>
          setCustomStyles({ ...customStyles, profileBorder: "2px solid pink" })
        }
      >
        Set Pink Border
      </button>
    </div>
  );
};

export default ProfileStyle;
