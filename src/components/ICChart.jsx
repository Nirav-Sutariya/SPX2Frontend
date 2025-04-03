import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AreaChart = ({ inputs, theme, matrixTypeValue }) => {

  const calculateChartData = () => {
    const { shortPut, shortCall, longPut, longCall, premium, contracts } = inputs;

    // Convert each variable to an integer
    const shortPutInt = parseInt(shortPut, 10);
    const shortCallInt = parseInt(shortCall, 10);
    const longPutInt = parseInt(longPut, 10);
    const longCallInt = parseInt(longCall, 10);

    // Essential calculations
    const xAxisLeftSidedata = longPutInt - 20;
    const xAxisRightSidedata = longCallInt + 20;
    const customBeforeShortPut = parseFloat(shortPut) - parseFloat(premium);
    const customAfterShortCall = parseFloat(shortCall) + parseFloat(premium);
    const MaxLossCall = longCallInt - shortCallInt;
    const maximumValue = premium * 100 * contracts;
    const maxLossValue = (premium - MaxLossCall) * 100 * contracts;

    const xValues = [];
    const yValues = [];

    // **Left side: xAxisLeftSidedata to longPut**
    // Increment by 5
    for (let i = Math.floor(xAxisLeftSidedata / 5) * 5; i < longPutInt; i += 5) {
      xValues.push(i);
    }

    xValues.push(longPutInt, customBeforeShortPut, shortPutInt);

    for (let i = Math.ceil(shortPutInt / 5) * 5; i < shortCallInt; i += 5) {
      xValues.push(i);
    }

    // Add `shortCall` and `customAfterShortCall` (exact values)
    xValues.push(shortCallInt, customAfterShortCall, longCallInt);

    for (let i = longCallInt + 5; i <= Math.ceil(xAxisRightSidedata / 5) * 5; i += 5) {
      xValues.push(i);
    }

    // **Remove duplicates and sort xValues**
    const finalXValues = [...new Set(xValues)].sort((a, b) => a - b);

    // **Generate yValues based on xValues**
    finalXValues.forEach((x) => {
      if (x <= longPutInt) {
        yValues.push(maxLossValue); // Left side (max loss)
      } else if (x === customBeforeShortPut || x === customAfterShortCall) {
        yValues.push(0);
      } else if (x >= shortPutInt && x <= shortCallInt) {
        yValues.push(maximumValue); // Between shortPut and shortCall (maximum profit)
      } else if (x >= longCallInt) {
        yValues.push(maxLossValue); // Right side (max loss)
      }
    });

    return { xValues: finalXValues, yValues, maxLossValue, maximumValue, shortPutInt, shortCallInt, longCallInt, longPutInt, customBeforeShortPut, customAfterShortCall };
  };

  const { xValues, yValues, maxLossValue, maximumValue, shortPutInt, shortCallInt, longCallInt, longPutInt, customBeforeShortPut, customAfterShortCall } = calculateChartData();
  const backgroundColor = theme === "dark" ? "#1B2831" : "#ffffff";
  const negativeZoneColor = theme === "dark" ? "rgba(255, 0, 0, 0.5)" : "rgba(255, 0, 0, 0.3)";
  const positiveZoneColor = theme === "dark" ? "rgba(0, 255, 0, 0.5)" : "rgba(0, 255, 0, 0.3)";
  const axisTextColor = theme === "dark" ? "#e0e0e0" : "#000000";

  const options = {
    chart: {
      type: "area",
      backgroundColor,
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: xValues, // Use generated x-axis values
      labels: {
        style: {
          color: axisTextColor, // X-axis label color
        },
        formatter: function () {
          return Math.round(this.value); // Ensure only integer values are displayed
        },
      },
      title: {
        style: {
          color: axisTextColor, // X-axis title color
        },
      },
      allowDecimals: false, // Disable decimals on the x-axis
    },
    yAxis: {
      title: {
        text: "Profit/Loss",
        style: {
          color: axisTextColor, // Y-axis title color
        },
      },
      labels: {
        style: {
          color: axisTextColor, // Y-axis label color
        },
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: '<span style="font-size:10px">{point.key}</span><br/>',
      pointFormatter: function () {
        const { x, y } = this; // Current x and y
        const index = xValues.indexOf(x);

        // If on a crossing, calculate the midpoint for tooltip
        if (index > 0 && (yValues[index - 1] * y < 0)) {
          const midpoint = (yValues[index - 1] + yValues[index]) / 2;
          return `<span>Midpoint: <b>${midpoint.toFixed(2)}</b></span>`;
        }
        return `<span>${this.series.name}: <b>${y.toFixed(2)}</b></span>`;
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false, // Disable markers on all data points
        },
      },
    },
    series: [
      {
        name: "Profit/Loss",
        data: yValues, // Use calculated y-axis values
        zones: [
          {
            value: 0, // Values less than 0 will be red
            color: negativeZoneColor, // Red for negative
          },
          {
            value: Number.MAX_VALUE, // Positive values will be green
            color: positiveZoneColor, // Green for positive
          },
        ],
      },
    ],
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="lg:pr-1 xl:pr-3 lg:pl-1">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="flex justify-center gap-5 -mt-10 pb-5">
        <p className="text-sm text-[#089981] ">Maxmum Profit : {parseFloat(maximumValue).toFixed(2)}</p>
        <p className="text-sm text-[#f23645] ">Maxmum Loss : {parseFloat(maxLossValue).toFixed(2)}</p>
      </div>
      <div className="pl-4 pb-5 -mt-2">
        <p className="text-sm text-Primary "><span className="font-semibold">Max Profit :</span> {matrixTypeValue} close between {shortPutInt} and {shortCallInt}</p>
        <p className="text-sm text-Primary mt-1"><span className="font-semibold">Partial Profit :</span> {matrixTypeValue} close between {shortPutInt} and {customBeforeShortPut} or between {shortCallInt} and {customAfterShortCall}</p>
        <p className="text-sm text-Primary mt-1"><span className="font-semibold">Partial Loss :</span> {matrixTypeValue} close between {customBeforeShortPut} and {longPutInt} or between {customAfterShortCall} and {longCallInt}</p>
        <p className="text-sm text-Primary mt-1"><span className="font-semibold">Max Loss :</span> {matrixTypeValue} close above {longCallInt} or close below {longPutInt}</p>
      </div>
    </div>
  );
};

export default AreaChart;