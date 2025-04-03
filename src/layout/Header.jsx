import React, { useState, useEffect, useRef, useContext } from 'react';
import Logout from '../assets/svg/Logout.svg';
import Logout2 from '../assets/svg/logout2.svg';
import HelpIcon from '../assets/svg/HelpIcon.svg';
import MenuIcon from '../assets/svg/MenuIcon.svg';
import LogoIcon from '../assets/svg/LogoIcon.svg';
import ManImag from '../assets/Images/Manimg.png';
import LogoutIcon from '../assets/svg/LogoutIcon.svg';
import SettingsIcon from '../assets/svg/SettingsIcon.svg';
import EditProfileIcon from '../assets/svg/EditProfileIcon.svg';
import DynamicMatrixIcon from '../assets/svg/DynamicMatrixIcon.svg';
import SaveMatrixIcon from '../assets/Images/Menu/SaveMatrixIcon.svg';
import StaticMatrixIcon from '../assets/Images/Menu/StaticMatrixIcon.svg';
import SubscriptionIcon from '../assets/Images/Menu/SubscriptionIcon.svg';
import DashboardIcon from '../assets/Images/AdminHeader/DashboardIcon.svg';
import axios from 'axios';
import { AppContext } from '../components/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getToken, getUserId, removeTokens } from '../page/login/loginAPI';

const handleLogout = async (setIsLoggedIn) => {
  removeTokens();
  setIsLoggedIn(false);
  window.location.href = '/';
};

