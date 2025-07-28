type ProgressBarProps = {
  current: number;
  total: number;
};

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = (current / total) * 100;

  const showProgress = current >= 1;

  return (
    <div className="flex items-center gap-[18px] md:mt-4">
      <div className="relative w-[137px] md:w-[492px] h-1 bg-[#F9F7FE] rounded-[5px]">
        {showProgress && (
          <div
            className="absolute h-1 rounded-[5px] top-0 left-0"
            style={{
              width: `${progress}%`,
              backgroundColor: "#A084DC",
            }}
          />
        )}
      </div>
      <h5 className="text-[12px] md:text-[20px] text-[#846FA0] leading-[100%] font-medium">
        {current}/{total}
      </h5>
    </div>
  );
};

export default ProgressBar;
