import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate } from 'react-router-dom'; // Import Navigate component
import { userContext } from '../App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages/About.css'

const About = () => {
    const [userData, setUserData] = useState(null);

    // checking user is logged in or not using useContext hook

    const { state } = useContext(userContext);

    if (!state) {
        // If not logged in, redirect to the login page using Navigate component
        return <Navigate to="/login" replace />;
      }
    
      // Getting Data from Database


    const callGetData = async () => {
        try {
            const token = localStorage.getItem('jwtoken'); // get token from local storage
            const backendURL = 'http://localhost:3000'; // Backend / server URL fix 
            
            // const backendURL = 'https://shaddi.onrender.com'; // Backend / server URL fix 

            const res = await fetch(`${backendURL}/user/getData`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // declare and include Authorization token is necessary because it will fetch information from backend
                    'Access-Control-Allow-Origin': 'https://findyourperfectmatch.netlify.app', // Specify allowed origin

                },
                credentials: 'include', // it is also necessary to include credential otherwise jwtoken authorization will fail
            });

            const data = await res.json(); // Parse JSON response
            setUserData(data); // Update user state with the user property from the response

            // Handle response...
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        callGetData();
    }, []);

    return (
        <div>
            <Container>
                <h1 className="text-center mt-5 mb-4">User Profile</h1>

                {userData && (
                    <>
                        <Card className="mb-4">
                            <Card.Body>
                                <Row>
                                    <Col md={12} className='text-center mb-5'>
                                        <h3 className="gradient-text">Personal Photo</h3>
                                        <img src={userData.imageUrl} style={{height:'200px', width:'200px'}} />
                                       
                                    </Col>
                                    <Col md={6}>
                                        <h3 className="gradient-text">Personal Information</h3>
                                        <p><strong>Name:</strong> {userData.name}</p>
                                        <p><strong>Email:</strong> {userData.email}</p>
                                        <p><strong>Gender:</strong> {userData.gender}</p>
                                        <p><strong>Mobile Number:</strong> {userData.phone}</p>
                                        <p><strong>Alternate Mobile Number:</strong> {userData.alternateMobileNumber}</p>

                                        {/* Add more personal information fields */}
                                    </Col>
                                    <Col md={6}>
                                        <h3 className="gradient-text">Location</h3>
                                        <p><strong>Country:</strong> {userData.country}</p>
                                        <p><strong>State:</strong> {userData.state}</p>
                                        <p><strong>City:</strong> {userData.city}</p>
                                        <p><strong>Pincode:</strong> {userData.pincode}</p>
                                        {/* Add more location fields */}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <h3 className="gradient-text">Additional Information</h3>
                                        <p><strong>Date of Birth:</strong> {userData.dob}</p>
                                        <p><strong>Community:</strong> {userData.community}</p>
                                        <p><strong>Caste:</strong> {userData.caste}</p>
                                        {/* Add more additional information fields */}
                                    </Col>
                                    <Col md={6}>
                                        <h3 className="gradient-text">Work and Income</h3>
                                        <p><strong>Professional Status:</strong> {userData.professionalStatus}</p>
                                        <p><strong>Work:</strong> {userData.work}</p>
                                        <p><strong>Salary:</strong> {userData.salary} $</p>
                                        {/* Add more work and income fields */}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className='mb-4  mt-2'>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <h3 className="gradient-text">Food Data</h3>
                                        <p><strong>Food Type:</strong> {userData.food}</p>
                                        <p><strong>Drink:</strong> {userData.drink}</p>
                                        <p><strong>Smoke:</strong> {userData.smoke}</p>
                                        {/* Add more additional information fields */}
                                    </Col>

                                    <Col md={6}>
                                        <h3 className="gradient-text">Body Data</h3>
                                        <p><strong>Face Color:</strong> {userData.bodyColor}</p>
                                        <p><strong>Height:</strong> {userData.height} CM</p>
                                        <p><strong>Weight:</strong> {userData.weight} CM</p>

                                        {/* Add more additional information fields */}
                                    </Col>

                                </Row>
                            </Card.Body>
                        </Card>

                    </>
                )}
            </Container>
        </div>
    )
}

export default About
