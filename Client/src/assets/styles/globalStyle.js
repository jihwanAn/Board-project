import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* 기본 스타일 설정 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* 데스크탑 */
  body {
    font-size: 16px;
    color: ${(props) => props.theme.colors.text}; 
  }

  a, li, ul {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s;
    list-style-type: none;
    cursor: pointer;
    font-size: 1em;

    &:hover {
      color: ${(props) => props.theme.colors.primaryLight};
    }
  }

  button {
    border: none;
    transition: all 0.3s;
    background-color: transparent;
    width: max-content;
    font-size: 1em;
    cursor: pointer;

    &:hover {
      color: ${(props) => props.theme.colors.primaryLight};
    }
  }

  input, textarea {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 4px;
    font-size: 1em;
  }

  /* 테블릿, 모바일 가로 */
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }

  /* 모바일 세로 */
  @media (max-width: 480px) {
    body {
      font-size: 12px;
    }
  }
`;

export default GlobalStyle;
