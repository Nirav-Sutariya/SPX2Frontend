import React, { useContext, useMemo, useRef, useState, useEffect } from 'react';
import PlusIcon from '../assets/svg/PlusIcon.svg';
import FilterIcon from '../assets/svg/FilterIcon.svg';
import MinimumIcon from '../assets/svg/MinmumIcon.svg';
import DeletePopupIcon from '../assets/Images/UserData/DeletePopupIcon.svg';
import axios from 'axios';
import { AppContext } from '../components/AppContext';
import { getToken, getUserId } from '../page/login/loginAPI';

const ManageLevels = ({ }) => {

  const updateRef = useRef();
  const longMatrixRef = useRef();
  const shortMatrixRef = useRef();
  const filterModalRef = useRef(null);
  let appContext = useContext(AppContext);
  const [level1, setLevel1] = useState("");
  const [level2, setLevel2] = useState("");
  const [level3, setLevel3] = useState("");
  const [level4, setLevel4] = useState("");
  const [level5, setLevel5] = useState("");
  const [addNewRow, setAddNewRow] = useState(false);
  const [showLevel1, setShowLevel1] = useState(true);
  const [showLevel2, setShowLevel2] = useState(true);
  const [showLevel3, setShowLevel3] = useState(true);
  const [showLevel4, setShowLevel4] = useState(true);
  const [showLevel5, setShowLevel5] = useState(true);
  const [showAction, setShowAction] = useState(true);
  const [buyingPower, setBuyingPower] = useState("");
  const [levelValues, setLevelValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState(5);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [editingRowId, setEditingRowId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [matrixTypeValue, setMatrixTypeValue] = useState("StaticShort");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [longMatrixLength, setLongMatrixLength] = useState(appContext.longMatrixLength);
  const [shortMatrixLength, setShortMatrixLength] = useState(appContext.shortMatrixLength);
  const [editedValues, setEditedValues] = useState({
    buyingPower: "",
    level1: "",
    level2: "",
    level3: "",
    level4: "",
    level5: "",
  });

  // Get Level Length 
  async function fetchLevelLength() {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_LEVEL_LENGTH), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        let data = response.data.data
        appContext.setAppContext({ ...appContext, shortMatrixLength: data.shortMatrix, longMatrixLength: data.longMatrix })
      }
    } catch (error) {
      if (error.message.includes("Network Error")) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Update Level Length
  async function updateLevelLength(e) {
    e.preventDefault()
    if (shortMatrixLength && (shortMatrixLength > 15 || shortMatrixLength < 6)) {
      setMsg({ type: "error", msg: "Short Matrix should be between 6 to 15" })
      return
    }
    if (longMatrixLength && (longMatrixLength > 15 || longMatrixLength < 6)) {
      setMsg({ type: "error", msg: "Long Matrix should be between 6 to 15" })
      return
    }
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_UPDATE_LEVEL_LENGTH), { userId: getUserId(), shortMatrix: shortMatrixLength, longMatrix: longMatrixLength }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setMsg({ type: "info", msg: 'Matrix length are updated...' });
        fetchLevelLength()
      }
    } catch (error) {
      if (error.message.includes("Network Error")) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      } else if (error.response) {
        setMsg({ type: "error", msg: error.response.data.message || "Failed to update matrix level." });
      } else {
        setMsg({ type: "error", msg: "An unexpected error occurred." });
      }
    }
  }

  // Find Default Level Value
  async function fetchDefaultLevelValues() {
    try {
      const response = await axios.post((process.env.REACT_APP_LEVELS_URL) + (process.env.REACT_APP_GET_LEVEL_VALUE_URL), { userId: getUserId(), spread: selectedValue, matrixType: matrixTypeValue }, {
        headers: {
          'x-access-token': getToken(),
        }
      });

      const resData = response.data;

      if (resData.data && Array.isArray(resData.data)) {
        if (resData.data.length === 0) {
          console.log("No level data received.");
          setLevelValues([]);
        } else {
          const formattedData = resData.data.map(({ _id, matrixType, spread, ...rest }) => ({
            ...rest,
            levelId: _id,
          }));
          console.log("Level values received:", formattedData);
          setLevelValues(formattedData);
        }
      } else {
        console.warn("Unexpected response format:", resData);
        setLevelValues([]);
      }
    } catch (error) {
      console.error("Error fetching level values:", error);
      setLevelValues([]);
    }
  }

  // Create Level Row
  async function handleSaveNewRow() {
    try {
      let response = await axios.post((process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_CREATE_LEVEL_VALUE), { userId: getUserId(), spread: selectedValue, matrixType: matrixTypeValue, buyingPower, level1, level2, level3, level4, level5 }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setMsg({ type: "success", msg: "Row added successfully!" });
        setAddNewRow(false); // Hide the new row input fields after saving
        handleCancelNewRow();
        fetchDefaultLevelValues();
      }
    } catch (error) {
      setMsg({ type: "error", msg: "An error occurred while adding the row." });
    }
  }

  // Update Laves Value
  async function updateLevelValues(levelId, updatedData) {
    try {
      let response = await axios.post(process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_UPDATE_LEVEL_VALUE, { userId: getUserId(), ...updatedData }, {
        headers: {
          'x-access-token': getToken()
        }
      });

      if (response.status === 201) {
        setMsg({ type: "info", msg: "Default level values updated successfully" });
        setLevelValues((prev) =>
          prev.map((item) => (item.levelId === levelId ? { ...item, ...updatedData } : item))
        );
        setEditingRowId(null);
      }
    } catch (error) {
      setMsg({ type: "error", msg: error.response?.data?.message || "An error occurred while updating the row." });
    }
  }

  // Delete Laves Row
  const deleteLevelValues = async (levelId) => {
    try {
      const response = await axios.post(process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_DELETE_LEVEL_VALUE, { userId: getUserId(), levelId }, {
        headers: {
          'x-access-token': getToken()
        },
      });
      if (response.status === 200) {
        // Update local state after successful deletion:
        setLevelValues((prev) => prev.filter((item) => item.levelId !== levelId));
        setMsg({ type: "info", msg: "Row deleted successfully." });
      }
    } catch (error) {
      setMsg({ type: "error", msg: "Failed to delete row." });
    }
  };

  // Handle Spread Dropdwon
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setAddNewRow(false);
  };

  // Handle Matrix Type Dropdwon
  const handleChangeMatrixType = (event) => {
    setMatrixTypeValue(event.target.value);
    setSelectedValue(5);
    setLevelValues([]);
    setAddNewRow(false);
  };

  // Spread and MatrixType UseMemo
  useMemo(() => {
    if (!appContext.shortMatrixLength || !appContext.longMatrixLength) {
      fetchLevelLength();
    }

    fetchDefaultLevelValues();
  }, [selectedValue, matrixTypeValue])

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 20 * 100);
  }, [msg])

  const handleIncrement = () => {
    setShortMatrixLength((prev) => {
      const newValue = prev === "" ? 1 : parseInt(prev) + 1;
      return newValue.toString();
    });
  };

  const handleDecrement = () => {
    setShortMatrixLength((prev) => {
      const newValue = prev === "" ? 0 : Math.max(0, parseInt(prev) - 1); // Prevent negative values
      return newValue.toString();
    });
  };

  const incrementValue = () => {
    const currentValue = parseInt(longMatrixLength || "0", 10);
    setLongMatrixLength(currentValue + 1);
  };

  const decrementValue = () => {
    const currentValue = parseInt(longMatrixLength || "0", 10);
    if (currentValue > 0) {
      setLongMatrixLength(currentValue - 1);
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  const handleToggle = (toggleSetter) => {
    toggleSetter((prevState) => !prevState);
  };

  const ResetTable = () => {
    setShowLevel1(true)
    setShowLevel2(true)
    setShowLevel3(true)
    setShowLevel4(true)
    setShowLevel5(true)
    setShowAction(true)
    setIsFilterModalVisible(false)
  }

  const handleCancelNewRow = () => {
    setAddNewRow(false);
    setBuyingPower("");
    setLevel1("");
    setLevel2("");
    setLevel3("");
    setLevel4("");
    setLevel5("");
  };

  const handleClickOutside = (event) => {
    if (filterModalRef.current && !filterModalRef.current.contains(event.target)) {
      setIsFilterModalVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', isDeleteConfirmVisible);
    return () => document.body.classList.remove('no-scroll');
  }, [isDeleteConfirmVisible]);


  return (
    <div className='px-5 lg:pl-10 lg:px-6 pb-[30px] lg:pb-[50px]'>
      <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'>Manage Levels</h2>
      {(msg.msg !== "") && <p className={`text-sm mt-2 ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}</p>}
      {/* Manage Levels Short Matrix and Long Matrix */}

      <div className='mt-5 lg:mt-10 px-5 md:px-[30px] py-5 md:py-[34px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] max-w-[459px] lg:max-w-[509px] w-full'>
        <label className='block text-sm lg:text-base text-Primary lg:font-medium'>Short Matrix <span className='text-xs text-[#B7D1E0] font-medium'>(Min 6 to 15)</span></label>
        <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
          <input type='text' maxLength={2} title='Max Length 2' placeholder='6' ref={shortMatrixRef} onKeyDown={(e) => handleKeyDown(e, longMatrixRef)} className='bg-transparent w-full focus:outline-none' value={shortMatrixLength} onChange={(e) => {
            let value = e.target.value
            let digitRegex = /^\d+$/
            if (value && (!digitRegex.test(value))) {
              setMsg({ type: "error", msg: "Enter valid Number" });
              return
            }
            setShortMatrixLength(value)
          }}
          />
          <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
            <button onClick={handleDecrement}>
              <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
            </button>
            <div className='border-r border-[#B7D1E0] h-[26px]'></div>
            <button className='w-[22px]' onClick={handleIncrement}>
              <img className='w-4 lg:w-auto' src={PlusIcon} alt="" />
            </button>
          </div>
        </div>
        <label className='block text-sm lg:text-base text-Primary lg:font-medium mt-5'>Long Matrix <span className='text-xs text-[#B7D1E0] font-medium'>(Min 6 to 15)</span></label>
        <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
          <input type='text' maxLength={2} title='Max Length 2' placeholder='12' ref={longMatrixRef} onKeyDown={(e) => handleKeyDown(e, updateRef)} className='bg-transparent w-full focus:outline-none' value={longMatrixLength} onChange={(e) => {
            let value = e.target.value
            let digitRegex = /^\d+$/
            if (value && (!digitRegex.test(value))) {
              setMsg({ type: "error", msg: "Enter valid Number" });
              return
            }
            setLongMatrixLength(value)
          }}
          />
          <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
            <button onClick={decrementValue}>
              <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
            </button>
            <div className='border-r border-[#B7D1E0] h-[26px]'></div>
            <button className='w-[22px]' onClick={incrementValue}>
              <img className='w-4 lg:w-auto' src={PlusIcon} alt="" />
            </button>
          </div>
        </div>
        <div className="flex justify-end mt-5 md:mt-[30px]">
          <button type="button" onClick={updateLevelLength} ref={updateRef} className="text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 lg:py-[13px] lg:px-[30px]">
            Update
          </button>
        </div>
      </div>

      <div className='flex flex-wrap gap-2 md:gap-5 items-center mt-6 lg:mt-[50px]'>
        <h3 className='text-lg lg:text-[28px] lg:leading-[42px] font-semibold text-Primary'>Manage Default Levels With Account Size:</h3>
      </div>
      <p className='text-sm lg:text-base text-Primary lg:font-medium mt-1'>(7 Day Trial - First Field | Plus Plan - Top 10 | Premium Plan - All Fields)</p>
      <div className='flex justify-between items-center'>
        <p className='text-sm lg:text-base text-Primary lg:font-medium mt-1'>(-1 for No Trade)</p>
      </div>

      {/* Choose an Matrix Type and Spread */}
      <div className='flex justify-between items-end gap-5 mt-5'>
        <div className='flex flex-wrap gap-3 sm:gap-5 w-full'>
          <div className="relative w-full max-w-[161px] sm:max-w-[170px] lg:max-w-[200px] sm:mt-2">
            <label htmlFor="dropdown" className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Choose an Matrix Type </label>
            <div className="absolute inset-y-0 right-2 top-[41%] flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-Primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <select id="dropdown" value={matrixTypeValue} onChange={handleChangeMatrixType} className="text-xs lg:text-sm text-Primary mt-1 px-2 md:px-3 lg:px-5 py-[7px] sm:py-2 md:py-[10px] lg:py-3 border border-borderColor rounded-md bg-textBoxBg w-full focus:outline-none focus:border-borderColor7 appearance-none">
              <option value="" disabled>Select an option</option>
              <option value="StaticShort">Static Short</option>
              <option value="StaticLong">Static Long</option>
              <option value="DynamicShort">Dynamic Short</option>
              <option value="DynamicLong">Dynamic Long</option>
            </select>
          </div>

          <div className="relative w-full max-w-[161px] sm:max-w-[170px] lg:max-w-[200px] sm:mt-2">
            <label htmlFor="dropdown" className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Choose an Spread </label>
            <div className="absolute inset-y-0 right-2 top-[41%] flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-Primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <select id="dropdown" value={selectedValue} onChange={handleChange} className="text-xs lg:text-sm text-Primary mt-1 px-2 md:px-3 lg:px-5 py-[7px] sm:py-2 md:py-[10px] lg:py-3 border border-borderColor rounded-md bg-textBoxBg w-full focus:outline-none focus:border-borderColor7 appearance-none">
              <option value="" disabled>Select an option</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        <p className='text-sm lg:text-base font-medium text-white flex items-center gap-[10px] bg-background2 py-2 px-5 rounded-md cursor-pointer w-full max-w-[95px] lg:max-w-[110px]' onClick={() => setIsFilterModalVisible(!isFilterModalVisible)}>
          <img className='w-4 lg:w-auto' src={FilterIcon} alt="Filter icon" /> Filter
        </p>
      </div>

      {/* Filter For Table */}
      <div className='flex justify-end'>
        {isFilterModalVisible && (
          <div ref={filterModalRef} className="absolute z-10 border border-borderColor5 rounded-lg bg-background6 max-w-[224px] w-full p-3 mt-2 lg:mt-4 shadow-[0px_0px_6px_0px_#28236633]">
            <p className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor px-12 pb-2 cursor-pointer" onClick={ResetTable}>Reset Table</p>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={showLevel1} onChange={() => handleToggle(setShowLevel1)} /> Level 1
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={showLevel2} onChange={() => handleToggle(setShowLevel2)} /> Level 2
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={showLevel3} onChange={() => handleToggle(setShowLevel3)} /> Level 3
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={showLevel4} onChange={() => handleToggle(setShowLevel4)} /> Level 4
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={showLevel5} onChange={() => handleToggle(setShowLevel5)} /> Level 5
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={showAction} onChange={() => handleToggle(setShowAction)} /> Action
            </label>
          </div>
        )}
      </div>

      {/* Manage Default Levels With Account Size Table */}
      <div className='mt-3 lg:mt-5 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
        <div className='overflow-x-auto rounded-md'>
          <table className="text-center min-w-full ">
            <thead>
              <tr>
                <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-3 min-w-[150px] lg:min-w-[120px] 2xl:min-w-[150px] border-r border-borderColor rounded-ss-md bg-background2 ">Buying Power</th>
                {showLevel1 && <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-3 min-w-[120px] 2xl:min-w-[140px] border-r border-borderColor bg-background2">Level 1</th>}
                {showLevel2 && <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-3 min-w-[120px] 2xl:min-w-[140px] border-r border-borderColor bg-background2">Level 2</th>}
                {showLevel3 && <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-3 min-w-[120px] 2xl:min-w-[140px] border-r border-borderColor bg-background2">Level 3</th>}
                {showLevel4 && <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-3 min-w-[120px] 2xl:min-w-[140px] border-r border-borderColor bg-background2">Level 4</th>}
                {showLevel5 && <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-3 min-w-[120px] 2xl:min-w-[140px] border-r border-borderColor bg-background2">Level 5</th>}
                {showAction && <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-3 min-w-[160px] lg:min-w-[120px] 2xl:min-w-[160px] rounded-tr-md bg-background2">Action</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm lg:text-base text-Secondary font-semibold p-2 lg:p-3 border-b border-borderColor"></td>
                {showLevel1 && <td className="text-sm lg:text-base text-Secondary font-semibold p-2 lg:p-3 border-b border-x border-borderColor">Quantity</td>}
                {showLevel2 && <td className="text-sm lg:text-base text-Secondary font-semibold p-2 lg:p-3 border-b border-x border-borderColor">Quantity</td>}
                {showLevel3 && <td className="text-sm lg:text-base text-Secondary font-semibold p-2 lg:p-3 border-b border-x border-borderColor">Quantity</td>}
                {showLevel4 && <td className="text-sm lg:text-base text-Secondary font-semibold p-2 lg:p-3 border-b border-x border-borderColor">Quantity</td>}
                {showLevel5 && <td className="text-sm lg:text-base text-Secondary font-semibold p-2 lg:p-3 border-b border-x border-borderColor">Quantity</td>}
                {showAction && <td className="text-sm lg:text-base text-Secondary font-semibold p-2 lg:p-3 border-b border-borderColor"></td>}
              </tr>

              {levelValues.length > 0 ? (
                levelValues.map((item) => {
                  const isEditing = editingRowId === item.levelId;
                  return (
                    <tr key={item.levelId} className="border-b border-borderColor">
                      <td className="text-sm text-Secondary p-3 border-r border-borderColor">
                        {isEditing ? (
                          <input type="number" value={editedValues.buyingPower}
                            onChange={(e) =>
                              setEditedValues((prev) => ({ ...prev, buyingPower: e.target.value }))
                            }
                            className="max-w-[170px] w-full p-1 border rounded"
                          />
                        ) : (
                          item.buyingPower
                        )}
                      </td>

                      {showLevel1 && (
                        <td className="text-sm text-Secondary p-3 border-x border-borderColor">
                          {isEditing ? (
                            <input type="number" value={editedValues.level1}
                              onChange={(e) =>
                                setEditedValues((prev) => ({ ...prev, level1: e.target.value }))
                              }
                              className="max-w-[120px] w-full p-1 border rounded"
                            />
                          ) : (
                            item.level1
                          )}
                        </td>
                      )}

                      {showLevel2 && (
                        <td className="text-sm text-Secondary p-3 border-x border-borderColor">
                          {isEditing ? (
                            <input type="number" value={editedValues.level2}
                              onChange={(e) =>
                                setEditedValues((prev) => ({ ...prev, level2: e.target.value }))
                              }
                              className="max-w-[120px] w-full p-1 border rounded"
                            />
                          ) : (
                            item.level2
                          )}
                        </td>
                      )}

                      {showLevel3 && (
                        <td className="text-sm text-Secondary p-3 border-x border-borderColor">
                          {isEditing ? (
                            <input type="number" value={editedValues.level3}
                              onChange={(e) =>
                                setEditedValues((prev) => ({ ...prev, level3: e.target.value }))
                              }
                              className="max-w-[120px] w-full p-1 border rounded"
                            />
                          ) : (
                            item.level3
                          )}
                        </td>
                      )}

                      {showLevel4 && (
                        <td className="text-sm text-Secondary p-3 border-x border-borderColor">
                          {isEditing ? (
                            <input type="number" value={editedValues.level4}
                              onChange={(e) =>
                                setEditedValues((prev) => ({ ...prev, level4: e.target.value }))
                              }
                              className="max-w-[120px] w-full p-1 border rounded"
                            />
                          ) : (
                            item.level4
                          )}
                        </td>
                      )}

                      {showLevel5 && (
                        <td className="text-sm text-Secondary p-3 border-x border-borderColor">
                          {isEditing ? (
                            <input type="number" value={editedValues.level5}
                              onChange={(e) =>
                                setEditedValues((prev) => ({ ...prev, level5: e.target.value }))
                              }
                              className="max-w-[120px] w-full p-1 border rounded"
                            />
                          ) : (
                            item.level5
                          )}
                        </td>
                      )}

                      {showAction && (
                        <td className="text-sm text-Secondary p-3">
                          {isEditing ? (
                            <>
                              <button className="text-sm px-2" onClick={() => updateLevelValues(item.levelId, editedValues)}>
                                Save
                              </button>
                              <button className="border-l text-sm px-2" onClick={() => setEditingRowId(null)}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="text-sm px-2" onClick={() => { setEditingRowId(item.levelId); setEditedValues({ ...item }); }} >
                                Edit
                              </button>
                              <button className="border-l border-borderColor text-sm px-2" onClick={() => { setDeletingItemId(item.levelId); setDeleteConfirmVisible(true); }}>
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-base lg:text-lg text-Primary px-3 py-7 border-b border-x border-borderColor">  {!matrixTypeValue || !selectedValue ? "Choose a Matrix Type and Spread" : "No Data Found Please Add"} </td>
                </tr>
              )}

              {addNewRow && <tr>
                <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-borderColor" contentEditable onBlur={(e) => setBuyingPower(e.target.textContent)}>{buyingPower}</td>
                <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor" contentEditable onBlur={(e) => setLevel1(e.target.textContent)}>{level1}</td>
                <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor" contentEditable onBlur={(e) => setLevel2(e.target.textContent)}>{level2}</td>
                <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor" contentEditable onBlur={(e) => setLevel3(e.target.textContent)}>{level3}</td>
                <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor" contentEditable onBlur={(e) => setLevel4(e.target.textContent)}>{level4}</td>
                <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor" contentEditable onBlur={(e) => setLevel5(e.target.textContent)}>{level5}</td>
                <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-borderColor">
                  <button className="text-sm px-2" onClick={handleSaveNewRow}>Save</button>
                  <button className="border-l border-borderColor text-sm px-2" onClick={handleCancelNewRow}>Cancel</button>
                </td>
              </tr>}
            </tbody>
          </table>
        </div>
        <span className='flex justify-end w-full'>
          <button className="text-sm lg:text-base text-Primary font-medium flex gap-3 p-3 lg:p-5" onClick={() => { setAddNewRow(true) }}>
            <img className='w-5 lg:w-auto' src={PlusIcon} alt="Add Icon" /> Add
          </button>
        </span>
        {(msg.msg !== "") && <p className={`text-sm text-end ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}</p>}
      </div>

      {/* Delete Confirm Popup */}
      {isDeleteConfirmVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="p-4 lg:p-[30px] border border-borderColor5 rounded-[22px] bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-[360px] lg:w-[486px]">
            <div className="flex justify-center">
              <div className="mx-auto p-4 lg:px-6 lg: py-5 border border-borderColor rounded-md bg-background3">
                <img className="w-6 lg:w-9" src={DeletePopupIcon} alt="Subscription Update Icon" />
              </div>
            </div>
            <h3 className="text-xl lg:text-[28px] lg:leading-[42px] text-Primary font-semibold mx-auto mt-5 text-center">Manage Levels</h3>
            <p className='text-base text-Secondary2 text-center mt-1 mx-auto max-w-[270px] '>Are you sure you want to Delete Manage Level?</p>

            <div className="flex justify-between gap-5 mt-5 lg:mt-9">
              <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 border border-borderColor3 rounded-md w-full"
                onClick={() => setDeleteConfirmVisible(false)}>
                Cancel
              </button>
              <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full" onClick={async () => { await deleteLevelValues(deletingItemId); setDeleteConfirmVisible(false); }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageLevels;