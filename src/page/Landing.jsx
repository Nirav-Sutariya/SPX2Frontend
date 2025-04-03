import React, { useState, useMemo, useRef, useEffect } from 'react';
import Icon1 from '../assets/Images/Landing/1.svg';
import Icon2 from '../assets/Images/Landing/2.svg';
import Icon3 from '../assets/Images/Landing/3.svg';
import Icon4 from '../assets/Images/Landing/4.svg';
import Icon5 from '../assets/Images/Landing/5.svg';
import Icon6 from '../assets/Images/Landing/6.svg';
import MenuIcon from '../assets/Images/MenuIcon.png';
import PlusIcon from '../assets/Images/Halp/PlusIcon.svg';
import MinmumIcon from '../assets/Images/Halp/MinmumIcon.svg';
import EmailIcon from '../assets/Images/Landing/EmailIcon.svg';
import TrueIcon from "../assets/Images/Subscription/TrueIcon.svg";
import FlaseIcon from "../assets/Images/Subscription/FlaseIcon.svg";
import OptionMatrixLogoIcon from '../assets/Images/Landing/OptionMatrixLogoIcon.svg';
import axios from "axios";
import { Link } from 'react-router-dom';
import { getToken, getUserId } from './login/loginAPI';

const Landing = () => {

  const menuRef = useRef(null);
  const [plan1, setPlan1] = useState("");
  const [plan2, setPlan2] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [FAQActiveIndex, setFAQActiveIndex] = useState(null);

  const toggleAccordionFAQ = (index) => {
    setFAQActiveIndex(index === FAQActiveIndex ? -1 : index); // If clicked section is active, close it
  };

  // Plan 1 Find Api 
  async function fetchPlan1() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SUBSCRIPTION, { userId: getUserId(), subscriptionPlanId: "67c18ee7467f06eec321a313" }, {
        headers: {
          'x-access-token': getToken()
        }
      });
      if (response.status === 200) {
        setPlan1(response.data.data);
      }
    } catch (error) { }
  }

  // Plan 2 Find Api
  async function fetchPlan2() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_SUBSCRIPTION, { userId: getUserId(), subscriptionPlanId: "67af0b81108e32c80e5b03a0" }, {
        headers: {
          'x-access-token': getToken()
        }
      });
      if (response.status === 200) {
        setPlan2(response.data.data);
      }
    } catch (error) { }
  }

  useMemo(async () => {
    await fetchPlan1();
    await fetchPlan2();
  }, []);

  useEffect(() => {
    fetchPlan1();
    fetchPlan2();
  }, [])

  const Close = () => {
    setMenuOpen(false);
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <>
      <div className='p-4 bg-background8 w-full'>
        <div className='flex justify-between gap-5 max-w-[1400px] mx-auto'>
          <img className='w-[190px] md:w-auto' src={OptionMatrixLogoIcon} alt="" />
          <div className='hidden md:flex items-center gap-10 lg:gap-[50px]'>
            <a href='#Pricing' className='text-base text-[#F8FCFF]'>Pricing</a>
            <a href='#Contact' className='text-base text-[#F8FCFF]'>Contact</a>
            <a href='#FAQs' className='text-base text-[#F8FCFF]'>FAQs</a>
            <Link to="/login" className='text-base text-Primary font-medium py-2 px-5 rounded-md bg-background5'>Login</Link>
          </div>
          {/* Mobile Menu Icon */}
          <button className='md:hidden text-white' onClick={() => setMenuOpen(!menuOpen)}>
            <img src={menuOpen ? MenuIcon : MenuIcon} alt="" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div ref={menuRef} className='md:hidden bg-background8 text-white w-full absolute left-0 p-4 space-y-4 shadow-lg rounded-b-lg'>
          <a href='#Pricing' className='block text-base' onClick={Close}>Pricing</a>
          <a href='#Contact' className='block text-base' onClick={Close}>Contact</a>
          <a href='#FAQs' className='block text-base' onClick={Close}>FAQs</a>
          <Link to="/login" className='block text-center text-Primary font-medium py-2 px-5 rounded-md bg-background5' onClick={Close}>Login</Link>
        </div>
      )}

      <div className='px-5 mt-10 lg:mt-[100px] mx-auto max-w-[1400px]'>
        <h2 className='text-2xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold text-center '>Option Matrix</h2>
        <p className='text-sm lg:text-lg text-Secondary3 text-center mt-1 lg:mt-3'> A dynamic, execution-focused tools that helps traders adjust in reel-time and optimize their strategy with precision. </p>
        <div className='flex justify-center mt-3 lg:mt-7'>
          <Link to="/login" className='text-base lg:text-xl font-medium text-white rounded-md py-[6px] lg:py-2 px-[30px] bg-ButtonBg'>Get Started</Link>
        </div>
      </div>

      <div className='px-5 mt-10 lg:mt-[100px] mx-auto max-w-[1400px]'>
        <h2 className='text-2xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold text-center mt-10 lg:mt-[100px]'>Key Features</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1400px] mx-auto mt-5 lg:mt-10'>
          <div className='p-5 border rounded-xl'>
            <img className='w-7 lg:w-auto' src={Icon1} alt="" />
            <h3 className='text-xl text-Primary font-medium mt-3 lg:mt-5'>Real-Time Execution Edge</h3>
            <p className='text-sm lg:text-base text-Secondary3 mt-1'>No more manual recalculations. See real-time adjustments instantly.</p>
          </div>
          <div className='p-5 border rounded-xl'>
            <img className='w-7 lg:w-auto' src={Icon2} alt="" />
            <h3 className='text-xl text-Primary font-medium mt-3 lg:mt-5'>Next Level Game Plan</h3>
            <p className='text-sm lg:text-base text-Secondary3 mt-1'>Get a clear roadmap with dynamic updates for trade adjustments and breakeven insights.</p>
          </div>
          <div className='p-5 border rounded-xl'>
            <img className='w-7 lg:w-auto' src={Icon3} alt="" />
            <h3 className='text-xl text-Primary font-medium mt-3 lg:mt-5'>Hidden Risk Revealed</h3>
            <p className='text-sm lg:text-base text-Secondary3 mt-1'>Brokers often don’t show the full picture of your P/L—we consolidate all variables for complete transparency.</p>
          </div>
          <div className='p-5 border rounded-xl'>
            <img className='w-7 lg:w-auto' src={Icon4} alt="" />
            <h3 className='text-xl text-Primary font-medium mt-3 lg:mt-5'>Live Optimization</h3>
            <p className='text-sm lg:text-base text-Secondary3 mt-1'>Adjust trades on the fly and optimize your execution in real-time.</p>
          </div>
          <div className='p-5 border rounded-xl'>
            <img className='w-7 lg:w-auto' src={Icon5} alt="" />
            <h3 className='text-xl text-Primary font-medium mt-3 lg:mt-5'>Supports SPX & RUT</h3>
            <p className='text-sm lg:text-base text-Secondary3 mt-1'>Efficiently manage Short & Long Iron Condors across SPX & RUT strategies with full control.</p>
          </div>
          <div className='p-5 border rounded-xl'>
            <img className='w-7 lg:w-auto' src={Icon6} alt="" />
            <h3 className='text-xl text-Primary font-medium mt-3 lg:mt-5'>Save Matrix Option</h3>
            <p className='text-sm lg:text-base text-Secondary3 mt-1'>Track multiple Iron Condor strategies efficiently by saving and revisiting different trading scenarios.</p>
          </div>
        </div>
      </div>

      <div id='Pricing' className='px-5 mt-10 lg:mt-[100px] mx-auto max-w-[1400px]'>
        <p className='text-base text-center'>Pricing</p>
        <h2 className='text-2xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold text-center'>Find the plan that works best for you</h2>
        <div className="text-base text-center text-white py-2 px-4 mt-1 lg:mt-3 rounded-md bg-background8">
          <span className='text-[24px] pl-2' role="img" aria-label="fire">🔥</span>
          Promotion: Use code <span className="font-semibold">SAVE10</span> for 10% off if upgrading from Trial within 7 days!
        </div>
      </div>

      <div className="grid md:flex md:flex-none justify-center gap-5 xl:gap-10 mt-4 lg:mt-[30px]">
        {/* Plan 1 */}
        <div className="flex flex-col justify-between py-[23px] max-w-[360px] w-full border border-borderColor4 rounded-md bg-background6 shadow-[0px_0px_10px_0px_#2823664D]">
          <div>
            <p className="text-base lg:text-xl font-semibold text-Primary p-[5px] lg:p-2 border border-borderColor3 rounded-md text-center w-[150px] mx-auto"> {plan1.name || "Basic"} </p>
            <p className="text-3xl lg:text-[60px] lg:leading-[70px] font-semibold text-Primary text-center mt-3"> ${Number(plan1.price).toFixed(0) || 0} </p>
            <p className="text-sm font-semibold text-Primary text-center"> User </p>
            <div className="px-5 2xl:px-10 mx-auto">
              {plan1?.features?.length > 0 && (
                plan1.features.map((feature, index) => (
                  <p key={feature.subscriptionFeatureId || index} className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                    <img src={feature.available ? TrueIcon : FlaseIcon} alt="" />  <span>{feature.name}</span>
                  </p>
                ))
              )}
              <p className="text-sm font-medium text-Primary flex items-center gap-[22px] mt-3">
                <img src={plan1.recordLimit === 0 ? FlaseIcon : TrueIcon} alt="" /> Allow To Save {plan1.recordLimit > 0 && (plan1.recordLimit)} Matrix
              </p>
            </div>
          </div>
          <button className="text-base lg:text-xl font-semibold text-white bg-ButtonBg py-2 lg:py-[13px] px-5 lg:px-9 text-center mt-10 w-[170px] lg:w-[229px] mx-auto rounded-md">
            Choose Plan
          </button>
        </div>

        {/* Plan 2 */}
        <div className="flex flex-col justify-between py-[25px] rounded-md max-w-[360px] w-full shadow-[0px_0px_10px_0px_#2823664D] bg-ButtonBg">
          <div>
            <p className="text-base lg:text-xl font-semibold text-white p-[5px] lg:p-2 border border-borderColor2 rounded-md text-center w-[150px] mx-auto"> {plan2.name || "Plus"} </p>
            <p className="text-3xl lg:text-[60px] lg:leading-[70px] font-semibold text-white text-center mt-3"> ${Number(plan2.price).toFixed(0) || 0} </p>
            <p className="text-sm font-semibold text-white text-center"> User/Year </p>
            <div className="px-5 2xl:px-10 mx-auto">
              {plan2?.features?.length > 0 && (
                plan2.features.map((feature, index) => (
                  <p key={feature.subscriptionFeatureId || index} className="text-sm font-medium text-white flex items-center gap-[22px] mt-3">
                    <img src={feature.available ? TrueIcon : FlaseIcon} alt="" /> <span>{feature.name}</span>
                  </p>
                ))
              )}
              <p className="text-sm font-medium text-white flex items-center gap-[22px] mt-3">
                <img src={plan2.recordLimit === 0 ? FlaseIcon : TrueIcon} alt="" /> Allow To Save {plan2.recordLimit > 0 && (plan2.recordLimit)} Matrix
              </p>
            </div>
          </div>
          <div className="grid">
            <p className="text-xs font-medium text-[#B7D1E0] text-center mt-7 px-5">
              *The subscription will be billed on a yearly basis.
            </p>
            <button className="text-base lg:text-xl font-semibold text-Primary bg-background5 py-2 mt-[10px] lg:py-[13px] px-5 lg:px-9 text-center w-[170px] lg:w-[229px] mx-auto rounded-md">
              Choose Plan
            </button>
          </div>
        </div>

      </div>

      <div id='FAQs' className='px-5 mt-10 lg:mt-[100px] mx-auto max-w-[1400px]'>
        <p className='text-base text-center'>FAQs</p>
        <h2 className='text-2xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold text-center'>Everything you need to know</h2>
      </div>

      <div className='mt-5 lg:mt-10 mx-auto p-5 lg:p-[30px] rounded-md bg-background3 max-w-[1400px]'>
        <div onClick={() => toggleAccordionFAQ(0)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
          <img className='w-4 lg:w-auto' src={FAQActiveIndex === 0 ? MinmumIcon : PlusIcon} alt="" /> Mechanics of Short Iron condor
        </div>
        {FAQActiveIndex === 0 && (
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

        <div onClick={() => toggleAccordionFAQ(1)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
          <img className='w-4 lg:w-auto' src={FAQActiveIndex === 1 ? MinmumIcon : PlusIcon} alt="" /> What Payment Methods Are Accepted?
        </div>
        {FAQActiveIndex === 1 && (
          <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
            <li className='text-Primary font-semibold'>We accept all major payment methods supported by Stripe, including:</li>
            <li className='mt-1 pl-5'>Digital wallets like Apple Pay and Google Pay</li>
            <li className='mt-1 pl-5'> Bank transfers (if supported in your region)</li>
            <li className='mt-1 pl-5'> Rest assured, your transactions are processed securely with Stripe's trusted payment infrastructure.</li>
          </p>
        )}

        <div onClick={() => toggleAccordionFAQ(2)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
          <img className='w-4 lg:w-auto' src={FAQActiveIndex === 2 ? MinmumIcon : PlusIcon} alt="" /> Can I upgrade or downgrade my subscription?
        </div>
        {FAQActiveIndex === 2 && (
          <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
            <li className='mt-1'> Upgrades are always possible! You can switch to a higher-tier plan at any time, and you’ll only need to pay the difference for the remaining subscription period. </li>
            <li className='mt-1'> However, at this time, downgrades to a lower-tier plan are not allowed. We recommend carefully selecting the plan that best suits your needs. If you have any questions about which plan is right for you, feel free to contact our support team—we’re here to help! </li>
          </p>
        )}

        <div onClick={() => toggleAccordionFAQ(3)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
          <img className='w-4 lg:w-auto' src={FAQActiveIndex === 3 ? MinmumIcon : PlusIcon} alt="" /> Is there a refund policy?
        </div>
        {FAQActiveIndex === 3 && (
          <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
            <li className='mt-1'> As this is a yearly subscription, we do not offer refunds once a subscription has been purchased. </li>
            <li className='mt-1'> If you’re unsure whether our application fits your needs, we highly recommend starting with our free 7 Day trial. This allows you to explore the app and understand its features before committing to a paid plan. </li>
            <li className='mt-1'> Additionally, our team is always available to answer any questions or provide guidance. Please don’t hesitate to reach out to us before subscribing if you have any doubts or need assistance. </li>
          </p>
        )}

        <div onClick={() => toggleAccordionFAQ(4)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
          <img className='w-4 lg:w-auto' src={FAQActiveIndex === 4 ? MinmumIcon : PlusIcon} alt="" /> Need Help? Here’s How to Reach Us!
        </div>
        {FAQActiveIndex === 4 && (
          <p className='text-sm lg:text-lg text-Secondary2 py-3 lg:py-5 px-4 lg:px-[30px] mt-3 rounded-lg bg-background6 shadow-[2px_0px_4px_0px_#21212133]'>
            <li className='mt-1'> We offer multiple support options to assist you: </li>
            <li className='mt-1'> <span className='font-medium'>#optionmatrix-app Channel (For Paid Subscribers) -</span> The quickest way to get responses! If you're a paid subscriber, post your questions in the #optionmatrix-app channel for priority support and community discussions. </li>
            <li className='mt-1'> <span className='font-medium'>Support Tickets (Recommended for All Users) –</span> Non-subscribers can also DM me on Slack. If you are a paid subscriber, you can ask your questions in the #optionmatrix-app channel for quicker responses. </li>
            <li className='mt-1'> <span className='font-medium'>DMs (For Non-Subscribers) –</span> For the fastest and most reliable assistance, we recommend submitting a support ticket through the app. </li>
            <li className='mt-1'> <span className='font-medium'>Important Note:</span> Our support is strictly for application-related issues. We do not provide guidance on trading strategies or trade-related questions. </li>
            <li className='mt-1'> For the best and fastest assistance, we highly recommend using the #optionmatrix-app channel (for subscribers) or submitting a support ticket. </li>
          </p>
        )}

        <div onClick={() => toggleAccordionFAQ(5)} className='flex items-center gap-3 lg:gap-6 text-base lg:text-xl font-medium text-Primary py-3 lg:py-5 px-4 lg:px-[30px] mt-3 border border-borderColor rounded-md bg-background5 shadow-[0px_0px_6px_0px_#28236633] cursor-pointer capitalize'>
          <img className='w-4 lg:w-auto' src={FAQActiveIndex === 5 ? MinmumIcon : PlusIcon} alt="" /> Matrix table column discription
        </div>
        {FAQActiveIndex === 5 && (
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
          <img className='w-4 lg:w-auto' src={FAQActiveIndex === 6 ? MinmumIcon : PlusIcon} alt="" />  How to Save a Matrix
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

      <div id='Contact' className='flex flex-wrap justify-center items-center gap-5 lg:gap-10 px-5 mt-10 lg:mt-[100px] mx-auto max-w-[1400px]'>
        <h2 className='text-2xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'>Get In Touch With Us</h2>
        <div className='flex items-center gap-5'>
          <img className='w-9 lg:w-auto p-2 lg:px-[11px] py-[9px] rounded-md bg-background3 shadow-[0px_0px_4px_0px_#21212133]' src={EmailIcon} alt="" />
          <a href='mailto:optionmatrix.app@gmail.com' className='text-base text-Primary font-medium'>optionmatrix.app@gmail.com</a>
        </div>
      </div>

      <div className='mt-7 lg:mt-10 py-4 px-5 bg-background8 w-full'>
        <div className='flex flex-wrap justify-between items-center gap-3 max-w-[1400px] mx-auto'>
          <p className='text-sm lg:text-lg text-white'>© 2025 optionmatrix.app. All right reserved</p>
          <div className='flex items-center gap-5' >
            <Link to="/privacy-policy" className='text-sm lg:text-lg text-white'>Privacy Policy</Link>
            <Link to="/terms-of-service" className='text-sm lg:text-lg text-white'>Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
