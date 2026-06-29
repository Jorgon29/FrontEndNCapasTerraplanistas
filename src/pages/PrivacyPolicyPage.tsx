import { useEffect, useState } from "react";

function PrivacyPolicyPage() {
    const [html, setHtml] = useState<string>("");

    useEffect(() => {
        fetch("/privacy.html")
            .then(res => res.text())
            .then(setHtml)
            .catch(console.error);
    }, []);

    return (
        <div
            className="w-full min-h-screen p-4"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default PrivacyPolicyPage;