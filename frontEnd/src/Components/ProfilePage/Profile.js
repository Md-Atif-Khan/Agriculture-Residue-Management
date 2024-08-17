import React, { useContext, useState, useEffect } from 'react';
import "./Profile.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import DeepContext from "../../context/DeepContext";
const Profile = () => {
  const { user, setUser } = useContext(DeepContext);
  // const [user1, setUser1] = useState({});
  const [farmerDetails, setFarmerDetails] = useState({
    Address: '',
    // location: '',
    CropsType: '',
    LandSize: '',
  });
  // const UpdateProfile = async (e) => {
  //   e.preventDefault();
  //   if (company.password === company.cpassword) {
  //     const data = await axios.post('http://localhost:8000/SignUpCompany', {
  //       name: company.name,
  //       mobileno: company.mobileno,
  //       email: company.email,
  //       password: company.password,
  //     })
  //     // console.log(data.data);
  //     if (data.data.success) {
  //       showAlert(data.data.msg,'success');
  //       navigate('/LoginCompany')
  //     } else {
  //       showAlert(data.data.msg,'danger');
  //     }
  //   }
  //   else{
  //     alert("Password Not Matching");
  //   }

  // }


  const handleChange = (event) => {
    setFarmerDetails({
      ...farmerDetails,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(farmerDetails);
  };

  useEffect(() => {
    let u = JSON.parse(localStorage.getItem("userLogin"));
    u ? setUser(u) : setUser(null)
  }, [])

  return (
    <div className="container12 jb">
      <div className="card12">
        <div className="card-header12">
          <label>Account :</label>
          <h1>{user.name}</h1>
        </div>
        <div className="card-body12">
          <div className="form-group12">
            <label>Phone:</label>
            <p>{user.mobileno}</p>
          </div>
          <div className="form-group12">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>

          {/* <div className="form-group">
                <label>Address:</label>
                <p>{user.address}</p>
              </div>
              <div className="form-group">
                <label>Company:</label>
                <p>{user.company}</p> */}
          {/* </div> */}
          <div>
            <form onSubmit={handleSubmit}>
              <label>
                Address :
                <input className='InProfile'
                  type="text"
                  name="Address"
                  value={farmerDetails.Address}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Types  of crops:
                <input className='InProfile'
                  type="text"
                  name="CropsType"
                  value={farmerDetails.CropsType}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Land Size in (Acre):
                <input className='InProfile'
                  type="text"
                  name="LandSize"
                  value={farmerDetails.LandSize}
                  onChange={handleChange}
                />
              </label>
              <br />
              {/* <label>
          :
          <input  className='InProfile'
            type="text"
            name=""
            value={farmerDetails.cropType}
            onChange={handleChange}
          />
        </label>
        <br /> */}
              <button type="submit" className='UpdateProfile'>Update Profile</button>
            </form>
            <h2>Farmer Details:</h2>
            <p>Address: {farmerDetails.Address}</p>
            <p>Types of Crops Planted : {farmerDetails.CropsType}</p>
            <p>Land Size (in Acre): {farmerDetails.LandSize}</p>
            {/* <p>Crop Type: {farmerDetails.cropType}</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
