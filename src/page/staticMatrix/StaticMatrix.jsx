import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import Button from '../../components/Button';
import BackIcon from '../../assets/svg/BackIcon.svg';
import PluseIcon from '../../assets/svg/PlusIcon.svg';
import ResetIcon from '../../assets/svg/ResetIcon.svg';
import FilterIcon from '../../assets/svg/FilterIcon.svg';
import MatrixIcon from '../../assets/svg/MatrixIcon.svg';
import MinimumIcon from '../../assets/svg/MinmumIcon.svg';
import DropdownIcon from '../../assets/svg/DropdownIcon.svg';
import MatrixEditIcon from '../../assets/svg/MatrixEditIcon.svg';
import SavedMatrixIcon from '../../assets/svg/SaveMatrixIcon.svg';
import DeleteIcon from '../../assets/Images/StaticMatrix/DeleteIcon.svg';
import DeleteIcon2 from '../../assets/Images/StaticMatrix/DeleteIcon2.svg';
import CapitalAllocationRangSlider from '../../components/CapitalAllocationRangSlider';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AppContext } from '../../components/AppContext';
import { getToken, getUserId } from '../login/loginAPI';
import { defaultTradePrice, defaultCommission, defaultAllocation, DefaultInDeCrement, ConfirmationModal, FilterModal } from '../../components/utils';


