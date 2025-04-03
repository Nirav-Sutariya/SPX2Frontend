import React, { useEffect, useState, useRef, useContext } from 'react';
import LogoIcon from '../assets/svg/LogoIcon.svg';
import LogoSmall from '../assets/svg/LogoSmall.svg';
import MenuIcon from '../assets/Images/MenuIcon.png';
import SwitchToAdminIcon from '../assets/svg/SwitchToAdmin.svg';
import UserData from '../assets/Images/SuperAdminMenu/UserDataIcon.svg';
import Dashboard from '../assets/Images/SuperAdminMenu/DashboardIcon.svg';
import SupportUser from '../assets/Images/SuperAdminMenu/SupportUserIcon.svg';
import Subscription from '../assets/Images/SuperAdminMenu/SubscriptionIcon.svg';
import ManageCoupon from '../assets/Images/SuperAdminMenu/ManageCouponIcon.svg';
import ManageLevels from '../assets/Images/SuperAdminMenu/ManageLevelsIcon.svg';
import { AppContext } from '../components/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SuperAdminMenu = ({ activeLink, setActiveLink }) => {

  let navigate = useNavigate();
  const menuRef = useRef(null);
  const location = useLocation();
  let appContext = useContext(AppContext);
  const [showSPX, setShowSPX] = useState(true);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(appContext.isAdmin);

  // Function to handle when a link is clicked
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuVisible(false);
  };

  // Return the appropriate background color class based on the active link
  const getLinkClass = (link) => {
    if (link === activeLink) {
      if (link === 'setting' || link === 'help-support') {
        return 'bg-[#00588B]';
      }
      return 'bg-[#2C7CAC]';
    }
    return ''; 
  };

  // Sync activeLink state with the current URL path
  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin-dashboard') {
      setActiveLink('admin-dashboard');
    } else if (path === '/support-user') {
      setActiveLink('support-user');
    } else if (path === '/admin-subscription') {
      setActiveLink('admin-subscription');
    } else if (path === '/manage-coupon') {
      setActiveLink('manage-coupon');
    } else if (path === '/user-data') {
      setActiveLink('user-data');
    } else if (path === '/manage-levels') {
      setActiveLink('manage-levels');
    }
  }, [location, setActiveLink]);

  const handleResize = () => {
    const width = window.innerWidth;
    if (width >= 768 && width <= 1450) {
      setShowSPX(false);
    } else {
      setShowSPX(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(false);
      }
    };
  
    if (isMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
  
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuVisible]);
  

  return (
    <>
      {showSPX ? (
        <div className='hidden lg:grid w-full min-w-[300px] max-w-[348px] h-screen max-h-[910px] bg-gradient rounded-3xl sticky top-4'>
          <div>
            <Link to="/" className='py-10 flex justify-center' onClick={() => handleLinkClick('admin-dashboard')}><img className='w-[200px]' src={LogoIcon} alt="" /></Link>
            <Link to="/admin-dashboard" className={`flex items-center gap-[30px] pl-[50px] p-2 ${getLinkClass('admin-dashboard')}`} onClick={() => handleLinkClick('admin-dashboard')}>
              <img src={Dashboard} alt="" />
              <p className='text-[22px] leading-[33px] text-white'>Dashboard</p>
            </Link>

            <Link to="/support-user" className={`flex items-center gap-[30px] mt-[30px] pl-[50px] p-2 ${getLinkClass('support-user')}`} onClick={() => handleLinkClick('support-user')}>
              <img src={SupportUser} alt="" />
              <p className='text-[22px] leading-[33px] text-white'>Support User</p>
            </Link>

            <Link to="/admin-subscription" className={`flex items-center gap-[30px] mt-[30px] pl-[50px] p-2 ${getLinkClass('admin-subscription')}`} onClick={() => handleLinkClick('/admin-subscription')}>
              <img src={Subscription} alt="" />
              <p className='text-[22px] leading-[33px] text-white'>Subscription</p>
            </Link>

            <Link to="/manage-coupon" className={`flex items-center gap-[30px] mt-[30px] pl-[50px] p-2 ${getLinkClass('manage-coupon')}`} onClick={() => handleLinkClick('manage-coupon')}>
              <img src={ManageCoupon} alt="" />
              <p className='text-[22px] leading-[33px] text-white'>Manage Coupon</p>
            </Link>

            <Link to="/user-data" className={`flex items-center gap-[30px] mt-[30px] pl-[50px] p-2 ${getLinkClass('user-data')}`} onClick={() => handleLinkClick('user-data')}>
              <img src={UserData} alt="" />
              <p className='text-[22px] leading-[33px] text-white'>User Data</p>
            </Link>

            <Link to="/manage-levels" className={`flex items-center gap-[30px] mt-[30px] pl-[50px] p-2 ${getLinkClass('manage-levels')}`} onClick={() => handleLinkClick('manage-levels')}>
              <img src={ManageLevels} alt="" />
              <p className='text-[22px] leading-[33px] text-white'>Manage Levels</p>
            </Link>
            {appContext.superUser && <button type="button" className='flex items-center text-xl text-white text-center mx-auto mt-[25px] p-2' onClick={() => { setIsAdmin(!isAdmin); appContext.setAppContext({ ...appContext, isAdmin: !isAdmin }); navigate("/") }}>{isAdmin ? "Switch To User" : "Switch To Admin"}</button>}
          </div>
        </div>
      ) : (
        <>
          <div className='hidden lg:block h-full max-h-[780px] bg-gradient rounded-3xl sticky top-4'>
            <img className='px-[27px] pt-[27px]' src={LogoSmall} alt="" />
            <img className='mx-auto mt-3 rotate-180 px-[6px] py-[9px] rounded-[6px] shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => setMenuVisible(prev => !prev)}  src={MenuIcon} alt="MenuIcon" />
            <div className='grid gap-[10px] py-[50px]'>
              <Link to='/admin-dashboard' className={`w-full py-[22px] px-[7px] flex justify-center ${getLinkClass('admin-dashboard')}`} onClick={() => handleLinkClick('admin-dashboard')} ><img src={Dashboard} alt="" /></Link>
              <Link to='/support-user' className={`w-full py-[22px] px-[7px] flex justify-center ${getLinkClass('support-user')}`} onClick={() => handleLinkClick('support-user')} ><img src={SupportUser} alt="" /></Link>
              <Link to='/admin-subscription' className={`w-full py-[22px] px-[7px] flex justify-center ${getLinkClass('admin-subscription')}`} onClick={() => handleLinkClick('admin-subscription')}><img src={Subscription} alt="" /></Link>
              <Link to='/manage-coupon' className={`w-full py-[22px] px-[7px] flex justify-center ${getLinkClass('manage-coupon')}`} onClick={() => handleLinkClick('manage-coupon')}><img src={ManageCoupon} alt="" /></Link>
              <Link to='/user-data' className={`w-full py-[22px] px-[7px] flex justify-center ${getLinkClass('user-data')}`} onClick={() => handleLinkClick('user-data')}><img src={UserData} alt="" /></Link>
              <Link to='/manage-levels' className={`w-full py-[22px] px-[7px] flex justify-center ${getLinkClass('manage-levels')}`} onClick={() => handleLinkClick('manage-levels')}><img src={ManageLevels} alt="" /></Link>
              <div className=' flex justify-center'>
                {appContext.superUser && <img src={SwitchToAdminIcon} alt='' className='py-[18px] px-[7px]' onClick={() => { setIsAdmin(!isAdmin); appContext.setAppContext({ ...appContext, isAdmin: !isAdmin }); navigate("/") }} />}
              </div>
            </div>
          </div>

          <div ref={menuRef} className={`fixed top-0 left-0 z-10 w-full max-w-[300px] h-full bg-gradient rounded-r-3xl transform ${isMenuVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 ease-in-out`}>
            <Link to='/' className='py-10 flex justify-center' onClick={() => handleLinkClick('admin-dashboard')}><img className='w-[200px]' src={LogoIcon} alt="" /></Link>
            <Link to="/admin-dashboard" className={`flex items-center gap-[30px] pl-10 p-2 ${getLinkClass('admin-dashboard')}`} onClick={() => handleLinkClick('admin-dashboard')}>
              <img src={Dashboard} alt="" />
              <p className='text-xl text-white'>Dashboard</p>
            </Link>

            <Link to="/support-user" className={`flex items-center gap-[30px] mt-7 pl-10 p-2 ${getLinkClass('support-user')}`} onClick={() => handleLinkClick('support-user')}>
              <img src={SupportUser} alt="" />
              <p className='text-xl text-white'>Support User</p>
            </Link>

            <Link to="/admin-subscription" className={`flex items-center gap-[30px] mt-7 pl-10 p-2 ${getLinkClass('admin-subscription')}`} onClick={() => handleLinkClick('admin-subscription')}>
              <img src={Subscription} alt="" />
              <p className='text-xl text-white'>Subscription</p>
            </Link>

            <Link to="/manage-coupon" className={`flex items-center gap-[30px] mt-7 p-2 pl-10 ${getLinkClass('manage-coupon')}`} onClick={() => handleLinkClick('manage-coupon')}>
              <img src={ManageCoupon} alt="" />
              <p className='text-xl text-white'>Manage Coupon</p>
            </Link>

            <Link to="/user-data" className={`flex items-center gap-[30px] mt-7 pl-10 p-2 ${getLinkClass('user-data')}`} onClick={() => handleLinkClick('user-data')}>
              <img src={UserData} alt="" />
              <p className='text-xl text-white'>User Data</p>
            </Link>

            <Link to="/manage-levels" className={`flex items-center gap-[30px] mt-7 pl-10 p-2 ${getLinkClass('manage-levels')}`} onClick={() => handleLinkClick('manage-levels')}>
              <img src={ManageLevels} alt="" />
              <p className='text-xl text-white'>Manage Levels</p>
            </Link>
            {appContext.superUser && <button type="button" className='flex items-center text-lg text-white text-center mx-auto mt-5 p-2' onClick={() => { setIsAdmin(!isAdmin); appContext.setAppContext({ ...appContext, isAdmin: !isAdmin }); navigate("/") }}>{isAdmin ? "Switch To User" : "Switch To Admin"}</button>}
          </div>
        </>
      )}
    </>
  );
}

export default SuperAdminMenu;
