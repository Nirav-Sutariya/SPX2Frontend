import React, { useContext, useMemo, useState, useRef, useEffect } from 'react';
import PlusIcon from '../assets/Images/Halp/PlusIcon.svg';
import MinimumIcon from '../assets/Images/Halp/MinimumIcon.svg';
import DeleteIcon from '../assets/Images/StaticMatrix/DeleteIcon.svg';
import DropFilePlusIcon from '../assets/Images/Halp/DropFilePlusIcon.svg';
import SupportTicketIcon from '../assets/Images/Halp/SupportTicketIcon.svg';
import PopupCloseIcon from '../assets/Images/SuperDashboard/PopupCloseIcon.svg';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../components/AppContext';
import { getToken, getUserId } from './login/loginAPI';

const HelpSupport = () => {

  const nameRef = useRef(null);
  const location = useLocation();
  const [msg, setMsg] = useState("");
  const descriptionRef = useRef(null);
  const submitButtonRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  let appContext = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [FAQActiveIndex, setFAQActiveIndex] = useState(null);
  const [errors, setErrors] = useState({ name: "", email: "", description: "", file: "" });


  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length > 0 && (!isNaN(value) || /\d/.test(value))) {
      setErrors((prevErrors) => ({ ...prevErrors, name: "Please Enter a valid name (only letters and spaces allowed)" }));
      return;
    }
    setName(value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const maxSize = 5 * 1024 * 1024;

    if (selectedFile) {
      if (!validateFileType(selectedFile)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: "File type not supported. Only JPG, JPEG, and PNG allowed.",
        }));
        setFile(null);
        return;
      }

      if (selectedFile.size > maxSize) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          file: "File size exceeds 5MB. Please upload a smaller image.",
        }));
        setFile(null);
        return;
      }

      // If all checks pass
      setFile(selectedFile);
      setErrors((prevErrors) => ({ ...prevErrors, file: "" }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!validateFileType(droppedFile)) {
        setErrors({ ...errors, file: "Invalid file type. Only JPG, JPEG, PNG allowed." });
      } else {
        setFile(droppedFile);
        setErrors({ ...errors, file: "" });
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const validateFileType = (file) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    return allowedExtensions.test(file.name);
  };

  const formValidation = () => {
    let validationErrors = { name: "", description: "", file: "" };
    let isValid = true;

    if (!name.trim()) {
      validationErrors.name = "Name is required";
      isValid = false;
    }

    if (!description.trim()) {
      validationErrors.description = "Description is required";
      isValid = false;
    }

    if (file && !validateFileType(file)) {
      validationErrors.file = "File Supported: JPG, JPEG, PNG only";
      isValid = false;
    }
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formValidation()) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('description', description);
      formData.append('file', file);
      formData.append('userId', getUserId());
      try {
        setMsg({ type: "info", msg: 'Please wait we are processing your request...' });
        let response = await axios.post(process.env.REACT_APP_TICKET_URL + process.env.REACT_APP_SUPPORT_TICKET_URL, formData, {
          headers: {
            'x-access-token': getToken()
          }
        })
        if (response.status === 201) {
          setShowModal(true);
          setDescription("")
          setFile(null)
        } else {
          setMsg({ type: "error", msg: "Something went wrong. Please try again later." });
        }
      } catch (error) {
        if (error.message.includes('Network Error')) {
          setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
        }
      }
    }
  };

  // Check if the 'openTerms' query parameter is present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const openTerms = queryParams.get('openTerms');
    if (openTerms) {
      setActiveIndex(1);
    }
  }, [location]);

  useEffect(() => {
    if (appContext.userData) {
      setEmail(appContext.userData.email || "");
      setName(appContext.userData.first_name || "");
    }
  }, [appContext.userData]);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  const toggleAccordionFAQ = (index) => {
    setFAQActiveIndex(index === FAQActiveIndex ? -1 : index);
  };

  const handleFileDelete = () => {
    setFile(null);
    document.getElementById('fileInput').value = '';
  };

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 20 * 100);
  }, [msg])

  // Hide errors after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrors({ name: "", email: "", description: "", file: "" });
    }, 4000);
    return () => clearTimeout(timer);
  }, [errors]);

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [showModal]);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      nextRef.current.focus();
    }
  };


  return (
    <div className='px-[14px] lg:pl-10'>
      <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'>Help & Support</h2>
      <div className='mt-5 lg:mt-10 px-5 lg:px-[30px] py-5 lg:py-[34px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-full'>
        <h2 className='text-xl lg:text-[28px] leading-[42px] text-Primary font-medium'>Submit a Support Ticket</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4 mt-2 lg:mt-[11px]">
          <div>
            <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Name *</label>
            <input type="text" name="first_name" placeholder='Enter your name' maxLength={50} title='maxLength 50' value={name} onChange={handleNameChange} ref={nameRef} onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
              className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Email *</label>
            <input type="email" value={appContext.userData.email} disabled className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg cursor-not-allowed" />
          </div>
        </div>
        <div>
          <label className="block text-sm lg:text-[16px] lg:leading-[30px] text-Primary font-medium">Description *</label>
          <textarea type="text" name="last_name" placeholder='Enter your description' rows="3" value={description} onChange={(e) => setDescription(e.target.value)} ref={descriptionRef} onKeyDown={(e) => handleKeyDown(e, submitButtonRef)}
            className="text-Primary w-full mt-2 px-3 lg:px-5 py-[5px] lg:py-[9px] text-[14px] leading-[32px] border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <form className='p-10 mt-[14px] border border-borderColor rounded-md bg-textBoxBg' onSubmit={handleSubmit}>
          <div className='text-center' onDrop={handleDrop} onDragOver={handleDragOver}>
            {file ? (
              <div className='flex justify-center items-center gap-5'>
                <p className='text-sm lg:text-base text-Primary'>{file.name}</p>
                <img src={DeleteIcon} className='w-4 h-4 cursor-pointer' onClick={handleFileDelete} alt="Delete Icon" />
              </div>
            ) : (
              <>
                <img className='mx-auto p-[15px] rounded-full bg-background6 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer' onClick={() => document.getElementById('fileInput').click()} src={DropFilePlusIcon} alt="" />
                <p className='text-base font-medium text-Primary mt-3'>Drop Your files here</p>
                <p className='text-xs font-medium text-[#B7D1E0]'>File Supported : JPG, JPEG, PNG</p>
                <p className='text-xs font-medium text-[#B7D1E0]'>File size exceeds the 5MB limit.</p>
              </>
            )}
            <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} style={{ display: 'none' }} id="fileInput" />
            <div className='flex justify-center mt-5'>
              <label htmlFor="fileInput">
                <div className='text-sm lg:text-base font-medium text-Primary px-[18px] py-2 rounded-md bg-background4 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer'>
                  Browse Files
                </div>
              </label>
            </div>
          </div>
        </form>

        {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
        {msg && (<p className={`text-sm ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"} mt-2`}> {msg.msg} </p>)}

        <div className='flex justify-end'>
          <button type="submit" ref={submitButtonRef} onClick={handleSubmit} className="text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 mt-[30px] lg:py-[13px] lg:px-[30px]"> Submit </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#31313166] z-20">
          <div className="relative mx-2 p-5 lg:p-10 bg-background6 rounded-[22px] shadow-[0px_0px_6px_0px_#28236633] w-[400px] md:w-[500px] lg:w-[648px]">
            <img className='absolute right-2 top-2 cursor-pointer' onClick={() => setShowModal(false)} src={PopupCloseIcon} alt="" />
            <img className='w-16 lg:w-[90px] mx-auto' src={SupportTicketIcon} alt="Logout Icon" />
            <h3 className="text-xl lg:text-[28px] lg:leading-[42px] text-Primary font-semibold mx-auto mt-4 lg:mt-7 text-center">Support Ticket Submitted Successfully!</h3>
            <p className='text-sm lg:text-base text-Secondary2 text-center mt-2 lg:mt-3 sm:mx-4 '>Thank you for reaching out. Your support ticket has been submitted, and our team is on it! We will get back to you as soon as possible.</p>
          </div>
        </div>
      )}

      <div className='flex justify-between items-center gap-5 text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-5 lg:mt-10 rounded-md bg-background6 max-w-[758px] shadow-[0px_0px_6px_0px_#28236633] cursor-pointer'
        onClick={() => toggleAccordion(0)}>
        FAQs <img className='w-4 lg:w-auto' src={activeIndex === 0 ? MinimumIcon : PlusIcon} alt="" />
      </div>

      {activeIndex === 0 && (
        <div className='mt-5 p-4 lg:p-[30px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
          <div onClick={() => toggleAccordionFAQ(5)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
            <img className='w-4 md:w-auto' src={FAQActiveIndex === 5 ? MinimumIcon : PlusIcon} alt="" /> Mechanics of Short Iron condor
          </div>
          {FAQActiveIndex === 5 && (
            <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
              <p className='mt-1 lg:mt-2 text-base lg:text-xl text-Primary font-medium'>Mechanics of Setting Up a Short Iron Condor </p>
              <div className='pl-4 lg:pl-5'>
                <li className='mt-2 lg:mt-3 text-sm lg:text-lg text-Primary font-medium'>Setup </li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Sell an out-of-the-money (OTM) call option.</li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Buy a further OTM CALL option to cap risk.</li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Sell an out-of-the-money (OTM) put option.</li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Buy a further OTM put option to cap risk.</li>

                <li className='mt-2 lg:mt-4 text-sm lg:text-lg text-Primary font-medium'>Selection of Strike Prices and Expiration Dates: </li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'><span className='font-medium'>Strike Prices: </span>Follow #spx-trade-alert channel.</li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'><span className='font-medium'>Expiration Dates: </span>We Typically choose 1 days to expiration.</li>
              </div>

              <p className='mt-4 lg:mt-7 text-base lg:text-xl text-Primary font-medium'>Potential Profit and Loss Scenarios</p>

              <div className='pl-4 lg:pl-5'>
                <li className='mt-1 lg:mt-3 text-sm lg:text-lg text-Primary font-medium'>Maximum Profit: </li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Achieved if the underlying price remains between the short strike (Call and Put) prices at expiration.</li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Profit = Net Credit Received.</li>

                <li className='mt-2 lg:mt-4 text-sm lg:text-lg text-Primary font-medium'>Maximum Loss: </li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Occurs if the underlying price close beyond the long call or long put strike prices.</li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Loss = Width of Spread - Net Credit Received.</li>

                <li className='mt-2 lg:mt-4 text-sm lg:text-lg text-Primary font-medium'>Breakeven Points: </li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Upper Breakeven = Short Call Strike + Net Credit.</li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Lower Breakeven = Short Put Strike - Net Credit.</li>
              </div>

              <p className='mt-4 lg:mt-7 text-base lg:text-xl text-Primary font-medium'>Key Factors Influencing Outcomes</p>

              <div className='pl-4 lg:pl-5'>
                <li className='mt-1 lg:mt-3 text-sm lg:text-lg text-Primary font-medium'>Implied Volatility: </li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>A decrease in implied volatility benefits the short Iron Condor as option premiums shrink.</li>

                <li className='mt-2 lg:mt-4 text-sm lg:text-lg text-Primary font-medium'>Time Decay: </li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Works in favor of the strategy since the sold options lose value as expiration approaches.</li>

                <li className='mt-2 lg:mt-4 text-sm lg:text-lg text-Primary font-medium'>Price Movement: </li>
                <li className='mt-1 pl-4 lg:pl-5 text-sm lg:text-lg text-Secondary2'>Large price movements toward or beyond the long strikes result in losses.</li>
              </div>
            </p>
          )}

          <div onClick={() => toggleAccordionFAQ(0)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
            <img className='w-4 md:w-auto' src={FAQActiveIndex === 0 ? MinimumIcon : PlusIcon} alt="" /> What Payment Methods Are Accepted?
          </div>
          {FAQActiveIndex === 0 && (
            <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
              <li className='text-Primary font-semibold'>We accept all major payment methods supported by Stripe, including:</li>
              <li className='mt-1 pl-5'>Digital wallets like Apple Pay and Google Pay</li>
              <li className='mt-1 pl-5'> Bank transfers (if supported in your region)</li>
              <li className='mt-1 pl-5'> Rest assured, your transactions are processed securely with Stripe's trusted payment infrastructure.</li>
            </p>
          )}

          <div onClick={() => toggleAccordionFAQ(1)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
            <img className='w-4 md:w-auto' src={FAQActiveIndex === 1 ? MinimumIcon : PlusIcon} alt="" /> Can I upgrade or downgrade my subscription?
          </div>
          {FAQActiveIndex === 1 && (
            <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
              <li className='mt-1'> Upgrades are always possible! You can switch to a higher-tier plan at any time, and you’ll only need to pay the difference for the remaining subscription period. </li>
              <li className='mt-1'> However, at this time, downgrades to a lower-tier plan are not allowed. We recommend carefully selecting the plan that best suits your needs. If you have any questions about which plan is right for you, feel free to contact our support team—we’re here to help! </li>
            </p>
          )}

          <div onClick={() => toggleAccordionFAQ(2)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
            <img className='w-4 md:w-auto' src={FAQActiveIndex === 2 ? MinimumIcon : PlusIcon} alt="" /> Is there a refund policy?
          </div>
          {FAQActiveIndex === 2 && (
            <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
              <li className='mt-1'> As this is a yearly subscription, we do not offer refunds once a subscription has been purchased. </li>
              <li className='mt-1'> If you’re unsure whether our application fits your needs, we highly recommend starting with our free 7 Day trial. This allows you to explore the app and understand its features before committing to a paid plan. </li>
              <li className='mt-1'> Additionally, our team is always available to answer any questions or provide guidance. Please don’t hesitate to reach out to us before subscribing if you have any doubts or need assistance. </li>
            </p>
          )}

          <div onClick={() => toggleAccordionFAQ(3)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
            <img className='w-4 md:w-auto' src={FAQActiveIndex === 3 ? MinimumIcon : PlusIcon} alt="" /> 📢 Need Help? Here’s How to Reach Us!
          </div>
          {FAQActiveIndex === 3 && (
            <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
              <li className='mt-1'> We offer multiple support options to assist you: </li>
              <li className='mt-1'> <span className='font-medium'>#optionmatrix-app Channel (For Paid Subscribers) -</span> The quickest way to get responses! If you're a paid subscriber, post your questions in the #optionmatrix-app channel for priority support and community discussions. </li>
              <li className='mt-1'> <span className='font-medium'>Support Tickets (Recommended for All Users) –</span> Non-subscribers can also DM me on Slack. If you are a paid subscriber, you can ask your questions in the #optionmatrix-app channel for quicker responses. </li>
              <li className='mt-1'> <span className='font-medium'>DMs (For Non-Subscribers) –</span> For the fastest and most reliable assistance, we recommend submitting a support ticket through the app. </li>
              <li className='mt-1'> <span className='font-medium'>Important Note:</span> Our support is strictly for application-related issues. We do not provide guidance on trading strategies or trade-related questions. </li>
              <li className='mt-1'> For the best and fastest assistance, we highly recommend using the #optionmatrix-app channel (for subscribers) or submitting a support ticket. </li>
            </p>
          )}

          <div onClick={() => toggleAccordionFAQ(4)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
            <img className='w-4 md:w-auto' src={FAQActiveIndex === 4 ? MinimumIcon : PlusIcon} alt="" /> Matrix table column discription
          </div>
          {FAQActiveIndex === 4 && (
            <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
              <li className='mt-1'> <span className='font-medium'>Level:</span> The stage or step in the trading sequence. This indicates the progression of trades in your strategy. </li>
              <li className='mt-1'> <span className='font-medium'>Contracts (20):</span> The number of contracts traded at this level. The "(20)" represent total number of contract with selected matrix. </li>
              <li className='mt-1'> <span className='font-medium'>Credit:</span> The premium or amount received from selling options at this level. </li>
              <li className='mt-1'> <span className='font-medium'>Commission:</span> The transaction fees incurred for trading the specified number of contracts at this level. </li>
              <li className='mt-1'> <span className='font-medium'>BP (Buying Power):</span> The capital required to execute trades at this level, reflecting the buying power used. </li>
              <li className='mt-1'> <span className='font-medium'>Profit:</span> The gain from this trade level after accounting for credit, commission, and any other fees. </li>
              <li className='mt-1'> <span className='font-medium'>Loss:</span> The amount lost at this level if the trade moves against you. </li>
              <li className='mt-1'> <span className='font-medium'>Cumulative Loss:</span> The total loss accumulated up to this level, including losses from previous levels. </li>
              <li className='mt-1'> <span className='font-medium'>Series Gain/Loss:</span> The overall gain or loss in the current trade series up to this point. </li>
              <li className='mt-1'> <span className='font-medium'>After Win:</span> The expected account balance after a successful trade at this level. </li>
              <li className='mt-1'> <span className='font-medium'>Gain:</span> The total % gain achieved at this level. </li>
              <li className='mt-1'> <span className='font-medium'>After Loss:</span> The expected account balance after a loss at this level. </li>
              <li className='mt-1'> <span className='font-medium'>Loss:</span> The total % Loss achieved at this level. </li>
            </p>
          )}

          <div onClick={() => toggleAccordionFAQ(6)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
            <img className='w-4 md:w-auto' src={FAQActiveIndex === 6 ? MinimumIcon : PlusIcon} alt="" />  How to Save a Matrix
          </div>
          {FAQActiveIndex === 6 && (
            <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
              <li className='text-Primary font-semibold capitalize'>To save a matrix, follow these steps:</li>
              <p className='mt-1 pl-5'> <span className='font-medium'>1. Add or Select a Matrix -</span> Either add a new matrix or select an existing one from the dropdown menu next to the <span className='font-medium'> Reset</span> button. </p>
              <p className='mt-1 pl-5'> <span className='font-medium'>2. Enter Your Inputs -</span> Fill in the required values for your matrix. </p>
              <p className='mt-1 pl-5'> <span className='font-medium'>3. Click "+Save" -</span> Save your current matrix by clicking the <span className='font-medium'>"+Save"</span> button. </p>
              <p className='mt-1 pl-5'> <span className='font-medium'>4. Select the Newly Saved Matrix -</span> Choose the newly saved matrix from the dropdown menu. </p>
              <p className='mt-1 pl-5'> <span className='font-medium'>5. Select Account Side & Click "Regular" -</span> Choose the appropriate account side and click the Regular button. </p>
              <p className='mt-1 pl-5'> <span className='font-medium'>6. Save the Matrix -</span> Scroll down to the bottom of the page and click the <span className='font-medium'>"Save Matrix"</span> button. </p>
              <p className='mt-1 pl-5'> <span className='font-medium'>7. Access Saved Matrices -</span> You can retrieve your saved matrices: </p>
              <p className='mt-1 pl-5'> <span className='font-medium'>8. </span> From the Matrix Dropdown Menu next to the Reset button.</p>
              <p className='mt-1 pl-5'> <span className='font-medium'>9. </span> By navigating to the Saved Matrix module/section from the side menu.</p>
            </p>
          )}
        </div>
      )}

      <div className='flex justify-between items-center gap-5 text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-5 lg:mt-10 rounded-md bg-background6 max-w-[758px] shadow-[0px_0px_6px_0px_#28236633] cursor-pointer'
        onClick={() => toggleAccordion(1)}>
        Terms of Service <img className='w-4 lg:w-auto' src={activeIndex === 1 ? MinimumIcon : PlusIcon} alt="" />
      </div>

      {activeIndex === 1 && (
        <div className='mt-5 p-4 lg:p-[30px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
          <h3 className='text-lg lg:text-[28px] lg:leading-[42px] font-semibold text-Primary'>Terms of Service</h3>
          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>1. General Information </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>The Option Matrix app provides tools and data-driven insights designed to assist users in making informed decisions regarding SPX option trade ideas generated by the InsideOption program. By using the app, you agree to comply with these terms and conditions and acknowledge that the app is intended as a supplemental tool for evaluating trade strategies, not as a definitive source of financial advice. </p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>2. Not Financial Advice </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>The information provided by the Option Matrix app, including trade recommendations, suggested contract levels, or matrix details, is for educational and informational purposes only. </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We are not financial advisors, and the app should not be considered financial or investment advice. </p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>3. User Responsibility </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>By using the app, you acknowledge that: </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Trading options carries a high level of risk, and financial losses can occur. </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>All trades and investment decisions you make based on the app's recommendations are your sole responsibility. </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We do not guarantee profits or the accuracy of the information provided within the app. </p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>4. Pricing </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>The fees for our software services are outlined in the pricing plan selected by you. We reserve the right to change our pricing at any time with notice. </p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>5. Payment </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>You agree to pay all fees in accordance with the payment terms specified in the selected pricing plan. Failure to pay fees may result in the suspension or termination of your access to the software services. </p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>6. Refund Policy </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Once purchased and subscription plan, we do not provide any kind of refund or replacement of the subscription plan, However we are open to discuss any issues if arise.</p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>7. Non-Refundable Access </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>If you choose to discontinue your membership or are removed from the Inside Option group by the group owner (David Chau), no refunds will be issued, and your access to OptionMatrixApp will be revoked. Continued access to OptionMatrixApp is exclusively for active members of the Inside Option program. </p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>8. Prohibited Sharing </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Sharing any content from the Option Matrix app with non-subscribers is strictly prohibited. If any such activity is identified, your access will be permanently revoked, including access to future enhancements or related tools.</p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>9. Limitation of Liability </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>The creators and operators of the Option Matrix app will not be held liable for any financial losses, damages, or costs incurred as a result of using the app. </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>The app does not take into account individual financial circumstances, goals, or risk tolerance. </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>You use the app and its insights at your own risk. </p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>10. No Guarantees </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>The app is designed to provide an analytical framework, but it does not guarantee that suggested trades or strategies will result in financial gains. Past performance is not indicative of future results. </p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>11. Educational Purpose </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Our goal is to provide a tool to help users understand and strategize their trades. The app is intended to complement, not replace, independent financial decision-making. </p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>12. Use of the App </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>By using the app, you agree to: </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Follow all applicable laws and regulations related to trading. </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Use the app responsibly and acknowledge that the app is one of many tools available for trade analysis. </p>

          <p className='mt-2 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>13. Updates to the Terms of Service </p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We reserve the right to update these terms at any time. Continued use of the app indicates your acceptance of any modifications to these terms. </p>
        </div>
      )}

      <div className='flex justify-between items-center gap-5 text-lg lg:text-[22px] lg:leading-[33px] font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-5 lg:mt-10 rounded-md bg-background6 max-w-[758px] shadow-[0px_0px_6px_0px_#28236633] cursor-pointer'
        onClick={() => toggleAccordion(2)}>
        Privacy Policy <img className='w-4 lg:w-auto' src={activeIndex === 2 ? MinimumIcon : PlusIcon} alt="" />
      </div>

      {activeIndex === 2 && (
        <div className='mt-5 p-4 lg:p-[30px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
          <h3 className='text-lg lg:text-[28px] lg:leading-[42px] font-semibold text-Primary'>Privacy Policy</h3>
          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>1. Introduction</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>The Option Matrix app respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect your information when you use the app. By using the app, you agree to the practices outlined in this policy.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>2. Information We Collect</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We may collect the following types of information:</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Personal Information: Name, email address, billing information, and other data you provide during account creation or payment.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Usage Data: Information about how you use the app, including IP address, device type, operating system, and interactions within the app.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Cookies and Tracking Data: Data collected via cookies or similar tracking technologies to improve app functionality and performance.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>3. How We Use Your Information</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Your information is used to:</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Provide and maintain the app’s functionality.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Process payments and manage subscriptions.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Improve app features and user experience.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Communicate with you regarding updates, support, or marketing (only if you’ve opted in).</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Ensure compliance with legal obligations and app security.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>4. Sharing of Information</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We do not sell or share your personal data with third parties, except in the following circumstances:</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Service Providers: We may share data with trusted third-party providers (e.g., Stripe for payment processing) to perform app-related services.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Legal Compliance: When required by law or in response to valid legal processes.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>5. Data Security</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We implement industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, no system can guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>6. Data Retention</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We retain your information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>7. Your Rights</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Depending on your location, you may have the following rights regarding your data:</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Access, update, or delete your personal data.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Withdraw consent for data processing (if consent was the basis of processing).</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Request a copy of the data we hold about you.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>To exercise these rights, contact us at optionmatrixapp@gmail.com.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>8. Cookies and Tracking Technologies</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We use cookies to enhance your experience, track usage data, and improve app functionality. You can manage or disable cookies through your browser settings, but doing so may impact app performance.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>9. Third-Party Links</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>The app may include links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. Please review their privacy policies before providing any personal information.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>10. Changes to This Privacy Policy</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We may update this policy periodically. Changes will be effective immediately upon posting. Continued use of the app after any changes indicates your acceptance of the updated policy.</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>11. Contact Us</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>If you have questions or concerns about this Privacy Policy, please contact us at: optionmatrixapp@gmail.com</p>

          <p className='mt-3 lg:mt-5 text-sm lg:text-lg text-Primary font-medium'>12. Data Deletion Policy</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>We respect your right to privacy and give you the option to delete your data if you decide to leave us (though we’d hate to see you go!).</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>If you wish to delete all your personal data from our system:</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Please contact us at optionmatrixapp@gmail.com.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Once we receive your request, we will delete your account and all associated data within 24 hours, unless we are required to retain certain information for legal or regulatory purposes.</p>
          <p className='mt-1 text-sm lg:text-lg text-Secondary2'>Please note that deleting your data is irreversible, and you will lose access to any services or features tied to your account.</p>
        </div>
      )}
    </div>
  );
}

export default HelpSupport;