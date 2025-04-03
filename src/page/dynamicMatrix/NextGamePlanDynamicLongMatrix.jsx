import { useRef, useState, useEffect } from "react";
import Filter from '../../assets/svg/FilterIcon.svg';
import Slider from 'rc-slider'; // Import Slider from rc-slider
import 'rc-slider/assets/index.css'; // Import default slider styles

function NextGamePlanDynamicLongMatrix({
  CumulativeLossTable, commission, Credit, setCredit, BEGain1, setBEGain1, BEGain2, setBEGain2,
  BEGain3, setBEGain3, BEGain4, setBEGain4, BEGain5, setBEGain5, BEContract, setBEContract,
  showAll, setShowAll, NextResetTable, isFilterModalVisible2, setIsFilterModalVisible2, AfterLossTable
}) {

  const dropdownRef = useRef(null);

  const handleToggle = (toggleSetter) => {
    toggleSetter((prevState) => !prevState);
  };

  // Next Game plan calculations 
  const premiums = [5.00, 4.95, 4.90, 4.85, 4.80, 4.75, 4.70, 4.65, 4.60, 4.55, 4.50, 4.45, 4.40, 4.35, 4.30, 4.25, 4.20, 4.15, 4.10, 4.05, 4.00, 3.95, 3.90, 3.85, 3.80, 3.75, 3.70, 3.65, 3.60, 3.55, 3.50, 3.45, 3.40, 3.35, 3.30, 3.25, 3.20, 3.15, 3.10, 3.05, 3.00, 2.95, 2.90, 2.85, 2.80, 2.75, 2.70, 2.65, 2.60, 2.55, 2.50, 2.45, 2.40, 2.35, 2.30, 2.25, 2.20, 2.15, 2.10, 2.05, 2.00, 1.95, 1.90, 1.85, 1.80, 1.75, 1.70, 1.65, 1.60, 1.55, 1.50, 1.45, 1.40, 1.35, 1.30, 1.25, 1.20, 1.15, 1.10, 1.05, 1.00];

  // Function to calculate BE Contracts dynamically (adapted from your JS code)
  const calculateDynamicBEContracts = (dynamicCumulativeLoss, premium, commission) => {
    if (isNaN(dynamicCumulativeLoss) || isNaN(premium) || isNaN(commission) || premium <= 0) {
      return 0; // Return 0 if inputs are invalid
    }

    let beContracts = Math.ceil(dynamicCumulativeLoss / (premium * 100));

    while (true) {
      if (isNaN(beContracts)) break; // Exit loop if NaN

      const totalCommission = beContracts * commission;
      const adjustedLoss = dynamicCumulativeLoss + totalCommission;
      const newBEContracts = Math.ceil(adjustedLoss / (premium * 100));

      if (isNaN(newBEContracts) || newBEContracts === beContracts) {
        break; // Break if NaN or the values are stable
      }
      beContracts = newBEContracts;
    }

    return beContracts;
  };

  let BEContractTable = Array(premiums.length).fill(0);
  let BE1GainTable = Array(premiums.length).fill(0);
  let BE2GainTable = Array(premiums.length).fill(0);
  let BE3GainTable = Array(premiums.length).fill(0);
  let BE4GainTable = Array(premiums.length).fill(0);
  let BE5GainTable = Array(premiums.length).fill(0);

  function valueSetup() {
    BEContractTable = premiums.map((premium, index) => {
      const beContract = calculateDynamicBEContracts(Math.abs(CumulativeLossTable), premium, commission);
      BE1GainTable[index] = (Number(beContract) > 0 ? (((premium * 100 * (Number(beContract) + 1)) - ((Number(beContract) + 1) * commission)) - CumulativeLossTable) : 0).toFixed(2);
      BE2GainTable[index] = (Number(beContract) > 0 ? (((premium * 100 * (Number(beContract) + 2)) - ((Number(beContract) + 2) * commission)) - CumulativeLossTable) : 0).toFixed(2);
      BE3GainTable[index] = (Number(beContract) > 0 ? (((premium * 100 * (Number(beContract) + 3)) - ((Number(beContract) + 3) * commission)) - CumulativeLossTable) : 0).toFixed(2);
      BE4GainTable[index] = (Number(beContract) > 0 ? (((premium * 100 * (Number(beContract) + 4)) - ((Number(beContract) + 4) * commission)) - CumulativeLossTable) : 0).toFixed(2);
      BE5GainTable[index] = (Number(beContract) > 0 ? (((premium * 100 * (Number(beContract) + 5)) - ((Number(beContract) + 5) * commission)) - CumulativeLossTable) : 0).toFixed(2);

      return beContract; // Return the BEContract value for this premium
    });
  }

  valueSetup();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsFilterModalVisible2(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Range Slider
  const MIN_CREDIT = 1;
  const MAX_CREDIT = 5;
  const [priceRange, setPriceRange] = useState([1.2, 2.5]);
  const [minPriceError, setMinPriceError] = useState('');
  const [maxPriceError, setMaxPriceError] = useState('');

  const validatePriceRange = (values) => {
    const [min, max] = values;
    if (min > max) {
      setMinPriceError('Min price cannot be greater than Max price');
      setMaxPriceError('Max price cannot be less than Min price');
    } else {
      setMinPriceError('');
      setMaxPriceError('');
    }
  };

  // Filter premiums based on price range
  const filteredPremiums = premiums.filter((premium) => premium >= priceRange[0] && premium <= priceRange[1]);


  return (
    <>
      <div className='flex justify-between items-center mt-5 lg:mt-10 max-w-[850px] w-full'>
        <h2 className='text-xl lg:text-[22px] xl:text-2xl text-Primary font-semibold text-center'>Next Level Game Plan </h2>
        <div className="diamond_filter hidden sm:block max-w-[270px] w-full">
          <div>
            <div className="flex justify-between">
              <div className='flex items-center gap-2'>
                <p className="font-jost text-sm text-Primary">Min :</p>
                <p className='font-jost text-base text-Primary'>{priceRange[0]}</p>
                {minPriceError && <p className="text-red-500 text-xs mt-1">{minPriceError}</p>}
              </div>
              <div className='flex items-center gap-2'>
                <p className="font-jost text-sm text-Primary">Max : </p>
                <p className='font-jost text-base text-Primary'>{priceRange[1]}</p>
                {maxPriceError && <p className="text-red-500 text-xs mt-1">{maxPriceError}</p>}
              </div>
            </div>
            {/* Range Slider */}
            <Slider
              className="mt-2"
              range
              min={MIN_CREDIT}
              max={MAX_CREDIT}
              step={0.05}
              value={priceRange}
              onChange={(values) => {
                setPriceRange(values);
                validatePriceRange(values);
              }}
            />
          </div>
        </div>
        <p className='text-sm lg:text-base font-medium text-white flex items-center gap-[10px] bg-background2 py-2 px-5 rounded-[6px] cursor-pointer' onClick={() => setIsFilterModalVisible2(!isFilterModalVisible2)}>
          <img className='w-4 lg:w-auto' src={Filter} alt="Filter icon" /> Filter
        </p>
      </div>

      <div className="diamond_filter block sm:hidden px-3 w-full">
        <div>
          <div className="flex justify-between mt-5 md:mt-0">
            <div className='flex items-center gap-2'>
              <p className="font-jost text-sm text-Primary">Min :</p>
              <p className='font-jost text-base text-Primary'>{priceRange[0]}</p>
              {minPriceError && <p className="text-red-500 text-xs mt-1">{minPriceError}</p>}
            </div>
            <div className='flex items-center gap-2'>
              <p className="font-jost text-sm text-Primary">Max : </p>
              <p className='font-jost text-base text-Primary'>{priceRange[1]}</p>
              {maxPriceError && <p className="text-red-500 text-xs mt-1">{maxPriceError}</p>}
            </div>
          </div>
          {/* Range Slider */}
          <Slider className="mt-2" range min={MIN_CREDIT} max={MAX_CREDIT} step={0.05} value={priceRange} onChange={(values) => { setPriceRange(values); validatePriceRange(values); }} />
        </div>
      </div>

      <div className='flex justify-end max-w-[850px] w-full'>
        {isFilterModalVisible2 && (
          <div ref={dropdownRef} className="absolute z-10 border border-borderColor5 rounded-lg bg-background6 max-w-[224px] w-full p-3 mt-2 lg:mt-4 shadow-[0px_0px_6px_0px_#28236633]">
            <p className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor px-12 pb-2 cursor-pointer" onClick={NextResetTable}>Reset Table</p>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={Credit} onChange={() => handleToggle(setCredit)} /> Credit
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={BEContract} onChange={() => handleToggle(setBEContract)} /> BE Contract
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={BEGain1} onChange={() => handleToggle(setBEGain1)} /> BE+1 Gain
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={BEGain2} onChange={() => handleToggle(setBEGain2)} /> BE+2 Gain
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={BEGain3} onChange={() => handleToggle(setBEGain3)} /> BE+3 Gain
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={BEGain4} onChange={() => handleToggle(setBEGain4)} /> BE+4 Gain
            </label>
            <label className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
              <input type="checkbox" className='accent-accentColor w-[15px] h-[15px]' checked={BEGain5} onChange={() => handleToggle(setBEGain5)} /> BE+5 Gain
            </label>
          </div>
        )}
      </div>

      <div className="overflow-auto max-w-[850px] w-full mt-4 rounded-[6px] shadow-[0px_0px_6px_0px_#28236633]">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr className="bg-background2 text-white text-sm lg:text-base font-semibold">
              {Credit && <th className="px-2 py-2 min-w-16">Buying Power</th>}
              {Credit && <th className="border-x border-borderColor px-2 py-2 min-w-16">Credit</th>}
              {BEContract && <th className="border-x border-borderColor px-2 py-2 min-w-28">BE Contract</th>}
              {BEGain1 && <th className="border-x border-borderColor px-2 py-2 min-w-28">BE+1 Gain</th>}
              {BEGain2 && <th className="border-x border-borderColor px-2 py-2 min-w-28">BE+2 Gain</th>}
              {BEGain3 && <th className="border-x border-borderColor px-2 py-2 min-w-28">BE+3 Gain</th>}
              {BEGain4 && <th className="border-x border-borderColor px-2 py-2 min-w-28">BE+4 Gain</th>}
              {BEGain5 && <th className="px-2 py-2 min-w-28">BE+5 Gain</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPremiums.slice(0, showAll ? filteredPremiums.length : 5).map((premium, index) => {
              const originalIndex = premiums.indexOf(premium); // Get the original index in the full array
              const beContractValue = Number(BEContractTable[originalIndex]) ? BEContractTable[originalIndex] : 0;

              // Calculate the new column value based on formula
              const newColumnValue = (5 - premium) * 100 * beContractValue;
              return (
                <tr key={index} className="text-sm lg:text-base text-center text-Secondary bg-background6">
                  {Credit && <td className={`bg-background border-t border-borderColor px-2 py-2 ${AfterLossTable > newColumnValue ? "bg-background9" : "bg-background10"}`}>${newColumnValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>}
                  {Credit && <td className="border-t border-x border-borderColor px-2 py-2">${premium.toFixed(2)}</td>}
                  {BEContract && <td className="border-t border-x border-borderColor px-2 py-2">{(Number(BEContractTable[originalIndex]) ? BEContractTable[originalIndex] : 0)}</td>}
                  {BEGain1 && <td className="border-t border-x border-borderColor px-2 py-2">${Number(BE1GainTable[originalIndex]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className='block text-Secondary font-medium'>({(Number(BEContractTable[originalIndex]) ? BEContractTable[originalIndex] : 0) + 1})</span></td>}
                  {BEGain2 && <td className="border-t border-x border-borderColor px-2 py-2">${Number(BE2GainTable[originalIndex]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className='block text-Secondary font-medium'>({(Number(BEContractTable[originalIndex]) ? BEContractTable[originalIndex] : 0) + 2})</span></td>}
                  {BEGain3 && <td className="border-t border-x border-borderColor px-2 py-2">${Number(BE3GainTable[originalIndex]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className='block text-Secondary font-medium'>({(Number(BEContractTable[originalIndex]) ? BEContractTable[originalIndex] : 0) + 3})</span></td>}
                  {BEGain4 && <td className="border-t border-x border-borderColor px-2 py-2">${Number(BE4GainTable[originalIndex]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className='block text-Secondary font-medium'>({(Number(BEContractTable[originalIndex]) ? BEContractTable[originalIndex] : 0) + 4})</span></td>}
                  {BEGain5 && <td className="border-t border-borderColor px-2 py-2">${Number(BE5GainTable[originalIndex]).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className='block text-Secondary font-medium'>({(Number(BEContractTable[originalIndex]) ? BEContractTable[originalIndex] : 0) + 5})</span></td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center max-w-[850px] w-full">
        {filteredPremiums.length > 5 && (
          <button onClick={() => setShowAll(!showAll)} className="text-sm lg:text-base text-Secondary2 font-medium underline">
            {showAll ? 'See Less Levels' : 'See More Levels'}
          </button>
        )}
      </div>
    </>
  );
}

export default NextGamePlanDynamicLongMatrix;
