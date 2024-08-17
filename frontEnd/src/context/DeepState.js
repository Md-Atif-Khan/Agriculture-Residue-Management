
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeepContext from "./DeepContext";
import axios from "axios";
const DeepState = (props) => {
  const loginC = localStorage.getItem('loginC'); // company
  const loginF = localStorage.getItem('loginF'); //farmer
  const loginA = localStorage.getItem('loginA'); //admin

  const [user, setUser] = useState('');
  const [alert, setalert] = useState(null);
  const [loggedinC, setLoggedinC] = useState(loginC);
  const [loggedinF, setLoggedinF] = useState(loginF);
  const [loggedinA, setLoggedinA] = useState(loginA);
  const [EndObject, setEndObject] = useState("");
  const navigate = useNavigate();

  // const BaseUrl = 'http://localhost:8000'
  useEffect(() => console.log("hello", loggedinA, "Dsafsd", loggedinC, "dsfsd", loggedinF), [alert, loggedinA, loggedinC, loggedinF]);

  const LoginC = (value, state) => {
    localStorage.setItem("loginC", state);
    setLoggedinC(state);
  }

  const LoginF = (state) => {
    localStorage.setItem("loginF", state);
    setLoggedinF(state);
  }

  const LoginA = (state) => {
    localStorage.setItem("loginA", state);
    setLoggedinA(state);
  }

  const FullfillRequest = (element) => {
    setEndObject(element)
  }

  {
    const showAlert = (message, type) => {
      setalert({
        msg: message,
        type: type
      })

      console.log("hello alert");
      setTimeout(() => {
        setalert(null);
      }, 3000);
    }

    //To login into Student Account

    return (
      <DeepContext.Provider value={{ showAlert, alert, user, LoginC, loggedinC, LoginA, loggedinA, LoginF, loggedinF, setUser, EndObject, FullfillRequest }}>
        {props.children}
      </DeepContext.Provider>
    )
  }
}
export default DeepState;
