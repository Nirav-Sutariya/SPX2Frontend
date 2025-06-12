import React, { useState, useEffect, useRef, useContext } from 'react';
import ManImag from '../assets/Images/Man.png';
import LogoIconMenu from '../assets/svg/LogoIcon.svg';
import Logout2 from '../assets/Images/Login/logout2.svg';
import MenuIcon from '../assets/Images/Menu/MenuIcon.svg';
import LogoutIcon from '../assets/Images/Login/LogoutIcon.svg';
import UserDataIcon from '../assets/Images/AdminHeader/UserDataIcon.svg';
import DashboardIcon from '../assets/Images/AdminHeader/DashboardIcon.svg';
import SupportUserIcon from '../assets/Images/AdminHeader/SupportUserIcon.svg';
import SubscriptionIcon from '../assets/Images/AdminHeader/SubscriptionIcon.svg';
import ManageCouponIcon from '../assets/Images/AdminHeader/ManageCouponIcon.svg';
import ManageLevelsIcon from '../assets/Images/AdminHeader/ManageLevelsIcon.svg';
import Logout from '../assets/Images/Login/Logout.svg';
import { AppContext } from '../components/AppContext';
import { removeTokens } from '../page/login/loginAPI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const handleLogout = async (setIsLoggedIn) => {
  removeTokens();
  setIsLoggedIn(false);
  window.location.href = '/';
};

