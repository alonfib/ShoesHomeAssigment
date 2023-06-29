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
          <div className="title">title:</div>
          <div className="value">{title}</div>
        </div>
        <div className={"price"}>
          <div className="title">price:</div>
          <div className="value">{price}</div>
        </div>
        <div className={"url"}>
          <div className="title">link:</div>
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
  border-top: 1px solid black;
  height: 140px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  /* CSS styles */
  .titles-wrapper {
    width: calc(100% - 156px);
    display: grid;
    grid-template-columns: 40% 20% 40%;
    align-items: center;
    justify-content: space-between;
    
    .url {
      padding-right: 16px;
    }
    div {
    margin-right: 16px;
  }
  }

  .titles-wrapper {
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
    height: 140px;
    width: 140px;
    margin-right: 24px;
    
    img {
      width: 140px;
      height: 100px;
    }
  }
`;
