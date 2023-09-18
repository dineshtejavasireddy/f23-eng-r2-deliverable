"use client";
import { TypographyP } from "@/components/ui/typography";

export default function GeneralTermsCond() {
  // Initially, the terms and conditions section is hidden

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">General Information</h3>
        </div>

        <div>
          <div className="flex">
            <TypographyP>
              <h3 className="text-lg font-medium">Terms and Conditions</h3>
              <p>
                Welcome to T4SG Biodiversity Hub! By accessing this website and using our services, you agree to comply
                with and be bound by the following terms and conditions:
              </p>

              <h4>User Responsibility:</h4>
              <ul>
                <li>
                  You are responsible for the accuracy and appropriateness of the content you post on the Biodiversity
                  Hub.
                </li>
                <li>Do not engage in any unlawful, harmful, or disruptive behavior on the platform.</li>
              </ul>

              <h4>Account Information:</h4>
              <ul>
                <li>You must create an account to access certain features of the website.</li>
                <li>Keep your login credentials confidential and do not share them with others.</li>
                <li>You are responsible for any activity that occurs under your account.</li>
              </ul>

              <h4>Content Posting:</h4>
              <ul>
                <li>When posting species information, ensure that it is accurate and respectful.</li>
                <li>
                  Do not post any content that infringes on the rights of others, including copyrights and trademarks.
                </li>
              </ul>

              <h4>Privacy:</h4>
              <p>
                We respect your privacy. Please review our Privacy Policy to understand how we collect, use, and protect
                your personal information.
              </p>

              <h4>Termination:</h4>
              <p>
                We reserve the right to terminate or suspend your account and access to the Biodiversity Hub if you
                violate these terms and conditions.
              </p>

              <h4>Modifications:</h4>
              <p>
                We may update or modify these terms and conditions at any time. Please check this page regularly for
                updates.
              </p>

              <h4>Disclaimer:</h4>
              <p>
                The information provided on the Biodiversity Hub is for educational purposes only. We do not guarantee
                the accuracy or completeness of the content.
              </p>

              <h4>Limitation of Liability:</h4>
              <p>
                We are not liable for any damages or losses resulting from your use of the Biodiversity Hub or its
                content.
              </p>

              <h4>Governing Law:</h4>
              <p>These terms and conditions are governed by the laws of [Your Jurisdiction].</p>

              <h4>Contact Us:</h4>
              <p>
                If you have any questions or concerns about these terms and conditions, please contact us at [Contact
                Email].
              </p>

              <p>
                By using T4SG Biodiversity Hub, you agree to these terms and conditions. If you do not agree with any
                part of these terms, please refrain from using our services. Thank you for being a part of our community
                and helping us promote biodiversity education worldwide!
              </p>
            </TypographyP>
            {/* Add any additional terms and conditions content here */}
          </div>
        </div>
      </div>
    </>
  );
}