const AdminHeader = ({ toggleTheme, isDarkTheme, isDarkMode, activeLink, setActiveLink, setIsLoggedIn }) => {

  let navigate = useNavigate();
  const menuRef = useRef(null);
  const location = useLocation();
  const dropdownRef = useRef(null);
  let appContext = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(appContext.isAdmin);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Function to handle when a link is clicked
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuVisible(false);
  };

  // Function to apply active class based on the clicked link
  const getLinkClass = (link) => {
    return activeLink === link ? 'bg-background4 text-Secondary font-medium' : '';
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveLink('dashboard');
    } else if (path === '/static-matrix-short') {
      setActiveLink('static-matrix-short');
    } else if (path === '/static-matrix-long') {
      setActiveLink('static-matrix-long');
    } else if (path === '/dynamic-matrix-short') {
      setActiveLink('dynamic-matrix-short');
    } else if (path === '/dynamic-matrix-long') {
      setActiveLink('dynamic-matrix-long');
    } else if (path === '/saved-matrix') {
      setActiveLink('saved-matrix');
    } else if (path === '/setting') {
      setActiveLink('setting');
    } else if (path === '/help-support') {
      setActiveLink('help-support');
    } else if (path === '/subscription') {
      setActiveLink('subscription');
    }
  }, [location, setActiveLink]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuVisible(false);
      }
    };

    const disableScroll = showLogoutModal || isMenuVisible;
    document.body.classList.toggle('no-scroll', disableScroll);

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('no-scroll');
    };
  }, [showLogoutModal, isMenuVisible]);


  return (
    <>
      <div className='lg:hidden bg-background2 w-full flex justify-between items-center px-3 py-[19px] rounded-b-xl'>
        <a href='/'><img className='w-[200px]' src={LogoIconMenu} alt="" /></a>
        <img onClick={() => setMenuVisible(prev => !prev)} className='bg-userBg px-[6px] py-[9px] rounded-md shadow-[0px_0px_6px_0px_#28236633]' src={MenuIcon} alt="MenuIcon" />

        {isMenuVisible && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-50 ">
            <div ref={menuRef} className={`absolute z-10 w-full max-w-[318px] h-full bg-background6 top-0 right-0 p-3 ${isMenuVisible ? 'slide-in' : 'slide-out'}`}>
              <div className='flex justify-between items-center gap-[30px] FilterModalVisibleMenu border-b border-[#B7D1E0] pt-5 pb-3'>
                <div className='flex items-center gap-5 cursor-pointer'>
                  <img className='w-[52px] rounded-full' src={`${appContext.profilePhoto || ManImag}?t=${Date.now()}`} alt="" />
                  <div>
                    <p className='text-base text-Primary font-medium'>{appContext.userData.first_name}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-[30px] FilterModalVisible`}>
                  <label className="switch">
                    <input type="checkbox" onClick={toggleTheme} checked={isDarkTheme} />
                    <span className={`slider ${isDarkMode ? 'dark' : 'light'}`}></span>
                  </label>
                </div>
              </div>

              <Link to="/admin-dashboard" className={`flex items-center gap-5 mt-5 lg:mt-10 pl-[50px] p-2 ${getLinkClass('admin-dashboard')}`} onClick={() => handleLinkClick('admin-dashboard')}>
                <img src={DashboardIcon} alt="" />
                <p className='text-base text-Primary'>Dashboard</p>
              </Link>

              <Link to="/support-user" className={`flex items-center gap-5 mt-5 pl-[50px] p-2 ${getLinkClass('support-user')}`} onClick={() => handleLinkClick('support-user')}>
                <img src={SupportUserIcon} alt="" />
                <p className='text-base text-Primary'>Support User</p>
              </Link>

              <Link to="/admin-subscription" className={`flex items-center gap-5 mt-5 pl-[50px] p-2 ${getLinkClass('admin-subscription')}`} onClick={() => handleLinkClick('/admin-subscription')}>
                <img src={SubscriptionIcon} alt="" />
                <p className='text-base text-Primary'>Subscription</p>
              </Link>

              <Link to="/manage-coupon" className={`flex items-center gap-5 mt-5 pl-[50px] p-2 ${getLinkClass('manage-coupon')}`} onClick={() => handleLinkClick('manage-coupon')}>
                <img src={ManageCouponIcon} alt="" />
                <p className='text-base text-Primary'>Manage Coupon</p>
              </Link>

              <Link to="/user-data" className={`flex items-center gap-5 mt-5 pl-[50px] p-2 ${getLinkClass('user-data')}`} onClick={() => handleLinkClick('user-data')}>
                <img src={UserDataIcon} alt="" />
                <p className='text-base text-Primary'>User Data</p>
              </Link>

              <Link to="/manage-levels" className={`flex items-center gap-5 mt-5 pl-[50px] p-2 ${getLinkClass('manage-levels')}`} onClick={() => handleLinkClick('manage-levels')}>
                <img src={ManageLevelsIcon} alt="" />
                <p className='text-base text-Primary'>Manage Levels</p>
              </Link>
              {appContext.superUser && <button type="button" className='flex items-center text-base text-Primary text-center mx-auto mt-5' onClick={() => { setIsAdmin(!isAdmin); appContext.setAppContext({ ...appContext, isAdmin: !isAdmin }); navigate("/") }}>{isAdmin ? "Switch To User" : "Switch To Admin"}</button>}
              <div className='flex justify-center items-end gap-5 p-7'>
                <img className='p-[6px] border border-borderColor3 rounded-[7px] shadow-[0px_0px_4px_0px_#110D3D4D]' src={Logout} alt="" onClick={() => {
                  setShowLogoutModal(true);
                  setMenuVisible(false);
                }} />
              </div>
            </div>
          </div>
        )}

        {showLogoutModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
            <div className="p-4 lg:p-[30px] bg-background6 rounded-lg shadow-[0px_0px_6px_0px_#28236633] w-[360px] lg:w-[486px]">
              <div className="flex justify-center">
                <div className="mx-auto p-5 lg:p-7 border border-borderColor rounded-md bg-background3">
                  <img className="w-7 lg:w-auto" src={Logout2} alt="Reset Icon" />
                </div>
              </div>
              <h2 className="text-lg lg:text-[22px] lg:leading-[33px] text-Secondary2 mx-auto max-w-[257px] mt-5 text-center">Oh no! You're leaving… Are you sure?</h2>
              <div className="flex justify-between gap-3 mt-5 lg:mt-9">
                <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 border border-borderColor3 rounded-md w-full" onClick={() => setShowLogoutModal(false)} >
                  Cancel
                </button>
                <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full" onClick={(_) => handleLogout(setIsLoggedIn)} >
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='relative flex flex-wrap gap-5 justify-between w-full pt-6 lg:pt-9 px-[14px] lg:px-[40px]'>
        <div className='absolute right-6 hidden lg:flex items-center gap-5 FilterModalVisible order-1 lg:order-2'>
          <div className={`flex items-center gap-5 FilterModalVisible`}>
            <label className="switch">
              <input type="checkbox" onClick={toggleTheme} checked={isDarkTheme} />
              <span className={`slider ${isDarkMode ? 'dark shadow-[inset_2px_2px_5px_0_#104566]' : 'light shadow-[inset_-2px_-2px_5px_0_#104566]'}`}></span>
            </label>
          </div>
          <div className={`flex items-center gap-3 py-1 px-[14px] bg-userBg rounded-md cursor-pointer ${isOpen ? "shadow-[inset_2px_2px_5px_0_#104566]" : "shadow-[inset_-2px_-2px_5px_0_#104566]"}`} onClick={() => setIsOpen(prev => !prev)}>
            <p className='text-[16px] leading-[28px] text-white font-medium'>{appContext.userData.first_name}</p>
            <img src={`${appContext.profilePhoto || ManImag}?t=${Date.now()}`} className='w-8 h-8 rounded-full object-cover' alt="" />
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.50, ease: "easeInOut" }}
                ref={dropdownRef} className='absolute top-10 right-0 mt-2 bg-background5 shadow-[0px_0px_6px_0px_#28236633] rounded-md z-10 w-[158px]'>
                <div className='py-2'>
                  <div className='flex gap-[14px] text-sm text-Primary px-4 py-2 cursor-pointer' onClick={() => setShowLogoutModal(true)}><img src={LogoutIcon} alt="" /> Log out</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showLogoutModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
              <div className="p-4 lg:p-5 bg-background6 rounded-lg shadow-[0px_0px_6px_0px_#28236633] w-[360px] lg:w-[486px]">
                <div className="flex justify-center">
                  <div className="mx-auto p-5 lg:p-7 border border-borderColor rounded-md bg-background3">
                    <img className="w-7 lg:w-auto" src={Logout2} alt="Reset Icon" />
                  </div>
                </div>
                <h2 className="text-lg lg:text-[22px] lg:leading-[33px] text-Secondary2 mx-auto max-w-[257px] mt-5 text-center">Oh no! You're leaving… Are you sure?</h2>
                <div className="flex justify-between gap-3 mt-5 lg:mt-9">
                  <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 border border-borderColor3 rounded-md w-full" onClick={() => setShowLogoutModal(false)} >
                    Cancel
                  </button>
                  <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 text-white rounded-md bg-ButtonBg w-full" onClick={(_) => handleLogout(setIsLoggedIn)} >
                    Log out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminHeader;
export { handleLogout }
