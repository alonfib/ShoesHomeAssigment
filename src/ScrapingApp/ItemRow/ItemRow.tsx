import React, { useEffect, useState } from "react";
import styled from "styled-components";

export type ItemRowType = {
  url: string;
  title: string;
  price: string;
  imgSrc?: string
};

const ItemRow = ({ url, title, price, imgSrc }: ItemRowType) => {
  return (
    <ItemRowWrapper>
      <div className="img">
        <img src={imgSrc} />
      </div>
      <div className={"titles-wrapper"}>
        <div className={"title"}>
          <div className="value">{title}</div>
        </div>
        <div className={"price"}>
          <div className="value">{price}</div>
        </div>
        <div className={"url"}>
          <div className="value">
            <a href={url}>{url}</a>
          </div>
        </div>
      </div>
    </ItemRowWrapper>
  );
};

export default ItemRow;

const ItemRowWrapper = styled.div`
  /* border-bottom: 1px solid black; */
  height: 80px;
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

  .url .value{
  padding-right: 8px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

  .img {
    display: flex;
    align-items: center;
    height: 100%;
    margin-right: 24px;
    
    
    img {
      width: 140px;
      height: 100%;
      border-radius: 4px;
      border: 1px solid #98c8ed;
    }
  }
`;
