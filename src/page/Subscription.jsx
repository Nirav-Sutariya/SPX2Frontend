import React, { useContext, useMemo, useState, useRef, useEffect } from "react";
import DropdownIcon from "../assets/svg/DropdownIcon.svg";
import TrueIcon from "../assets/Images/Subscription/TrueIcon.svg";
import FalseIcon from "../assets/Images/Subscription/FalseIcon.svg";
import True2Icon from "../assets/Images/Subscription/True2Icon.svg";
import False2Icon from "../assets/Images/Subscription/False2Icon.svg";
import CancelPlanIcon from "../assets/Images/Subscription/CancelPlanIcon.svg";
import PopupCloseIcon from '../assets/Images/SuperDashboard/PopupCloseIcon.svg';
import axios from "axios";
import { Link } from "react-router-dom";
import { formattedDate1 } from "../components/utils";
import { AppContext } from "../components/AppContext";
import { getToken, getUserId } from "./login/loginAPI";

const Subscription = () => {

  const emailRef = useRef(null);
  const couponRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [plans, setPlans] = useState([]);
  let appContext = useContext(AppContext);
  const [plan, setPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [couponName, setCouponName] = useState("");
  const [extraLimit, setExtraLimit] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [msgM1, setMsgM1] = useState({ msg: "", type: "" });
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showChoosePlanModal, setShowChoosePlanModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(appContext.subscription);
  const [isMatrixLimitModalOpen, setMatrixLimitModalOpen] = useState(false);
  const [comparisonFeatures, setComparisonFeatures] = useState(appContext.feature);
  const [email, setEmail] = useState(sessionStorage.getItem("userEmail") || appContext.userData.email);


  // Find Plan List
  async function fetchPlan() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SUBSCRIPTION_PLAN_LIST, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      });
      if (response.status === 200) {
        setPlans(response.data.data);
        appContext.setAppContext((curr) => ({
          ...curr,
          plans: response.data.data,
        }));

      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Get Subscription Purchase Plan
  async function getPurchasePlan(selectedPlanId) {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_PURCHASE_PLAN, { userId: getUserId(), email, subscriptionId: selectedPlanId, couponName: couponName }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        window.location.href = response.data.data;
      }
    } catch (error) {
      if (error.message.includes("Network Error")) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      } else if (error.response?.status === 404) {
        const message = error.response?.data?.message || "Coupon not found with given data.";
        setMsg({ type: "error", msg: message });
      } else if (error.response?.status === 409) {
        const message = error.response?.data?.message || "This plan cannot be selected.";
        setMsgM1({ type: "error", msg: message });
      }
    }
  }

  // Get Subscription Purchase Extra Record Limit
  async function getPurchaseExtraRecordLimit() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_PURCHASE_EXTRA_RECORD_LIMIT, { userId: getUserId(), email, recordLimit: extraLimit }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        window.location.href = response.data.data;
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Subscription By Detail Find
  async function fetchUserSubscription() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SUBSCRIPTION_BY_ID, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setCurrentPlan(response.data.data);
        appContext.setAppContext((curr) => {
          return { ...curr, subscription: response.data.data }
        })
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Comparison Features Get Api 
  async function fetchComparisonFeatures() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_COMPARISON_FEATURE_LIST_URL, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setComparisonFeatures(response.data.data);
        appContext.setAppContext({ ...appContext, feature: response.data.data });
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // Cancel Subscription Plan
  const handleCancelSubscription = async () => {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_CANCEL_USER_SUBSCRIPTION, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setMsg({ type: "info", msg: "Subscription Cancelled..." });
        window.location.reload();
      } else {
        setMsg({ type: "error", msg: "No record found..." });
      }
      await fetchUserSubscription();
      setShowModal(false);
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  };

  useMemo(async () => {
    if (isLoading) {
      await fetchPlan();
      await fetchUserSubscription();
      setIsLoading(false);
    }
  }, [isLoading]);

  useMemo(() => {
    if (appContext.feature.length === 0) {
      fetchComparisonFeatures();
    }
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" });
      }, 20 * 100);
    else if (msgM1.type !== "")
      setTimeout(() => {
        setMsgM1({ type: "", msg: "" });
      }, 20 * 100);
  }, [msg, msgM1, appContext.feature, appContext.subscription]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', showModal || showChoosePlanModal);
    return () => document.body.classList.remove('no-scroll');
  }, [showModal, showChoosePlanModal]);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      nextRef.current.focus();
    }
  };

  // Comparison Features Click To Scrolling Bottom
  const handlePlan = () => {
    setPlan((prevPlan) => {
      const newPlanState = !prevPlan;
      if (newPlanState) {
        setTimeout(() => {
          window.scrollTo({
            top: window.scrollY + 650,
            behavior: "smooth",
          });
        }, 0);
      }
      return newPlanState;
    });
  };

  // Store email in sessionStorage whenever it changes
  useEffect(() => {
    if (email) {
      sessionStorage.setItem("userEmail", email);
    }
  }, [email]);


  return (<>
    {isLoading ?
      <div className="flex justify-center items-center h-[100vh]">
        <div role="status">
          <svg aria-hidden="true" className="w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      :
      <div className="px-3 lg:pl-10 lg:px-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 lg:gap-7">
          <h2 className="text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold"> Subscription </h2>
          <Link to="/subscription-history" className="text-base lg:text-xl font-semibold text-white py-[6px] px-5 sm:px-[30px] rounded-md bg-[#2C7CAC]"> Subscription History </Link>
          {msg.msg !== "" && (<p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}> {msg.msg}. </p>)}
        </div>

        {/* Only Current Active Plan Detail Visible on Section */}
        {currentPlan && currentPlan.subscriptionName === plans[1].name && <div className="mt-11 p-5 lg:p-[30px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]">
          <div className="flex flex-wrap">
            <div className="sm:border-r border-borderColor sm:max-w-[302px] md:max-w-[352px] lg:max-w-[402px] 2xl:max-w-[552px] w-full pr-4 lg:pr-8">
              <div className="flex items-center gap-5">
                <h3 className="text-lg lg:text-[28px] lg:leading-[42px] font-semibold text-Primary"> {currentPlan.subscriptionName[0].toUpperCase() + currentPlan.subscriptionName.slice(1)} Plan </h3>
                <li className="text-xs lg:text-base text-[#6FBA47]">Active</li>
              </div>
              <p className="text-xs lg:text-base text-Secondary2 mt-3"> Start Date : {formattedDate1(currentPlan.subscriptionStartDate)} | Expiry Date : {formattedDate1(currentPlan.subscriptionEndDate)} </p>
              <div className="flex items-center gap-2">
                <p className="text-xs lg:text-base text-Secondary2 mt-[10px]"> Payment : </p>
                <div>
                  <p className="text-sm lg:text-lg text-Primary font-medium mt-[10px]"> Amount : ${currentPlan.totalPrice}/Year </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-0 sm:pl-4 md:pl-8">
              <li className="text-sm lg:text-lg font-medium text-Primary mb-[11px]"> Features Included: </li>
              <p className="text-xs lg:text-base text-Secondary2 mt-1 flex gap-[22px]"><img src={currentPlan.recordLimit === 0 ? FalseIcon : TrueIcon} alt="" /> Allow To Save {currentPlan.recordLimit > 0 && (currentPlan.recordLimit)} Records </p>
              {currentPlan.subscriptionFeatures.map((item) => (
                <p key={item.subscriptionFeatureId} className="text-xs lg:text-base text-Secondary2 mt-1 flex gap-[22px]">
                  <img src={item.available ? TrueIcon : FalseIcon} alt="Feature Icon" />{item.name}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-5 mt-5 lg:mt-10">
            <div className="border border-borderColor rounded-md bg-background6 w-full">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-sm lg:text-lg text-Primary font-medium text-start px-4 md:px-6 xl:px-[50px] py-2 md:py-2 rounded-md"> Description </th>
                    <th className="text-sm lg:text-lg text-Primary font-medium text-start px-4 md:px-6 xl:px-[50px] py-2 md:py-2 rounded-md border-l border-borderColor"> Amount </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-xs lg:text-base text-Secondary2 px-4 md:px-6 xl:px-[50px] py-2 md:py-2 border-t border-r border-borderColor "> {currentPlan.subscriptionName[0].toUpperCase() + currentPlan.subscriptionName.slice(1)} Plan Subscription </td>
                    <td className="text-xs lg:text-base text-Secondary2 px-4 md:px-6 xl:px-[50px] py-2 md:py-2 border-t border-borderColor "> ${currentPlan.subscriptionPrice} </td>
                  </tr>
                  <tr>
                    <td className="text-xs lg:text-base text-Secondary2 px-4 md:px-6 xl:px-[50px] py-2 md:py-2 border-t border-r border-borderColor "> Discount </td>
                    <td className="text-xs lg:text-base text-Secondary2 px-4 md:px-6 xl:px-[50px] py-2 md:py-2 border-t border-borderColor "> ${currentPlan.couponDiscount} </td>
                  </tr>
                  <tr>
                    <td className="text-xs lg:text-base text-Secondary2 px-4 md:px-6 xl:px-[50px] py-2 md:py-2 border-t border-r border-borderColor "> Total Amount Paid </td>
                    <td className="text-xs lg:text-base text-Secondary2 px-4 md:px-6 xl:px-[50px] py-2 md:py-2 border-t border-borderColor "> ${currentPlan.totalPrice} </td>
                  </tr>
                  <tr>
                    <td className="text-xs lg:text-base text-Secondary2 px-4 md:px-6 xl:px-[50px] py-2 md:py-2 border-t border-r border-borderColor"> Payment Date: </td>
                    <td className="text-xs lg:text-base text-Secondary2 px-4 md:px-6 xl:px-[50px] py-2 md:py-2 border-t border-borderColor"> {formattedDate1(currentPlan.subscriptionStartDate)} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {((!appContext.superUser) && (currentPlan.subscriptionName === plans[1].name)) && (
            <p className="text-xs lg:text-base text-Primary font-medium text-end underline mt-[6px] cursor-pointer" onClick={() => { setShowModal(true); }}> Cancel Plan </p>
          )}

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
              <div className="p-4 lg:p-[30px] border border-borderColor5 rounded-lg bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-[360px] lg:w-[486px]">
                <div className="flex justify-center">
                  <div className="mx-auto p-5 lg:p-7 border border-borderColor rounded-md bg-background3">
                    <img className="w-7 lg:w-auto" src={CancelPlanIcon} alt="Reset Icon" />
                  </div>
                </div>
                <h2 className="text-lg lg:text-[28px] lg:leading-[33px] font-semibold text-Secondary2 mx-auto max-w-[600px] mt-5 text-center"> Cancel Subscription Plan </h2>
                <h2 className="text-base lg:text-[18px] lg:leading-[33px] text-Secondary2 mx-auto max-w-[400px] lg:mt-2 text-center"> Are you sure you want to cancel your subscription? </h2>
                <div className="flex justify-between gap-3 mt-5 lg:mt-9">
                  <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 border border-borderColor3 bg-background5 rounded-md w-full" onClick={() => setShowModal(false)}> Cancel </button>
                  <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full" onClick={handleCancelSubscription} > Confirm </button>
                </div>
              </div>
            </div>
          )}
        </div>}

        <h3 className="text-2xl lg:text-[32px] lg:leading-[48px] font-semibold text-Primary mt-10 text-center"> Choose Your Plan </h3>

        {/* All 3 Plan */}
        <div className="grid lg:flex lg:flex-none justify-center gap-5 xl:gap-10 mt-4 lg:mt-[30px]">

          {/* Plan 1 And Plan 2 */}
          {Array.isArray(plans) && plans.slice(0, 2).map((plan, index) => (
            <div key={index} className={`flex flex-col justify-between py-[23px] max-w-[360px] w-full border border-borderColor4 rounded-md ${index === 1 ? 'bg-ButtonBg' : 'bg-background6'} shadow-[0px_0px_10px_0px_#2823664D]`} >
              <div>
                <p className={`text-base lg:text-xl font-semibold ${index === 1 ? 'text-white border border-white' : 'text-Primary border border-borderColor3'} p-[5px] lg:p-2  rounded-md text-center w-[150px] mx-auto `}>
                  {plan.name || "Basic"}
                </p>
                <p className={`text-3xl lg:text-[60px] lg:leading-[70px] font-semibold ${index === 1 ? 'text-white' : 'text-Primary'} text-center mt-3`}>
                  ${Number(plan.price).toFixed(0) || 0}
                </p>
                <p className={`text-sm font-semibold ${index === 1 ? 'text-white' : 'text-Primary'} text-center`}>User</p>
                <div className="px-5 2xl:px-10 mx-auto">
                  {plan?.features?.length > 0 &&
                    plan.features.map((feature, i) => (
                      <p
                        key={feature.subscriptionFeatureId || i}
                        className={`text-sm font-medium ${index === 1 ? 'text-white' : 'text-Primary'} flex items-center gap-[22px] mt-3 `} >
                        <img src={feature.available ? TrueIcon : FalseIcon} alt="" />
                        <span>{feature.name}</span>
                      </p>
                    ))}
                  <p className={`text-sm font-medium ${index === 1 ? 'text-white' : 'text-Primary'} flex items-center gap-[22px] mt-3`}>
                    <img src={plan.recordLimit === 0 ? FalseIcon : TrueIcon} alt="" /> Allow To Save {plan.recordLimit > 0 && plan.recordLimit} Matrix
                  </p>
                </div>
              </div>

              {index === 0 ? (
                <button onClick={() => { getPurchasePlan(plan._id); }} disabled={(currentPlan && currentPlan.subscriptionName === plans[1].name)} className={`text-base lg:text-xl font-semibold text-white bg-ButtonBg py-2 lg:py-[13px] px-5 lg:px-9 text-center mt-10 w-[170px] lg:w-[229px] mx-auto rounded-md ${(currentPlan && currentPlan.subscriptionName === plans[1].name) ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
                  {currentPlan && currentPlan.subscriptionName === plans[0].name ? "Activated Plan" : "Choose Plan"}
                </button>
              ) : (
                <button onClick={() => { setShowChoosePlanModal(true); setSelectedPlanId(plan._id); }} disabled={(currentPlan && currentPlan.subscriptionName === plans[1].name)} className={`text-base lg:text-xl font-semibold text-Primary bg-background5 py-2 mt-[10px] lg:py-[13px] px-5 lg:px-9 text-center w-[170px] lg:w-[229px] mx-auto rounded-md ${(currentPlan && currentPlan.subscriptionName === plans[1].name) ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
                  {currentPlan && currentPlan.subscriptionName === plans[1].name ? "Activated Plan" : "Choose Plan"}
                </button>
              )}
            </div>
          ))}

          {/* Plan 3 */}
          <div className="flex flex-col justify-between py-[23px] max-w-[360px] w-full border border-borderColor4 rounded-md bg-background6 shadow-[0px_0px_10px_0px_#2823664D]">
            <div>
              <p className="text-base lg:text-xl font-semibold text-Primary p-[5px] lg:p-2 border border-borderColor3 rounded-md text-center w-[147px] mx-auto"> Premium</p>
              <p className="text-3xl lg:text-[34px] lg:leading-[70px] font-semibold text-Primary text-center mt-3">  Coming Soon </p>
              <p className="text-sm font-semibold text-Primary text-center"> User/Year </p>
              <div className="px-5 2xl:px-10 mx-auto">
                <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                  <img src={TrueIcon} alt="" /> Allow To Save 80 Matrix
                </p>
                <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                  <img src={TrueIcon} alt="" /><span>Everything in the Plus Plan</span>
                </p>
                <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                  <img src={TrueIcon} alt="" /><span>Trade Ledger with Advanced Analytics</span>
                </p>
                <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                  <img src={TrueIcon} alt="" /><span>AI-Powered Chat Assistant</span>
                </p>
                <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                  <img src={TrueIcon} alt="" /><span>Multi-Algo Stats & Insights</span>
                </p>
                <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                  <img src={TrueIcon} alt="" /><span>Key Gamma Support & Resistance Level with ToS/TV indicator</span>
                </p>
                <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                  <img src={TrueIcon} alt="" /><span>Advanced Performance Metrics</span>
                </p>
                <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                  <img src={TrueIcon} alt="" /><span>Advanced Dashboard View</span>
                </p>
                <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                  <img src={TrueIcon} alt="" /><span>Allow To Save 80 Matrix</span>
                </p>
              </div>
            </div>
            <div className="grid">
              <p className="text-xs font-medium text-Primary text-center mt-7 px-5">
                *The subscription will be billed on a yearly basis.
              </p>
              <button className="text-sm lg:text-lg font-semibold text-white bg-ButtonBg py-2 lg:py-[13px] px-5 lg:px-9 text-center mt-[10px] w-[170px] lg:w-[229px] mx-auto rounded-md opacity-50 cursor-not-allowed">
                Coming Q3 2025
              </button>
            </div>
          </div>
        </div>

        {msgM1.msg && (<div className={`text-sm mt-2 text-red-500`}> {msgM1.msg} </div>)}

        {/* Extra Matrix Limit Section */}
        {currentPlan && currentPlan.subscriptionName === plans[1].name && <div className="mt-11 p-5 lg:p-[30px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]">
          <p className="block text-lg lg:text-2xl text-Primary font-medium">Purchase Extra Limit</p>
          <p className="text-sm text-Primary mt-2">Need more access? Upgrade your plan with our Purchase Extra Limit feature! Whether you're hitting usage caps or need additional resources, this option lets you extend your limits seamlessly. No need to change your entire subscription—just add extra limits as needed.</p>
          <div className="flex justify-end">
            <button className="text-base lg:text-xl font-semibold text-white bg-ButtonBg py-2 lg:py-3 px-5 lg:px-10 mt-3 text-center w-auto rounded-md" onClick={() => setMatrixLimitModalOpen(true)}> Get </button>
          </div>
        </div>}

        {/* Plan Popup Section */}
        {showChoosePlanModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
            <div className="relative p-[30px] pt-1 bg-background6 rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[486px]">
              <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-8" onClick={() => setShowChoosePlanModal(false)} src={PopupCloseIcon} alt="" />
              <div>
                <label className="block text-lg text-Primary font-medium mt-3">Email</label>
                <input type="email" name="email" placeholder='Enter your email' disabled value={email} ref={emailRef} onKeyDown={(e) => handleKeyDown(e, couponRef)} onChange={(e) => setEmail(e.target.value)} className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7 cursor-not-allowed" />
              </div>
              <div className="mt-4">
                <label className="block text-lg text-Primary font-medium">Coupon</label>
                <input type="text" name="coupon" placeholder='Enter Coupon name(Optional)' value={couponName} ref={couponRef} onChange={(e) => setCouponName(e.target.value)} className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input type="checkbox" id="terms-checkbox" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} className="h-4 w-4 border border-borderColor accent-accentColor" />
                <label htmlFor="terms-checkbox" className="text-sm text-Primary"> I agree to the <Link to="/help-support?openTerms=true" className="font-medium">Terms of Service</Link> And <Link to="/help-support?openTerms=true" className="font-medium">Privacy Policy</Link> </label>
              </div>
              {msg.msg !== "" && (
                <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}> {msg.msg} </p>
              )}
              <button className={`text-base lg:text-xl font-semibold text-white bg-ButtonBg py-2 lg:py-3 px-5 lg:px-10 mt-5 text-center w-full rounded-md ${!termsChecked ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!termsChecked} onClick={() => { if (selectedPlanId) { getPurchasePlan(selectedPlanId); } }} >
                Pay By Card
              </button>
            </div>
          </div>
        )}

        {/* Extra Matrix Limit Popup Section */}
        {isMatrixLimitModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
            <div className="relative p-[30px] pt-1 bg-background6 rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[486px]">
              <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-8" onClick={() => setMatrixLimitModalOpen(false)} src={PopupCloseIcon} alt="" />
              <div>
                <label className="block text-lg text-Primary font-medium mt-3">Email</label>
                <input type="email" name="email" placeholder='Enter your email' disabled value={email} className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7 cursor-not-allowed" />
              </div>
              <div className="mt-4">
                <label className="block text-lg text-Primary font-medium">Purchase Extra Limit</label>
                <input type="text" name="coupon" placeholder='Enter purchase extra limit' value={extraLimit} onChange={(e) => setExtraLimit(e.target.value)} className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input type="checkbox" id="terms-checkbox" checked={termsChecked} onChange={() => setTermsChecked(!termsChecked)} className="h-4 w-4 border border-borderColor accent-accentColor" />
                <label htmlFor="terms-checkbox" className="text-sm text-Primary"> I agree to the <Link to="/help-support?openTerms=true" className="font-medium">Terms of Service</Link> And <Link to="/help-support?openTerms=true" className="font-medium">Privacy Policy</Link> </label>
              </div>
              <button className={`text-base lg:text-xl font-semibold text-white bg-ButtonBg py-2 lg:py-3 px-5 lg:px-10 mt-5 text-center w-full rounded-md ${!termsChecked ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!termsChecked} onClick={getPurchaseExtraRecordLimit} >
                Pay By Card
              </button>
            </div>
          </div>
        )}

        {/* Comparison Features Section */}
        {comparisonFeatures.length > 0 && (
          <>
            <div className={`text-center p-3 mt-10 border border-borderColor5 rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer ${plan ? "mb-0" : "mb-5"} `} onClick={handlePlan}>
              <p className="text-base lg:text-lg text-Secondary2 font-medium flex justify-center items-center gap-5">
                Show Detailed Plan Comparison <img className={`w-3 lg:w-auto ${plan ? "rotate-360" : "rotate-180"}`} src={DropdownIcon} alt="" />
              </p>
            </div>

            {plan && (
              <div className="rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] mb-10">
                <table className="w-full mt-5 lg:mt-10">
                  <thead>
                    <tr>
                      <th className="text-sm lg:text-[20px] lg:leading-[30px] font-semibold text-white bg-background2 text-center py-2 border-r border-[#BABABA] rounded-ss-md"> Feature </th>
                      <th className="text-sm lg:text-[20px] lg:leading-[30px] font-semibold text-white bg-background2 text-center py-2 border-r border-[#BABABA]"> {plans[0].name || "Basic"} </th>
                      <th className="text-sm lg:text-[20px] lg:leading-[30px] font-semibold text-white bg-background2 text-center py-2 border-r border-[#BABABA]"> {plans[1].name || "Plus"} </th>
                      <th className="text-sm lg:text-[20px] lg:leading-[30px] font-semibold text-white bg-background2 text-center py-2 rounded-se-md"> {plans[0].name || "Premium"} </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, index) => (
                      <tr key={index}>
                        <td className="text-xs lg:text-base font-medium lg:font-bold text-Primary py-1 md:py-3 px-3 md:px-5 lg:px-10 border-t border-r border-[#BABABA]">
                          {item.name}
                        </td>
                        <td className="text-center border-t border-r border-[#BABABA] w-[80px] sm:w-[120px] xl:w-[170px] 2xl:w-[270px]">
                          <img className="py-3 mx-auto w-5 lg:w-6 xl:w-auto" src={item.basic ? True2Icon : False2Icon} alt="" />
                        </td>
                        <td className="text-center border-t border-r border-[#BABABA] w-[80px] sm:w-[120px] xl:w-[170px] 2xl:w-[270px]">
                          <img className="py-3 mx-auto w-5 lg:w-6 xl:w-auto" src={item.plus ? True2Icon : False2Icon} alt="" />
                        </td>
                        <td className="text-center border-t border-[#BABABA] w-[80px] sm:w-[120px] xl:w-[170px] 2xl:w-[270px]">
                          <img className="py-3 mx-auto w-5 lg:w-6 xl:w-auto" src={item.premium ? True2Icon : False2Icon} alt="" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>}
  </>);
};

export default Subscription;
