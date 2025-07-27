import React from "react";
import TeacherInfo from "../components/TeacherInfo";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { defaultMenuItems } from "../components/Header";

const Teachers = () => {
  return (
    <div>
      <div className="bg-[#F9F7FE]">
        <DesktopNavbar menuItems={defaultMenuItems} blogBg={false} allCourseBg={false} />
        <MobileNavbar />
        <TeacherInfo />
      </div>
    </div>
  );
};

export default Teachers;
