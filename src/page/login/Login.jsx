import React, { useContext, useMemo, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../components/utils';
import { AppContext } from '../../components/AppContext';
import { PASSWORD_REGEX, setToken, setUserName } from './loginAPI';
import LogoIcon from '../../assets/svg/LogoIcon.svg';
import WelcomeBg from '../../assets/Images/Login/WelcomeBg.png';
import PasswordIIcon from '../../assets/Images/Login/PasswordIIcon.svg';
import PasswordIIcon2 from '../../assets/Images/Login/PasswordIIcon2.svg';


const Login = ({ setIsLoggedIn }) => {

  const emailRef = useRef(null);
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const loginButtonRef = useRef(null);
  const [email, setEmail] = useState("");
  let appContext = useContext(AppContext);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [showPassword, setShowPassword] = useState(false);

  function validateFormData() {
    if (email.length < 1 || password === "") {
      setMsg({ type: "error", msg: "Email and password is required" });
      return false;
    }
    if (!validateEmail(email)) {
      setMsg({ type: "error", msg: "Please enter valid email" })
      return false
    }
    if (!PASSWORD_REGEX.test(password)) {
      setMsg({ type: "error", msg: "Enter valid password" })
      return false
    }
    return true
  }

  async function loginSubmit(e) {
    e.preventDefault();

    if (validateFormData()) {
      try {
        const response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_LOGIN_URL, {
          email: email.toLowerCase(),
          password: password
        });

        if (response.status === 200) {
          setToken(response.data.data.token);
          setUserName(response.data.data.firstName);
          setIsLoggedIn(true);
          localStorage.setItem("userId", response.data.data._id);
        } else {
          setMsg({ type: "error", msg: "Something went wrong" });
        }
      } catch (error) {
        if (error.message.includes("Network Error")) {
          setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection.", });
        } else if (error.response?.status === 400) {
          const message = error.response?.data?.message || "Something went wrong";
          setMsg({ type: "error", msg: message });
        }
      }
    }
  }



  const handleForgotPassword = async () => {
    if (email.length > 1) {
      if (!validateEmail(email)) {
        setMsg({ type: "error", msg: "Please enter a valid email" });
        return false;
      }

      try {
        setMsg({ type: "info", msg: "Please wait, we are processing your request" });
        let response = await axios.post(process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_RESET_RESUEST_URL, { email: email });

        if (response.status === 200) {
          appContext.setAppContext((currect) => ({
            ...currect,
            email: email.toLowerCase(),
          }));
          setMsg({ type: "info", msg: response.data.msg });
          navigate("/forget-password");
          return;
        }
        if (response.status === 404) {
          setMsg({ type: "error", msg: "Email not found" });
          return;
        }
        setMsg({ type: "error", msg: "Something went wrong" });
      } catch (error) {
        if (error.message.includes("Network Error")) {
          setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection.", });
        }
      }
    } else {
      setMsg({ type: "error", msg: "Please enter email ID" });
    }
  };

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 40 * 100);
  }, [msg])

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      nextRef.current.focus();
    }
  };


  return (
    <div className='flex justify-center w-full'>
      <div className='p-7 max-w-[1600px] w-full'>
        <div className='flex flex-wrap md:flex-nowrap items-center lg:justify-center 2xl:justify-start gap-7 lg:gap-10 xl:gap-20'>
          <div className='py-[25px] md:py-[50px] lg:max-w-[500px] xl:max-w-[563px] 2xl:max-w-[753px] w-full bg-cover bg-center rounded-[22px]' style={{ backgroundImage: `url(${WelcomeBg})` }}>
            <Link to='/login'><img className='px-[30px] lg:px-[70px]' src={LogoIcon} alt="" /></Link>
            <div className='px-[30px] lg:px-[60px] xl:px-20 py-7 2xl:py-[54px] my-7 md:my-12 lg:my-20 xl:my-[60px] 2xl:my-[130px] bg-[#00588B]'>
              <h1 className='text-[40px] leading-[50px] md:text-[50px] md:leading-[60px] 2xl:text-[100px] 2xl:leading-[120px] font-bold text-white '>Start Your Journey!</h1>
              <p className='text-sm md:text-lg text-white mt-3 2xl:mt-5'>Your financial journey continues. Log in to access your portfolio, track market trends, and make your next strategic move. Let’s keep your growth on track.</p>
            </div>
          </div>
          <div className='w-full max-w-[567px] lg:max-w-[500px] 2xl:max-w-[567px]'>
            <h1 className='text-3xl lg:text-[50px] lg:leading-[75px] 2xl:text-[60px] 2xl:leading-[90px] text-Primary font-bold'>Log In</h1>
            <p className='text-sm lg:text-lg text-Secondary2 mt-1 lg:mt-1 2xl:mt-5'>Welcome back! Please login to your account.</p>
            <label className='block text-[16px] leading-5 text-Primary font-medium mt-4 2xl:mt-10'> Email
              <input type='email' maxLength={50} placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                ref={emailRef} className='mt-2 py-3 lg:py-[14px] px-4 lg:px-5 rounded-md border border-[#B7D1E0] bg-background6 w-full placeholder-custom focus:outline-none focus:border-borderColor7' />
            </label>
            <label className='relative block text-[16px] leading-5 text-Primary font-medium mt-5'> Password
              <input type={showPassword ? 'text' : 'password'} maxLength={30} placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => handleKeyDown(e, loginButtonRef)}
                ref={passwordRef} className='mt-2 py-3 lg:py-[14px] pl-4 lg:pl-5 pr-11 rounded-md border border-[#B7D1E0] bg-background6 w-full placeholder-custom focus:outline-none focus:border-borderColor7' />
              <span className="absolute top-[52px] right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                <img src={showPassword ? PasswordIIcon : PasswordIIcon2} alt="" />
              </span>
            </label>
            <p className='flex text-sm text-Secondary2 mt-[5px]'>(Password should be at least 1 upper, 1 lower, 1 special character, 1 digit, length min 8 - max 30)</p>
            <p className='text-sm text-Secondary2 mx-auto text-end mt-[5px] '> <Link onClick={handleForgotPassword} className={email ? '' : 'pointer-events-none text-gray-400'}>Forget Password?</Link></p>

            {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}.</p>}

            <div className='flex justify-start mt-6 lg:mt-5 2xl:mt-[50px]'>
              <button className='text-lg lg:text-[20px] lg:leading-[30px] cursor-pointer text-white font-semibold bg-ButtonBg py-2 px-[30px] rounded-md shadow-[inset_-2px_-2px_5px_0_#104566] active:shadow-[inset_2px_2px_5px_0_#104566]' onClick={loginSubmit} ref={loginButtonRef}>Log In</button>
            </div>
            {/* <p className='text-base lg:text-lg text-Secondary2 mt-[10px]'>Don’t have an account? <Link to={"/signup"} className='font-semibold'>Sign Up</Link></p> */}
            <p className='text-sm lg:text-base text-Secondary2 mt-3'><Link to={"/terms-of-service"} className='font-semibold underline'>Terms of Service</Link> And <Link to={"/privacy-policy"} className='font-semibold underline'>Privacy Policy</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;