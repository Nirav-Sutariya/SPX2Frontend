import React, { useState, useRef, useEffect, useMemo } from 'react';
import PluseIcon from '../assets/svg/PlusIcon.svg';
import MatrixIcon from '../assets/svg/MatrixIcon.svg';
import MinimumIcon from '../assets/svg/MinmumIcon.svg';
import DropdownIcon from '../assets/svg/DropdownIcon.svg';
import DownArrowIcon from '../assets/svg/DownArrowIcon.svg';
import DynamicMatrixIcon from '../assets/Images/DynamicMatrix/DynamicMatrixIcon.svg';
import axios from 'axios';
import ICChart from '../components/ICChart';
import ICChart2 from '../components/ICChart2';
import * as am4core from '@amcharts/amcharts4/core';
import { getToken, getUserId } from './login/loginAPI';
import TradingViewChart from '../components/TradingViewChart';
import TradingViewTicker from '../components/TradingViewTicker';
import DynamicCalculations from './savedMatrix/DynamicCalculations';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import DynamicLongCalculations from './savedMatrix/DynamicLongCalculations';

// Apply animated theme
am4core.useTheme(am4themes_animated);

const Dashboard = ({ theme }) => {

  const MatrixRef = useRef(null);
  const longPutRef = useRef(null);
  const premiumRef = useRef(null);
  const longCallRef = useRef(null);
  const shortCallRef = useRef(null);
  const contractsRef = useRef(null);
  const DynamicMatrixRef = useRef(null);
  const [names, setNames] = useState({});
  const [matrix, setMatrix] = useState(false);
  const [typeIC, setTypeIC] = useState("short");
  const [isMobile, setIsMobile] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [longICShow, setLongICShow] = useState(false);
  const [dynamicShow, setDynamicShow] = useState(false);
  const [shortICShow, setShortICShow] = useState(false);
  const [selectedName, setSelectedName] = useState(null);
  const [errors, setErrors] = useState({ premium: "" });
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [errors2, setErrors2] = useState({ premium: "" });
  const [matrixTypeValue, setMatrixTypeValue] = useState("SPX");
  const [dynamicMatrixToggle, setDynamicMatrixToggle] = useState(false);
  const [inputs, setInputs] = useState({
    shortPut: 4100,
    shortCall: 4170,
    longPut: 4095,
    longCall: 4175,
    premium: 2.15,
    contracts: 1,
  });
  const [inputs2, setInputs2] = useState({
    shortPut: 4100,
    shortCall: 4170,
    longPut: 4095,
    longCall: 4175,
    premium: 2.15,
    contracts: 1,
  });


  // Load stored values from localStorage
  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem('inputs'));
    if (storedValues) {
      setInputs(storedValues);
    }
  }, []);

  // Load stored values from localStorage
  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem('inputs2'));
    if (storedValues) {
      setInputs2(storedValues);
    }
  }, []);

  // Get Matrix List  Api
  async function getMatrixFromAPI(type) {
    let temp = {};
    let fetchedData = [];
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_DYNAMIC_MATRIX_URL), { typeIc: type, userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        let data = response.data.data;
        if (Array.isArray(data)) {
          fetchedData = data;
          data.forEach(item => {
            temp[item._id] = item.matrixName;
          });
        }
        setNames(temp);
        setSavedData(fetchedData);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 20 * 100);
  }, [msg])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        DynamicMatrixRef.current &&
        !DynamicMatrixRef.current.contains(event.target)
      ) {
        setDynamicMatrixToggle(false);
      }
      if (MatrixRef.current && !MatrixRef.current.contains(event.target)) {
        setMatrix(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const DynamicShowHandel = () => {
    setDynamicShow((prev) => !prev);
  }

  // Increment and Decrement for each input
  const handlePremiumIncrement = () => {
    setInputs((prev) => {
      const newValue = (parseFloat(prev.premium || 0) + 0.05).toFixed(2);
      localStorage.setItem('inputs', JSON.stringify({ ...prev, premium: newValue }));
      return { ...prev, premium: newValue.length <= 4 ? newValue : prev.premium };
    });
  };

  const handlePremiumDecrement = () => {
    setInputs((prev) => {
      const newValue = Math.max(0, parseFloat(prev.premium || 0) - 0.05).toFixed(2);
      localStorage.setItem('inputs', JSON.stringify({ ...prev, premium: newValue }));
      return { ...prev, premium: newValue.length <= 4 ? newValue : prev.premium };
    });
  };

  const handleContractIncrement = () => {
    setInputs((prevInputs) => {
      const newContracts = prevInputs.contracts + 1;
      localStorage.setItem('inputs', JSON.stringify({ ...prevInputs, contracts: newContracts }));
      return { ...prevInputs, contracts: newContracts };
    });
  };

  const handleContractDecrement = () => {
    setInputs((prevInputs) => {
      const newContracts = prevInputs.contracts - 1;
      localStorage.setItem('inputs', JSON.stringify({ ...prevInputs, contracts: newContracts }));
      return { ...prevInputs, contracts: newContracts };
    });
  };

  const handleShortCallIncrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      shortCall: String(Math.min(Number(prevInputs.shortCall || 0) + 5, 99999)),
    }));
    localStorage.setItem('inputs', JSON.stringify({ ...inputs, shortCall: String(Number(inputs.shortCall || 0) + 5) }));
  };

  const handleShortCallDecrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      shortCall: String(Math.max(Number(prevInputs.shortCall || 0) - 5, 0)),
    }));
    localStorage.setItem('inputs', JSON.stringify({ ...inputs, shortCall: String(Number(inputs.shortCall || 0) - 5) }));
  };

  const handleShortPutIncrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      shortPut: String(Math.min(Number(prevInputs.shortPut || 0) + 5, 99999)),
    }));
    localStorage.setItem('inputs', JSON.stringify({ ...inputs, shortPut: String(Number(inputs.shortPut || 0) + 5) }));
  };

  const handleShortPutDecrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      shortPut: String(Math.max(Number(prevInputs.shortPut || 0) - 5, 0)),
    }));
    localStorage.setItem('inputs', JSON.stringify({ ...inputs, shortPut: String(Number(inputs.shortPut || 0) - 5) }));
  };

  const handleLongCallIncrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      longCall: String(Math.min(Number(prevInputs.longCall || 0) + 5, 99999)),
    }));
    localStorage.setItem('inputs', JSON.stringify({ ...inputs, longCall: String(Number(inputs.longCall || 0) + 5) }));
  };

  const handleLongCallDecrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      longCall: String(Math.max(Number(prevInputs.longCall || 0) - 5, 0)),
    }));
    localStorage.setItem('inputs', JSON.stringify({ ...inputs, longCall: String(Number(inputs.longCall || 0) - 5) }));
  };

  const handleLongPutIncrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      longPut: String(Math.min(Number(prevInputs.longPut || 0) + 5, 99999)),
    }));
    localStorage.setItem('inputs', JSON.stringify({ ...inputs, longPut: String(Number(inputs.longPut || 0) + 5) }));
  };

  const handleLongPutDecrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      longPut: String(Math.max(Number(prevInputs.longPut || 0) - 5, 0)),
    }));
    localStorage.setItem('inputs', JSON.stringify({ ...inputs, longPut: String(Number(inputs.longPut || 0) - 5) }));
  };

  // Increment and Decrement for each input
  const handlePremiumIncrement2 = () => {
    setInputs2((prev) => {
      const newValue = (parseFloat(prev.premium || 0) + 0.05).toFixed(2);
      localStorage.setItem('inputs2', JSON.stringify({ ...prev, premium: newValue }));
      return { ...prev, premium: newValue.length <= 4 ? newValue : prev.premium };
    });
  };

  const handlePremiumDecrement2 = () => {
    setInputs2((prev) => {
      const newValue = Math.max(0, parseFloat(prev.premium || 0) - 0.05).toFixed(2);
      localStorage.setItem('inputs2', JSON.stringify({ ...prev, premium: newValue }));
      return { ...prev, premium: newValue.length <= 4 ? newValue : prev.premium };
    });
  };

  const handleContractIncrement2 = () => {
    setInputs2((prevInputs) => {
      const newContracts = prevInputs.contracts + 1;
      localStorage.setItem('inputs2', JSON.stringify({ ...prevInputs, contracts: newContracts }));
      return { ...prevInputs, contracts: newContracts };
    });
  };

  const handleContractDecrement2 = () => {
    setInputs2((prevInputs) => {
      const newContracts = prevInputs.contracts - 1;
      localStorage.setItem('inputs2', JSON.stringify({ ...prevInputs, contracts: newContracts }));
      return { ...prevInputs, contracts: newContracts };
    });
  };

  const handleShortCallIncrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      shortCall: String(Math.min(Number(prevInputs.shortCall || 0) + 5, 99999)),
    }));
    localStorage.setItem('inputs2', JSON.stringify({ ...inputs2, shortCall: String(Number(inputs2.shortCall || 0) + 5) }));
  };

  const handleShortCallDecrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      shortCall: String(Math.max(Number(prevInputs.shortCall || 0) - 5, 0)),
    }));
    localStorage.setItem('inputs2', JSON.stringify({ ...inputs2, shortCall: String(Number(inputs2.shortCall || 0) - 5) }));
  };

  const handleShortPutIncrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      shortPut: String(Math.min(Number(prevInputs.shortPut || 0) + 5, 99999)),
    }));
    localStorage.setItem('inputs2', JSON.stringify({ ...inputs2, shortPut: String(Number(inputs2.shortPut || 0) + 5) }));
  };

  const handleShortPutDecrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      shortPut: String(Math.max(Number(prevInputs.shortPut || 0) - 5, 0)),
    }));
    localStorage.setItem('inputs2', JSON.stringify({ ...inputs2, shortPut: String(Number(inputs2.shortPut || 0) - 5) }));
  };

  const handleLongCallIncrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      longCall: String(Math.min(Number(prevInputs.longCall || 0) + 5, 99999)),
    }));
    localStorage.setItem('inputs2', JSON.stringify({ ...inputs2, longCall: String(Number(inputs2.longCall || 0) + 5) }));
  };

  const handleLongCallDecrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      longCall: String(Math.max(Number(prevInputs.longCall || 0) - 5, 0)),
    }));
    localStorage.setItem('inputs2', JSON.stringify({ ...inputs2, longCall: String(Number(inputs2.longCall || 0) - 5) }));
  };

  const handleLongPutIncrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      longPut: String(Math.min(Number(prevInputs.longPut || 0) + 5, 99999)),
    }));
    localStorage.setItem('inputs2', JSON.stringify({ ...inputs2, longPut: String(Number(inputs2.longPut || 0) + 5) }));
  };

  const handleLongPutDecrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      longPut: String(Math.max(Number(prevInputs.longPut || 0) - 5, 0)),
    }));
    localStorage.setItem('inputs2', JSON.stringify({ ...inputs2, longPut: String(Number(inputs2.longPut || 0) - 5) }));
  };

  const handleKeyDown = (e, nextInputRef) => {
    if (e.key === "Enter" && nextInputRef) {
      nextInputRef.current.focus();  // Move focus to the next input field
    }
  };

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click for "Current Short IC Position"
  const ShortICShowHandel = () => {
    if (isMobile) {
      setShortICShow(!shortICShow);
    } else {
      const newState = !(shortICShow && longICShow);
      setShortICShow(newState);
      setLongICShow(newState);
    }
  };

  // Handle click for "Current Long IC Position"
  const LongICShowHandel = () => {
    if (isMobile) {
      setLongICShow(!longICShow);
    } else {
      const newState = !(shortICShow && longICShow);
      setShortICShow(newState);
      setLongICShow(newState);
    }
  };

  // Dynamically add the TradingView script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: theme,
      isTransparent: false,
      width: "100%",
      height: "450",
      locale: "en",
      importanceFilter: "-1,0,1",
      countryFilter: "us",
    });
    const container = document.getElementById("tradingview-widget");
    container.appendChild(script);

    // Cleanup on component unmount
    return () => {
      container.innerHTML = "";
    };
  }, [theme]);

  useEffect(() => {
    getMatrixFromAPI("short");
    const storedValues = JSON.parse(localStorage.getItem('inputs'));
    if (storedValues) {
      setInputs(storedValues);
    }
  }, []);

  useEffect(() => {
    const storedValues = JSON.parse(localStorage.getItem('inputs2'));
    if (storedValues) {
      setInputs2(storedValues);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const decimalRegex = /^\d*\.?\d*$/;

    if (value === "" || decimalRegex.test(value)) {
      if (name === "premium") {
        if (value !== "" && parseFloat(value) > 5) {
          setErrors({ ...errors, premium: "Premium value cannot exceed 5" });
          setTimeout(() => {
            setErrors({ ...errors, premium: "" });
          }, 2000);
        } else {
          setInputs({
            ...inputs,
            [name]: value,
          });
          localStorage.setItem('inputs', JSON.stringify({
            ...inputs,
            [name]: value,
          }));
        }
      } else {
        setInputs({
          ...inputs,
          [name]: value,
        });
        localStorage.setItem('inputs', JSON.stringify({
          ...inputs,
          [name]: value,
        }));
      }
    }
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    const decimalRegex = /^\d*\.?\d*$/;

    if (name === "premium") {
      if (value === "" || decimalRegex.test(value)) {
        if (value !== "" && parseFloat(value) > 5) {
          setErrors2({ ...errors2, premium: "Premium value cannot exceed 5" });
          setTimeout(() => {
            setErrors2({ ...errors2, premium: "" });
          }, 2000);
        } else {
          setInputs2({
            ...inputs2,
            [name]: value,
          });
          localStorage.setItem('inputs2', JSON.stringify({
            ...inputs2,
            [name]: value,
          }));
        }
      }
    } else {
      if (value === "" || decimalRegex.test(value)) {
        setInputs2({
          ...inputs2,
          [name]: value,
        });
        localStorage.setItem('inputs2', JSON.stringify({
          ...inputs2,
          [name]: value,
        }));
      }
    }
  };

  const handleDynamicMatrixSelection = async (type) => {
    setTypeIC(type);
    await getMatrixFromAPI(type);
    setDynamicMatrixToggle(false);
  };

  // Handle Matrix Type Dropdwon
  const handleChangeMatrixType = (event) => {
    setMatrixTypeValue(event.target.value);
  };


  return (
    <div className='px-[14px] lg:pl-10 lg:pr-[26px] mb-5'>
      <div className='flex flex-wrap gap-5'>
        <div className='relative'>
          <div className='flex items-center gap-3 md:gap-[18px] px-5 lg:px-[30px] py-[9px] rounded-md max-w-[303px] bg-background6 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => setDynamicMatrixToggle(!dynamicMatrixToggle)}>
            <img className='w-5' src={DynamicMatrixIcon} alt="" />
            <p className='text-sm lg:text-base text-Primary'>Dynamic Matrix {typeIC[0].toUpperCase() + typeIC.slice(1)}</p>
            <img src={DropdownIcon} alt="" />
          </div>
          {dynamicMatrixToggle && (
            <div ref={DynamicMatrixRef} className='absolute z-10 lg:left-5 max-w-[260px] mt-3 py-[14px] px-[30px] border border-[#F8FCFF] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
              <p onClick={() => handleDynamicMatrixSelection("short")} className='text-sm lg:text-base font-medium text-Secondary2 pb-1 cursor-pointer border-b border-border-Color'>Dynamic Short IC Matrix</p>
              <p onClick={() => handleDynamicMatrixSelection("long")} className='text-sm lg:text-base font-medium text-Secondary2 pt-1 cursor-pointer'>Dynamic Long IC Matrix</p>
            </div>
          )}
        </div>
        <div className='relative max-w-[350px]'>
          <div className='flex justify-between items-center gap-2 md:gap-3 px-5 py-[9px] rounded-md bg-background6 w-fit max-w-[350px] shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => setMatrix((prev) => !prev)}>
            <span className='flex gap-3'>
              <img className='w-5 lg:w-auto' src={MatrixIcon} alt="" />
              <p className='text-sm lg:text-base font-medium text-Primary'>{names[selectedName] || "Please Select Matrix"}</p>
            </span>
            <img src={DropdownIcon} alt="" />
          </div>
          {matrix && (
            <div ref={MatrixRef} className='absolute z-10 mt-2 py-1 lg:py-2 px-2 md:px-4 border border-[#F8FCFF] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
              {Object.keys(names).length === 0 ? (
                <p className='text-sm lg:text-base font-medium text-Secondary2 py-[3px] cursor-pointer text-nowrap'> No items found. </p>
              ) :
                (Object.keys(names).map((key) => (
                  <p key={key} className='text-sm lg:text-base font-medium text-Secondary2 py-[3px] cursor-pointer text-nowrap' onClick={() => {
                    setSelectedName(key);
                    setMatrix(false);
                  }}>{names[key]}</p>
                )))}
            </div>
          )}
        </div>
      </div>

      <div onClick={(e) => { DynamicShowHandel(true) }}>
        {!dynamicShow && <h2 className='text-lg lg:text-[22px] 2xl:text-[24px] font-semibold text-Primary mt-5 lg:mt-10 p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633] cursor-pointer flex items-center gap-5'>Dynamic Matrix <img className=' w-4 xl:w-5' src={DownArrowIcon} alt="" /> </h2>}
      </div>

      {dynamicShow && (savedData === null ?
        <div className="flex justify-center items-center h-[10vh]">
          <div role="status">
            <span className="text-Secondary2 text-lg">No saved record found on this matrix...</span>
          </div>
        </div> :
        <>
          {typeIC === "short" ? (
            names[selectedName] ? (
              (() => {
                const selectedMatrixData = savedData.find(matrix => matrix.matrixName === names[selectedName]);
                return selectedMatrixData ? (
                  <DynamicCalculations savedData={selectedMatrixData} nextGamePlan={true} DynamicShowHandel={DynamicShowHandel} />
                ) : (
                  <div className="flex justify-center items-center h-[10vh]">
                    <p className='text-Secondary2 text-lg'>No Record found...</p>
                  </div>
                );
              })()
            ) : (
              <div className="flex justify-center items-center h-[10vh]">
                <p className='text-Secondary2 text-lg'>No selection made...</p>
              </div>
            )
          ) : typeIC === "long" ? (
            names[selectedName] ? (
              (() => {
                const selectedMatrixData = savedData.find(matrix => matrix.matrixName === names[selectedName]);
                return selectedMatrixData ? (
                  <DynamicLongCalculations savedData={selectedMatrixData} nextGamePlan={true} DynamicShowHandel={DynamicShowHandel} />
                ) : (
                  <div className="flex justify-center items-center h-[10vh]">
                    <p className='text-Secondary2 text-lg'>No Record found...</p>
                  </div>
                );
              })()
            ) : (
              <div className="flex justify-center items-center h-[10vh]">
                <p className='text-Secondary2 text-lg'>No selection made...</p>
              </div>
            )
          ) : null}
        </>
      )}

      {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}

      <div className='grid md:grid-cols-2 gap-5 mt-5 lg:mt-10'>
        <div>
          <div onClick={ShortICShowHandel}>
            {!shortICShow && <h2 className='text-lg lg:text-[22px] 2xl:text-[24px] font-semibold text-Primary p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633] cursor-pointer flex items-center gap-5'>Current Short IC Position <img className=' w-4 xl:w-5' src={DownArrowIcon} alt="" /> </h2>}
          </div>
          {shortICShow && <div className='rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633]'>
            <div className='flex flex-wrap justify-between gap-3 p-3 pb-0 lg:p-5 lg:pb-0'>
              <h3 className='text-lg lg:text-[22px] 2xl:text-[24px] font-semibold text-Primary flex items-center gap-4 cursor-pointer' onClick={(e) => { ShortICShowHandel(false) }}>Current Short IC Position <img className="rotate-180 w-4 xl:w-5" src={DownArrowIcon} alt="" /></h3>
              <div className="w-full max-w-[70px] sm:max-w-[80px]">
                <select id="dropdown" value={matrixTypeValue} onChange={handleChangeMatrixType} className="text-xs lg:text-sm text-Primary px-2 lg:px-3 py-[7px] lg:py-[6px] border border-borderColor rounded-md bg-textBoxBg w-full focus:outline-none focus:border-borderColor7">
                  <option value="SPX">SPX</option>
                  <option value="RUT">RUT</option>
                  <option value="NDX">NDX</option>
                </select>
              </div>
            </div>
            <div className='grid sm:grid-cols-2 gap-4 mt-3 lg:mt-5 px-3 lg:px-5'>
              <label className='block text-sm lg:text-base text-Primary lg:font-medium'> Premium
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="premium" maxLength={4} title='Max Length 4' value={inputs.premium} ref={premiumRef} onKeyDown={(e) => handleKeyDown(e, contractsRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handlePremiumDecrement}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handlePremiumIncrement}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
                {errors.premium && (
                  <p className="text-red-500 text-xs mt-1">{errors.premium}</p>
                )}
              </label>
              <label className='block text-sm lg:text-base text-Primary lg:font-medium'> Contract
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="contracts" value={inputs.contracts} ref={contractsRef} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleContractDecrement}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleContractIncrement}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-[#089981] lg:font-medium'> Long Put
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="longPut" maxLength={5} title='Max Length 5' value={inputs.longPut} ref={longPutRef} onKeyDown={(e) => handleKeyDown(e, longCallRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base rounded-md w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleLongPutDecrement}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleLongPutIncrement}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-[#f23645] lg:font-medium'> Short Call
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="shortCall" maxLength={5} title='Max Length 5' value={inputs.shortCall} ref={shortCallRef} onKeyDown={(e) => handleKeyDown(e, longPutRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleShortCallDecrement}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleShortCallIncrement}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-[#f23645] lg:font-medium'> Short Put
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="shortPut" maxLength={5} title='Max Length 5' value={inputs.shortPut} onKeyDown={(e) => handleKeyDown(e, shortCallRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleShortPutDecrement}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleShortPutIncrement}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-[#089981] lg:font-medium'> Long Call
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="longCall" maxLength={5} title='Max Length 5' value={inputs.longCall} ref={longCallRef} onKeyDown={(e) => handleKeyDown(e, premiumRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleLongCallDecrement}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleLongCallIncrement}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
            </div>
            <div className='mt-5 lg:mt-10'>
              <ICChart inputs={inputs} theme={theme} matrixTypeValue={matrixTypeValue} />
            </div>
          </div>}
        </div>

        <div>
          <div onClick={LongICShowHandel}>
            {!longICShow && <h2 className='text-lg lg:text-[22px] 2xl:text-[24px] font-semibold text-Primary p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633] cursor-pointer flex items-center gap-5'>Current Long IC Position <img className=' w-4 xl:w-5' src={DownArrowIcon} alt="" /> </h2>}
          </div>
          {longICShow && <div className='rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633]'>
            <div className='flex flex-wrap justify-between gap-3 p-3 pb-0 lg:p-5 lg:pb-0'>  <h3 className='text-lg lg:text-[22px] 2xl:text-[24px] font-semibold text-Primary p-3 pb-0 lg:p-5 lg:pb-0 flex items-center gap-4 cursor-pointer' onClick={(e) => { LongICShowHandel(false) }}>Current Long IC Position <img className="rotate-180 w-4 xl:w-5" src={DownArrowIcon} alt="" /></h3>
              <div className="w-full max-w-[70px] sm:max-w-[80px]">
                <select id="dropdown" value={matrixTypeValue} onChange={handleChangeMatrixType} className="text-xs lg:text-sm text-Primary px-2 lg:px-3 py-[7px] lg:py-[6px] border border-borderColor rounded-md bg-textBoxBg w-full focus:outline-none focus:border-borderColor7">
                  <option value="SPX">SPX</option>
                  <option value="RUT">RUT</option>
                  <option value="NDX">NDX</option>
                </select>
              </div>
            </div>
            <div className='grid sm:grid-cols-2 gap-4 mt-3 lg:mt-5 px-3 lg:px-5'>
              <label className='block text-sm lg:text-base text-Primary lg:font-medium'> Premium
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="premium" maxLength={4} title='Max Length 4' value={inputs2.premium} ref={premiumRef} onKeyDown={(e) => handleKeyDown(e, contractsRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  {errors2.premium && (
                    <p className="text-red-500 text-xs mt-1">{errors2.premium}</p>
                  )}
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handlePremiumDecrement2}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handlePremiumIncrement2}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-Primary lg:font-medium'> Contract
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="contracts" value={inputs2.contracts} ref={contractsRef} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleContractDecrement2}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleContractIncrement2}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-[#f23645] lg:font-medium'> Short Put
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="shortPut" maxLength={5} title='Max Length 5' value={inputs2.shortPut} onKeyDown={(e) => handleKeyDown(e, shortCallRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleShortPutDecrement2}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleShortPutIncrement2}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-[#f23645] lg:font-medium'> Short Call
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="longCall" maxLength={5} title='Max Length 5' value={inputs2.longCall} ref={longCallRef} onKeyDown={(e) => handleKeyDown(e, premiumRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleLongCallDecrement2}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleLongCallIncrement2}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-[#089981] lg:font-medium'> Long Put
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="longPut" maxLength={5} title='Max Length 5' value={inputs2.longPut} ref={longPutRef} onKeyDown={(e) => handleKeyDown(e, longCallRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleLongPutDecrement2}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleLongPutIncrement2}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-[#089981] lg:font-medium'> Long Call
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <input type="text" placeholder='...' name="shortCall" maxLength={5} title='Max Length 5' value={inputs2.shortCall} ref={shortCallRef} onKeyDown={(e) => handleKeyDown(e, longPutRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={handleShortCallDecrement2}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={handleShortCallIncrement2}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
            </div>
            <div className=' mt-5 lg:mt-10'>
              <ICChart2 inputs2={inputs2} theme={theme} matrixTypeValue={matrixTypeValue} />
            </div>
          </div>}
        </div>
      </div>

      <div className='mt-5 lg:mt-10 p-4 lg:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633]'>
        <TradingViewTicker theme={theme} />
        <div className='TradingViewChart mt-3 lg:mt-5'>
          <TradingViewChart theme={theme} />
        </div>
      </div>

      <div className='mt-5 lg:mt-10 p-4 lg:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633]'>
        <div className='TradingViewChart'>
          <div className="tradingview-widget-container">
            <div id="tradingview-widget" className="tradingview-widget-container__widget"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;