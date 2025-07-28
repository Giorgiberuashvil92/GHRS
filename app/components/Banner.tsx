import React from "react";
import Image from "next/image";

interface BannerProps {
  backgroundUrl: string;
  logoUrl: string;
  icon?: string;
  iconWidth?: number;
  iconHeight?: number;
}

const Banner: React.FC<BannerProps> = ({
  backgroundUrl,
  logoUrl,
  icon,
  iconWidth = 269,
  iconHeight = 32,
}) => {
  return (
    <div className="bg-[#F9F7FE] pt-5 md:pt-0 mx-2 md:mx-0">
      <div
        className="rounded-t-[20px] mb-4 flex-col md:mb-0 md:pl-10 flex items-start justify-center md:justify-normal pt-6 w-full h-[97px] md:h-[150px] bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      >
        <div className="flex items-start gap-2 justify-center mx-auto -mt-6 md:mx-0 md:-mt-0">
          <Image
            src={logoUrl}
            width={189}
            height={66}
            alt="logo"
            className="w-[105px] h-10 md:w-[189px] md:h-[66px]"
          />
          {icon && (
            <Image
              src={icon}
              alt="icon"
              width={iconWidth}
              height={iconHeight}
              className="hidden md:flex md:max-w-[269px] md:min-w-[170px] md:min-h-[32px] md:max-h-[50px]"
            />
          )}
        </div>
        <Image
          src={"/assets/icons/c.png"}
          alt="icon"
          width={13}
          height={13}
          className="items-end justify-end md:ml-48 ml-[150px] -mt-4"
        />
      </div>
    </div>
  );
};

export default Banner;
