import React from 'react';
import { Link } from 'react-router-dom';
import BackIcon from '../assets/svg/BackIcon.svg';

const PrivacyPolicy = () => {
  return (
    <div className='max-w-7xl mx-auto p-4'>
      <div className='mt-3 lg:mt-5 p-4 lg:p-[30px] rounded-md bg-background6 shadow-[0px_0px_6px_0px_#28236633]'>
        <div className='flex items-center gap-3 lg:gap-5'>
          <Link to="/"><img className='w-3 h-5 lg:w-auto' src={BackIcon} alt="" /></Link>
          <h3 className='text-lg lg:text-[28px] lg:leading-[42px] font-semibold text-Primary'>Privacy Policy</h3>
        </div>
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
        <Link to="/"> <p className='mt-5 text-sm lg:text-lg text-Secondary2 text-center'>Back To Home</p></Link>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
