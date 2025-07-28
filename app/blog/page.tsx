"use client";

import Header, { defaultMenuItems } from "../components/Header";

import Blog from "../components/Blog";
import DesktopNavbar from "../components/Navbar/DesktopNavbar";
import MobileNavbar from "../components/Navbar/MobileNavbar";

const BlogRoute = () => {
  return (
    <div>
      <DesktopNavbar menuItems={defaultMenuItems} blogBg={true} />
      <MobileNavbar />
      <Header variant="blog" />
      <div className="flex flex-col">
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
    </div>
  );
};

export default BlogRoute;
