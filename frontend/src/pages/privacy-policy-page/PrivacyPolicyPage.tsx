import { useScrollToTop } from "../../common/lib";



function PrivacyPolicyPage() {
    useScrollToTop();

    return (
        <div className="container-lg">
            <div className="pt-3">
                <h3>Privacy Policy</h3>
                <p>This privacy policy applies to the website CodeCapable (hereinafter referred to as "we", "us", or "our"). We respect your privacy and are committed to protecting any information you provide while using our website.</p>

                <h4>1. Information We Collect</h4>
                <p>We may collect personal information that you voluntarily provide to us when you use our website, such as your name, email address, and any other information you choose to provide.</p>

                <h4>2. Use of Information</h4>
                <p>We may use the information we collect for the following purposes:</p>
                <ul>
                    <li>To provide and maintain our services.</li>
                    <li>To notify you about changes to our services.</li>
                    <li>To communicate with you about your account or inquiries.</li>
                    <li>To personalize your experience and improve our website.</li>
                    <li>To comply with legal obligations.</li>
                </ul>

                <h4>3. Data Sharing</h4>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent. However, we may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.</p>

                <h4>4. Cookies</h4>
                <p>We use cookies to enhance your experience while using our website. You can set your browser to refuse all or some browser cookies or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.</p>

                <h4>5. Security</h4>
                <p>We implement security measures to protect the personal information we collect from unauthorized access, disclosure, alteration, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

                <h4>6. Children's Privacy</h4>
                <p>Our website is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete such information as soon as possible.</p>

                <h4>7. Your Rights</h4>
                <p>You have the right to:</p>
                <ul>
                    <li>Access, correct, or delete any personal information we have about you.</li>
                    <li>Withdraw your consent for the processing of your personal information.</li>
                    <li>Request that we restrict the processing of your personal information.</li>
                    <li>Object to our processing of your personal information.</li>
                </ul>

                <h4>8. Changes to This Privacy Policy</h4>
                <p>We reserve the right to update or change our privacy policy at any time. Any changes will be posted on this page with an updated revision date.</p>

                <h4>9. Contact Us</h4>
                <p>If you have any questions or concerns about this privacy policy, please contact us at <a href="mailto:privacy@codecapable.com">privacy@codecapable.io</a>.</p>
            </div>
        </div>
    )
}

export default PrivacyPolicyPage;