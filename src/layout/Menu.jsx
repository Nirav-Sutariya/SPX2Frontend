import React, { useEffect, useState, useRef, useContext } from 'react';
import Help from '../assets/Images/Menu/Help.png';
import LogoIcon from '../assets/svg/LogoIcon.svg';
import LogoSmall from '../assets/svg/LogoSmall.svg';
import MenuIcon from '../assets/Images/MenuIcon.png';
import Settings from '../assets/Images/Menu/settings.png';
import SavedMatrix from '../assets/svg/SaveMatrixIcon.svg';
import SwitchToAdminIcon from '../assets/svg/SwitchToAdmin.svg';
import StaticMatrixIcon from '../assets/svg/StaticMatrixIcon.svg';
import DynamicMatrix from '../assets/Images/Menu/DynamicMatrix.png';
import Dashboard from '../assets/Images/SuperAdminMenu/DashboardIcon.svg';
import Subscription from '../assets/Images/SuperAdminMenu/SubscriptionIcon.svg';
import SuperAdminMenu from './SuperAdminMenu';
import { AppContext } from '../components/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const UserMenu = ({ activeLink, setActiveLink }) => {

  let navigate = useNavigate();
  const menuRef = useRef(null);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const dropdown2Ref = useRef(null);
  let appContext = useContext(AppContext);
  const [showSPX, setShowSPX] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(appContext.isAdmin);

  // Function to handle when a link is clicked
  const handleLinkClick = (link) => {
    setActiveLink(link);
    setMenuVisible(false);
  };

  const handleLinkClick2 = (link) => {
    setActiveLink(link);
    setIsVisible(false);
  };

  const handleLinkClick3 = (link) => {
    setActiveLink(link);
    setIsVisible2(false);
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
    if (path === '/dashboard') {
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

  const isActiveLink = location.pathname === '/static-matrix-short' || location.pathname === '/static-matrix-long';
  const isActiveLink2 = location.pathname === '/dynamic-matrix-short' || location.pathname === '/dynamic-matrix-long';

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsVisible(false);
      }
      if (dropdown2Ref.current && !dropdown2Ref.current.contains(event.target)) {
        setIsVisible2(false);
      }
    };

    if (isMenuVisible || isVisible || isVisible2) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible, isVisible, isVisible2]);


  return (
    <>
      {showSPX ? (
        <div className='hidden w-full min-w-[300px] max-w-[348px] h-full max-h-[910px] 2xl:min-h-[910px] bg-gradient rounded-3xl lg:grid sticky top-4'>
          <Link to="/" className='py-10 flex justify-center' ><img className='w-[200px]' src={LogoIcon} alt="" /></Link>
          <div>
            <Link to="/dashboard" className={`flex items-center gap-[30px] pl-[50px] p-2 ${getLinkClass('dashboard')}`} onClick={() => handleLinkClick('dashboard')}>
              <span className='flex justify-center w-7'><img src={Dashboard} alt="" /></span>
              <p className='text-[22px] leading-[33px] text-white'>Dashboard</p>
            </Link>
            <div className='flex items-center gap-[30px] mt-8 pl-[50px]'>
              <span className='flex justify-center w-6'><img src={StaticMatrixIcon} alt="" /></span>
              <p className='text-[22px] leading-[33px] text-white'>Static Matrix</p>
            </div>
            <div className='flex py-3 px-4 pl-[38px]'>
              <div className='border-t border-[#E1E1E1] max-w-[272px] w-full' />
            </div>
            <div className=''>
              <Link to="static-matrix-short" className={`text-[18px] leading-[27px] text-white p-2 block pl-[80px] ${getLinkClass('static-matrix-short')}`} onClick={() => handleLinkClick('static-matrix-short')}>ST-Short IC Matrix</Link>
              <Link to="static-matrix-long" className={`text-[18px] leading-[27px] text-white p-2 block pl-[80px] ${getLinkClass('static-matrix-long')}`} onClick={() => handleLinkClick('static-matrix-long')}>ST-Long IC Matrix</Link>
            </div>
            <div className='flex items-center gap-[30px] mt-6 pl-[50px] '>
              <span className='flex justify-center w-6'><img src={DynamicMatrix} alt="" /></span>
              <p className='text-[22px] leading-[33px] text-white'>Dynamic Matrix</p>
            </div>
            <div className='flex py-3 px-4 pl-[38px] '>
              <div className='border-t border-[#E1E1E1] max-w-[272px] w-full' />
            </div>
            <div className=''>
              <Link to="dynamic-matrix-short" className={`text-[18px] leading-[27px] text-white p-2 block pl-[80px] ${getLinkClass('dynamic-matrix-short')}`} onClick={() => handleLinkClick('dynamic-matrix-short')}>DY-Short IC Matrix</Link>
              <Link to="dynamic-matrix-long" className={`text-[18px] leading-[27px] text-white p-2 block pl-[80px] ${getLinkClass('dynamic-matrix-long')}`} onClick={() => handleLinkClick('dynamic-matrix-long')}>DY-Long IC Matrix</Link>
            </div>
            <Link to="/saved-matrix" className={`flex items-center gap-[30px] mt-6 text-white p-2 pl-[50px] ${getLinkClass('saved-matrix')}`} onClick={() => handleLinkClick('saved-matrix')}>
              <span className='flex justify-center w-6'><img src={SavedMatrix} alt="" /></span>
              <p className='text-[22px] leading-[33px] text-white'>Saved Matrix</p>
            </Link>
            <Link to="/subscription" className={`flex items-center gap-[30px] mt-7 pl-[50px] p-2 ${getLinkClass('subscription')}`} onClick={() => handleLinkClick('subscription')}>
              <span className='flex justify-center w-6'><img src={Subscription} alt="" /></span>
              <p className='text-[22px] leading-[33px] text-white'>Subscription</p>
            </Link>
            {appContext.superUser && <button type="button" className='flex items-center text-xl text-white text-center mx-auto mt-5 p-2' onClick={() => { setIsAdmin(!isAdmin); appContext.setAppContext({ ...appContext, isAdmin: !isAdmin }); navigate("/") }}>{isAdmin ? "Switch To User" : "Switch To Admin"}</button>}
          </div>
          <div className='flex justify-center items-end gap-5 pt-[40px] pb-[40px]'>
            <Link to="/setting"><img className={`py-[6px] px-[7px] border border-borderColor3 rounded-[6px] shadow-[0px_0px_4px_0px_#110D3D4D] ${getLinkClass('setting')}`} onClick={() => handleLinkClick('setting')} src={Settings} alt="" /></Link>
            <Link to="/help-support"> <img className={`p-[6px] border border-borderColor3 rounded-[6px] shadow-[0px_0px_4px_0px_#110D3D4D] ${getLinkClass('help-support')}`} onClick={() => handleLinkClick('help-support')} src={Help} alt="" /></Link>
          </div>
        </div>
      ) : (
        <>
          <div className='lg:w-[95px]'>
            <div className='hidden lg:block h-full max-h-[710px] bg-gradient rounded-3xl sticky top-4'>
              <img className='px-[27px] pt-[27px]' src={LogoSmall} alt="" />
              <img className='mx-auto mt-5 rotate-180 px-[6px] py-[9px] rounded-[6px] shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => setMenuVisible(prev => !prev)} src={MenuIcon} alt="MenuIcon" />
              <div className='grid gap-[10px] py-[34px]'>
                <Link to='/dashboard' className={`w-full py-[18px] px-[7px] flex justify-center ${getLinkClass('dashboard')}`}><img src={Dashboard} onClick={() => handleLinkClick('dashboard')} alt="" /></Link>
                <div className="relative">
                  <div className={`w-full py-[18px] px-[7px] flex justify-center cursor-pointer ${isActiveLink ? 'bg-[#2C7CAC]' : ''}`} onClick={() => setIsVisible(prev => !prev)} >
                    <img src={StaticMatrixIcon} alt="Static Matrix Icon" />
                  </div>
                  {isVisible && (
                    <div ref={dropdownRef} className="absolute -top-[5px] left-24 px-3 p-2 bg-background6 border border-borderColor shadow-lg rounded-lg w-44">
                      <Link to="/static-matrix-short" className="text-base text-Primary block p-1 border-b border-borderColor5" onClick={() => handleLinkClick2('/static-matrix-short')}> ST-Short IC Matrix </Link>
                      <Link to="/static-matrix-long" className="text-base text-Primary block p-1" onClick={() => handleLinkClick2('/static-matrix-long')} > ST-Long IC Matrix </Link>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <div className={`w-full py-[18px] px-[7px] flex justify-center cursor-pointer ${isActiveLink2 ? 'bg-[#2C7CAC]' : ''}`} onClick={() => setIsVisible2(prev => !prev)}  >
                    <img src={DynamicMatrix} alt="Static Matrix Icon" />
                  </div>
                  {isVisible2 && (
                    <div ref={dropdown2Ref} className="absolute -top-2 left-24 px-3 p-2 bg-background6 border border-borderColor shadow-lg rounded-lg w-[180px]">
                      <Link to="/dynamic-matrix-short" className="text-base text-Primary block p-1 border-b border-borderColor5" onClick={() => handleLinkClick3('/dynamic-matrix-short')}>  DY-Short IC Matrix </Link>
                      <Link to="/dynamic-matrix-long" className="text-base text-Primary block p-1" onClick={() => handleLinkClick3('/dynamic-matrix-long')} > DY-Long IC Matrix </Link>
                    </div>
                  )}
                </div>
                <Link to='/saved-matrix' className={`w-full py-[18px] px-[7px] flex justify-center ${getLinkClass('saved-matrix')}`}><img src={SavedMatrix} onClick={() => handleLinkClick('saved-matrix')} alt="" /></Link>
                <Link to='/subscription' className={`w-full py-[18px] px-[7px] flex justify-center ${getLinkClass('subscription')}`}><img src={Subscription} onClick={() => handleLinkClick('subscription')} alt="" /></Link>
                <div className=' flex justify-center'>
                  {appContext.superUser && <img src={SwitchToAdminIcon} alt='' className='py-[18px] px-[7px]' onClick={() => { setIsAdmin(!isAdmin); appContext.setAppContext({ ...appContext, isAdmin: !isAdmin }); navigate("/") }} />}
                </div>
              </div>
              <div className='pt-3'>
                <Link to="/setting"><img className={`mx-auto py-[6px] px-[7px] border border-borderColor3 rounded-[6px] shadow-[0px_0px_4px_0px_#110D3D4D] ${getLinkClass('setting')}`} onClick={() => handleLinkClick('setting')} src={Settings} alt="" /></Link>
                <Link to="/help-support"><img className={`mx-auto p-[6px] border border-borderColor3 rounded-[6px] shadow-[0px_0px_4px_0px_#110D3D4D] mt-2 ${getLinkClass('help-support')}`} onClick={() => handleLinkClick('help-support')} src={Help} alt="" /></Link>
              </div>
            </div>
          </div>

          <div ref={menuRef} className={`fixed top-0 left-0 z-10 w-full max-w-[300px] h-full bg-gradient rounded-r-3xl transform ${isMenuVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 ease-in-out`}>
            <Link to="/" className='py-10 flex justify-center' onClick={() => handleLinkClick('dashboard')}><img className='w-[200px]' src={LogoIcon} alt="" /></Link>
            <div>
              <Link to="/dashboard" className={`flex items-center gap-6 pl-10 p-2 ${getLinkClass('dashboard')}`} onClick={() => handleLinkClick('dashboard')}>
                <span className='flex justify-center w-6'><img src={Dashboard} alt="" /></span>
                <p className='text-xl text-white'>Dashboard</p>
              </Link>
              <div className='flex items-center gap-6 mt-7 pl-10'>
                <span className='flex justify-center w-6'><img src={StaticMatrixIcon} alt="" /></span>
                <p className='text-xl text-white'>Static Matrix</p>
              </div>
              <div className='flex py-2 px-3 pl-[38px]'>
                <div className='border-t border-[#E1E1E1] max-w-[230px] w-full' />
              </div>
              <div>
                <Link to="static-matrix-short" className={`text-base text-white p-2 block pl-[70px] ${getLinkClass('static-matrix-short')}`} onClick={() => handleLinkClick('static-matrix-short')}>ST-Short IC Matrix</Link>
                <Link to="static-matrix-long" className={`text-base text-white p-2 block pl-[70px] ${getLinkClass('static-matrix-long')}`} onClick={() => handleLinkClick('static-matrix-long')}>ST-Long IC Matrix</Link>
              </div>
              <div className='flex items-center gap-6 mt-5 pl-10 '>
                <span className='flex justify-center w-6'><img src={DynamicMatrix} alt="" /></span>
                <p className='text-xl text-white'>Dynamic Matrix</p>
              </div>
              <div className='flex py-2 px-3 pl-[38px] '>
                <div className='border-t border-[#E1E1E1] max-w-[230px] w-full' />
              </div>
              <div>
                <Link to="dynamic-matrix-short" className={`text-base text-white p-2 block pl-[70px] ${getLinkClass('dynamic-matrix-short')}`} onClick={() => handleLinkClick('dynamic-matrix-short')}>DY-Short IC Matrix</Link>
                <Link to="dynamic-matrix-long" className={`text-base text-white p-2 block pl-[70px] ${getLinkClass('dynamic-matrix-long')}`} onClick={() => handleLinkClick('dynamic-matrix-long')}>DY-Long IC Matrix</Link>
              </div>
              <Link to="/saved-matrix" className={`flex items-center gap-6 mt-5 text-white p-2 pl-10 ${getLinkClass('saved-matrix')}`} onClick={() => handleLinkClick('saved-matrix')}>
                <span className='flex justify-center w-6'><img src={SavedMatrix} alt="" /></span>
                <p className='text-xl text-white'>Saved Matrix</p>
              </Link>
              <Link to="/subscription" className={`flex items-center gap-6 mt-5 pl-10 p-2 ${getLinkClass('subscription')}`} onClick={() => handleLinkClick('subscription')}>
                <span className='flex justify-center w-6'><img src={Subscription} alt="" /></span>
                <p className='text-xl text-white'>Subscription</p>
              </Link>
              {appContext.superUser && <button type="button" className='flex items-center text-lg text-white text-center mx-auto mt-2 p-2' onClick={() => { setIsAdmin(!isAdmin); appContext.setAppContext({ ...appContext, isAdmin: !isAdmin }); navigate("/") }}>{isAdmin ? "Switch To User" : "Switch To Admin"}</button>}
            </div>
            <div className='flex justify-center items-end gap-5 py-8'>
              <Link to="/setting"><img className={`py-[6px] px-[7px] border border-borderColor3 rounded-[6px] shadow-[0px_0px_4px_0px_#110D3D4D] ${getLinkClass('setting')}`} onClick={() => handleLinkClick('setting')} src={Settings} alt="" /></Link>
              <Link to="/help-support"><img className={`p-[6px] border border-borderColor3 rounded-[6px] shadow-[0px_0px_4px_0px_#110D3D4D] ${getLinkClass('help-support')}`} onClick={() => handleLinkClick('help-support')} src={Help} alt="" /></Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}


function Menu({ activeLink, setActiveLink }) {
  let appContext = useContext(AppContext)
  if (!appContext.isAdmin) {
    return (<>
      <UserMenu activeLink={activeLink} setActiveLink={setActiveLink} />
    </>)
  } else {
    return (<>
      <SuperAdminMenu activeLink={activeLink} setActiveLink={setActiveLink} />
    </>)
  }
}

export default Menu;
