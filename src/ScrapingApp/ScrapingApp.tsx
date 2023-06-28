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
  const [urls, setUrls] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ItemRowType[]>([]);
  const [searchResults, setSearchResults] = useState<ItemRowType[]>([]);
  const [urlInputValue, setUrlInputValue] = useState<string>("");

  const loadUrls = async (initialLoad = false) => {
    setIsLoading(true)
    axios.get(`http://localhost:4000/`).then((res) => {
      setItems(res.data);
      if(initialLoad){
        setSearchResults(res.data);
      }
    }).finally(() => {
      setIsLoading(false)
    });
  };

  useEffect(() => {
    loadUrls(true);
  }, []);

  useEffect(() => {
    const filteredItems = items.filter(
      (item) => item?.title.includes(searchTerm) || item?.price.includes(searchTerm) || item?.url.includes(searchTerm)
    );
    setSearchResults(filteredItems);
  }, [searchTerm, items]);

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
      <h3>ebay.com/itm/125895348053?_trkparms=amclksrc%3DITM%26aid%3D1110006%26algo%3DHOMESPLICE.SIM%26ao%3D1%26asc%3D20200818143230%26meid%3De92038df06f741be97c716678abe23ee%26pid%3D101224%26rk%3D1%26rkt%3D5%26sd%3D125985930383%26itm%3D125895348053%26pmt%3D1%26noa%3D1%26pg%3D2047675%26algv%3DDefaultOrganicWebV9BertRefreshRanker%26brand%3DNike&_trksid=p2047675.c101224.m-1</h3>
      <input
        type="text"
        id="newLinkInput"
        placeholder="Enter Link"
        value={urlInputValue}
        onChange={(e) => setUrlInputValue(e.target.value)}
      />
      <button onClick={() => addLink()}>Add   Link</button>
      <input
        type="text"
        id="searchInput"
        placeholder="Enter search term"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => loadUrls()}>load urls</button>

      <h2>Search Results</h2>
      {isLoading  ? "Loading gif" : 
      <Items items={searchResults} />
      }
    </div>
  );
}

export default ScrapingApp;
