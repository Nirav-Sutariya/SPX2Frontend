import React, { useContext, useMemo, useState, useRef } from 'react';
import axios from 'axios';
import { formattedDate } from '../components/utils';
import { AppContext } from '../components/AppContext';
import { getToken, getUserId } from '../page/login/loginAPI';

const ManageCoupon = () => {

  const discountRef = useRef(null);
  const couponNameRef = useRef(null);
  const maxLimitUseRef = useRef(null);
  const submitButtonRef = useRef(null);
  let appContext = useContext(AppContext);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [msgM1, setMsgM1] = useState({ type: "", msg: "", });
  const [couponList, setCouponList] = useState(appContext.couponList);
  const [couponList2, setCouponList2] = useState(appContext.couponList2);
  const [coupon, setCoupon] = useState({ name: '', discount: '', maxLimitUse: '', startDate: '', endDate: '' });


  // Form Validate function 
  function validateCoupon() {
    if (coupon.name === '' || coupon.discount === '' || coupon.maxLimitUse === '' || coupon.startDate === '' || coupon.endDate === '') {
      setMsg({ type: "error", msg: "Please fill all fields" });
      return false
    }
    return true
  }

  // Cerate Coupon on Admin Api
  async function createCoupon() {
    if (validateCoupon()) {
      try {
        let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_CREATE_COUPON_URL, { userId: getUserId(), ...coupon }, {
          headers: {
            'x-access-token': getToken()
          }
        })
        if (response.status === 201) {
          setMsg({ type: "info", msg: "Coupon created successfully" });
          setCoupon({ name: '', discount: '', maxLimitUse: '', startDate: '', endDate: '' });
          fetchCouponList();
          fetchCouponList2();
        }
      } catch (error) {
        if (error.message.includes("Network Error")) {
          setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection.", });
        } else if (error.response?.status === 400) {
          const message = error.response?.data?.message || "Something went wrong";
          setMsg({ type: "error", msg: message });
        }
      }
    }
  }

  // Update Coupon on Admin Api
  async function updateStatusOfCoupon(couponId) {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_CHANGE_COUPON_STATUS, { userId: getUserId(), couponId }, {
        headers: {
          'x-access-token': getToken(),
        }
      })
      if (response.status === 201) {
        fetchCouponList()
        fetchCouponList2()
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "Something went wrong";
        setMsgM1({ type: "error", msg: message });
      }
    }
  }

  // Activated Coupons List Api
  async function fetchCouponList() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_COUPON_URL, { userId: getUserId(), isActive: true }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setCouponList(response.data.data);
        appContext.setAppContext((prevContext) => ({
          ...prevContext,
          couponList: response.data.data,
        }));
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "Something went wrong";
        setMsgM1({ type: "error", msg: message });
      }
    }
  }

  // Deactivated Coupons List Api
  async function fetchCouponList2() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_COUPON_URL, { userId: getUserId(), isActive: false }, {
        headers: {
          'x-access-token': getToken(),
        }
      })
      if (response.status === 200) {
        setCouponList2(response.data.data);
        appContext.setAppContext((prevContext) => ({
          ...prevContext,
          couponList2: response.data.data,
        }));
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "Something went wrong";
        setMsgM1({ type: "error", msg: message });
      }
    }
  }

  useMemo(() => {
    if (appContext.couponList.length === 0) {
      fetchCouponList();
    }
    if (appContext.couponList2.length === 0) {
      fetchCouponList2();
    }
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 40 * 100);
  }, [msg])

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      nextRef.current.focus();
    }
  };


  return (
    <div className='px-5 lg:pl-10 lg:px-6 pb-5 lg:pb-10'>
      <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'>Manage Coupon</h2>

      {/* Create Coupon From */}
      <div className='mt-5 lg:mt-10 px-5 md:px-[30px] py-5 md:py-[34px] rounded-md bg-background6  shadow-[0px_0px_6px_0px_#28236633] w-full'>
        <h2 className='text-xl lg:text-[20px] leading-[30px] text-Primary font-medium'>Coupon</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4 mt-2 lg:mt-[22px]">
          <div>
            <label className="block text-sm md:text-[16px] md:leading-[30px] text-Primary font-medium">Coupon Name</label>
            <input type="text" className="text-Primary w-full mt-2 px-3 md:px-5 py-2 md:py-[13px] text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
              placeholder='Enter your coupon name' value={coupon.name} maxLength={20} title='max length 20' ref={couponNameRef}
              onKeyDown={(e) => handleKeyDown(e, discountRef)}
              onChange={(e) => {
                let value = e.target.value.toUpperCase()
                setCoupon({ ...coupon, name: value });
              }} />
          </div>
          <div>
            <label className="block text-sm md:text-[16px] md:leading-[30px] text-Primary font-medium">Discount (%)</label>
            <input type="text" className="text-Primary w-full mt-2 px-3 md:px-5 py-2 md:py-[13px] text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
              placeholder='Enter your discount (%)' value={coupon.discount} ref={discountRef}
              onKeyDown={(e) => handleKeyDown(e, maxLimitUseRef)}
              onChange={(e) => {
                let value = e.target.value
                if (value === '' || (/^\d+$/.test(value)))
                  setCoupon({ ...coupon, discount: value })
              }} />
          </div>
          <div>
            <label className="block text-sm md:text-[16px] md:leading-[30px] text-Primary font-medium">Max. Limit Use</label>
            <input type="text" className="text-Primary w-full mt-2 px-3 md:px-5 py-2 md:py-[13px] text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
              placeholder='Enter your max limit use' value={coupon.maxLimitUse} maxLength={3} title='max length 3' ref={maxLimitUseRef}
              onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
              onChange={(e) => {
                let value = e.target.value
                if (value === '' || (/^\d+$/.test(value)))
                  setCoupon({ ...coupon, maxLimitUse: value })
              }} />
          </div>
          <div className='flex flex-wrap lg:flex-nowrap justify-between gap-4'>
            <div className='w-full'>
              <label className="block text-sm md:text-[16px] md:leading-[30px] text-Primary font-medium">Start Date</label>
              <input type="date" className="text-Primary w-full mt-2 px-3 md:px-5 py-2 md:py-[13px] text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                placeholder='Enter your start date' value={coupon.startDate} maxLength={10} title='max length 3'
                onChange={(e) => {
                  let value = e.target.value
                  setCoupon({ ...coupon, startDate: value })
                }} />
            </div>
            <div className='w-full'>
              <label className="block text-sm md:text-[16px] md:leading-[30px] text-Primary font-medium">End Date</label>
              <input type="date" className="text-Primary w-full mt-2 px-3 md:px-5 py-2 md:py-[13px] text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                placeholder='Enter your end date' value={coupon.endDate} maxLength={10} title='max length 3'
                onChange={(e) => {
                  let value = e.target.value
                  setCoupon({ ...coupon, endDate: value })
                }} />
            </div>
          </div>
        </div>

        {/* Individual Create button for each coupon form */}
        <div className="flex justify-end mt-5 md:mt-[30px]">
          <button type="button" ref={submitButtonRef} className="text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 lg:py-[13px] lg:px-[30px]" onClick={createCoupon}> Save </button>
        </div>
        {(msg.msg !== "") && <p className={`text-sm mt-2 text-end ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}.</p>}
      </div>

      {/* Activated Coupons Name */}
      <span className='flex items-center gap-3 lg:gap-[18px] mt-[30px] '>
        <hr className='w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-[#6FBA47]'></hr><h3 className='text-lg lg:text-[28px] lg:leading-[42px] font-semibold text-Primary'>Activated Coupons</h3>
      </span>

      {/* Activated Coupons Table List */}
      <div className='overflow-x-auto mt-3 lg:mt-5 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
        <table className="text-center min-w-full ">
          <thead>
            <tr>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[150px] border-r border-borderColor rounded-ss-md bg-background2 ">Coupon Name</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[140px] border-r border-borderColor bg-background2">Discount</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[170px] border-r border-borderColor bg-background2">Start Date</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[170px] border-r border-borderColor bg-background2">End Date</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[140px] border-r border-borderColor bg-background2">Use/MX. limit</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[170px] border-r border-borderColor bg-[#6FBA47] opacity-40">Status</th>
            </tr>
          </thead>
          <tbody>
            {couponList?.length > 0 ? (
              couponList.map((item, index) => (
                <tr key={index} >
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-borderColor">{item.name}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{item.discount}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{formattedDate(item.startDate)}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{formattedDate(item.endDate)}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{item.remainLimitUse}/{item.maxLimitUse}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">
                    <a className="text-sm lg:text-base font-medium text-Secondary underline cursor-pointer" onClick={(_) => updateStatusOfCoupon(item._id)}>Deactivate</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-sm lg:text-base text-Primary text-center p-3">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Deactivated Coupons Name  */}
      <span className='flex items-center gap-3 lg:gap-[18px] mt-[30px]'>
        <hr className='w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-[#EF4646]'></hr><h3 className='text-lg lg:text-[28px] lg:leading-[42px] font-semibold text-Primary'>Deactivated Coupons</h3>
      </span>

      {/* Deactivated Coupons Table with List */}
      <div className='overflow-x-auto mt-3 lg:mt-5 rounded-md bg-background6   shadow-[0px_0px_6px_0px_#28236633]'>
        <table className="text-center min-w-full ">
          <thead>
            <tr>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[150px] border-r border-borderColor rounded-ss-md bg-background2 ">Coupon Name</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[140px] border-r border-borderColor bg-background2">Discount</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[170px] border-r border-borderColor bg-background2">Start Date</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[170px] border-r border-borderColor bg-background2">End Date</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[140px] border-r border-borderColor bg-background2">Use/MX. limit</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[170px] border-r border-borderColor bg-[#EF4646] opacity-40">Status</th>
            </tr>
          </thead>
          <tbody>
            {couponList2?.length > 0 ? (
              couponList2.map((item, index) => (
                <tr key={index} >
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-borderColor">{item.name}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{item.discount}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{formattedDate(item.startDate)}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{formattedDate(item.endDate)}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{item.remainLimitUse}/{item.maxLimitUse}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">
                    <a className="text-sm lg:text-base font-medium text-Secondary underline cursor-pointer" onClick={(_) => updateStatusOfCoupon(item._id)}>Activate</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-sm lg:text-base text-Primary text-center p-3">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(msgM1.msg !== "") && <p className={`text-sm mt-2 text-end ${msgM1.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msgM1.msg}.</p>}
    </div>
  );
}

export default ManageCoupon;
