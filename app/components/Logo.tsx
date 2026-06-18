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

export const ProfessionalTabLogo = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <Image
      src="/assets/images/professionalTabLogo.svg"
      alt="GRS Rehabilitation Center"
      priority
      width={mobile ? 120 : 178}
      height={mobile ? 28 : 42}
      className={mobile ? "h-[28px] w-auto" : undefined}
    />
  );
};

/** GRS + REHAB — rehabilitation section tabbar */
export const RehabilitationTabLogo = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <Image
      src="/assets/images/rehabilitationTabLogo.svg"
      alt="GRS Rehab"
      priority
      width={mobile ? 76 : 93}
      height={mobile ? 38 : 46}
      className={mobile ? "h-[29px] w-auto" : undefined}
    />
  );
};

/** GRS + BLOG — blog section tabbar */
export const BlogTabLogo = ({ mobile = false }: { mobile?: boolean }) => {
  return (
    <Image
      src="/assets/images/blogTabLogo.svg"
      alt="GRS Blog"
      priority
      width={mobile ? 76 : 93}
      height={mobile ? 38 : 46}
      className={mobile ? "h-[29px] w-auto" : undefined}
    />
  );
};
