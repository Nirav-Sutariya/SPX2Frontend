import { useEffect, useMemo, useRef, useState } from "react";
import Filter from '../../assets/svg/FilterIcon.svg';
import DownArrowIcon from '../../assets/svg/DownArrowIcon.svg';
import DeleteIcon from '../../assets/Images/StaticMatrix/DeleteIcon.svg';
import DeleteIcon2 from '../../assets/Images/StaticMatrix/DeleteIcon2.svg';
import { ConfirmationModal, defaultCommission, FilterModalLong } from "../../components/utils";
import NextGamePlanDynamicICLongMatrix from "../dynamicMatrix/NextGamePalnDynamicICLongMatrix";
import { getToken, getUserId } from "../login/loginAPI";
import axios from "axios";

function DynamicLongCalculations({ savedData, nextGamePlan, DynamicShowHandel }) {

  const lossDataRef = useRef([]);
  const filterModalRef = useRef(null);
  const cumulativeLossRef = useRef([]);
  const seriesGainRefValue = useRef([]);
  const [levels, setLevels] = useState({});
  const [originalSize, setOriginalSize] = useState(null);
  const [commission, setCommission] = useState(defaultCommission);
  const [currentAllocation, setCurrentAllocation] = useState(originalSize);
  // Table column value
  const [BPTable, setBPTable] = useState([]);
  const [StopTable, setStopTable] = useState([]);
  const [LossTable, setLossTable] = useState([]);
  const [LevelTable, setLevelTable] = useState([]);
  const [CreditTable, setCreditTable] = useState([]);
  const [ProfitTable, setProfitTable] = useState([]);
  const [GainPreTable, setGainPreTable] = useState([]);
  const [LossPreTable, setLossPreTable] = useState([]);
  const [AfterWinTable, setAfterWinTable] = useState([]);
  const [levelDateTable, setLevelDateTable] = useState([]);
  const [ContractsTable, setContractsTable] = useState([]);
  const [AfterLossTable, setAfterLossTable] = useState([]);
  const [CommissionTable, setCommissionTable] = useState([]);
  const [CumulativeLossTable, setCumulativeLossTable] = useState([]);
  const [SeriesGainLossTable, setSeriesGainLossTable] = useState([]);

  const [showBP, setShowBP] = useState(true);
  const [showStop, setShowStop] = useState(true);
  const [showLoss, setShowLoss] = useState(true);
  const [showCredit, setShowCredit] = useState(true);
  const [showProfit, setShowProfit] = useState(true);
  // const [showAllRows, setShowAllRows] = useState(false);
  const [showAfterWin, setShowAfterWin] = useState(true);
  const [showContracts, setShowContracts] = useState(true);
  const [showAfterLoss, setShowAfterLoss] = useState(true);
  const [showCommission, setShowCommission] = useState(true);
  const [showCumulativeLoss, setShowCumulativeLoss] = useState(true);
  const [showSeriesGainLoss, setShowSeriesGainLoss] = useState(true);
  const [showGainPercentage, setShowGainPercentage] = useState(true);
  const [showLossPercentage, setShowLossPercentage] = useState(true);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  // const visibleRows = showAllRows ? LevelTable.length : 5; // Show 5 rows initially
  const [Credit, setCredit] = useState(true);
  const [BEGain1, setBEGain1] = useState(true);
  const [BEGain2, setBEGain2] = useState(true);
  const [BEGain3, setBEGain3] = useState(true);
  const [BEGain4, setBEGain4] = useState(true);
  const [BEGain5, setBEGain5] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [BEContract, setBEContract] = useState(true);
  const [isFilterModalVisible2, setIsFilterModalVisible2] = useState(false);
  const [modalData, setModalData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [msgM1, setMsgM1] = useState({ type: "", msg: "", });


  useMemo(async () => {
    if (savedData) {
      try {
        setOriginalSize(Number(savedData.originalSize) || 0);
        setCommission(Number(savedData.commission) || 5);
        setCurrentAllocation(((Number(savedData.originalSize) || 0) * ((Number(savedData.allocation) || 100) / 100)).toFixed(2))
        setLevels(savedData.levels || {});
        let tableVisibility = savedData.tableVisibility;
        if (tableVisibility) {
          setShowContracts(tableVisibility.showContracts)
          setShowCredit(tableVisibility.showCredit)
          setShowCommission(tableVisibility.showCommission)
          setShowBP(tableVisibility.showBP)
          setShowProfit(tableVisibility.showProfit)
          setShowLoss(tableVisibility.showLoss)
          setShowCumulativeLoss(tableVisibility.showCumulativeLoss)
          setShowSeriesGainLoss(tableVisibility.showSeriesGainLoss)
          setShowAfterWin(tableVisibility.showAfterWin)
          setShowGainPercentage(tableVisibility.showGainPercentage)
          setShowAfterLoss(tableVisibility.showAfterLoss)
          setShowLossPercentage(tableVisibility.showLossPercentage)
        }
      } catch (error) {
      }
    }
  }, [savedData])

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

  /// Matrix table calculations ///
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
    setStopTable([])
    setCommissionTable([])
    setBPTable([])
    setProfitTable([])
    setLossTable([]);
    setCumulativeLossTable([]);
    setSeriesGainLossTable([]);
    setAfterWinTable([]);
    setGainPreTable([]);
    setAfterLossTable([]);
    setLossPreTable([]);
    setLevelDateTable([]);

    Object.keys(levels).map((level, index) => {
      setLevelTable((pre) => {
        return [...pre, "Level " + (index + 1)]
      })

      let t = (levels[level]?.active ? levels[level].value : 0) || 0;
      let tradePrice = levels[level].premium || 0;
      let stopPrice = levels[level].stopLevel || 0;

      const item = levels[level];
      setLevelDateTable(prev => [...prev, item.levelDate?.slice(0, 10) || "-"]);

      setContractsTable((pre) => {
        return [...pre, t]
      })

      let debitValue = tradePrice * t * 100
      setCreditTable((pre) => {
        return [...pre, (debitValue)]
      })

      let obj = levels[level]
      let stopData = 0

      if ((Number(obj.stopLevel) > 0)) {
        stopData = Math.round(Number(obj.stopLevel) * 100 * obj.value).toFixed(2)
      } else {
        stopData = 0
      }

      setStopTable((pre) => {
        return [...pre, (stopData)]
      })

      let commissionData = 0
      if (obj.fullIcClose) {
        commissionData = commission * obj.value * 2
      } else if (obj.oneSideClose) {
        commissionData = 1.5 * commission * obj.value
      } else {
        commissionData = commission * obj.value
      }

      setCommissionTable((pre) => {
        return [...pre, (commissionData)]
      })

      let bpData = 0;
      bpData = parseFloat(debitValue) + parseFloat(commissionData);

      setBPTable((pre) => {
        return [...pre, (bpData)]
      })

      let profitData = 0

      if (obj.outSide) {
        profitData = 0
      } else if (stopData > 0 && (obj.fullIcClose || obj.oneSideClose)) {
        profitData = ((stopPrice - tradePrice) * t * 100) - commissionData
      } else {
        profitData = (500 * t) - debitValue - commissionData
      }
      profitData = profitData < 0 ? 0 : profitData

      setProfitTable((pre) => {
        return [...pre, (profitData)]
      })

      let lossData = 0

      if (obj.active) {
        if (obj.outSide) {
          lossData = 0 - debitValue - commissionData;
        } else if (stopData > 0 && (obj.fullIcClose || obj.oneSideClose)) {
          lossData = -(((tradePrice - stopPrice) * t * 100) + commissionData);
        } else {
          lossData = 0;
        }
      }

      lossData = lossData > 0 ? 0 : lossData

      setLossTable((pre) => {
        return [...pre, (lossData)]
      })
      lossDataRef.current = [...lossDataRef.current, lossData]

      const previousValueData = seriesGainRefValue.current[index - 1] || 0;
      let CumulativeLossTable = 0;
      let previousStateCumulativeLossData = previousValueData === 0 ? ((CumulativeLossTable[index - 1] === 0 ? lossData : CumulativeLossTable[index - 1]) || 0) : (previousValueData < 0 ? (previousValueData) : 0);

      if (lossData < 0) {
        previousStateCumulativeLossData = previousStateCumulativeLossData + lossData
      }
      setCumulativeLossTable((pre) => {
        return [...pre, (previousStateCumulativeLossData)];
      });

      cumulativeLossRef.current = [...cumulativeLossRef.current, previousStateCumulativeLossData];
      let seriesGainLossData = 0;
      seriesGainLossData = (profitData > 0 ? profitData : lossData) + (seriesGainRefValue.current[index - 1] || 0)

      setSeriesGainLossTable((pre) => {
        return [...pre, (seriesGainLossData)];
      });

      seriesGainRefValue.current = [...SeriesGainLossTable, seriesGainLossData]
      let AfterWinData = 0;
      AfterWinData = parseFloat(currentAllocation) + seriesGainLossData;

      setAfterWinTable((pre) => {
        return [...pre, (AfterWinData)];
      });

      let gainData = 0;
      gainData = (seriesGainLossData / parseFloat(currentAllocation)) * 100

      setGainPreTable((pre) => {
        return [...pre, (gainData)];
      });

      let afterLossData = 0;
      afterLossData = parseFloat(currentAllocation) + previousStateCumulativeLossData

      setAfterLossTable((pre) => {
        return [...pre, (afterLossData)];
      });

      let lossTableData = 0;
      lossTableData = (previousStateCumulativeLossData / parseFloat(currentAllocation)) * 100

      setLossPreTable((pre) => {
        return [...pre, (lossTableData)];
      });
      indx += 1
    })
  }

  useEffect(() => {
    initValueSetup()
  }, [levels, commission]);

  useEffect(() => {
    const areArraysEqual = (arr1, arr2) => {
      if (arr1.length !== arr2.length) return false;
      return arr1.every((value, index) => value === arr2[index]);
    };

    if (CumulativeLossTable?.length === 0) {
      initValueSetup();
      cumulativeLossRef.current = [...CumulativeLossTable];
    } else if (CumulativeLossTable.length > 0 && !areArraysEqual(cumulativeLossRef.current, CumulativeLossTable)) {
      initValueSetup();
      cumulativeLossRef.current = [...CumulativeLossTable];
    }
  }, [CumulativeLossTable]);
  // end matrix calculations

  const handleToggle = (toggleSetter) => {
    toggleSetter((prevState) => !prevState);
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
    setIsFilterModalVisible(false);
  }

  // Filter the array to show only values less than 0
  const filteredData = CumulativeLossTable.filter((value, index) => {
    const levelKey = `level${index + 1}`; // Creates level1, level2, ...
    return levels[levelKey]?.active && value <= 0;
  });

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
            window.location.reload();
            setMsgM1({ type: "info", msg: 'Matrix was deleted...' });
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

  useMemo(() => {
    if (msgM1.type !== "")
      setTimeout(() => {
        setMsgM1({ type: "", msg: "" })
      }, 40 * 100);
  }, [msgM1])


  return (
    <>
      {(msgM1.msg !== "") && <p className={`text-xs lg:text-sm max-w-[350px] ${msgM1.type === "error" ? "text-[#D82525]" : "text-Secondary2"} my-2`}>{msgM1.msg}.</p>}

      <div className='flex justify-between items-center gap-5 mt-5 lg:mt-10 lg:max-w-[830px] min-[1150px]:max-w-[975px] xl:max-w-[1110px] min-[1380px]:max-w-[1220px] min-[1450px]:max-w-[1070px] max-[1600px]:max-w-[1000px] min-[1601px]:max-w-full w-full'>
        <h2 className='text-xl lg:text-[22px] xl:text-2xl font-semibold text-Primary cursor-pointer flex items-center gap-5 capitalize' onClick={(e) => { DynamicShowHandel && DynamicShowHandel(false) }} >Dynamic Matrix Long : {savedData.matrixName} {DynamicShowHandel && <img className="rotate-180" src={DownArrowIcon} alt="" />}</h2>
        <div className='flex items-center gap-5'>
          <div className="flex justify-center ">
            <div className="px-[10px] p-[9px] border border-borderColor rounded-md bg-background3 cursor-pointer" onClick={() => handleDeleteClick(savedData._id)}>
              <img className='w-4 h-[14px] lg:h-5 lg:w-5' src={DeleteIcon} alt="Delete Icon" />
            </div>
          </div>
          <p className={`text-sm lg:text-base font-medium text-white flex items-center gap-[10px] bg-background2 py-2 px-5 rounded-md cursor-pointer min-w-[100px] ${isFilterModalVisible ? "shadow-[inset_2px_2px_5px_0_#104566]" : "shadow-[inset_-2px_-2px_5px_0_#104566]"}`} onClick={() => setIsFilterModalVisible(!isFilterModalVisible)}>
            <img className='w-4 lg:w-auto' src={Filter} alt="Filter icon" />Filter
          </p>
        </div>
      </div>

      <ConfirmationModal show={showModal} onClose={() => setShowModal(false)} onConfirm={modalData.onConfirm} title={modalData.title} icon={modalData.icon} message={modalData.message} />

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
              <th className="px-2 py-2">Date</th>
              <th className="border-x border-borderColor px-2 py-2">Level</th>
              {showContracts && <th className="border-x border-borderColor px-2 py-2">Contracts ({sum(ContractsTable)})</th>}
              {showCredit && <th className="border-x border-borderColor px-2 py-2">Debit</th>}
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
            {Object.keys(levels).slice(0, 15).map((level, index) => {
              if (levels[level].active) {
                return (
                  <tr key={index} className="text-sm lg:text-base text-center text-Secondary bg-background6 ">
                    <td className="border-t border-borderColor px-2 py-2">{levelDateTable[index]}</td>
                    <td className="border-t border-x border-borderColor px-2 py-2">{index + 1}</td>
                    {showContracts && <td className="border-t border-x border-borderColor px-2 py-2">{ContractsTable[index]}</td>}
                    {showCredit && <td className="border-t border-x border-borderColor px-2 py-2">${Number(CreditTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
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
                )
              }
            })}
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

      {/* {LevelTable.length > 5 && <div className="mt-4 text-center">
        <button onClick={toggleShowMore} className="text-sm lg:text-base text-Secondary2 font-medium underline">
          {showAllRows ? 'See Less Levels' : 'See More Levels'}
        </button>
      </div>} */}

      {nextGamePlan && <NextGamePlanDynamicICLongMatrix
        CumulativeLossTable={CumulativeLossTable ? Math.abs(filteredData.at(-1)) : 0}
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
      />}
    </>)
}
export default DynamicLongCalculations;