import React, { useState, useRef, useMemo, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { handleLogout } from '../../layout/Header'
import { getToken, getUserId } from '../login/loginAPI';
import { AppContext } from "../../components/AppContext";
import Currency from '../../assets/Images/Setting/Currency.svg';
import SettingIcon from '../../assets/Images/Setting/Setting.svg';
import DeleteIcon from '../../assets/Images/Setting/DeleteIcon.svg';
import DataPrivacy from '../../assets/Images/Setting/DataPrivacy.svg';
import Converter from '../../assets/Images/StaticMatrix/Converter.png';


const Setting = ({ setIsLoggedIn }) => {

  const DataRef = useRef();
  let appContext = useContext(AppContext);
  const [data, setData] = useState(false);
  const [conversionRateCad, setConversionRateCad] = useState("");
  const [conversionRateAud, setConversionRateAud] = useState("");
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [showCurrency, setShowCurrency] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(appContext.currency);
  const [currencyTime, setCurrencyTime] = useState(appContext.currency);


  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    setSelectedCurrency(value);
    currencyUser(value);
  };

  async function currencyUser(newCurrency) {
    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_UPDATE_USER_CURRENCY_URL), { userId: getUserId(), currency: newCurrency }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setSelectedCurrency(response.data.data.currency);
        appContext.setAppContext((curr) => ({
          ...curr,
          currency: response.data.data.currency,
        }));
        setMsg({ type: 'info', msg: 'Currency updated successfully.' });
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }

  async function deleteUser() {
    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_DELETE_USER_ACCOUNT_URL), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        handleLogout(setIsLoggedIn)
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 20 * 100);
  }, [msg]);

  useEffect(() => {
    if (selectedCurrency === null && appContext.currency) {
      setSelectedCurrency(appContext.currency);
    }
  }, [appContext.currency]);

  const handleReset = () => {
    setSelectedCurrency('USD');
    currencyUser("USD")
  };

  const handleResetAudRate = () => {
    setConversionRateAud(appContext.audLiveRate.toString());
  };

  const handleResetCadRate = () => {
    setConversionRateCad(appContext.cadLiveRate.toString());
  };

  // Get Admin This Page Access For Admin Api 
  async function getCadRate() {
    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_GET_USD_TO_CAD_CURRENCY_URL), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        const rawRateCad = response.data.data?.usdToCad;
        const rawRateAud = response.data.data?.usdToAud;
        const currencyTime = response.data.data?.lastUpdatedDate;
        const formattedRateCad = parseFloat(rawRateCad).toFixed(3);
        const formattedRateAud = parseFloat(rawRateAud).toFixed(3);
        const rateCad = Number(formattedRateCad);
        const rateAud = Number(formattedRateAud);
        appContext.setAppContext((curr) => ({
          ...curr,
          cadLiveRate: rateCad,
          audLiveRate: rateAud,
          currencyTime: currencyTime,
        }));
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    if (appContext.cadRate === null) {
      getCadRate();
    } else {
      setConversionRateCad(appContext.cadRate.toString());
      setConversionRateAud(appContext.audRate.toString());
    }
  }, [appContext.cadRate]);

  useEffect(() => {
    if (appContext.cadLiveRate === null) {
      getCadRate();
    }
  }, [appContext.cadLiveRate]);

  const handleRateChangeAud = (e) => {
    const value = e.target.value;
    setConversionRateAud(value);
  };

  const handleApplyAudRate = () => {
    if (conversionRateAud.trim() !== "") {
      currencyUserAudRate(conversionRateAud);
    } else {
      setMsg({ type: "error", msg: "Please enter a valid AUD rate." });
    }
  };

  const handleRateChangeCad = (e) => {
    const value = e.target.value;
    setConversionRateCad(value);
  };

  const handleApplyCadRate = () => {
    if (conversionRateCad.trim() !== "") {
      currencyUserCadRate(conversionRateCad);
    } else {
      setMsg({ type: "error", msg: "Please enter a valid CAD rate." });
    }
  };

  async function currencyUserAudRate(newRate) {
    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_USER_CURRENCY_URL), { userId: getUserId(), aud: newRate }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setConversionRateAud(response.data.data.aud);
        setMsg({ type: 'info', msg: 'AUD Rate updated successfully.' });
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }

  async function currencyUserCadRate(newRate) {
    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_USER_CURRENCY_URL), { userId: getUserId(), cad: newRate }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setConversionRateCad(response.data.data.cad);
        setMsg({ type: 'info', msg: 'CAD Rate updated successfully.' });
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }


  return (
    <>
      <div className='px-3 lg:pl-10 lg:px-6 h-[83vh] lg:h-auto'>
        <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'> Settings </h2>
        <Link to="/edit-profile">
          <div className='flex items-center gap-[22px] mt-10'>
            <img className='px-3 lg:px-4 py-3 lg:py-[15px] border border-borderColor rounded-md bg-background6 w-12 lg:w-[57px] h-12 lg:h-[57px]' src={SettingIcon} alt="" />
            <p className='text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary'>Account Settings</p>
          </div>
        </Link>

        <div className='cursor-pointer flex items-center gap-[22px] mt-5 lg:mt-10 max-w-[350px]' onClick={() => setData((prev) => !prev)}>
          <img className='px-3 lg:px-4 py-3 lg:py-[15px] border border-borderColor rounded-md bg-background6 w-12 lg:w-[57px] h-12 lg:h-[57px]' src={DataPrivacy} alt="" />
          <p className='text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary'>Data & Privacy Settings</p>
        </div>

        {data && <>
          <div ref={DataRef} className='mt-10 p-5 lg:p-[30px] bg-background6 rounded-md shadow-[0px_0px_6px_0px_#28236633] max-w-[564px] w-full'>
            <p className='text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary'>Delete Account</p>
            <p className='text-sm lg:text-lg text-Secondary2 mt-2 lg:mt-[22px] mb-3 lg:mb-[30px]'>Delete Your Account and All Associated Data</p>
            <div className='flex justify-end'>
              <a onClick={() => setShowDeleteModal(true)} className='cursor-pointer text-sm lg:text-[20px] lg:leading-[30px] font-semibold text-white rounded-md bg-ButtonBg py-2 px-4 lg:py-[13px] lg:px-[30px]'>Delete Account</a>
            </div>
          </div>

          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
              <div className="p-4 lg:p-[30px] bg-background6 rounded-lg shadow-[0px_0px_6px_0px_#28236633] w-[370px] lg:w-[622px]">
                <div className="flex justify-center">
                  <div className="mx-auto p-5 lg:p-7 border border-borderColor rounded-md bg-background3">
                    <img className="w-7 lg:w-auto" src={DeleteIcon} alt="Reset Icon" />
                  </div>
                </div>
                <h2 className="text-sm lg:text-lg text-Secondary2 mt-3 lg:mt-5 text-center">Your account has been scheduled for deletion and will be permanently deleted after 30 days. If you log in within this period, the deletion will be canceled, and your account will remain active.</h2>
                <div className="flex justify-between gap-3 mt-5 lg:mt-9">
                  <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 border border-borderColor3 rounded-md w-full" onClick={() => setShowDeleteModal(false)} >
                    Cancel
                  </button>
                  <button className={`text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full ${!appContext.superUser ? "cursor-pointer" : "cursor-not-allowed"} `} onClick={() => { if (!appContext.superUser) deleteUser() }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>}

        <div className='cursor-pointer flex items-center gap-[22px] mt-5 lg:mt-10 max-w-[200px]' onClick={() => setShowCurrency((prev) => !prev)}>
          <img className='px-3 lg:px-4 py-3 lg:py-[15px] border border-borderColor rounded-md bg-background6 w-12 lg:w-[57px] h-12 lg:h-[57px]' src={Currency} alt="" />
          <p className='text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary'>Currency</p>
        </div>

        {showCurrency && <>
          <div className='mt-10 p-5 lg:p-[30px] bg-background6 rounded-md shadow-[0px_0px_6px_0px_#28236633] max-w-[564px] w-full'>
            <label className='flex items-center gap-5 text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary'>
              <input
                type="radio"
                name="USD"
                value="USD"
                defaultChecked
                className="accent-Primary w-5 h-5"
              />USD (Default)</label>

            <div className='border-t border-borderColor5 my-5'></div>

            <div className='flex justify-between items-center gap-5 lg:gap-10 mt-5'>
              <div className='flex gap-5 lg:gap-10'>
                <label className='flex items-center  gap-5 text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary'>
                  <input
                    type="radio"
                    name="currency"
                    value="AUD"
                    className="accent-Primary w-5 h-5"
                    checked={selectedCurrency === 'AUD'}
                    onChange={handleCurrencyChange}
                  />AUD</label>

                <label className='flex items-center gap-5 text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary'>
                  <input
                    type="radio"
                    name="currency"
                    value="CAD"
                    className="accent-Primary w-5 h-5"
                    checked={selectedCurrency === 'CAD'}
                    onChange={handleCurrencyChange}
                  />CAD</label>
              </div>

              <button type="button" className="text-sm lg:text-base font-medium text-white bg-ButtonBg rounded-md py-1 max-w-[100px] w-full" onClick={handleReset}>
                Reset
              </button>
            </div>

            {appContext.currency === "AUD" && <div className='rounded-md max-w-[792px] bg-background6 mt-5 lg:mt-10 border border-borderColor2 shadow-[0px_0px_8px_0px_#28236633]'>
              <div className='text-base font-medium text-Primary flex justify-between px-3 py-2 lg:px-5 lg:py-3 border-b border-borderColor2 shadow-[0px_4px_16.2px_0px_#28236633]'> Check Live Currency Rates
                <button type="button" className="text-sm lg:text-base underline" onClick={handleResetAudRate}>
                  Reset Rate
                </button>
              </div>
              <div className='flex flex-wrap sm:flex-nowrap items-end gap-4 p-3 lg:p-5'>
                <div className='w-full'>
                  <label className='flex justify-between gap-2 items-center text-sm lg:text-base text-Primary lg:font-medium'>
                    <span className='flex items-center gap-2'> USD <img src={Converter} alt='Converter' /> AUD </span>
                    <span> Rate {appContext.audLiveRate || 1.55} </span>
                  </label>
                  <div className='flex justify-between items-center text-sm lg:text-base text-Primary font-medium mt-1 lg:mt-2 p-[7px] lg:p-[11px] gap-4 border border-borderColor bg-textBoxBg rounded-md'>
                    <span className='font-semibold'>C$</span>
                    <input type='text' maxLength={5} title='Max Length 5' value={conversionRateAud} onChange={handleRateChangeAud} placeholder='Enter Your Rate' className='bg-transparent w-full focus:outline-none' />
                  </div>
                </div>
                <button type="button" className="text-sm lg:text-base font-semibold text-white bg-ButtonBg rounded-md py-2 lg:py-3 max-w-[130px] w-full" onClick={handleApplyAudRate}>
                  Apply Now
                </button>
              </div>
              <div className="flex items-center rounded-md px-3 lg:px-5 pb-3 lg:pb-5 min-w-[220px] bg-background6 ">
                <div className="text-base text-Primary font-semibold">
                  <p className='text-sm text-Primary'>Last updated at (UTC): {new Date(appContext?.currencyTime).toLocaleString('en-US', {
                    timeZone: 'utc',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })}</p>
                </div>
              </div>
            </div>}

            {appContext.currency === "CAD" && <div className='rounded-md max-w-[792px] bg-background6 mt-5 lg:mt-10 border border-borderColor shadow-[0px_0px_8px_0px_#28236633]'>
              <div className='text-base font-medium text-Primary flex justify-between px-3 py-2 lg:px-5 lg:py-3 border-b border-borderColor2 shadow-[0px_4px_16.2px_0px_#28236633]'> Check Live Currency Rates
                <button type="button" className="text-sm lg:text-base underline" onClick={handleResetCadRate}>
                  Reset Rate
                </button>
              </div>
              <div className='flex flex-wrap sm:flex-nowrap items-end gap-4 p-3 lg:p-5'>
                <div className='w-full'>
                  <label className='flex justify-between gap-2 items-center text-sm lg:text-base text-Primary lg:font-medium'>
                    <span className='flex items-center gap-2'> USD <img src={Converter} alt='Converter' /> CAD </span>
                    <span> Rate {appContext.cadLiveRate || 1.40} </span>
                  </label>
                  <div className='flex justify-between items-center text-sm lg:text-base text-Primary font-medium mt-1 lg:mt-2 p-[7px] lg:p-[11px] gap-4 border border-borderColor bg-textBoxBg rounded-md'>
                    <span className='font-semibold'>C$</span>
                    <input type='number' maxLength={5} title='Max Length 5' value={conversionRateCad} onChange={handleRateChangeCad} placeholder='Enter Your Rate' className='bg-transparent w-full focus:outline-none' />
                  </div>
                </div>
                <button type="button" className="text-sm lg:text-base font-semibold text-white bg-ButtonBg rounded-md py-2 lg:py-3 max-w-[130px] w-full" onClick={handleApplyCadRate}>
                  Apply Now
                </button>
              </div>
              <div className="flex items-center rounded-md px-3 lg:px-5 pb-3 lg:pb-5 min-w-[220px] bg-background6 ">
                <div className="text-base text-Primary font-semibold">
                  <p className='text-sm text-Primary'>Last updated at (UTC): {new Date(appContext?.currencyTime).toLocaleString('en-US', {
                    timeZone: 'utc',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })}</p>
                </div>
              </div>
            </div>}
          </div>
        </>}

        {(msg.msg !== "") && <p className={`text-sm lg:text-base mt-1 lg:mt-2 ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}
      </div>
    </>
  );
}

export default Setting;
