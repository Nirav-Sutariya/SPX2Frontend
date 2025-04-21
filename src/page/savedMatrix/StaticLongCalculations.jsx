import { useEffect, useMemo, useRef, useState } from 'react';
import Filter from '../../assets/svg/FilterIcon.svg';
import { defaultAllocation, defaultCommission, defaultTradePrice, FilterModalLong } from '../../components/utils';

function StaticLongCalculations({ savedData }) {

  const FilterModalRef = useRef(null);
  const [levels, setLevels] = useState({});
  // const [levelLength, setlevelLength] = useState(6);
  const [commission, setCommission] = useState(defaultCommission);
  const [allocation, setAllocation] = useState(defaultAllocation);
  const [tradePrice, setTradePrice] = useState(defaultTradePrice);
  const [originalSize, setOriginalSize] = useState(null);
  const [currentAllocation, setCurrentAllocation] = useState(originalSize);
  // Table column value
  const [BPTable, setBPTable] = useState([]);
  const [LossTable, setLossTable] = useState([]);
  const [LevelTable, setLevelTable] = useState([]);
  const [CreditTable, setCreditTable] = useState([]);
  const [ProfitTable, setProfitTable] = useState([]);
  const [LossPreTable, setLossPreTable] = useState([]);
  const [GainPreTable, setGainPreTable] = useState([]);
  const [AfterWinTable, setAfterWinTable] = useState([]);
  const [ContractsTable, setContractsTable] = useState([]);
  const [AfterLossTable, setAfterLossTable] = useState([]);
  const [CommissionTable, setCommissionTable] = useState([]);
  const [CumulativeLossTable, setCumulativeLossTable] = useState([]);
  const [SeriesGainLossTable, setSeriesGainLossTable] = useState([]);

  const [showBP, setShowBP] = useState(true);
  const [showLoss, setShowLoss] = useState(true);
  const [showProfit, setShowProfit] = useState(true);
  const [showCredit, setShowCredit] = useState(true);
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
  // const visibleRows = showAllRows ? LevelTable.length : 5;


  const handleToggle = (toggleSetter) => {
    toggleSetter((prevState) => !prevState);
  };

  // const toggleShowMore = () => {
  //   setShowAllRows(prevState => !prevState);
  // };

  useEffect(() => {
    function handleClickOutside(event) {
      if (FilterModalRef.current && !FilterModalRef.current.contains(event.target)) {
        setIsFilterModalVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [FilterModalRef]);

  //////////  Matrix table calculations //////////
  function getLoss(contract) {
    return (-1 * (tradePrice * contract * 100 + commission * contract))
  }
  function getProfit(contract) {
    return ((500 * contract) - tradePrice * contract * 100 - commission * contract)
  }
  function getBPValue(contract) {
    return (tradePrice * contract * 100 + commission * contract)
  }

  function initValueSetup() {
    let indx = 0;
    setCurrentAllocation((Number(originalSize) * (allocation / 100)).toFixed(2))
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
        return [...pre, t]
      })
      setCreditTable((pre) => {
        return [...pre, (tradePrice * t * 100)]
      })
      setCommissionTable((pre) => {
        return [...pre, (commission * t)]
      })
      setBPTable((pre) => {
        return [...pre, getBPValue(t)]
      })
      setProfitTable((pre) => {
        return [...pre, getProfit(t)]
      })
      setLossTable((pre) => {
        return [...pre, getLoss(t)]
      })
      indx += 1
    })
  }

  useEffect(() => {
    if (savedData) {
      try {
        setOriginalSize(Number(savedData.originalSize) || 0);
        setAllocation(Number(savedData.allocation) || 100);
        setTradePrice(Number(savedData.tradePrice) || 1.6);
        setCommission(Number(savedData.commission) || 5);
        setLevels(savedData.levels || {});
        let tableVisibility = savedData.tableVisibility;
        if (tableVisibility) {
          setShowContracts(tableVisibility.showContracts);
          setShowCredit(tableVisibility.showCredit);
          setShowCommission(tableVisibility.showCommission);
          setShowBP(tableVisibility.showBP);
          setShowProfit(tableVisibility.showProfit);
          setShowLoss(tableVisibility.showLoss);
          setShowCumulativeLoss(tableVisibility.showCumulativeLoss);
          setShowSeriesGainLoss(tableVisibility.showSeriesGainLoss);
          setShowAfterWin(tableVisibility.showAfterWin);
          setShowGainPercentage(tableVisibility.showGainPercentage);
          setShowAfterLoss(tableVisibility.showAfterLoss);
          setShowLossPercentage(tableVisibility.showLossPercentage);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }, [savedData]);

  useMemo(() => {
    initValueSetup()
  }, [levels, currentAllocation, tradePrice, commission])

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
    setIsFilterModalVisible(false);
  }


  return (
    <>
      <div className='flex justify-between items-center gap-3 lg:gap-5 mt-5 lg:mt-10 lg:max-w-[830px] min-[1150px]:max-w-[975px] xl:max-w-[1110px] min-[1380px]:max-w-[1220px] min-[1450px]:max-w-[1070px] max-[1600px]:max-w-[1000px] min-[1601px]:max-w-full w-full'>
        <h2 className='text-xl lg:text-[22px] xl:text-2xl font-semibold text-Primary capitalize'>Static Matrix Long : {savedData.matrixName}</h2>
        <p className='text-sm lg:text-base font-medium text-white flex items-center gap-[10px] bg-background2 py-2 px-5 rounded-md cursor-pointer min-w-[100px]' ref={FilterModalRef} onClick={() => setIsFilterModalVisible(!isFilterModalVisible)}>
          <img className='w-4 lg:w-auto' src={Filter} alt="Filter icon" />Filter
        </p>
      </div>

      <div className="flex justify-end">
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
              {showContracts && <th className="border-x border-borderColor px-2 py-2">Contracts ({ContractsTable.reduce((a, b) => a + b, 0)})</th>}
              {showCredit && <th className="border-x border-borderColor px-2 py-2">Debit</th>}
              {showCommission && <th className="border-x border-borderColor px-2 py-2">Commission</th>}
              {showBP && <th className="border-x border-borderColor px-2 py-2">BP</th>}
              {showProfit && <th className="border-x border-borderColor px-2 py-2">Profit</th>}
              {showLoss && <th className="border-x border-borderColor px-2 py-2">Loss</th>}
              {showCumulativeLoss && <th className="border-x border-borderColor px-2 py-2">Cumulative Loss</th>}
              {showSeriesGainLoss && <th className="border-x border-borderColor px-2 py-2">Series Gain/Loss</th>}
              {showAfterWin && <th className="border-x border-borderColor px-2 py-2">After Win</th>}
              {showGainPercentage && <th className="border-x border-borderColor px-2 py-2">Gain (%)</th>}
              {showAfterLoss && <th className="border-x border-borderColor px-2 py-2">After Loss</th>}
              {showLossPercentage && <th className="px-2 py-2">Loss (%)</th>}
            </tr>
          </thead>
          <tbody>
            {Object.keys(levels).slice(0, 15).map((level, index) => {
              if (levels[level].active) {
                return (
                  <tr key={index} className="text-sm lg:text-base text-center text-Secondary bg-background6">
                    <td className="border-t border-borderColor px-2 py-2">{index + 1}</td>
                    {showContracts && <td className="border-t border-x border-borderColor px-2 py-2">{ContractsTable[index]}</td>}
                    {showCredit && <td className="border-t border-x border-borderColor px-2 py-2">${Number(CreditTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showCommission && <td className="border-t border-x border-borderColor px-2 py-2">${Number(CommissionTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showBP && <td className="border-t border-x border-borderColor px-2 py-2">${Number(BPTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showProfit && <td className="border-t border-x border-borderColor px-2 py-2">${Number(ProfitTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showLoss && <td className="border-t border-x border-borderColor px-2 py-2 text-red-500">${Number(LossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showCumulativeLoss && <td className="border-t border-x border-borderColor px-2 py-2 text-red-500">${Number(CumulativeLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showSeriesGainLoss && <td className={`border-t border-x border-borderColor px-2 py-2 ${SeriesGainLossTable[index] < 0 ? 'text-red-500' : ''}`}>${Number(SeriesGainLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showAfterWin && <td className="border-t border-x border-borderColor px-2 py-2">${Number(AfterWinTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showGainPercentage && <td className={`border-t border-x border-borderColor px-2 py-2 ${GainPreTable[index] < 0 ? 'text-red-500' : ''}`}>{GainPreTable[index]}%</td>}
                    {showAfterLoss && <td className={`border-t border-x border-borderColor px-2 py-2 ${AfterLossTable[index] < 0 ? 'text-red-500' : ''}`}>${Number(AfterLossTable[index]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                    {showLossPercentage && <td className="border-t border-borderColor px-2 py-2 text-red-500">{LossPreTable[index]}%</td>}
                  </tr>
                )
              }
            })}
          </tbody>
        </table>
      </div>

      {/* <div className="mt-4 text-center">
        <button onClick={toggleShowMore} className="text-sm lg:text-base text-Secondary2 font-medium underline">
          {showAllRows ? 'See Less Levels' : 'See More Levels'}
        </button>
      </div> */}
    </>)
}

export default StaticLongCalculations;