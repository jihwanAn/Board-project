import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-size: 16px;
    color: ${(props) => props.theme.colors.text}; 
  }
  
  a, li {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s;

    cursor: pointer;   
    &:hover {
      color: ${(props) => props.theme.colors.primaryLight};
    }
  }

  button { 
    border: none;
    border-radius: 8px;
    transition: all 0.3s;

    cursor: pointer;
    &:hover {
      box-shadow: ${(props) => props.theme.shadows.hover};
    }
  }
`;

export default GlobalStyle;
