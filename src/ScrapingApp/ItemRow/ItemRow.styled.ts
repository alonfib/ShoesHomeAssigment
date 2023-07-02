import styled from "styled-components";

export const ItemRowWrapper = styled.div`
  /* border-bottom: 1px solid black; */
  min-height: 80px;
  padding: 8px 16px;
  margin: 8px 4px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #2c3e50;
  box-shadow: 2px 3px 4px 0px #00000052;
  background-color: #3598db12;
  /* CSS styles */
  .titles-wrapper {
    width: calc(100% - 156px);
    grid-template-columns: 40% 20% 40%;
    display: grid;
    align-items: center;
    justify-content: space-between;

    .url {
      padding-right: 16px;
    }
  }

  .url {
    .value {
      padding-right: 8px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      a {
        padding-left: 8px;
      }

      button {
        min-width: 66px;
        font-size: 12px;
        padding-left: 4px;
        padding-right: 4px;
      }
    }
  }

  div.img {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 24px;
    min-width: 140px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: 1px solid #98c8ed;
    }
  
    .img-not-found {
      font-size: 16px;
      font-weight: inherit;    
      padding-left: 8px;
    }
  }
`;
