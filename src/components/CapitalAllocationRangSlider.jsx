import React, { useMemo, useState } from 'react';

const CapitalAllocationRangSlider = ({ allocation, setAllocation }) => {

  const handleSliderChange = (e) => {
    e.preventDefault();
    setAllocation(Number(e.target.value));
  };

  const [msg, setMsg] = useState("");

  const handleInputChange = (e) => {
    if (e.target.value < 25 || e.target.value > 100)
      if (msg === "")
        setMsg("Capital Allocation must be between 25 and 100");
    setAllocation(e.target.value);
  };

  useMemo(() => {
    if (msg !== "")
      setTimeout(() => {
        setMsg("")
      }, 50 * 100);
  }, [msg])


  return (
    <>
      <div className='bg-gradient2 rounded-[6px] max-w-[792px] px-3 py-[14px] lg:p-5 mt-5 lg:mt-10 Capital'>
        <div className='flex justify-between items-center'>
          <h2 className='text-sm lg:text-[28px] lg:leading-[42px] font-semibold text-white '>Capital Allocation</h2>
          <div className='flex items-center gap-1'>
            <input type="number" value={allocation} onChange={handleInputChange}
              onClick={(e) => e.preventDefault()}
              onBlur={(e) => {
                if (e.target.value === "")
                  e.target.value = 100
                let inputValue = Number(e.target.value);

                if (inputValue > 24 && inputValue <= 100) {
                  setAllocation(inputValue);
                } else if (inputValue < 25) {
                  setAllocation(25);
                } else if (inputValue > 100) {
                  setAllocation(100);
                }
                setMsg("")
              }} className="text-center no-arrows text-xs lg:text-[20px] lg:leading-[30px] font-semibold text-white bg-[#5A9FC9] px-2 lg:px-[8px] py-[3px] border border-borderColor rounded-[6px] w-10 lg:w-14 focus:outline-none " />
            <h3 className='text-xs lg:text-[20px] lg:leading-[30px] text-white font-semibold'>%</h3>
          </div>
        </div>
        <div className="flex flex-col items-center mt-[17px] mb-[10px] lg:mr-[30px]">
          <input type="range"
            min="25"
            max="100"
            value={allocation || 100}
            onChange={handleSliderChange}
            onFocusCapture={(e) => e.preventDefault()}
            className="slider h-[3px] w-full custom-slider cursor-pointer"
          />
          <div className='flex justify-between lg:mb-4 w-[96%] lg:w-[98%]'>
            <div className="w-[7px] h-[7px] bg-white rounded-full -mt-[5px] -ml-2"></div>
            <div className="w-[7px] h-[7px] bg-white rounded-full -mt-[5px]"></div>
            <div className="w-[7px] h-[7px] bg-white rounded-full -mt-[5px]"></div>
            <div className="w-[7px] h-[7px] bg-white rounded-full -mt-[5px] -mr-2"></div>
          </div>
        </div>
        <div className="flex justify-between">
          <span className='text-xs lg:text-base text-white'>25%</span>
          <span className='text-xs lg:text-base text-white'>50%</span>
          <span className='text-xs lg:text-base text-white'>75%</span>
          <span className='text-xs lg:text-base text-white'>100%</span>
        </div>
      </div>
      {/* error massage */}
      {msg !== "" && <p className='text-sm text-[#D82525] mt-2'>{msg}.</p>}
    </>
  );
}

export default CapitalAllocationRangSlider;
