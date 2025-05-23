import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { DateTime } from 'luxon';
import GaugeChart from 'react-gauge-chart';

const AreaChart = ({ inputs2, theme, matrixTypeValue, price }) => {

  const calculateChartData = () => {
    const { shortPut, shortCall, longPut, longCall, premium, contracts } = inputs2;

    // Convert each variable to an integer
    const shortPutInt = parseInt(shortPut, 10);
    const shortCallInt = parseInt(shortCall, 10);
    const longPutInt = parseInt(longPut, 10);
    const longCallInt = parseInt(longCall, 10);

    // Calculate custom points and bounds
    const xAxisLeftSidedata = shortPut - 20;
    const xAxisRightSidedata = longCallInt + 20;
    const customBeforeShortPut = parseFloat(longPut) - parseFloat(premium);
    const customAfterShortCall = parseFloat(shortCall) + parseFloat(premium);
    const MaxLossCall = longCallInt - shortCallInt;
    const maximumValue = premium * 100 * contracts;
    const maxLossValue = (premium - MaxLossCall) * 100 * contracts;

    // Initialize x and y values
    const xValues = [];
    const yValues = [];

    // Left side: xAxisLeftSidedata to longPut
    for (let i = Math.floor(xAxisLeftSidedata / 5) * 5; i < shortPutInt; i += 5) {
      xValues.push(i);
    }

    // Key points
    xValues.push(shortPutInt, customBeforeShortPut, longPutInt);

    // Between shortPut and shortCall
    for (let i = Math.ceil(longPutInt / 5) * 5; i < shortCallInt; i += 5) {
      xValues.push(i);
    }

    xValues.push(shortCallInt, customAfterShortCall, longCallInt);

    // Right side: longCall to xAxisRightSidedata
    for (let i = longCallInt + 5; i <= Math.ceil(xAxisRightSidedata / 5) * 5; i += 5) {
      xValues.push(i);
    }

    // Remove duplicates and sort
    const finalXValues = [...new Set(xValues)].sort((a, b) => a - b);

    // Generate yValues
    finalXValues.forEach((x) => {
      if (x <= shortPutInt) {
        yValues.push(maxLossValue); // Left side (max loss)
      } else if (x === customBeforeShortPut || x === customAfterShortCall) {
        yValues.push(0);
      } else if (x >= longPutInt && x <= shortCallInt) {
        yValues.push(maximumValue); // Between shortPut and shortCall (max profit)
      } else if (x >= longCallInt) {
        yValues.push(maxLossValue); // Right side (max loss)
      }
    });

    return { xValues: finalXValues, yValues, maximumValue, maxLossValue, shortPutInt, shortCallInt, longCallInt, longPutInt, customBeforeShortPut, customAfterShortCall };
  };

  const { xValues, yValues, maximumValue, maxLossValue, shortPutInt, shortCallInt, longCallInt, longPutInt, customBeforeShortPut, customAfterShortCall } = calculateChartData();
  const backgroundColor = theme === "dark" ? "#1B2831" : "#ffffff";
  const negativeZoneColor = theme === "dark" ? "rgba(255, 0, 0, 0.5)" : "rgba(255, 0, 0, 0.3)";
  const positiveZoneColor = theme === "dark" ? "rgba(0, 255, 0, 0.5)" : "rgba(0, 255, 0, 0.3)";
  const axisTextColor = theme === "dark" ? "#e0e0e0" : "#000000";
  const spxValue = parseFloat(price?.toString().replace(/,/g, '')); // removes comma and converts to float

  const options = {
    chart: {
      type: "area",
      backgroundColor,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: xValues,
      type: 'linear',
      tickInterval: 5,
      labels: {
        style: {
          color: axisTextColor,
        },
        formatter: function () {
          return Math.round(this.value);
        },
      },
      title: {
        style: {
          color: axisTextColor,
        },
      },
      allowDecimals: false,
      plotLines: [
        {
          color: 'red',
          width: 2,
          value: spxValue,
          dashStyle: 'Dash',
          label: {
            align: 'center',
            rotation: 0,
            y: -0,
            text: spxValue,
            style: {
              color: 'red',
            }
          },
          zIndex: 1,
        }
      ],
    },
    yAxis: {
      title: {
        text: "Profit/Loss",
        style: {
          color: axisTextColor,
        },
      },
      labels: {
        style: {
          color: axisTextColor,
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<span style="font-size:10px">{point.key}</span><br/>',
      pointFormatter: function () {
        return `<span>${this.series.name}: <b>${this.y.toFixed(2)}</b></span>`;
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "Profit/Loss",
        data: xValues.map((x, i) => [x, -yValues[i]]),
        zones: [
          {
            value: 0,
            color: negativeZoneColor,
          },
          {
            value: Number.MAX_VALUE,
            color: positiveZoneColor,
          },
        ],
      },
    ],

    credits: {
      enabled: false,
    },
  };

  const timezone = 'America/New_York';
  const openingHour = '09:30 AM';
  const closingHour = '04:00 PM';

  const shouldMarketBeOpen = () => {
    const now = DateTime.now().setZone(timezone);
    const today = now.toFormat('yyyy-MM-dd');
    const openTime = DateTime.fromFormat(`${today} ${openingHour}`, 'yyyy-MM-dd hh:mm a', { zone: timezone });
    const closeTime = DateTime.fromFormat(`${today} ${closingHour}`, 'yyyy-MM-dd hh:mm a', { zone: timezone });
    return now >= openTime && now <= closeTime;
  };

  const getMarketStatus = (spxValue, isMarketOpen) => {
    const insideMin = shortPutInt;
    const insideMax = shortCallInt;

    const partiallyInsideBuffer = 2.15;
    const partiallyOutsideBuffer = 5;

    const partiallyInsideMin = insideMin - partiallyInsideBuffer;
    const partiallyInsideMax = insideMax + partiallyInsideBuffer;

    const partiallyOutsideMin = insideMin - partiallyOutsideBuffer;
    const partiallyOutsideMax = insideMax + partiallyOutsideBuffer;

    if (isMarketOpen) {
      if (spxValue >= insideMin && spxValue <= insideMax) return 'Inside';
      if ((spxValue >= partiallyInsideMin && spxValue < insideMin) || (spxValue > insideMax && spxValue <= partiallyInsideMax)) return 'Partially Inside';
      if ((spxValue >= partiallyOutsideMin && spxValue < partiallyInsideMin) || (spxValue > partiallyInsideMax && spxValue <= partiallyOutsideMax)) return 'Partially Outside';
      return 'Outside';
    } else {
      if (spxValue >= insideMin && spxValue <= insideMax) return `${matrixTypeValue} Close Inside`;
      if ((spxValue >= partiallyInsideMin && spxValue < insideMin) || (spxValue > insideMax && spxValue <= partiallyInsideMax)) return `${matrixTypeValue} Close Partially Inside`;
      if ((spxValue >= partiallyOutsideMin && spxValue < partiallyInsideMin) || (spxValue > partiallyInsideMax && spxValue <= partiallyOutsideMax)) return `${matrixTypeValue} Close Partially Outside`;
      return `${matrixTypeValue} Close Outside`;
    }
  };


  const [isMarketOpen, setIsMarketOpen] = useState(false);

  useEffect(() => {
    setIsMarketOpen(shouldMarketBeOpen());
  }, []);

  const statusText = getMarketStatus(spxValue, isMarketOpen);
  const minRange = longPutInt - 5;
  const maxRange = longCallInt + 5;
  const percent = Math.max(0, Math.min(1, (spxValue - minRange) / (maxRange - minRange)));



  return (
    <div className="lg:pr-1 xl:pr-3 lg:pl-1 relative">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="flex justify-center gap-5 -mt-10 pb-5">
        <p className="text-sm text-[#089981] ">Maxmum Profit : {parseFloat(Math.abs(maxLossValue)).toFixed(2)}</p>
        <p className="text-sm text-[#f23645] ">Maxmum Loss : -{parseFloat(Math.abs(maximumValue)).toFixed(2)}</p>
      </div>
      <div className="pl-4 pb-5 -mt-2">
        <p className="text-sm text-Primary mt-1"><span className="font-semibold">Max Profit :</span> {matrixTypeValue} close below {shortPutInt} or close above {longCallInt}</p>
        <p className="text-sm text-Primary mt-1"><span className="font-semibold">Partial Profit :</span> {matrixTypeValue} close between {shortPutInt} and {customBeforeShortPut} or between {customAfterShortCall} and {longCallInt}</p>
        <p className="text-sm text-Primary mt-1"><span className="font-semibold">Partial Loss :</span> {matrixTypeValue} close between {customBeforeShortPut} and {longPutInt} or between {shortCallInt} and {customAfterShortCall}</p>
        <p className="text-sm text-Primary "><span className="font-semibold">Max Loss :</span> {matrixTypeValue} close between {longPutInt} and {shortCallInt}</p>
      </div>

      <div className="w-full p-4">
        <GaugeChart
          id="spx-status-gauge"
          nrOfLevels={30}
          arcsLength={[0.222, 0.589, 0.222]} // normalized from [2.85, 2.15, 5, 2.85]
          colors={['#f39c12', '#2ecc71', '#f39c12']}
          percent={percent}
          arcPadding={0.03}
          textColor="#"
          formatTextValue={() => statusText}
        />

        <p className="text-center mt-4 font-medium text-lg">Status: {statusText}</p>
      </div>
    </div>
  );
};

export default AreaChart;