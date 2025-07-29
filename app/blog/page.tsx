"use client";

import Header, { defaultMenuItems } from "../components/Header";

import Blog from "../components/Blog";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";
import { Footer } from "../components/Footer";

const BlogRoute = () => {
  return (
    <div className="bg-[#F9F7FE]">
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={true} allCourseBg={false} />
      <MobileNavbar />
      <Header variant="blog" />
      <div className="flex flex-col gap-10 mb-10">
        <Blog
          withBanner={false}
          withSlider={false}
          layoutType="default"
          title=""
        />
        <Blog
          withBanner={false}
          withSlider={false}
          layoutType="other"
          title="Популярные статьи"
        />
        <Blog
          withBanner={false}
          withSlider={false}
          layoutType="default"
          title="Неврология"
        />
        <Blog
          withBanner={false}
          withSlider={false}
          layoutType="thirdGrid"
          title="Ортопедия"
        />
      </div>
      <Footer />
    </div>
  );
};

export default BlogRoute;
