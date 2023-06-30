import React, { useEffect, useState } from "react";
import ItemRow, { ItemRowType } from "./ItemRow/ItemRow";
import Items from "./Items/Items";
import axios from "axios";
import Input from "../Common/Input";
import { styled } from "styled-components";
import Button from "../Common/Buton";

const ITEMS_LIMIT = 10;

function ScrapingApp() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ItemRowType[]>([]);
  const [urlInputValue, setUrlInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isNextPage, setIsNextPage] = useState(false);

  useEffect(() => {
    loadUrls();
  }, [currentPage, searchTerm]);

  const loadUrls = async () => {
    // Calculate the start and end index based on the current page and items per page
    setIsLoading(true);
    axios
      .get("http://localhost:4000/", {
        params: {
          page: currentPage, // Pass the current page to the server
          limit: ITEMS_LIMIT, // Pass the items per page limit to the server
          searchTerm: searchTerm,
        },
      })
      .then((res) => {
        setItems(res.data); // Update items based on the current page
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addLink = () => {
    setIsLoading(true);
    axios
      .post(`http://localhost:4000/addUrl`, {
        url: urlInputValue,
        page: currentPage, // Pass the current page to the server
        limit: ITEMS_LIMIT, // Pass the items per page limit to the server
        searchTerm: searchTerm,
      })
      .then((res) => {
        setItems(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ScrappingAppWrapper>
      <h1 className="app-title">Scraping Application</h1>

      <div className="actions">
        <Input
          onChange={(searchTerm) => {
            setSearchTerm(searchTerm);
          }}
          debounceDelay={1200}
          defaultValue={searchTerm}
          placeholder={"Search shoe..."}
          isSearch
        />
        <div className="pagination">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            Previous Page
          </Button>
          <div className="current-page">{currentPage}</div>
          <Button onClick={() => setCurrentPage(currentPage + 1)}>Next Page</Button>
        </div>
        <div className={"link-input-wrapper"}>
          <Input onChange={setUrlInputValue} value={urlInputValue} placeholder={"Enter link"} />
          <Button disabled={urlInputValue.length === 0} className="link-button" onClick={() => addLink()}>
            Add Link
          </Button>
        </div>
      </div>

      <div className="resultsWrapper">
        <h2>Search Results</h2>
        <div className="table-titles">
          <div className="img">image</div>
          <div className="titles-container">
            <div>title</div>
            <div>price</div>
            <div>link</div>
          </div>
        </div>
        {isLoading ? "Loading" : 
        items.length > 0 ?
        <Items items={items} />
          : <div className="not-found">No Items Found</div>
      }
      </div>
    </ScrappingAppWrapper>
  );
}

export default ScrapingApp;

const ScrappingAppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  text-align: center;
  background-color: #f2f7ff;
  font-family: sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  h1,
  .resultsWrapper > h2 {
    text-align: center;
  }

  .app-title {
    padding: 16px 0;
    margin: 0;
    color: #2c3e50
  }

  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    justify-content: space-around;
    justify-items: center;
    align-items: center;

    & > input {
      width: 50%;
      justify-self: center;
    }

    .input-field {
      height: 100%;
      padding-bottom: 0;
      padding-top: 0;
    }

    .link-input-wrapper {
      height: 30px;
      display: flex;
      align-items: center;

      button {
        height: 28px;
        margin-left: 8px;
      }
    }

    .pagination {
      display: flex;
      align-items: center;
      gap: 10px;

      .current-page {
        border: 1px solid #2c3e50;
        color: #2c3e50;
        font-weight: bold;
        margin: 8px;
        height: 32px;
        width: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button {
        height: 28px;
        align-content: center;
        padding: 0px 10px;
        width: 140px;
      }
    }
  }

  .resultsWrapper {
    display: flex;
    flex-direction: column;
    height: inherit;
    padding: 0 8px;

    .not-found {
      padding-top: 40px;
      font-size: 32px;
      font-weight: bolder;
      /* text-align: center; */
    }

    h2 {
      color: #2c3e50;
    }

    .table-titles {
      font-size: 20px;
      display: flex;
      padding: 8px 8px;
      border-bottom: 1px solid #2c3e50;
      font-weight: bold;

      .img {
        margin-right: 20px;
        width: 140px;
      }

      .titles-container {
        // copy of row values

        width: calc(100% - 156px);
        grid-template-columns: 40% 20% 40%;
        display: grid;
        align-items: center;
        justify-content: space-between;
        /* padding: 8px 16px; */
      }
    }
  }
`;
