import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

interface GoogleLoginButtonProps {
  onSuccess: (response: any) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  const handleLoginSuccess = (credentialResponse: any) => {
    console.log("Login Success:", credentialResponse);
    onSuccess(credentialResponse);
  };

  const handleLoginFailure = () => {
    console.error("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
          style={{ width: "100%", maxWidth: "300px" }} // Add maxWidth to ensure it doesn't stretch too much
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
