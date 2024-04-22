import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import banner1 from "../assets/banner_Img/banner1.jpg";
import banner2 from "../assets/banner_Img/banner2.jpg";
import banner3 from "../assets/banner_Img/banner3.jpg";
import banner4 from "../assets/banner_Img/banner4.jpg";
import banner5 from "../assets/banner_Img/banner5.jpg";
import banner6 from "../assets/banner_Img/banner6.jpg";

const Carousel = () => {
  const images = [banner1, banner2, banner3, banner4, banner5, banner6];

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = images.length;

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 2500);
    return () => clearInterval(interval);
  }, [currentSlide, goToNextSlide]);

  return (
    <Wrapper>
      <Slide style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {images.map((image, index) => (
          <Img key={index} src={image} alt={`Slide ${index + 1}`} />
        ))}
      </Slide>
      <PrevButton onClick={goToPrevSlide}>이전</PrevButton>
      <NextButton onClick={goToNextSlide}>다음</NextButton>
      <BulletWrapper>
        {images.map((_, index) => (
          <Bullet
            key={index}
            className={index === currentSlide ? "active" : ""}
            onClick={() => goToSlide(index)}
          />
        ))}
      </BulletWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const Slide = styled.div`
  display: flex;
  transition: transform 0.5s ease;
`;

const Img = styled.img`
  width: 100%;
`;

const Button = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 60px;
  height: 70px;
  padding: 10px;
  cursor: pointer;
  z-index: 2;
  border: none;
`;

const PrevButton = styled(Button)`
  left: 0;
`;

const NextButton = styled(Button)`
  right: 0;
`;

const BulletWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
`;

const Bullet = styled.div`
  width: 10px;
  height: 10px;
  background-color: #333;
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  &.active {
    background-color: white;
  }
`;

export default Carousel;
