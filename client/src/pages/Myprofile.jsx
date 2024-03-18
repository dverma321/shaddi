import React, { useState, useEffect } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'material-icons/iconfont/material-icons.css';
import '../pages/Myprofile.css'


const Myprofile = () => {

  const bodyColorOptions = ['Fair', 'Medium', 'Complex', 'Light Dark', 'Dark'];

  const countryOptions = ['India', 'China', 'Pakisthan', 'Japan', 'Russia', 'North Korea', 'South Korea', 'USA', 'UK', 'Malaysia', 'Nepal', 'Africa', 'London', 'Others'];

  const professionalStatusOptions = ['Student', 'Employee', 'Freelancer', 'Other'];

  const [formData, setFormData] = useState({
    country: '',
    state: '',
    city: '',
    food: '',
    drink: '',
    smoke: '',
    bodyColor: '',
    height: '',
    weight: '',
    professionalStatus: '',
    work: '',
    salary: '',
    caste: '',
    dob: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('jwtoken'); // get token from local storage
        const backendURL = 'http://localhost:3000'; // Backend / server URL fix

        const response = await fetch(`${backendURL}/user/getData`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // declare and include Authorization token is necessary because it will fetch information from backend
          },
          credentials: 'include', // it is also necessary to include credential otherwise jwtoken authorization will fail
        });


        const data = await response.json();

        if (response.ok) {
          setFormData({
            ...formData,

            country: data.country || '',
            state: data.state || '',
            city: data.city || '',
            food: data.food || '',
            drink: data.drink || '',
            smoke: data.smoke || '',
            bodyColor: data.bodyColor || '',
            height: data.height || '',
            weight: data.weight || '',
            professionalStatus: data.professionalStatus || '',
            work: data.work || '',
            salary: data.salary || '',
            caste: data.caste || '',
            dob: data.dob || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Handle error as needed
      }
    };

    fetchProfileData();
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem('jwtoken');
      const backendURL = 'http://localhost:3000'; // Backend URL


      const response = await fetch(`${backendURL}/user/updateProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      window.alert("Profile Updated Successfully...");
      console.log("Updated Profile Data : ", data); // Log the response data from the backend

      // Add logic to handle success or error messages as needed
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle other errors as needed
    }
  }


  // setting state for image

  const [image, setImage] = useState([]);

  // useEffect for image rendering from database

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem('jwtoken');
        const backendURL = 'http://localhost:3000'; // Backend URL for fetching image

        const response = await fetch(`${backendURL}/user/getData`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        const imageData = await response.json();

        if (response.ok) {
          setImage(imageData.image || ''); // Assuming the image URL is returned from the backend
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
        // Handle error as needed
      }
    };

    fetchProfileImage();
  }, []);

  // uploading images

  async function uploadImage(event) {
    event.preventDefault();

    const token = localStorage.getItem('jwtoken');
    const URI = 'http://localhost:3000';

    try {

      const response = await fetch(`${URI}/user/upload-image`, {
        method: 'POST',
        crossDomain: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          base64: image
        })
      })

      const data = await response.json();
      window.alert("Image Saved Successfully...");

      console.log("Image Sent Successfully", data)
      setImage({
        image: ""
      })
    }

    catch (err) {

      console.log("Image upload Error :", err)

    }

  }

  // function for choosing image

  function convertToBase64(e) {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result);
    }

    reader.onerror = (err) => {
      console.log("Image upload Error : ", err)
    }

  }


  return (
    <div className="container-fluid mt-2">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body p-5">
              <h2 className="text-uppercase text-center mb-5">Update Profile For Perfect Match</h2>

              <div class="container">
                <div class="row">
                  <div class="col-md-6">

                    <div className=" d-flex justify-content-center align-items-center ">
                      {image ? <img className="img-fluid userimage" width="200" height="200" src={image} alt="Profile" /> : <div className="userimage"></div>}
                    </div>

                  </div>
                  <div class="col-md-6">
                    <div class="form-outline mb-4">
                      <label class="form-label" for="photoupload"><i class="zmdi zmdi-lock"></i> Upload Photo</label>
                      <input name="image" accept="image/*" type="file" onChange={convertToBase64} class="form-control form-control-lg" required />
                    </div>

                    <div class="d-flex justify-content-center">
                      <button class="btn btn-primary gradient-button" onClick={uploadImage}>Upload Image</button>
                    </div>


                  </div>
                </div>
              </div>

              {/* Form Data  */}




              <form method='POST' onSubmit={handleSubmit} className='register-form p-3' id='register-form'>

                <div className="row">
                  {/* Section 1: Country Data */}
                  <div className="col-md-6">
                    <div className="form-section">
                      <h3 className="text-center mb-4 gradient-text">Country Data</h3>
                      {/* ... Your Coutnry data fields */}


                      <div className="form-outline mb-4">
                        <label className="form-label">Country:</label>
                        <select className="form-select" onChange={handleInputChange} name="country" value={formData.country} >
                          <option value="" disabled>Select Country</option>
                          {countryOptions.map((country, index) => (
                            <option key={index} value={country.toUpperCase()}>{country.toUpperCase()}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="labelstate"><i className="zmdi "></i> State</label>
                        <input
                          type="text" name="state" onChange={handleInputChange} value={formData.state} id="formstate" className="form-control form-control-lg" placeholder='Enter Your State' autoComplete='off' />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="labelCity"><i className="zmdi "></i> City</label>
                        <input
                          type="text" name="city" onChange={handleInputChange} value={formData.city} id="formcity" className="form-control form-control-lg" placeholder='City' autoComplete='off' />
                      </div>

                    </div>
                  </div>

                  {/* Section 2: Appetite Data */}

                  <div className="col-md-6">
                    <div className="form-section">
                      <h3 className="text-center mb-4 gradient-text">Appetite Data</h3>


                      <div className="form-outline mb-4">
                        <label className="form-label">Food :</label>
                        <input className="m-3" type="radio" id="veg" name="food"
                          value="veg"
                          checked={formData.food === 'veg'}
                          onChange={handleRadioChange} />
                        <label htmlFor="veg">Veg</label>

                        <input className="m-3" type="radio" id="nonveg" name="food"
                          value="nonveg"
                          checked={formData.food === 'nonveg'}
                          onChange={handleRadioChange} />
                        <label htmlFor="nonveg">Non-Veg</label>
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label">Drink :</label>
                        <input className="m-3" type="radio" id="yesDrink" name="drink"
                          value="yes"
                          checked={formData.drink === 'yes'}
                          onChange={handleRadioChange} />
                        <label htmlFor="yesDrink">Yes</label>

                        <input className="m-3" type="radio" id="noDrink" name="drink"
                          value="no"
                          checked={formData.drink === 'no'}
                          onChange={handleRadioChange} />
                        <label htmlFor="noDrink">No</label>
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label">Smoke :</label>
                        <input className="m-3" type="radio" id="yesSmoke" name="smoke"
                          value="yes"
                          checked={formData.smoke === 'yes'}
                          onChange={handleRadioChange} />
                        <label htmlFor="yesSmoke">Yes</label>

                        <input className="m-3" type="radio" id="noSmoke" name="smoke"
                          value="no"
                          checked={formData.smoke === 'no'}
                          onChange={handleRadioChange} />
                        <label htmlFor="noSmoke">No</label>
                      </div>


                    </div>
                  </div>

                   {/* Section 3: Work Data */}

                   <div className="col-md-6">
                    <div className="form-section">
                      <h3 className="text-center mb-4 gradient-text">Professional Data</h3>

                      <div className="form-outline mb-4">
                        <label className="form-label">Professional Status:</label>
                        <select className="form-select" name="professionalStatus" onChange={handleInputChange} value={formData.professionalStatus} >
                          <option value="" disabled>Select Professional Status</option>
                          {professionalStatusOptions.map((status, index) => (
                            <option key={index} value={status.toLowerCase()}>{status}</option>
                          ))}
                        </select>
                      </div>


                      <div className="form-outline mb-4">
                        <label className="form-label">Work Type:</label>
                        <input className="form-control" type="text" name="work" onChange={handleInputChange} value={formData.work} />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label">Salary (in dollars):</label>
                        <input className="form-control" type="number" name="salary" onChange={handleInputChange} value={formData.salary} />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Body Data */}

                  <div className="col-md-6">
                    <div className="form-section">
                      <h3 className="text-center mb-4 gradient-text">Body Data</h3>
                      {/* ... Your body data fields */}

                      <div className="form-outline mb-4">
                        <label className="form-label">Body Color:</label>
                        <select className="form-select" name="bodyColor" onChange={handleInputChange} value={formData.bodyColor} >
                          <option value="" disabled>Select Body Color</option>
                          {bodyColorOptions.map((color, index) => (
                            <option key={index} value={color.toLowerCase()}>{color}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label">Height (in cm):</label>
                        <input className="form-control" type="number" name="height" onChange={handleInputChange} value={formData.height} />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label">Weight (in kg):</label>
                        <input className="form-control" type="number" name="weight" onChange={handleInputChange} value={formData.weight} />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label">Date of Birth:</label>
                        <input className="form-control" type="date" name="dob" onChange={handleInputChange} value={formData.dob} />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label">Caste:</label>
                        <input className="form-control" type="text" name="caste" onChange={handleInputChange} value={formData.caste} />
                      </div>


                    </div>
                  </div>

                 



                </div>

                <div className="form-outline form-group form-button text-center">
                  <input type='submit' name='updateProfile' id="updateProfile" className='btn btn-primary btn-lg gradient-button' value="Update Profile" />
                </div>

              </form>



            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Myprofile