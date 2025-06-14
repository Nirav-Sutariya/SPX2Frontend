import React, { useContext, useEffect, useMemo, useState, useRef } from 'react';
import PlusIcon from '../assets/svg/PlusIcon.svg';
import DropdownIcon from '../assets/svg/DropdownIcon.svg';
import DeleteIcon from '../assets/Images/Setting/DeleteIcon.svg';
import SubscriptionUpdateIcon from '../assets/Images/Subscription/SubscriptionUpdateIcon.svg';
import axios from 'axios';
import { AppContext } from '../components/AppContext';
import { getToken, getUserId } from '../page/login/loginAPI';
import { ConfirmationModal2 } from '../components/utils';

function PlainDisplay({ plan, setPlan, plainId, featureOptions }) {

  const planNameRef = useRef(null);
  const saveLimitRef = useRef(null);
  const planAmountRef = useRef(null);
  const [msg, setMsg] = useState({ type: "", msg: "", });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  async function updatePlan(plan) {
    const planFrom = {
      userId: getUserId(),
      name: plan.name,
      subscriptionId: plan._id,
      price: plan.price,
      recordLimit: plan.recordLimit,
      features: plan.features.map(feature => ({
        subscriptionFeatureId: feature.keys,
        available: feature.available
      }))
    }

    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_UPDATE_SUBSCRIPTION_URL, { ...planFrom }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setMsg({ type: "info", msg: 'Plan Updated successfully...' });
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: 'Could not connect to the server. Please check your connection.' });
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "Something went wrong";
        setMsg({ type: "error", msg: message });
      }
    }
    setShowLogoutModal(false)
  }

  useMemo(() => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 40 * 100);
  }, [msg])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', showLogoutModal);
    return () => document.body.classList.remove('no-scroll');
  }, [showLogoutModal]);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef) {
      nextRef.current.focus();
    }
  };

  const [openIndex, setOpenIndex] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <>
      <div className='mt-5 lg:mt-10 px-5 md:px-[30px] py-5 md:py-[34px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-full'>
        <h2 className='text-base lg:text-[20px] leading-[30px] text-Primary font-medium'>{plan.name} Plan</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-4 mt-2 lg:mt-[22px]">
          <div>
            <label className="block text-sm md:text-[16px] md:leading-[30px] text-Primary font-medium">Plan Name</label>
            <input type="text" placeholder='Enter your plan name' title='Max Length 30' maxLength={30} value={plan.name}
              ref={planNameRef}
              onKeyDown={(e) => handleKeyDown(e, planAmountRef)}
              onChange={(e) => setPlan({ ...plan, name: e.target.value })}
              className="text-Primary w-full mt-2 px-3 md:px-5 py-2 md:py-[13px] text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
            />
          </div>
          <div>
            <label className="block text-sm md:text-[16px] md:leading-[30px] text-Primary font-medium">Plan Amount (yearly)</label>
            <input type="text" placeholder='Enter your plan amount' title='Max Length 7' maxLength={7} value={plan.price}
              ref={planAmountRef}
              onKeyDown={(e) => handleKeyDown(e, saveLimitRef)}
              onChange={(e) => setPlan({ ...plan, price: e.target.value })}
              className="text-Primary w-full mt-2 px-3 md:px-5 py-2 md:py-[13px] text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
            />
          </div>
          <div>
            <label className="block text-sm md:text-[16px] md:leading-[30px] text-Primary font-medium">Save Limit Count</label>
            <input type="text" placeholder='Enter your limit count' title='Max Length 5' maxLength={5} value={plan.recordLimit}
              ref={saveLimitRef}
              onChange={(e) => setPlan({ ...plan, recordLimit: e.target.value })}
              className="text-Primary w-full mt-2 px-3 md:px-5 py-2 md:py-[13px] text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
            />
          </div>
        </div>

        {/* Features Section */}
        <label className="block text-sm md:text-[16px] md:leading-[30px] text-Primary font-medium w-full max-w-[450px]">Add Features</label>
        {plan.features.map((feature, featureIndex) => (
          <div key={featureIndex} className="flex items-start gap-3">
            <div className='flex flex-wrap sm:flex-nowrap gap-2 lg:gap-5 max-w-[900px] w-full mb-3'>
              <div ref={dropdownRef} className="relative w-full max-w-[300px] sm:max-w-[300px] md:max-w-[470px] sm:mt-2">
                <div className="flex items-center justify-between text-xs md:text-sm text-Primary px-3 md:px-5 py-[10px] md:py-3 border border-borderColor rounded-md bg-textBoxBg cursor-pointer"
                  onClick={() => setOpenIndex(openIndex === featureIndex ? null : featureIndex)} >
                  {featureOptions.find(opt => opt._id === feature.keys)?.name || "Select an API/Key"}
                  <img className='w-3' src={DropdownIcon} alt="" />
                </div>

                {openIndex === featureIndex && (
                  <div className="absolute z-10 mt-1 w-full bg-background6 border border-borderColor5 rounded-md shadow-[0px_0px_6px_0px_#28236633]">
                    {featureOptions.map((option) => {
                      const isSelected = option._id === feature.keys;
                      return (
                        <div key={option._id} className={`px-4 py-2 text-xs md:text-sm text-Primary cursor-pointer hover:bg-borderColor4 hover:text-white rounded-sm ${isSelected ? 'bg-borderColor4 text-white' : ''}`}
                          onClick={() => {
                            let temp = [...plan.features];
                            temp[featureIndex].keys = option._id;
                            setPlan({ ...plan, features: temp });
                            setOpenIndex(null);
                          }}
                        >
                          {option.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center relative w-full max-w-[217px] md:max-w-[300px]">
                <div className="flex gap-2 text-xs lg:text-sm text-Primary mt-2 px-3 md:px-5 py-[10px] md:py-[13px] border border-borderColor rounded-md bg-textBoxBg w-full focus:outline-none focus:border-borderColor7">
                  <label className='flex items-center gap-1 text-xs md:text-sm text-Primary'>
                    <input className='accent-Primary' type="radio" name={`available-plain${plainId}-${featureIndex}`} value="available" checked={feature.available} onChange={() => {
                      let temp = [...plan.features];
                      temp[featureIndex].available = true;
                      setPlan({ ...plan, features: temp });
                    }}
                    />
                    Available
                  </label>
                  <label className='flex items-center gap-1 text-xs md:text-sm text-Primary'>
                    <input className='accent-Primary' type="radio" name={`available-plain${plainId}-${featureIndex}`} value="unavailable" checked={!feature.available} onChange={() => {
                      let temp = [...plan.features];
                      temp[featureIndex].available = false;
                      setPlan({ ...plan, features: temp });
                    }}
                    />
                    Unavailable
                  </label>
                </div>
              </div>
              <button className="hidden sm:block text-Primary min-w-fit" onClick={() => {
                const updatedFeatures = [...plan.features];
                updatedFeatures.splice(featureIndex, 1);
                setPlan({ ...plan, features: updatedFeatures });
              }}>
                <img className='w-5 sm:w-6 lg:w-7' src={DeleteIcon} alt="" />
              </button>
            </div>

            <button className="sm:hidden text-Primary min-w-fit mt-[14px]" onClick={() => {
              const updatedFeatures = [...plan.features];
              updatedFeatures.splice(featureIndex, 1);
              setPlan({ ...plan, features: updatedFeatures });
            }}>
              <img className='w-5 sm:w-6 lg:w-7' src={DeleteIcon} alt="" />
            </button>
          </div>
        ))}

        <span className='flex justify-end items-center w-full max-w-[770px]'>
          <button className="text-sm lg:text-base font-medium text-Primary flex items-center gap-2 lg:gap-3 mt-[10px]" onClick={() => {
            const updatedFeatures = [...plan.features];
            updatedFeatures.push({ name: "", available: true, keys: "", });
            setPlan({ ...plan, features: updatedFeatures });
          }}>
            <img className='w-[17px] lg:w-auto' src={PlusIcon} alt="" /> Feature
          </button>
        </span>

        <div className="flex justify-end mt-4 md:mt-[30px]">
          <button type="button" onClick={() => setShowLogoutModal(true)} className="text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 lg:py-[13px] lg:px-[30px] shadow-[inset_-2px_-2px_5px_0_#104566] active:shadow-[inset_2px_2px_5px_0_#104566]">
            Update
          </button>
        </div>
        {(msg.msg !== "") && <p className={`text-sm mt-2 text-end ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}.</p>}
      </div>

      <ConfirmationModal2
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => updatePlan(plan, plainId)}
        title="Update Plan Details"
        message="Are you sure you want to update your subscription plan Details?"
        icon={SubscriptionUpdateIcon}
        confirmText="Update"
      />
    </>)
}

const AdminSubscription = () => {

  const dropdownRef = useRef(null);
  const [plans, setPlans] = useState([]);
  let appContext = useContext(AppContext);
  const [errors, setErrors] = useState({});
  const [apiKeys, setApiKeys] = useState([]);
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState({ type: "", msg: "" });
  const [features, setFeatures] = useState(appContext.feature);
  const [showLogoutModal2, setShowLogoutModal2] = useState(false);
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
  const [comparisonFeatures, setComparisonFeatures] = useState(appContext.comparisonFeatures);


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
        setPlans(planData);
        appContext.setAppContext({ ...appContext, plans: planData })
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "Something went wrong";
        setMsg({ type: "error", msg: message });
      }
    }
  }

  // Update Comparison Features Api
  async function updateComparisonFeatures() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_COMPARISON_FEATURES_UPDATE, { userId: getUserId(), updateFeatures: comparisonFeatures }, {
        headers: {
          'x-access-token': getToken()
        }
      });
      if (response.status === 201) {
        setMsg({ type: "info", msg: "Comparison Features updated successfully" });
        fetchComparisonFeatures()
        setShowLogoutModal2(false);
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "Something went wrong";
        setMsg({ type: "error", msg: message });
      }
    }
  }

  // Get List Comparison Features Api
  async function fetchComparisonFeatures() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_COMPARISON_FEATURE_LIST_URL, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      });
      if (response.status === 200) {
        const data = response.data?.data;

        if (Array.isArray(data)) {
          setComparisonFeatures(data);
          appContext.setAppContext((prev) => ({
            ...prev,
            comparisonFeatures: data,
          }));
        } else {
          setComparisonFeatures([]);
        }
      }
    } catch (error) {
      if (error.message.includes('Network Error')) {
        setMsg({ type: "error", msg: "Could not connect to the server. Please check your connection." });
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "Something went wrong";
        setMsg({ type: "error", msg: message });
      }
    }
  }

  // Get Api Ket List Api
  async function getApiKey() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_API_KEY, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        setApiKeys(response.data.data || []);
      }
    } catch (error) {
      setMessage("Failed to fetch API keys.");
    }
  }

  // Gat Feature List Api
  async function getApiKeyList() {
    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_GET_FEATURES_LIST, { userId: getUserId() }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 200) {
        const features = response.data.data || [];
        setFeatures(features);
        appContext.setAppContext({ ...appContext, feature: features });
      }
    } catch (error) {
      setMessage("Failed to fetch API keys.");
    }
  }

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

  // Handle changes in feature input fields
  const handleFeatureChange = (index, field, value) => {
    setFeatures((prevFeatures) => {
      const updatedFeatures = [...prevFeatures];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
      return updatedFeatures;
    });
  };

  // Add a new feature input field
  const addFeature = () => {
    setFeatures([...features, { name: '', apiKey: '' }]);
  };

  // Create Feature Api && Validation: Check if any feature name is empty
  async function createApiKey() {
    let validationErrors = {};
    features.forEach((feature, index) => {
      if (!feature.name.trim()) {
        validationErrors[index] = "Feature name is required.";
      }
    });

    // If errors exist, update state and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let response = await axios.post(process.env.REACT_APP_SUBSCRIPTION_URL + process.env.REACT_APP_CREATE_FEATURES, { userId: getUserId(), features: features }, {
        headers: {
          'x-access-token': getToken()
        }
      })
      if (response.status === 201) {
        setMessage("Feature created/updated successfully.");
        getApiKeyList();
      }
    } catch (error) {
      setMessage("Failed to create/update features.");
    }
  }

  useMemo(async () => {
    if (msg.type !== "")
      setTimeout(() => {
        setMsg({ type: "", msg: "" })
      }, 40 * 100);
    if (plans.length === 0) {
      await fetchPlan();
    }
    if (message !== "")
      setTimeout(() => {
        setMessage("");
        setErrors({});
      }, 4000);
  }, [msg, plans])

  useMemo(() => {
    if (appContext.feature.length === 0) {
      getApiKeyList();
    }
    if (appContext.comparisonFeatures[0].name === "") {
      fetchComparisonFeatures();
    }
    getApiKey();
    getUserData();
  }, [])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', showLogoutModal2);
    return () => document.body.classList.remove('no-scroll');
  }, [showLogoutModal2]);

  // Toggle dropdown visibility
  const toggleDropdown = (index) => {
    setVisibleDropdownIndex(prev => (prev === index ? null : index));
  };

  // Close dropdown when clicked outside
  const closeDropdown = () => setVisibleDropdownIndex(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className='px-5 lg:pl-10 lg:px-6'>
      <h2 className='text-xl lg:text-[32px] lg:leading-[48px] text-Primary font-semibold'>Subscription</h2>

      {/* Create And Update Feature */}
      <div className='mt-5 lg:mt-10 px-5 md:px-[30px] py-5 md:py-[34px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-full'>
        <h2 className='text-base lg:text-[20px] leading-[30px] text-Primary font-medium'>Create Feature</h2>
        {/* Features List */}
        {features.map((feature, index) => (
          <div key={feature._id} className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-5 mb-4 mt-2 lg:mt-3 w-full max-w-[870px]">
            <div className='w-full'>
              <input
                type="text"
                value={feature.name}
                onChange={(e) => handleFeatureChange(index, 'name', e.target.value)}
                placeholder='Enter your features name'
                title='Max Length 70'
                maxLength={70}
                className="text-Primary w-full px-3 md:px-5 py-2 md:py-[13px] text-xs lg:text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7"
              />
            </div>

            <div className="relative w-full max-w-[320px] md:max-w-[250px] lg:max-w-[300px]">
              <div ref={dropdownRef} className="flex items-center justify-between text-xs lg:text-sm text-Primary px-3 md:px-5 py-2 md:py-3 border border-borderColor rounded-md bg-textBoxBg cursor-pointer" onClick={() => toggleDropdown(index)} >
                {feature.apiKey || "Select an API/Key"}
                <img className='w-3' src={DropdownIcon} alt="" />
              </div>

              {visibleDropdownIndex === index && (
                <div className="absolute z-10 w-full top-full mt-1 border border-borderColor5 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]">
                  <div className="px-4 py-2 text-xs lg:text-sm text-Primary cursor-pointer hover:bg-borderColor4 hover:text-white rounded-sm"
                    onClick={() => {
                      handleFeatureChange(index, 'apiKey', "");
                      closeDropdown();
                    }}>
                    Select an API/Key
                  </div>
                  {apiKeys.map((key, keyIndex) => {
                    const isSelected = feature.apiKey === key;
                    return (
                      <div key={keyIndex}
                        className={`px-4 py-2 text-xs lg:text-sm text-Primary cursor-pointer hover:bg-borderColor4 hover:text-white rounded-sm ${isSelected ? 'bg-borderColor4 text-white' : ''}`}
                        onClick={() => {
                          handleFeatureChange(index, 'apiKey', key);
                          closeDropdown();
                        }}>
                        {key}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {errors[index] && <p className="text-red-500 text-xs">{errors[index]}</p>}
          </div>
        ))}

        <span className='flex justify-end w-full max-w-[870px]'>
          <button className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3" onClick={addFeature}>
            <img className='w-[17px] lg:w-auto' src={PlusIcon} alt="" /> Feature
          </button>
        </span>
        <div className='flex justify-end mt-5 lg:mt-8' onClick={createApiKey}>
          <button type="button" className="text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 lg:py-[13px] lg:px-[30px] shadow-[inset_-2px_-2px_5px_0_#104566] active:shadow-[inset_2px_2px_5px_0_#104566]">
            Update
          </button>
        </div>
        {message && <p className="text-end text-sm text-Secondary2 mt-2">{message}</p>}
      </div>

      {plans.map((plan) => (
        <PlainDisplay key={plan._id} plan={plan}
          setPlan={(updatedPlan) => {
            setPlans(plans.map(p => p._id === plan._id ? updatedPlan : p));
          }}
          plainId={plan._id}
          featureOptions={features}
        />
      ))}

      <div className='mt-10 rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633] w-full'>
        <h3 className='p-3 lg:p-5 text-lg lg:text-[28px] lg:leading-[42px] text-Primary font-semibold'>Comparison Features</h3>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr>
                <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-[15px] min-w-[150px] border-r border-borderColor bg-background2">Feature</th>
                <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-[15px] min-w-[150px] border-r border-borderColor bg-background2">7 Day Trial</th>
                <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-[15px] min-w-[150px] border-r border-borderColor bg-background2">Advance Plan</th>
                <th className="text-base lg:text-[20px] lg:leading-[30px] font-semibold text-white p-2 lg:p-[15px] min-w-[150px] border-borderColor bg-background2">Premium Plan</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, index) => (
                <tr key={index}>
                  <td className='text-sm lg:text-base text-Secondary p-1 lg:p-[6px] border-y border-borderColor min-w-[250px] lg:min-w-0'>
                    <input type="text" value={feature.name} maxLength={60} title='Max Length 60' className='w-full px-3 md:px-5 py-[8px] md:py-[9px] text-xs lg:text-sm border border-borderColor rounded-md bg-textBoxBg focus:outline-none focus:border-borderColor7' onChange={(e) => {
                      const newFeatures = [...comparisonFeatures];
                      newFeatures[index].name = e.target.value;
                      setComparisonFeatures(newFeatures);
                    }}
                      placeholder="Enter Feature "
                    />
                  </td>
                  <td className='p-3 accent-Primary text-center border-y border-x border-borderColor min-w-[140px] lg:min-w-0 '>
                    <input className='w-4 lg:w-5 h-4 lg:h-5 bg-background3' type="checkbox" checked={feature.basic} onChange={() => {
                      const newFeatures = [...comparisonFeatures];
                      newFeatures[index].basic = !newFeatures[index].basic;
                      setComparisonFeatures(newFeatures);
                    }}
                    />
                  </td>
                  <td className='p-3 accent-Primary text-center border-y border-x border-borderColor min-w-[140px] lg:min-w-0'>
                    <input className='w-4 lg:w-5 h-4 lg:h-5' type="checkbox" checked={feature.plus} onChange={() => {
                      const newFeatures = [...comparisonFeatures];
                      newFeatures[index].plus = !newFeatures[index].plus;
                      setComparisonFeatures(newFeatures);
                    }}
                    />
                  </td>
                  <td className='p-3 accent-Primary text-center border-y border-borderColor min-w-[140px] lg:min-w-0'>
                    <input className='w-4 lg:w-5 h-4 lg:h-5' type="checkbox" checked={feature.premium} onChange={() => {
                      const newFeatures = [...comparisonFeatures];
                      newFeatures[index].premium = !newFeatures[index].premium;
                      setComparisonFeatures(newFeatures);
                    }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <span className='flex justify-end w-full p-3 lg:p-5'>
          <button className="text-sm lg:text-base font-medium text-Primary flex items-center gap-3" onClick={() => setComparisonFeatures([...comparisonFeatures, { name: "", basic: false, plus: false, premium: false }])}>
            <img className='w-[17px] lg:w-auto' src={PlusIcon} alt="" /> Feature
          </button>
        </span>
      </div>
      <div className='flex justify-end my-5 lg:my-8' onClick={() => setShowLogoutModal2(true)}>
        <button type="button" className="text-sm lg:text-xl font-semibold text-white bg-ButtonBg rounded-md py-2 px-4 lg:py-[13px] lg:px-[30px] shadow-[inset_-2px_-2px_5px_0_#104566] active:shadow-[inset_2px_2px_5px_0_#104566]">
          Update
        </button>
      </div>
      {(msg.msg !== "") && <p className={`text-sm mt-2 text-end ${msg.type === "error" ? "text-[#D82525]" : "text-Secondary2"}`}>{msg.msg}.</p>}

      <ConfirmationModal2
        show={showLogoutModal2}
        onClose={() => setShowLogoutModal2(false)}
        onConfirm={updateComparisonFeatures}
        title="Update Plan Details"
        message="Are you sure you want to update your subscription plan Details?"
        icon={SubscriptionUpdateIcon}
        confirmText="Update"
      />
    </div>
  );
};

export default AdminSubscription;