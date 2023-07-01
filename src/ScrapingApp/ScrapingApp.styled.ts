import styled from "styled-components";

export const ScrappingAppWrapper = styled.div`
height: 100vh;
width: 100vw;
text-align: center;
background-color: #f2f7ff;
font-family: sans-serif;
overflow: hidden;
display: flex;
flex-direction: column;

h1,
.resultsWrapper > h2 {
  text-align: center;
}

.app-title {
  position: relative;
  padding: 16px 0;
  color: #2c3e50;
  h1 {
    margin: 0;
  }

  button {
    position: absolute;
    top: 24px;
    right: 16px;
  }
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  justify-content: space-around;
  justify-items: center;
  align-items: center;

  & > input {
    width: 50%;
    justify-self: center;
  }

  .input-field {
    height: 100%;
    padding-bottom: 0;
    padding-top: 0;
  }

  .link-input-wrapper {
    height: 30px;
    display: flex;
    align-items: center;

    button {
      height: 28px;
      margin-left: 8px;
    }
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: 10px;

    .current-page {
      pointer-events: none;
      border: 1px solid #2c3e50;
      color: #2c3e50;
      font-weight: bold;
      margin: 8px;
      height: 32px;
      width: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button {
      height: 28px;
      align-content: center;
      padding: 0px 10px;
      width: 140px;
    }
  }
}

.resultsWrapper {
  display: flex;
  flex-direction: column;
  height: inherit;
  padding: 0 8px;

  .loader {
    padding-top: 40px;
    display: flex;
    width: 100vw;
    justify-content: center;
  }

  .not-found {
    padding-top: 40px;
    font-size: 32px;
    font-weight: bolder;
    /* text-align: center; */
  }

  h2 {
    color: #2c3e50;
  }

  .table-titles {
    font-size: 20px;
    display: flex;
    padding: 8px 8px;
    border-bottom: 1px solid #2c3e50;
    font-weight: bold;

    .img {
      margin-right: 20px;
      width: 140px;
    }

    .titles-container {
      // copy of row values

      width: calc(100% - 156px);
      grid-template-columns: 40% 20% 40%;
      display: grid;
      align-items: center;
      justify-content: space-between;
      /* padding: 8px 16px; */
    }
  }
}
`;
