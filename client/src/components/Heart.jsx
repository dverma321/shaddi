import React, { useEffect, useState } from 'react';
import RedBalloons from '../images/red_ballons.png';
import '../components/Heart.css'; // Import the CSS file for Heart component styling

const Heart = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Function to generate falling images
    const generateFallingImages = () => {
      const newImages = [];

      // Generate five instances of red_ballons.png falling horizontally together
      for (let i = 0; i < 10; i++) {
        newImages.push({
          src: RedBalloons,
          top: `${Math.random() * 10}vh`, // Adjust top position to cover horizontally
          left: `${15 + i * 10}vw`, // Adjust left position to cover horizontally with spacing
          speed: `${Math.random() * 10 + 10}s`,
        });
      }

      // Set the state with the new images
      setImages(newImages);
    };

    // Call the generateFallingImages function
    generateFallingImages();

    // Set interval to generate new falling images every few seconds
    const interval = setInterval(generateFallingImages, 10000); // Change the interval time as needed

    // Cleanup function to clear interval
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="falling-image-container">
      {/* Render falling images */}
      {images.map((image, index) => (
        <div
          key={index}
          className="falling-image"
          style={{ backgroundImage: `url(${image.src})`, top: image.top, left: image.left, animationDuration: image.speed }}
        ></div>
      ))}
    </div>
  );
};

export default Heart;