const StaticMatrix = () => {

  const MINIMUM_VALUE = 0; // Define the minimum value
  const MAXIMUM_VALUE = 99.00; // Define the maximum value
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  const filterModalRef = useRef(null);
  const [loss, setLoss] = useState(0);
  const [names, setNames] = useState({});
  let appContext = useContext(AppContext);
  const allocationDropdownRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState(5);
  const [allocation, setAllocation] = useState(defaultAllocation);
  const [tradePrice, setTradePrice] = useState(defaultTradePrice);
  const [commission, setCommission] = useState(defaultCommission);
  const [originalSize, setOriginalSize] = useState(null);
  const firstKey = Object.keys(appContext.names)[0] || null;
  const [selectedName, setSelectedName] = useState(firstKey);
  const [currentAllocation, setCurrentAllocation] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  // Table column value
  const [levels, setLevels] = useState([]);
  const [BPTable, setBPTable] = useState([]);
  const [LossTable, setLossTable] = useState([]);
  const [LevelTable, setLevelTable] = useState([]);
  const [CreditTable, setCreditTable] = useState([]);
  const [ProfitTable, setProfitTable] = useState([]);
  const [GainPreTable, setGainPreTable] = useState([]);
  const [LossPreTable, setLossPreTable] = useState([]);
  const [AfterWinTable, setAfterWinTable] = useState([]);
  const [ContractsTable, setContractsTable] = useState([]);
  const [AfterLossTable, setAfterLossTable] = useState([]);
  const [CommissionTable, setCommissionTable] = useState([]);
  const [CumulativeLossTable, setCumulativeLossTable] = useState([]);
  const [SeriesGainLossTable, setSeriesGainLossTable] = useState([]);
  const [staticLevelDefaultValue, setStaticLevelDefaultValue] = useState([]);

  const [showBP, setShowBP] = useState(true);
  const [newName, setNewName] = useState('');
  const [editKey, setEditKey] = useState(null);
  const [editName, setEditName] = useState('');
  const [modalData, setModalData] = useState({});
  const [showLoss, setShowLoss] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfit, setShowProfit] = useState(true);
  const [showCredit, setShowCredit] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAllRows, setShowAllRows] = useState(false);
  const [showAfterWin, setShowAfterWin] = useState(true);
  const visibleRows = showAllRows ? LevelTable.length : 6;
  const [showAllRows2, setShowAllRows2] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showContracts, setShowContracts] = useState(true);
  const [showAfterLoss, setShowAfterLoss] = useState(true);
  const [isMatrixSaved, setIsMatrixSaved] = useState(false);
  const [showCommission, setShowCommission] = useState(true);
  const [stackOrShiftFlag, setStackOrShiftFlag] = useState(true);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showCumulativeLoss, setShowCumulativeLoss] = useState(true);
  const [showSeriesGainLoss, setShowSeriesGainLoss] = useState(true);
  const [showGainPercentage, setShowGainPercentage] = useState(true);
  const [showLossPercentage, setShowLossPercentage] = useState(true);
  const [staticKey, setStaticKey] = useState(appContext.staticShortKey);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [allocationHintsVisibility, setAllocationHintsVisibility] = useState(false);
  const [msgM1, setMsgM1] = useState({ type: "", msg: "", });
  const [msgM2, setMsgM2] = useState({ type: "", msg: "", });
  const [msgM3, setMsgM3] = useState({ type: "", msg: "", });
  const [msgM4, setMsgM4] = useState({ type: "", msg: "", });

  // Call API only if firstKey exists and API hasn't been called yet
  if (firstKey && !selectedName) {
    setSelectedName(firstKey);
    getSPXMatrixAPI(firstKey);
  }

  // Get Admin This Page Access For Admin Api 
  async function getStaticKey() {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_STATIC_SHORT_KRY), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setStaticKey(response.data.data);
        appContext.setAppContext((curr) => ({
          ...curr,
          staticShortKey: response.data.data, // Store static key in context
        }));
      }
    } catch (error) { }
  }

  // Matrix List Section Api Call Section  
  // Get Matrix List  Api
  async function getMatrixFromAPI() {
    let temp = {}

    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_STATIC_MATRIX_URL), { typeIc: "short", userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        let data = response.data.data; // Extract actual data array
        if (Array.isArray(data)) {
          data.forEach(item => {
            temp[item._id] = item.matrixName; // Store ID and Name correctly
          });
        }

        appContext.setAppContext(curr => ({
          ...curr,
          names: temp,
        }));
        setNames(temp);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({
          type: "error",
          msg: 'Could not connect to the server. Please check your connection.'
        });
      }
    }
  }

  // Crate Matrix Name Api
  async function addMatrixAPI(name) {
    try {
      let formData = { matrixName: name, userId: getUserId(), typeIc: "short" }
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_CREATE_STATIC_MATRIX_URL), formData, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201)
        await getMatrixFromAPI()
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({
          type: "error",
          msg: 'Could not connect to the server. Please check your connection.'
        });
      }
    }
  }

  // Update Matrix Name Api
  async function updateMatrixAPI(editName, editIndex) {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_UPDATE_STATIC_MATRIX_URL), { userId: getUserId(), staticMatrixId: editIndex, matrixName: editName }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setMsgM1({ type: "info", msg: 'Matrix name was updated...' });
        setSelectedName(editIndex)
      }
      return response
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({
          type: "error",
          msg: 'Could not connect to the server. Please check your connection.'
        });
      }
    }
  }

  // Delete Matrix Name Api
  const handleDeleteClick = async (key) => {
    setModalData({
      icon: DeleteIcon2,
      title: "Delete Confirmation",
      message: "Are you sure you want to delete this Matrix?",
      onConfirm: async () => {
        try {
          let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_DELETE_STATIC_MATRIX_URL), { userId: getUserId(), staticMatrixId: key }, {
            headers: {
              'x-access-token': getToken()
            }
          })

          // Handle successful deletion response
          if (response.status === 200) {
            setMsgM1({ type: "info", msg: 'Matrix was deleted...' });
            const updatedNames = { ...names };
            delete updatedNames[key];
            setNames(updatedNames);
            setSelectedName(Object.keys(updatedNames)[0])
            setEditIndex(null);
            setEditName('');
            setDropdownVisible(false);
            setShowModal(false);
          }
        } catch (error) {
          if (error.message.includes('Network Error')) {
            setMsgM1({
              type: "error",
              msg: 'Could not connect to the server. Please check your connection.'
            });
          }
        }
      },
    });
    setShowModal(true); // Show the modal for confirmation
  };

  // Edit Name Function
  const handleEditClick = (key) => {
    setEditIndex(key);
    setEditName(names[key]);
    setEditKey(key); // Store the matrix ID
  };

  // New Name Add Function
  const handleAddClick = async () => {
    if (newName) {
      try {
        let response = await addMatrixAPI(newName)
        setNewName('');
      } catch (error) {
        if (error.message.includes('Network Error')) {
          setMsgM1({
            type: "error",
            msg: 'Could not connect to the server. Please check your connection.'
          });
        }
      }
    }
  };

  // Dropdown Edit Name Function
  const handleEditNameChange = (e) => {
    if (e.target.value.length > 25) {
      setMsgM1({
        type: "error",
        msg: "length should be less than 25"
      })
      return
    }
    setEditName(e.target.value);
  };

  // Update Name Function
  const handleUpdateName = async () => {
    if (editName && editIndex !== null) {
      await updateMatrixAPI(editName, editIndex)
      await getMatrixFromAPI()
      setEditIndex(null);
      setEditName('');
    }
  };

  // Get Original Account Size Api
  async function fetchAllocationLevelValuesFromAPI() {
    try {
      let response = await axios.post(process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_LEVEL_VALUE_URL, { userId: getUserId(), spread: selectedValue, matrixType: "StaticShort" }, {
        headers: {
          'x-access-token': getToken(),
        },
      });

      if (response.status === 200 && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map(({ buyingPower, _id }) => ({ buyingPower, _id }));
        setStaticLevelDefaultValue(formattedData);

        // Store values in app context
        appContext.setAppContext((prev) => ({
          ...prev,
          buyingPowerStatic: formattedData.map((item) => item.buyingPower),
        }));

        setOriginalSize(response.data.data[0].buyingPower);
        await getSingleLevelAPI(response.data.data[0]._id);
      } else {
        setStaticLevelDefaultValue([]);
      }
    } catch (error) {
      setStaticLevelDefaultValue([]);
    }
  }

  // Get Original Account Size Api
  async function fetchAllocationLevelValuesFromAPI2() {
    try {
      let response = await axios.post(process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_LEVEL_VALUE_URL, { userId: getUserId(), spread: selectedValue, matrixType: "StaticShort" }, {
        headers: {
          'x-access-token': getToken(),
        },
      });

      if (response.status === 200 && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map(({ buyingPower, _id }) => ({ buyingPower, _id }));
        setStaticLevelDefaultValue(formattedData);

        // Store values in app context
        appContext.setAppContext((prev) => ({
          ...prev,
          buyingPowerStatic: formattedData.map((item) => item.buyingPower),
        }));
      }
    } catch (error) { }
  }

  // Get Single level
  async function getSingleLevelAPI(levelId) {
    try {
      const response = await axios.post((process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_SINGL_LEVEL_VALUE_URL), { userId: getUserId(), levelId }, {
        headers: {
          'x-access-token': getToken()
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        const levelData = response.data.data;

        // Extract only level fields (level1, level2, etc.)
        const levelsOnly = Object.keys(levelData)
          .filter((key) => key.startsWith('level'))
          .reduce((obj, key) => {
            obj[key] = { value: levelData[key] || 0, active: levelData[key] > 0 };
            return obj;
          }, {});

        setLevels(levelsOnly);
      }
      return null;
    } catch (error) {
      console.error("API Request Failed:", error);
    }
  }

  // Get Single Static Matrix
  async function getSPXMatrixAPI(key) {
    try {
      const response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_SINGAL_MATRIX_LIST_URL), { userId: getUserId(), staticMatrixId: key }, {
        headers: {
          'x-access-token': getToken()
        },
      });
      if (response.status === 200) {
        // Apply saved matrix data if it exists
        setSelectedValue(response.data.data.spread ?? 5);
        setAllocation(response.data.data.allocation ?? defaultAllocation);
        setTradePrice(response.data.data.tradePrice ?? defaultTradePrice);
        setCommission(response.data.data.commission ?? defaultCommission);
        setOriginalSize(response.data.data.originalSize ?? 5000);

        // Convert levels array to object format (level1, level2, etc.)
        const savedLevelsObject = response.data.data.levels.reduce((obj, level) => {
          obj[level.level] = { value: level.value || 0, active: level.active };
          return obj;
        }, {});

        if (Object.keys(savedLevelsObject).length > 0) {
          setLevels(savedLevelsObject);
          setIsMatrixSaved(true);
          setShowContracts(response.data.data.tableVisibility.showContracts ?? true);
          setShowCredit(response.data.data.tableVisibility.showCredit ?? true);
          setShowCommission(response.data.data.tableVisibility.showCommission ?? true);
          setShowBP(response.data.data.tableVisibility.showBP ?? true);
          setShowProfit(response.data.data.tableVisibility.showProfit ?? true);
          setShowLoss(response.data.data.tableVisibility.showLoss ?? true);
          setShowCumulativeLoss(response.data.data.tableVisibility.showCumulativeLoss ?? true);
          setShowSeriesGainLoss(response.data.data.tableVisibility.showSeriesGainLoss ?? true);
          setShowAfterWin(response.data.data.tableVisibility.showAfterWin ?? true);
          setShowGainPercentage(response.data.data.tableVisibility.showGainPercentage ?? true);
          setShowAfterLoss(response.data.data.tableVisibility.showAfterLoss ?? true);
          setShowLossPercentage(response.data.data.tableVisibility.showLossPercentage ?? true);
        } else {
          fetchAllocationLevelValuesFromAPI();
        }
      }
      else {
        setIsMatrixSaved(false);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({
          type: "error",
          msg: 'Could not connect to the server. Please check your connection.'
        });
      }
      return false
    }
  }

  // Matrix Save Data Api
  const handleSaveMatrix = async () => {
    if (!selectedName) {
      setMsgM3({
        type: "error",
        msg: "Please select one of matrix from dropdown"
      });
      return;
    }
    const arrayDataWithKeys = Object.entries(levels).map(([level, value]) => ({
      level,
      ...value
    }));

    const LevelData = {
      staticMatrixId: selectedName,
      allocation: Number(allocation).toFixed(0),
      originalSize: Number(originalSize).toFixed(2),
      tradePrice: Number(tradePrice).toFixed(2),
      commission: Number(commission).toFixed(2),
      flag: "regular",
      spread: selectedValue,
      levels: arrayDataWithKeys,
      tableVisibility: {
        showContracts,
        showCredit,
        showCommission,
        showBP,
        showProfit,
        showLoss,
        showCumulativeLoss,
        showSeriesGainLoss,
        showAfterWin,
        showGainPercentage,
        showAfterLoss,
        showLossPercentage
      }
    };
    try {
      const response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_UPDATE_STATIC_MATRIX_DATA_URL), { userId: getUserId(), ...LevelData }, {
        headers: {
          'x-access-token': getToken()
        }
      });
      if (response.status === 201) {
        setMsgM3({
          type: "info",
          msg: "Matrix saved successfully"
        });
      }
    } catch (error) {
      if (error.message.includes("Network Error")) {
        setMsgM1({
          type: "error",
          msg: "Could not connect to the server. Please check your connection."
        });
      } else {
        if (error.response?.data) {
          Object.keys(error.response.data).forEach((field) => {
            const errorMessages = error.response.data[field];
            if (errorMessages && errorMessages.length > 0) {
              setMsgM3({ type: "error", msg: errorMessages });
            }
          });
        }
      }
    }
  };

  useMemo(() => {
    setCurrentAllocation((Number(originalSize) * (allocation / 100)).toFixed(2));
  }, [allocation, originalSize])

  // Fetch saved matrix if it exists
  useMemo(() => {
    fetchAllocationLevelValuesFromAPI2();
    getSPXMatrixAPI(selectedName);
  }, [isMatrixSaved, selectedName]);

  useMemo(() => {
    setLoss((tradePrice * 100 - (100 * selectedValue)).toFixed(2));
  }, [tradePrice, selectedValue])

  // Stack Matrix Level button
  function StackMatrix() {
    let temp = { ...levels };
    let preVal = 0;
    let lastActiveKey = null;

    for (const [key, value] of Object.entries(temp)) {
      if (!value.active) {
        continue; // Skip inactive levels
      }

      lastActiveKey = key; // Track the last active level

      if (preVal !== 0) {
        value.value += preVal;
        break;
      } else {
        preVal = value.value;
        value.value = 0;
      }
    }

    // Check if the last active level has a value of 0
    if (lastActiveKey && temp[lastActiveKey].value === 0) {
      setErrorMessage("Last active level's value should not be 0!");
      setTimeout(() => {
        setErrorMessage(""); // Clear the error message
      }, 2000);
      return; // Stop execution and do not update state
    }
    // Clear error message on success
    setErrorMessage("");
    setStackOrShiftFlag("stack");
    setLevels(temp);
  }

  // Shift Matrix Level button
  function ShiftMatrix() {
    let temp = { ...levels };
    let levelKeys = Object.keys(temp);
    // Check if shifting is possible
    let hasChecked = levelKeys.some(key => temp[key].active);
    let hasValues = levelKeys.some(key => temp[key].value > 0);
    let onlyLastLevelHasValue =
      temp[levelKeys[levelKeys.length - 1]].value > 0 &&
      levelKeys.slice(0, -1).every(key => temp[key].value === 0);
    if (!hasChecked || !hasValues || onlyLastLevelHasValue) {
      setMsgM2({
        type: "error",
        msg: "Shift can't be performed due to selection or value conditions."
      });
      return;
    }
    // Perform the shift operation
    let prevCheck = false;
    let prevValue = 0;
    levelKeys.forEach((key, index) => {
      let currentCheck = temp[key].active;
      let currentValue = temp[key].value;
      // Shift checkmark and value
      temp[key].active = prevCheck;
      temp[key].value = prevValue;
      prevCheck = currentCheck;
      prevValue = currentValue;
    });
    setStackOrShiftFlag("shift");
    setLevels(temp);
  }

  // Regular Button function
  function Regular() {
    setStackOrShiftFlag(true);
    fetchAllocationLevelValuesFromAPI();
  }

  // Reset This Page Function 
  function resetAllParams() {
    setOriginalSize(appContext.buyingPowerStatic[0]);
    setTradePrice(defaultTradePrice);
    setCommission(defaultCommission);
    setAllocation(defaultAllocation)
    setShowAllRows(false);
    setShowAllRows2(false);
    fetchAllocationLevelValuesFromAPI();
  }

  // Reset Table Function 
  const ResetTable = () => {
    setShowContracts(true)
    setShowCredit(true)
    setShowCommission(true)
    setShowBP(true)
    setShowProfit(true)
    setShowLoss(true)
    setShowCumulativeLoss(true)
    setShowSeriesGainLoss(true)
    setShowAfterWin(true)
    setShowGainPercentage(true)
    setShowAfterLoss(true)
    setShowLossPercentage(true)
    setIsFilterModalVisible(false)
  }

  const handleToggle = (toggleSetter) => {
    toggleSetter((prevState) => !prevState);
  };

  const toggleShowMore = () => {
    setShowAllRows(prevState => !prevState);
  };

  const toggleShowMore2 = () => {
    setShowAllRows2(prevState => !prevState);
  };

  const handleCheckboxChange = (level) => {
    setLevels((prev) => ({
      ...prev,
      [level]: { ...prev[level], active: !prev[level].active },
    }));
  };

  const handleIncrement = (level) => {
    setLevels((prevLevels) => ({
      ...prevLevels,
      [level]: { ...prevLevels[level], value: (Number(prevLevels[level]?.value || 0) + 1) }
    }));
  };

  const handleDecrement = (level) => {
    setLevels((prevLevels) => ({
      ...prevLevels,
      [level]: {
        ...prevLevels[level],
        value: Math.max(0, Number(prevLevels[level]?.value || 0) - 1) // Ensure value doesn't go below 0
      }
    }));
  };

  const handleNumberInput = (fun, e) => {
    setTimeout(() => {
      if (isNaN(e.target.value) || (e.target.value < 0)) {
        setMsgM2({
          type: "error",
          msg: "Only positive number should allow"
        })
        return
      }
    }, 10 * 100);
    fun(e.target.value)
  }

  const handleInputChange = (level, value) => {
    if (isNaN(value) || (value || "").includes(".") || (value < 0)) {
      setMsgM2({
        type: "error",
        msg: "Only positive number should allow"
      })
      return
    }
    setLevels({
      ...levels,
      [level]: { ...levels[level], value: Number(value) }
    });
  };

  //////////  Matrix table calculations //////////
  function getTradePrice(level) {
    return level * tradePrice * 100
  }
  function getCommission(level) {
    return level * commission
  }
  function getLoss(level) {
    return ((100 * selectedValue) * level + getCommission(level)) - getTradePrice(level)
    // return (500 * level + getCommission(level)) - getTradePrice(level)
  }
  function getProfit(level) {
    return getTradePrice(level) - getCommission(level)
  }
  function sum(arr) {
    let s = 0
    arr.forEach(element => {
      s += Number(element)
    });
    return s
  }
  function initValueSetup() {
    let indx = 0;
    setLevelTable([])
    setContractsTable([])
    setCreditTable([])
    setCommissionTable([])
    setBPTable([])
    setProfitTable([])
    setLossTable([])
    Object.keys(levels).map((level, index) => {
      if (levels[level].active) {
        setLevelTable((pre) => {
          return [...pre, (index + 1)]
        })
        let t = levels[level].value
        setContractsTable((pre) => {
          return [...pre, t]
        })
        setCreditTable((pre) => {
          return [...pre, getTradePrice(t)]
        })
        setCommissionTable((pre) => {
          return [...pre, getCommission(t)]
        })
        setBPTable((pre) => {
          return [...pre, Math.abs(getLoss(t))]
        })
        setProfitTable((pre) => {
          return [...pre, getProfit(t)]
        })
        setLossTable((pre) => {
          return [...pre, getLoss(t)]
        })
        indx += 1
      }
    })
  }

  useMemo(() => {
    initValueSetup()
  }, [levels, currentAllocation, tradePrice, commission, selectedValue])

  useEffect(() => {
    let indx = 0;
    setCumulativeLossTable([])
    Object.keys(levels).map((level, index) => {
      if (levels[level].active) {
        let t = LossTable.slice(0, indx + 1)
        setCumulativeLossTable((pre) => {
          return [...pre, sum(t)]
        })
        indx += 1
      }
    })
  }, [LossTable])

  useEffect(() => {
    let indx = 0;
    setSeriesGainLossTable([])
    Object.keys(levels).map((level, index) => {
      if (levels[level].active) {
        if (indx === 0) {
          let t = ProfitTable[indx]
          setSeriesGainLossTable((pre) => {
            return [...pre, (t)]
          })
        } else {
          let t = (ProfitTable[indx] - CumulativeLossTable[indx - 1])
          setSeriesGainLossTable((pre) => {
            return [...pre, (t)]
          })
        }
        if (SeriesGainLossTable[0] === 0 && LossTable[0] < 0) {
          let t = [...SeriesGainLossTable]
          t[0] = 0
          setSeriesGainLossTable(t)
        }
        indx += 1
      }
    })
  }, [CumulativeLossTable, ProfitTable])

  function calculateDependentValue() {
    let indx = 0;
    setAfterWinTable([])
    setGainPreTable([])
    setAfterLossTable([])
    setLossPreTable([])

    Object.keys(levels).map((level, index) => {
      if (levels[level].active) {

        let temp = Number(currentAllocation) + SeriesGainLossTable[indx]
        setAfterWinTable((pre) => {
          return [...pre, (temp)]
        })
        let temp1 = ((SeriesGainLossTable[indx] / Number(currentAllocation)) * 100).toFixed(2)
        setGainPreTable((pre) => {
          return [...pre, (temp1)]
        })

        let temp2 = (Number(currentAllocation) - Math.abs(CumulativeLossTable[indx]))
        setAfterLossTable((pre) => {
          return [...pre, (temp2)]
        })

        let temp3 = ((CumulativeLossTable[indx] / Number(currentAllocation)) * 100).toFixed(2)
        setLossPreTable((pre) => {
          return [...pre, (temp3)]
        })
        indx += 1
      }
    })
  }

  useEffect(() => {
    calculateDependentValue()
  }, [SeriesGainLossTable, currentAllocation, CumulativeLossTable])

  const handleNameClick = (key) => {
    setSelectedName(key); // Set the clicked name as the selected one
    setDropdownVisible(false); // Hide the dropdown after selection
    sessionStorage.setItem('staticShortMatrix', JSON.stringify(key));
    getSPXMatrixAPI(key);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterModalRef.current && !filterModalRef.current.contains(event.target)) {
        setIsFilterModalVisible(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuVisible, isFilterModalVisible]);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
    setNewName("")
  };

  useEffect(() => {
    getMatrixFromAPI()
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
        setEditIndex(null);
      }
      if (
        allocationDropdownRef.current && !allocationDropdownRef.current.contains(event.target) &&
        containerRef.current && !containerRef.current.contains(event.target)
      ) {
        setAllocationHintsVisibility(false);
        setEditIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useMemo(() => {
    getStaticKey();
    if (msgM1.type !== "")
      setTimeout(() => {
        setMsgM1({ type: "", msg: "" })
      }, 20 * 100);
    if (msgM2.type !== "")
      setTimeout(() => {
        setMsgM2({ type: "", msg: "" })
      }, 20 * 100);
    if (msgM3.type !== "")
      setTimeout(() => {
        setMsgM3({ type: "", msg: "" })
      }, 20 * 100);
    if (msgM4.type !== "")
      setTimeout(() => {
        setMsgM4({ type: "", msg: "" })
      }, 20 * 100);
  }, [msgM1, msgM2, msgM3, msgM4])

  useEffect(() => {
    const storedMatrix = sessionStorage.getItem('staticShortMatrix');
    if (storedMatrix) {
      setSelectedName(JSON.parse(storedMatrix));
    }
  }, []);

  useEffect(() => {
    if (selectedName) {
      sessionStorage.setItem('staticShortMatrix', JSON.stringify(selectedName));
    }
  }, [selectedName]);

  const handleTradePriceChange = (e) => {
    const inputValue = e.target.value;
    if (isNaN(inputValue) || inputValue < 0) {
      setMsgM4({ type: "error", msg: "Only positive numbers are allowed" });
      return;
    }
    if (Number(inputValue) > 5) {
      setMsgM4({ type: "error", msg: "Maximum value allowed is 5" });
      return;
    }
    handleNumberInput(setTradePrice, e);
  };

  const decrementTradePrice = () => {
    const newValue = (Number(tradePrice) - DefaultInDeCrement).toFixed(2);
    if (newValue >= 0) setTradePrice(newValue);
  };

  const incrementTradePrice = () => {
    const newValue = (Number(tradePrice) + DefaultInDeCrement).toFixed(2);
    if (newValue <= 5) setTradePrice(newValue);
  };

  const handleNewNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 25) {
      setMsgM1({ type: "error", msg: "Length should be less than 25" });
      return;
    }
    setNewName(value);
  };

  // Check if the input is not a number or if it's negative
  const handleOriginalSizeChange = (e) => {
    if (isNaN(e.target.value) || e.target.value < 0) {
      setMsgM4({ type: "error", msg: "Only positive number should allow" });
      return;
    }
    setOriginalSize(e.target.value);
  };

  // Handle Spread Dropdwon
  const handleChange = (event) => {
    const newValue = event.target.value;

    // Reset buyingPowerStatic to prevent stale data
    appContext.setAppContext((prev) => ({
      ...prev,
      buyingPowerStatic: [], // Clear previous data
    }));

    setSelectedValue(newValue);
  };

  useEffect(() => {
    if (selectedValue) {
      fetchAllocationLevelValuesFromAPI2();
    }
  }, [selectedValue]);

  setTimeout(() => {
    setIsMessageVisible(true);
  }, 1000);


  return (<>
    {staticKey ?
      <div className='px-3 lg:pl-10 lg:px-6'>
        {/* Rest Button and Matrix List */}
        <div className='grid min-[450px]:flex flex-wrap items-center gap-5 order-2 lg:order-1'>
          <div className='flex items-center gap-5'>
            <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'> Static Matrix </h2>
            <Button onClick={() => {
              setModalData({
                icon: ResetIcon,
                title: "Reset Details Confirmation",
                message: "Are you sure you want to reset your details?",
                onConfirm: resetAllParams,
              });
              setShowModal(true);
            }}> Reset </Button>
          </div>
          <div className='flex flex-wrap gap-3 items-center'>
            {/* ResetIcon popup section  */}
            <ConfirmationModal show={showModal} onClose={() => setShowModal(false)} onConfirm={modalData.onConfirm} title={modalData.title} icon={modalData.icon} message={modalData.message} />

            <div className='relative' ref={containerRef}>
              <p onClick={toggleDropdown} className='flex items-center gap-[10px] text-sm lg:text-base bg-background6 font-medium text-Primary shadow-[0px_0px_6px_0px_#28236633] rounded-md px-4 py-2 cursor-pointer' >
                <img src={MatrixIcon} className='h-5 w-5' alt="" /> {names[selectedName]} <img className='w-3' src={DropdownIcon} alt="" />
              </p>
              {isDropdownVisible && (
                <div ref={dropdownRef} className='absolute z-10 left-0 min-[450px]:left-auto right-0 top-full mt-2 border border-borderColor5 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-max'>
                  <div className='px-3 py-1 pb-[14px]'>
                    {editIndex === null ? (
                      <>
                        {Object.keys(names).map((key, index) => (
                          <div key={index} className='flex justify-between items-center gap-2 cursor-pointer border-b border-borderColor py-2 lg:py-[10px]' onClick={() => handleNameClick(key)}>
                            <span className='text-xs lg:text-sm text-white font-medium flex items-center justify-center text-Primary bg-userBg rounded-full w-5 lg:w-6 h-5 lg:h-6'>
                              {index + 1}
                            </span>
                            <span className='text-sm lg:text-base font-medium text-Primary text-wrap flex-1' title={names[key]}> {names[key].length > 23 ? `${names[key].slice(0, 23)}..` : names[key]}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleEditClick(key); }}>
                              <img className='w-4 lg:w-auto' src={MatrixEditIcon} alt="" />
                            </button>
                            <img className="w-4 h-[14px] lg:h-4 cursor-pointer DeleteIcon2" src={DeleteIcon} alt="Delete" onClick={() => handleDeleteClick(key)} />
                          </div>
                        ))}
                        <input type='text' value={newName} onChange={handleNewNameChange} className='text-sm lg:text-base text-Primary text-center w-full p-1 lg:p-2 rounded-md my-2 bg-textBoxBg focus:outline-none' placeholder='Enter Matrix Name' />
                        <div className='flex justify-center gap-2 cursor-pointer text-Primary' onClick={handleAddClick} >
                          <img className='w-[18px] lg:w-auto' src={PluseIcon} alt="" />
                          <span className='text-sm lg:text-base text-Primary'>{(newName.length > 0 ? "Save" : "Matrix")}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <input type='text' value={editName} onChange={handleEditNameChange} className='text-sm lg:text-base text-Primary w-full p-2 border-none rounded-md bg-textBoxBg focus:outline-none mb-2' placeholder='Enter matrix Name' />
                        <div className='flex justify-between gap-7 lg:gap-8 items-center'>
                          <img src={BackIcon} onClick={() => setEditIndex(null)} className='w-3 h-[14px] lg:h-4 cursor-pointer' alt="" />
                          <button onClick={handleUpdateName} className='text-sm lg:text-base text-Primary py-1 rounded'> Update </button>
                          <img className='w-4 h-[14px] lg:h-4 cursor-pointer' src={DeleteIcon} onClick={() => handleDeleteClick(editKey)} alt="" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {(msgM1.msg !== "") && <p className={`text-xs lg:text-sm ${msgM1.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM1.msg}.</p>}
        </div>

        {/* Capital Allocation Range Slider Section */}
        <CapitalAllocationRangSlider allocation={allocation} setAllocation={setAllocation} />

        <div className='rounded-md max-w-[792px] bg-background6 p-3 lg:p-5 mt-5 lg:mt-10 shadow-[0px_0px_8px_0px_#28236633] Size'>
          <div className='flex flex-wrap min-[430px]:flex-nowrap items-end gap-3 lg:gap-5'>
            <div className='w-full '>
              <div ref={containerRef}>
                <div className='flex justify-between items-end gap-2'>
                  <label className='block text-sm lg:text-base text-Primary lg:font-medium'>Original Account Size:</label>
                  <div className="flex items-center px-2 w-full max-w-[100px] sm:max-w-[100px] lg:max-w-[110px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7">
                    <span className='text-xs lg:text-sm text-Primary'>Spread:</span>
                    <select id="dropdown" value={selectedValue} onChange={handleChange} className="text-xs lg:text-sm text-Primary px-1 py-[2px] bg-textBoxBg rounded-md focus:outline-none focus:border-borderColor7 cursor-pointer">
                      <option value="5">5</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                </div>
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 p-[7px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md' >
                  <span>$</span>
                  <input type='text' maxLength={10} title="Please upgrade your plan" value={originalSize} onChange={handleOriginalSizeChange} className={`bg-transparent w-full focus:outline-none`} />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <span className='p-2' onClick={() => setAllocationHintsVisibility(!allocationHintsVisibility)} >
                      <img className={`w-3 lg:w-auto cursor-pointer`} src={DropdownIcon} alt="" />
                    </span>
                  </div>
                </div>
                <div className="relative">
                  {allocationHintsVisibility && (
                    <div ref={allocationDropdownRef} className='absolute top-full z-10 mt-2 bg-background6 rounded-md shadow-[0px_0px_6px_0px_#28236633] w-[259px]'>
                      <div className='px-3 lg:px-[18px] py-1 pb-[14px] overscroll-auto'>
                        {staticLevelDefaultValue.length > 0 ? (
                          staticLevelDefaultValue.map((key, index) => (
                            <div key={index}
                              className={`flex justify-between items-center cursor-pointer border-b border-borderColor py-2 lg:py-[10px] ${originalSize === key.buyingPower ? "underline decoration-sky-500" : ""}`}
                              onClick={async () => {
                                setOriginalSize(key.buyingPower);
                                setAllocationHintsVisibility(false);
                                await getSingleLevelAPI(key._id);
                              }}>
                              <span className="text-sm lg:text-base text-Primary font-medium text-wrap flex-1 ml-2">
                                $ {Number(key.buyingPower).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p>No data available</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <label className='block text-sm lg:text-base text-Primary lg:font-medium mt-3 min-[430px]:mt-5'>Trade Price:</label>
              <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                <span>$</span>
                <input type='text' maxLength={3} title='Max Length 3' value={tradePrice} onChange={handleTradePriceChange} className='bg-transparent w-full focus:outline-none' />
                <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                  <button onClick={decrementTradePrice} > <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" /></button>
                  <div className='border-r border-borderColor6 h-[26px]'></div>
                  <button onClick={incrementTradePrice} className='w-[22px]'> <img className='w-4 lg:w-auto' src={PluseIcon} alt="" /> </button>
                </div>
              </div>
            </div>
            <div className='Levels w-full'>
              <label className='block text-sm lg:text-base text-Primary lg:font-medium'> Commission per Contract:
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <span>$</span>
                  <input type="text" maxLength={5} title='Up to 2 digits before and 2 digits after the decimal point' value={commission} onChange={(e) => { const value = e.target.value; if (/^\d{0,2}(\.\d{0,2})?$/.test(value)) { setCommission(value); } }} className='bg-transparent w-full focus:outline-none' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button onClick={() => setCommission((prev) => (parseFloat(prev) > MINIMUM_VALUE ? (parseFloat(prev) - 0.5).toFixed(2) : MINIMUM_VALUE.toFixed(2)))}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px]' onClick={() => setCommission((prev) => (parseFloat(prev) < MAXIMUM_VALUE ? (parseFloat(prev) + 0.5).toFixed(2) : MAXIMUM_VALUE.toFixed(2)))}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-Primary lg:font-medium mt-3 min-[430px]:mt-5'> Loss:
                <input type="text" value={loss ? `$${Number(loss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''} readOnly onChange={(e) => setLoss(e.target.value)} className='focus:outline-none bg-textBoxBg2 text-sm lg:text-base py-2 lg:py-3 px-2 lg:px-4 rounded-md w-full mt-1 lg:mt-2 text-red-500' />
              </label>
            </div>
          </div>
          <p className='text-sm lg:text-base text-Primary lg:font-medium mt-4'>Current Allocation Size: <span className='px-1'>${Number(currentAllocation).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
        </div>
        {(msgM4.msg !== "") && <p className={`text-sm ${msgM4.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM4.msg}.</p>}

        <div className='rounded-md p-5 mt-5 lg:mt-10 shadow-[0px_0px_8px_0px_#28236633] Levels bg-background6'>
          <div className='flex gap-3 lg:gap-5 text-sm lg:text-base text-Primary lg:font-medium mb-5'>
            <button type="button" className={`focus:outline-none border border-borderColor text-sm lg:text-base shadow-md py-[7px] lg:py-[10px] px-[18px] rounded-md`} onClick={Regular}>Regular</button>
            <button type="button" disabled={(stackOrShiftFlag === "shift" ? true : false)} title={(stackOrShiftFlag === "shift" && "Only one operation can we do stack or shift")} className={`focus:outline-none border border-borderColor text-sm lg:text-base shadow-md py-[7px] lg:py-[10px] px-[18px] rounded-md ${stackOrShiftFlag === "shift" ? "bg-[#D8D8D8] text-[#FFFFFF]" : ""} ${stackOrShiftFlag === "stack" ? "bg-[#2c7bace7] text-[#FFFFFF]" : ""}`} onClick={StackMatrix}>Stack</button>
            <button type="button" disabled={(stackOrShiftFlag === "stack" ? true : false)} title={(stackOrShiftFlag === "stack" && "Only one operation can we do stack or shift")} className={`focus:outline-none border border-borderColor text-sm lg:text-base shadow-md py-[7px] lg:py-[10px] px-[18px] rounded-md ${stackOrShiftFlag === "stack" ? "bg-[#D8D8D8] text-[#FFFFFF]" : ""} ${stackOrShiftFlag === "shift" ? "bg-[#2c7bace7] text-[#FFFFFF]" : ""}`} onClick={ShiftMatrix}>Shift</button>
          </div>
          {(msgM2.msg !== "") && <p className={`text-sm ${msgM2.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM2.msg}.</p>}
          {errorMessage && (<p className="text-[#D82525] text-sm mb-2">{errorMessage}</p>)}
          <h3 className='text-xl lg:text-[22px] xl:text-2xl font-semibold text-Primary mb-2'>Levels</h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-5'>

            {Array.from(
              { length: Math.max(appContext.shortMatrixLength, Object.keys(levels).length) },
              (_, index) => {
                const levelKey = `level${index + 1}`;
                // Ensure the level exists in state before accessing properties
                if (!levels[levelKey]) {
                  setLevels((prevLevels) => ({
                    ...prevLevels,
                    [levelKey]: { value: 0, active: false }
                  }));
                }
                const levelValue = levels[levelKey]?.value ?? '';
                const isChecked = levels[levelKey]?.active ?? false;

                return (
                  <div key={index}>
                    <div className='flex items-center gap-3 lg:gap-[15px]'>
                      <input
                        type='checkbox'
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(levelKey)}
                        className='accent-accentColor w-[15px] h-[19px] lg:w-[19px] cursor-pointer'
                      />
                      <label className='text-sm lg:text-base text-Primary font-medium'>
                        {`Level ${index + 1}`}
                      </label>
                    </div>
                    <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-2 p-[6px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                      <input
                        type='text'
                        maxLength={5}
                        title='Max Length 5'
                        value={levelValue > 0 ? levelValue : 0}
                        onChange={(e) => handleInputChange(levelKey, e.target.value)}
                        disabled={!isChecked}
                        className='bg-transparent max-w-[230px] w-full focus:outline-none'
                      />
                      <div className='flex gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                        <button onClick={() => handleDecrement(levelKey)} disabled={!isChecked} >
                          <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                        </button>
                        <div className='border-r border-borderColor6 h-[26px]'></div>
                        <button onClick={() => handleIncrement(levelKey)} disabled={!isChecked}
                          className='w-[22px]' >
                          <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}

          </div>
          {(appContext.shortMatrixLength) > 6 && <div className="mt-4 text-center">
            <button onClick={toggleShowMore2} className="text-base text-Secondary2 font-medium underline">
              {showAllRows2 ? 'See Less Levels' : 'See More Levels'}
            </button>
          </div>}
        </div>

        <div className='flex justify-between items-center mt-5 lg:mt-10 lg:max-w-[830px] min-[1150px]:max-w-[975px] xl:max-w-[1110px] min-[1380px]:max-w-[1220px] min-[1450px]:max-w-[1070px] max-[1600px]:max-w-[1000px] min-[1601px]:max-w-full w-full'>
          <h2 className='text-xl lg:text-[22px] xl:text-2xl text-Primary font-semibold'> Static Matrix - Short IC</h2>
          <p className='text-sm lg:text-base font-medium text-white flex items-center gap-[10px] bg-background2 py-2 px-5 rounded-md cursor-pointer' onClick={() => setIsFilterModalVisible(!isFilterModalVisible)}>
            <img className='w-4 lg:w-auto' src={FilterIcon} alt="Filter icon" /> Filter
          </p>
        </div>

        <div className="flex justify-end">
          <FilterModal
            isVisible={isFilterModalVisible}
            filterModalRef={filterModalRef}
            filters={{
              showContracts, setShowContracts,
              showCredit, setShowCredit,
              showCommission, setShowCommission,
              showBP, setShowBP,
              showProfit, setShowProfit,
              showLoss, setShowLoss,
              showCumulativeLoss, setShowCumulativeLoss,
              showSeriesGainLoss, setShowSeriesGainLoss,
              showAfterWin, setShowAfterWin,
              showGainPercentage, setShowGainPercentage,
              showAfterLoss, setShowAfterLoss,
              showLossPercentage, setShowLossPercentage,
            }}
            handleToggle={handleToggle}
            ResetTable={ResetTable}
          />
        </div>

        <div className="overflow-auto lg:max-w-[830px] min-[1150px]:max-w-[975px] xl:max-w-[1110px] min-[1380px]:max-w-[1220px] min-[1450px]:max-w-[1070px] max-[1600px]:max-w-[1000px] min-[1601px]:max-w-full w-full mt-4 rounded-md shadow-[0px_0px_6px_0px_#28236633]">
          <table className="table-auto border-collapse w-full">
            <thead>
              <tr className="bg-background2 text-white text-sm lg:text-base font-semibold">
                <th className="px-2 py-2">Level</th>
                {showContracts && <th className="border-x border-borderColor px-2 py-2">Contracts ({(sum(ContractsTable)).toFixed(0)})</th>}
                {showCredit && <th className="border-x border-borderColor px-2 py-2">Credit</th>}
                {showCommission && <th className="border-x border-borderColor px-2 py-2">Commission</th>}
                {showBP && <th className="border-x border-borderColor px-2 py-2">BP</th>}
                {showProfit && <th className="border-x border-borderColor px-2 py-2">Profit</th>}
                {showLoss && <th className="border-x border-borderColor px-2 py-2">Loss</th>}
                {showCumulativeLoss && <th className="border-x border-borderColor px-2 py-2">Cumulative Loss</th>}
                {showSeriesGainLoss && <th className="border-x border-borderColor px-2 py-2">Series Gain/Loss</th>}
                {showAfterWin && <th className="border-x border-borderColor px-2 py-2">After Win</th>}
                {showGainPercentage && <th className="border-x border-borderColor px-2 py-2">Gain</th>}
                {showAfterLoss && <th className="border-x border-borderColor px-2 py-2">After Loss</th>}
                {showLossPercentage && <th className="px-2 py-2">Loss</th>}
              </tr>
            </thead>
            <tbody>
              {LevelTable.slice(0, visibleRows).map((value, index) => (
                <tr key={index} className="text-sm lg:text-base text-center text-Secondary bg-background6 ">
                  <td className="border-t border-borderColor px-2 py-2">{value}</td>
                  {showContracts && <td className="border-t border-x border-borderColor px-2 py-2">{ContractsTable[index]}</td>}
                  {showCredit && <td className="border-t border-x border-borderColor px-2 py-2">${Number(CreditTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {showCommission && <td className="border-t border-x border-borderColor px-2 py-2">${Number(CommissionTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {showBP && <td className="border-t border-x border-borderColor px-2 py-2">${Number(BPTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {showProfit && <td className="border-t border-x border-borderColor px-2 py-2"> ${Number(ProfitTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {showLoss && <td className="border-t border-x border-borderColor px-2 py-2 text-red-500">-${Number(LossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {showCumulativeLoss && <td className="border-t border-x border-borderColor px-2 py-2 text-red-500">-${Number(CumulativeLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {showSeriesGainLoss && <td className={`border-t border-x border-borderColor px-2 py-2 ${SeriesGainLossTable[index] < 0 ? 'text-red-500' : ''} `}> ${Number(SeriesGainLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {showAfterWin && <td className="border-t border-x border-borderColor px-2 py-2">${Number(AfterWinTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {showGainPercentage && <td className={`border-t border-x border-borderColor px-2 py-2 ${GainPreTable[index] < 0 ? 'text-red-500' : ''} `}>{GainPreTable[index]}%</td>}
                  {showAfterLoss && <td className={`border-t border-x border-borderColor px-2 py-2 ${AfterLossTable[index] < 0 ? 'text-red-500' : ''} `}>${Number(AfterLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {showLossPercentage && <td className="border-t border-borderColor px-2 py-2 text-red-500">-{LossPreTable[index]}%</td>}
                </tr>
              ))}
            </tbody>
          </table>
          {(LevelTable.length === 0) && <>
            {/* {RegularMatrix()} */}
            <div className="mt-4 text-center">
              <p className="text-base text-Secondary2 font-medium">
                if any one of level selected and still calculation is not shown, Please click on Regular button
              </p>
            </div>
          </>}
        </div>

        {LevelTable.length > 5 && <div className="mt-4 text-center">
          <button onClick={toggleShowMore} className="text-sm lg:text-base text-Secondary2 font-medium underline">
            {showAllRows ? 'See Less Levels' : 'See More Levels'}
          </button>
        </div>}

        <Button className="flex items-center gap-2 lg:gap-[17px] h-[38px] lg:h-[55px] mt-5 lg:mt-10 mx-auto" onClick={handleSaveMatrix} >
          <img className='h-[18px]' src={SavedMatrixIcon} alt="" /> Save Matrix
        </Button>

        <div className='mb-5 lg:mb-10 '>
          {(msgM3.msg !== "") && <p className={`text-sm text-center ${msgM3.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM3.msg}, <Link to="/subscription"></Link> </p>}
        </div>
      </div>
      :
      <>
        {isMessageVisible ? <Link to={"/subscription"} className='text-lg text-Primary flex justify-center items-center h-3/4'>Please upgrade your plan...</Link> :
          <div className="flex justify-center items-center h-[100vh]">
            <div role="status">
              <svg aria-hidden="true" className="w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>}
      </>
    }
  </>);
}

export default StaticMatrix;