import React, { useState, useRef, useEffect, useContext } from 'react';
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
import DynamicCalculations from './savedMatrix/DynamicCalculations';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import DynamicLongCalculations from './savedMatrix/DynamicLongCalculations';
import { Link } from 'react-router-dom';
import { AppContext } from '../components/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

// Apply animated theme
am4core.useTheme(am4themes_animated);

const Dashboard = ({ theme }) => {

  const MatrixRef = useRef(null);
  const longPutRef = useRef(null);
  const premiumRef = useRef(null);
  const longCallRef = useRef(null);
  const shortCallRef = useRef(null);
  const contractsRef = useRef(null);
  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const DynamicMatrixRef = useRef(null);
  const options = ["SPX", "RUT", "NDX"];
  const [names, setNames] = useState({});
  let appContext = useContext(AppContext);
  const [matrix, setMatrix] = useState(false);
  const [typeIC, setTypeIC] = useState("short");
  const [isMobile, setIsMobile] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [longICShow, setLongICShow] = useState(false);
  const [dynamicShow, setDynamicShow] = useState(false);
  const [shortICShow, setShortICShow] = useState(false);
  const [errors, setErrors] = useState({ premium: "" });
  const [selectedName, setSelectedName] = useState(null);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [errors2, setErrors2] = useState({ premium: "" });
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [dynamicMatrixToggle, setDynamicMatrixToggle] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(appContext.dashboardKey);
  const [selectedValue, setSelectedValue] = useState("SPX");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isAPILoaded, setIsAPILoaded] = useState(false);
  const [inputs, setInputs] = useState({
    shortPut: 4100,
    shortCall: 4170,
    longPut: 4095,
    longCall: 4175,
    premium: 2.15,
    contracts: 1,
  });
  const [inputs2, setInputs2] = useState({
    shortPut: 4095,
    shortCall: 4170,
    longPut: 4100,
    longCall: 4175,
    premium: 2.15,
    contracts: 1,
  });

  // Admin Access For Dashboard Api
  async function getDashboardKey() {
    if (appContext.dashboardKey) return;

    setIsMessageVisible(true);
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_DASHBOARD_VIEW_KRY), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setDashboardKey(response.data.data);
        appContext.setAppContext((curr) => ({
          ...curr,
          dashboardKey: response.data.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    finally {
      setIsMessageVisible(false);
    }
  }

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
          fetchedData = data.filter(item => item.levels && item.levels.length > 0);
          fetchedData.forEach(item => {
            temp[item._id] = item.matrixName;
          });

          // fetchedData = data;
          // data.forEach(item => {
          //   temp[item._id] = item.matrixName;
          // });
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

  // Load stored values from localStorage
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

  useEffect(() => {
    const loadAllData = async () => {
      await getDashboardKey();
      await getMatrixFromAPI("short");
      if (msg.type !== "") {
        setTimeout(() => setMsg({ type: "", msg: "" }), 2000);
      }
      setIsAPILoaded(true);
    };

    loadAllData();
  }, [msg]);

  const DynamicShowHandel = () => {
    setDynamicShow((prev) => !prev);
  }

  // Increment and Decrement for each input
  const handlePremiumIncrement = () => {
    setInputs((prev) => {
      const newValue = (parseFloat(prev.premium || 0) + 0.05).toFixed(2);
      return { ...prev, premium: newValue.length <= 4 ? newValue : prev.premium };
    });
  };

  const handlePremiumDecrement = () => {
    setInputs((prev) => {
      const newValue = Math.max(0, parseFloat(prev.premium || 0) - 0.05).toFixed(2);
      return { ...prev, premium: newValue.length <= 4 ? newValue : prev.premium };
    });
  };

  const handleContractIncrement = () => {
    setInputs((prevInputs) => {
      const newContracts = prevInputs.contracts + 1;
      return { ...prevInputs, contracts: newContracts };
    });
  };

  const handleContractDecrement = () => {
    setInputs((prevInputs) => {
      const newContracts = prevInputs.contracts - 1;
      return { ...prevInputs, contracts: newContracts };
    });
  };

  const handleShortCallIncrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      shortCall: String(Math.min(Number(prevInputs.shortCall || 0) + 5, 99999)),
    }));
  };

  const handleShortCallDecrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      shortCall: String(Math.max(Number(prevInputs.shortCall || 0) - 5, 0)),
    }));
  };

  const handleShortPutIncrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      shortPut: String(Math.min(Number(prevInputs.shortPut || 0) + 5, 99999)),
    }));
  };

  const handleShortPutDecrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      shortPut: String(Math.max(Number(prevInputs.shortPut || 0) - 5, 0)),
    }));
  };

  const handleLongCallIncrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      longCall: String(Math.min(Number(prevInputs.longCall || 0) + 5, 99999)),
    }));
  };

  const handleLongCallDecrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      longCall: String(Math.max(Number(prevInputs.longCall || 0) - 5, 0)),
    }));
  };

  const handleLongPutIncrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      longPut: String(Math.min(Number(prevInputs.longPut || 0) + 5, 99999)),
    }));
  };

  const handleLongPutDecrement = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      longPut: String(Math.max(Number(prevInputs.longPut || 0) - 5, 0)),
    }));
  };

  // Increment and Decrement for each input
  const handlePremiumIncrement2 = () => {
    setInputs2((prev) => {
      const newValue = (parseFloat(prev.premium || 0) + 0.05).toFixed(2);
      return { ...prev, premium: newValue.length <= 4 ? newValue : prev.premium };
    });
  };

  const handlePremiumDecrement2 = () => {
    setInputs2((prev) => {
      const newValue = Math.max(0, parseFloat(prev.premium || 0) - 0.05).toFixed(2);
      return { ...prev, premium: newValue.length <= 4 ? newValue : prev.premium };
    });
  };

  const handleContractIncrement2 = () => {
    setInputs2((prevInputs) => {
      const newContracts = prevInputs.contracts + 1;
      return { ...prevInputs, contracts: newContracts };
    });
  };

  const handleContractDecrement2 = () => {
    setInputs2((prevInputs) => {
      const newContracts = prevInputs.contracts - 1;
      return { ...prevInputs, contracts: newContracts };
    });
  };

  const handleShortCallIncrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      shortCall: String(Math.min(Number(prevInputs.shortCall || 0) + 5, 99999)),
    }));
  };

  const handleShortCallDecrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      shortCall: String(Math.max(Number(prevInputs.shortCall || 0) - 5, 0)),
    }));
  };

  const handleShortPutIncrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      shortPut: String(Math.min(Number(prevInputs.shortPut || 0) + 5, 99999)),
    }));
  };

  const handleShortPutDecrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      shortPut: String(Math.max(Number(prevInputs.shortPut || 0) - 5, 0)),
    }));
  };

  const handleLongCallIncrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      longCall: String(Math.min(Number(prevInputs.longCall || 0) + 5, 99999)),
    }));
  };

  const handleLongCallDecrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      longCall: String(Math.max(Number(prevInputs.longCall || 0) - 5, 0)),
    }));
  };

  const handleLongPutIncrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      longPut: String(Math.min(Number(prevInputs.longPut || 0) + 5, 99999)),
    }));
  };

  const handleLongPutDecrement2 = () => {
    setInputs2((prevInputs) => ({
      ...prevInputs,
      longPut: String(Math.max(Number(prevInputs.longPut || 0) - 5, 0)),
    }));
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
    if (!isAPILoaded) return;

    const container = document.getElementById("tradingview-widget");

    if (!container) {
      console.warn("TradingView container not found");
      return;
    }
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

    container.appendChild(script);

    // Cleanup on component unmount
    return () => {
      container.innerHTML = "";
    };
  }, [theme, isAPILoaded]);

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
        }
      } else {
        setInputs({
          ...inputs,
          [name]: value,
        });
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
        }
      }
    } else {
      if (value === "" || decimalRegex.test(value)) {
        setInputs2({
          ...inputs2,
          [name]: value,
        });
      }
    }
  };

  const handleDynamicMatrixSelection = async (type) => {
    setTypeIC(type);
    await getMatrixFromAPI(type);
    setDynamicMatrixToggle(false);

    // Find the first item with matching type
    if (!Array.isArray(savedData)) return;
    const filteredItems = savedData.filter(item => item.type === type);
    if (filteredItems.length > 0) {
      setSelectedName(filteredItems[0]._id);
    } else {
      setSelectedName(null);
    }
  };

  // Handle Matrix Type Dropdown
  const handleSelect = (value) => {
    setSelectedValue(value);
    setOpenDropdown(null);
    getCurrentIcPosition(value);
    getCurrentIcPosition2(value);
  };

  const handleOutsideClick = (e) => {
    if (
      dropdownRef1.current &&
      !dropdownRef1.current.contains(e.target) &&
      dropdownRef2.current &&
      !dropdownRef2.current.contains(e.target)
    ) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    getCurrentIcPosition("SPX");
    getCurrentIcPosition2("SPX");
  }, []);

  useEffect(() => {
    if (savedData && savedData.length > 0 && !selectedName) {
      const firstShort = savedData.find(item => item.type === "short");
      if (firstShort) setSelectedName(firstShort._id);
      else setSelectedName(savedData[0]._id);
    }
  }, [savedData, selectedName]);

  // Get User Data Fined
  async function currentIcPosition() {
    const payload = {
      userId: getUserId(),
      typeIc: "short",
      type: selectedValue,
      premium: parseFloat(inputs.premium),
      contract: parseInt(inputs.contracts),
      longCall: parseInt(inputs.longCall),
      longPut: parseInt(inputs.longPut),
      shortCall: parseInt(inputs.shortCall),
      shortPut: parseInt(inputs.shortPut),
    };
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_CREATE_CURRENT_IC_POSITION_URL), { ...payload }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setMsg({ type: "info", msg: 'Current Short IC Position Save successful' });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Get User Data Fined
  async function currentIcPosition2() {
    const payload = {
      userId: getUserId(),
      typeIc: "long",
      type: selectedValue,
      premium: parseFloat(inputs2.premium),
      contract: parseInt(inputs2.contracts),
      longCall: parseInt(inputs2.longCall),
      longPut: parseInt(inputs2.longPut),
      shortCall: parseInt(inputs2.shortCall),
      shortPut: parseInt(inputs2.shortPut),
    };
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_CREATE_CURRENT_IC_POSITION_URL), { ...payload }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setMsg({ type: "info", msg: 'Current Short IC Position Save successful' });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function getCurrentIcPosition(newType) {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_CURRENT_IC_POSITION_URL), { userId: getUserId(), typeIc: "short", type: newType }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        const data = response.data.data;
        setInputs({
          premium: data.premium || 2.15,
          contracts: data.contract || 1,
          longCall: data.longCall || 4175,
          longPut: data.longPut || 4095,
          shortCall: data.shortCall || 4170,
          shortPut: data.shortPut || 4100,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function getCurrentIcPosition2(newType) {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_CURRENT_IC_POSITION_URL), { userId: getUserId(), typeIc: "long", type: newType }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        const data = response.data.data;
        setInputs2({
          premium: data.premium || 2.15,
          contracts: data.contract || 1,
          longCall: data.longCall || 4175,
          longPut: data.longPut || 4095,
          shortCall: data.shortCall || 4170,
          shortPut: data.shortPut || 4100,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }


  return (<>
    {dashboardKey ?
      <div className='px-[14px] lg:pl-10 lg:pr-[26px] mb-5'>
        <div className='flex flex-wrap gap-5'>
          <div className='relative' ref={DynamicMatrixRef}>
            <div className='flex items-center gap-3 md:gap-[18px] px-5 lg:px-[30px] py-[9px] rounded-md max-w-[303px] bg-background6 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => setDynamicMatrixToggle(!dynamicMatrixToggle)}>
              <img className='w-5' src={DynamicMatrixIcon} alt="" />
              <p className='text-sm lg:text-base text-Primary'>Dynamic Matrix {typeIC[0].toUpperCase() + typeIC.slice(1)}</p>
              <img src={DropdownIcon} alt="" />
            </div>
            <AnimatePresence>
              {dynamicMatrixToggle && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.50, ease: "easeInOut" }}
                  className='absolute z-10 lg:left-5 max-w-[260px] mt-3 py-[14px] px-[30px] border border-[#F8FCFF] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
                  <p onClick={() => handleDynamicMatrixSelection("short")} className='text-sm lg:text-base font-medium text-Secondary2 pb-1 cursor-pointer border-b border-border-Color'>Dynamic Short IC Matrix</p>
                  <p onClick={() => handleDynamicMatrixSelection("long")} className='text-sm lg:text-base font-medium text-Secondary2 pt-1 cursor-pointer'>Dynamic Long IC Matrix</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className='relative max-w-[350px]' ref={MatrixRef}>
            <div className='flex justify-between items-center gap-2 md:gap-3 px-5 py-[9px] rounded-md bg-background6 w-fit max-w-[350px] shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => setMatrix((prev) => !prev)}>
              <span className='flex gap-3'>
                <img className='w-5 lg:w-auto' src={MatrixIcon} alt="" />
                <p className='text-sm lg:text-base font-medium text-Primary'>{names[selectedName] || "Please Select Matrix"}</p>
              </span>
              <img src={DropdownIcon} alt="" />
            </div>
            <AnimatePresence>
              {matrix && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.50, ease: "easeInOut" }}
                  className='absolute z-10 mt-2 py-1 lg:py-2 px-2 md:px-4 border border-[#F8FCFF] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]' >
                  {Array.isArray(savedData) && savedData.filter(item => item.levels && item.levels.length > 0).length === 0 ? (
                    <p className='text-sm lg:text-base font-medium text-Secondary2 py-[3px] cursor-pointer text-nowrap'> No items found. </p>
                  ) : (
                    savedData.filter(item => item.levels && item.levels.length > 0).map(item => (
                      <p key={item._id} className='text-sm lg:text-base font-medium text-Secondary2 py-[3px] cursor-pointer text-nowrap' onClick={() => { setSelectedName(item._id); setMatrix(false); }} >
                        {item.matrixName}
                      </p>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
                    <div className="text-base lg:text-lg text-Secondary2 mt-5 lg:mt-10 p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633] cursor-pointer flex items-center gap-5">
                      No selection made...
                    </div>
                  );
                })()
              ) : (
                <div className="text-base lg:text-lg text-Secondary2 mt-5 lg:mt-10 p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633] cursor-pointer flex items-center gap-5">
                  No selection made...
                </div>
              )
            ) : typeIC === "long" ? (
              names[selectedName] ? (
                (() => {
                  const selectedMatrixData = savedData.find(matrix => matrix.matrixName === names[selectedName]);
                  return selectedMatrixData ? (
                    <DynamicLongCalculations savedData={selectedMatrixData} nextGamePlan={true} DynamicShowHandel={DynamicShowHandel} />
                  ) : (
                    <div className="text-base lg:text-lg text-Secondary2 mt-5 lg:mt-10 p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633] cursor-pointer flex items-center gap-5">
                      No selection made...
                    </div>
                  );
                })()
              ) : (
                <div className="text-base lg:text-lg text-Secondary2 mt-5 lg:mt-10 p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633] cursor-pointer flex items-center gap-5">
                  No selection made...
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
                <div className='flex gap-3 w-[160px]'>
                  <button type="button" className="text-sm lg:text-base text-white bg-ButtonBg rounded-md py-1 max-w-[80px] w-full" onClick={currentIcPosition}>
                    Save
                  </button>
                  <div ref={dropdownRef1} className="relative w-full max-w-[80px] text-xs lg:text-sm">
                    <button className="w-full text-left px-3 py-[6px] border border-borderColor rounded-md bg-textBoxBg text-Primary flex items-center justify-between" onClick={() => setOpenDropdown(openDropdown === "first" ? null : "first")} >
                      {selectedValue}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-Primary ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {openDropdown === "first" && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-borderColor rounded-md shadow-md">
                        {options.map((opt) => (
                          <li key={opt} onClick={() => handleSelect(opt)} className="px-3 py-1 hover:bg-borderColor4 hover:text-white text-Primary rounded cursor-pointer">
                            {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className='grid sm:grid-cols-2 gap-4 mt-3 lg:mt-5 px-3 lg:px-5'>
                <label className='block text-sm lg:text-base text-Primary lg:font-medium'> Premium
                  <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                    <input type="text" inputMode='numeric' placeholder='...' name="premium" maxLength={4} title='Max Length 4' value={inputs.premium} ref={premiumRef} onKeyDown={(e) => handleKeyDown(e, contractsRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="contracts" value={inputs.contracts} ref={contractsRef} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="longPut" maxLength={5} title='Max Length 5' value={inputs.longPut} ref={longPutRef} onKeyDown={(e) => handleKeyDown(e, longCallRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base rounded-md w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="shortCall" maxLength={5} title='Max Length 5' value={inputs.shortCall} ref={shortCallRef} onKeyDown={(e) => handleKeyDown(e, longPutRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="shortPut" maxLength={5} title='Max Length 5' value={inputs.shortPut} onKeyDown={(e) => handleKeyDown(e, shortCallRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="longCall" maxLength={5} title='Max Length 5' value={inputs.longCall} ref={longCallRef} onKeyDown={(e) => handleKeyDown(e, premiumRef)} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                <ICChart inputs={inputs} theme={theme} matrixTypeValue={selectedValue} price={appContext.marketData?.[selectedValue.toLowerCase()]?.price} />
              </div>
            </div>}
          </div>

          <div>
            <div onClick={LongICShowHandel}>
              {!longICShow && <h2 className='text-lg lg:text-[22px] 2xl:text-[24px] font-semibold text-Primary p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633] cursor-pointer flex items-center gap-5'>Current Long IC Position <img className=' w-4 xl:w-5' src={DownArrowIcon} alt="" /> </h2>}
            </div>
            {longICShow && <div className='rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633]'>
              <div className='flex flex-wrap justify-between gap-3 p-3 pb-0 lg:p-5 lg:pb-0'>
                <h3 className='text-lg lg:text-[22px] 2xl:text-[24px] font-semibold text-Primary flex items-center gap-4 cursor-pointer' onClick={(e) => { LongICShowHandel(false) }}>Current Long IC Position <img className="rotate-180 w-4 xl:w-5" src={DownArrowIcon} alt="" /></h3>
                <div className='flex gap-3 w-[160px]'>
                  <button type="button" className="text-sm lg:text-base text-white bg-ButtonBg rounded-md py-1 max-w-[80px] w-full" onClick={currentIcPosition2}>
                    Save
                  </button>
                  <div ref={dropdownRef2} className="relative w-full max-w-[80px] text-xs lg:text-sm">
                    <button className="w-full text-left px-3 py-[6px] border border-borderColor rounded-md bg-textBoxBg text-Primary flex items-center justify-between" onClick={() => setOpenDropdown(openDropdown === "second" ? null : "second")} >
                      {selectedValue}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-Primary ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {openDropdown === "second" && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-borderColor rounded-md shadow-md">
                        {options.map((opt) => (
                          <li key={opt} onClick={() => handleSelect(opt)} className="px-3 py-1 hover:bg-borderColor4 hover:text-white text-Primary rounded cursor-pointer">
                            {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className='grid sm:grid-cols-2 gap-4 mt-3 lg:mt-5 px-3 lg:px-5'>
                <label className='block text-sm lg:text-base text-Primary lg:font-medium'> Premium
                  <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                    <input type="text" inputMode='numeric' placeholder='...' name="premium" maxLength={4} title='Max Length 4' value={inputs2.premium} ref={premiumRef} onKeyDown={(e) => handleKeyDown(e, contractsRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="contracts" value={inputs2.contracts} ref={contractsRef} onChange={handleInputChange} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="shortPut" maxLength={5} title='Max Length 5' value={inputs2.shortPut} onKeyDown={(e) => handleKeyDown(e, shortCallRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="longCall" maxLength={5} title='Max Length 5' value={inputs2.longCall} ref={longCallRef} onKeyDown={(e) => handleKeyDown(e, premiumRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="longPut" maxLength={5} title='Max Length 5' value={inputs2.longPut} ref={longPutRef} onKeyDown={(e) => handleKeyDown(e, longCallRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                    <input type="text" inputMode='numeric' placeholder='...' name="shortCall" maxLength={5} title='Max Length 5' value={inputs2.shortCall} ref={shortCallRef} onKeyDown={(e) => handleKeyDown(e, longPutRef)} onChange={handleInputChange2} className='bg-textBoxBg text-sm lg:text-base w-full focus:outline-none focus:border-borderColor7' />
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
                <ICChart2 inputs2={inputs2} theme={theme} matrixTypeValue={selectedValue} price={appContext.marketData?.[selectedValue.toLowerCase()]?.price} />
              </div>
            </div>}
          </div>
        </div>

        <div className='mt-5 lg:mt-10 p-4 lg:p-5 rounded-md bg-background6 shadow-[0px_0px_8px_0px_#28236633]'>
          <div className='TradingViewChart'>
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
      :
      <>
        {isMessageVisible ?
          <div className="flex justify-center items-center h-[100vh]">
            <div role="status">
              <svg aria-hidden="true" className="w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div> : <Link to={"/subscription"} className='text-lg text-Primary flex justify-center items-center h-3/4'>Please upgrade your plan...</Link>}
      </>
    }
  </>
  );
}

export default Dashboard;