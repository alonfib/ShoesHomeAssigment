import React, { useState } from "react";
import Button from "../../Common/Button";
import { ItemRowWrapper } from "./ItemRow.styled";

export type ItemRowType = {
  url: string;
  title: string;
  price: string;
  imgSrc?: string;
};

const ItemRow = ({ url, title, price, imgSrc }: ItemRowType) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  console.log("imgSrc", imgSrc)

  return (
    <ItemRowWrapper>
      <div className="img">
        {imgSrc === "Image not found" ? <div className={"img-not-found"}>{imgSrc}</div> :
        <img alt="img" src={imgSrc} />
        }
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
            <Button onClick={handleCopyLink}>{isCopied ? "Copied!" : "Copy Link"}</Button>
            <a target="_blank" rel="noopener noreferrer" href={url}>
              {url}
            </a>
          </div>
        </div>
      </div>
    </ItemRowWrapper>
  );
};

export default ItemRow;