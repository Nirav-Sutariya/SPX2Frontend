import React, { useContext, useMemo, useState } from 'react';
import BackIcon from '../assets/svg/BackIcon.svg';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';
import { formattedDate } from '../components/utils';
import { AppContext } from '../components/AppContext';
import { getToken, getUserId } from './login/loginAPI';

const generatePDF = async (data, name, emailId) => {

  // If check stripe invoice available 
  if (data?.stripeId) {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SUBSCRIPTION_GET_STRIPE_INVOICE, { userId: getUserId(), stripeId: data.stripeId }, {
        headers: {
          'x-access-token': getToken()
        }
      });
      if (response.status === 200) {
        window.location.href = response.data.data
        return
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    // Invoice PDF generate
    const doc = new jsPDF();

    // Invoice heading
    doc.setFontSize(22);
    doc.text('Invoice', 90, 20);

    // Company details
    doc.setFontSize(12);
    doc.text('Option Matrix', 150, 30);
    doc.text(`Invoice Date: ${new Date(data.createdAt).toLocaleDateString()}`, 150, 40);
    doc.text(`Date of Issue: ${new Date(data.subscriptionStartDate).toLocaleDateString()}`, 150, 50);
    doc.text(`Due Date: ${new Date(data.subscriptionEndDate).toLocaleDateString()}`, 150, 60);

    // Billed to (Placeholder as you don't have billing details in data)
    doc.text('Billed To', 20, 40);
    doc.text('Customer Name : ' + name, 20, 50);
    doc.text('Email id : ' + emailId, 20, 60);

    // Table headers
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text('Item/Service', 20, 90);
    doc.text('Description', 60, 90);
    doc.text('Amount', 140, 90);

    const subscriptionName = data.subscriptionName[0].toUpperCase() + data.subscriptionName.slice(1);
    doc.setFontSize(12);
    doc.text(`${subscriptionName} Plan`, 20, 100);
    doc.text(`Subscription to ${subscriptionName} features`, 60, 100);
    doc.text(`$${Number(data.totalPrice ? data.totalPrice : "0.00").toFixed(2)}`, 140, 100);

    // Subtotal, Discount, Tax, Total
    const subtotal = parseFloat(data.totalPrice ? data.totalPrice : "0.00");
    const discount = parseFloat(data.couponDiscount ? data.couponDiscount : "0.00");
    const taxRate = 0;
    const tax = subtotal * taxRate;
    const total = subtotal + tax - discount;

    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, 130);
    doc.text(`Discount: - ${discount.toFixed(2)}`, 140, 140);
    doc.text(`Tax (0%): $${tax.toFixed(2)}`, 140, 150);
    doc.text(`Total: $${total.toFixed(2)}`, 140, 160);

    // Footer
    doc.setFontSize(10);
    doc.text('Terms and Conditions', 20, 180);
    doc.text('Terms: This invoice is valid for one-year subscription from the start date.', 20, 190);
    doc.text('For support, contact support@optionmatrix.com', 20, 200);

    // Save the PDF
    doc.save('invoice.pdf');
  }
};


