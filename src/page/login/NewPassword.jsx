import React, { useContext, useMemo, useState, useRef } from 'react';
import axios from 'axios';
import { PASSWORD_REGEX } from './loginAPI';
import { Link, useNavigate } from 'react-router-dom';
import LogoIcon from '../../assets/svg/LogoIcon.svg';
import { AppContext } from '../../components/AppContext';
import WelcomeBg from '../../assets/Images/Login/WelcomeBg.png';
import PasswordIIcon from '../../assets/Images/Login/PasswordIIcon.svg';
import PasswordIIcon2 from '../../assets/Images/Login/PasswordIIcon2.svg';

const NewPassword = () => {

  const navigate = useNavigate();
  const passwordRef1 = useRef(null);
  const passwordRef2 = useRef(null);
  const submitButtonRef = useRef(null);
  const appContext = useContext(AppContext);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  async function setNewPassword() {
    if ((!appContext.email) || (!appContext.otp)) {
      setMsg({ type: "error", msg: "Something went wrong please try again" });
      return false
    }
    if (password1 !== password2) {
      setMsg({ type: "error", msg: "Passwords do not match" });
      return false
    }
    if (!PASSWORD_REGEX.test(password1)) {
      setMsg({ type: "error", msg: "Password should be at least 1 upper, 1 lower, 1 special character, 1 digit, length min 8 - max 30" })
      return false
    }
    
    try {
      let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_RESET_PASSWORD_URL), { email: appContext.email, password: password1, confirmPassword: password2, otp: appContext.otp })
      if (response.status === 201) {
        setMsg({ type: "info", msg: "Password reset successfully" });
        navigate("/")
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
              <h1 className='text-[40px] leading-[50px] md:text-[50px] md:leading-[60px] 2xl:text-[100px] 2xl:leading-[120px] font-bold text-white'>Welcome Back!</h1>
              <p className='text-sm lg:text-lg text-white mt-3 2xl:mt-5'>Your financial journey continues. Log in to access your portfolio, track market trends, and make your next strategic move. Let’s keep your growth on track.</p>
            </div>
          </div>
          <div className='w-full max-w-[630px] lg:max-w-[540px] 2xl:max-w-[630px]'>
            <h1 className='text-3xl lg:text-[50px] lg:leading-[75px] 2xl:text-[60px] 2xl:leading-[90px] text-Primary font-bold'>Enter New Password</h1>
            <p className='text-sm lg:text-lg text-Secondary2 mt-1 lg:mt-2 2xl:mt-5'>Your new password must be different from previously used password.</p>
            <label className='relative block text-[16px] leading-5 text-Primary font-medium mt-5 2xl:mt-10'> Password
              <input type={showPassword ? 'text' : 'password'} maxLength={30} ref={passwordRef1} onKeyDown={(e) => handleKeyDown(e, passwordRef2)} value={password1} onChange={(e) => {
                setPassword1(e.target.value)
              }} placeholder='Enter your password' className='mt-2 py-3 2xl:py-[14px] px-4 lg:px-5 rounded-md border border-borderColor bg-background6 w-full focus:outline-none focus:border-borderColor7' />
              <span className="absolute top-[52px] right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)} >
                <img src={showPassword ? PasswordIIcon : PasswordIIcon2} alt="" />
              </span>
            </label>
            <p className='flex text-sm text-Secondary2 mt-[5px]'>(Password should be at least 1 upper, 1 lower, 1 special character, 1 digit, length min 8 - max 30)</p>
            <label className='relative block text-[16px] leading-5 text-Primary font-medium mt-5'> Confirm Password
              <input type={showPassword1 ? 'text' : 'password'} maxLength={30} ref={passwordRef2} onKeyDown={(e) => handleKeyDown(e, submitButtonRef)} value={password2} onChange={(e) => {
                setPassword2(e.target.value)
              }} placeholder='Enter your confirm password' className='mt-2 py-3 2xl:py-[14px] pl-4 lg:pl-5 pr-11 rounded-md border border-borderColor bg-background6 w-full focus:outline-none focus:border-borderColor7' />
              <span className="absolute top-[52px] right-4 z-10 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword1(!showPassword1)} >
                <img src={showPassword1 ? PasswordIIcon : PasswordIIcon2} alt="" />
              </span>
            </label>
            <p className='flex text-sm text-Secondary2 mt-[5px]'>(Password should be at least 1 upper, 1 lower, 1 special character, 1 digit, length min 8 - max 30)</p>
            {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}
            <div className='flex justify-start mt-5 2xl:mt-10'>
              <button className='text-lg lg:text-[20px] lg:leading-[30px] text-white font-semibold bg-ButtonBg py-2 px-[30px] rounded-md cursor-pointer' onClick={setNewPassword} ref={submitButtonRef} >Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;