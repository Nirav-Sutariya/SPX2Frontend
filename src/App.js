import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { DateTime } from 'luxon';
import { AppContext } from "./components/AppContext";
import { getToken, getUserId, isSuperUser, removeTokens } from "./page/login/loginAPI";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Menu from "./layout/Menu";
import Landing from "./page/Landing";
import Header from "./layout/Header";
import Login from "./page/login/Login";
import UserData from "./admin/UserData";
import Dashboard from "./page/Dashboard";
import HelpSupport from "./page/HelpSupport";
import Setting from "./page/settings/Setting";
import SupportUser from "./admin/SupportUser";
import Subscription from "./page/Subscription";
import AdminHeader from "./layout/AdminHeader";
import ManageCoupon from "./admin/ManageCoupon";
import ManageLevels from "./admin/ManageLevels";
// import SignUp from "./components/login/SignUp";
import NewPassword from "./page/login/NewPassword";
import AdminDashboard from "./admin/AdminDashboard";
import EditProfile from "./page/settings/EditProfile";
import UserDataSubPage from "./admin/UserDataSubPage";
import UserDataBanUser from "./admin/UserDataBanUser";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ForgetPassword from "./page/login/ForgetPassword";
import TermsOfService from "./components/TermsofService";
import SavedMatrix from "./page/savedMatrix/SavedMatrix";
import AdminSubscription from "./admin/AdminSubscription";
import StaticMatrix from "./page/staticMatrix/StaticMatrix";
import SubscriptionHistory from "./page/SubscriptionHistory";
import EmailVerification from "./page/login/EmailVerification";
import StaticMatrixLong from "./page/staticMatrix/StaticMatrixLong";
import DynamicMatrixLong from "./page/dynamicMatrix/DynamicMatrixLong";
import DynamicMatrixShort from "./page/dynamicMatrix/DynamicMatrixShort";

