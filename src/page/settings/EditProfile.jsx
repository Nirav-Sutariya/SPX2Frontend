import React, { useState, useRef, useContext, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getToken, getUserId } from '../login/loginAPI';
import { AppContext } from '../../components/AppContext';
import BackIcon from '../../assets/svg/BackIcon.svg';
import PasswordIIcon from '../../assets/Images/Login/PasswordIIcon.svg';
import DeleteIcon from '../../assets/Images/StaticMatrix/DeleteIcon.svg';
import PasswordIIcon2 from '../../assets/Images/Login/PasswordIIcon2.svg';
import ProfilePicture from '../../assets/Images/Setting/ProfilePicture.svg';
import DeletePopupIcon from '../../assets/Images/UserData/DeletePopupIcon.svg';
import PopupCloseIcon from '../../assets/Images/SuperDashboard/PopupCloseIcon.svg';

const MAX_FILE_SIZE = 2

const EditProfile = () => {

  const phoneRef = useRef(null);
  const slackIdRef = useRef(null);
  const lastNameRef = useRef(null);
  const firstNameRef = useRef(null);
  const fileInputRef = useRef(null);
  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const submitButtonRef = useRef(null);
  const submitButton2Ref = useRef(null);
  let appContext = useContext(AppContext);
  const confirmPasswordRef = useRef(null);
  const [deleteUser, setDeleteUser] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', msg: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [msgM1, setMsgM1] = useState({ type: "", msg: "" });
  const [msgM2, setMsgM2] = useState({ type: "", msg: "" });
  const [showPassword2, setShowPassword2] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedImage, setSelectedImage] = useState(appContext.profilePhoto);
  const [errors, setErrors] = useState({ first_name: "", last_name: "", slackID: "", phone: "", });
  const [passwordFrom, setPasswordFrom] = useState({ "password1": "", "password2": "", "oldPassword": "" });
  const [formData, setFormData] = useState({ first_name: "", last_name: "", slackID: "", phone: "", email: "", });
  const initialFormData = {
    first_name: appContext.userData.first_name,
    last_name: appContext.userData.last_name,
    slackID: appContext.userData.slackID,
    phone: appContext.userData.phone,
    email: appContext.userData.email,
  };


  // Update formData when appContext.userData becomes available
  useEffect(() => {
    if (appContext?.userData) {
      setFormData({
        first_name: appContext.userData.first_name || "",
        last_name: appContext.userData.last_name || "",
        slackID: appContext.userData.slackID || "",
        phone: appContext.userData.phone || "",
        email: appContext.userData.email || "",
      });
    }
  }, [appContext?.userData]);

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password1' && value === passwordFrom.oldPassword) {
      setMsg({ type: 'error', msg: 'New password cannot be the same as the old password.', });
    } else {
      setMsg({ type: '', msg: '' });
    }
    if (value.length >= 26) {
      setMsgM2({ type: "error", msg: "Password should be less then 25 characters" })
      return
    }
    setPasswordFrom({
      ...passwordFrom,
      [name]: value,
    });
  };

  // User Upload Images Event
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type.endsWith('/png') || file.type.endsWith('/jpg') || file.type.endsWith('/jpeg'))) {
      if (file.size > (MAX_FILE_SIZE * 1024 * 1024)) {
        setMsgM1({
          type: "error",
          msg: `File size exceeds ${MAX_FILE_SIZE}MB limit. Please upload a smaller image.`
        });
        return;
      }
      setIsUploading(true);
      appContext.setAppContext((curr) => ({
        ...curr,
        profilePhoto: null,
      }));
      setSelectedImage(null);
      await getProfilePhoto(file);
      setIsUploading(false);
      fileInputRef.current.value = "";
    }
  };

  // User Delete Images Api
  const handleImageDelete = async () => {
    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_PROFILE_DELETE_URL), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setSelectedImage("");
        appContext.setAppContext((curr) => ({
          ...curr,
          profilePhoto: "",
        }))
        setMsgM1({ type: "info", msg: "Image has been deleted. Default image restored.", });
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
    setDeleteUser(false);
  };

  // User Upload Images Api
  async function getProfilePhoto(file) {
    const userId = getUserId();
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("profilePicture", file);

    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_PROFILE_UPDATE_URL), formData, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setSelectedImage(response.data.data.profilePicture);
        appContext.setAppContext((curr) => ({
          ...curr,
          profilePhoto: response.data.data.profilePicture
        }));
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    let errorMsg = "";

    if (name === "first_name" || name === "last_name") {
      const regex = /^[A-Za-z]*$/;
      if (!regex.test(value)) {
        errorMsg = "Only alphabetic characters are allowed for First Name and Last Name.";
      } else if (value.length > 16) {
        errorMsg = "First Name and Last Name should not exceed 16 characters.";
      } else {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
    }

    if (name === "phone") {
      value = value.replace(/\D/g, '');
      if (value.length > 12) {
        errorMsg = "Phone number cannot be longer than 12 digits.";
      }
      if (isNaN(value)) {
        errorMsg = "Phone number can only contain numbers.";
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));

    if (!errorMsg) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errorMsg) {
      setTimeout(() => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }, 4000);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required.";
    } else if (!/^[A-Za-z]+$/.test(formData.first_name)) {
      errors.first_name = "Only alphabetic characters are allowed.";
    } else if (formData.first_name.length > 16) {
      errors.first_name = "First Name should not exceed 16 characters.";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required.";
    } else if (!/^[A-Za-z]+$/.test(formData.last_name)) {
      errors.last_name = "Only alphabetic characters are allowed.";
    } else if (formData.last_name.length > 16) {
      errors.last_name = "Last Name should not exceed 16 characters.";
    }

    setErrors(errors);

    if (Object.keys(errors).length > 0) {
      setTimeout(() => setErrors({}), 4000); // Clear errors after 4 seconds
    }

    return Object.keys(errors).length === 0;
  };

  // User Data Update Api
  async function updatedUserData(e) {
    if (!validateForm()) {
      return;
    }
    const apiData = {
      firstName: formData.first_name,
      lastName: formData.last_name,
      slackId: formData.slackID,
      phoneNo: formData.phone
    };

    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_PROFILE_UPDATE_URL), { userId: getUserId(), ...apiData }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setMsgM1({ type: "info", msg: "User data updated..." })
        setIsButtonDisabled(true);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      }
    }
  }

  // Update Password Api
  async function updatePassword(passwordFrom) {
    if ((!passwordFrom.oldPassword) || (!passwordFrom.password1) || (!passwordFrom.password2)) {
      setMsgM2({ type: "error", msg: "Please fill all fields" });
      return
    }
    if (passwordFrom.password1 !== passwordFrom.password2) {
      setMsgM2({ type: "error", msg: "Passwords do not match" });
      return
    }
    const apiData = {
      oldPassword: passwordFrom.oldPassword,
      newPassword: passwordFrom.password1,
      confirmPassword: passwordFrom.password2
    };

    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_RESETPASSWORD_WITH_OLD_URL), { userId: getUserId(), ...apiData }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setMsgM2({ type: "info", msg: "Password updated..." });
        setPasswordFrom({
          "password1": "",
          "password2": "",
          "oldPassword": ""
        })
      } else {
        setMsgM2({ type: "error", msg: "Something want wrong to update password " })
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsgM1({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      }
    }
  }

  useMemo(() => {
    if (msgM1.type !== "")
      setTimeout(() => {
        setMsgM1({ type: "", msg: "" })
      }, 20 * 200);
    if (msgM2.type !== "")
      setTimeout(() => {
        setMsgM2({ type: "", msg: "" })
      }, 20 * 200);
  }, [msgM1, msgM2])

  // Check if form data has changed compared to initial data
  useEffect(() => {
    const isChanged = Object.keys(initialFormData).some(
      (key) => formData[key] !== initialFormData[key]
    );
    setIsButtonDisabled(!isChanged);
  }, [formData]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', deleteUser);
    return () => document.body.classList.remove('no-scroll');
  }, [deleteUser]);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      nextRef.current.focus();
    }
  };


  return (
    <div className='px-3 lg:pl-10 lg:px-6'>
      <div className='flex items-center gap-3 lg:gap-5'>
        <Link to="/setting"><img className='w-3 lg:w-auto' src={BackIcon} alt="" /></Link>
        <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'>Edit Profile</h2>
      </div>

      <p className='text-base lg:text-[22px] lg:leading-[33px] text-Primary font-medium mt-5 lg:mt-10 flex gap-5'>Profile Picture </p>
      <div className='relative mt-5 px-5 lg:px-[34px] py-10 lg:py-[62px] border border-borderColor rounded-md bg-background6 max-w-[170px] lg:max-w-[213px] w-full cursor-pointer'>
        {(selectedImage || appContext.profilePhoto) && <img className='absolute top-3 right-3 cursor-pointer' onClick={() => setDeleteUser(true)} src={DeleteIcon} alt="" />}
        <div onClick={() => fileInputRef.current.click()}>
          <input type="file" ref={fileInputRef} accept=".png, .jpg, .jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
          <div className='flex justify-center'>
            {isUploading ? (
              <div className='flex justify-center items-center w-[70px] lg:w-[100px] h-[70px] lg:h-[100px] rounded-full overflow-hidden bg-gray-100'>
                <div className="loader w-6 h-6 border-4 border-t-Primary border-gray-300 rounded-full animate-spin"></div>
              </div>
            ) : (selectedImage || appContext.profilePhoto) ? (
              <img src={`${selectedImage || appContext.profilePhoto}?t=${Date.now()}`} className="rounded-full w-[70px] lg:w-[100px] h-[70px] lg:h-[100px] object-cover" alt="Selected" />
            ) : (
              <img src={ProfilePicture} className='w-[70px] lg:w-[100px] h-[70px] lg:h-[100px]' alt="Placeholder" />
            )}
          </div>
          <p className='text-sm lg:text-lg text-Primary text-center mt-[14px]'>Choose A Photo</p>
        </div>
      </div>

      {(msgM1.msg !== "") && <p className={`text-sm ${msgM1.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM1.msg}.</p>}

      {deleteUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="relative mx-1 p-4 lg:p-[30px] bg-background6 rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[350px] md:w-[350px] lg:w-[468px]">
            <img className="absolute top-2 right-2 cursor-pointer w-7 lg:w-auto" onClick={() => setDeleteUser(false)} src={PopupCloseIcon} alt="" />
            <div className="flex justify-center">
              <div className="mx-auto px-5 py-4 lg:px-7 lg:py-6 border border-borderColor rounded-md bg-background3">
                <img className="w-7 lg:w-9" src={DeletePopupIcon} alt="Reset Icon" />
              </div>
            </div>
            <h3 className="text-lg lg:text-[28px] lg:leading-[42px] text-Primary font-semibold mx-auto mt-3 text-center">Delete Confirmation</h3>
            <p className='text-sm lg:text-base text-Secondary2 text-center mt-1 mx-auto max-w-[350px]'>Are you sure you want to delete your images?</p>
            <div className="flex justify-center gap-5 mt-5 lg:mt-9">
              <button onClick={() => setDeleteUser(false)} className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-5 py-2 lg:py-3 border border-borderColor3 rounded-md w-full max-w-[150px] lg:max-w-[185px]" >
                Cancel
              </button>
              <button onClick={handleImageDelete} className="text-base lg:text-[20px] lg:leading-[30px] text-white font-semibold px-5 py-2 lg:py-3 rounded-md bg-ButtonBg w-full max-w-[150px] lg:max-w-[185px]">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='mt-10 px-5 md:px-[30px] py-5 md:py-[34px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-full'>
        <h2 className='text-xl lg:text-2xl text-Primary font-medium'>Personal Information</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4 mt-2 lg:mt-[22px]">
          <div>
            <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">First Name</label>
            <input type="text" name="first_name" title='Max Length 30' maxLength={30} value={formData.first_name} ref={firstNameRef} onKeyDown={(e) => handleKeyDown(e, lastNameRef)} onChange={handleInputChange} placeholder='Enter you first name'
              className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
            />
            {errors.first_name && (<p className="text-red-500 text-sm mt-1">{errors.first_name}</p>)}
          </div>
          <div>
            <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Last Name</label>
            <input type="text" name="last_name" title='Max Length 30' maxLength={30} value={formData.last_name} ref={lastNameRef} onKeyDown={(e) => handleKeyDown(e, slackIdRef)} onChange={handleInputChange} placeholder='Enter your last name'
              className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
            />
            {errors.last_name && (<p className="text-red-500 text-sm mt-1">{errors.last_name}</p>)}
          </div>
          <div>
            <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Slack ID</label>
            <input type="text" name="slackID" title='Max Length 50' maxLength={50} value={formData.slackID} ref={slackIdRef} onKeyDown={(e) => handleKeyDown(e, phoneRef)} onChange={handleInputChange} placeholder='Enter your slack id'
              className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
            />
          </div>
        </div>

        <h2 className='text-xl lg:text-2xl text-Primary font-medium mt-7 lg:mt-10 mb-2 lg:mb-[22px]'>Contact Information</h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Phone No. (Optional)</label>
            <input type="text" name="phone" title='Max Length 16' maxLength={16} value={formData.phone} onChange={handleInputChange} placeholder='Enter your phone no' ref={phoneRef} onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
              className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
            />
            {errors.phone && (<p className="text-red-500 text-sm mt-1">{errors.phone}</p>)}
          </div>
          <div>
            <label className="lock text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Email</label>
            <input type="text" value={appContext.userData.email} disabled className="text-Primary w-full mt-1 lg:mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg cursor-not-allowed" />
          </div>
        </div>
        {(msgM2.msg !== "") && <p className={`text-sm ${msgM2.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM2.msg}.</p>}

        <div className="flex justify-end mt-5 md:mt-[30px]">
          <button type="button" ref={submitButtonRef} onClick={updatedUserData} disabled={isButtonDisabled} className={`text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 lg:py-[13px] lg:px-[30px] shadow-[inset_-2px_-2px_5px_0_#104566] active:shadow-[inset_2px_2px_5px_0_#104566] ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} >
            Update Changes
          </button>
        </div>
      </div>

      <div className='mt-10 px-5 md:px-[30px] py-5 md:py-[34px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-full'>
        <h2 className='text-xl lg:text-2xl text-Primary font-medium'>Change Password</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-5 mt-2 lg:mt-[22px] pb-5 border-b border-borderColor">
          <div>
            <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Old Password</label>
            <input type="text" title='Max Length 30' maxLength={30} placeholder='Enter your old password' name='oldPassword' value={passwordFrom.oldPassword} ref={oldPasswordRef} onKeyDown={(e) => handleKeyDown(e, newPasswordRef)} onChange={handlePasswordInputChange}
              className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="relative block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">New Password
              <input type={showPassword ? 'text' : 'password'} title='Max Length 30' maxLength={30} placeholder='Enter your new password' name='password1' autoComplete="new-password" value={passwordFrom.password1} ref={newPasswordRef} onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)} onChange={handlePasswordInputChange}
                className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
              />
              <span className="absolute top-[50px] lg:top-[64px] right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)} >
                <img src={showPassword ? PasswordIIcon : PasswordIIcon2} alt="" />
              </span>
            </label>
            <p className='flex text-xs lg:text-sm text-Secondary2 mt-1'>(Password should be at least 1 upper, 1 lower, 1 special character, 1 digit, length min 8 - max 50)</p>
            {msg.type === 'error' && <p className="text-sm text-[#D82525] mt-1">{msg.msg}</p>}
          </div>
          <div>
            <label className="relative block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Confirm Password
              <input type={showPassword2 ? 'text' : 'password'} title='Max Length 30' maxLength={30} placeholder='Enter your confirm password' name='password2' autoComplete="new-password" value={passwordFrom.password2} ref={confirmPasswordRef} onKeyDown={(e) => handleKeyDown(e, submitButton2Ref)} onChange={handlePasswordInputChange}
                className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
              />
              <span className="absolute top-[50px] lg:top-[64px] right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword2(!showPassword2)} >
                <img src={showPassword2 ? PasswordIIcon : PasswordIIcon2} alt="" />
              </span>
            </label>
          </div>
        </div>
        {(msgM2.msg !== "") && <p className={`text-sm ${msgM2.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msgM2.msg}.</p>}
        <div className="flex justify-end mt-5 md:mt-[30px]">
          <button type="button" ref={submitButton2Ref} onClick={(_) => updatePassword(passwordFrom)} className="text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 lg:py-[13px] lg:px-[30px] shadow-[inset_-2px_-2px_5px_0_#104566] active:shadow-[inset_2px_2px_5px_0_#104566]" >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
