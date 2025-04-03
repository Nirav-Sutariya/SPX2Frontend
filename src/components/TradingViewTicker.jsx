import React, { useEffect } from "react";

const TradingViewTicker = ({ theme }) => {
  useEffect(() => {
    // Append the TradingView widget script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: "SP500",
          title: "S&P 500 Index",
        },
        {
          proName: "ES1!",
          title: "E-Mini S&P 500 Futures",
        },
        {
          proName: "NQ1!",
          title: "E-Mini Nasdaq 100 Futures",
        },
        {
          proName: "NASDAQ:AAPL",
          title: "Apple Inc.",
        },
        {
          proName: "NASDAQ:MSFT",
          title: "Microsoft Corporation",
        },
        {
          proName: "NASDAQ:NVDA",
          title: "NVIDIA Corporation",
        },
        {
          proName: "NASDAQ:AMZN",
          title: "Amazon.com, Inc.",
        },
        {
          proName: "NASDAQ:GOOGL",
          title: "Alphabet Inc. (Google)",
        },
        {
          proName: "NASDAQ:META",
          title: "Meta Platforms, Inc.",
        },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: theme,
      locale: "en",
    });

    document.getElementById("tradingview-widget-container").appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      const container = document.getElementById("tradingview-widget-container");
      if (container) container.innerHTML = "";
    };
  }, [theme]);


  return (
    <div id="tradingview-widget-container" className="h-[74px] md:h-[46px]">
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
      </div>
    </div>
  );
};

export default TradingViewTicker;