const SubscriptionHistory = () => {

  let appContext = useContext(AppContext);
  const [isActiveSub, setIsActiveSub] = useState(false);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [plansData, setPlanData] = useState(appContext.subscriptionHistory);

  // Subscription History Fined
  async function fetchSubscriptionHistory() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SUBSCRIPTION_HISTORY, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setPlanData(response.data.data)
        appContext.setAppContext((curr) => {
          return { ...curr, subscriptionHistory: response.data.data }
        })
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  // User Subscription Check ID For invoice available 
  const userSubscriptionCheckID = async (userSubscriptionId) => {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SINGLE_USER_SUBSCRIPTION, { userId: getUserId(), userSubscriptionId: userSubscriptionId }, {
        headers: {
          'x-access-token': getToken()
        }
      });
      if (response.status === 200) {
        const userName = appContext.userData.first_name || "Unknown User";
        const userEmail = appContext.userData.email || "No Email Provided";
        generatePDF(response.data.data, userName, userEmail);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 20 * 100);

    if (appContext.subscriptionHistory.length === 0) {
      fetchSubscriptionHistory()
    }
  }, [msg])


  return (
    <div className='px-5 lg:pl-10 lg:px-6 pb-[100px] h-screen md:h-auto'>
      <div className='flex items-center gap-3 lg:gap-5'>
        <Link to="/subscription"><img className='w-3 lg:w-auto' src={BackIcon} alt="" /></Link>
        <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'>Subscription History</h2>
        {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}
      </div>

      <div className='flex justify-end gap-5 mt-5 lg:mt-10 mb-3'>
        {isActiveSub ? <li className='text-base lg:text-lg text-[#6FBA47]'>Active</li> : <li className='text-base lg:text-lg text-[#EF4646]'>Cancelled</li>}
      </div>

      <div className="overflow-x-auto text-center rounded-md">
        <table className="min-w-full rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]">
          <thead>
            <tr>
              <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[140px] lg:min-w-0 border-r border-white rounded-ss-md bg-[#5A9FC9] ">Plan</th>
              <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[180px] lg:min-w-0 border-r border-white bg-[#5A9FC9]">Start Date</th>
              <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[180px] lg:min-w-0 border-r border-white bg-[#5A9FC9]">Expiry Date</th>
              <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[140px] lg:min-w-0 border-r border-white bg-[#5A9FC9]">Amount</th>
              <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[180px] lg:min-w-0 border-r border-white bg-[#5A9FC9]">Payment Date</th>
              <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[180px] lg:min-w-0 rounded-tr-md bg-[#5A9FC9]">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {plansData.map((item) => (
              <tr key={item._id} className={(item.subscriptionStatus && 'bg-green-400')}>
                <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-gray-300">{item.subscriptionName[0].toUpperCase() + item.subscriptionName.slice(1)}</td>
                <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-x border-gray-300">{formattedDate(item.subscriptionStartDate)}</td>
                <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-x border-gray-300">{formattedDate(item.subscriptionEndDate)}</td>
                <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-x border-gray-300">{item.totalPrice}</td>
                <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-x border-gray-300">{formattedDate(item.subscriptionStartDate)}</td>
                <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-gray-300" onLoad={(!isActiveSub & item.subscriptionStatus && setIsActiveSub(true))}>
                  <a onClick={() => userSubscriptionCheckID(item._id)} className="text-base font-medium text-Secondary underline cursor-pointer">Download Invoice</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Extra Purchase Table (Only if extra purchase data exists) */}
      {plansData.some((item) => item.extraPurchaseData.length > 0) && (
        <div className="overflow-x-auto rounded-md mt-5 lg:mt-10">
          <div className='flex justify-between gap-5 mt-5 lg:mt-10 mb-3'>
            <h3 className="text-lg lg:text-2xl font-semibold text-Primary mb-2">Extra Purchase Matrix Limit Details</h3>
            <div className=''>
              {isActiveSub ? <li className='text-base lg:text-lg text-[#6FBA47]'>Active</li> :
                <li className='text-base lg:text-lg text-[#EF4646]'>Cancelled</li>}
            </div>
          </div>
          <table className="text-center min-w-full rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]">
            <thead>
              <tr>
                <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[140px] lg:min-w-0 border-r border-white rounded-ss-md bg-[#5A9FC9] ">Plan</th>
                <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[180px] lg:min-w-0 border-r border-white bg-[#5A9FC9]">Record Limit</th>
                <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[180px] lg:min-w-0 border-r border-white bg-[#5A9FC9]">Amount</th>
                <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[140px] lg:min-w-0 border-r border-white bg-[#5A9FC9]">Payment Date</th>
                <th className="text-sm lg:text-base font-semibold text-white p-3 lg:p-4 min-w-[180px] lg:min-w-0 rounded-tr-md bg-[#5A9FC9]">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {plansData.map((item) =>
                item.extraPurchaseData.map((purchase) => (
                  <tr key={purchase._id} className={(item.subscriptionStatus && 'bg-green-400')}>
                    <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-gray-300">{item.subscriptionName} (Extra Matrix Limit) </td>
                    <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-x border-gray-300"> {purchase.recordLimit}</td>
                    <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-x border-gray-300">${purchase.price}</td>
                    <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-x border-gray-300">{formattedDate(purchase.createdAt)}</td>
                    <td className="text-sm lg:text-base text-Secondary py-3 lg:py-5 px-3 lg:px-4 border-t border-gray-300" onLoad={(!isActiveSub & item.subscriptionStatus && setIsActiveSub(true))}>
                      <a onClick={() => userSubscriptionCheckID(item._id, item.subscriptionStartDate)} className="text-base font-medium text-Secondary underline cursor-pointer">Download Invoice</a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SubscriptionHistory;

export { generatePDF }
