import React, { useContext, useMemo, useRef, useState, useEffect } from 'react';
import Man from '../assets/Images/Man.png';
import PlusIcon from '../assets/svg/PlusIcon.svg';
import BanIcon from '../assets/Images/UserData/BanIcon.svg';
import ProfilePicture from '../assets/svg/ProfilePicture.svg';
import EditIcon from '../assets/Images/UserData/EditIcon.svg';
import ActionIcon from '../assets/Images/UserData/ActionIcon.svg';
import DeleteIcon from '../assets/Images/UserData/DeleteIcon.svg';
import BanPopupIcon from '../assets/Images/UserData/BanPopupIcon.svg';
import DeletePopupIcon from '../assets/Images/UserData/DeletePopupIcon.svg';
import PopupCloseIcon from '../assets/Images/SuperDashboard/PopupCloseIcon.svg';
import axios from 'axios';
import { validateEmail } from '../components/utils';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from "../components/AppContext";
import { getToken, getUserId } from '../page/login/loginAPI';

const MAX_FILE_SIZE = 1

const UserData = () => {

  const rowsLimit = 20;
  let navigate = useNavigate();
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const slackIDRef = useRef(null);
  const lastNameRef = useRef(null);
  const dropdownRef = useRef(null);
  const firstNameRef = useRef(null);
  const emailEditRef = useRef(null);
  const phoneEditRef = useRef(null);
  const fileInputRef = useRef(null);
  const slackIDEditRef = useRef(null);
  const submitButtonRef = useRef(null);
  const lastNameEditRef = useRef(null);
  const firstNameEditRef = useRef(null);
  const [file, setFile] = useState(null);
  let appContext = useContext(AppContext);
  const submitButtonEditRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [addUser, setAddUser] = useState(false);
  const [banUser, setBanUser] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [benUserID, setBenUserID] = useState(null);
  const [totalCount, setTotalCount] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [editUserID, setEditUserID] = useState(null);
  const [deleteUser, setDeleteUser] = useState(false);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState(null);
  const [userList, setUserList] = useState(appContext.userList);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    slackID: '',
    phone: '',
    email: '',
    plan: '',
    profilePicture: ''
  });


  // Get the current data slice
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
      let digitRegex = /^\d*$/;
      if (value.length >= 16 || !digitRegex.test(value)) {
        setMsg({ type: "error", msg: "Enter valid Number or too long number" });
        return;
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

  // Get All User List For Api
  async function fetchUserList() {
    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_GET_USER_LIST, { userId: getUserId(), page: currentPage, limit: rowsLimit, bannedUser: false }, {
        headers: {
          'x-access-token': getToken()
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
      setUserList([]);
    }
  }

  // Add New User For Admin Api
  const addNewUser = async (e) => {
    e.preventDefault();

    // Validate email format
    if (formData.email && !validateEmail(formData.email)) {
      setMsg({ type: "error", msg: "Please enter a valid email ID" });
      return;
    }

    const userId = getUserId();
    const formDataToSend = new FormData();
    formDataToSend.append("firstName", formData.first_name);
    formDataToSend.append("lastName", formData.last_name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("userId", userId);
    formDataToSend.append("slackId", formData.slackID);
    formDataToSend.append("phoneNo", formData.phone);
    formDataToSend.append("planId", formData.plan);

    if (selectedImage) {
      formDataToSend.append("profilePicture", selectedImage);
    }

    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_USER_REGISTER_ADMIN), formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          'x-access-token': getToken()
        },
      }
      );

      if (response.status === 201) {
        setMsg({ type: "info", msg: "User account created successfully!" });
        setAddUser(false);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          userId: "",
          slackID: "",
          phoneNo: "",
        });
        setSelectedImage(null);
        setProfilePicture(null);
        fetchUserList();
      }
    } catch (error) {
      if (error.message.includes("Network Error")) {
        setMsg({
          type: "error",
          msg: "Could not connect to the server. Please check your connection.",
        });
      }
    }
  };

  // Edit/Update User Data For Admin Api
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

    let payload = {
      updateUserId: editUserID,
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      profilePicture: profilePicture ? profilePicture : formData.profilePicture,
      slackId: formData.slackID,
      phoneNo: formData.phone,
      subscriptionId: formData.plan,
    };

    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_UPDATE_USER_DATA, { userId:getUserId(), ...payload }, {
        headers: {
          "Content-Type": "multipart/form-data",
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setMsg({ type: "info", msg: 'User account data updated successfully...' });
        setAddUser(false);
        setFormData({ first_name: '', last_name: '', slackID: '', phone: '', email: '', plan: '' })
        setSelectedImage(null);
        setProfilePicture(null);
        fetchUserList();
        editClosePopup();
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  };

  // Ben/UnBen User For Admin Api
  async function BanUser() {
    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_BEN_USER_DATA, { userId: getUserId(), banUserId: benUserID }, {
        headers: {
          'x-access-token': getToken()
        },
      })
      if (response.status === 201) {
        fetchUserList();
        setMsg({ type: "info", msg: 'User has been ban user...' });
        setBanUser(false);
      }
    } catch (error) {
      setBanUser(false)
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
        setDeleteUserId(null);
        setDeleteUserName(null);
        fetchUserList();
        setMsg({ type: "info", msg: 'User has been deleted...' });
        setDeleteUser(false);
      }
    } catch (error) {
      setDeleteUser(false)
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }

  async function fetchPlan() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SUBSCRIPTION_PLAN_LIST, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        const planData = response.data.data.map((plan) => ({
          _id: plan._id,
          name: plan.name,
          price: plan.price,
          recordLimit: plan.recordLimit,
          features: plan.features.map((feature) => ({
            keys: feature.subscriptionFeatureId,
            available: feature.available,
            name: feature.name
          }))
        }));
        appContext.setAppContext({ ...appContext, plans: planData })
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const handleDivClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };

  const showPopup = (index) => {
    if (activeRow === index) {
      setActiveRow(null); // If already active, close the popup
    } else {
      setActiveRow(index); // Open the popup for the clicked row
    }
  };

  const editClosePopup = () => {
    setEditUser(false); // Set to null to hide the popup
    setFormData({ first_name: '', last_name: '', slackID: '', phone: '', email: '', plan: '' });
    setSelectedImage(null)
    setProfilePicture(null)
    setEditUserID(null)
  };

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 20 * 100);
  }, [msg, appContext.plans])

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

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      nextRef.current.focus();
    }
  };

  useEffect(() => {
    const shouldDisableScroll = addUser || editUser || deleteUser || banUser;
    document.body.classList.toggle('no-scroll', shouldDisableScroll);

    return () => document.body.classList.remove('no-scroll');
  }, [addUser, editUser, deleteUser, banUser]);

  //Export Data
  async function ExportData() {
    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_EXPORT_DATA, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        },
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "exported_data.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
    }
  }

  //Import Data
  async function ImportData(file) {
    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_IMPORT_DATA, { userId: getUserId(), excelFile: file }, {
        headers: {
          "x-access-token": getToken(),
          "Content-Type": "multipart/form-data",
        },
      })
      setMessage({ type: "success", text: "File uploaded successfully!" });
      setUserList();
    } catch (error) {
      setMessage({ type: "error", text: "File upload failed. Please try again." });
    }
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleUpload = () => {
    ImportData(file);
  };

  useEffect(() => {
    fetchUserList(currentPage);
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, message]);


  return (
    <div className='px-5 lg:pl-10 lg:px-6'>
      <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'>User Data</h2>
      <div className='flex flex-wrap justify-between gap-5 mt-3 lg:mt-5'>
        <div className='flex justify-end gap-5'>
          <input
            type="file"
            accept=".xls, .xlsx"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <p className='text-sm lg:text-base font-medium text-center text-white bg-background2 py-2 px-5 rounded-[6px] cursor-pointer min-w-[100px]' onClick={triggerFileInput}>Upload file User</p>
          {file && <p className='text-sm lg:text-base font-medium text-center text-white bg-background2 py-2 px-5 rounded-[6px] cursor-pointer min-w-[100px]' onClick={handleUpload}> Import Data </p>}
        </div>
        <div className='flex flex-wrap justify-end gap-5'>
          <p className='text-sm lg:text-base font-medium text-center text-white bg-background2 py-2 px-5 rounded-[6px] cursor-pointer min-w-[100px] flex items-center gap-3' onClick={() => {
            setAddUser(true)
            if (appContext.plans.length === 0) {
              fetchPlan();
            }
          }}> Add User </p>
          <p className='text-sm lg:text-base font-medium text-center text-white bg-background2 py-2 px-5 rounded-[6px] cursor-pointer min-w-[100px]' onClick={ExportData}> Export Data </p>
          <Link to="/user-data-ban-user" className='text-sm lg:text-base font-medium text-center text-white bg-background2 py-2 px-5 rounded-[6px] cursor-pointer min-w-[100px]'> Ban User List </Link>
        </div>
      </div>

      {message && (<p className={message.type === "success" ? "text-Secondary2" : "text-[#D82525]"}>{message.text}</p>)}

      {(msg.msg === "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}</p>}
      <div className='relative mt-3 lg:mt-5 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
        <div className='overflow-x-auto rounded-md'>
          <table className="text-center min-w-full ">
            <thead>
              <tr>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] border-r border-borderColor rounded-ss-md bg-background2">Sr No.</th>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[140px] border-r border-borderColor bg-background2">First Name</th>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[202px] border-r border-borderColor bg-background2">Email</th>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[110px] lg:min-w-[90px] border-r border-borderColor bg-background2">Phone No.</th>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[130px] lg:min-w-[90px] border-r border-borderColor bg-background2">Subscription Name</th>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[70px] border-r border-borderColor bg-background2">Price</th>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[130px] lg:min-w-[90px] border-r border-borderColor bg-background2">Start Date</th>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[130px] lg:min-w-[90px] border-r border-borderColor bg-background2">End Date</th>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] border-r border-borderColor bg-background2">Day Count</th>
                <th className="text-base lg:text-lg font-medium text-white p-3 min-w-[90px] rounded-tr-md bg-background2">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(userList) && userList.length > 0 ? (
                userList.map((item, index) => (
                  <tr key={index} >
                    <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-borderColor">{totalCount - ((currentPage - 1) * rowsLimit + index)}</td>
                    <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-x border-borderColor"><span className='flex items-center gap-3'><img src={item.profilePicture ? item.profilePicture : Man} className='w-8 h-8 rounded-full object-cover' alt="" /> {item.firstName}</span> </td>
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
                        <span className="text-Secondary"> ({dayCount > 0 ? `${dayCount}` : 'Today'}) </span>
                      );
                    })()
                      : "-"}</td>
                    <td className="text-sm lg:text-base text-Secondary p-2 lg:p-3 border-b border-borderColor font-medium underline cursor-pointer" onClick={() => {
                      if (appContext.plans.length === 0) {
                        fetchPlan();
                      }
                      showPopup(index);
                    }} > <img className='mx-auto' src={ActionIcon} alt="" />
                      {activeRow === index && (
                        <div ref={dropdownRef} className="absolute right-0 z-10 bg-background6 border border-borderColor2 text-start py-2 lg:py-3 px-3 lg:px-5 mt-5 rounded-lg shadow-[0px_0px_6px_0px_#28236633] w-[140px] lg:w-[160px]">
                          <p className="text-sm lg:text-base text-Secondary2 mb-2 flex items-center gap-[10px] cursor-pointer"
                            onClick={() => {
                              setFormData({
                                first_name: item.firstName,
                                last_name: item.lastName,
                                email: item.email,
                                slackID: item.slackId,
                                phone: item.phoneNo,
                                activePlanView: item?.subscriptionDetails?.subscriptionName || "-"
                              });

                              setSelectedImage(item.profilePicture ? item.profilePicture : null);
                              setEditUserID(item._id);
                              setEditUser(true);
                            }}>
                            <img src={EditIcon} alt="" /> Edit User
                          </p>

                          <p className="text-sm lg:text-base text-Secondary2 mb-2 flex items-center gap-[10px] cursor-pointer" onClick={() => { setDeleteUser(true); setDeleteUserId(item._id); }}><img src={DeleteIcon} alt="" />Delete User</p>
                          <p className="text-sm lg:text-base text-Secondary2 mb-2 flex items-center gap-[10px] cursor-pointer" onClick={() => { setBanUser(true); setBenUserID(item._id); }}><img src={BanIcon} alt="" />{item.isUserBanned ? "UnBen User" : "Ban User"}</p>
                          <p onClick={() => {
                            appContext.setAppContext({
                              ...appContext, selectedUser: {
                                id: item._id,
                                first_name: item.firstName,
                                last_name: item.lastName,
                                email: item.email,
                                phone: item.phoneNo,
                                slackID: item.slackId,
                                selectedImage: (item.profilePicture ? item.profilePicture : Man),
                                activePlanView: item?.subscriptionDetails?.subscriptionName || "-"
                              }
                            })
                            navigate("/user-data-sub-page")
                          }} className="text-sm lg:text-base text-Secondary2 flex items-center gap-[10px] cursor-pointer"><img className='w-4' src={ActionIcon} alt="" /> More Detail</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center text-base lg:text-lg text-Primary px-3 py-4">
                    No User Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <span className='flex justify-end items-center w-full'>
          <button className="text-sm lg:text-base font-medium text-Primary flex items-center gap-2 lg:gap-3 p-3 lg:p-5 cursor-pointer" onClick={() => setAddUser(true)}>
            <img className='w-4 lg:w-auto' src={PlusIcon} alt="Add Coupon" /> User
          </button>
        </span>
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

      {/* Add New User By Admin Side */}
      {addUser && (
        <div className="m-5 fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className='h-full 2xl:h-auto overflow-y-auto relative p-5 md:p-[30px] border border-[#F8FCFF] rounded-[22px] bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-[1100px]'>
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={() => setAddUser(false)} src={PopupCloseIcon} alt="" />

            <h2 className='text-xl lg:text-[24px] lg:leading-[30px] text-Primary font-semibold'>Add User Details </h2>
            <p className='text-base lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium mt-4 flex gap-5'>Profile Picture</p>
            <div className='mt-2 px-3 lg:px-4 py-3 lg:py-5 border border-borderColor rounded-md bg-background5 max-w-[150px] lg:max-w-[173px] w-full cursor-pointer' onClick={handleDivClick}>
              <input type="file" ref={fileInputRef} accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
              <div className='flex justify-center'>
                {selectedImage ? (
                  <>
                    <img src={selectedImage} className="rounded-full w-[70px] lg:w-[100px] h-[70px] lg:h-[100px] object-cover" alt="Selected" />
                  </>
                ) : (
                  <img src={ProfilePicture} className='w-[70px] lg:w-[90px] h-[70px] lg:h-[90px]' alt="Placeholder" /> // Replace with a default placeholder image
                )}
              </div>
              <p className='text-sm lg:text-base text-Primary text-center mt-[14px]'>Choose A Photo</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-2 lg:mt-5">
              <div>
                <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium">First Name</label>
                <input type="text" name="first_name" placeholder='Enter your first name' value={formData.first_name} onChange={handleChange} ref={firstNameRef} onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
                  className="w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
              <div>
                <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium">Last Name</label>
                <input type="text" name="last_name" placeholder='Enter your last name' value={formData.last_name} onChange={handleChange} ref={lastNameRef} onKeyDown={(e) => handleKeyDown(e, slackIDRef)}
                  className="w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
              <div>
                <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium">Slack ID</label>
                <input type="text" name="slackID" placeholder='Enter your slack id' value={formData.slackID} onChange={handleChange} ref={slackIDRef} onKeyDown={(e) => handleKeyDown(e, phoneRef)}
                  className="w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
            </div>

            <h2 className='text-xl lg:text-[22px] lg:leading-[30px] text-Primary font-medium mt-3 lg:mt-5 mb-3'>Contact Information</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm lg:text-base text-Secondary2 font-medium">Phone No. (Optional)</label>
                <input type="text" name="phone" placeholder='Enter your phone no' value={formData.phone} onChange={handleChange} ref={phoneRef} onKeyDown={(e) => handleKeyDown(e, emailRef)}
                  className="w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
              <div>
                <label className="block text-sm lg:text-base text-Secondary2 font-medium">Email</label>
                <input type="text" name="email" placeholder='Enter your Email' value={formData.email} onChange={handleChange} ref={emailRef} onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
                  className="w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4 mt-2 lg:mt-3">
              <div className='max-w-[420px] lg:max-w-none'>
                <h2 className='text-xl lg:text-[22px] lg:leading-[30px] text-Primary font-medium mt-2 mb-3'>Subscription Plan</h2>
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
              </div>
            </div>

            <div className="flex justify-end mt-5 lg:mt-auto">
              <button type="submit" ref={submitButtonRef} onClick={addNewUser} className="text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 lg:py-[13px] lg:px-[30px]">
                Submit
              </button>
            </div>
            {(msg.msg !== "") && <p className={`text-sm text-end ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}
          </div>
        </div>
      )}

      {/* Edit User By Admin Side */}
      {editUser && (
        <div className="m-5 fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className='h-full 2xl:h-auto overflow-y-auto relative p-5 md:p-[30px] border border-[#F8FCFF]  rounded-[22px] bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-[1100px]'>
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={editClosePopup} src={PopupCloseIcon} alt="" />

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
                  <img src={ProfilePicture} className='w-[70px] lg:w-[90px] h-[70px] lg:h-[90px]' alt="Placeholder" /> // Replace with a default placeholder image
                )}
              </div>
              <p className='text-sm lg:text-base text-Primary text-center mt-[14px]'>Choose A Photo</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-2 lg:mt-5">
              <div>
                <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium">First Name</label>
                <input type="text" name="first_name" placeholder='Enter you first name' value={formData.first_name} onChange={handleChange} ref={firstNameEditRef} onKeyDown={(e) => handleKeyDown(e, lastNameEditRef)}
                  className="w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
              <div>
                <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium">Last Name</label>
                <input type="text" name="last_name" placeholder='Enter your last name' value={formData.last_name} onChange={handleChange} ref={lastNameEditRef} onKeyDown={(e) => handleKeyDown(e, slackIDEditRef)}
                  className="w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
              <div>
                <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Secondary2 font-medium">Slack ID</label>
                <input type="text" name="slackID" placeholder='Enter your slack id' value={formData.slackID} onChange={handleChange} ref={slackIDEditRef} onKeyDown={(e) => handleKeyDown(e, phoneEditRef)}
                  className="w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
            </div>

            <h2 className='text-xl lg:text-[22px] lg:leading-[30px] text-Primary font-medium mt-3 lg:mt-5 mb-3'>Contact Information</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm lg:text-base text-Secondary2 font-medium">Phone No. (Optional)</label>
                <input type="text" name="phone" placeholder='Enter your phone no' value={formData.phone} onChange={handleChange} ref={phoneEditRef} onKeyDown={(e) => handleKeyDown(e, emailEditRef)}
                  className="w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
              <div>
                <label className="lock text-sm lg:text-base text-Secondary2 font-medium">Email</label>
                <input type="text" name="email" placeholder='Enter your Email' value={formData.email} onChange={handleChange} ref={emailEditRef} onKeyDown={(e) => handleKeyDown(e, submitButtonEditRef)}
                  className="w-full mt-1 lg:mt-2 px-3 lg:px-5 py-[5px] lg:py-2 text-[14px] leading-[32px] text-Primary border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4 max-w-[420px] lg:max-w-none" title='Change existing plan manually'>
              <div>
                <h2 className='text-xl lg:text-[22px] lg:leading-[30px] text-Primary font-medium mt-5 mb-3'>Manual Subscription Plan</h2>
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
                {formData.activePlanView.length > 3 && <p className='text-Secondary2 m-1'>User has {formData.activePlanView} Activated...</p>}
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

      {/* Delete User By Admin Slide */}
      {deleteUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="relative mx-1 p-4 lg:p-[30px] border border-[#F8FCFF] bg-background6 rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[350px] md:w-[400px] lg:w-[668px]">
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={() => setDeleteUser(false)} src={PopupCloseIcon} alt="" />
            <div className='flex justify-center'>
              <img className='w-9 sm:w-11 lg:w-16' src={DeletePopupIcon} alt="Logout Icon" />
            </div>
            <h3 className="text-lg lg:text-[28px] lg:leading-[42px] text-Primary font-semibold mx-auto mt-3 lg:mt-[26px] text-center">Are you sure you want to delete “{deleteUserName}”?</h3>
            <p className='text-sm lg:text-base text-Secondary2 text-center mt-1 lg:mt-3 lg:mx-5'>This action is permanent and will remove all user data, including their account, activity history, and settings. This cannot be undone.</p>
            <div className="flex justify-center gap-5 mt-5 lg:mt-9">
              <button onClick={(_) => deleteUserWithId()} className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 border border-borderColor3 rounded-md w-full max-w-[150px] lg:max-w-[185px]">
                Delete User
              </button>
              <button
                className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full max-w-[150px] lg:max-w-[185px]"
                onClick={() => { setDeleteUser(false); setDeleteUserId(null); setDeleteUserName(null) }} >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban User By Admin Slide */}
      {banUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="relative mx-1 p-4 lg:p-[30px] border border-[#F8FCFF] bg-background6 rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[350px] md:w-[400px] lg:w-[648px]">
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={() => setBanUser(false)} src={PopupCloseIcon} alt="" />
            <div className='flex justify-center'>
              <img className='w-9 sm:w-11 lg:w-16' src={BanPopupIcon} alt="Logout Icon" />
            </div>
            <h3 className="text-lg lg:text-[28px] lg:leading-[42px] text-Primary font-semibold mx-auto mt-4 lg:mt-[26px] text-center">Are you sure you want to ban?</h3>
            <p className='text-sm lg:text-base text-Secondary2 text-center mt-3'>Banning will restrict their access to the platform, and they will no longer be able to log in or use their account.</p>
            <div className="flex justify-center gap-5 mt-5 lg:mt-9">
              <button onClick={BanUser} className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 border border-borderColor3 rounded-md w-full max-w-[150px] lg:max-w-[185px]">
                Ban User
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
    </div>
  );
}

export default UserData;
