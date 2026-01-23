import Footer from "../components1/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="w-full relative grid place-items-center my-8">
        <div className="max-w-5xl flex flex-col gap-3">
          <h1 className="text-2xl text-center font-semibold">Privacy Policy</h1>
          <p className="text-justify">
            STEM for SOCIETY (“we,” “our,” or “us”) is committed to safeguarding
            your privacy. This Privacy Policy outlines the types of information
            we collect, how we use it, and the measures we take to protect it in
            compliance with applicable laws, including the Information
            Technology Act, 2000, and international data protection regulations
            such as the General Data Protection Regulation (GDPR).
          </p>

          <ul className="list-decimal space-y-2 *:*:*:*:list-disc *:*:*:*:ml-5 *:*:space-y-1">
            <li>
              Information We Collect
              <ul className="">
                <li>
                  1.1 Personal Information
                  <ul>
                    <li>
                      Name, email address, phone number, and postal address.
                    </li>
                    <li>
                      Educational qualifications, professional experience, and
                      certifications.
                    </li>
                    <li>
                      Payment details such as credit/debit card information
                      (processed securely via third party payment gateways).
                    </li>
                  </ul>
                </li>
                <li>
                  1.2 Non-Personal Information
                  <ul>
                    <li>Browser type, IP address, and device information.</li>
                    <li>
                      Usage data, including pages visited, time spent on the
                      platform, and interaction data.
                    </li>
                  </ul>
                </li>
                <li>
                  1.3 Cookies and Tracking Technologies
                  <ul>
                    <li>
                      We use cookies, web beacons, and similar technologies to
                      enhance user experience and analyze website performance.
                      For more details, refer to our [Cookie Policy].
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              How We Use Your Information
              <ul>
                <li>
                  2.1 Service Delivery
                  <ul>
                    <li>
                      To provide educational content, certifications, and skill
                      development courses.
                    </li>
                    <li>
                      To manage user accounts and facilitate smooth user
                      experiences.
                    </li>
                  </ul>
                </li>
                <li>
                  2.2 Communication
                  <ul>
                    <li>
                      To send updates, promotional materials, and important
                      notices related to our services.
                    </li>
                    <li>
                      To respond to your queries and provide customer support.
                    </li>
                  </ul>
                </li>
                <li>
                  2.3 Analytics and Improvements
                  <ul>
                    <li>
                      To analyze user behavior and preferences to improve our
                      platform.
                    </li>
                    <li>
                      To develop new services, features, and functionalities.
                    </li>
                  </ul>
                </li>
                <li>
                  2.4 Legal Compliance
                  <ul>
                    <li>
                      To comply with applicable laws, regulations, and legal
                      processes.
                    </li>
                    <li>
                      To enforce our Terms and Conditions and prevent fraudulent
                      activities.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Information Sharing and Disclosure
              <ul>
                <li>
                  We do not sell or rent your personal information to third
                  parties. However, we may share your data with:
                  <ul>
                    <li>
                      3.1 Service Providers
                      <ul>
                        <li>
                          Third party vendors for payment processing, data
                          storage, and analytics.
                        </li>
                      </ul>
                    </li>
                    <li>
                      3.2 Legal Obligations
                      <ul>
                        <li>
                          Government or regulatory bodies as required by law or
                          to safeguard legal rights.
                        </li>
                      </ul>
                    </li>
                    <li>
                      3.3 Business Transfers
                      <ul>
                        <li>
                          In case of a merger, acquisition, or sale of assets,
                          your data may be transferred to the new entity.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Data Retention
              <ul>
                <li>
                  We retain your data as long as it is necessary to fulfill the
                  purposes outlined in this policy or as required by law. Upon
                  request, we will delete or anonymize your data unless we are
                  legally obligated to retain it.
                </li>
              </ul>
            </li>
            <li>
              Your Rights
              <ul>
                <li>
                  You have the following rights regarding your personal
                  information:
                  <ul>
                    <li>
                      5.1 Access and Correction
                      <ul>
                        <li>
                          You can request access to or correction of your
                          personal data.
                        </li>
                      </ul>
                    </li>
                    <li>
                      5.2 Data Portability
                      <ul>
                        <li>
                          Receive a copy of your data in a commonly used format.
                        </li>
                      </ul>
                    </li>
                    <li>
                      5.3 Deletion
                      <ul>
                        <li>
                          Request deletion of your data, subject to legal or
                          contractual obligations.
                        </li>
                      </ul>
                    </li>
                    <li>
                      5.4 Withdrawal of Consent
                      <ul>
                        <li>
                          Withdraw your consent to data processing at any time.
                        </li>
                        <li>
                          To exercise these rights, contact us at [insert
                          email].
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Security Measures
              <ul>
                <li>
                  We implement industry standard measures to protect your data,
                  including:
                  <ul>
                    <li>Encryption during data transmission.</li>
                    <li>Secure servers and restricted access.</li>
                    <li>Regular audits and updates to security practices.</li>
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
