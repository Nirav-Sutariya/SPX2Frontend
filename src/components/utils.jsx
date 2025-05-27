import React, { useEffect } from "react"
import axios from "axios";
import { getToken, getUserId } from '../page/login/loginAPI';


const defaultCommission = 5
const defaultAllocation = 100
const defaultDynamicTradePrice = 0
const DefaultInDeCrement = 0.05

function defaultValue(e, val) {
    e.target.value = (e.target.value === "" ? val : e.target.value)
}

// get the level values estimation row 
function findClosestIndex(data, target) {
    if (data.length < 1)
        return -1

    let indx = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i][0] > target) {
            indx = i - 1;
            break;
        }
        indx = i
    }
    return indx;
}

function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// Common Modal Component
const ConfirmationModal = ({ show, onClose, onConfirm, title, icon, message, extraParam }) => {
    useEffect(() => {
        if (show) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
            <div className="p-4 lg:p-[30px] border border-borderColor5 rounded-lg bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-[360px] lg:w-[486px]">
                <div className="flex justify-center">
                    <div className="mx-auto p-5 lg:p-7 border border-borderColor rounded-md bg-background3">
                        <img className="w-7 lg:w-auto" src={icon} alt="Reset Icon" />
                    </div>
                </div>
                <h2 className="text-lg lg:text-[28px] lg:leading-[33px] font-semibold text-Secondary2 mx-auto max-w-[600px] mt-5 text-center">{title}</h2>
                <h2 className="text-base lg:text-[18px] lg:leading-[33px] text-Secondary2 mx-auto max-w-[400px] lg:mt-2 text-center">{message}</h2>
                <div className="flex justify-between gap-3 mt-5 lg:mt-9">
                    <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 border border-borderColor3 bg-background5 rounded-md w-full" onClick={onClose}>Cancel</button>
                    <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full" onClick={() => { onConfirm(extraParam); onClose(); }}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

function formattedDate(inputDate) {
    const date = new Date(inputDate);
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    return date.toLocaleString('en-US', options).replace(',', '').replace(' AM', '').replace(' PM', '');
}

function formattedDate1(inputDate) {
    const date = new Date(inputDate);
    const options = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };
    return date.toLocaleString('en-US', options).replace(',', '');
}

async function CancelUserSubscription(user) {
    if (user) {
        try {
            let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_CANCEL_USER_BY_ADMIN_SUBSCRIPTION, { userId: getUserId(), appUserId: user }, {
                headers: {
                    'x-access-token': getToken()
                }
            })
            if (response.status === 201)
                return true
        } catch (error) { }
    }
}


const FilterModalShort = ({ isVisible, filters, handleToggle, ResetTable }) => {
    if (!isVisible) return null;

    const filterOptions = [
        { label: "Contracts", state: filters.showContracts, setter: filters.setShowContracts },
        { label: "Credit", state: filters.showCredit, setter: filters.setShowCredit },
        { label: "Commission", state: filters.showCommission, setter: filters.setShowCommission },
        { label: "BP", state: filters.showBP, setter: filters.setShowBP },
        { label: "Profit", state: filters.showProfit, setter: filters.setShowProfit },
        { label: "Loss", state: filters.showLoss, setter: filters.setShowLoss },
        { label: "Cumulative Loss", state: filters.showCumulativeLoss, setter: filters.setShowCumulativeLoss },
        { label: "Series Gain/Loss", state: filters.showSeriesGainLoss, setter: filters.setShowSeriesGainLoss },
        { label: "After Win", state: filters.showAfterWin, setter: filters.setShowAfterWin },
        { label: "Gain %", state: filters.showGainPercentage, setter: filters.setShowGainPercentage },
        { label: "After Loss", state: filters.showAfterLoss, setter: filters.setShowAfterLoss },
        { label: "Loss %", state: filters.showLossPercentage, setter: filters.setShowLossPercentage },
    ];

    return (
        <div className="absolute z-10 border border-borderColor5 rounded-lg bg-background6 max-w-[224px] w-full p-3 mt-2 lg:mt-4 shadow-[0px_0px_6px_0px_#28236633]">
            <p className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor px-12 pb-2 cursor-pointer" onClick={ResetTable}>
                Reset Table
            </p>
            {filterOptions.map((option, index) => (
                <label key={index} className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
                    <input type="checkbox" className="accent-accentColor w-[15px] h-[15px]" checked={option.state} onChange={() => handleToggle(option.setter)} />
                    {option.label}
                </label>
            ))}
        </div>
    );
};

const FilterModalLong = ({ isVisible, filters, handleToggle, ResetTable }) => {
    if (!isVisible) return null;

    const filterOptions = [
        { label: "Contracts", state: filters.showContracts, setter: filters.setShowContracts },
        { label: "Debit", state: filters.showCredit, setter: filters.setShowCredit },
        { label: "Commission", state: filters.showCommission, setter: filters.setShowCommission },
        { label: "BP", state: filters.showBP, setter: filters.setShowBP },
        { label: "Profit", state: filters.showProfit, setter: filters.setShowProfit },
        { label: "Loss", state: filters.showLoss, setter: filters.setShowLoss },
        { label: "Cumulative Loss", state: filters.showCumulativeLoss, setter: filters.setShowCumulativeLoss },
        { label: "Series Gain/Loss", state: filters.showSeriesGainLoss, setter: filters.setShowSeriesGainLoss },
        { label: "After Win", state: filters.showAfterWin, setter: filters.setShowAfterWin },
        { label: "Gain %", state: filters.showGainPercentage, setter: filters.setShowGainPercentage },
        { label: "After Loss", state: filters.showAfterLoss, setter: filters.setShowAfterLoss },
        { label: "Loss %", state: filters.showLossPercentage, setter: filters.setShowLossPercentage },
    ];

    return (
        <div className="absolute z-10 border border-borderColor5 rounded-lg bg-background6 max-w-[224px] w-full p-3 mt-2 lg:mt-4 shadow-[0px_0px_6px_0px_#28236633]">
            <p className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor px-12 pb-2 cursor-pointer" onClick={ResetTable}>
                Reset Table
            </p>
            {filterOptions.map((option, index) => (
                <label key={index} className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3 lg:gap-4 border-b border-borderColor py-[6px]">
                    <input type="checkbox" className="accent-accentColor w-[15px] h-[15px]" checked={option.state} onChange={() => handleToggle(option.setter)} />
                    {option.label}
                </label>
            ))}
        </div>
    );
};

export { FilterModalShort, FilterModalLong, defaultCommission, defaultAllocation, defaultDynamicTradePrice, DefaultInDeCrement, findClosestIndex, defaultValue, validateEmail, ConfirmationModal, formattedDate, formattedDate1, CancelUserSubscription }
