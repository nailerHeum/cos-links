import React from "react";
import styled from "styled-components";
const defaultImage = require("../assets/images/default-image.png");

const replaceDefaultImag = e => {
  e.target.onerror = null;
  // todo default image로 대체
  e.target.src = defaultImage;
};

const StyledImg = styled.img`
  width: 6rem;
  height: 4rem;
  border-radius: 20%;
`;
const Image = ({ src }) => {
  return <StyledImg src={src} onError={replaceDefaultImag} />;
};

export default Image;
