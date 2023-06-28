import React, { useEffect, useState } from "react";
import styled from "styled-components";

export type ItemRowType = {
  url: string;
  title: string;
  price: string;
};

const ItemRow = ({ url, title, price }: ItemRowType) => {
  return (
    <ItemRowWrapper>
      <div className={"titles"}>
        <div className="title">title:</div>
        <div className="value">{title}</div>
      </div>
      <div className={"price"}>
        <div className="title">price:</div>
        <div className="value">{price}</div>
      </div>
      <div className={"url"}>
        <div className="title">url:</div>
        <div className="value">{url}</div>
      </div>
    </ItemRowWrapper>
  );
};

export default ItemRow;

const ItemRowWrapper = styled.div`
  /* CSS styles */
  display: grid;
  grid-template-columns: 40% 15% 1fr;
  min-height: 80px;
  border-top: 1px solid black;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;

  div {
    margin-right: 16px;
    /* width: max-content; */
  }
`;
