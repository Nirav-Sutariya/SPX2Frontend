import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import DropdownIcon from '../assets/svg/DropdownIcon.svg';
import TotalUserIcon from '../assets/Images/SuperDashboard/TotalUserIcon.svg';
import TotalEarnIcon from '../assets/Images/SuperDashboard/TotalEarnIcon.svg';
import BasicPlanIcon from '../assets/Images/SuperDashboard/BasicPlanIcon.svg';
import PremiumUserIcon from '../assets/Images/SuperDashboard/PremiumUserIcon.svg';
import AdvancePlanIcon from '../assets/Images/SuperDashboard/AdvancePlanIcon.svg';
import PremiumPlanIcon from '../assets/Images/SuperDashboard/PremiumPlanIcon.svg';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { AppContext } from '../components/AppContext';
import { getToken, getUserId } from '../page/login/loginAPI';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {

  const MonthRef = useRef(null);
  const Month2Ref = useRef(null);
  let appContext = useContext(AppContext);
  const [month, setMonth] = useState(false);
  const [month2, setMonth2] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [selectedMonth2, setSelectedMonth2] = useState(1);
  const [adminDashboardData, setAdminDashboardData] = useState(appContext.adminDashboardData || {});
  const monthFilters = {
    1: "Month",
    3: "Month 3",
    6: "Month 6",
    12: "Month 12",
  };
  const monthFilters2 = {
    1: "Month",
    3: "Month 3",
    6: "Month 6",
    12: "Month 12",
  };


  // Admin Dashboard Data Fetch Api 
  async function fetchAdminDashboardData() {
    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_DASHBOARD_URL, { userId: getUserId(), matrixMonth: selectedMonth2, userMonth: selectedMonth }, {
        headers: {
          "x-access-token": getToken()
        }
      })
      if (response.status === 200) {
        appContext.setAppContext((curr) => ({
          ...curr,
          adminDashboardData: response.data,
        }));
        setAdminDashboardData(response.data);
      }
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.message?.includes("Network Error")) {
        errorMessage = "Could not connect to the server. Please check your connection.";
      }
      setMsg({ type: "error", msg: errorMessage });
    }
  }

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 40 * 100);
  }, [msg])

  useEffect(() => {
    fetchAdminDashboardData();
  }, [selectedMonth, selectedMonth2])

  const toggleDropdown3 = () => {
    setMonth((prev) => !prev);
  }

  const toggleDropdown4 = () => {
    setMonth2((prev) => !prev);
  }

  // Pie Chart Data For Most Used Matrix
  const data = {
    datasets: [
      {
        label: 'User Plans',
        data: [
          adminDashboardData.basePlanCount || 0,
          adminDashboardData.plusPlanCount || 0,
          adminDashboardData.premiumPlanCount || 0
        ],
        backgroundColor: ['#2C7CAC', '#C5E9FF', '#FFE500'],
        hoverOffset: 4,
      },
    ],
  };

  // Pie Chart Options For Most Used Matrix
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Pie Chart Data For Most Used User
  const data2 = {
    labels: ['Static Short Matrix', 'Static Long Matrix', 'Dynamic Short Matrix', 'Dynamic Long Matrix'], // Labels for the chart
    datasets: [
      {
        data: [
          adminDashboardData.countSSM || 0,  // Static Short Matrix count
          adminDashboardData.countSLM || 0,  // Static Long Matrix count
          adminDashboardData.countDSM || 0,  // Dynamic Short Matrix count
          adminDashboardData.countDLM || 0,  // Dynamic Long Matrix count
        ], // Values to be shown in the chart
        backgroundColor: ['#32CDD7', '#365579', '#FCC43B', '#EE596C'], // Colors for each segment
        hoverBackgroundColor: ['#32CDD7', '#365579', '#FCC43B', '#EE596C'], // Hover effect colors
      },
    ],
  };

  // Pie Chart Options For Most Used User
  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom label for each tooltip
          },
        },
      },
    },
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (MonthRef.current && !MonthRef.current.contains(event.target)) {
        setMonth(false);
      }
      if (Month2Ref.current && !Month2Ref.current.contains(event.target)) {
        setMonth2(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className='px-3 lg:pl-7 xl:pl-10 lg:px-4 xl:px-6 mb-5'>
      <h2 className='text-xl lg:text-3xl xl:text-[32px] xl:leading-[48px] text-Primary font-semibold'>Dashboard</h2>
      <div className='flex flex-wrap md:flex-nowrap gap-5 mt-5 lg:mt-10'>
        <div className='w-full'>
          {/* Total User, Total Earn and Premium User Data */}
          <div className='flex flex-wrap lg:flex-nowrap gap-5 w-full'>
            <div className='flex lg:grid xl:flex items-center gap-3 xl:gap-4 p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_10px_0px_#28236633] w-full min-[440px]:max-w-[200px] lg:max-w-none'>
              <span className='p-2 lg:p-3 xl:p-4 border border-borderColor rounded-md bg-background3 lg:mr-auto xl:m-0'>
                <img className='w-6 lg:w-7 xl:w-auto' src={TotalUserIcon} alt="" />
              </span>
              <span>
                <p className='text-base lg:text-lg text-Secondary2'>Total Users</p>
                <h3 className='text-lg lg:text-xl xl:text-[28px] xl:leading-[42px] text-Primary font-semibold'>{adminDashboardData.totalUserCount || 0}</h3>
              </span>
            </div>
            <div className='flex lg:grid xl:flex items-center gap-3 xl:gap-4 p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_10px_0px_#28236633] w-full min-[440px]:max-w-[200px] lg:max-w-none'>
              <span className='px-2 py-[9px] lg:px-3 xl:px-4 lg:py-[13.5px] xl:py-[18px] border border-borderColor rounded-md bg-background3 lg:mr-auto xl:m-0'>
                <img className='w-6 lg:w-7 xl:w-auto' src={TotalEarnIcon} alt="" />
              </span>
              <span>
                <p className='text-base lg:text-lg text-Secondary2'>Total Earning</p>
                <h3 className='text-lg lg:text-xl xl:text-[28px] xl:leading-[42px] text-Primary font-semibold'>${adminDashboardData.totalEarn || 0}</h3>
              </span>
            </div>
            <div className='flex lg:grid xl:flex items-center gap-3 xl:gap-4 p-3 lg:p-4 xl:p-5 rounded-md bg-background6 shadow-[0px_0px_10px_0px_#28236633] w-full min-[440px]:max-w-[200px] lg:max-w-none'>
              <span className='p-2 lg:p-3 xl:p-4 border border-borderColor rounded-md bg-background3 lg:mr-auto xl:m-0'>
                <img className='w-6 lg:w-7 xl:w-auto' src={PremiumUserIcon} alt="" />
              </span>
              <span>
                <p className='text-base lg:text-lg text-Secondary2'>Premium Users</p>
                <h3 className='text-lg lg:text-xl xl:text-[28px] xl:leading-[42px] text-Primary font-semibold'>{adminDashboardData.totalPremiumUsers || 0}</h3>
              </span>
            </div>
          </div>

          {/* Error Message */}
          {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}.</p>}

          {/* Most Used Matrix Pie Chart */}
          <div className='mt-5 p-3 lg:p-[21px] rounded-md bg-background6 shadow-[0px_0px_10px_0px_#28236633] w-full'>
            <div className='flex justify-between items-center relative'>
              <h2 className='text-xl lg:text-xl xl:text-[28px] xl:leading-[42px] text-Primary font-semibold'>Most Saved Matrix </h2>
              <span className='flex justify-between items-center gap-2 py-[7px] px-3 border border-borderColor rounded-md bg-background3 w-full max-w-[110px] cursor-pointer' onClick={toggleDropdown4}>
                <p className='text-sm xl:text-sm text-Secondary2 font-medium'>{monthFilters2[selectedMonth2]}</p>
                <img className='w-3' src={DropdownIcon} alt="" />
              </span>

              <AnimatePresence>
                {month2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.50, ease: "easeInOut" }}
                    ref={Month2Ref} className='absolute top-10 right-0 z-10 py-2 mt-1 px-3 rounded-md bg-background6 border border-borderColor2 shadow-[0px_0px_6px_0px_#28236633] max-w-[105px] w-full'>
                    <p className='text-sm font-medium text-Secondary2 pb-1 cursor-pointer border-b border-borderColor' onClick={() => { setSelectedMonth2(1); setMonth2(false) }}>Month</p>
                    <p className='text-sm font-medium text-Secondary2 py-1 cursor-pointer border-b border-borderColor' onClick={() => { setSelectedMonth2(3); setMonth2(false) }}>Month 3</p>
                    <p className='text-sm font-medium text-Secondary2 py-1 cursor-pointer border-b border-borderColor' onClick={() => { setSelectedMonth2(6); setMonth2(false) }}>Month 6</p>
                    <p className='text-sm font-medium text-Secondary2 pt-1 cursor-pointer' onClick={() => { setSelectedMonth2(12); setMonth2(false) }}>Month 12</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className='flex flex-wrap justify-center items-center gap-10 xl:gap-20 w-full mt-5'>
              <div className=''>
                <Pie data={data2} options={options2} />
              </div>
              <div className='w-full max-w-[350px] -mt-[20px]'>
                <div className='mt-2 flex justify-between items-center gap-3 py-3 px-5 border border-borderColor rounded-md bg-background3'>
                  <span className='flex items-center gap-3'>
                    <div className='w-7 h-7 bg-[#32CDD7] rounded-full'></div>
                    <p className='text-base text-Secondary2'>Static Short Matrix :</p>
                  </span>
                  <h3 className='text-lg font-medium text-Primary'>{adminDashboardData.countSSM || 0}</h3>
                </div>
                <div className='mt-2 flex justify-between items-center gap-3 py-3 px-5 border border-borderColor rounded-md bg-background3'>
                  <span className='flex items-center gap-3'>
                    <div className='w-7 h-7 bg-[#365579] rounded-full'></div>
                    <p className='text-base text-Secondary2'>Static Long IC Matrix :</p>
                  </span>
                  <h3 className='text-lg font-medium text-Primary'>{adminDashboardData.countSLM || 0}</h3>
                </div>
                <div className='mt-2 flex justify-between items-center gap-3 py-3 px-5 border border-borderColor rounded-md bg-background3'>
                  <span className='flex items-center gap-3'>
                    <div className='w-7 h-7 bg-[#FCC43B] rounded-full'></div>
                    <p className='text-base text-Secondary2'>Dynamic Short IC Matrix :</p>
                  </span>
                  <h3 className='text-lg font-medium text-Primary'>{adminDashboardData.countDSM || 0}</h3>
                </div>
                <div className='mt-2 flex justify-between items-center gap-3 py-3 px-5 border border-borderColor rounded-md bg-background3'>
                  <span className='flex items-center gap-3'>
                    <div className='w-7 h-7 bg-[#EE596C] rounded-full'></div>
                    <p className='text-base text-Secondary2'>Dynamic Long IC Matrix :</p>
                  </span>
                  <h3 className='text-lg font-medium text-Primary'>{adminDashboardData.countDLM || 0}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Used User Pie Chart */}
        <div className='p-5 rounded-md bg-background6 shadow-[0px_0px_10px_0px_#28236633] md:max-w-[292px] 2xl:max-w-[312px] w-full h-fit'>
          <span className='relative flex justify-between items-start gap-3 w-full'>
            <h3 className='text-base xl:text-lg text-Primary font-semibold'>All Users</h3>
            <span className='flex items-center gap-2 py-[6px] px-3 border border-borderColor rounded-md bg-background3 max-w-[120px] cursor-pointer' onClick={toggleDropdown3}>
              <p className='text-sm xl:text-sm text-Secondary2 font-medium'>{monthFilters[selectedMonth]}</p>
              <img className='w-3' src={DropdownIcon} alt="" />
            </span>

            <AnimatePresence>
              {month && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.50, ease: "easeInOut" }}
                  ref={MonthRef} className='absolute top-9 right-0 z-10 py-2 mt-1 px-3 rounded-md bg-background6 border border-borderColor2 shadow-[0px_0px_6px_0px_#28236633] max-w-[105px] w-full'>
                  <p className='text-sm font-medium text-Secondary2 pb-1 cursor-pointer border-b border-borderColor' onClick={() => { setSelectedMonth(1); setMonth(false) }}>Month</p>
                  <p className='text-sm font-medium text-Secondary2 py-1 cursor-pointer border-b border-borderColor' onClick={() => { setSelectedMonth(3); setMonth(false) }}>Month 3</p>
                  <p className='text-sm font-medium text-Secondary2 py-1 cursor-pointer border-b border-borderColor' onClick={() => { setSelectedMonth(6); setMonth(false) }}>Month 6</p>
                  <p className='text-sm font-medium text-Secondary2 pt-1 cursor-pointer' onClick={() => { setSelectedMonth(12); setMonth(false) }}>Month 12</p>
                </motion.div>
              )}
            </AnimatePresence>
          </span>
          <div className='flex justify-center'>
            <div className='max-w-[272px] 2xl:max-w-[312px]'>
              <Pie className='mt-[30px]' data={data} options={options} />
            </div>
          </div>
          <div className='mt-10 flex justify-between items-center gap-3 py-3 px-5 border border-borderColor rounded-md bg-background3 max-w-[350px] mx-auto'>
            <span className='flex items-center gap-3'>
              <img src={BasicPlanIcon} alt="" />
              <p className='text-base text-Secondary2'>7 Day Trial</p>
            </span>
            <h3 className='text-lg font-medium text-Primary'>{adminDashboardData.basePlanCount || 0}</h3>
          </div>
          <div className='mt-2 flex justify-between items-center gap-3 py-3 px-5 border border-borderColor rounded-md bg-background3 max-w-[350px] mx-auto'>
            <span className='flex items-center gap-3'>
              <img src={AdvancePlanIcon} alt="" />
              <p className='text-base text-Secondary2'>Plus Plan</p>
            </span>
            <h3 className='text-lg font-medium text-Primary'>{adminDashboardData.plusPlanCount || 0}</h3>
          </div>
          <div className='mt-2 flex justify-between items-center gap-3 py-3 px-5 border border-borderColor rounded-md bg-background3 max-w-[350px] mx-auto'>
            <span className='flex items-center gap-3'>
              <img src={PremiumPlanIcon} alt="" />
              <p className='text-base text-Secondary2'>Premium Plan</p>
            </span>
            <h3 className='text-lg font-medium text-Primary'>{adminDashboardData.premiumPlanCount || 0}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
