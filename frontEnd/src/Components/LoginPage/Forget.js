import React from 'react'

const submitForm = (e) => {
}

const Forget = () => {
  return (
    <> 
    <div className="d-flex justify-content-center">
    <div className="container animated fadeInUp">
    <h1>Forget Password</h1>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" className="form-control" id="email" placeholder="Enter your email"/>
        </div>
        <button className="btn btn-primary" onClick={submitForm}>Submit</button>
      </form>
      <div id="message" className="d-none"></div>
    </div>
    </div>
    </>
  )
}

export default Forget