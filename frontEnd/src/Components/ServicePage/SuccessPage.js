import React from "react";
// import { Alert } from "react-bootstrap";
import Alert from "../Alert";
import './SuccessPage.css';
const SuccessPage = () => {
  return (
    <>
      <div className="container mt-5">
        <Alert>
          <Alert.Heading>Your request has been successfully accepted!</Alert.Heading>
          <p>
            Thank you for your request. Our team will review it and get back to you
            as soon as possible.
          </p>
        </Alert>

      </div>
      <div className="center">
        <button className="cssbuttons-io-button"> Get started
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
          </div>
        </button>
      </div>
    </>
  );
};

export default SuccessPage;
