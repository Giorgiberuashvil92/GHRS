import Image from "next/image";
import React from "react";

export const MobileLogo = () => {
  return (
    <div className="">
      <Image
        src={"/assets/images/mobileLogo.svg"}
        alt="mobileLogo"
        priority
        width={76}
        height={29}
      />
    </div>
  );
};

export const SimpleLogo = () => {
  return (
    <Image
      src="/assets/images/simpleLogo.svg"
      alt="simpleLogo"
      priority
      width={108}
      height={42}
    />
  );
};

export const MediaLogo = () => {
  return <div>Logo</div>;
};

export const RehabilitationLogo = () => {
  return <div>Logo</div>;
};
