import React from 'react'
function showMore() {
    document.getElementById("more-info").classList.remove("d-none");
    document.querySelector("button.btn-primary").style.display = "none";
  }
const Aboutus = () => {
  return (
    <>
  
    <div className="container">
      <h1>About Us</h1>
      <div className="row">
        <div className="col-md-6">
          <p>Welcome to our website for agricultural waste management solutions! Our team is dedicated to providing sustainable and innovative solutions to help farmers manage their waste in a responsible and environmentally friendly way. </p>
        </div>
        <div className="col-md-6">
          <p>At our core, we are committed to sustainability and reducing the environmental impact of agriculture. We believe that by working together, we can create a better future for ourselves and for the planet. Our team of experienced professionals is passionate about finding solutions that benefit both farmers and the environment.</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={showMore}>Show More</button>
      <div id="more-info" className="d-none">
        <p>We work closely with our clients to understand their unique needs and develop customized solutions that meet their specific requirements. Our team of experts is always available to provide guidance and support throughout the entire waste management process.</p>
        <p>

Thank you for visiting our website and we look forward to working with you to create a more sustainable future for agriculture.</p>
      </div>
    </div>
    </>
  )
}

export default Aboutus