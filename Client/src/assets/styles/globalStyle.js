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
  
  a, li , ul{
    text-decoration: none;
    color: inherit;
    transition: color 0.3s;
    list-style-type: none;

    cursor: pointer;   
    &:hover {
      color: ${(props) => props.theme.colors.primaryLight};
    }
  }

  button { 
    border: none;
    transition: all 0.3s;
    background-color: transparent;
    font-size: 16px;
    width: max-content;


    cursor: pointer;
    &:hover {
      color: ${(props) => props.theme.colors.primaryLight};
    }
  }

  input,textarea {
    border: 1px solid #ccc;
    font-size: 16px;
    padding: 10px;
    border-radius: 4px;
  }
`;

export default GlobalStyle;
