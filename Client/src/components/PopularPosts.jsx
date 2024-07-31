import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import URL from "../constants/url";
import CATEGORY from "../constants/category";

const PopularPosts = ({ popularPosts }) => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    arrows: false,
    draggable: false,
  };

  return (
    <Container>
      <Slider {...settings}>
        {popularPosts.map((popularPost, idx) => (
          <Slide
            key={`popular_${idx}`}
            tabIndex="-1"
            to={URL.POST_DETAIL}
            state={popularPost.id}
          >
            <div>🔥🔥🔥</div>
            <Like>+ {popularPost.like_count}</Like>
            <Category>{`[${CATEGORY[popularPost.category_id].name}]`}</Category>
            <Title>{popularPost.title}</Title>
            <NickName>{popularPost.nick_name}</NickName>
          </Slide>
        ))}
      </Slider>
    </Container>
  );
};

const Container = styled.div`
  padding: 0.1em;
  border: 2px solid #ff9c9c;
  background-color: #eee;
`;

const Slide = styled(Link)`
  display: flex !important;
  margin-left: 1.5em;
`;

const Category = styled.div`
  font-weight: bold;
`;

const Title = styled.div`
  width: 60%;
  margin-left: 0.3em;
  padding-right: 1em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Like = styled.div`
  color: #e00000;
  font-weight: bold;
  margin-right: 0.3em;
`;

const NickName = styled.div`
  color: #2c2cff;
  font-weight: bold;
`;

export default PopularPosts;
