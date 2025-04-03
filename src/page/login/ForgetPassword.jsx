import React, { useContext, useMemo, useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LogoIcon from '../../assets/svg/LogoIcon.svg';
import { AppContext } from '../../components/AppContext';
import WelcomeBg from '../../assets/Images/Login/WelcomeBg.png';

const ForgetPassword = () => {

    const navigate = useNavigate();
    const submitButtonRef = useRef(null);
    const [timer, setTimer] = useState(30);
    const appContext = useContext(AppContext)
    const [isDisabled, setIsDisabled] = useState(true);
    const [digit1, setDigit1] = useState("")
    const [digit2, setDigit2] = useState("")
    const [digit3, setDigit3] = useState("")
    const [digit4, setDigit4] = useState("")
    const [digit5, setDigit5] = useState("")
    const [digit6, setDigit6] = useState("")
    const [msg, setMsg] = useState({ type: "", msg: "", })
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);
    const ref5 = useRef(null);
    const ref6 = useRef(null);

    if (!appContext.email)
        window.location.href = "/"

    async function resend() {
        setIsDisabled(true);
        setTimer(30);

        if (!appContext.email) {
            setMsg({
                type: "error",
                msg: "Somethig went wrong pleas try again"
            })
            navigate("/")
        } else {
            try {
                setMsg({
                    type: "info",
                    msg: "Please wait we are processing your request"
                })
                let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_RESET_RESUEST_URL), { email: appContext.email })
                if (response.status === 200) {
                    setMsg({
                        type: "info",
                        msg: response.data.msg
                    })
                }
                if (response.status === 404) {
                    setMsg({
                        type: "error",
                        msg: "Email not found"
                    })
                    return
                }
                if (response.status !== 200) {
                    setMsg({
                        type: "error",
                        msg: "Something went wrong"
                    })
                    return false
                }

            } catch (error) {
                if (error.message.includes('Network Error')) {
                    setMsg({
                        type: "error",
                        msg: 'Could not connect to the server. Please check your connection.'
                    });
                }
            }
        }
    }
    function isNumber(val) {
        return !isNaN(val) && val.length === 1;
    }

    const handleInputChange = (e, setter, nextRef, prevRef) => {
        const value = e.target.value;
        const key = e.nativeEvent.inputType;

        if (key === "deleteContentBackward" || key === "insertText" && value === "") {
            setter("");
            if (prevRef) {
                prevRef.current.focus();
            }
        } else if (value.length === 1 && isNumber(value)) {
            setter(value);
            if (nextRef) {
                nextRef.current.focus();
            }
        }
    };

    function selectInputContent(e) {
        e.target.select()
    }

    async function verifyOTP() {
        if (appContext.email && (digit1.length === 1) && (digit2.length === 1) && (digit3.length === 1) && (digit4.length === 1) && (digit5.length === 1) && (digit6.length === 1)) {
            setMsg({
                type: "info",
                msg: "Please wait we are processing your request"
            })
            try {
                let response = await axios.post((process.env.REACT_APP_AUTH_URL + process.env.REACT_APP_VERIFY_OTP), { email: appContext.email, otp: (digit1 + digit2 + digit3 + digit4 + digit5 + digit6) })
                if (response.status === 200) {
                    appContext.setAppContext((currect) => ({
                        ...currect,
                        otp: (digit1 + digit2 + digit3 + digit4 + digit5 + digit6)
                    }))
                    navigate("/new-password")
                }
            } catch (error) {
                if (error.message.includes('Network Error')) {
                    setMsg({
                        type: "error",
                        msg: 'Could not connect to the server. Please check your connection.'
                    });
                }
            }
        }
        else {
            setMsg({
                type: "error",
                msg: "Please enter 6 digit OTP"
            })
        }
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
                    <div className='py-[25px] md:py-[50px] lg:max-w-[500px] xl:max-w-[563px] 2xl:max-w-[753px] w-full bg-cover bg-center rounded-[22px]' style={{ backgroundImage: `url(${WelcomeBg})` }}>
                        <Link to='/login'><img className='px-[30px] lg:px-[70px]' src={LogoIcon} alt="" /></Link>
                        <div className='px-[30px] lg:px-[60px] xl:px-20 py-7 2xl:py-[54px] my-7 md:my-12 lg:my-20 xl:my-[60px] 2xl:my-[130px] bg-[#00588B]'>
                            <h1 className='text-[40px] leading-[50px] md:text-[50px] md:leading-[60px] 2xl:text-[100px] 2xl:leading-[120px] font-bold text-white'>Welcome Back!</h1>
                            <p className='text-sm md:text-lg text-white mt-3 2xl:mt-5'>Your financial journey continues. Log in to access your portfolio, track market trends, and make your next strategic move. Let’s keep your growth on track.</p>
                        </div>
                    </div>
                    <div className='w-full max-w-[567px] lg:max-w-[500px] 2xl:max-w-[567px]'>
                        <h1 className='text-3xl lg:text-[50px] lg:leading-[75px] 2xl:text-[60px] 2xl:leading-[90px] text-Primary font-bold'>Enter Your Code</h1>
                        <p className='text-sm lg:text-lg text-Secondary2 mt-1 lg:mt-2 2xl:mt-5'>Please enter the 6 digit code that sent to your email address.</p>
                        <div className='flex gap-[14px] text-base text-Primary font-medium mt-5 lg:mt-10'>
                            <input type='text' value={digit1} name='digit1' ref={ref1} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-borderColor bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit1, ref2)} maxLength={1} />
                            <input type='text' value={digit2} name='digit2' ref={ref2} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-borderColor bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit2, ref3, ref1)} maxLength={1} />
                            <input type='text' value={digit3} name='digit3' ref={ref3} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-borderColor bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit3, ref4, ref2)} maxLength={1} />
                            <input type='text' value={digit4} name='digit4' ref={ref4} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-borderColor bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit4, ref5, ref3)} maxLength={1} />
                            <input type='text' value={digit5} name='digit5' ref={ref5} onFocus={selectInputContent} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-borderColor bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit5, ref6, ref4)} maxLength={1} />
                            <input type='text' value={digit6} name='digit6' ref={ref6} onFocus={selectInputContent} onKeyDown={handleLastInputKeyPress} className='py-[6px] lg:py-[11px] px-3 text-center rounded-md border border-borderColor bg-background6 w-10 lg:w-[60px] focus:outline-none focus:border-borderColor7' onChange={(e) => handleInputChange(e, setDigit6, null, ref5)} maxLength={1} />
                        </div>
                        <p className='text-sm lg:text-lg text-Secondary2 mt-[10px]'>if you don’t receive code <a className={`font-semibold underline ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-Secondary2 cursor-pointer'}`} onClick={!isDisabled ? resend : null}>resend</a>{isDisabled && <span> (wait {timer}s)</span>}</p>
                        {(msg.msg !== "") && <p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}>{msg.msg}.</p>}
                        <div className='flex flex-wrap justify-start items-center gap-5 mt-7 lg:mt-10'>
                            <button className='text-base lg:text-[20px] lg:leading-[30px] text-white font-semibold bg-ButtonBg py-2 px-[30px] rounded-md cursor-pointer' onClick={verifyOTP} ref={submitButtonRef}>Verify and Proceed</button>
                            <span className='text-sm lg:text-base text-Secondary2'>Back To <Link to="/login" className='text-sm lg:text-base text-Secondary2 underline ml-1'>Login </Link></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
