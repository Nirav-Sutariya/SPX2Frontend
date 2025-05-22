import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import { DateTime } from 'luxon';

const TradingViewOverview = () => {

  let appContext = useContext(AppContext);
  const marketData = appContext.marketData;

  if (!marketData || !marketData.spx || !marketData.rut || !marketData.ndx || !marketData.vix) {
    return <div className='text-sm text-Primary'>Wait For 10 Seconds Loading market data ...</div>;
  }

  // Timezone logic
  const timezone = 'America/New_York';
  const now = DateTime.now().setZone(timezone);
  const openingTime = DateTime.fromFormat('09:30 AM -04:00', 'hh:mm a ZZZ', { zone: timezone });
  const closingTime = DateTime.fromFormat('04:00 PM -04:00', 'hh:mm a ZZZ', { zone: timezone });

  const isMarketOpen = now >= openingTime && now <= closingTime;

  const renderBox = (label, color, data) => (
    <div className={`flex items-center rounded-md p-2 bg-background6 shadow-[0px_0px_8px_0px_#28236633]  ${isMarketOpen ? 'border border-[#4D8F78]' : 'border border-[#EF4646]'} bg-background6`}>
      <div className={`text-xs font-medium text-white w-9 h-7 ${color} rounded-full flex items-center justify-center mr-3`}>
        {label}
      </div>
      <div className="flex items-center gap-2">
        <div className="text-base text-Primary font-semibold -mb-1">
          {data.price} <span className="text-[10px] text-gray-400">USD</span>
        </div>
        <div className={`text-sm font-semibold ${parseFloat(data.change) >= 0 ? 'text-[#4D8F78]' : 'text-[#EF4646]'}`}>
          {parseFloat(data.change) >= 0 ? '+' : ''}
          {data.change}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-3 lg:gap-5">
      {renderBox('SPX', 'bg-[#C4162E]', marketData.spx)}
      {renderBox('RUT', 'bg-[#511732]', marketData.rut)}
      {renderBox('NDX', 'bg-[#0186AB]', marketData.ndx)}
      {renderBox('VIX', 'bg-[#2F9C30]', marketData.vix)}
    </div>
  );
};

export default TradingViewOverview;