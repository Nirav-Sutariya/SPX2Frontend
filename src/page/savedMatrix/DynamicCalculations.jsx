import { useEffect, useMemo, useRef, useState } from "react";
import Filter from '../../assets/svg/FilterIcon.svg';
import DownArrowIcon from '../../assets/svg/DownArrowIcon.svg';
import { defaultCommission, FilterModalShort } from "../../components/utils";
import NextGamePlanDynamicLongMatrix from "../../page/dynamicMatrix/NextGamePlanDynamicLongMatrix";

function DynamicCalculations({ savedData, nextGamePlan, DynamicShowHandel }) {

    const filterModalRef = useRef(null);
    const CumulativeLossRef = useRef([]);
    const [levels, setLevels] = useState({});
    const [showStop, setShowStop] = useState(true);
    const [originalSize, setOriginalSize] = useState(null);
    const [levelDateTable, setLevelDateTable] = useState([]);
    const [commission, setCommission] = useState(defaultCommission);
    const [currentAllocation, setCurrentAllocation] = useState(originalSize);
    // Table column value
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

    const [showBP, setShowBP] = useState(true);
    const [showLoss, setShowLoss] = useState(true);
    const [showProfit, setShowProfit] = useState(true);
    const [showCredit, setShowCredit] = useState(true);
    const [showAllRows, setShowAllRows] = useState(false);
    const [showAfterWin, setShowAfterWin] = useState(true);
    const [showContracts, setShowContracts] = useState(true);
    const [showAfterLoss, setShowAfterLoss] = useState(true);
    const [showCommission, setShowCommission] = useState(true);
    const [showCumulativeLoss, setShowCumulativeLoss] = useState(true);
    const [showSeriesGainLoss, setShowSeriesGainLoss] = useState(true);
    const [showGainPercentage, setShowGainPercentage] = useState(true);
    const [showLossPercentage, setShowLossPercentage] = useState(true);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [Credit, setCredit] = useState(true);
    const [BEGain1, setBEGain1] = useState(true);
    const [BEGain2, setBEGain2] = useState(true);
    const [BEGain3, setBEGain3] = useState(true);
    const [BEGain4, setBEGain4] = useState(true);
    const [BEGain5, setBEGain5] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [BEContract, setBEContract] = useState(true);
    const visibleRows = showAllRows ? LevelTable.length : 5;
    const [isFilterModalVisible2, setIsFilterModalVisible2] = useState(false);


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
        let levelTableData = [];
        let contractsTableData = [];
        let creditTableData = [];
        const levelDateTableData = [];

        Object.keys(levels).forEach((level, index) => {
            const item = levels[level];
            if (levels[level].active) {
                levelTableData.push("Level " + (index + 1));
                let t = levels[level].value;
                contractsTableData.push(t);
                creditTableData.push(Number(levels[level].premium || 0) * t * 100);
                levelDateTableData.push(item.levelDate?.slice(0, 10) || "-");
            }
        });

        setLevelTable(levelTableData);
        setContractsTable(contractsTableData);
        setCreditTable(creditTableData);
        setLevelDateTable(levelDateTableData);
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
                let stopLevel = Number(t.stopLevel) || 0;
                let levelValue = Number(t.value) || 0;
                let commissionValue = Number(commission) || 0;

                // Stop value calculation
                let temp = 0;
                if (stopLevel > 0 && (t.fullIcClose || t.oneSideClose)) {
                    temp = (stopLevel * levelValue * 100).toFixed(2);
                }
                tempStopTable.push(Number(temp));

                // Commission Calculation
                let temp1 = 0;
                if (t.fullIcClose && stopLevel > 0) {
                    temp1 = (commissionValue * levelValue * 2).toFixed(2);
                } else if (t.oneSideClose && stopLevel > 0) {
                    temp1 = ((commissionValue / 2 + commissionValue) * levelValue).toFixed(2);
                } else {
                    temp1 = (commissionValue * levelValue).toFixed(2);
                }
                tempCommissionTable.push(Number(temp1));
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
        Object.keys(levels).map((level) => {
            if (levels[level].active) {
                let t = levels[level]
                // BP Calculation
                let temp2 = (500 * t.value) - CreditTable[indx] + CommissionTable[indx]
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
    }, [levels, CommissionTable, currentAllocation, CreditTable, StopTable])

    useEffect(() => {
        setLossTable([])
        let indx = 0;
        Object.keys(levels).map((level, _) => {
            if (levels[level].active) {
                let t = levels[level]
                // Loss calculation
                let temp4 = 0
                if (t.outSide)
                    temp4 = (500 * t.value) - CreditTable[indx] + CommissionTable[indx]
                else
                    if (ProfitTable[indx] === 0 && (t.fullIcClose || t.oneSideClose)) {
                        temp4 = Math.abs(CreditTable[indx] - StopTable[indx] - CommissionTable[indx])
                    }
                // temp4 = Math.abs(CreditTable[indx] - StopTable[indx] - CommissionTable[indx])
                setLossTable((pre) => {
                    return [...pre, (-temp4)]
                })
                indx += 1
            }
        })

    }, [levels, StopTable, CreditTable, CommissionTable, ProfitTable])

    // To calculate Cumulative Loss
    useEffect(() => {
        let indx = 0;
        setCumulativeLossTable([]);

        Object.keys(levels).forEach((level) => {
            if (levels[level].active) {
                let currentLoss = LossTable[indx] || 0;
                let previousSeriesGainLoss = SeriesGainLossTable[indx - 1] || 0;
                let previousCumulativeLoss = CumulativeLossTable[indx - 1] || 0;
                let cumulativeLoss = 0;
                if (previousSeriesGainLoss > 0) {
                    cumulativeLoss = currentLoss;
                } else if (previousSeriesGainLoss === 0) {
                    cumulativeLoss = currentLoss + previousCumulativeLoss;
                } else if (previousSeriesGainLoss < 0) {
                    cumulativeLoss = previousSeriesGainLoss + currentLoss;
                }
                setCumulativeLossTable((prev) => [...prev, cumulativeLoss]);
                indx += 1;
            }
        });
    }, [LossTable, SeriesGainLossTable, levels]);

    // To calculate Series Gain/Loss
    useEffect(() => {
        let indx = 0;
        setSeriesGainLossTable([]);

        Object.keys(levels).forEach((level) => {
            if (levels[level].active) {
                let seriesGainLossData = 0;
                let currentProfit = ProfitTable[indx] || 0;
                let currentLoss = LossTable[indx] || 0;
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
                    seriesGainLossData = seriesGainLossData;
                } else {
                    seriesGainLossData = seriesGainLossData;
                }
                setSeriesGainLossTable((prev) => [...prev, seriesGainLossData]);
                indx += 1;
            }
        });
    }, [ProfitTable, LossTable]);

    useEffect(() => {
        const areArraysEqual = (arr1, arr2) => {
            if (arr1.length !== arr2.length) return false;
            return arr1.every((value, index) => value === arr2[index]);
        };

        if (CumulativeLossTable?.length === 0) {
            initValueSetup();
            CumulativeLossRef.current = [...CumulativeLossTable];
        } else if (CumulativeLossTable.length > 0 && !areArraysEqual(CumulativeLossRef.current, CumulativeLossTable)) {
            initValueSetup();
            CumulativeLossRef.current = [...CumulativeLossTable];
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

    const handleToggle = (toggleSetter) => {
        toggleSetter((prevState) => !prevState);
    };

    const toggleShowMore = () => {
        setShowAllRows(prevState => !prevState);
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


    return (
        <>
            <div className='flex justify-between items-center gap-5 mt-5 lg:mt-10 lg:max-w-[830px] min-[1150px]:max-w-[975px] xl:max-w-[1110px] min-[1380px]:max-w-[1220px] min-[1450px]:max-w-[1070px] max-[1600px]:max-w-[1000px] min-[1601px]:max-w-full w-full'>
                <h2 className='text-xl lg:text-[22px] xl:text-2xl font-semibold text-Primary cursor-pointer flex items-center gap-5 capitalize' onClick={(e) => { DynamicShowHandel && DynamicShowHandel(false) }} >Dynamic Matrix : {savedData.matrixName} {DynamicShowHandel && <img className="rotate-180 w-4 lg:w-5" src={DownArrowIcon} alt="" />}</h2>
                <p className='text-sm lg:text-base font-medium text-white flex items-center gap-[10px] bg-background2 py-2 px-5 rounded-md cursor-pointer' ref={filterModalRef} onClick={() => setIsFilterModalVisible(!isFilterModalVisible)}>
                    <img className='w-4 lg:w-auto' src={Filter} alt="Filter icon" /> Filter
                </p>
            </div>

            {/* Column filter checkboxes */}
            <div className="flex justify-end">
                <FilterModalShort
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
                            <th className="border-x border-borderColor">Level</th>
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
                            <tr key={index} className="text-sm lg:text-base text-center text-Secondary bg-background6 ">
                                <td className="border-t border-borderColor px-2 py-2">{levelDateTable[index]}</td>
                                <td className="border-t border-x border-borderColor px-2 py-2">{value}</td>
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

            {nextGamePlan && <NextGamePlanDynamicLongMatrix CumulativeLossTable={CumulativeLossTable ? Math.abs(CumulativeLossTable.at(-1)) : 0} commission={commission} Credit={Credit} setCredit={setCredit}
                BEGain1={BEGain1} setBEGain1={setBEGain1} BEGain2={BEGain2} setBEGain2={setBEGain2} BEGain3={BEGain3} setBEGain3={setBEGain3} BEGain4={BEGain4} setBEGain4={setBEGain4}
                BEGain5={BEGain5} setBEGain5={setBEGain5} BEContract={BEContract} setBEContract={setBEContract} showAll={showAll} setShowAll={setShowAll} NextResetTable={NextResetTable}
                isFilterModalVisible2={isFilterModalVisible2} setIsFilterModalVisible2={setIsFilterModalVisible2} AfterLossTable={AfterLossTable?.at(-1)} />}
        </>)
}
export default DynamicCalculations;