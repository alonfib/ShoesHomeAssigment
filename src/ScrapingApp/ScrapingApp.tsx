import React, { useEffect, useState } from "react";
import ItemRow, { ItemRowType } from "./ItemRow/ItemRow";
import { ExtractionModel, parseHtml } from "../utils/htmlParser";
import Items from "./Items/Items";
import axios from "axios";

const INIT_URLS = [
  "https://www.amazon.com/Nike-Experience-White-Cool-Grey-Reflective-Regular/dp/B00V88DL72/",
  "https://www.ebay.com/itm/Original-Athletic-Nike-Air-Jordan-1-High-Men-Shoes-Basketball-Sneakers-Men-Sport/393064783017",
];

const extractionModel: ExtractionModel = {
  titleSelector: "productTitle",
  priceSelector: "#productPrice",
};

function ScrapingApp() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ItemRowType[]>([]);
  const [urlInputValue, setUrlInputValue] = useState<string>("");

  const loadUrls = async () => {
    setIsLoading(true)
    axios.get(`http://localhost:4000/`).then((res) => {
      setItems(res.data);
    }).finally(() => {
      setIsLoading(false)
    });
  };

  const searchItems = async () => {
    setIsLoading(true)
    axios.get(`http://localhost:4000/`, {
      params: {
        searchTerm: searchTerm 
      }
    }).then((res) => {
      setItems(res.data);
    }).finally(() => {
      setIsLoading(false)
    });
  }

  useEffect(() => {
    loadUrls();
  }, []);

  const addLink = () => {
    setIsLoading(true);
    axios.post(`http://localhost:4000/addUrl`, {url: urlInputValue}).then((res) => {
      setItems(res.data)
    }).finally(() => {
      setIsLoading(false)
    });
  }

  return (
    <div>
      <h1>Scraping Application</h1>
      <input
        type="text"
        id="newLinkInput"
        placeholder="Enter Link"
        value={urlInputValue}
        onChange={(e) => setUrlInputValue(e.target.value)}
      />
      <button onClick={() => addLink()}>Add Link</button>
      <input
        type="text"
        id="searchInput"
        placeholder="Enter search term"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={searchItems}>load urls</button>

      <h2>Search Results</h2>
      {isLoading  ? "Loading gif" : 
      <Items items={items} />
      }
    </div>
  );
}

export default ScrapingApp;
