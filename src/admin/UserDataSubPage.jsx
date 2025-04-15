import React, { useContext, useMemo, useRef, useState } from 'react';
import DropdownIcon from '../assets/svg/DropdownIcon.svg';
import BanIcon from '../assets/Images/UserData/BanIcon.svg';
import EditIcon from '../assets/Images/UserData/EditIcon.svg';
import GmailIcon from '../assets/Images/UserData/GmailIcon.svg';
import PhoneIcon from '../assets/Images/UserData/PhoneIcon.svg';
import DeleteIcon from '../assets/Images/UserData/DeleteIcon.svg';
import WebsiteIcon from '../assets/Images/UserData/WebsiteIcon.svg';
import BanPopupIcon from '../assets/Images/UserData/BanPopupIcon.svg';
import DeletePopupIcon from '../assets/Images/UserData/DeletePopupIcon.svg';
import CancelPlanIcon from '../assets/Images/Subscription/CancelPlanIcon.svg';
import PopupCloseIcon from '../assets/Images/SuperDashboard/PopupCloseIcon.svg';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../components/AppContext';
import { generatePDF } from '../page/SubscriptionHistory';
import { CancelUserSubscription } from '../components/utils';
import { getToken, getUserId } from '../page/login/loginAPI';
import { formattedDate, validateEmail } from '../components/utils';

const MAX_FILE_SIZE = 1

