import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/ImageUploader.css'; // Import your CSS file with the styles
import { Image } from 'cloudinary-react'; // Import the Image component from cloudinary-react

const ImageUpload = () => {
  const [image, setImage] = useState(null); // State for uploading image
  const [imageSrc, setImageSrc] = useState(''); // State for fetching image
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    console.log('Frontend Image Data : ', e.target.files[0]);

    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.size > 1024 * 1024) {
      setErrorMessage('File size exceeds the limit of 1MB');
      setImage(null); // Reset image state
    } else {
      setErrorMessage(''); // Clear any existing error message
      setImage(selectedFile); // Set the selected file as the image
    }

  };



  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('file', image); // this file name will be use in upload.single('file')

    try {
      const token = localStorage.getItem('jwtoken');
      if (!token) {
        alert('No token available. Please log in.');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      // Update the URL to your backend Cloudinary upload endpoint
      const response = await axios.post('http://localhost:3000/user/cloudinaryUpload', formData, config);

      console.log('Cloudinary response:', response.data);

      alert('Image uploaded successfully');
      setImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('jwtoken');
        if (!token) {
          console.error('No token available. Please log in.');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        // Fetch the Cloudinary image URL from your backend
        const response = await axios.get('http://localhost:3000/user/cloudinaryImageData', config);
        console.log("Response for getting image : ", response);
        setImageSrc(response.data.imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, []); // Empty dependency array ensures the effect runs only once on component mount


  return (
    <div>
      <h1>Image Upload</h1>
      <form onSubmit={handleImageUpload}>
        <input type="file" onChange={handleImageChange} />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
        <button type="submit">Upload Image</button>
      </form>

      <h1>Getting Image from Cloudinary</h1>
      <div className="image-container" style={{ width: '300px', height: '200px', border: '2px solid #ccc' }}>
        {imageSrc ? (
          <Image cloudName="do4bxdztz" publicId={imageSrc} width="100%" height="100%" /> // Replace 'your_cloud_name' with your Cloudinary cloud name
        ) : (
          <p>Loading image...</p>
        )}
      </div>

    </div>
  );
};

export default ImageUpload;
