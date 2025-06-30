// client/src/pages/SignInPage.js
import React from "react";
import { SignIn } from "@clerk/clerk-react"; 

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <SignIn routing="path" path="/sign-in" /> 
    </div>
  );
};

export default SignInPage;