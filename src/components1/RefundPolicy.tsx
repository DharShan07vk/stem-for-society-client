import React from "react";

const RefundPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800 leading-relaxed">

      <h1 className="text-3xl font-bold text-center mb-2">
        Refund & Cancellation Policy
      </h1>

      <p className="text-center text-sm text-gray-500 mb-6">
        STEM for Society | Effective Date: January 2025
      </p>

      <p className="mb-6">
        At STEM for Society, we strive to make every program meaningful. This policy is designed
        to be fair, transparent, and easy to understand for students and parents.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Registration Cancellation Window
      </h2>
      <p className="mb-4">
        Cancellation requests must be submitted in writing via email or registration portal before the program begins.
        Verbal or WhatsApp requests will not be processed without written confirmation.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Refund Eligibility Timeline
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><span className="font-medium">More than 14 days:</span> 100% refund</li>
        <li><span className="font-medium">3–14 days:</span> 50% refund</li>
        <li><span className="font-medium">Less than 72 hours:</span> No refund</li>
        <li><span className="font-medium">After program start:</span> No refund</li>
      </ul>
      <p className="mt-2">
        Refund is calculated based on the actual fee paid after discounts.
      </p>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Non-Refundable Conditions
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Violation of Code of Conduct</li>
        <li>No-shows without prior notice</li>
        <li>Personal scheduling conflicts after 72-hour window</li>
        <li>Partial attendance</li>
        <li>Certificate already issued</li>
        <li>Group bookings (unless entire group cancels)</li>
      </ul>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. Batch Transfer Option
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Request at least 3 days before program start</li>
        <li>Subject to seat availability</li>
        <li>₹200 fee if within 7 days of start</li>
        <li>Valid for 6 months</li>
        <li>Only one transfer allowed</li>
      </ul>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Event Cancellation by STEM
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>100% refund within 7 working days OR</li>
        <li>Full credit for future program (valid 12 months)</li>
      </ul>
      <p className="mt-2">
        Participants will be notified at least 48 hours before start where possible.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Force Majeure
      </h2>
      <p className="mb-4">
        In events beyond control (natural disasters, government rules, etc.), credit valid for 12 months will be issued.
        Refunds may be considered case-by-case.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Refund Processing Timeline
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><span className="font-medium">UPI/Card/Net Banking:</span> 5–7 working days</li>
        <li><span className="font-medium">Program Credit:</span> Immediate</li>
        <li><span className="font-medium">Bank Transfer (Group):</span> 7–10 working days</li>
      </ul>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Contact Support Procedure
      </h2>
      <p className="mb-2">
        Email: info@stemforsociety.in
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Include name, phone number, registration ID, and reason</li>
        <li>Response within 1 working day</li>
        <li>Resolution within 5 working days</li>
      </ul>

      <p className="mt-4">
        Support Hours: Mon–Sat, 9 AM–6 PM IST
      </p>

    </div>
  );
};

export default RefundPolicy;