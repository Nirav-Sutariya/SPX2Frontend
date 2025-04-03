import React, { useState, useRef, useMemo, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { handleLogout } from '../../layout/Header'
import { getToken, getUserId } from '../login/loginAPI';
import { AppContext } from "../../components/AppContext";
import SettingIcon from '../../assets/svg/Setting.svg';
import DeleteIcon from '../../assets/svg/DeleteIcon.svg'
import DataPrivacy from '../../assets/svg/DataPrivacy.svg';

const Setting = ({ setIsLoggedIn }) => {

  const DataRef = useRef();
  let appContext = useContext(AppContext);
  const [data, setData] = useState(false);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [showDeleteModal, setShowDeleteModal] = useState(false);


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
  }, [msg])


  return (
    <>
      <div className='px-3 lg:pl-10 lg:px-6 h-[83vh] lg:h-auto'>
        <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'> Settings </h2>
        {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}
        <Link to="/edit-profile">
          <div className='flex items-center gap-[22px] mt-10'>
            <img className='px-3 lg:px-4 py-3 lg:py-[15px] border border-borderColor rounded-md bg-background6 w-12 lg:w-auto' src={SettingIcon} alt="" />
            <p className='text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary'>Account Settings</p>
          </div>
        </Link>

        <div className='cursor-pointer flex items-center gap-[22px] mt-5 lg:mt-10 max-w-[350px]' onClick={() => setData((prev) => !prev)}>
          <img className='px-3 lg:px-4 py-3 lg:py-[15px] border border-borderColor rounded-md bg-background6 w-12 lg:w-auto' src={DataPrivacy} alt="" />
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
      </div>
    </>
  );
}

export default Setting;
