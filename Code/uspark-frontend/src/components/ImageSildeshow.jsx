// ImageSlideshow.js
import React, { useEffect, useState } from 'react';
import './css/ImageSlideshow.css'; // Ensure you have this CSS file

const images = [
  './logos/uSparl_Logo.jpeg', // Replace with your image paths
  './logos/1.jpg',
  './logos/uSparl_Logo.jpeg',
];

const ImageSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="image-slideshow">
      <div className="slideshow-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slideshow ${index}`}
            className={`slideshow-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow;