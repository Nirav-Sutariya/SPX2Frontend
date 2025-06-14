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
import PopupCloseIcon from '../../assets/Images/SuperDashboard/PopupCloseIcon.svg';
import SubscriptionUpdateIcon from '../../assets/Images/Subscription/SubscriptionUpdateIcon.svg';
import CapitalAllocationRangSlider from '../../components/CapitalAllocationRangSlider';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getToken, getUserId } from '../login/loginAPI';
import { AppContext } from '../../components/AppContext';
import { defaultCommission, defaultAllocation, DefaultInDeCrement, ConfirmationModal, FilterModalLong } from '../../components/utils';
import { motion, AnimatePresence } from 'framer-motion';


const StaticMatrixLong = () => {

  const MINIMUM_VALUE = 0;
  const MAXIMUM_VALUE = 999;
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  const dropdown2Ref = useRef(null);
  const filterModalRef = useRef(null);
  const debounceTimeout = useRef(null);
  let appContext = useContext(AppContext);
  const allocationDropdownRef = useRef(null);
  const [editKey, setEditKey] = useState(null);
  const [selectedValue, setSelectedValue] = useState(5);
  const [names, setNames] = useState(appContext.namesLong);
  const [allocation, setAllocation] = useState(defaultAllocation);
  const [tradePrice, setTradePrice] = useState(appContext.longTradePrice);
  const [commission, setCommission] = useState(defaultCommission);
  const [originalSize, setOriginalSize] = useState(null);
  const firstKey = Object.keys(appContext.namesLong)[0] || null;
  const [selectedName, setSelectedName] = useState(firstKey);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [currentAllocation, setCurrentAllocation] = useState(originalSize);

  // Table column value
  const [levels, setLevels] = useState([]);
  const [BPTable, setBPTable] = useState([]);
  const [LossTable, setLossTable] = useState([]);
  const [LevelTable, setLevelTable] = useState([]);
  const [CreditTable, setCreditTable] = useState([]);
  const [ProfitTable, setProfitTable] = useState([]);
  const [LossPreTable, setLossPreTable] = useState([]);
  const [GainPreTable, setGainPreTable] = useState([]);
  const [AfterWinTable, setAfterWinTable] = useState([]);
  const [AfterLossTable, setAfterLossTable] = useState([]);
  const [ContractsTable, setContractsTable] = useState([]);
  const [CommissionTable, setCommissionTable] = useState([]);
  const [CumulativeLossTable, setCumulativeLossTable] = useState([]);
  const [SeriesGainLossTable, setSeriesGainLossTable] = useState([]);
  const [staticLevelDefaultValue, setStaticLevelDefaultValue] = useState([]);

  const [showBP, setShowBP] = useState(true);
  const [newName, setNewName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [modalData, setModalData] = useState({});
  const [showLoss, setShowLoss] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [showProfit, setShowProfit] = useState(true);
  const [showCredit, setShowCredit] = useState(true);
  const [loss, setLoss] = useState(tradePrice * 100);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAllRows, setShowAllRows] = useState(false);
  const [showAfterWin, setShowAfterWin] = useState(true);
  const [showContracts, setShowContracts] = useState(true);
  const [showAfterLoss, setShowAfterLoss] = useState(true);
  const [isMatrixSaved, setIsMatrixSaved] = useState(false);
  const [showCommission, setShowCommission] = useState(true);
  const [msgM1, setMsgM1] = useState({ type: "", msg: "", });
  const [msgM2, setMsgM2] = useState({ type: "", msg: "", });
  const [msgM3, setMsgM3] = useState({ type: "", msg: "", });
  const [msgM4, setMsgM4] = useState({ type: "", msg: "", });
  const [stackOrShiftFlag, setStackOrShiftFlag] = useState(true);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showCumulativeLoss, setShowCumulativeLoss] = useState(true);
  const [showSeriesGainLoss, setShowSeriesGainLoss] = useState(true);
  const [showGainPercentage, setShowGainPercentage] = useState(true);
  const [showLossPercentage, setShowLossPercentage] = useState(true);
  const [staticKey, setStaticKey] = useState(appContext.staticLongKey);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [allocationHintsVisibility, setAllocationHintsVisibility] = useState(false);
  const options = ["5", "10", "15", "20", "25", "40", "50"];
  const [showMessage, setShowMessage] = useState(false);


  const toggleDropdown2 = () => setIsOpen(prev => !prev);

  // Handle Spread Dropdown
  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    getStaticTradePrice(value);
  };

  // Table 6 level Visible Condition 
  const visibleLevels = showAll
    ? Math.max(appContext.longMatrixLength, Object.keys(levels).length)
    : Math.min(6, Math.max(appContext.longMatrixLength, Object.keys(levels).length));

  // Call API only if firstKey exists and API hasn't been called yet
  if (firstKey && !selectedName) {
    setSelectedName(firstKey);
    getSPXMatrixAPI(firstKey);
  }

  // Get Admin This Page Access For Admin Api 
  async function getStaticKey() {
    if (appContext.staticLongKey) return;

    setIsMessageVisible(true);
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_STATIC_LONG_KRY), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setStaticKey(response.data.data);
        appContext.setAppContext((curr) => ({
          ...curr,
          staticLongKey: response.data.data,
        }));
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
    finally {
      setIsMessageVisible(false);
    }
  }

  // Get Admin This Page Access For Admin Api 
  async function getStaticTradePrice(spreadValue) {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_STATIC_TRADE_PRICE), { userId: getUserId(), matrixType: "StaticLong", spread: spreadValue }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setTradePrice(response.data.data?.staticLongTradePrice);

        appContext.setAppContext((curr) => ({
          ...curr,
          longTradePrice: response.data.data?.staticLongTradePrice,
        }));
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM3({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Get Matrix List Api && Matrix List Section Api Call Section
  async function getMatrixFromAPI() {
    let temp = {}
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_STATIC_MATRIX_URL), { typeIc: "long", userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        let data = response.data.data;
        if (Array.isArray(data)) {
          data.forEach(item => {
            temp[item._id] = item.matrixName;
          });
        }
        appContext.setAppContext(curr => ({
          ...curr,
          namesLong: temp,
        }));
        setNames(temp);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }

  // Crate Matrix Name Api
  async function addMatrixAPI(name) {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_CREATE_STATIC_MATRIX_URL), { matrixName: name, userId: getUserId(), typeIc: "long" }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        await getMatrixFromAPI();
        setMsgM1({ type: "info", msg: "Matrix name added successfully." });
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "You can not delete last matrix";
        setMsgM1({ type: "error", msg: message });
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
        setMsgM1({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
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
            setMsgM1({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
          } else if (error.response?.status === 400) {
            const message = error.response?.data?.message || "You can not delete last matrix";
            setMsgM1({ type: "error", msg: message });
          }
        }
      },
    });
    setShowModal(true);
  };

  // Edit Name Function
  const handleEditClick = (key) => {
    setEditKey(key);
    setEditIndex(key);
    setEditName(names[key]);
  };

  // New Name Add Function
  const handleAddClick = async () => {
    if (newName) {
      try {
        let response = await addMatrixAPI(newName)
        setNewName('');
      } catch (error) {
        if (error.message.includes('Network Error')) {
          setMsgM1({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
        }
      }
    }
  };

  // Dropdown Edit Name Function
  const handleEditNameChange = (e) => {
    if (e.target.value.length > 25) {
      setMsgM1({ type: "error", msg: "length should be less than 25" })
      return
    }
    setEditName(e.target.value);
  };

  // Update Name Function
  const handleUpdateName = async () => {
    if (editName && editIndex !== null) {
      await updateMatrixAPI(editName, editIndex)
      await getMatrixFromAPI();
      setEditIndex(null);
      setEditName('');
    }
  };

  // Get Original Account Size Api
  async function fetchAllocationLevelValuesFromAPI() {
    try {
      let response = await axios.post(process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_LEVEL_VALUE_URL, { userId: getUserId(), spread: selectedValue, matrixType: "StaticLong" }, {
        headers: {
          'x-access-token': getToken(),
        },
      });

      if (response.status === 200 && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map(({ buyingPower, _id }) => ({ buyingPower, _id }));
        setStaticLevelDefaultValue(formattedData);
        appContext.setAppContext((prev) => ({
          ...prev,
          buyingPowerStaticLong: formattedData.map((item) => item.buyingPower),
        }));
        setOriginalSize(response.data.data[2].buyingPower);
        await getSingleLevelAPI(response.data.data[2]._id);
        if (!localStorage.getItem('originalSizeIdLong')) {
          localStorage.setItem('originalSizeIdLong', response.data.data[2]._id);
        }
      } else {
        setStaticLevelDefaultValue([]);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM3({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
      setStaticLevelDefaultValue([]);
    }
  }

  async function fetchAllocationLevelValuesFromAPI2() {
    try {
      let response = await axios.post(process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_LEVEL_VALUE_URL, { userId: getUserId(), spread: selectedValue, matrixType: "StaticLong" }, {
        headers: {
          'x-access-token': getToken(),
        },
      });
      if (response.status === 200 && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map(({ buyingPower, _id }) => ({ buyingPower, _id }));
        setStaticLevelDefaultValue(formattedData);
        appContext.setAppContext((prev) => ({
          ...prev,
          buyingPowerStaticLong: formattedData.map((item) => item.buyingPower),
        }));
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM3({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
      setStaticLevelDefaultValue([]);
    }
  }

  // Get Single level
  async function getSingleLevelAPI(levelId) {
    try {
      const response = await axios.post((process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_SINGLE_LEVEL_VALUE_URL), { userId: getUserId(), levelId }, {
        headers: {
          'x-access-token': getToken()
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        const levelData = response.data.data;
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
      if (error.message.includes('Network Error')) {
        setMsgM3({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }

  // Get Single Static Matrix
  async function getSPXMatrixAPI(key) {
    if (!key) {
      return;
    }
    try {
      const response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_SINGLE_MATRIX_LIST_URL), { userId: getUserId(), staticMatrixId: key }, {
        headers: {
          'x-access-token': getToken()
        },
      });
      if (response.status === 200) {
        setSelectedValue(response.data.data.spread ?? 5);
        setAllocation(response.data.data.allocation ?? defaultAllocation);
        setTradePrice(response.data.data.tradePrice ?? appContext.longTradePrice);
        setCommission(response.data.data.commission ?? defaultCommission);
        setOriginalSize(response.data.data.originalSize ?? 11800);
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
        setMsgM1({ type: "info", msg: 'No saved matrix found, using default values.");' });
        setIsMatrixSaved(false);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
      return false
    }
  }

  // Get Single level By Manuail
  async function getLevelDetailsUsingBuyingPower(buyingPower) {
    try {
      const response = await axios.post((process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_LEVEL_DETAILS_USING_BUYING_POWER), { userId: getUserId(), buyingPower, spread: selectedValue, matrixType: "StaticLong" }, {
        headers: {
          'x-access-token': getToken()
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        const levelData = response.data.data;
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
      if (error.message.includes('Network Error')) {
        setMsgM3({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Matrix Save Data Api
  const handleSaveMatrix = async () => {
    setIsClicked(true);
    if (!selectedName) {
      setMsgM3({ type: "error", msg: "Please select one of matrix from dropdown" });
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
        setMsgM3({ type: "info", msg: "Matrix saved successfully" });
        setShowMessage(true);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM3({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
        setShowMessage(true);
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "Something went wrong";
        setMsgM3({ type: "error", msg: message });
      }
    }
  };

  useMemo(() => {
    setCurrentAllocation((Number(originalSize) * (allocation / 100)).toFixed(2))
  }, [allocation, originalSize])

  useMemo(() => {
    setLoss(Math.round(tradePrice * 100).toFixed(2))
  }, [tradePrice])

  useMemo(() => {
    if (staticKey && Object.keys(appContext.namesLong || {}).length === 0) {
      getMatrixFromAPI();
    }
  }, [staticKey, isMatrixSaved])

  // Regular Button function
  function Regular() {
    setStackOrShiftFlag(true);

    const savedId = localStorage.getItem('originalSizeIdLong');

    if (!staticLevelDefaultValue || !savedId) return;

    const matched = staticLevelDefaultValue.find(item => item._id === savedId);

    if (matched && matched.buyingPower === originalSize) {
      getSingleLevelAPI(savedId);
    }

    getLevelDetailsUsingBuyingPower(originalSize);
  }

  // Stack Button function
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

  // Shift Button function
  function ShiftMatrix() {
    let temp = { ...levels };
    let levelKeys = Object.keys(temp);
    let hasChecked = levelKeys.some(key => temp[key].active);
    let hasValues = levelKeys.some(key => temp[key].value > 0);
    let onlyLastLevelHasValue =
      temp[levelKeys[levelKeys.length - 1]].value > 0 &&
      levelKeys.slice(0, -1).every(key => temp[key].value === 0);
    if (!hasChecked || !hasValues || onlyLastLevelHasValue) {
      setMsgM2({ type: "error", msg: "Shift can't be performed due to selection or value conditions." });
      return;
    }
    let prevCheck = false;
    let prevValue = 0;
    levelKeys.forEach((key) => {
      let currentCheck = temp[key].active;
      let currentValue = temp[key].value;
      temp[key].active = prevCheck;
      temp[key].value = prevValue;
      prevCheck = currentCheck;
      prevValue = currentValue;
    });
    setStackOrShiftFlag("shift");
    setLevels(temp);
  }

  const toggleShowMore = () => {
    setShowAllRows(prevState => !prevState);
  };

  // Reset This Page Function 
  function resetAllParams() {
    setOriginalSize(appContext.buyingPowerStaticLong[2])
    setTradePrice(appContext.longTradePrice);
    setCommission(defaultCommission);
    setAllocation(defaultAllocation);
    setShowAll(false);
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

  const handleCheckboxChange = (levelKey) => {
    setLevels((prevLevels) => {
      const currentLevel = prevLevels[levelKey] || { value: 0, active: false };

      const updatedLevel = {
        active: !currentLevel.active,
        value: !currentLevel.active && currentLevel.value <= 0 ? 0 : currentLevel.value
      };

      return {
        ...prevLevels,
        [levelKey]: updatedLevel
      };
    });
  };

  const handleIncrement = (level) => {
    setLevels({
      ...levels,
      [level]: { ...levels[level], value: (Number(levels[level].value) + 1) }
    });
  };

  const handleDecrement = (level) => {
    setLevels({
      ...levels,
      [level]: {
        ...levels[level],
        value: Math.max(0, Number(levels[level].value) - 1)
      }
    });
  };

  const handleNumberInput = (fun, e) => {
    setTimeout(() => {
      if (isNaN(e.target.value) || (e.target.value < 0)) {
        setMsgM2({ type: "error", msg: "Only positive number should allow" })
        return
      }
    }, 10 * 100);
    fun(e.target.value)
  }

  const handleInputChange = (level, value) => {
    if (isNaN(value) || (value || "").includes(".") || (value < 0)) {
      setMsgM2({ type: "error", msg: "Only positive number should allow" })
      return
    }
    setLevels({
      ...levels,
      [level]: { ...levels[level], value: Number(value) }
    });
  };

  //////////  Matrix table calculations //////////
  function getLoss(contract) {
    return (-1 * (tradePrice * contract * 100 + commission * contract))
  }
  function getProfit(contract) {
    return (((100 * selectedValue) * contract) - tradePrice * contract * 100 - commission * contract)
    // return ((500 * contract) - tradePrice * contract * 100 - commission * contract)
  }
  function getBPValue(contract) {
    return (tradePrice * contract * 100 + commission * contract)
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
      setLevelTable((pre) => {
        return [...pre, (index + 1)]
      })
      let t = (levels[level]?.active ? levels[level].value : 0) || 0;
      setContractsTable((pre) => {
        return [...pre, Math.abs(t)]
      })
      setCreditTable((pre) => {
        return [...pre, Math.abs(tradePrice * t * 100)]
      })
      setCommissionTable((pre) => {
        return [...pre, Math.abs(commission * t)]
      })
      setBPTable((pre) => {
        return [...pre, Math.abs(getBPValue(t))]
      })
      setProfitTable((pre) => {
        return [...pre, Math.abs(getProfit(t))]
      })
      setLossTable((pre) => {
        return [...pre, getLoss(t)]
      })
      indx += 1
    })
  }

  useMemo(() => {
    initValueSetup()
  }, [levels, currentAllocation, tradePrice, commission, selectedValue])

  // Cumulative Loss calculate
  useEffect(() => {
    setCumulativeLossTable([])
    let result = [];
    let sum = 0;
    for (let i = 0; i < LossTable.length; i++) {
      sum += LossTable[i];
      result.push(sum);
    }
    setCumulativeLossTable(result);
  }, [LossTable])

  // Series Gain/Loss calculate
  useEffect(() => {
    let indx = 0;
    setSeriesGainLossTable([])
    Object.keys(levels).map((level) => {
      if (indx === 0) {
        let t = ProfitTable[indx]
        setSeriesGainLossTable((pre) => {
          return [...pre, (t)]
        })
      } else {
        let t = (ProfitTable[indx] + CumulativeLossTable[indx - 1])
        setSeriesGainLossTable((pre) => {
          return [...pre, (t)]
        })
      }
      indx += 1
    })
  }, [CumulativeLossTable, ProfitTable])

  function calculateDependentValue() {
    let indx = 0;
    setAfterWinTable([])
    setGainPreTable([])
    setAfterLossTable([])
    setLossPreTable([])

    Object.keys(levels).map((level) => {
      let temp = Number(currentAllocation) + SeriesGainLossTable[indx]
      setAfterWinTable((pre) => {
        return [...pre, (temp)]
      })
      let temp1 = ((SeriesGainLossTable[indx] / Number(currentAllocation)) * 100).toFixed(2)
      setGainPreTable((pre) => {
        return [...pre, (temp1)]
      })

      let temp2 = (Number(currentAllocation) + Number(CumulativeLossTable[indx]))
      setAfterLossTable((pre) => {
        return [...pre, (temp2)]
      })

      let temp3 = ((CumulativeLossTable[indx] / Number(currentAllocation)) * 100).toFixed(2)
      setLossPreTable((pre) => {
        return [...pre, (temp3)]
      })
      indx += 1
    })
  }

  useEffect(() => {
    calculateDependentValue()
  }, [SeriesGainLossTable, currentAllocation, CumulativeLossTable])

  const handleNameClick = (key) => {
    setSelectedName(key);
    setDropdownVisible(false);
    sessionStorage.setItem('staticLongMatrix', JSON.stringify(key));
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
    setNewName("")
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
        setEditIndex(null);
      }

      // Allocation Hints
      if (
        allocationDropdownRef.current && !allocationDropdownRef.current.contains(event.target) &&
        containerRef.current && !containerRef.current.contains(event.target)
      ) {
        setAllocationHintsVisibility(false);
        setEditIndex(null);
      }

      // Close filter modal
      if (isFilterModalVisible && filterModalRef.current && !filterModalRef.current.contains(event.target)) {
        setIsFilterModalVisible(false);
      }

      if (dropdown2Ref.current && !dropdown2Ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterModalVisible]);

  useMemo(() => {
    if (msgM1.type !== "")
      setTimeout(() => {
        setMsgM1({ type: "", msg: "" })
      }, 40 * 100);
    if (msgM2.type !== "")
      setTimeout(() => {
        setMsgM2({ type: "", msg: "" })
      }, 40 * 100);
    if (msgM3.type !== "")
      setTimeout(() => {
        setMsgM3({ type: "", msg: "" })
        setShowMessage(false);
        setIsClicked(false);
      }, 20 * 100);
    if (msgM4.type !== "")
      setTimeout(() => {
        setMsgM4({ type: "", msg: "" })
      }, 40 * 100);
  }, [msgM1, msgM2, msgM3, msgM4])

  useEffect(() => {
    const storedMatrix = sessionStorage.getItem('staticLongMatrix');
    if (storedMatrix) {
      setSelectedName(JSON.parse(storedMatrix));
    }
  }, []);

  useEffect(() => {
    if (selectedName) {
      sessionStorage.setItem('staticLongMatrix', JSON.stringify(selectedName));
    }
  }, [selectedName]);

  useEffect(() => {
    if (selectedValue && staticKey) {
      fetchAllocationLevelValuesFromAPI2();
    }
  }, [selectedValue, staticKey]);

  useEffect(() => {
    if (staticKey) {
      getSPXMatrixAPI(selectedName);
    }
  }, [staticKey, selectedName]);

  useEffect(() => {
    if (appContext.staticLongKey === null) {
      getStaticKey();
    }
  }, [appContext.staticLongKey]);

  useEffect(() => {
    if (appContext.longTradePrice === null) {
      getStaticTradePrice(selectedValue);
    }
  }, [appContext.longTradePrice]);

  const handleNewNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 30) {
      setMsgM1({ type: "error", msg: "Length should be less than 30" });
      return;
    }
    setNewName(value);
  };

  // Check if the input is not a number or if it's negative
  const handleOriginalSizeChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value < 0) {
      setMsgM4({ type: "error", msg: "Only positive number should allow" });
      return;
    }
    setOriginalSize(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      getLevelDetailsUsingBuyingPower(value);
    }, 100);
  };

  const handleTradePriceChange = (e) => {
    const inputValue = e.target.value;
    if (isNaN(inputValue) || inputValue < 0) {
      setMsgM4({ type: "error", msg: "Only positive numbers are allowed" });
      return;
    }
    if (Number(inputValue) > 20) {
      setMsgM4({ type: "error", msg: "Maximum value allowed is 20" });
      return;
    }
    handleNumberInput(setTradePrice, e);
  };

  const decreaseTradePrice = () => {
    const newValue = (Number(tradePrice) - DefaultInDeCrement).toFixed(2);
    if (newValue >= 0) setTradePrice(newValue);
  };

  const increaseTradePrice = () => {
    const newValue = (Number(tradePrice) + DefaultInDeCrement).toFixed(2);
    if (newValue <= 5) setTradePrice(newValue);
  };

  const handleClick = async (key) => {
    setOriginalSize(key.buyingPower);
    setAllocationHintsVisibility(false);
    await getSingleLevelAPI(key._id);
    localStorage.setItem('originalSizeIdLong', key._id);
  };


  return (<>
    {staticKey ?
      <div className='px-3 lg:pl-10 lg:px-6'>
        <div className='grid min-[470px]:flex flex-wrap items-center gap-5 order-2 lg:order-1'>
          <div className='flex items-center gap-5'>
            <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'> Static Matrix Long </h2>
            <Button className={`${showModal ? "shadow-[inset_2px_2px_5px_0_#104566]" : "shadow-[inset_-2px_-2px_5px_0_#104566]"}`}
              onClick={() => {
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

            <div className='relative' ref={dropdownRef}>
              <p onClick={toggleDropdown} className='flex items-center gap-[10px] text-sm lg:text-base bg-background6 font-medium text-Primary shadow-[0px_0px_6px_0px_#28236633] rounded-md px-4 py-2 cursor-pointer' >
                <img src={MatrixIcon} className='h-5 w-5' alt="" /> {names[selectedName]} <img className='w-3' src={DropdownIcon} alt="" />
              </p>
              <AnimatePresence>
                {isDropdownVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.50, ease: "easeInOut" }}
                    className='absolute z-10 left-0 min-[470px]:left-auto right-0 top-full mt-2 border border-borderColor5 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-max'>
                    <div className='p-1 pb-[14px]'>
                      {editIndex === null ? (
                        <>
                          {Object.keys(names).map((key, index) => (
                            <div key={index} className={`flex justify-between items-center gap-2 cursor-pointer border-b border-borderColor p-2 lg:py-[10px] mb-1 hover:rounded-md hover:bg-background4 ${key === selectedName ? "rounded-md bg-background4" : ""}`} onClick={() => handleNameClick(key)}>
                              <span className='text-xs lg:text-sm text-white font-medium flex items-center justify-center text-Primary bg-userBg rounded-full w-5 lg:w-6 h-5 lg:h-6'>
                                {index + 1}
                              </span>
                              <span className='text-sm lg:text-base font-medium text-Primary text-wrap flex-1 ' title={names[key]}> {names[key].length > 23 ? `${names[key].slice(0, 23)}..` : names[key]}</span>
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
                            <img src={BackIcon} title='Back' className='w-3 h-[14px] lg:h-4 cursor-pointer' onClick={() => setEditIndex(null)} alt="" />
                            <button onClick={handleUpdateName} className='text-sm lg:text-base text-Primary py-1 rounded'> Update </button>
                            <img className='w-4 h-[14px] lg:h-4 cursor-pointer' src={DeleteIcon} onClick={() => handleDeleteClick(editKey)} alt="" />
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {(msgM1.msg !== "") && <p className={`text-sm ${msgM1.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM1.msg}.</p>}
        </div>

        <CapitalAllocationRangSlider allocation={allocation} setAllocation={setAllocation} />

        <div className='rounded-md max-w-[792px] bg-background6 p-3 lg:p-5 mt-5 lg:mt-10 shadow-[0px_0px_8px_0px_#28236633] Size'>
          <div className='flex flex-wrap items-end min-[530px]:flex-nowrap gap-3 lg:gap-5'>
            <div className='w-full '>
              <div ref={containerRef}>
                <div className='flex flex-wrap justify-between items-end gap-2'>
                  <label className='block text-sm lg:text-base text-Primary lg:font-medium'>Original Account Size:</label>
                  <div ref={dropdown2Ref} className="relative w-full max-w-[110px]">
                    <div className="flex items-center justify-between px-2 py-1 border border-borderColor bg-textBoxBg rounded-md cursor-pointer" onClick={toggleDropdown2} >
                      <span className="text-xs lg:text-sm text-Primary">Spread: {selectedValue}</span>
                      <img className='w-[10px]' src={DropdownIcon} alt="" />
                    </div>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.50, ease: "easeInOut" }}
                          className="absolute top-full right-0 w-12 border border-borderColor bg-background6 rounded-md shadow-md z-10">
                          {options.map((value, index) => (
                            <div key={index} className={`px-3 py-1 text-xs lg:text-sm cursor-pointer hover:bg-borderColor4 hover:text-white rounded ${selectedValue === value ? 'bg-borderColor4 text-white' : 'text-Primary'}`} onClick={() => handleSelect(value)} >
                              {value}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 p-[7px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <span>$</span>
                  <input type='text' inputMode='numeric' maxLength={10} title='Max Length 10' value={originalSize} onChange={handleOriginalSizeChange} className='bg-transparent w-full focus:outline-none' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <span className='p-2 cursor-pointer' onClick={() => setAllocationHintsVisibility(!allocationHintsVisibility)} >
                      <img className='w-3 lg:w-auto' src={DropdownIcon} alt="" />
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <AnimatePresence>
                    {allocationHintsVisibility && (
                      <motion.div ref={allocationDropdownRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.50, ease: "easeInOut" }}
                        className='absolute top-full z-10 mt-2 bg-background6 rounded-md shadow-[0px_0px_6px_0px_#28236633] w-[259px]'>
                        <div className='px-3 lg:px-[18px] py-1 pb-[14px] overscroll-auto'>
                          {staticLevelDefaultValue.length > 0 ? (staticLevelDefaultValue.map((key, index) => (
                            <div key={index} className="flex justify-between items-center cursor-pointer border-b border-borderColor py-1 lg:py-[6px]" onClick={() => handleClick(key)}>
                              <span className={`text-sm lg:text-base text-Primary font-medium text-wrap flex-1 px-2 py-[4px] rounded-md hover:text-white hover:bg-borderColor4 ${originalSize === key.buyingPower ? "text-white bg-borderColor4" : ""}`}>
                                $ {Number(key.buyingPower).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))) : (
                            <p className='text-sm lg:text-base text-Secondary2 font-medium mt-2'>No data available</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <label className='block text-sm lg:text-base text-Primary lg:font-medium mt-3 min-[530px]:mt-5'>Trade Price:</label>
              <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                <span>$</span>
                <input type='text' inputMode='numeric' maxLength={4} title='Max Length 4' value={tradePrice || appContext.shortTradePrice} onChange={handleTradePriceChange} className='bg-transparent w-full focus:outline-none' />
                <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                  <button className='active:scale-90 transition-transform duration-250' onClick={decreaseTradePrice} >
                    <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                  </button>
                  <div className='border-r border-borderColor6 h-[26px]'></div>
                  <button onClick={increaseTradePrice} className='w-[22px] active:scale-90 transition-transform duration-250'>
                    <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                  </button>
                </div>
              </div>
            </div>
            <div className='Levels w-full'>
              <label className='block text-sm lg:text-base text-Primary lg:font-medium'> Commission per Contract:
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                  <span>$</span>
                  <input type="text" inputMode='numeric' maxLength={5} title='Up to 2 digits before and 2 digits after the decimal point' value={commission} onChange={(e) => { const value = e.target.value; if (/^\d{0,2}(\.\d{0,2})?$/.test(value)) { setCommission(value); } }} className='bg-transparent w-full focus:outline-none' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <button className='active:scale-90 transition-transform duration-250' onClick={() => setCommission((prev) => (parseFloat(prev) > MINIMUM_VALUE ? (parseFloat(prev) - 0.5).toFixed(2) : MINIMUM_VALUE.toFixed(2)))}>
                      <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                    </button>
                    <div className='border-r border-borderColor6 h-[26px]'></div>
                    <button className='w-[22px] active:scale-90 transition-transform duration-250' onClick={() => setCommission((prev) => (parseFloat(prev) < MAXIMUM_VALUE ? (parseFloat(prev) + 0.5).toFixed(2) : MAXIMUM_VALUE.toFixed(2)))}>
                      <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                    </button>
                  </div>
                </div>
              </label>
              <label className='block text-sm lg:text-base text-Primary lg:font-medium mt-3 min-[530px]:mt-5'> Loss:
                <input type="text" inputMode='numeric' value={loss ? `$-${Number(loss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''} readOnly className='focus:outline-none border border-borderColor2 bg-textBoxBg text-sm lg:text-base py-2 lg:py-[11px] px-2 lg:px-4 rounded-md w-full mt-1 lg:mt-2 text-red-500' />
              </label>
            </div>
          </div>

          <div className='flex flex-wrap items-end gap-1 lg:gap-5'>
            <div>
              <p className='text-sm lg:text-base text-Primary lg:font-medium mt-4'>Current Allocation Size: <span className='px-1'>${Number(currentAllocation).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
              {(appContext.currency === "CAD" || appContext.currency === "AUD") && (<p className='text-sm lg:text-base text-Primary lg:font-semibold mt-1'>Current Allocation Size ({appContext.currency}):
                <span className='px-1'>
                  {appContext.currency === "CAD" &&
                    `$${Number(currentAllocation * appContext.cadRate).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  }
                  {appContext.currency === "AUD" &&
                    `$${Number(currentAllocation * appContext.audRate).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  }
                </span>
              </p>)}
            </div>
            {appContext.currency === "CAD" && (
              <label className='flex justify-between gap-2 items-center text-sm lg:text-base text-Primary lg:font-medium sm:border-l sm:pl-3 lg:pl-5 border-borderColor4'>
                <span>Live Rate {appContext.cadLiveRate || 1.40}</span>
              </label>
            )}
            {appContext.currency === "AUD" && (
              <label className='flex justify-between gap-2 items-center text-sm lg:text-base text-Primary lg:font-medium sm:border-l sm:pl-3 lg:pl-5 border-borderColor4'>
                <span>Live Rate {appContext.audLiveRate || 1.56}</span>
              </label>
            )}
          </div>
        </div>
        {(msgM4.msg !== "") && <p className={`text-sm ${msgM4.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM4.msg}.</p>}

        <div className={`fixed bottom-[5%] lg:bottom-auto lg:top-[30%] right-5 z-20 flex items-center gap-3 lg:gap-4 text-sm lg:text-base font-medium text-white bg-ButtonBg rounded-t-lg py-3 lg:py-2 px-4 lg:px-7 cursor-pointer -rotate-90 origin-right ${isClicked ? "shadow-[inset_2px_2px_5px_0_#104566]" : "shadow-[inset_-2px_-2px_5px_0_#104566]"}`} onClick={handleSaveMatrix} >
          <img className='h-4 lg:h-[18px] rotate-90' src={SavedMatrixIcon} alt="" /> <span className="hidden lg:inline">Save Matrix</span>
        </div>

        {showMessage && (
          <div className="fixed right-0 bottom-0 p-3 lg:p-5 z-20">
            <div className="relative p-3 lg:p-5 bg-background6 rounded-[22px] border border-borderColor5 shadow-[0px_0px_6px_0px_#28236633] w-[300px] lg:w-[300px]">
              <img className="absolute top-2 right-2 cursor-pointer w-7" onClick={() => setShowMessage(false)} src={PopupCloseIcon} alt="" />
              <div className="flex justify-center">
                <div className="mx-auto p-2 lg:p-4 border border-borderColor rounded-md bg-background3">
                  <img className="w-10" src={SubscriptionUpdateIcon} alt="Update Icon" />
                </div>
              </div>
              <p className={`text-sm lg:text-lg mx-auto mt-5 text-center ${msgM3.type === "error" ? "text-[#D82525]" : "text-Primary"}`}>{msgM3.msg} </p>
            </div>
          </div>
        )}

        <div className='rounded-md p-5 mt-5 lg:mt-10 shadow-[0px_0px_8px_0px_#28236633] Levels bg-background6'>
          <div className='flex gap-3 lg:gap-5 text-sm lg:text-base text-Primary lg:font-medium mb-5'>
            <button type="button" className={`focus:outline-none border border-borderColor text-sm lg:text-base shadow-md py-[7px] lg:py-[10px] px-[18px] rounded-md hover:text-white hover:bg-ButtonBg active:shadow-[inset_2px_2px_5px_0_#104566]`} onClick={Regular} >Regular</button>
            <button type="button" disabled={(stackOrShiftFlag === "shift" ? true : false)} title={(stackOrShiftFlag === "shift" && "Only one operation can we do stack or shift")} className={`focus:outline-none border border-borderColor text-sm lg:text-base py-[7px] lg:py-[10px] px-[18px] rounded-md ${stackOrShiftFlag === "shift" ? "bg-[#D8D8D8] text-[#FFFFFF]" : ""} ${stackOrShiftFlag === "stack" ? "bg-[#2c7bace7] text-[#FFFFFF] shadow-[inset_2px_2px_5px_0_#104566]" : ""}`} onClick={StackMatrix}>Stack</button>
            <button type="button" disabled={(stackOrShiftFlag === "stack" ? true : false)} title={(stackOrShiftFlag === "stack" && "Only one operation can we do stack or shift")} className={`focus:outline-none border border-borderColor text-sm lg:text-base py-[7px] lg:py-[10px] px-[18px] rounded-md ${stackOrShiftFlag === "stack" ? "bg-[#D8D8D8] text-[#FFFFFF]" : ""} ${stackOrShiftFlag === "shift" ? "bg-[#2c7bace7] text-[#FFFFFF] shadow-[inset_2px_2px_5px_0_#104566]" : ""}`} onClick={ShiftMatrix}>Shift</button>
          </div>
          {(msgM2.msg !== "") && <p className={`text-sm ${msgM2.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM2.msg}.</p>}
          {errorMessage && (<p className="text-[#D82525] text-sm mb-2">{errorMessage}</p>)}

          <h3 className='text-xl lg:text-[22px] xl:text-2xl font-semibold text-Primary mb-2'>Levels</h3>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-5'>

            {Array.from({ length: visibleLevels },
              (_, index) => {
                const levelKey = `level${index + 1}`;
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
                        inputMode='numeric'
                        maxLength={5}
                        title='Max Length 5'
                        value={levelValue > 0 ? levelValue : 0}
                        onChange={(e) => handleInputChange(levelKey, e.target.value)}
                        disabled={!isChecked}
                        className='bg-transparent max-w-[230px] w-full focus:outline-none'
                      />
                      <div className='flex gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                        <button className='active:scale-90 transition-transform duration-250' onClick={() => handleDecrement(levelKey)} disabled={!isChecked} >
                          <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                        </button>
                        <div className='border-r border-borderColor6 h-[26px]'></div>
                        <button onClick={() => handleIncrement(levelKey)} disabled={!isChecked}
                          className='w-[22px] active:scale-90 transition-transform duration-250' >
                          <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}

          </div>
          {Object.keys(levels).length > 5 && <div className="mt-4 text-center">
            <button onClick={() => setShowAll(!showAll)} className="text-sm lg:text-base text-Secondary2 font-medium underline">
              {showAll ? 'See Less Levels' : 'See More Levels'}
            </button>
          </div>}
        </div>

        <div className='flex justify-between items-center mt-5 lg:mt-10 lg:max-w-[830px] min-[1150px]:max-w-[975px] xl:max-w-[1110px] min-[1380px]:max-w-[1220px] min-[1450px]:max-w-[1070px] max-[1600px]:max-w-[1000px] min-[1601px]:max-w-full w-full'>
          <h2 className='text-xl lg:text-[22px] xl:text-2xl text-Primary font-semibold'> Static Matrix - Long IC </h2>
          <p className={`text-sm lg:text-base font-medium text-white flex items-center gap-[10px] bg-background2 py-2 px-5 rounded-md cursor-pointer ${isFilterModalVisible ? "shadow-[inset_2px_2px_5px_0_#104566]" : "shadow-[inset_-2px_-2px_5px_0_#104566]"}`} onClick={() => setIsFilterModalVisible(!isFilterModalVisible)}>
            <img className='w-4 lg:w-auto' src={FilterIcon} alt="Filter icon" /> Filter
          </p>
        </div>

        <div ref={filterModalRef} className="flex justify-end">
          <FilterModalLong
            isVisible={isFilterModalVisible}
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
                {showCredit && <th className="border-x border-borderColor px-2 py-2">Debit</th>}
                {showCommission && <th className="border-x border-borderColor px-2 py-2">Commission</th>}
                {showBP && <th className="border-x border-borderColor px-2 py-2">BP</th>}
                {showProfit && <th className="border-x border-borderColor px-2 py-2">Profit</th>}
                {showLoss && <th className="border-x border-borderColor px-2 py-2">Loss</th>}
                {showCumulativeLoss && <th className="border-x border-borderColor px-2 py-2">Cumulative Loss {(appContext.currency === "CAD" || appContext.currency === "AUD") && <span className='block'>({appContext.currency})</span>}</th>}
                {showSeriesGainLoss && <th className="border-x border-borderColor px-2 py-2">Series Gain/Loss {(appContext.currency === "CAD" || appContext.currency === "AUD") && <span className='block'>({appContext.currency})</span>}</th>}
                {showAfterWin && <th className="border-x border-borderColor px-2 py-2">After Win</th>}
                {showGainPercentage && <th className="border-x border-borderColor px-2 py-2">Gain</th>}
                {showAfterLoss && <th className="border-x border-borderColor px-2 py-2">After Loss</th>}
                {showLossPercentage && <th className="px-2 py-2">Loss</th>}
              </tr>
            </thead>
            <tbody>
              {/* {Object.keys(levels).filter(levelKey => levels[levelKey]?.active).slice(0, showAllRows ? levels.length : 5).map((level, index) => { */}
              {Object.keys(levels).slice(0, 15).map((level, index) => {
                if (levels[level].active) {
                  return (
                    <tr key={index} className="text-sm lg:text-base text-center text-Secondary bg-background6">
                      <td className="border-t border-borderColor px-2 py-2">{level}</td>
                      {showContracts && <td className="border-t border-x border-borderColor px-2 py-2">{ContractsTable[index]}</td>}
                      {showCredit && <td className="border-t border-x border-borderColor px-2 py-2">${Number(CreditTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                      {showCommission && <td className="border-t border-x border-borderColor px-2 py-2">${Number(CommissionTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                      {showBP && <td className="border-t border-x border-borderColor px-2 py-2">${Number(BPTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                      {showProfit && <td className="border-t border-x border-borderColor px-2 py-2">${Number(ProfitTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                      {showLoss && <td className="border-t border-x border-borderColor px-2 py-2 text-red-500">${Number(LossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                      {showCumulativeLoss && <td className="border-t border-x border-borderColor px-2 py-2 text-red-500">${Number(CumulativeLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {(appContext.currency === "CAD" || appContext.currency === "AUD") && (
                          <span className="block font-medium">
                            ({`${appContext.currency === "CAD" ? '$' : '$'}${(CumulativeLossTable[index] * (appContext.currency === "CAD" ? appContext.cadRate : appContext.audRate)).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}`})
                          </span>
                        )}
                      </td>}
                      {showSeriesGainLoss && <td className={`border-t border-x border-borderColor px-2 py-2 ${SeriesGainLossTable[index] < 0 ? 'text-red-500' : ''} `}>${Number(SeriesGainLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {(appContext.currency === "CAD" || appContext.currency === "AUD") && (
                          <span className="block font-medium">
                            ({`${appContext.currency === "CAD" ? '$' : '$'}${(SeriesGainLossTable[index] * (appContext.currency === "CAD" ? appContext.cadRate : appContext.audRate)).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}`})
                          </span>
                        )}
                      </td>}
                      {showAfterWin && <td className="border-t border-x border-borderColor px-2 py-2">${Number(AfterWinTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                      {showGainPercentage && <td className={`border-t border-x border-borderColor px-2 py-2 ${GainPreTable[index] < 0 ? 'text-red-500' : ''} `}>{GainPreTable[index]}%</td>}
                      {showAfterLoss && <td className={`border-t border-x border-borderColor px-2 py-2 ${AfterLossTable[index] < 0 ? 'text-red-500' : ''} `}> ${Number(AfterLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                      {showLossPercentage && <td className="border-t border-borderColor px-2 py-2 text-red-500">{LossPreTable[index]}%</td>}
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
          {LevelTable.length === 0 &&
            <div className="mt-4 text-center">
              <p className="text-base text-Secondary2 font-medium">
                if any one of level selected and still calculation is not shown, Please click on Regular button
              </p>
            </div>
          }
        </div>

        {/* {Object.values(levels).filter(level => level.active).length > 5 && <div className="mt-4 text-center">
          <button onClick={toggleShowMore} className="text-sm lg:text-base text-Secondary2 font-medium underline">
            {showAllRows ? 'See Less Levels' : 'See More Levels'}
          </button>
        </div>} */}

        <Button className={`flex items-center gap-2 lg:gap-[17px] h-[38px] lg:h-[55px] mt-5 lg:mt-10 mx-auto ${isClicked ? "shadow-[inset_2px_2px_5px_0_#104566]" : "shadow-[inset_-2px_-2px_5px_0_#104566]"}`} onClick={handleSaveMatrix}>
          <img className='h-[18px]' src={SavedMatrixIcon} alt="" /> Save Matrix
        </Button>

        <div className='mb-5 text-center'>
          {(msgM3.msg !== "") && <p className={`text-sm ${msgM3.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM3.msg}.</p>}
        </div>
      </div>
      :
      <>
        {isMessageVisible ?
          <div className="flex justify-center items-center h-[100vh]">
            <div role="status">
              <svg aria-hidden="true" className="w-14 h-14 text-gray-200 animate-spin fill-Primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div> : <Link to={"/subscription"} className='text-lg text-Primary flex justify-center items-center h-3/4'>Please upgrade your plan...</Link>}
      </>
    }
  </>);
}

export default StaticMatrixLong;