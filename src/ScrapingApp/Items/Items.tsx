import React from "react";
import styled from "styled-components";
import ItemRow, { ItemRowType } from "../ItemRow/ItemRow";

export type ItemType = {
  items: ItemRowType[];
  className?: string;
};

const Items = ({ items, className= "" }: ItemType) => {
  return (
    <ItemsWrapper className={className}>
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
  flex-direction: column;
  flex: 1; 
  padding-bottom: 120px;
  overflow-y: auto; 
