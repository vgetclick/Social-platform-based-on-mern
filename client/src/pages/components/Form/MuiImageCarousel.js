import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Box } from "@mui/material";

const images = [
  "https://picsum.photos/800/600?random=1",
  "https://picsum.photos/800/600?random=2",
  "https://picsum.photos/800/600?random=3",
  "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg",
  "https://images.pexels.com/photos/371589/pexels-photo-371589.jpeg"
];


const MuiBackgroundCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true
  };

  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
      <Slider {...settings}>
        {images.map((img, index) => (
          <Box
            key={index}
            sx={{
              width: "100%",
              height: "100vh",
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        ))}
      </Slider>
    </Box>
  );
};

export default MuiBackgroundCarousel;
