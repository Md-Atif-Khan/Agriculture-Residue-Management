import React, { useEffect, useState } from "react";
import DeepContext from "./DeepContext";
import axios from "axios";
const DeepState = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setalert] = useState(null);
  const [EndObject, setEndObject] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      // Check for token in localStorage
      if (localStorage.token) {
        try {
          // Set axios auth header
          axios.defaults.headers.common['x-auth-token'] = localStorage.token;
          
          // Additionally verify with backend
          try {
            const res = await axios.get('/api/auth/me');            
            // Ensure we have the correct user type from the backend
            if (res.data.user && res.data.userType) {
              setUser({
                ...res.data.user,
                type: res.data.userType // Use the userType from the backend response
              });
            } else {
              setUser(res.data.user);
            }
          } catch (err) {
            console.error('Error verifying token with backend:', err);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['x-auth-token'];
          }
        } catch (err) {
          console.error('Token decode error:', err);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const FullfillRequest = (element) => {
    setEndObject(element)
  }

  {
    const showAlert = (message, type) => {
      setalert({
        msg: message,
        type: type
      })

      // console.log("hello alert");
      setTimeout(() => {
        setalert(null);
      }, 3000);
    }

    return (
      <DeepContext.Provider value={{ loading, setLoading, showAlert, alert, user, setUser, EndObject, FullfillRequest }}>
        {props.children}
      </DeepContext.Provider>
    )
  }
}
export default DeepState;
