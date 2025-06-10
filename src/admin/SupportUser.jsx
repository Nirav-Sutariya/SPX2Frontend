import React, { useContext, useMemo, useState } from 'react';
import Man from '../assets/Images/Man.png';
import DateIcon from '../assets/Images/SuperDashboard/DateIcon.svg';
import EmailIcon from '../assets/Images/SuperDashboard/EmailIcon.svg';
import ProfileIcon from '../assets/Images/SuperDashboard/ProfileIcon.svg';
import PopupCloseIcon from '../assets/Images/SuperDashboard/PopupCloseIcon.svg';
import axios from 'axios';
import { formattedDate } from '../components/utils';
import { AppContext } from '../components/AppContext';
import { getToken, getUserId } from '../page/login/loginAPI';

const SupportUser = () => {

  let appContext = useContext(AppContext);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [supportUserData, setSupportUserData] = useState(appContext.supportUserData);

  // Find Support User Data List
  async function fetchSupportUserData() {
    try {
      let response = await axios.post(process.env.REACT_APP_TICKET_URL + process.env.REACT_APP_SUPPORT_TICKET_LIST_URL, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        const data = response.data?.data || [];
        appContext.setAppContext((curr) => ({
          ...curr,
          supportUserData: data,
        }));
        setSupportUserData(data);
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

  useMemo(() => {
    if (appContext.supportUserData.length === 0) {
      fetchSupportUserData();
    }
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 40 * 100);
  }, [msg])

  const showPopup = (user) => {
    setSelectedUser(user);
    setIsPopupVisible(true);
  };

  // Function to hide the popup
  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedUser(null);
  };


  return (
    <div className='px-5 lg:pl-10 lg:px-6 mb-10 h-auto'>
      <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'>Support User</h2>
      {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}.</p>}
      <div className='overflow-x-auto mt-5 lg:mt-10 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
        <table className="text-center min-w-full">
          <thead>
            <tr>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[100px] border-r border-borderColor rounded-ss-md bg-background2 ">Sr No.</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[140px] border-r border-borderColor bg-background2">User Name</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[202px] border-r border-borderColor bg-background2">Email</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[110px] border-r border-borderColor bg-background2">Image File</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[180px] border-r border-borderColor bg-background2">Submit Date, time</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 min-w-[120px] rounded-tr-md bg-background2">Description</th>
            </tr>
          </thead>
          <tbody>
            {(!supportUserData || supportUserData.length === 0) ? (
              <tr>
                <td colSpan={6} className="text-center text-base lg:text-lg text-Primary px-3 py-4">
                  Support User not found
                </td>
              </tr>
            ) : (
              supportUserData.map((item, index) => (
                <tr key={index} >
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-borderColor">{index + 1}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor"><span className='flex items-center gap-3'><img src={item.userProfile ? item.userProfile : Man} className='w-8 h-8 rounded-full object-cover' alt="" /> {item.name}</span></td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{item.email}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{item.file ? <a href='#' onClick={() => window.open(item.file)}>Image</a> : "-"}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-x border-borderColor">{formattedDate(item.createdAt)}</td>
                  <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-t border-borderColor font-medium underline cursor-pointer" onClick={() => showPopup(item)}> Description</td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {isPopupVisible && selectedUser && (
        <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='relative p-4 m-2 md:p-[30px] border border-borderColor5 rounded-[22px] bg-background6 max-w-[500px] md:w-[662px] md:max-w-none shadow-[0px_0px_6px_0px_#28236633]'>
            <img className='absolute right-2 top-2 cursor-pointer' onClick={closePopup} src={PopupCloseIcon} alt="" />
            <span className='flex items-center gap-4'>
              <img src={ProfileIcon} alt="" />
              <p className='text-xl text-Primary font-semibold'>{selectedUser.name}</p>
            </span>
            <div className='flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-7 mt-2 md:mt-[10px]'>
              <p className='text-base md:text-xl text-Secondary2 flex items-center gap-2 md:gap-4'><img className='w-5 md:w-auto' src={EmailIcon} alt="" />{selectedUser.email}</p>
              <hr className='hidden md:block w-[1px] h-5 md:h-[38px] bg-background4' />
              <p className='text-base md:text-xl text-Secondary2 flex items-center gap-2 md:gap-4'><img className='w-4 md:w-auto' src={DateIcon} alt="" />{formattedDate(selectedUser.createdAt)}</p>
            </div>
            <div className='flex justify-center items-center mt-3 md:mt-7 min-h-[200px] h-[270px] md:h-[351px] w-full rounded-[22px] bg-background4'>
              {selectedUser.file ? <img className='rounded-3xl w-full max-w-[602px] max-h-[351px]' src={selectedUser.file} alt="" /> : <p className='text-Primary'>Not Upload Image</p>}
            </div>
            <p className='text-base md:text-lg text-Primary font-medium mt-3 md:mt-5'>Description :</p>
            <p className='text-sm md:text-base text-Secondary2 mt-[3px] md:mt-[6px]'>{selectedUser.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupportUser;