const UserDataSubPage = () => {

  let navigate = useNavigate()
  const phoneEditRef = useRef(null);
  const emailEditRef = useRef(null);
  const fileInputRef = useRef(null);
  const slackIDEditRef = useRef(null);
  const lastNameEditRef = useRef(null);
  const firstNameEditRef = useRef(null);
  let appContext = useContext(AppContext);
  const submitButtonEditRef = useRef(null);
  if (!appContext.selectedUser) { navigate('/') }
  const [formData, setFormData] = useState({
    first_name: appContext.selectedUser.first_name,
    last_name: appContext.selectedUser.last_name,
    slackID: appContext.selectedUser.slackID,
    phone: appContext.selectedUser.phone,
    email: appContext.selectedUser.email,
    profilePicture: appContext.selectedUser.profilePicture,
    plan: ""
  });
  const [banUser, setBanUser] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [plansData, setPlanData] = useState(appContext.subscriptionHistory);
  const [selectedImage, setSelectedImage] = useState(appContext.selectedUser.selectedImage ? appContext.selectedUser.selectedImage : null);
  const [showModal, setShowModal] = useState(false);
  const [isActiveSub, setIsActiveSub] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [activePlanName, setActivePlanName] = useState(null);


  // Get User Subscription History Api
  async function fetchSubscriptionHistory() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SUBSCRIPTION_HISTORY_BY_ADMIN, { userId: getUserId(), appUserId: appContext.selectedUser.id }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setPlanData(response.data.data || []);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch subscription history. Please try again.";
      setMsg({ type: "error", msg: errorMsg });
    }
  }

  // User Update/Edit By Admin Api
  const editExistingUser = async (e) => {
    e.preventDefault();
    if (formData.email)
      if (validateEmail(formData.email) === false) {
        setMsg({ type: "error", msg: "Please enter valid email id" })
        return
      }
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key])
        if (key === "plan")
          formDataToSend.append("groups", formData[key]);
        else
          formDataToSend.append(key, formData[key]);
    });
    if (profilePicture) {
      formDataToSend.append('profilePicture', profilePicture);
    }
    // Create the payload object
    let payload = {
      updateUserId: appContext.selectedUser.id,
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      profilePicture: profilePicture ? profilePicture : formData.profilePicture,
      slackId: formData.slackID,
      phoneNo: formData.phone,
      subscriptionId: formData.plan,
    };

    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_UPDATE_USER_DATA, { userId: getUserId(), ...payload }, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": getToken(),
        }
      })
      if (response.status === 201) {
        setMsg({ type: "info", msg: 'User account data updated successfully...' });
        setSelectedImage(null)
        setProfilePicture(null)
        setEditUser(false)
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  };

  // User Ban By Admin Api
  async function BanUser() {
    if (appContext.selectedUser.id) {
      try {
        let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_BEN_USER_DATA, { userId: getUserId(), banUserId: appContext.selectedUser.id }, {
          headers: {
            "x-access-token": getToken()
          }
        })
        if (response.status === 201) {
          setMsg({ type: "info", msg: 'User has been ban user...' });
          navigate("/user-data")
        }
      } catch (error) {
        setBanUser(false);
        if (error.message.includes('Network Error')) {
          setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
        } else {
          const errorMsg = error.response?.data?.msg || "An unexpected error occurred.";
          setMsg({ type: "error", msg: errorMsg });
        }
      }
    }
  }

  // Delete User By Admin Api
  async function deleteUserWithId() {
    if (appContext.selectedUser.id) {
      try {
        let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_DELETE_USER_ACCOUNT_BY_ADMIN), { userId: getUserId(), appUserId: appContext.selectedUser.id }, {
          headers: {
            'x-access-token': getToken()
          }
        })
        if (response.status === 200) {
          setMsg({ type: "info", msg: 'User has been deleted...' });
          navigate("/user-data")
        }
      } catch (error) {
        if (error.message.includes('Network Error')) {
          setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
        }
      }
    }
  }

  useMemo(() => {
    fetchSubscriptionHistory()
  }, [])

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    if (name === "first_name" || name === "last_name") {
      const regex = /^[A-Za-z]*$/;
      if (!regex.test(value)) {
        setMsg({ type: "error", msg: "Only alphabetic characters are allowed for First Name and Last Name." });
        return;
      }
      value = value.charAt(0).toUpperCase() + value.slice(1);
      if (value.length > 16) {
        setMsg({ type: "error", msg: "First Name and Last Name should not exceed 16 characters." });
        return;
      }
    }

    if (name === "slackID") {
      if (value.length >= 21) {
        setMsg({ type: "error", msg: "Slack ID should not be more than 20 characters" });
        return
      }
    }

    if (name === "phone") {
      let digitRegex = /^\d+$/
      if ((value.length >= 16) || isNaN(value) || (!digitRegex.test(value))) {
        setMsg({ type: "error", msg: "Enter valid Number or too long number" });
        return
      }
    }

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        plan: (checked ? value : "")
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.endsWith('/png') || file.type.endsWith('/jpg') || file.type.endsWith('/jpeg'))) {
      if (file.size > (MAX_FILE_SIZE * 1024 * 1024)) {
        setMsg({ type: "error", msg: `File size exceeds ${MAX_FILE_SIZE}MB limit. Please upload a smaller image.` });
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setProfilePicture(file)
    }
  };

  const handleDivClick = () => {
    fileInputRef.current.click();
  };

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 20 * 100);
  }, [msg])

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      nextRef.current.focus();
    }
  };


  return (
    <div className='px-5 lg:pl-10 lg:px-6'>
      <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold flex items-center gap-2'><Link to="/user-data">User Data</Link><img className='-rotate-90 h-[5px] lg:h-auto' src={DropdownIcon} alt="" /> <h4 className='text-base lg:text-[22px] lg:leading-[33px] font-normal'>{appContext.selectedUser.first_name}</h4></h2>
      <div className='flex flex-wrap sm:flex-nowrap gap-3 sm:gap-[60px] mt-3 sm:mt-10'>
        <div className='flex gap-10 items-center sm:block'>
          <img className='w-28 h-28 sm:w-auto' src={appContext.selectedUser.selectedImage} alt="" />
        </div>
        <div className='w-full'>
          <span className='flex justify-between items-center w-full'>
            <p className='text-base lg:text-[20px] lg:leading-[30px] text-Primary flex items-center gap-3 lg:gap-[18px]'><img className='w-5 lg:w-auto' src={GmailIcon} alt="" />{appContext.selectedUser.email}</p>
            <p className='text-sm lg:text-base text-Secondary2 font-medium border border-borderColor7 rounded bg-background7 py-1 px-3 flex items-center gap-3 cursor-pointer' onClick={() => setEditUser(true)}><img src={EditIcon} alt="" /> Edit </p>
          </span>
          <span className='flex justify-between items-center w-full mt-3 lg:mt-4'>
            <p className='text-base lg:text-[20px] lg:leading-[30px] text-Primary flex items-center gap-3 lg:gap-[18px]'><img className='w-5 lg:w-auto' src={PhoneIcon} alt="" /> {appContext.selectedUser.phone ? appContext.selectedUser.phone : "-"}</p>
            <p className='text-sm lg:text-base text-Secondary2 font-medium border border-borderColor7 rounded bg-background7 py-1 px-3 flex items-center gap-3 cursor-pointer' onClick={() => setDeleteUser(true)}><img src={DeleteIcon} alt="" /> Delete </p>
          </span>
          <span className='flex justify-between items-center w-full mt-3 lg:mt-4'>
            <p className='text-base lg:text-[20px] lg:leading-[30px] text-Primary flex items-center gap-3 lg:gap-[18px]'><img className='w-5 lg:w-auto' src={WebsiteIcon} alt="" /> {appContext.selectedUser.slackID ? appContext.selectedUser.slackID : "-"}</p>
            <p className='text-sm lg:text-base text-Secondary2 font-medium border border-borderColor7 rounded bg-background7 py-1 px-3 flex items-center gap-3 cursor-pointer' onClick={() => setBanUser(true)}><img src={BanIcon} alt="" /> Ban </p>
          </span>
        </div>
      </div>

      <div className='flex justify-end gap-5 mb-3 pt-5 lg:pt-10 sm:mt-5 lg:mt-auto'>
        {isActiveSub ? <li className='text-base lg:text-lg text-[#6FBA47]'>Active</li> :
          <li className='text-base lg:text-lg text-[#EF4646]'>Cancelled</li>}
      </div>

      <div className=" overflow-x-auto text-center rounded-md pb-10">
        <table className="min-w-full rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]">
          <thead>
            <tr>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 lg:p-4 min-w-[170px] lg:min-w-0 border-r border-borderColor rounded-ss-md bg-background2">Plan</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 lg:p-4 min-w-[170px] lg:min-w-0 border-r border-borderColor bg-background2">Start Date</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 lg:p-4 min-w-[170px] lg:min-w-0 border-r border-borderColor bg-background2">Expiry Date</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 lg:p-4 min-w-[170px] lg:min-w-0 border-r border-borderColor bg-background2">Amount</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 lg:p-4 min-w-[170px] lg:min-w-0 border-r border-borderColor bg-background2">Payment Date</th>
              <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-3 lg:p-4 min-w-[180px] lg:min-w-0 rounded-tr-md bg-background2">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {plansData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-base lg:text-lg text-Primary px-3 py-4">
                  No Subscriptions Found.
                </td>
              </tr>
            ) : (plansData.map((item, index) => (
              <tr key={index} className={(item.subscriptionStatus && 'bg-green-400')}>
                <td className="text-sm lg:text-base text-Secondary p-3 lg:p-4 border-t border-borderColor" onLoad={(!isActiveSub & item.subscriptionStatus && setActivePlanName(item.subscriptionName))}>{item.subscriptionName[0].toUpperCase() + item.subscriptionName.slice(1)}</td>
                <td className="text-sm lg:text-base text-Secondary p-3 lg:p-4 border-t border-x border-borderColor">{formattedDate(item.subscriptionStartDate)}</td>
                <td className="text-sm lg:text-base text-Secondary p-3 lg:p-4 border-t border-x border-borderColor">{formattedDate(item.subscriptionEndDate)}</td>
                <td className="text-sm lg:text-base text-Secondary p-3 lg:p-4 border-t border-x border-borderColor">{item.totalPrice}</td>
                <td className="text-sm lg:text-base text-Secondary p-3 lg:p-4 border-t border-x border-borderColor">{formattedDate(item.subscriptionStartDate)}</td>
                <td className="text-sm lg:text-base text-Secondary p-3 lg:p-4 border-t border-borderColor" onLoad={(!isActiveSub & item.subscriptionStatus && setIsActiveSub(true))}>
                  <a className="text-sm lg:text-base font-medium text-Secondary underline cursor-pointer" onClick={() => { generatePDF(item, appContext.selectedUser.first_name, appContext.selectedUser.email) }}>Download Invoice</a>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
        {isActiveSub && <p className='text-xs lg:text-base text-Primary font-medium text-end underline mt-[6px] cursor-pointer' onClick={() => { setShowModal(true); }}> Cancel Plan</p>}

        {showModal && <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="p-4 lg:p-[30px] border border-borderColor5 rounded-lg bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-[360px] lg:w-[486px]">
            <div className="flex justify-center">
              <div className="mx-auto p-5 lg:p-7 border border-borderColor rounded-md bg-background3">
                <img className="w-7 lg:w-auto" src={CancelPlanIcon} alt="Reset Icon" />
              </div>
            </div>
            <h2 className="text-lg lg:text-[28px] lg:leading-[33px] font-semibold text-Secondary2 mx-auto max-w-[600px] mt-5 text-center">Cancel Subscription Plan</h2>
            <h2 className="text-base lg:text-[18px] lg:leading-[33px] text-Secondary2 mx-auto max-w-[400px] lg:mt-2 text-center">Are you sure you want to cancel your subscription?</h2>
            <div className="flex justify-between gap-3 mt-5 lg:mt-9">
              <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 border border-borderColor3 bg-background5 rounded-md w-full" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full" onClick={async () => {
                await CancelUserSubscription(appContext.selectedUser.id)
                setShowModal(false);
              }}>Confirm</button>
            </div>
          </div>
        </div>}
      </div>

      {editUser && (
        <div className="m-5 fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className='h-full 2xl:h-auto overflow-y-auto relative p-5 md:p-[30px] border border-[#F8FCFF]  rounded-[22px] bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-[1100px]'>
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={() => setEditUser(false)} src={PopupCloseIcon} alt="" />

            <h2 className='text-xl lg:text-[24px] lg:leading-[30px] text-Primary font-semibold'>Edit User Details</h2>
            {(msg.msg !== "") && <p className={`text-sm mt-2 ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}</p>}
            <p className='text-base lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium mt-4 flex gap-5'>Profile Picture </p>

            <div className='mt-2 px-3 lg:px-4 py-3 lg:py-5 border border-borderColor rounded-md bg-background5 max-w-[150px] lg:max-w-[173px] w-full cursor-pointer' onClick={handleDivClick}>
              <input type="file" ref={fileInputRef} accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
              <div className='flex justify-center'>
                {selectedImage ? (
                  <>
                    <img src={selectedImage} className="rounded-full w-[70px] lg:w-[100px] h-[70px] lg:h-[100px] object-cover" alt="Selected" />
                  </>
                ) : (
                  <img src={profilePicture} className='w-[70px] lg:w-[90px] h-[70px] lg:h-[90px]' alt="Placeholder" /> // Replace with a default placeholder image
                )}
              </div>
              <p className='text-sm lg:text-base text-Primary text-center mt-[14px]'>Choose A Photo</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-2 lg:mt-5">
              <div>
                <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium">First Name</label>
                <input type="text" name="first_name" placeholder='Enter you first name' value={formData.first_name} onChange={handleChange} ref={firstNameEditRef} onKeyDown={(e) => handleKeyDown(e, lastNameEditRef)}
                  className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
              <div>
                <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium">Last Name</label>
                <input type="text" name="last_name" placeholder='Enter your last name' value={formData.last_name} onChange={handleChange} ref={lastNameEditRef} onKeyDown={(e) => handleKeyDown(e, slackIDEditRef)}
                  className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
              <div>
                <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium">Slack ID</label>
                <input type="text" name="slackID" placeholder='Enter your slack id' value={formData.slackID} onChange={handleChange} ref={slackIDEditRef} onKeyDown={(e) => handleKeyDown(e, phoneEditRef)}
                  className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
            </div>

            <h2 className='text-xl lg:text-[22px] lg:leading-[30px] text-Primary font-medium mt-3 lg:mt-5 mb-3'>Contact Information</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm lg:text-base text-Secondary2 font-medium">Phone No. (Optional)</label>
                <input type="text" name="phone" placeholder='Enter your phone no' value={formData.phone} onChange={handleChange} ref={phoneEditRef} onKeyDown={(e) => handleKeyDown(e, emailEditRef)}
                  className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
              <div>
                <label className="lock text-sm lg:text-base text-Secondary2 font-medium">Email</label>
                <input type="text" name="email" placeholder='Enter your Email' value={formData.email} onChange={handleChange} ref={emailEditRef} onKeyDown={(e) => handleKeyDown(e, submitButtonEditRef)}
                  className="text-Primary w-full mt-1 lg:mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4 max-w-[420px] lg:max-w-none">
              <div>
                <h2 className='text-xl lg:text-[22px] lg:leading-[30px] text-Primary font-medium mt-5 mb-3'>Subscription Plan</h2>
                <div className='flex flex-wrap justify-between gap-3 px-4 lg:px-8 py-[7px] lg:py-[15px] border border-borderColor rounded-md bg-textBoxBg'>
                  {appContext.plans?.map((plan) => (
                    <label key={plan._id} className='text-sm text-Secondary2 flex items-center gap-3'>
                      <input
                        className='accent-accentColor'
                        type="checkbox"
                        name="plan"
                        value={plan._id}
                        checked={formData.plan === String(plan._id)}
                        onChange={handleChange}
                      />
                      {plan.name}
                    </label>
                  ))}
                </div>
                {activePlanName && <p className='text-Secondary2 m-1'>User has {activePlanName} Activated...</p>}
              </div>
            </div>

            <div className="flex justify-end mt-5 lg:mt-auto">
              <button type="button" ref={submitButtonEditRef} onClick={editExistingUser} className="text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 lg:py-[13px] lg:px-[30px]" >
                Update Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="relative mx-1 p-4 lg:p-[30px] bg-background6 border border-[#F8FCFF] rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[350px] md:w-[400px] lg:w-[668px]">
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={() => setDeleteUser(false)} src={PopupCloseIcon} alt="" />
            <div className='flex justify-center'>
              <img className='w-9 sm:w-11 lg:w-16' src={DeletePopupIcon} alt="Logout Icon" />
            </div>
            <h3 className="text-lg lg:text-[28px] lg:leading-[42px] text-Primary font-semibold mx-auto mt-3 lg:mt-[26px] text-center">Are you sure you want to delete “{formData.first_name}”?</h3>
            <p className='text-sm lg:text-base text-Secondary2 text-center mt-1 lg:mt-3 lg:mx-[58px]'>This action is permanent and will remove all user data, including their account, activity history, and settings. This cannot be undone.</p>
            <div className="flex justify-center gap-5 mt-5 lg:mt-9">
              <button onClick={() => deleteUserWithId()} className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 border border-borderColor3 rounded-md w-full max-w-[150px] lg:max-w-[185px]">
                Delete User
              </button>
              <button
                className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full max-w-[150px] lg:max-w-[185px]"
                onClick={() => setDeleteUser(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {banUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="relative mx-1 p-4 lg:p-[30px] bg-background6 border border-[#F8FCFF] rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[350px] md:w-[400px] lg:w-[648px]">
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={() => setBanUser(false)} src={PopupCloseIcon} alt="" />
            <div className='flex justify-center'>
              <img className='w-9 sm:w-11 lg:w-16' src={BanPopupIcon} alt="Logout Icon" />
            </div>
            <h3 className="text-lg lg:text-[28px] lg:leading-[42px] text-Primary font-semibold mx-auto mt-4 lg:mt-[26px] text-center">Are you sure you want to ban “{formData.first_name}”?</h3>
            <p className='text-sm lg:text-base text-Secondary2 text-center mt-1 md:mt-3 mx-2 lg:mx-5'>Banning will restrict their access to the platform, and they will no longer be able to log in or use their account.</p>
            <div className="flex justify-center gap-5 mt-5 lg:mt-9">
              <button onClick={BanUser}
                className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 border border-borderColor3 rounded-md w-full max-w-[185px]">
                Ban User
              </button>
              <button
                className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full max-w-[150px] lg:max-w-[185px]"
                onClick={() => setBanUser(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDataSubPage;