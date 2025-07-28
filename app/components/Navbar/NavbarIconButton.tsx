import Image from "next/image";
import React from "react";

interface IconButtonProps {
  alt: string;
  src: string;
  className?: string;
}

const NavbarIconButton: React.FC<IconButtonProps> = ({
  src,
  alt,
  className = "",
}) => (
  <div
    className={`w-10 h-10 md:w-[70px] md:h-[70px] flex items-center justify-center rounded-[10px] md:rounded-[20px] bg-gradient-to-br from-[rgba(94,43,143,0.4)] to-[rgba(61,51,74,0.3)] ${className}`}
  >
    <Image src={src} alt={alt} width={20} height={20} />
  </div>
);

export default NavbarIconButton;
