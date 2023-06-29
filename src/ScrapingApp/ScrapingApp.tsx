import React, { useEffect, useState } from "react";
import ItemRow, { ItemRowType } from "./ItemRow/ItemRow";
import Items from "./Items/Items";
import axios from "axios";
import Input from "./Input";
import { styled } from "styled-components";

function ScrapingApp() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ItemRowType[]>([]);
  const [urlInputValue, setUrlInputValue] = useState<string>("");

  const loadUrls = async () => {
    setIsLoading(true);
    axios
      .get(`http://localhost:4000/`)
      .then((res) => {
        setItems(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const searchItems = async (search = searchTerm) => {
    setIsLoading(true);
    axios
      .get(`http://localhost:4000/`, {
        params: {
          searchTerm: search,
        },
      })
      .then((res) => {
        setItems(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const addLink = () => {
    setIsLoading(true);
    axios
      .post(`http://localhost:4000/addUrl`, { url: urlInputValue })
      .then((res) => {
        setItems(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ScrappingAppWrapper>
      <h1>Scraping Application</h1>
      <div className="actions">
        <Input
          onChange={(searchTerm) => {
            setSearchTerm(searchTerm);
            searchItems(searchTerm);
          }}
          debounceDelay={1200}
          defaultValue={searchTerm}
          placeholder={"Enter search term"}
        />
        <div className={"link-input-wrapper"}>
          <Input onChange={setUrlInputValue} value={urlInputValue} placeholder={"Enter Link"} />
          <button className="link-button" onClick={() => addLink()}>Add Link</button>
        </div>
      </div>

      <h2>Search Results</h2>
      {isLoading ? "Loading" : <Items items={items} />}
    </ScrappingAppWrapper>
  );
}

export default ScrapingApp;

const ScrappingAppWrapper = styled.div`
  .actions {
    display: flex;
    width: 100%;
    justify-content: space-around;

    .link-input-wrapper  {
      display: flex;
      height: 40px;

      .link-button  {
        height: auto;
      }
    }

    
  }
`;
