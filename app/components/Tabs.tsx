interface TabItem {
  label: string;
  href?: string;
}

interface TabsProps {
  items: TabItem[];
  activeTabIndex: number;
  onTabClick: (index: number) => void;
}

import React from "react";

const Tabs: React.FC<TabsProps> = ({ items, activeTabIndex, onTabClick }) => {
  return (
    <div className="md:col-span-2 order-2 mt-20 md:mt-0 md:order-1 bg-[rgba(233,223,246,1)] md:p-[40px] p-4 rounded-[20px] flex md:gap-[40px] gap-6 items-center relative">
      {items.map((item, idx) => (
        <button
          key={item.label}
          onClick={() => onTabClick(idx)}
          className={`text-[rgba(132,111,160,1)] md:text-2xl md:text-[17px] text-[10px] leading-[90%] md:leading-[120%] tracking-[0%] uppercase transition-all duration-200 px-2 pb-2 relative
            ${
              activeTabIndex === idx
                ? "text-[rgba(61,51,74,1)] font-bold after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-[rgba(61,51,74,1)] after:rounded-full"
                : "hover:text-[rgba(61,51,74,1)]"
            }
          `}
          style={{ background: "none", border: "none", outline: "none" }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
