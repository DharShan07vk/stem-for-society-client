import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800 leading-relaxed">
      
      <h1 className="text-3xl font-bold text-center mb-2">
        Privacy Policy
      </h1>

      <p className="text-center text-sm text-gray-500 mb-6">
        STEM for Society | Effective Date: January 2026
      </p>

      <p className="mb-6">
        STEM for Society ("we", "us", or "our") is committed to protecting the
        privacy and personal data of all users, including students and their
        parents or guardians. This Privacy Policy explains what information we
        collect, how we use it, and your rights as a data subject.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><span className="font-medium">Identity Information:</span> Full name, date of birth, class/grade</li>
        <li><span className="font-medium">Contact Information:</span> Email, phone number, city/state</li>
        <li><span className="font-medium">Educational Details:</span> School name, board, academic year</li>
        <li><span className="font-medium">Payment Information:</span> Transaction ID (no card data stored)</li>
        <li><span className="font-medium">Usage Data:</span> Attendance, activity, quiz responses</li>
        <li><span className="font-medium">Communications:</span> Feedback, support queries</li>
        <li><span className="font-medium">Device Data:</span> IP address, browser, cookies</li>
      </ul>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Purpose of Data Use
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Processing registrations and enrolment</li>
        <li>Delivering materials and certificates</li>
        <li>Communicating updates and schedules</li>
        <li>Improving user experience</li>
        <li>Issuing certificates and badges</li>
        <li>Handling support queries</li>
        <li>Conducting anonymised research</li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Consent for Minors
      </h2>
      <p className="mb-4">
        We require parental or guardian consent before collecting data from users under 18.
        Parents may request access, correction, or deletion of their child's data.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Data Storage & Protection
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Data stored securely on servers in India</li>
        <li>Protected using encryption (TLS/SSL)</li>
        <li>Access restricted to authorized personnel</li>
        <li>Regular security audits and backups</li>
        <li>Data retained only as necessary</li>
      </ul>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Third-Party Sharing Policy
      </h2>
      <p className="mb-2">
        We do not sell or trade your data. Limited sharing includes:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Payment Gateways (Razorpay, Instamojo)</li>
        <li>Communication Tools (Email, WhatsApp)</li>
        <li>Certificate Platforms</li>
        <li>Analytics Tools (Google Analytics - anonymised)</li>
      </ul>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Cookies Policy
      </h2>
      <p className="mb-4">
        We use essential, analytics, and preference cookies to improve your experience.
        You can disable cookies in browser settings.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Communication Consent
      </h2>
      <p className="mb-4">
        By registering, you agree to receive program-related communication via email, SMS, and WhatsApp.
      </p>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Your Rights
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Access your data</li>
        <li>Request correction</li>
        <li>Request deletion</li>
        <li>Object to processing</li>
        <li>Request data portability</li>
      </ul>

      {/* Section 9 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        9. Policy Updates
      </h2>
      <p className="mb-4">
        This policy may be updated periodically. Changes will be communicated via email or website notice.
      </p>

      {/* Section 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        10. Contact Information
      </h2>
      <p className="mb-6">
        Email: info@stemforsociety.in <br />
        Website: www.stemforsociety.in/privacy
      </p>

      <p className="mt-8 font-semibold text-center">
        STEM for Society is committed to handling your data responsibly and transparently.
      </p>

    </div>
  );
};

export default PrivacyPolicy;