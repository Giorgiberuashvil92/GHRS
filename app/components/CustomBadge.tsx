import React from 'react';

const CustomBadge = ({
  text = 'DEFAULT TEXT',
  bgColor = 'bg-[#E9DFF6]',
  textColor = 'text-[#3D334A]',
  padding = 'p-[8px]',
  margin = 'm-[20px]',
  rounded = 'rounded-[6px]',
  textSize = 'text-[12px]',
}) => {
  return (
    <div className={`${padding} ${rounded} ${bgColor} ${margin} inline-block leading-[90%]`}>
      <h3 className={`uppercase font-bold ${textColor} ${textSize}`}>
        {text}
      </h3>
    </div>
  );
};

export default CustomBadge;
