import React, { useContext, useMemo, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { setToken, setUserName } from './loginAPI';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../components/AppContext';
import LogoIcon from '../../assets/svg/LogoIcon.svg';
import WelcomeBg from '../../assets/Images/Login/WelcomeBg.png';

const EmailVerification = () => {

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);
    const ref6 = useRef(null);
    const navigate = useNavigate();
    const submitButtonRef = useRef(null);
    const [timer, setTimer] = useState(30);
    const appContext = useContext(AppContext);
    const [isDisabled, setIsDisabled] = useState(true);
    const [digit1, setDigit1] = useState("")
    const [digit2, setDigit2] = useState("")
    const [digit3, setDigit3] = useState("")
    const [digit4, setDigit4] = useState("")
    const [digit5, setDigit5] = useState("")
    const [digit6, setDigit6] = useState("")
    const [msg, setMsg] = useState({ type: "", msg: "", })

    if (!appContext.signupData.email1)
        window.location.href = "/"

    async function resend() {
        setIsDisabled(true);
        setTimer(30);
        if (!appContext.signupData.email1) {
            setMsg({ type: "error", msg: "Somethig went wrong pleas try again" })
            navigate("/")
        } else {
            try {
                setMsg({ type: "info", msg: "Please wait we are processing your request" })
                let response = await axios.post((process.env.REACT_APP_BASE_URL + process.env.REACT_APP_RESET_RESUEST_URL), { email: appContext.signupData.email1 })
                if (response.status === 200) {
                    setMsg({ type: "error", msg: "email id is already exists" })
                    return false
                }
                if (response.status !== 200) {
                    setMsg({ type: "error", msg: "Something went wrong" })
                    return false
                }
            } catch (error) {
                if (error.message.includes('Network Error')) {
                    setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
                }
            }
        }
    }

    async function signup() {
        let formData = { email1: appContext.signupData.email1, email2: appContext.signupData.email2, first_name: appContext.signupData.first_name.split(" ")[0], last_name: appContext.signupData.first_name.split(" ")[1], password: appContext.signupData.password }
        try {
            let response = await axios.post((process.env.REACT_APP_BASE_URL + process.env.REACT_APP_REGISTER_URL), formData)
            if (response.status === 201) {
                appContext.setAppContext((currect) => ({
                    ...currect,
                    signupData: {
                        first_name: "",
                        email1: "",
                        email2: "",
                        password: "",
                    },
                }))
                setToken(response.data.tokens.access)
                setUserName(response.data.first_name)
                window.location.href = "/"
            } else {
                setMsg({ type: "error", msg: "Something went wrong" })
            }
        } catch (error) {
            if (error.message.includes('Network Error')) {
                setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
            } else {
                setMsg({ type: "error", msg: 'A user with that username already exists." ? "A user with that email already exists.' });
            }
        }
    }

    async function verifyOTP() {
        if (appContext.signupData.email1 && (digit1.length === 1) && (digit2.length === 1) && (digit3.length === 1) && (digit4.length === 1) && (digit5.length === 1) && (digit6.length === 1)) {
            setMsg({ type: "info", msg: "Please wait we are processing your request" })
            try {
                let response = await axios.post((process.env.REACT_APP_BASE_URL + process.env.REACT_APP_VERIFY_OTP), { email: appContext.signupData.email1, otp: (digit1 + digit2 + digit3 + digit4 + digit5 + digit6) })
                if (response.status === 200) {
                    signup()
                }
            } catch (error) {
                if (error.message.includes('Network Error')) {
                    setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
                }
            }
        }
        else {
            setMsg({ type: "error", msg: "Please enter 6 digit OTP" })
        }
    }

    function isNumber(val) {
        if (isNaN(val) || (val.length > 1))
            return false
        else
            return true
    }

    const handleInputChange = (e, setter, nextRef, prevRef) => {
        const value = e.target.value;
        const key = e.nativeEvent.inputType;

        // If user deletes a value, focus on the previous field
        if (key === "deleteContentBackward") {
            setter('');
            if (prevRef) {
                prevRef.current.focus();
            }
        } else if (value.length === 1) {
            if (!isNumber(value))
                return
            setter(value);
            if (nextRef) {
                nextRef.current.focus();
            }
        }
    };

    function selectInputContent(e) {
        e.target.select()
    }

    useMemo(() => {
        if (msg.type !== "")
            setTimeout(() => {
                setMsg({ type: "", msg: "" })
            }, 20 * 100);
    }, [msg])

    // Function to handle resend action
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setIsDisabled(false);
        }
    }, [timer]);

    const handleLastInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            submitButtonRef.current.click();
        }
    };


    return (
        <div className='flex justify-center w-full'>
            <div className='p-7 max-w-[1600px] w-full'>
                <div className='flex flex-wrap md:flex-nowrap items-center lg:justify-center 2xl:justify-start gap-7 lg:gap-10 xl:gap-20'>
                    <div className='py-[25px] md:py-[50px] l lg:max-w-[500px] xl:max-w-[563px] 2xl:max-w-[753px] w-full bg-cover bg-center rounded-[22px]' style={{ backgroundImage: `url(${WelcomeBg})` }}>
                        <Link to='/login'><img className='px-[30px] lg:px-[70px]' src={LogoIcon} alt="" /></Link>
                        <div className='px-[30px] lg:px-[60px] xl:px-20 py-7 lg:py-5 2xl:py-[54px] my-7 md:my-10 lg:mt-8 lg:mb-3 2xl:my-[130px] bg-[#00588B]'>
                            <h1 className='text-[40px] leading-[50px] md:text-[50px] md:leading-[60px] 2xl:text-[100px] 2xl:leading-[120px] font-bold text-white '>Start Your Journey!</h1>
                            <p className='text-sm md:text-lg text-white mt-3 lg:mt-4 2xl:mt-5'>Embark on a transformative experience. Sign up to unlock your portfolio, navigate market dynamics, and make astute strategic decisions. Let’s cultivate your financial growth together!</p>
                        </div>
                    </div>
                    <div className='w-full max-w-[567px] lg:max-w-[500px] 2xl:max-w-[567px]'>
                        <h1 className='text-3xl lg:text-[50px] lg:leading-[75px] 2xl:text-[60px] 2xl:leading-[90px] text-Primary font-bold'>Email Verification</h1>
                        <p className='text-sm lg:text-lg text-Secondary2 mt-1 lg:mt-2 2xl:mt-5'>Please enter the 6-digit code we sent to your email to verify your identity and complete the setup.</p>
                        <div className='flex gap-[14px] text-base text-Primary font-medium'>
                            <div className='flex gap-[14px] text-base text-Primary font-medium mt-5 lg:mt-10'>
                                <input type='text' value={digit1} name='digit1' ref={ref1} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-[#B7D1E0] bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit1, ref2)} maxLength={1} />
                                <input type='text' value={digit2} name='digit2' ref={ref2} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-[#B7D1E0] bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit2, ref3)} maxLength={1} />
                                <input type='text' value={digit3} name='digit3' ref={ref3} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-[#B7D1E0] bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit3, ref4)} maxLength={1} />
                                <input type='text' value={digit4} name='digit4' ref={ref4} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-[#B7D1E0] bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit4, ref5)} maxLength={1} />
                                <input type='text' value={digit5} name='digit5' ref={ref5} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-[#B7D1E0] bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit5, ref6)} maxLength={1} />
                                <input type='text' value={digit6} name='digit6' ref={ref6} onFocus={selectInputContent} onKeyDown={handleLastInputKeyPress} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-[#B7D1E0] bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit6)} maxLength={1} />
                            </div>
                        </div>
                        <p className='text-sm lg:text-lg text-Secondary2 mt-[10px]'>if you don’t receive code <a className={`font-semibold underline ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-Secondary2 cursor-pointer'}`} onClick={!isDisabled ? resend : null}>resend</a> {isDisabled && <span> (wait {timer}s)</span>}</p>
                        {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}
                        <div className='flex flex-wrap justify-start items-center gap-5 mt-7 lg:mt-10'>
                            <p className='text-base lg:text-[20px] lg:leading-[30px] text-white font-semibold bg-ButtonBg py-2 px-[30px] rounded-md cursor-pointer' onClick={verifyOTP} ref={submitButtonRef} >Verify and Proceed</p>
                            <div className='text-sm lg:text-base text-Secondary2'>
                                Back To <Link to="/login" className='text-sm lg:text-base text-Secondary2 underline'>Login </Link><span className='px-2 text-Secondary2 '>|</span><Link to="/signup" className='text-sm lg:text-base text-Secondary2 underline'>Sign Up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailVerification;
