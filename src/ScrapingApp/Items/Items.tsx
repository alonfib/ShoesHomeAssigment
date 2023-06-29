import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ItemRow, { ItemRowType } from "../ItemRow/ItemRow";

export type ItemType = {
  items: ItemRowType[];
};

const Items = ({ items }: ItemType) => {
  return (
    <ItemsWrapper>
      {!!items && items.length > 0 && items.map((item) => (
        <ItemRow
          url={item.url}
          price={item.price}
          title={item.title}
          key={item.url}
          imgSrc={item.imgSrc}
        />
      ))}
    </ItemsWrapper>
  );
};

export default Items;

const ItemsWrapper = styled.div`
  display: flex;
  width: 300;
  flex-direction: column;
  background-color: "red";
`;
