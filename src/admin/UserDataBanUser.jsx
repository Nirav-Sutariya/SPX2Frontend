import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import ManImg from '../assets/Images/Man.png';
import DropdownIcon from '../assets/svg/DropdownIcon.svg';
import BanIcon from '../assets/Images/UserData/BanIcon.svg';
import ActionIcon from '../assets/Images/UserData/ActionIcon.svg';
import DeleteIcon from '../assets/Images/UserData/DeleteIcon.svg';
import BanPopupIcon from '../assets/Images/UserData/BanPopupIcon.svg';
import DeletePopupIcon from '../assets/Images/UserData/DeletePopupIcon.svg';
import PopupCloseIcon from '../assets/Images/SuperDashboard/PopupCloseIcon.svg';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AppContext } from "../components/AppContext";
import { getToken, getUserId } from '../page/login/loginAPI';

const UserDataBanUser = () => {

  const rowsLimit = 10;
  const dropdownRef = useRef(null);
  let appContext = useContext(AppContext);
  const [banUser, setBanUser] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [benUserID, setBenUserID] = useState(null);
  const [totalCount, setTotalCount] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteUser, setDeleteUser] = useState(false);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [userList, setUserList] = useState(appContext.userList);


  // Get All User List For Api
  async function fetchUserList() {
    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_GET_USER_LIST, { userId: getUserId(), page: currentPage, limit: rowsLimit, bannedUser: true }, {
        headers: {
          'x-access-token': getToken(),
        }
      })
      if (response.status === 200) {
        const userData = Array.isArray(response.data?.data) ? response.data.data : [];
        setUserList(userData);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        appContext.setAppContext((curr) => ({ ...curr, userList: userData }));
      }
    } catch (error) {
      setUserList([]); // Ensure it's always an array
    }
  }

  // Ben/UnBen User For Admin Api
  async function BanUser() {
    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_BEN_USER_DATA, { userId: getUserId(), banUserId: benUserID }, {
        headers: {
          'x-access-token': getToken()
        },
      })
      if (response.status === 201) {
        fetchUserList()
        setMsg({ type: "info", msg: 'User has been ban user...' });
        setBanUser(false)
      }
    } catch (error) {
      setBanUser(false);
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }

  // Delete User By Admin
  async function deleteUserWithId() {
    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_DELETE_USER_ACCOUNT_BY_ADMIN), { userId: getUserId(), appUserId: deleteUserId }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        fetchUserList()
        setDeleteUser(false)
        setDeleteUserId(null)
        setMsg({ type: "info", msg: 'User has been deleted...' });
      }
    } catch (error) {
      setDeleteUser(false)
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }

  useMemo(() => {
    fetchUserList()
  }, [])

  const showPopup = (index) => {
    if (activeRow === index) {
      setActiveRow(null); // If already active, close the popup
    } else {
      setActiveRow(index); // Open the popup for the clicked row
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActiveRow]);


  return (
    <>
      <div className='px-5 lg:pl-10 lg:px-6'>
        <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold flex items-center gap-2'><Link to="/user-data">User Data</Link><img className='-rotate-90 h-[5px] lg:h-auto' src={DropdownIcon} alt="" /> <h4 className='text-base lg:text-[22px] lg:leading-[33px] font-normal'>Ban User List</h4></h2>
        <div className='relative mt-3 lg:mt-5 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
          <div className='overflow-x-auto rounded-md'>
            <table className="text-center min-w-full ">
              <thead>
                <tr>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] border-r border-borderColor rounded-ss-md bg-background2">Sr No.</th>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[140px] border-r border-borderColor bg-background2">First Name</th>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[202px] border-r border-borderColor bg-background2">Email</th>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] border-r border-borderColor bg-background2">Phone No.</th>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] border-r border-borderColor bg-background2">Subscription Name</th>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[70px] border-r border-borderColor bg-background2">Price</th>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] border-r border-borderColor bg-background2">Start Date</th>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] border-r border-borderColor bg-background2">End Date</th>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] border-r border-borderColor bg-background2">Day Count</th>
                  <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] rounded-tr-md bg-background2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(userList) && userList.length > 0 ? (
                  userList.map((item, index) => (
                    <tr key={index} >
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-borderColor">{totalCount - ((currentPage - 1) * rowsLimit + index)}</td>
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor"><span className='flex items-center gap-3'><img src={item.profilePicture ? item.profilePicture : ManImg} className='w-8 h-8 rounded-full object-cover' alt="" /> {item.firstName}</span> </td>
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor">{item.email}</td>
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor">{item.phoneNo || "-"}</td>
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor">{item?.subscriptionDetails?.subscriptionName || "-"}</td>
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor">{item?.subscriptionDetails?.totalPrice || "-"}</td>
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor">{item?.subscriptionDetails?.subscriptionStartDate?.split("T")[0] || "-"}</td>
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor">{item?.subscriptionDetails?.subscriptionEndDate?.split("T")[0] || "-"}</td>
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor">{item.subscriptionDetails?.subscriptionStartDate ? (() => {
                        const startDate = new Date(item.subscriptionDetails.subscriptionStartDate);
                        const today = new Date();
                        const dayCount = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
                        return (
                          <span className="ml-2 text-Secondary">
                            ({dayCount > 0 ? `${dayCount}` : 'Today'})
                          </span>
                        );
                      })()
                        : "-"}</td>
                      <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-borderColor font-medium underline cursor-pointer " onClick={() => showPopup(index)}> <img className='mx-auto' src={ActionIcon} alt="" />
                        {activeRow === index && (
                          <div ref={dropdownRef} className="absolute right-0 z-10 bg-background6 border border-borderColor2 text-start py-2 lg:py-3 px-3 lg:px-5 mt-5 rounded-lg shadow-[0px_0px_6px_0px_#28236633] w-[140px] lg:w-[160px]">
                            <p className="text-sm lg:text-base text-Secondary2 mb-2 flex items-center gap-[10px] cursor-pointer" onClick={() => { setDeleteUser(true); setDeleteUserId(item._id); }}><img src={DeleteIcon} alt="" />Delete User</p>
                            <p className="text-sm lg:text-base text-Secondary2 mb-2 flex items-center gap-[10px] cursor-pointer" onClick={() => { setBanUser(true); setBenUserID(item._id); }}><img src={BanIcon} alt="" />UnBen User</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center text-base lg:text-lg text-Primary px-3 py-4">
                      No Ban User Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-5 pt-5 border-t border-borderColor">
          <button className="text-sm lg:text-base font-medium text-center text-white bg-background2 py-2 px-5 rounded-[6px] cursor-pointer min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} >
            Previous
          </button>

          <span className="text-sm lg:text-base font-medium text-center text-Primary py-2 px-5 ">
            Page {currentPage} of {totalPages}
          </span>

          <button className="text-sm lg:text-base font-medium text-center text-white bg-background2 py-2 px-5 rounded-[6px] cursor-pointer min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} >
            Next
          </button>
        </div>
      </div>

      {/* Delete User By Admin Slide */}
      {deleteUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="relative mx-1 p-4 lg:p-[30px] border border-[#F8FCFF] bg-background6 rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[350px] md:w-[400px] lg:w-[668px]">
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={() => setDeleteUser(false)} src={PopupCloseIcon} alt="" />
            <div className='flex justify-center'>
              <img className='w-9 sm:w-11 lg:w-16' src={DeletePopupIcon} alt="Logout Icon" />
            </div>
            <h3 className="text-lg lg:text-[28px] lg:leading-[42px] text-Primary font-semibold mx-auto mt-3 lg:mt-[26px] text-center">Are you sure you want to delete?</h3>
            <p className='text-sm lg:text-base text-Secondary2 text-center mt-1 lg:mt-3 lg:mx-5'>This action is permanent and will remove all user data, including their account, activity history, and settings. This cannot be undone.</p>
            <div className="flex justify-center gap-5 mt-5 lg:mt-9">
              <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 border border-borderColor3 rounded-md w-full max-w-[150px] lg:max-w-[185px]" onClick={(_) => deleteUserWithId()}>
                Delete User
              </button>
              <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full max-w-[150px] lg:max-w-[185px]" onClick={() => { setDeleteUser(false); setDeleteUserId(null) }} >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UnBan User By Admin Slide */}
      {banUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="relative mx-1 p-4 lg:p-[30px] border border-[#F8FCFF] bg-background6 rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[350px] md:w-[400px] lg:w-[648px]">
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={() => setBanUser(false)} src={PopupCloseIcon} alt="" />
            <div className='flex justify-center'>
              <img className='w-9 sm:w-11 lg:w-16' src={BanPopupIcon} alt="Logout Icon" />
            </div>
            <h3 className="text-lg lg:text-[28px] lg:leading-[42px] text-Primary font-semibold mx-auto mt-4 lg:mt-[26px] text-center">Are you sure you want to UnBen?</h3>
            <p className='text-sm lg:text-base text-Secondary2 text-center mt-3'>Banning will restrict their access to the platform, and they will no longer be able to log in or use their account.</p>
            <div className="flex justify-center gap-5 mt-5 lg:mt-9">
              <button onClick={BanUser} className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 border border-borderColor3 rounded-md w-full max-w-[150px] lg:max-w-[185px]">
                UnBan User
              </button>
              <button
                className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full max-w-[150px] lg:max-w-[185px]"
                onClick={() => { setBanUser(false); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserDataBanUser;
