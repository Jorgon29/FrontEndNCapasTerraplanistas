import privacyPolicy from "../assets/PrivacyPolicyPage.html" with {type : "text"};

function PrivacyPolicyPage() {
    return (
        <div
            className="w-full min-h-screen p-4"
            dangerouslySetInnerHTML={{ __html: privacyPolicy }}
        />
    );
}

export default PrivacyPolicyPage;