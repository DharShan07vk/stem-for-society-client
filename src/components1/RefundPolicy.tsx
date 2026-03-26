import React from "react";
import Header from "./Header";
import Footer from "./Footer";  
const RefundPolicy: React.FC = () => {
  return (
    <>
    <Header />
    <div className="bg-gray-100 py-10 px-4">

      {/* A4 Paper Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 md:p-12 leading-relaxed text-gray-800">

        {/* Header */}
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-black">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            STEM for Society | Effective Date: January 2025
          </p>
        </div>

        {/* Intro */}
        <p className="mb-6 text-justify">
          At STEM for Society, we strive to make every program meaningful.
          This policy is designed to be fair, transparent, and easy to
          understand for students and parents.
        </p>

        {/* Sections */}
        {[
          {
            title: "1. Registration Cancellation Window",
            content: (
              <p>
                Cancellation requests must be submitted in writing via email
                or registration portal before the program begins. Verbal or
                WhatsApp requests will not be processed without written
                confirmation.
              </p>
            ),
          },
          {
            title: "2. Refund Eligibility Timeline",
            content: (
              <>
                <ul className="list-disc pl-6 space-y-2">
                  <li><b>More than 14 days:</b> 100% refund</li>
                  <li><b>3–14 days:</b> 50% refund</li>
                  <li><b>Less than 72 hours:</b> No refund</li>
                  <li><b>After program start:</b> No refund</li>
                </ul>
                <p className="mt-2">
                  Refund is calculated based on the actual fee paid after discounts.
                </p>
              </>
            ),
          },
          {
            title: "3. Non-Refundable Conditions",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Violation of Code of Conduct</li>
                <li>No-shows without prior notice</li>
                <li>Personal scheduling conflicts after 72-hour window</li>
                <li>Partial attendance</li>
                <li>Certificate already issued</li>
                <li>Group bookings (unless entire group cancels)</li>
              </ul>
            ),
          },
          {
            title: "4. Batch Transfer Option",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li>Request at least 3 days before program start</li>
                <li>Subject to seat availability</li>
                <li>₹200 fee if within 7 days of start</li>
                <li>Valid for 6 months</li>
                <li>Only one transfer allowed</li>
              </ul>
            ),
          },
          {
            title: "5. Event Cancellation by STEM",
            content: (
              <>
                <ul className="list-disc pl-6 space-y-2">
                  <li>100% refund within 7 working days OR</li>
                  <li>Full credit for future program (valid 12 months)</li>
                </ul>
                <p className="mt-2">
                  Participants will be notified at least 48 hours before start where possible.
                </p>
              </>
            ),
          },
          {
            title: "6. Force Majeure",
            content: (
              <p>
                In events beyond control (natural disasters, government rules, etc.),
                credit valid for 12 months will be issued. Refunds may be considered
                case-by-case.
              </p>
            ),
          },
          {
            title: "7. Refund Processing Timeline",
            content: (
              <ul className="list-disc pl-6 space-y-2">
                <li><b>UPI/Card/Net Banking:</b> 5–7 working days</li>
                <li><b>Program Credit:</b> Immediate</li>
                <li><b>Bank Transfer (Group):</b> 7–10 working days</li>
              </ul>
            ),
          },
          {
            title: "8. Contact Support Procedure",
            content: (
              <>
                <p className="mb-2">
                  Email: info@stemforsociety.in
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Include name, phone number, registration ID, and reason</li>
                  <li>Response within 1 working day</li>
                  <li>Resolution within 5 working days</li>
                </ul>
                <p className="mt-3">
                  Support Hours: Mon–Sat, 9 AM–6 PM IST
                </p>
              </>
            ),
          },
        ].map((section, index) => (
          <div
            key={index}
            className="mb-6 p-5 border border-gray-200 rounded-lg hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              {section.title}
            </h2>
            <div className="text-gray-700 text-sm md:text-base">
              {section.content}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="border-t pt-6 mt-8 text-center">
          <p className="font-semibold text-black">
            We aim to ensure a fair and transparent experience for all participants.
          </p>
        </div>

      </div>
    </div>
      <Footer />
    </>
  );
};

export default RefundPolicy;