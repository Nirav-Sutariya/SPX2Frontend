import React, { useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";
import { AppContext } from "./components/AppContext";
import { getToken, getUserId, removeTokens } from "./page/login/loginAPI";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
import ComingSoon from "./components/ComingSoon";
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

  let appContext = useContext(AppContext);
  const [theme, setTheme] = useState("light");
  const navigateData = window.location.pathname
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [activeLink, setActiveLink] = useState("/dashboard");
  const [isDarkTheme, setIsDarkTheme] = useState(localStorage.getItem("theme") === "dark");


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
            profilePhoto: response.data.data.profilePicture,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
  }

  // Get Super User To Admin Slide Access
  async function isSuperUser() {
    try {
      let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_IS_SUPER, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        appContext.setAppContext((curr) => {
          return {
            ...curr,
            superUser: response.data.data.isSuperUser
          }
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Admin Access For Dashboard Api
  async function getDashboardKey() {
    try {
      let response = await axios.post((process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_DASHBOARD_VIEW_KRY), { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setDashboardKey(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Find Plan List
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

  // Get Level Length Api
  async function fetchLevelLength() {
    try {
      let response = await axios.post(process.env.REACT_APP_MATRIX_URL + process.env.REACT_APP_GET_LEVEL_LENGTH, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        let data = response.data.data
        appContext.setAppContext({ ...appContext, shortMatrixLength: data.shortMatrix, longMatrixLength: data.longMatrix })
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    let logoutTimer;
    const checkAuth = async () => {
      setIsLoading(true);
      const token = getToken();
      const tokenValid = await validateToken(token);

      if (!tokenValid) {
        removeTokens();
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        logoutTimer = setTimeout(() => {
          removeTokens();
          setIsLoggedIn(false);
        }, 12 * 60 * 60 * 1000);
      }
      setIsLoading(false);
    };

    checkAuth();
    return () => clearTimeout(logoutTimer);
  }, [isLoggedIn]);

  // Validates the token using your API.
  const validateToken = async (token) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_VALIDATE_TOKEN_URL,
        {
          headers: { 'x-access-token': token }
        }
      );
      return response.status === 200 ? response.data.isValid : false;
    } catch (error) {
      return false;
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

  useMemo(async () => {
    if (isLoggedIn) {
      await getDashboardKey();
      await fetchLevelLength();
      await fetchPlan();
      await isSuperUser();
      await getUserData();
    }
  }, [isLoggedIn]);

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
  }, [])


  return (<>
    {isLoading ?
      <>
        <div className="flex justify-center items-center h-[100vh]">
          <div role="status">
            <svg aria-hidden="true" className="w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </>
      : <>
        <Router>
          <div className={`flex justify-center ${appContext.theme}`}>
            <div className="w-full bg-background max-w-[1920px]">
              {isLoggedIn ? (
                <div className="flex md:flex-nowrap lg:p-[14px]">
                  <Menu activeLink={activeLink} setActiveLink={setActiveLink} />
                  {!appContext.isAdmin ? <>
                    <div className="w-full max-w-[1530px]">
                      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} isDarkTheme={isDarkTheme} activeLink={activeLink} setActiveLink={setActiveLink} setIsLoggedIn={setIsLoggedIn} />
                      <Routes>
                        <Route path="/dashboard" element={(appContext.superUser || dashboardKey) ? <Dashboard theme={theme} /> : <ComingSoon />} />
                        <Route path="*" element={<Navigate to="/static-matrix-short" />} />
                        <Route path="/static-matrix-short" element={<StaticMatrix />} />
                        <Route path="/static-matrix-long" element={<StaticMatrixLong />} />
                        <Route path="/dynamic-matrix-short/" element={<DynamicMatrixShort />} />
                        <Route path="/dynamic-matrix-long/" element={<DynamicMatrixLong />} />
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
          </div>
        </Router>
      </>
    }
  </>);
};

export default App;