const Header = ({ isDarkMode, activeLink, setActiveLink, setIsLoggedIn }) => {

  let navigate = useNavigate();
  const menuRef = useRef(null);
  const location = useLocation();
  const dropdownRef = useRef(null);
  let appContext = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(appContext.isAdmin);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  console.log("isDarkTheme", isDarkTheme);


  // Function to handle when a link is clicked
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuVisible(false);
  };

  // Function to apply active class based on the clicked link
  const getLinkClass = (link) => {
    return activeLink === link ? 'bg-background4 text-Secondary font-medium' : '';
  };

  async function getUserData() {
    if (appContext.userData.first_name === '' && appContext.userData.last_name === '')
      try {
        let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_PROFILE_GET_URL), { userId: getUserId() }, {
          headers: {
            'x-access-token': getToken()
          }
        })
        if (response.status === 200) {
          const { firstName, lastName, email, profilePicture, slackId, phoneNo, theme } = response.data.data;
          appContext.setAppContext((curr) => ({
            ...curr,
            userData: {
              first_name: firstName || "",
              last_name: lastName || "",
              email: email || "",
              profilePhoto: profilePicture || "",
              slackID: slackId || "",
              phone: phoneNo || "",
              theme: theme || "light",
            },
          }));
        }
      } catch (error) { }
  }

  // Toggle theme and update API
  const toggleTheme = async () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem("theme", newTheme);

    try {
      const response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_UPDATE_USER_THEME, { userId: getUserId(), theme: newTheme }, {
        headers: {
          "x-access-token": getToken()
        }
      }
      );

      if (response.status === 200) {
        appContext.setAppContext((curr) => ({
          ...curr,
          userData: { theme: newTheme },
        }));
      }
    } catch (error) {
      console.error("Error updating theme:", error);
    }
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
    } else if (path === '/edit-profile') {
      setActiveLink('setting');
    } else if (path === '/help-support') {
      setActiveLink('help-support');
    } else if (path === '/subscription') {
      setActiveLink('subscription');
    }
  }, [location, setActiveLink]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const fetchData = async () => {
      await getUserData();
    };

    fetchData(); // Fetch user data on mount
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', showLogoutModal || isMenuVisible);
    return () => document.body.classList.remove('no-scroll');
  }, [showLogoutModal, isMenuVisible]);


  return (
    <>
      <div className='lg:hidden bg-background2 w-full flex justify-between items-center px-3 py-[19px] rounded-b-xl'>
        <a href='/' className='text-lg font-bold text-white'><img className='w-[200px]' src={LogoIcon} alt="" /></a>
        <img onClick={() => setMenuVisible(prev => !prev)} className='bg-userBg px-[6px] py-[9px] rounded-[6px] shadow-[0px_0px_6px_0px_#28236633]' src={MenuIcon} alt="MenuIcon" />

        {isMenuVisible && (
          <div className="fixed inset-0 z-10 bg-black bg-opacity-50 ">
            <div ref={menuRef} className={`absolute z-10 w-full max-w-[318px] h-full bg-background5 top-0 right-0 p-3 ${isMenuVisible ? 'slide-in' : 'slide-out'}`}>
              <div className='flex justify-between items-center gap-[30px] FilterModalVisibleMenu border-b border-[#B7D1E0] pt-5 pb-3'>
                <div className='flex items-center gap-5 cursor-pointer'>
                  <img className='w-[52px]' src={`${appContext.userData.profilePhoto || ManImag}?t=${Date.now()}`} alt="" />
                  <div>
                    <p className='text-base text-Primary font-medium'>{appContext.userData.first_name || "Loading..."}</p>
                    <Link to="/edit-profile" className='text-xs text-Primary font-medium' onClick={() => handleLinkClick('edit-profile')} >Edit Profile</Link>
                  </div>
                </div>
                <div className={`flex items-center gap-[30px] FilterModalVisible`}>
                  <label className="switch">
                    <input type="checkbox" onClick={toggleTheme} checked={isDarkTheme} />
                    <span className={`slider ${isDarkMode ? 'dark' : 'light'}`}></span>
                  </label>
                </div>
              </div>

              <Link to="/dashboard" className={`flex items-center gap-[30px] px-[20px] mt-5 p-2 ${getLinkClass('dashboard')}`} onClick={() => handleLinkClick('dashboard')} >
                <img className='w-[22px]' src={DashboardIcon} alt="" />
                <p className='text-base text-Primary'>Dashboard</p>
              </Link>
              <div className='flex items-center gap-[30px] px-[20px] mt-7'>
                <img className='w-[22px]' src={StaticMatrixIcon} alt="" />
                <p className='text-base text-Primary'>SPX Matrix</p>
              </div>
              <div className='flex px-[20px] mt-[14px] mb-[9px]'>
                <div className='border-t border-[#B7D1E0] max-w-[278px] w-full' />
              </div>
              <div>
                <Link to="/static-matrix-short" className={`text-xs text-Secondary2 p-2 block pl-[73px] ${getLinkClass('static-matrix-short')}`} onClick={() => handleLinkClick('static-matrix-short')}>ST-Short IC Matrix</Link>
                <Link to="static-matrix-long" className={`text-xs text-Secondary2 p-2 block pl-[73px] ${getLinkClass('static-matrix-long')}`} onClick={() => handleLinkClick('static-matrix-long')}>ST-Long IC Matrix</Link>
              </div>
              <div className='flex items-center gap-[30px] px-[20px] mt-5'>
                <img className='w-[22px]' src={DynamicMatrixIcon} alt="" />
                <p className='text-base text-Primary'>Dynamic Matrix</p>
              </div>
              <div className='flex px-[20px] mt-[14px] mb-[9px]'>
                <div className='border-t border-[#B7D1E0] max-w-[278px] w-full' />
              </div>
              <div>
                <Link to="/dynamic-matrix-short" className={`text-xs text-Secondary2 p-2 block pl-[73px] ${getLinkClass('dynamic-matrix-short')}`} onClick={() => handleLinkClick('dynamic-matrix-short')}>DY-Short IC Matrix</Link>
                <Link to="/dynamic-matrix-long" className={`text-xs text-Secondary2 p-2 block pl-[73px] ${getLinkClass('dynamic-matrix-long')}`} onClick={() => handleLinkClick('dynamic-matrix-long')}>DY-Long IC Matrix</Link>
              </div>
              <Link to="/saved-matrix" className={`flex items-center gap-8 px-[20px] mt-5 p-2 ${getLinkClass('saved-matrix')}`} onClick={() => handleLinkClick('saved-matrix')}>
                <img src={SaveMatrixIcon} alt="" />
                <p className='text-base text-Primary'>Saved Matrix</p>
              </Link>
              <Link to="/subscription" className={`flex items-center gap-[30px] px-[20px] mt-5 p-2 ${getLinkClass('subscription')}`} onClick={() => handleLinkClick('subscription')}>
                <img src={SubscriptionIcon} alt="" />
                <p className='text-base text-Primary'>Subscription</p>
              </Link>
              {appContext.superUser && <button type="button" className='text-base text-Primary text-center pl-[73px] mt-5' onClick={() => { setIsAdmin(!isAdmin); appContext.setAppContext({ ...appContext, isAdmin: !isAdmin }); navigate("/") }}>{isAdmin ? "Switch To User" : "Switch To Admin"}</button>}
              <div className='flex justify-center items-end gap-5 p-7'>
                <Link to="/setting" onClick={() => handleLinkClick('setting')}><img className={`p-1 border border-borderColor3 rounded-[6px] shadow-[0px_0px_4px_0px_#110D3D4D] ${getLinkClass('setting')}`} src={SettingsIcon} alt="" /></Link>
                <Link to="/help-support" onClick={() => handleLinkClick('help-support')}><img className={`p-[3px] border border-borderColor3 rounded-[6px] shadow-[0px_0px_4px_0px_#110D3D4D] ${getLinkClass('help-support')}`} src={HelpIcon} alt="" /></Link>
                <img className='p-[6px] border border-borderColor3 rounded-[7px] shadow-[0px_0px_4px_0px_#110D3D4D]' src={Logout} alt="" onClick={() => {
                  setShowLogoutModal(true);
                  setMenuVisible(false);
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

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

      <div className='relative flex flex-wrap gap-5 justify-between w-full pt-6 lg:pt-11 px-[14px] lg:px-[40px]'>
        <div className='absolute right-6 hidden lg:flex items-center gap-[30px] FilterModalVisible order-1 lg:order-2'>
          <div className={`flex items-center gap-[30px] FilterModalVisible`}>
            <label className="switch">
              <input type="checkbox" onClick={toggleTheme} checked={isDarkTheme} />
              <span className={`slider ${isDarkMode ? 'dark' : 'light'}`}></span>
            </label>
          </div>
          <div className='flex items-center gap-3 py-1 px-[14px] bg-userBg rounded-[6px] cursor-pointer' onClick={() => setIsOpen(prev => !prev)}>
            <p className='text-[16px] leading-[28px] text-white font-medium'>{appContext.userData.first_name || "Loading..."}</p>
            <img src={`${appContext.userData.profilePhoto || ManImag}?t=${Date.now()}`} className='w-8 h-8 rounded-full object-cover' alt="" />
          </div>
          {isOpen && (
            <div ref={dropdownRef} className='absolute top-10 right-0 mt-2 bg-background5 shadow-[0px_0px_6px_0px_#28236633] rounded-md z-10 w-[158px]'>
              <div className='py-2'>
                <Link to="/edit-profile" ><div className='flex gap-[14px] text-sm text-Primary px-4 py-2 cursor-pointer' onClick={() => setIsOpen(false)}><img src={EditProfileIcon} alt="" /> Edit Profile</div></Link>
                <div className='flex gap-[14px] text-sm text-Primary px-4 py-2 cursor-pointer' onClick={() => setShowLogoutModal(true)}><img src={LogoutIcon} alt="" /> Log out</div>
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
      </div>
    </>
  );
}

export default Header;
export { handleLogout }