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
import NextGamePlanDynamicLongMatrix from './NextGamePlanDynamicLongMatrix';
import { defaultDynamicTradePrice, defaultCommission, defaultAllocation, DefaultInDeCrement, ConfirmationModal, FilterModal } from '../../components/utils';

const DynamicMatrixShort = () => {

  const MINIMUM_VALUE = 0;
  const MAXIMUM_VALUE = 999;
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  const filterModalRef = useRef(null);
  const cumulativeLossRef = useRef([]);
  const [names, setNames] = useState({});
  let appContext = useContext(AppContext);
  const allocationDropdownRef = useRef(null);
  const [editKey, setEditKey] = useState(null);
  const [selectedValue, setSelectedValue] = useState(5);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const firstKey = Object.keys(appContext.namesDynamicShort)[0] || null;
  const [selectedName, setSelectedName] = useState(firstKey);
  const [originalSize, setOriginalSize] = useState(null);
  const [commission, setCommission] = useState(defaultCommission);
  const [allocation, setAllocation] = useState(defaultAllocation);
  const [currentAllocation, setCurrentAllocation] = useState(originalSize);
  // Table column value
  const [levels, setLevels] = useState([]);
  const [BPTable, setBPTable] = useState([]);
  const [StopTable, setStopTable] = useState([]);
  const [LossTable, setLossTable] = useState([]);
  const [LevelTable, setLevelTable] = useState([]);
  const [ProfitTable, setProfitTable] = useState([]);
  const [CreditTable, setCreditTable] = useState([]);
  const [LossPreTable, setLossPreTable] = useState([]);
  const [GainPreTable, setGainPreTable] = useState([]);
  const [AfterWinTable, setAfterWinTable] = useState([]);
  const [AfterLossTable, setAfterLossTable] = useState([]);
  const [ContractsTable, setContractsTable] = useState([]);
  const [CommissionTable, setCommissionTable] = useState([]);
  const [CumulativeLossTable, setCumulativeLossTable] = useState([]);
  const [SeriesGainLossTable, setSeriesGainLossTable] = useState([]);
  const [staticLevelDefaultValue, setStaticLevelDefaultValue] = useState([]);

  const [newName, setNewName] = useState('');
  const [showBP, setShowBP] = useState(true);
  const [editName, setEditName] = useState('');
  const [showLoss, setShowLoss] = useState(true);
  const [showStop, setShowStop] = useState(true);
  const [errorState, setErrorState] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [showCredit, setShowCredit] = useState(true);
  const [showProfit, setShowProfit] = useState(true);
  const [regularFlag, setRegularFlag] = useState(true);
  const [showAllRows, setShowAllRows] = useState(false);
  const [showAfterWin, setShowAfterWin] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [showAllRows2, setShowAllRows2] = useState(false);
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
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isFilterModalVisible2, setIsFilterModalVisible2] = useState(false);
  const [allocationHintsVisibility, setAllocationHintsVisibility] = useState(false);

  const [Credit, setCredit] = useState(true);
  const [BEGain1, setBEGain1] = useState(true);
  const [BEGain2, setBEGain2] = useState(true);
  const [BEGain3, setBEGain3] = useState(true);
  const [BEGain4, setBEGain4] = useState(true);
  const [BEGain5, setBEGain5] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [modalData, setModalData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [BEContract, setBEContract] = useState(true);
  const [msgM1, setMsgM1] = useState({ type: "", msg: "", });
  const [msgM2, setMsgM2] = useState({ type: "", msg: "", });
  const [msgM3, setMsgM3] = useState({ type: "", msg: "", });
  const [msgM4, setMsgM4] = useState({ type: "", msg: "", });
  const [dynamicKey, setDynamicKey] = useState(appContext.dynamicLongKey);
  const [dynamicNextGameKey, setDynamicNextGameKey] = useState(appContext.dynamicNextGameLongKey);

  // Determine how many rows to show
  const visibleRows = showAllRows ? LevelTable.length : 5

  // Table 6 level Visible Condition 
  const visibleLevels = showAll
    ? Math.max(appContext.shortMatrixLength, Object.keys(levels).length)
    : Math.min(5, Math.max(appContext.shortMatrixLength, Object.keys(levels).length));

  // Call API only if firstKey exists and API hasn't been called yet
  if (firstKey && !selectedName) {
    setSelectedName(firstKey);
    getSPXMatrixAPI(firstKey);
  }

  // Get Admin This Page Access For Admin Api 
  async function getDynamicKey() {
    setIsMessageVisible(true);
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_DYNAMIC_SHORT_KRY), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setDynamicKey(response.data.data);
        appContext.setAppContext((curr) => ({
          ...curr,
          dynamicLongKey: response.data.data,
        }));
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
    finally {
      setIsMessageVisible(false);
    }
  }

  // Get Admin This Page Access For Admin Api 
  async function getDynamicNextGameKey() {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_NEXT_GAME_SHORT_KRY), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setDynamicNextGameKey(response.data.data);
        appContext.setAppContext((curr) => ({
          ...curr,
          dynamicNextGameLongKey: response.data.data,
        }));
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Get Matrix List Api && Matrix List Section Api Call Section  
  async function getMatrixFromAPI() {
    let temp = {}
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_DYNAMIC_MATRIX_URL), { typeIc: "short", userId: getUserId() }, {
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
          namesDynamicShort: temp,
        }));
        setNames(temp);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Crate Matrix Name Api
  async function addMatrixAPI(name) {
    try {
      let formData = { matrixName: name, userId: getUserId(), typeIc: "short" }
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_CREATE_DYNAMIC_MATRIX_URL), formData, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201)
        await getMatrixFromAPI()
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Update Matrix Name Api
  async function updateMatrixAPI(editName, editIndex) {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_UPDATE_DYNAMIC_MATRIX_URL), { userId: getUserId(), dynamicMatrixId: editIndex, matrixName: editName }, {
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
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
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
          let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_DELETE_DYNAMIC_MATRIX_URL), { userId: getUserId(), dynamicMatrixId: key }, {
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
            setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
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
          setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
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
      await getMatrixFromAPI()
      setEditIndex(null);
      setEditName('');
    }
  };

  // Get Original Account Size Api
  async function fetchAllocationLevelValuesFromAPI() {
    try {
      let response = await axios.post(process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_LEVEL_VALUE_URL, { userId: getUserId(), spread: selectedValue, matrixType: "DynamicShort" }, {
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
          buyingPowerDynamicShort: formattedData.map((item) => item.buyingPower),
        }));

        setOriginalSize(response.data.data[2].buyingPower);
        await getSingleLevelAPI(response.data.data[2]._id);
        if (!localStorage.getItem('originalSizeIdDyShort')) {
          localStorage.setItem('originalSizeIdDyShort', response.data.data[2]._id);
        }
      } else {
        setStaticLevelDefaultValue([]); // Handle invalid response
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
      setStaticLevelDefaultValue([]); // Reset to empty array on error
    }
  }

  async function fetchAllocationLevelValuesFromAPI2() {
    try {
      let response = await axios.post(process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_LEVEL_VALUE_URL, { userId: getUserId(), spread: selectedValue, matrixType: "DynamicShort" }, {
        headers: {
          'x-access-token': getToken(),
        },
      });

      if (response.status === 200 && Array.isArray(response.data.data)) {
        const formattedData = response.data.data.map(({ buyingPower, _id }) => ({ buyingPower, _id }));
        setStaticLevelDefaultValue(formattedData);
        appContext.setAppContext((prev) => ({
          ...prev,
          buyingPowerDynamicShort: formattedData.map((item) => item.buyingPower),
        }));
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Get Single level
  async function getSingleLevelAPI(levelId) {
    if (!levelId) {
      return;
    }
    try {
      const response = await axios.post((process.env.REACT_APP_LEVELS_URL + process.env.REACT_APP_GET_SINGL_LEVEL_VALUE_URL), { userId: getUserId(), levelId }, {
        headers: {
          'x-access-token': getToken()
        },
      });

      if (response.status === 200 && response.data.status === 1) {
        const levelData = response.data.data;
        const levelsOnly = Object.keys(levelData)
          .filter((key) => key.startsWith('level'))
          .reduce((obj, key, index) => {
            const rawValue = Number(levelData[key]) || 0;
            const value = rawValue < 0 ? 0 : rawValue;
            const isActive = value > 0 && index === 2;

            obj[key] = {
              value: value,
              active: isActive,
              premium: 0,
              stopLevel: 0,
              fullIcClose: false,
              oneSideClose: false,
              outSide: false,
              levelSpread: selectedValue,
            };
            return obj;
          }, {});

        setLevels(levelsOnly);
      }
      return null;
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Get Single Static Matrix
  async function getSPXMatrixAPI(key) {
    if (!key) {
      return;
    }
    try {
      const response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_SINGAL_DYNAMIC_MATRIX_LIST_URL), { userId: getUserId(), dynamicMatrixId: key }, {
        headers: {
          'x-access-token': getToken()
        },
      });
      if (response.status === 200) {
        setSelectedValue(response.data.data.spread ?? 5);
        setAllocation(response.data.data.allocation ?? defaultAllocation);
        setCommission(response.data.data.commission ?? defaultCommission);
        setOriginalSize(response.data.data.originalSize ?? 11800);
        const savedLevelsObject = response.data.data.levels.reduce((obj, level) => {
          obj[level.level] = {
            value: level.value || 0,
            active: level.active ?? false,
            premium: level.premium ?? 0,
            stopLevel: level.stopLevel ?? 0,
            fullIcClose: level.fullIcClose ?? false,
            oneSideClose: level.oneSideClose ?? false,
            outSide: level.outSide ?? false,
            levelSpread: level.levelSpread ?? selectedValue,
          };
          return obj;
        }, {});

        if (Object.keys(savedLevelsObject).length > 0) {
          setLevels(savedLevelsObject);
          setIsMatrixSaved(true);
          setShowContracts(response.data.data.tableVisibility.showContracts ?? true);
          setShowCredit(response.data.data.tableVisibility.showCredit ?? true);
          setShowCommission(response.data.data.tableVisibility.showCommission ?? true);
          setShowStop(response.data.data.tableVisibility.showStop ?? true);
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
        console.log("No saved matrix found, using default values.");
        setIsMatrixSaved(false);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
      return false
    }
  }

  // Matrix Save Data Api
  const handleSaveMatrix = async () => {
    if (!selectedName) {
      setMsgM4({ type: "error", msg: "Please select one of matrix from dropdown" });
      return;
    }
    const arrayDataWithKeys = Object.entries(levels).map(([level, value]) => ({
      level,
      value: Number(value.value),
      active: value.active,
      premium: Number(value.premium) || 0,
      levelSpread: Number(value.levelSpread) || selectedValue,
      stopLevel: Number(value.stopLevel) || 0,
      fullIcClose: value.fullIcClose || false,
      oneSideClose: value.oneSideClose || false,
      outSide: value.outSide || false
    }));

    const LevelData = {
      dynamicMatrixId: selectedName,
      allocation: Number(allocation).toFixed(0),
      originalSize: Number(originalSize).toFixed(2),
      commission: Number(commission).toFixed(2),
      flag: "regular",
      spread: selectedValue,
      levels: arrayDataWithKeys,
      tableVisibility: {
        showContracts,
        showCredit,
        showCommission,
        showStop,
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
      const response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_UPDATE_DYNAMIC_MATRIX_DATA_URL), { userId: getUserId(), ...LevelData }, {
        headers: {
          'x-access-token': getToken()
        }
      });
      if (response.status === 201) {
        setMsgM4({ type: "info", msg: "Matrix saved successfully" });
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM3({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  };

  useMemo(() => {
    setCurrentAllocation((Number(originalSize) * (allocation / 100)).toFixed(2))
    setRegularFlag(false)
  }, [allocation, originalSize])

  useMemo(() => {
    if (dynamicKey) {
      getMatrixFromAPI();
      fetchAllocationLevelValuesFromAPI2();
      getSPXMatrixAPI(selectedName);
    }
  }, [isMatrixSaved, selectedName, dynamicKey])

  // Regular Matrix calculation
  function Regular() {
    setStackOrShiftFlag(true);

    const savedId = localStorage.getItem('originalSizeIdDyShort');

    if (!staticLevelDefaultValue || !savedId) return;

    const matched = staticLevelDefaultValue.find(item => item._id === savedId);

    if (matched && matched.buyingPower === originalSize) {
      getSingleLevelAPI(savedId);
    }
  }

  // Stack Matrix calculation
  function StackMatrix(_) {
    let temp = { ...levels }
    let preVal = 0
    for (const [key, value] of Object.entries(temp)) {
      if (preVal !== 0) {
        value.value += preVal;
        break;
      } else {
        preVal = value.value;
        value.value = 0;
      }
    }
    setStackOrShiftFlag("stack")
    setLevels(temp)
  }

  // Shift Matrix calculation
  function ShiftMatrix() {
    let temp = { ...levels };
    let levelKeys = Object.keys(temp);
    let hasChecked = levelKeys.some(key => temp[key].active);
    let hasValues = levelKeys.some(key => temp[key].value > 0);
    let onlyLastLevelHasValue =
      temp[levelKeys[levelKeys.length - 1]].value > 0 &&
      levelKeys.slice(0, -1).every(key => temp[key].value === 0);
    if (!hasChecked || !hasValues || onlyLastLevelHasValue) {
      setMsgM3({ type: "error", msg: "Shift can't be performed due to selection or value conditions." });
      return;
    }
    // Perform the shift operation
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

  // Rest Table 
  const ResetTable = () => {
    setShowContracts(true)
    setShowCredit(true)
    setShowStop(true)
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

  // Rest Table For Next Game Plan
  const NextResetTable = () => {
    setCredit(true);
    setBEGain1(true);
    setBEGain2(true);
    setBEGain3(true);
    setBEGain4(true);
    setBEGain5(true);
    setBEContract(true);
    setIsFilterModalVisible2(false);
  }

  // Rest All This Page Data
  function resetAllParams() {
    setOriginalSize(appContext.buyingPowerDynamicShort[2])
    setCommission(defaultCommission);
    setAllocation(defaultAllocation);
    setShowAll(false);
    setShowAllRows(false);
    setShowAllRows2(false);
    Regular();
    fetchAllocationLevelValuesFromAPI();
  }

  // Toggle the number of visible rows
  const toggleShowMore = () => {
    setShowAllRows(prevState => !prevState);
  };

  const toggleShowMore2 = () => {
    setShowAllRows2(prevState => !prevState);
  };

  const handleToggle = (toggleSetter) => {
    toggleSetter((prevState) => !prevState);
  };

  const handleCheckboxChange = (level) => {
    setLevels({
      ...levels,
      [level]: { ...levels[level], active: !levels[level].active }
    });
  };

  const handleIncrement = (level, field) => {
    const currentValue = Number(levels[level][field]);
    if (currentValue >= 9.99) {
      setMsgM3({ type: "error", msg: "Value must be less than or equal to 10" });
      setErrorState(prevState => ({ ...prevState, [level]: true }));
      setTimeout(() => {
        setMsgM3({ type: "", msg: "" });
        setErrorState(prevState => ({ ...prevState, [level]: false }));
      }, 3000);
      return;
    }
    setLevels({
      ...levels,
      [level]: { ...levels[level], [field]: (currentValue + DefaultInDeCrement).toFixed(2) }
    });
    setErrorState(prevState => ({ ...prevState, [level]: false }));
  };

  const handleLevelIncrement = (level, field) => {
    setLevels({
      ...levels,
      [level]: { ...levels[level], [field]: (Number(levels[level][field]) + 1) }
    });
  };

  const handleLevelDecrement = (level, field) => {
    setLevels({
      ...levels,
      [level]: {
        ...levels[level],
        [field]: Math.max(0, Number(levels[level][field]) - 1) // Ensure value doesn't go below 1
      }
    });
  };

  const handleDecrement = (level, field) => {
    setLevels({
      ...levels,
      [level]: {
        ...levels[level],
        [field]: Math.max(0, (Number(levels[level][field]) || 0) - DefaultInDeCrement).toFixed(2)
      }
    });
  };

  const handleInputChange = (level, value) => {
    if (isNaN(value) || (value || "").includes(".") || (value < 0)) {
      setMsgM3({ type: "error", msg: "Only positive number should allow" })
      return
    }
    setLevels({
      ...levels,
      [level]: { ...levels[level], value: Number(value) }
    });
  };

  const handleStopLevelChange = (level, value) => {
    setLevels({
      ...levels,
      [level]: { ...levels[level], stopLevel: value }
    });
  };

  // Handle change for Premium Level input
  const handlePremiumLevelChange = (level, value) => {
    const numericValue = Number(value);
    if (numericValue <= 10) {
      setLevels({
        ...levels,
        [level]: { ...levels[level], premium: value }
      });
      setMsgM3({ type: "", msg: "" });
      setTimeout(() => {
        setErrorState(prevState => ({ ...prevState, [level]: false }));
        setMsgM3({ type: "", msg: "" });
      }, 3000);
    } else {
      setMsgM3({ type: "error", msg: "Value must be less than or equal to 10" });
      setErrorState(prevState => ({ ...prevState, [level]: true }));
    }
  };

  const handleCheckboxStateChange = (level, checkbox) => {
    if (!levels[level][checkbox]) {
      setLevels({
        ...levels,
        [level]: { ...levels[level], "fullICClose": false, "oneSideClose": false, "outSide": false, [checkbox]: !levels[level][checkbox] }
      });
    } else
      setLevels({
        ...levels,
        [level]: { ...levels[level], [checkbox]: !levels[level][checkbox] }
      });
  };

  /// Matrix table calculations ///
  function sum(arr) {
    let s = 0
    arr.forEach(element => {
      s += Number(element)
    });
    return s
  }

  function initValueSetup() {
    let levelTableData = [];
    let contractsTableData = [];
    let creditTableData = [];

    Object.keys(levels).forEach((level, index) => {
      if (levels[level].active) {
        levelTableData.push("Level " + (index + 1));
        let t = levels[level].value;
        contractsTableData.push(t);
        creditTableData.push(Number(levels[level].premium || 0) * t * 100);  // Fixed `premium` key
      }
    });

    // Update state once after the loop
    setLevelTable(levelTableData);
    setContractsTable(contractsTableData);
    setCreditTable(creditTableData);
  }

  useEffect(() => {
    initValueSetup()
  }, [levels, commission])

  // To calculate Stop and commission
  useEffect(() => {
    let tempStopTable = [];
    let tempCommissionTable = [];

    Object.keys(levels).forEach((level) => {
      if (levels[level].active) {
        let t = levels[level];

        // Ensure values are numbers
        let stopLevel = Number(t.stopLevel) || 0; // Corrected property name
        let levelValue = Number(t.value) || 0;
        let commissionValue = Number(commission) || 0;

        // Stop value calculation
        let temp = 0;
        if (stopLevel > 0 && (t.fullIcClose || t.oneSideClose)) {
          temp = (stopLevel * levelValue * 100).toFixed(2);
        }
        tempStopTable.push(Number(temp)); // Push to temp array

        // Commission Calculation
        let temp1 = 0;
        if (t.fullIcClose && stopLevel > 0) {
          temp1 = (commissionValue * levelValue * 2).toFixed(2);
        } else if (t.oneSideClose && stopLevel > 0) {
          temp1 = ((commissionValue / 2 + commissionValue) * levelValue).toFixed(2);
        } else {
          temp1 = (commissionValue * levelValue).toFixed(2);
        }
        tempCommissionTable.push(Number(temp1)); // Push to temp array
      }
    });

    // Update state only once
    setStopTable(tempStopTable);
    setCommissionTable(tempCommissionTable);
  }, [levels, commission]);

  useEffect(() => {
    let indx = 0;
    setBPTable([])
    setProfitTable([])
    Object.keys(levels).map((level, index) => {
      if (levels[level].active) {
        let t = levels[level]
        // BP Calculation
        let temp2 = ((selectedValue * 100) * t.value) - CreditTable[indx] + CommissionTable[indx]
        setBPTable((pre) => {
          return [...pre, (temp2)]
        })

        // profit calculation
        let temp3 = 0
        if (!t.outSide)
          temp3 = Math.max(0, (CreditTable[indx] - Number(StopTable[indx]) - CommissionTable[indx]))
        setProfitTable((pre) => {
          return [...pre, (temp3)]
        })
        indx += 1
      }
    })
  }, [levels, CommissionTable, currentAllocation, CreditTable, StopTable, selectedValue])

  // Loss calculation
  useEffect(() => {
    setLossTable([])
    let indx = 0;
    Object.keys(levels).map((level, _) => {
      if (levels[level].active) {
        let t = levels[level]
        let temp4 = 0
        if (t.outSide)
          temp4 = ((selectedValue * 100) * t.value) - CreditTable[indx] + CommissionTable[indx]
        else
          if (ProfitTable[indx] === 0 && (t.fullICClose || t.oneSideClose)) {
            temp4 = Math.abs(CreditTable[indx] - StopTable[indx] - CommissionTable[indx])
          }
        // temp4 = Math.abs(CreditTable[indx] - StopTable[indx] - CommissionTable[indx])
        setLossTable((pre) => {
          return [...pre, (-temp4)]
        })
        indx += 1
      }
    })
  }, [levels, StopTable, CreditTable, CommissionTable, ProfitTable, selectedValue])

  // To calculate Cumulative Loss
  useEffect(() => {
    let indx = 0;
    setCumulativeLossTable([]);  // Clear previous cumulative loss table

    Object.keys(levels).forEach((level, index) => {
      if (levels[level].active) {
        let currentLoss = LossTable[indx] || 0;
        let previousSeriesGainLoss = SeriesGainLossTable[indx - 1] || 0;
        let previousCumulativeLoss = CumulativeLossTable[indx - 1] || 0;
        let cumulativeLoss = 0;

        // Apply the conditions based on previous series gain/loss
        if (previousSeriesGainLoss > 0) {
          cumulativeLoss = currentLoss;  // Case 1: Previous gain/loss > 0
        } else if (previousSeriesGainLoss === 0) {
          cumulativeLoss = currentLoss + previousCumulativeLoss;  // Case 2: Previous gain/loss == 0
        } else if (previousSeriesGainLoss < 0) {
          cumulativeLoss = previousSeriesGainLoss + currentLoss;  // Case 3: Previous gain/loss < 0
        }

        // Update the cumulative loss table
        setCumulativeLossTable((prev) => [...prev, cumulativeLoss]);

        indx += 1;  // Increment for active levels
      }
    });
  }, [LossTable, SeriesGainLossTable, levels]);

  // To calculate Series Gain/Loss
  useEffect(() => {
    let indx = 0;
    setSeriesGainLossTable([]);  // Reset the table at the start

    Object.keys(levels).forEach((level, index) => {
      if (levels[level].active) {
        let seriesGainLossData = 0;

        // Get current profit and loss
        let currentProfit = ProfitTable[indx] || 0;
        let currentLoss = LossTable[indx] || 0;

        // Get previous gain/loss value, default to 0 if none
        let previousSeriesGain = SeriesGainLossTable[indx - 1] || 0;

        // For the first index, just add profit or loss
        if (indx === 0) {
          seriesGainLossData = currentProfit > 0 ? currentProfit : currentLoss;
        } else {
          // Add profit/loss to the previous series gain/loss
          seriesGainLossData = (currentProfit > 0 ? currentProfit : currentLoss) + previousSeriesGain;
        }

        // Ensure the sign handling for values less than 0
        if (seriesGainLossData < 0) {
          seriesGainLossData = seriesGainLossData;  // Keep as negative if already negative
        } else {
          seriesGainLossData = seriesGainLossData;  // Keep as positive if positive
        }

        // Update the state
        setSeriesGainLossTable((prev) => [...prev, seriesGainLossData]);
        indx += 1;  // Increment only for active levels
      }
    });
  }, [ProfitTable, LossTable]);

  useEffect(() => {
    const areArraysEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((value, index) => value === arr2[index]);
    };

    // Only run if table has changed
    const hasChanged =
      CumulativeLossTable?.length > 0 &&
      !areArraysEqual(cumulativeLossRef.current, CumulativeLossTable);

    if (hasChanged) {
      cumulativeLossRef.current = [...CumulativeLossTable]; // update ref
      initValueSetup(); // run setup
    }
  }, [CumulativeLossTable]);

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

  useMemo(() => {
    calculateDependentValue()
  }, [currentAllocation, SeriesGainLossTable, CumulativeLossTable])
  // end matrix calculations

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterModalRef.current && !filterModalRef.current.contains(event.target)) {
        setIsFilterModalVisible(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
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
  }, [isMenuVisible]); // If any state is relevant, include it here, otherwise use []

  useMemo(() => {
    getDynamicKey();
    getDynamicNextGameKey();
  }, [])

  useMemo(() => {
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
    const storedMatrix = sessionStorage.getItem('dyShortMatrix');
    if (storedMatrix) {
      setSelectedName(JSON.parse(storedMatrix));
    }
  }, []);

  useEffect(() => {
    if (selectedName) {
      sessionStorage.setItem('dyShortMatrix', JSON.stringify(selectedName));
    }

    if (selectedValue && dynamicKey) {
      fetchAllocationLevelValuesFromAPI2();
    }
  }, [selectedName, selectedValue, dynamicKey]);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
    setNewName("")
  };

  const handleNameClick = (key) => {
    setSelectedName(key);
    setDropdownVisible(false);
    sessionStorage.setItem('dyShortMatrix', JSON.stringify(key));
    getSPXMatrixAPI(key);
  };

  const handleNewNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 25) {
      setMsgM1({
        type: "error",
        msg: "Length should be less than 25",
      });
      return;
    }
    setNewName(value);
  };

  const handleOriginalSizeChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) || value < 0) {
      setMsgM2({ type: "error", msg: "Only positive numbers are allowed" });
      return;
    }
    setOriginalSize(value);
  };

  const handleCommissionChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,2}(\.\d{0,2})?$/.test(value)) {
      setCommission(value);
    }
  };

  const handleDecrementCommission = () => {
    setCommission((prev) =>
      parseFloat(prev) > MINIMUM_VALUE
        ? (parseFloat(prev) - 0.5).toFixed(2)
        : MINIMUM_VALUE.toFixed(2)
    );
  };

  const handleIncrementCommission = () => {
    setCommission((prev) =>
      parseFloat(prev) < MAXIMUM_VALUE
        ? (parseFloat(prev) + 0.5).toFixed(2)
        : MAXIMUM_VALUE.toFixed(2)
    );
  };

  // Function to handle dropdown change for each level
  const handleDropdownChange = (levelKey, value) => {
    setLevels((prevLevels) => ({
      ...prevLevels,
      [levelKey]: {
        ...prevLevels[levelKey],
        levelSpread: value,
      },
    }));
  };

  // Handle Spread Dropdown
  const handleChange = (event) => {
    const newValue = event.target.value;
    appContext.setAppContext((prev) => ({
      ...prev,
      buyingPowerStatic: [],
    }));
    setSelectedValue(newValue);
  };


  return (
    <>
      {dynamicKey ?
        <div className='px-3 lg:pl-10 lg:px-6'>

          <div className='grid min-[470px]:flex flex-wrap items-center gap-5 order-2 lg:order-1'>
            <div className='flex items-center gap-5'>
              <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'> Dynamic Matrix </h2>
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
              <ConfirmationModal show={showModal} onClose={() => setShowModal(false)} onConfirm={modalData.onConfirm} title={modalData.title} icon={modalData.icon} message={modalData.message} />

              <div className='relative'>
                <p onClick={toggleDropdown} className='flex items-center gap-[10px] text-sm lg:text-base bg-background6 font-medium text-Primary shadow-[0px_0px_6px_0px_#28236633] rounded-[6px] px-4 py-2 cursor-pointer' >
                  <img src={MatrixIcon} className='h-5 w-5' alt="" /> {names[selectedName]} <img className='w-3' src={DropdownIcon} alt="" />
                </p>
                {isDropdownVisible && (
                  <div ref={dropdownRef} className='absolute z-10 left-0 min-[470px]:left-auto right-0 top-full mt-2 border border-borderColor5 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-max'>
                    <div className='px-3 py-1 pb-[14px]'>
                      {editIndex === null ? (
                        <>
                          {Object.keys(names).map((key, index) => (
                            <div key={index} className='flex justify-between items-center gap-2 cursor-pointer border-b border-borderColor py-2 lg:py-[10px]' onClick={() => handleNameClick(key)}>
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
                  </div>
                )}
              </div>
            </div>
            {(msgM1.msg !== "") && <p className={`text-sm ${msgM1.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM1.msg}.</p>}
          </div>

          <CapitalAllocationRangSlider allocation={allocation} setAllocation={setAllocation} />
          {(msgM2.msg !== "") && <p className={`text-sm ${msgM2.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM2.msg}.</p>}

          <div className='rounded-[6px] max-w-[792px] bg-background6 px-3 py-[16px] lg:p-5 mt-5 lg:mt-10 shadow-[0px_0px_8px_0px_#28236633] Size'>
            <div className='flex flex-wrap items-end min-[455px]:flex-nowrap gap-3 lg:gap-5'>
              <div className='w-full' ref={containerRef}>
                <div className='flex justify-between items-end gap-2'>
                  <label className='block text-sm lg:text-base text-Primary lg:font-medium'>Original Account Size:</label>
                  <div className="flex items-center px-2 w-full max-w-[90px] sm:max-w-[90px] lg:max-w-[95px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7">
                    <span className='text-xs lg:text-sm text-Primary'>Wide:</span>
                    <select id="dropdown" value={selectedValue} onChange={handleChange} className="text-xs lg:text-sm text-Primary px-1 py-[2px] rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7 cursor-pointer">
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
                <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 p-[7px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-[6px]'>
                  <span>$</span>
                  <input type='text' maxLength={10} title='Max Length 10' value={originalSize} onChange={handleOriginalSizeChange} className='bg-transparent  w-full focus:outline-none' />
                  <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                    <span className='p-2' onClick={() => setAllocationHintsVisibility(!allocationHintsVisibility)} >
                      <img className='w-3 lg:w-auto' src={DropdownIcon} alt="" />
                    </span>
                  </div>
                </div>
                <div className='relative'>
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
                                localStorage.setItem('originalSizeIdDyShort', key._id);
                              }}>
                              <span className="text-sm lg:text-base text-Primary font-medium text-wrap flex-1 ml-2">
                                $ {Number(key.buyingPower).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className='text-sm lg:text-base text-Secondary2 font-medium'>No data available</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className='Levels w-full'>
                <label className='block text-sm lg:text-base text-Primary lg:font-medium'> Commission per Contract:
                  <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 py-1 px-[6px] lg:p-[10px] gap-[10px] border border-borderColor bg-textBoxBg rounded-md'>
                    <span>$</span>
                    <input type="text" maxLength={5} title='Up to 2 digits before and 2 digits after the decimal point' value={commission} onChange={handleCommissionChange} className='bg-transparent w-full focus:outline-none' />
                    <div className='flex justify-end gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                      <button onClick={handleDecrementCommission}>
                        <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                      </button>
                      <div className='border-r border-borderColor6 h-[26px]'></div>
                      <button className='w-[22px]' onClick={handleIncrementCommission}>
                        <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                      </button>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <p className='text-sm lg:text-base text-Primary lg:font-medium mt-3 lg:mt-5'>Current Allocation Size: <span className='px-1'>${Number(currentAllocation).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
          </div>

          <div className='rounded-[6px] p-5 mt-5 lg:mt-10 shadow-[0px_0px_8px_0px_#28236633] Levels bg-background6'>
            <div className='flex flex-wrap justify-between items-start md:items-center gap-3 lg:gap-5 text-sm lg:text-base text-Primary lg:font-medium mb-5'>
              <div className='flex gap-3 lg:gap-5 text-sm lg:text-base text-Primary lg:font-medium'>
                <button type="button" className={`focus:outline-none border border-borderColor text-sm lg:text-base shadow-md py-[7px] lg:py-[10px] px-[18px] rounded-[6px]`} onClick={Regular}>Regular</button>
                <button type="button" disabled={(stackOrShiftFlag === "shift" ? true : false)} title={(stackOrShiftFlag === "shift" && "Only one operation can we do stack or shift")} className={`focus:outline-none border border-borderColor text-sm lg:text-base shadow-md py-[7px] lg:py-[10px] px-[18px] rounded-[6px] ${stackOrShiftFlag === "shift" ? "bg-[#D8D8D8] text-[#FFFFFF]" : ""} ${stackOrShiftFlag === "stack" ? "bg-[#2c7bace7] text-[#FFFFFF]" : ""}`} onClick={StackMatrix}>Stack</button>
                <button type="button" disabled={(stackOrShiftFlag === "stack" ? true : false)} title={(stackOrShiftFlag === "stack" && "Only one operation can we do stack or shift")} className={`focus:outline-none border border-borderColor text-sm lg:text-base shadow-md py-[7px] lg:py-[10px] px-[18px] rounded-[6px] ${stackOrShiftFlag === "stack" ? "bg-[#D8D8D8] text-[#FFFFFF]" : ""} ${stackOrShiftFlag === "shift" ? "bg-[#2c7bace7] text-[#FFFFFF]" : ""}`} onClick={ShiftMatrix}>Shift</button>
              </div>
              <div className='md:flex gap-3'>
                {(msgM4.msg !== "") && <p className={`hidden md:block text-sm text-center ${msgM4.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM4.msg}, <Link to="/subscription"></Link> </p>}
                <div className="flex items-center gap-2 text-sm lg:text-base font-medium text-white bg-ButtonBg rounded-md py-2 px-5 lg:py-[6px] lg:px-[30px] h-[37px] lg:h-[45px] cursor-pointer" onClick={handleSaveMatrix} >
                  <img className='h-4 lg:h-[18px]' src={SavedMatrixIcon} alt="" /> Save Matrix
                </div>
                {(msgM4.msg !== "") && <p className={`block md:hidden text-sm text-center ${msgM4.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM4.msg}, <Link to="/subscription"></Link> </p>}
              </div>
            </div>
            {(msgM3.msg !== "") && <p className={`text-sm ${msgM3.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM3.msg}.</p>}
            <h3 className='text-xl lg:text-[22px] xl:text-2xl font-semibold text-Primary mb-3'>Levels</h3>

            <div className='grid grid-cols-1 gap-5'>
              {Array.from({ length: visibleLevels }, (_, index) => {
                const levelKey = `level${index + 1}`;
                if (!levels[levelKey]) {
                  setLevels((prevLevels) => ({
                    ...prevLevels,
                    [levelKey]: {
                      value: 0,
                      active: false,
                      premium: 0,
                      stopLevel: 0,
                      fullICClose: false,
                      oneSideClose: false,
                      outSide: false,
                      levelSpread: selectedValue,
                    }
                  }));
                }
                const levelData = levels[levelKey] || {};

                return (
                  <div key={index} className='flex flex-wrap xl:flex-nowrap gap-2 lg:gap-5'>
                    <div className='flex items-end gap-3 lg:gap-5 w-full'>

                      {/* Level Input */}
                      <div className='max-w-[466px] w-full'>
                        <div className='flex flex-wrap-reverse justify-between gap-2'>
                          <div className='flex items-center gap-3 lg:gap-[15px]'>
                            <input
                              type='checkbox'
                              checked={levelData.active}
                              onChange={() => handleCheckboxChange(levelKey)}
                              className='accent-accentColor w-[15px] h-[19px] lg:w-[19px] cursor-pointer'
                            />
                            <label className='text-sm lg:text-base text-Primary font-medium'>
                              {`Level ${index + 1}`}
                            </label>
                          </div>
                          <div className="flex items-center px-2 w-full max-w-[95px] sm:max-w-[95px] lg:max-w-[95px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7">
                            <span className='text-xs text-Primary'>Wide:</span>
                            <select id={`dropdown-${levelKey}`} value={levelData.levelSpread || selectedValue} onChange={(e) => handleDropdownChange(levelKey, e.target.value)} disabled={!levelData.active} className="text-xs lg:text-sm text-Primary px-1 py-[2px] rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7 cursor-pointer">
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
                        <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-2 p-[6px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-[6px]'>
                          <input
                            type='text'
                            maxLength={5}
                            title='Max Length 5'
                            value={levelData.value > 0 ? levelData.value : 0}
                            onBlur={(e) => handleInputChange(levelKey, e.target.value === "" ? 0 : e.target.value)}
                            onChange={(e) => handleInputChange(levelKey, e.target.value)}
                            disabled={!levelData.active}
                            className='bg-transparent max-w-[230px] w-full focus:outline-none'
                          />
                          <div className='flex gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                            <button onClick={() => handleLevelDecrement(levelKey, 'value')} disabled={!levelData.active}>
                              <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                            </button>
                            <div className='border-r border-borderColor6 h-[26px]'></div>
                            <button onClick={() => handleLevelIncrement(levelKey, 'value')} disabled={!levelData.active} className='w-[22px]'>
                              <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Premium Level Input */}
                      <div className='max-w-[466px] w-full'>
                        <label className='text-sm lg:text-base text-Primary font-medium'>{`Premium ${index + 1}`}</label>
                        <div className={`Premium flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 p-[6px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-[6px] ${errorState[levelKey] ? 'bg-red-300' : ''}`}>
                          <input
                            type='text'
                            maxLength={5}
                            title='Max Length 5'
                            value={levelData.premium}
                            onChange={(e) => handlePremiumLevelChange(levelKey, e.target.value)}
                            onBlur={(e) => handlePremiumLevelChange(levelKey, e.target.value === "" ? defaultDynamicTradePrice : e.target.value)}
                            disabled={!levelData.active}
                            className='bg-transparent max-w-[230px] w-full focus:outline-none'
                          />
                          <div className='flex gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                            <button onClick={() => handleDecrement(levelKey, 'premium')} disabled={!levelData.active}>
                              <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                            </button>
                            <div className='border-r border-borderColor6 h-[26px]'></div>
                            <button onClick={() => handleIncrement(levelKey, 'premium')} disabled={!levelData.active} className='w-[22px]'>
                              <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Stop Level Input */}
                      <div className='max-w-[466px] w-full'>
                        <label className='text-sm lg:text-base text-Primary font-medium'>{`Stop Level ${index + 1}`}</label>
                        <div className='flex justify-between items-center text-sm lg:text-base text-Primary mt-1 lg:mt-2 p-[6px] lg:p-[11px] gap-[10px] border border-borderColor bg-textBoxBg rounded-[6px]'>
                          <input
                            type='text' maxLength={5} title='Max Length 5'
                            value={levelData.stopLevel}
                            onChange={(e) => handleStopLevelChange(levelKey, e.target.value)}
                            onBlur={(e) => handleStopLevelChange(levelKey, e.target.value === "" ? 0 : e.target.value)}
                            disabled={!levelData.active}
                            className='bg-transparent max-w-[230px] w-full focus:outline-none'
                          />
                          <div className='flex gap-[5px] lg:gap-[10px] min-w-[50px] lg:min-w-[65px]'>
                            <button onClick={() => handleDecrement(levelKey, 'stopLevel')} disabled={!levelData.active}>
                              <img className='w-4 lg:w-auto' src={MinimumIcon} alt="" />
                            </button>
                            <div className='border-r border-borderColor6 h-[26px]'></div>
                            <button onClick={() => handleIncrement(levelKey, 'stopLevel')} disabled={!levelData.active} className='w-[22px]'>
                              <img className='w-4 lg:w-auto' src={PluseIcon} alt="" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Checkbox Controls */}
                    <div className='flex justify-between gap-2 md:gap-5 xl:max-w-[372px] 2xl:max-w-[390px] w-full'>
                      <label className='text-xs lg:text-base text-Primary font-medium w-[130px] xl:w-[100px] xl:block flex items-center gap-[6px]'>
                        Full IC Close
                        <input type='checkbox' checked={levelData.fullICClose} disabled={!levelData.active} onChange={() => handleCheckboxStateChange(levelKey, 'fullICClose')} className='accent-accentColor h-[15px] w-[15px] lg:h-[19px] lg:w-[19px] cursor-pointer xl:mt-[22px]' />
                      </label>
                      <label className='text-xs lg:text-base text-Primary font-medium w-[150px] xl:w-[130px] xl:block flex items-center gap-[6px]'>
                        One Side Close
                        <input type='checkbox' checked={levelData.oneSideClose} disabled={!levelData.active} onChange={() => handleCheckboxStateChange(levelKey, 'oneSideClose')} className='accent-accentColor h-[15px] w-[15px] lg:h-[19px] lg:w-[19px] cursor-pointer xl:mt-[22px]' />
                      </label>
                      <label className='text-xs lg:text-base text-Primary font-medium w-[90px] xl:w-[60px] xl:block flex items-center gap-[6px]'>
                        Outside
                        <input type='checkbox' checked={levelData.outSide} disabled={!levelData.active} onChange={() => handleCheckboxStateChange(levelKey, 'outSide')} className='accent-accentColor h-[15px] w-[15px] lg:h-[19px] lg:w-[19px] cursor-pointer xl:mt-[22px]' />
                      </label>
                    </div>
                  </div>
                );
              })}

            </div>

            {Object.keys(levels).length > 4 && <div className="mt-4 text-center">
              <button onClick={() => setShowAll(!showAll)} className="text-sm lg:text-base text-Secondary2 font-medium underline">
                {showAll ? 'See Less Levels' : 'See More Levels'}
              </button>
            </div>}
          </div>

          <div className='flex justify-between items-center gap-5 mt-5 lg:max-w-[830px] min-[1150px]:max-w-[975px] xl:max-w-[1110px] min-[1380px]:max-w-[1220px] min-[1450px]:max-w-[1070px] max-[1600px]:max-w-[1000px] min-[1601px]:max-w-full w-full'>
            <h2 className='text-xl lg:text-[22px] xl:text-2xl text-Primary font-semibold'>Dynamic Matrix - Short IC <span className='text-sm lg:text-base text-Primary lg:font-medium mt-5'>(Allocation Size: ${Number(currentAllocation).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span></h2>
            <div className='flex justify-between md:justify-end items-start gap-5 mt-3 sm:mt-0 w-full md:w-auto'>
              <div className='md:flex gap-3'>
                {(msgM4.msg !== "") && <p className={`hidden md:block text-sm text-center ${msgM4.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM4.msg}, <Link to="/subscription"></Link> </p>}
                <div className="flex items-center gap-2 text-sm lg:text-base font-medium text-white bg-ButtonBg rounded-md py-2 px-5 lg:py-[6px] lg:px-[30px] h-[37px] lg:h-[40px] cursor-pointer" onClick={handleSaveMatrix} >
                  <img className='h-4 lg:h-[18px]' src={SavedMatrixIcon} alt="" /> Save Matrix
                </div>
                {(msgM4.msg !== "") && <p className={`block md:hidden text-sm text-center ${msgM4.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM4.msg}, <Link to="/subscription"></Link> </p>}
              </div>
              <p className='text-sm lg:text-base font-medium text-white flex items-center gap-[10px] bg-background2 py-2 px-5 rounded-md cursor-pointer' onClick={() => setIsFilterModalVisible(!isFilterModalVisible)}>
                <img className='w-4 lg:w-auto' src={FilterIcon} alt="Filter icon" /> Filter
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <FilterModal
              isVisible={isFilterModalVisible}
              filterModalRef={filterModalRef}
              filters={{
                showContracts, setShowContracts,
                showCredit, setShowCredit,
                showCommission, setShowCommission,
                showStop, setShowStop,
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

          <div className="overflow-auto lg:max-w-[830px] min-[1150px]:max-w-[975px] xl:max-w-[1110px] min-[1380px]:max-w-[1220px] min-[1450px]:max-w-[1070px] max-[1600px]:max-w-[1000px] min-[1601px]:max-w-full w-full mt-4 rounded-[6px] shadow-[0px_0px_6px_0px_#28236633]">
            <table className="table-auto border-collapse w-full">
              <thead>
                <tr className="bg-background2 text-white text-sm lg:text-base font-semibold">
                  <th className="px-2 py-2">Level</th>
                  {showContracts && <th className="border-x border-borderColor px-2 py-2">Contracts ({sum(ContractsTable)})</th>}
                  {showCredit && <th className="border-x border-borderColor px-2 py-2">Credit</th>}
                  {showStop && <th className="border-x border-borderColor px-2 py-2">Stop</th>}
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
                  <tr key={index} className="text-sm lg:text-base text-center text-Secondary bg-background6">
                    <td className="border-t border-borderColor px-2 py-2">{value}</td>
                    {showContracts && <td className="border-t border-x border-borderColor px-2 py-2">{ContractsTable[index]}</td>}
                    {showCredit && <td className="border-t border-x border-borderColor px-2 py-2"> ${Number(CreditTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showStop && <td className="border-t border-x border-borderColor px-2 py-2">${Number(StopTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showCommission && <td className="border-t border-x border-borderColor px-2 py-2">${Number(CommissionTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showBP && <td className="border-t border-x border-borderColor px-2 py-2">${Number(BPTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showProfit && <td className="border-t border-x border-borderColor px-2 py-2">${Number(ProfitTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showLoss && <td className="border-t border-x border-borderColor px-2 py-2 text-red-500">${Number(LossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showCumulativeLoss && <td className="border-t border-x border-borderColor px-2 py-2 text-red-500">${Number(CumulativeLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showSeriesGainLoss && <td className={`border-t border-x border-borderColor px-2 py-2 ${SeriesGainLossTable[index] < 0 ? 'text-red-500' : ''} `}>${Number(SeriesGainLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showAfterWin && <td className="border-t border-x border-borderColor px-2 py-2">${Number(AfterWinTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showGainPercentage && <td className={`border-t border-x border-borderColor px-2 py-2 ${GainPreTable[index] < 0 ? 'text-red-500' : ''} `}>{Number(GainPreTable[index]).toFixed(2)}%</td>}
                    {showAfterLoss && <td className={`border-t border-x border-borderColor px-2 py-2 ${AfterLossTable[index] < 0 ? 'text-red-500' : ''} `}>${Number(AfterLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showLossPercentage && <td className="border-t border-borderColor px-2 py-2 text-red-500">{Number(LossPreTable[index]).toFixed(2)}%</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            {LevelTable.length === 0 && <>
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

          {dynamicNextGameKey ? (
            <NextGamePlanDynamicLongMatrix
              CumulativeLossTable={CumulativeLossTable ? Math.abs(CumulativeLossTable.at(-1)) : 0}
              commission={commission}
              Credit={Credit}
              setCredit={setCredit}
              BEGain1={BEGain1}
              setBEGain1={setBEGain1}
              BEGain2={BEGain2}
              setBEGain2={setBEGain2}
              BEGain3={BEGain3}
              setBEGain3={setBEGain3}
              BEGain4={BEGain4}
              setBEGain4={setBEGain4}
              BEGain5={BEGain5}
              setBEGain5={setBEGain5}
              BEContract={BEContract}
              setBEContract={setBEContract}
              showAll={showAll}
              setShowAll={setShowAll}
              NextResetTable={NextResetTable}
              isFilterModalVisible2={isFilterModalVisible2}
              setIsFilterModalVisible2={setIsFilterModalVisible2}
              AfterLossTable={AfterLossTable?.at(-1)}
            />
          ) : (
            <Link to={"/subscription"} className="text-lg text-Primary flex justify-center items-center m-4" >
              To view next game plan, Please upgrade your plan...
            </Link>
          )}

          <Button className="flex items-center gap-2 lg:gap-[17px] h-[38px] lg:h-[55px] mt-5 lg:mt-10 mx-auto" onClick={handleSaveMatrix}>
            <img className='h-[18px]' src={SavedMatrixIcon} alt="" /> Save Matrix
          </Button>

          <div className='mb-10 text-center'>
            {(msgM4.msg !== "") && <p className={`text-sm ${msgM4.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM4.msg}.</p>}
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
    </>);
}

export default DynamicMatrixShort;
