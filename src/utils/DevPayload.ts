export default function ContextPayload() {

    if (import.meta.env.VITE_APP_MODE === "DEV") {
        const clientEmail = localStorage.getItem('email');
        const clientSubjectId = localStorage.getItem('subjectId');

        const context = {
            "sub": clientSubjectId,
            "email": clientEmail,
            "account-id": "",
            "api-id": "edjupb02ya",
            "api-key": "",
            "authorizer-principal-id": "",
            "caller": "",
            "cognito-authentication-provider": "",
            "cognito-authentication-type": "",
            "cognito-identity-id": "",
            "cognito-identity-pool-id": "",
            "http-method": "POST",
            "stage": "live",
            "user": "",
            "user-arn": "",
            "request-id": "af6159b5-0861-483d-8a18-ebc669ea3f34",
            "resource-id": "zhxskj",
            "resource-path": "/get_dropdown_config"
        }
        return context
    }
    else {
        return {}
    }
}
