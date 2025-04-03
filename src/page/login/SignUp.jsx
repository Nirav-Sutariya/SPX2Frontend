import React, { useContext, useMemo, useState, useRef } from 'react';
import axios from 'axios';
import { PASSWORD_REGEX } from './loginAPI';
import { Link, useNavigate } from 'react-router-dom';
import LogoIcon from '../../assets/svg/LogoIcon.svg';
import { validateEmail } from '../../components/utils';
import { AppContext } from '../../components/AppContext';
import WelcomeBg from '../../assets/Images/Login/WelcomeBg.png';
import PasswordIIcon from '../../assets/Images/Login/PasswordIIcon.svg';
import PasswordIIcon2 from '../../assets/Images/Login/PasswordIIcon2.svg';

const SignUp = () => {

  const nameRef = useRef(null);
  const email1Ref = useRef(null);
  const email2Ref = useRef(null);
  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const submitButtonRef = useRef(null);
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const appContext = useContext(AppContext);
  const [password, setPassword] = useState("");
  const [first_name, setFirst_Name] = useState("");
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [showPassword, setShowPassword] = useState(false);

  function validateFormData() {
    if (first_name === "" || email1 === "" || email2 === "" || password === "") {
      setMsg({
        type: "error",
        msg: "Please fill all the fields"
      });
      return false
    }

    if (first_name.split(" ").length !== 2 || first_name.split(" ")[0].length < 3 || first_name.split(" ")[1].length < 1 || (/\d/.test(first_name))) {
      setMsg({
        type: "error",
        msg: "Please full name (fname lname)"
      });
      return false
    }

    else if (validateEmail(email1) === false) {
      setMsg({
        type: "error",
        msg: "Please enter valid email id"
      })
    }
    else if (email1.toLowerCase() !== email2.toLowerCase())
      setMsg({
        type: "error",
        msg: "Email id not match"
      })
    else if (!PASSWORD_REGEX.test(password)) {
      setMsg({
        type: "error",
        msg: `Password should be at least 1 upper, 1 lower, 1 special character, 1 digit, length min 8 - max 30`
      })
    } else
      return true
    return false
  }

  async function SubmitSignUp(e) {
    e.preventDefault();
    if (validateFormData()) {
      try {
        setMsg({
          type: "info",
          msg: "Please wait we are processing your request"
        })
        let response = await axios.post((process.env.REACT_APP_BASE_URL + process.env.REACT_APP_RESET_RESUEST_URL), { email: email1.toLocaleLowerCase() })
        if (response.status === 200) {
          setMsg({
            type: "error",
            msg: "email id is already exists"
          })
          return false
        }
        if (response.status !== 200) {
          setMsg({
            type: "error",
            msg: "Something went wrong"
          })
          return false
        }
      } catch (error) {
        if (error.response.status === 404) {
          appContext.setAppContext((currect) => ({
            ...currect,
            signupData: {
              first_name: first_name,
              email1: email1.toLowerCase(),
              email2: email2.toLowerCase(),
              password: password,
            },
          }))
          setMsg({
            type: "info",
            msg: "Please check signup otp we have sent on email id"
          })
          navigate("/email-verification")
        }
        if (error.message.includes('Network Error')) {
          setMsg({
            type: "error",
            msg: 'Could not connect to the server. Please check your connection.'
          });
        }
      }
    }
  }

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 20 * 100);
  }, [msg])

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      nextRef.current.focus();
    }
  };

  const handleNameChange = (e) => {
    const regex = /^[a-zA-Z\s]*$/; // Regular expression to allow only alphabets and spaces
    const value = e.target.value;

    if (!regex.test(value)) {
      setMsg({
        type: "error",
        msg: "Please enter a valid name (only alphabets are allowed)",
      });
      return;
    }

    setFirst_Name(value);
    setMsg({ type: "", msg: "" }); // Clear the error message if input is valid
  };

  return (
    <div className='flex justify-center w-full'>
      <div className='p-7 max-w-[1600px] w-full'>
        <div className='flex flex-wrap md:flex-nowrap items-center lg:justify-center 2xl:justify-start gap-7 lg:gap-10 xl:gap-20'>
          <div className='py-[25px] md:py-[50px] lg:max-w-[500px] xl:max-w-[563px] 2xl:max-w-[753px] w-full bg-cover bg-center rounded-[22px]' style={{ backgroundImage: `url(${WelcomeBg})` }}>
            <Link to='/login'><img className='px-[30px] lg:px-[70px]' src={LogoIcon} alt="" /></Link>
            <div className='px-[30px] lg:px-[60px] xl:px-20 py-7 lg:py-10 2xl:py-[54px] my-7 md:my-12 lg:my-20 2xl:my-[130px] bg-[#00588B]'>
              <h1 className='text-[40px] leading-[50px] md:text-[50px] md:leading-[60px] 2xl:text-[100px] 2xl:leading-[120px] font-bold text-white '>Start Your Journey!</h1>
              <p className='text-sm md:text-lg text-white mt-3 md:mt-5'>Embark on a transformative experience. Sign up to unlock your portfolio, navigate market dynamics, and make astute strategic decisions. Let’s cultivate your financial growth together!</p>
            </div>
          </div>
          <div className='w-full max-w-[567px] lg:max-w-[500px] 2xl:max-w-[567px]'>
            <h1 className='text-3xl lg:text-[50px] lg:leading-[75px] 2xl:text-[60px] 2xl:leading-[90px] text-Primary font-bold'>Sign Up</h1>
            <p className='text-sm lg:text-lg text-Secondary2 mt-1 lg:mt-2 2xl:mt-5'>Welcome, future investor! Please complete the form below to begin your journey.</p>
            <label className='block text-[16px] leading-5 text-Primary font-medium mt-5 2xl:mt-10'>
              Full Name
              <input type='text' value={first_name} ref={nameRef} onChange={handleNameChange} placeholder='Enter your full name(eg.fname lname)' onKeyDown={(e) => handleKeyDown(e, email1Ref)} className='mt-2 py-3 2xl:py-[14px] px-4 lg:px-5 rounded-md border border-borderColor bg-background6 w-full placeholder-custom focus:outline-none focus:border-borderColor7' />
            </label>
            <label className='block text-[16px] leading-5 text-Primary font-medium mt-5'> Email
              <input type='email' maxLength={50} value={email1} ref={email1Ref} onKeyDown={(e) => handleKeyDown(e, email2Ref)} onChange={(e) => { setEmail1(e.target.value) }} placeholder='Enter your email' className='mt-2 py-3 2xl:py-[14px] px-4 lg:px-5 rounded-md border border-borderColor bg-background6 w-full placeholder-custom focus:outline-none focus:border-borderColor7' />
            </label>
            <label className='block text-[16px] leading-5 text-Primary font-medium mt-5'> Confirm Email
              <input type='email' maxLength={50} value={email2} ref={email2Ref} onKeyDown={(e) => handleKeyDown(e, passwordRef)} onChange={(e) => { setEmail2(e.target.value) }} placeholder='Enter your confirm email' className='mt-2 py-3 2xl:py-[14px] px-4 lg:px-5 rounded-md border border-borderColor bg-background6 w-full placeholder-custom focus:outline-none focus:border-borderColor7' />
            </label>
            <label className='relative block text-[16px] leading-5 text-Primary font-medium mt-5'> Password
              <input type={showPassword ? 'text' : 'password'} maxLength={30} title='Password should be at least 1 upper, 1 lower, 1 special character, 1 digit, length min 8 - max 30' ref={passwordRef} onKeyDown={(e) => handleKeyDown(e, submitButtonRef)} placeholder='Enter your password' value={password} onChange={(e) => { setPassword(e.target.value) }} className='mt-2 py-3 2xl:py-[14px] pl-4 lg:pl-5 pr-11 rounded-md border border-borderColor bg-background6 w-full placeholder-custom focus:outline-none focus:border-borderColor7' />
              <span className="absolute z-10 top-[52px] right-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                <img src={showPassword ? PasswordIIcon : PasswordIIcon2} alt="" />
              </span>
            </label>
            {/* <p className='flex text-sm text-Secondary2 mt-[5px]'>(Password should be at least 1 upper, 1 lower, 1 special character, 1 digit, length min 5 - max 30)</p> */}
            {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}
            <div className='flex justify-start mt-5 2xl:mt-10'>
              <button className='text-lg lg:text-[20px] lg:leading-[30px] text-white font-semibold bg-ButtonBg py-2 px-[30px] rounded-md cursor-pointer' onClick={SubmitSignUp} ref={submitButtonRef}>Sign Up</button>
            </div>
            <p className='text-base lg:text-lg text-Secondary2 mt-[10px]'>Already have an account? <Link to={"/login"} className='font-semibold'>Log In</Link></p>
            <p className='text-sm lg:text-base text-Secondary2 mt-[10px]'><Link to={"/terms-of-service"} className='font-semibold underline'>Terms of Service</Link> And <Link to={"/privacy-policy"} className='font-semibold underline'>Privacy Policy</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