const App = () => {

  const navigate = useNavigate();
  let appContext = useContext(AppContext);
  const [theme, setTheme] = useState("light");
  const navigateData = window.location.pathname;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [activeLink, setActiveLink] = useState("/dashboard");
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(localStorage.getItem("theme") === "dark");
  const timezone = 'America/New_York';


  // Validates the token using your API.
  useEffect(() => {
    let logoutTimer;
    let warningTimer;

    const checkAuth = async () => {
      const token = getToken();
      const tokenValid = await validateToken(token);

      if (!tokenValid) {
        removeTokens();
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);

        // Show warning 5 minutes before logout (5 * 60 * 1000)
        warningTimer = setTimeout(() => {
          setShowLogoutWarning(true);
        }, (12 * 60 - 5) * 60 * 1000);

        // Logout after 12 hours
        logoutTimer = setTimeout(() => {
          removeTokens();
          setIsLoggedIn(false);
        }, 12 * 60 * 60 * 1000);
      }
    };

    checkAuth();

    return () => {
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
    };
  }, [isLoggedIn]);

  const validateToken = async (token) => {
    try {
      const response = await axios.get(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_VALIDATE_TOKEN_URL, {
        headers: {
          'x-access-token': token
        }
      });
      return response.status === 200 ? response.data.isValid : false;
    } catch (error) {
      return false;
    }
  };

  // Get User Data Fined
  async function getUserData() {
    if (appContext.userData.first_name === '' && appContext.userData.last_name === '')
      try {
        let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_PROFILE_GET_URL), { userId: getUserId() }, {
          headers: {
            'x-access-token': getToken()
          }
        })
        if (response.status === 200) {
          const { firstName, lastName, email, slackId, phoneNo } = response.data.data;
          appContext.setAppContext((curr) => ({
            ...curr,
            userData: {
              first_name: firstName || "",
              last_name: lastName || "",
              email: email || "",
              slackID: slackId || "",
              phone: phoneNo || "",
            },
            profilePhoto: response.data.data?.profilePicture,
            currency: response.data.data?.currency,
            audRate: response.data.data?.userCurrencyData?.aud,
            cadRate: response.data.data?.userCurrencyData?.cad,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
  }

  // Get Admin This Page Access For Admin Api 
  async function getMatrixLevel() {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_LEVEL_LENGTH), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        appContext.setAppContext((curr) => ({
          ...curr,
          shortMatrixLength: response.data.data?.shortMatrix,
          longMatrixLength: response.data.data?.longMatrix,
        }));
      }
    } catch (error) { }
  }

  const formatData = (data) => ({
    price: data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    change: data.change.toFixed(2),
  });

  const fetchMarketData = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_GET_SPX_DATA_URL,
        { userId: getUserId() },
        {
          headers: {
            'x-access-token': getToken(),
          },
        }
      );

      if (response.status === 200 && response.data?.data) {
        const { spx, rut, ndx, vix } = response.data.data;
        const marketTime = DateTime.now().setZone('America/New_York').toISO();
        const formattedData = ({
          spx: formatData(spx),
          rut: formatData(rut),
          ndx: formatData(ndx),
          vix: formatData(vix),
        });

        // ✅ Store in appContext for global use
        appContext.setAppContext((prev) => ({
          ...prev,
          marketData: formattedData,
          marketTime: marketTime,
        }));
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  // Set the initial theme from localStorage or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    setIsDarkTheme(savedTheme === 'dark');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = async () => {
    const newTheme = isDarkTheme ? "light" : "dark";
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem("theme", newTheme);

    try {
      const response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_UPDATE_USER_THEME, { userId: getUserId(), theme: newTheme }, {
        headers: {
          "x-access-token": getToken()
        }
      });

      if (response.status === 201) {
        appContext.setAppContext((curr) => ({
          ...curr,
          theme: newTheme
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const runStartupLogic = async () => {
      const token = getToken();

      if (token) {
        const superUser = isSuperUser(token);
        appContext.setAppContext(prev => ({
          ...prev,
          superUser: superUser,
        }));

        // Call getUserData only if token is valid
        await getUserData();
        await fetchMarketData();
        await getMatrixLevel();
      } else {
        console.warn("No valid token found.");
      }
    };

    runStartupLogic();
  }, [isLoggedIn]);

  useEffect(() => {
    const timezone = 'America/New_York';
    const openingHour = '09:30 AM';
    const closingHour = '04:00 PM';

    const shouldMarketBeOpen = () => {
      const now = DateTime.now().setZone(timezone);
      const today = now.toFormat('yyyy-MM-dd');

      const openTime = DateTime.fromFormat(`${today} ${openingHour}`, 'yyyy-MM-dd hh:mm a', { zone: timezone });
      const closeTime = DateTime.fromFormat(`${today} ${closingHour}`, 'yyyy-MM-dd hh:mm a', { zone: timezone });

      return now >= openTime && now <= closeTime;
    };  

    const interval = setInterval(() => {
      if (shouldMarketBeOpen()) {
        fetchMarketData();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Apply dark mode class when isDarkTheme is true else Apply light mode class when isDarkTheme is false
  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [isDarkTheme]);

  useEffect(() => {
    sessionStorage.setItem('paths', JSON.stringify(navigateData));
  }, []);

  const adminPaths = [
    '/admin-dashboard',
    '/support-user',
    '/admin-subscription',
    '/manage-coupon',
    '/user-data',
    '/manage-levels',
    '/user-data-sub-page',
  ];

  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem('paths')) || [];
    const filterData = adminPaths.some((path) => adminData.startsWith(path));

    if (filterData) {
      appContext.setAppContext((curr) => {
        return {
          ...curr,
          isAdmin: true,
        }
      })
    }
    navigate(adminData);
  }, [])

  const RedirectToStaticMatrix = () => {
    const navigate = useNavigate();

    useEffect(() => {
      navigate("/static-matrix-short", { replace: true });
    }, [navigate]);

    return null; // Or a loading spinner if you want
  };


  return (
    <>
      <div className={`flex justify-center ${appContext.theme}`}>
        <div className="w-full bg-background max-w-[1920px]">
          {isLoggedIn ? (
            <div className="flex md:flex-nowrap lg:p-[14px]">
              <Menu activeLink={activeLink} setActiveLink={setActiveLink} />
              {!appContext.isAdmin ? <>
                <div className="w-full max-w-[1530px]">
                  <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} isDarkTheme={isDarkTheme} activeLink={activeLink} setActiveLink={setActiveLink} setIsLoggedIn={setIsLoggedIn} />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard theme={theme} />} />
                    <Route path="*" element={<RedirectToStaticMatrix />} />
                    <Route path="/static-matrix-short" element={<StaticMatrix />} />
                    <Route path="/static-matrix-long" element={<StaticMatrixLong />} />
                    <Route path="/dynamic-matrix-short/" element={<DynamicMatrixShort theme={theme} />} />
                    <Route path="/dynamic-matrix-long/" element={<DynamicMatrixLong theme={theme} />} />
                    <Route path="/saved-matrix" element={<SavedMatrix />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    <Route path="/help-support" element={<HelpSupport />} />
                    <Route path="/subscription" element={<Subscription />} />
                    <Route path="/setting" element={<Setting setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/subscription-history" element={<SubscriptionHistory />} />
                  </Routes>
                </div>
              </> : <>
                <div className="w-full max-w-[1530px]">
                  <AdminHeader toggleTheme={toggleTheme} isDarkMode={isDarkMode} isDarkTheme={isDarkTheme} activeLink={activeLink} setActiveLink={setActiveLink} setIsLoggedIn={setIsLoggedIn} />
                  <Routes>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="*" element={<Navigate to="/admin-dashboard" />} />
                    <Route path="/support-user" element={<SupportUser />} />
                    <Route path="/admin-subscription" element={<AdminSubscription />} />
                    <Route path="/manage-coupon" element={<ManageCoupon />} />
                    <Route path="/user-data" element={<UserData />} />
                    <Route path="/manage-levels" element={<ManageLevels />} />
                    <Route path="/user-data-sub-page" element={<UserDataSubPage />} />
                    <Route path="/user-data-ban-user" element={<UserDataBanUser />} />
                  </Routes>
                </div>
              </>}
            </div>
          ) : (
            // If not logged in, render the Login page
            <Routes>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="*" element={<Navigate to="/" />} />
              {/* <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} /> */}
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/new-password" element={<NewPassword />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/" element={<Landing />} />
            </Routes>
          )}
        </div>
        {showLogoutWarning && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
            <div className="p-4 lg:p-[30px] border border-borderColor5 rounded-lg bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-[360px] lg:w-[486px]">
              <h2 className="text-lg lg:text-[28px] lg:leading-[33px] font-semibold text-Secondary2 mx-auto max-w-[600px] mt-5 text-center">Session Expiring Soon</h2>
              <h2 className="text-base lg:text-[18px] lg:leading-[33px] text-Secondary2 mx-auto max-w-[400px] lg:mt-2 text-center">You will be logged out in 5 minutes. Please Save your work.</h2>
              <div className="flex justify-between gap-3 mt-5 lg:mt-9">
                <button className="text-base lg:text-[20px] lg:leading-[30px] text-Primary font-semibold px-7 lg:px-10 py-2 lg:py-3 text-white rounded-md bg-ButtonBg mx-auto" onClick={() => setShowLogoutWarning(false)}>OK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;