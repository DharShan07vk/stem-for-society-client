import Footer from "../components1/Footer";

export default function RefundPolicy() {
  return (
    <>
      <div className="w-full relative grid place-items-center my-8">
        <div className="max-w-5xl flex flex-col gap-3">
          <h1 className="text-2xl text-center font-semibold">Refund Policy</h1>
          <p className="text-justify">
            At STEM for SOCIETY, we prioritize your satisfaction with our
            courses. This policy details the rules governing refunds,
            cancellations, and rescheduling.
          </p>

          <ul className="list-decimal pl-5">
            <li>
              Scope
              <ul className="list-disc pl-5">
                <li>
                  Applies to all courses and services offered on our platform.
                </li>
              </ul>
            </li>
            <li>
              Cancellation Policy
              <ul className="list-disc pl-5">
                <li>
                  By the User:
                  <ul className="list-disc pl-5">
                    <li>
                      Self-Paced Courses: No cancellations once material is
                      accessed or downloaded.
                    </li>
                    <li>
                      Live Sessions/Workshops: Cancel up to 48 hours before the
                      start for a partial refund (see Section 3.1).
                    </li>
                    <li>
                      Subscription Plans: Cancel anytime; cancellation takes
                      effect at the end of the billing cycle.
                    </li>
                  </ul>
                </li>
                <li>
                  By STEM for SOCIETY:
                  <ul className="list-disc pl-5">
                    <li>
                      We can cancel courses due to unforeseen circumstances;
                      users will receive a full refund or can reschedule.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Refund Policy
              <ul className="list-disc pl-5">
                <li>
                  Eligibility:
                  <ul className="list-disc pl-5">
                    <li>
                      Self-Paced Courses: Refund within 7 days if material is
                      not accessed.
                    </li>
                  </ul>
                </li>
                <li>
                  Live Sessions/Workshops:
                  <ul className="list-disc pl-5">
                    <li>100% refund if cancelled over 72 hours before.</li>
                    <li>50% refund if cancelled 48 hours before.</li>
                    <li>No refund if cancelled less than 48 hours before.</li>
                  </ul>
                </li>
                <li>
                  Subscription Plans: No refunds once the billing cycle starts.
                </li>
                <li>
                  Non-Refundable Items:
                  <ul className="list-disc pl-5">
                    <li>Certification exam fees.</li>
                    <li>Administrative fees for processing payments.</li>
                    <li>Custom learning solutions.</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Rescheduling Policy
              <ul className="list-disc pl-5">
                <li>
                  User-Initiated:
                  <ul className="list-disc pl-5">
                    <li>
                      Reschedule live sessions up to 24 hours before with an
                      administrative fee as mentioned during the registration of
                      the course/session.
                    </li>
                  </ul>
                </li>
                <li>
                  By STEM for SOCIETY:
                  <ul className="list-disc pl-5">
                    <li>
                      We will promptly notify users if we need to reschedule and
                      offer alternatives or a full refund.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Refund Process
              <ul className="list-disc pl-5">
                <li>
                  Request Submission:
                  <ul className="list-disc pl-5">
                    <li>
                      Send a written refund request to [Insert Email Address]
                      with proof of purchase.
                    </li>
                  </ul>
                </li>
                <li>
                  Processing Time:
                  <ul className="list-disc pl-5">
                    <li>
                      Refunds take 7-10 business days and are issued to the
                      original payment method.
                    </li>
                  </ul>
                </li>
                <li>
                  Additional Charges:
                  <ul className="list-disc pl-5">
                    <li>Transaction fees may be deducted from the refund.</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Exclusions and Limitations
              <ul className="list-disc pl-5">
                <li>
                  Force Majeure: Refunds may not be available due to events
                  beyond our control (e.g., natural disasters).
                </li>
                <li>
                  Policy Abuse: Users abusing the policy may face account
                  suspension.
                </li>
              </ul>
            </li>
            <li>
              Governing Law
              <ul className="list-disc pl-5">
                <li>
                  This policy is governed by Indian laws. International users
                  must follow local laws.
                </li>
              </ul>
            </li>
            <li>
              Changes to the Policy
              <ul className="list-disc pl-5">
                <li>
                  We reserve the right to update this policy at any time,
                  effective upon posting on our platform. Users should review
                  periodically.
                </li>
              </ul>
            </li>
            <li>
              Contact Us
              <ul className="list-disc pl-5">
                <li>
                  For questions, reach us at:
                  <ul className="list-disc pl-5">
                    <li>STEM for SOCIETY</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}
