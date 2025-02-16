import React from "react";
import GoogleLoginButton from "./components/GoogleLoginButton";

const App = () => {
  console.log("client id",import.meta.env.VITE_GOOGLE_CLIENT_ID);
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Resume to Portfolio Generator</h1>
      <GoogleLoginButton />
    </div>
  );
};

export default App;
