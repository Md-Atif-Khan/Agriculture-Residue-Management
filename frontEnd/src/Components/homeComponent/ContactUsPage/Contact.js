import React from 'react'

function submitForm() {
    // Show the "Response Sent" messageclassName=
    document.getElementById("response-message").innerHTML = "Response Sent";
    document.getElementById("response-message").classList.remove("d-none");
    document.getElementById("response-message").classList.add("animated", "fadeInUp");
    // Add the "done" animation class to the submit button
    document.querySelector("button[type='submit']").classList.add("animated", "bounceOut");
    
    setTimeout(function(){ 
        document.getElementById("response-message").innerHTML = "";
        document.getElementById("response-message").classList.add("d-none");
        document.querySelector("button[type='submit']").classList.remove("animated", "bounceOut");
    }, 5000);
  }
const Contact = () => {
  return (
    <>
<div className="container">
      <h1>Contact Us</h1>
      <form>
        <div className="form-group">
        
        <label htmlFor="name" style={{ fontSize: '20px', fontweight: 'bold'}}>Name:</label>
          <input type="text" className="form-control" id="name"    style={{border:'2px solid black' ,
  borderradius: '25px' }}/>
        </div>
        <div className="form-group">
          <label htmlFor="email"  style={{ fontSize: '20px', fontweight: 'bold'}}>Email:</label>
          <input type="email" className="form-control" id="email"  style={{border:'2px solid black' ,
  borderradius: '25px' }}/>
        </div>
        <div className="form-group">
          <label htmlFor="message"  style={{ fontSize: '20px', fontweight: 'bold'}}>Message:</label>
          <textarea className="form-control" id="message"  style={{border:'2px solid black' ,
  borderradius: '25px' }}></textarea>
        </div>
        <button type="submit" className="btn btn-primary" onClick="submitForm()">Submit</button>
      </form>
      <div id="response-message" className="alert alert-success d-none"></div>
    </div>
    </>
  )
}


  

export default Contact