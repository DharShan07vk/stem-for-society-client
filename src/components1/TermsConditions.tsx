import React from "react";

const TermsConditions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800 leading-relaxed">

      <h1 className="text-3xl font-bold text-center mb-2">
        Terms & Conditions
      </h1>

      <p className="text-center text-sm text-gray-500 mb-6">
        STEM for Society | Effective Date: January 2026
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Acceptance of Terms
      </h2>
      <p className="mb-4">
        By using STEM for Society services, you agree to these Terms. If enrolling for a minor,
        you confirm you are the parent/guardian and accept these terms on their behalf.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Eligibility
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Open to Class 6–12 students, college students, and early career learners</li>
        <li>Users under 18 require parental consent</li>
        <li>STEM may verify eligibility and reject registrations</li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        3. Services Offered
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Summer schools and short-term programs</li>
        <li>Career awareness and life skills workshops</li>
        <li>Networking and mentorship sessions</li>
        <li>Certification programs</li>
        <li>Career bootcamps and skill cohorts</li>
      </ul>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        4. User Responsibilities
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Provide accurate information</li>
        <li>Attend sessions and behave respectfully</li>
        <li>Do not share login credentials or materials</li>
        <li>Maintain proper internet connectivity</li>
      </ul>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        5. Intellectual Property Rights
      </h2>
      <p className="mb-4">
        All content belongs to STEM for Society. You may not reproduce or distribute it without permission.
        Personal notes and assignments remain your property.
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        6. Payments & Pricing
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>All fees are in INR</li>
        <li>Full payment required before program start</li>
        <li>Pricing may change for future batches</li>
        <li>Fees are non-transferable</li>
      </ul>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        7. Certification Disclaimer
      </h2>
      <p className="mb-2">
        Certificates are for participation and skill development only.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Not equivalent to academic degrees</li>
        <li>Requires attendance and participation</li>
        <li>No guarantee of job or admission outcomes</li>
      </ul>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        8. Code of Conduct
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>No abusive or disrespectful behavior</li>
        <li>No plagiarism or dishonesty</li>
        <li>No unauthorized sharing of content</li>
        <li>No harassment or discrimination</li>
      </ul>
      <p className="mt-2">
        Violations may result in removal without refund.
      </p>

      {/* Section 9 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        9. Platform Usage Restrictions
      </h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>For personal, non-commercial use only</li>
        <li>No scraping or downloading content</li>
        <li>No attempts to disrupt platform security</li>
      </ul>

      {/* Section 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        10. Limitation of Liability
      </h2>
      <p className="mb-4">
        STEM is not liable for indirect losses. Maximum liability is limited to the fee paid.
      </p>

      {/* Section 11 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        11. Cancellation Policy Reference
      </h2>
      <p className="mb-4">
        Refunds and cancellations follow the Refund Policy published separately.
      </p>

      {/* Section 12 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        12. Policy Updates
      </h2>
      <p className="mb-4">
        Terms may be updated periodically. Continued use means acceptance of updated terms.
      </p>

      {/* Section 13 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">
        13. Governing Law
      </h2>
      <p className="mb-6">
        Governed by the laws of India. Jurisdiction: Chennai, Tamil Nadu.
      </p>

      <p className="text-center font-medium">
        Questions? Contact: info@stemforsociety.in
      </p>

    </div>
  );
};

export default TermsConditions;