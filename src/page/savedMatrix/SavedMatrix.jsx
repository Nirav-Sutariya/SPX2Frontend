import React, { useState, useEffect, useRef, useMemo } from 'react';
import MatrixIcon from '../../assets/svg/MatrixIcon.svg';
import DropdownIcon from '../../assets/svg/DropdownIcon.svg';
import DropdownIconWhite from '../../assets/svg/DropDwonIconWite.svg';
import StaticMatrixIcon from '../../assets/Images/StaticMatrix/StaticMatrixIcon.svg';
import DynamicMatrixIcon from '../../assets/Images/DynamicMatrix/DynamicMatrixIcon.svg';
import axios from 'axios';
import StaticCalculations from './StaticCalculations';
import DynamicCalculations from './DynamicCalculations';
import StaticLongCalculations from './StaticLongCalculations';
import DynamicLongCalculations from './DynamicLongCalculations';
import { getToken, getUserId } from '../../page/login/loginAPI';
import { motion, AnimatePresence } from 'framer-motion';

const SavedMatrix = () => {

  const MatrixRef = useRef(null);
  const StaticMatrixRef = useRef(null);
  const DynamicMatrixRef = useRef(null);
  const [names, setNames] = useState({});
  const [matrix, setMatrix] = useState(false);
  const [savedData, setSavedData] = useState({});
  const [savedSMLCount, setSavedSMLCount] = useState(0);
  const [savedSMSCount, setSavedSMSCount] = useState(0);
  const [savedDMLCount, setSavedDMLCount] = useState(0);
  const [savedDSMCount, setSavedDSMCount] = useState(0);
  const [recordLimit, setRecordLimit] = useState(0);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [selectedName, setSelectedName] = useState(null);
  const [staticMatrix, setStaticMatrix] = useState(false);
  const [dynamicMatrix, setDynamicMatrix] = useState(false);
  const [selectedMatrix, setSelectedMatrix] = useState("static");
  const [selectedStaticOption, setSelectedStaticOption] = useState("short");
  const [selectedDynamicOption, setSelectedDynamicOption] = useState(null);


  // Subscription By Detail Find on Record Limit
  async function fetchUserSubscription() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SUBSCRIPTION_BY_ID, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setRecordLimit(response.data.data.recordLimit);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Get Total Saved Matrix Count
  async function getTotalSavedMatrixCount() {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_COUNT_SAVED_MATRIX_URL), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setSavedSMSCount(response.data.data.SMSCount);
        setSavedSMLCount(response.data.data.SMLCount);
        setSavedDSMCount(response.data.data.DSMCount);
        setSavedDMLCount(response.data.data.DMLCount);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Handle Static Matrix selection
  const handleStaticOptionClick = async (option) => {
    setSelectedName(null);
    setStaticMatrix(false);
    setSelectedMatrix("static");
    setSelectedStaticOption(option);
    await getMatrixFromAPI("static", option);
  };

  // Handle Dynamic Matrix selection
  const handleDynamicOptionClick = async (option) => {
    setSelectedName(null);
    setDynamicMatrix(false);
    setSelectedMatrix("dynamic");
    setSelectedDynamicOption(option);
    await getMatrixFromAPI("dynamic", option);
  };

  // Fetch Matrix Data and Get Matrix List Api
  const getMatrixFromAPI = async (type, selectedOption) => {
    let temp = {};
    let fetchedData = [];
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_MATRIX_URL}${type === "static" ? process.env.REACT_APP_GET_STATIC_MATRIX_URL : process.env.REACT_APP_GET_DYNAMIC_MATRIX_URL}`,
        { typeIc: selectedOption, userId: getUserId() },
        { headers: { "x-access-token": getToken() } }
      );

      if (response.status === 200) {
        let data = response.data.data;
        if (Array.isArray(data)) {
          fetchedData = data;
          data.forEach((item) => {
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
  };

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 20 * 100);
  }, [msg])

  useEffect(() => {
    getMatrixFromAPI("static", "short");
    fetchUserSubscription();
    getTotalSavedMatrixCount();

    function handleClickOutside(event) {
      if (MatrixRef.current && !MatrixRef.current.contains(event.target)) {
        setMatrix(false);
      }
      if (StaticMatrixRef.current && !StaticMatrixRef.current.contains(event.target)) {
        setStaticMatrix(false);
      }
      if (DynamicMatrixRef.current && !DynamicMatrixRef.current.contains(event.target)) {
        setDynamicMatrix(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [MatrixRef, StaticMatrixRef, DynamicMatrixRef]);


  return (
    <div className='px-3 lg:pl-10 lg:px-6 h-screen sm:h-auto mb-10'>
      <div className='sm:flex'>
        <div className='relative' ref={StaticMatrixRef}>
          <div className='flex items-center gap-3 md:gap-[18px] px-5 lg:px-[30px] py-[10px] mb-3 sm:mt-0 rounded-md sm:rounded-l-md sm:rounded-r-none bg-userBg w-fit lg:max-w-[270px] shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => setStaticMatrix((prev) => !prev)}>
            <img className='w-5 lg:w-auto' src={StaticMatrixIcon} alt="" />
            <p className='text-sm lg:text-[20px] lg:leading-[30px] font-semibold text-white'>Static Matrix</p>
            <img className='w-3 lg:w-auto' src={DropdownIconWhite} alt="" />
          </div>
          <AnimatePresence>
            {staticMatrix && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.50, ease: "easeInOut" }}
                className='absolute z-10 lg:left-5 max-w-[229px] py-[10px] lg:py-[14px] px-4 lg:px-[30px] border border-borderColor5 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
                <p onClick={() => handleStaticOptionClick("short")} className='text-sm lg:text-base font-medium text-Secondary2 pb-1 cursor-pointer border-b border-borderColor'>Static Short IC Matrix</p>
                <p onClick={() => handleStaticOptionClick("long")} className='text-sm lg:text-base font-medium text-Secondary2 pt-1 cursor-pointer'>Static Long IC Matrix</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className='relative' ref={DynamicMatrixRef}>
          <div className='flex items-center gap-3 md:gap-[18px] px-5 lg:px-[30px] py-[10px] rounded-md sm:rounded-r-md sm:rounded-l-none w-fit lg:max-w-[303px] bg-background6 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => setDynamicMatrix((prev) => !prev)}>
            <img className='w-5 lg:w-auto' src={DynamicMatrixIcon} alt="" />
            <p className='text-sm lg:text-[20px] lg:leading-[30px] font-semibold text-Primary'>Dynamic Matrix</p>
            <img className='w-3 lg:w-auto' src={DropdownIcon} alt="" />
          </div>
          <AnimatePresence>
            {dynamicMatrix && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.50, ease: "easeInOut" }}
                className='absolute z-10 lg:left-5 max-w-[260px] mt-3 py-[10px] lg:py-[14px] px-4 lg:px-[30px] border border-borderColor5 rounded-lg bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
                <p onClick={() => handleDynamicOptionClick("short")} className='text-sm lg:text-base font-medium text-Secondary2 pb-1 cursor-pointer border-b border-borderColor'>Dynamic Short IC Matrix</p>
                <p onClick={() => handleDynamicOptionClick("long")} className='text-sm lg:text-base font-medium text-Secondary2 pt-1 cursor-pointer'>Dynamic Long IC Matrix</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}

      <div className='flex flex-wrap justify-between gap-3 lg:gap-5'>
        <div className='relative mt-3 lg:mt-[30px] max-w-[350px]' ref={MatrixRef}>
          <div className='flex justify-between items-center gap-2 md:gap-3 px-5 py-[9px] rounded-md bg-background6 w-fit max-w-[350px] shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => setMatrix((prev) => !prev)}>
            <span className='flex gap-3'>
              <img className='w-5 lg:w-auto' src={MatrixIcon} alt="" />
              <p className='text-sm lg:text-base font-medium text-Primary'>{names[selectedName] || "Select Matrix"}</p>
            </span>
            <img className='w-3' src={DropdownIcon} alt="" />
          </div>
          <AnimatePresence>
            {matrix && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.50, ease: "easeInOut" }}
                className='absolute z-10 mt-2 py-2 lg:py-[10px] px-3 md:px-4 min-w-[140px] border border-[#F8FCFF] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
                {Array.isArray(savedData) && savedData.filter(item => item.levels && item.levels.length > 0).length > 0 ? (
                  savedData.filter(item => item.levels && item.levels.length > 0).map(item => (
                    <div key={item._id} className='cursor-pointer py-1 lg:py-[7px]' onClick={() => { setSelectedName(item._id); setMatrix(false); }}>
                      <span className='text-sm lg:text-base font-medium text-Primary' title={item.matrixName}>
                        {item.matrixName}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className='text-sm text-Primary text-center py-1'>Not available</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className='text-start sm:text-end'>
          <p className='text-sm lg:text-base font-medium text-Primary'>ST Short Save - {savedSMSCount}/{recordLimit || 0} Table</p>
          <p className='text-sm lg:text-base font-medium text-Primary'>ST Long Save - {savedSMLCount}/{recordLimit || 0} Table</p>
          <p className='text-sm lg:text-base font-medium text-Primary'>DY Short Save - {savedDSMCount}/{recordLimit || 0} Table</p>
          <p className='text-sm lg:text-base font-medium text-Primary'>DY Long Save - {savedDMLCount}/{recordLimit || 0} Table</p>
        </div>
      </div>

      <div className='mt-4 mb-7 lg:mb-10 py-2 lg:py-[13px] px-4 lg:px-[22px] rounded-md bg-background6 shadow-[0px_0px_4px_0px_#28236633]'>
        <p className='flex flex-wrap items-center gap-2 text-xs lg:text-base font-medium text-Secondary2'>
          {selectedMatrix === "static" ? "Static" : "Dynamic"} Matrix
          <img className='-rotate-90 h-[5px] lg:h-auto' src={DropdownIcon} alt="" />
          {selectedMatrix === "static" && (<span> {selectedStaticOption === "short" ? "Static Short IC Matrix" : "Static Long IC Matrix"} </span>)}
          {selectedMatrix === "dynamic" && (<span> {selectedDynamicOption === "short" ? "Dynamic Short IC Matrix" : "Dynamic Long IC Matrix"}</span>)}
          <img className='-rotate-90 h-[5px] lg:h-auto' src={DropdownIcon} alt="" /> {names[selectedName] || "Select Matrix"}
        </p>
      </div>

      {selectedMatrix === "static" ? (
        selectedStaticOption === "short" ? (
          savedData.length > 0 ? (
            names[selectedName] ? (
              (() => {
                const selectedMatrixData = savedData.find(matrix => matrix.matrixName === names[selectedName]);
                return selectedMatrixData ? (
                  <StaticCalculations savedData={selectedMatrixData} />
                ) : (
                  <p className='text-Secondary2 text-lg'>No Record found...</p>
                );
              })()
            ) : (
              savedData.filter(matrix => matrix.levels.length > 0).map((matrix, index) => (
                <StaticCalculations key={matrix._id || index} savedData={matrix} />
              ))
            )
          ) : (
            <p className='text-Secondary2 text-lg'>No Record found...</p>
          )
        ) : (
          savedData.length > 0 ? (
            names[selectedName] ? (
              (() => {
                const selectedMatrixData = savedData.find(matrix => matrix.matrixName === names[selectedName]);
                return selectedMatrixData ? (
                  <StaticLongCalculations savedData={selectedMatrixData} />
                ) : (
                  <p className='text-Secondary2 text-lg'>No Record found...</p>
                );
              })()
            ) : (
              savedData.filter(matrix => matrix.levels.length > 0).map((matrix, index) => (
                <StaticLongCalculations key={matrix._id || index} savedData={matrix} />
              ))
            )
          ) : (
            <p className='text-Secondary2 text-lg'>No Record found...</p>
          )
        )
      ) : (
        selectedDynamicOption === "short" ? (
          savedData.length > 0 ? (
            names[selectedName] ? (
              (() => {
                const selectedMatrixData = savedData.find(matrix => matrix.matrixName === names[selectedName]);
                return selectedMatrixData ? (
                  <DynamicCalculations savedData={selectedMatrixData} nextGamePlan={false} />
                ) : (
                  <p className='text-Secondary2 text-lg'>No Record found...</p>
                );
              })()
            ) : (
              savedData.filter(matrix => matrix.levels.length > 0).map((matrix, index) => (
                <DynamicCalculations key={matrix._id || index} savedData={matrix} nextGamePlan={false} />
              ))
            )
          ) : (
            <p className='text-Secondary2 text-lg'>No Record found...</p>
          )
        ) : (
          savedData.length > 0 ? (
            names[selectedName] ? (
              (() => {
                const selectedMatrixData = savedData.find(matrix => matrix.matrixName === names[selectedName]);
                return selectedMatrixData ? (
                  <DynamicLongCalculations savedData={selectedMatrixData} nextGamePlan={false} />
                ) : (
                  <p className='text-Secondary2 text-lg'>No Record found...</p>
                );
              })()
            ) : (
              savedData.filter(matrix => matrix.levels.length > 0).map((matrix, index) => (
                <DynamicLongCalculations key={matrix._id || index} savedData={matrix} nextGamePlan={false} />
              ))
            )
          ) : (
            <p className='text-Secondary2 text-lg'>No Record found...</p>
          )
        )
      )}
    </div>
  );
}

export default SavedMatrix;