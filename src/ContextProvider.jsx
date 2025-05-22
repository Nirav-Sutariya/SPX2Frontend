import { useState } from "react";
import App from "./App";
import { AppContext } from "./components/AppContext";

export default function ContextProvider() {

  const [appContext, setAppContext] = useState({
    email: "",
    otp: "",
    currency: null,
    cadRate: null,
    audRate: null,
    cadLiveRate: null,
    audLiveRate: null,
    marketData: null,
    marketTime: null,
    currencyTime: null,
    names: {},
    namesLong: {},
    namesDynamicShort: {},
    namesDynamicLong: {},
    buyingPowerStatic: [],
    buyingPowerStaticLong: [],
    buyingPowerDynamicShort: [],
    buyingPowerDynamicLong: [],
    tableVisibility: [],
    staticLevelDefaultValue: [],
    recordLimit: null,
    profilePhoto: null,
    userData: {
      first_name: '',
      last_name: '',
      slackID: '',
      phone: '',
      email: '',
      theme: "",
    },
    signupData: {
      first_name: '',
      email1: '',
      email2: '',
      password: '',
    },
    isAdmin: false,
    superUser: false,
    subscriptionHistory: [],
    subscription: null,
    staticShortKey: null,
    staticLongKey: null,
    dynamicShortKey: null,
    dynamicLongKey: null,
    dynamicNextGameShortKey: null,
    dynamicNextGameLongKey: null,
    subscriptionFeatures: {},
    adminDashboard: {},
    supportUserData: [],
    couponList: [],
    couponList2: [],
    userList: [],
    comparisonFeatures: [{ name: "", basic: false, plus: false, premium: false }],
    feature: [],
    plans: [],
    adminDashboardData: null,
    nextGamePlanShort: false,
    nextGamePlanLong: false,
    selectedUser: null,
    shortMatrixLength: null,
    longMatrixLength: null,
    shortTradePrice: null,
    longTradePrice: null,
  });

  return (<>
    <AppContext.Provider value={{ ...appContext, setAppContext }}>
      <App />
    </AppContext.Provider>
  </>)
}
