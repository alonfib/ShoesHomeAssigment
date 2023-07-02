import React, { useCallback, useEffect, useState } from "react";
import { ItemRowType } from "./ItemRow/ItemRow";
import Items from "./Items/Items";
import axios from "axios";
import Input from "../Common/Input";
import Button from "../Common/Button";
import PacmanLoader from "react-spinners/PacmanLoader";
import { ScrappingAppWrapper } from "./ScrapingApp.styled";

const ITEMS_LIMIT = 10;

function ScrapingApp() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<ItemRowType[]>([]);
  const [urlInputValue, setUrlInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [errorText, setErrorText] = useState<string>();
  // const [isNextPage, setIsNextPage] = useState(false);

  const loadUrls = useCallback(async (refresh = false) => {
    // Calculate the start and end index based on the current page and items per page
    setErrorText("");
    setIsLoading(true);
    try {
      const result = await axios.get("http://localhost:4000/", {
        params: {
          page: currentPage, // Pass the current page to the server
          limit: ITEMS_LIMIT, // Pass the items per page limit to the server
          searchTerm: searchTerm,
          refresh
        },
      });
      if (!result.data) {
        throw "No Data";
      }
      setItems(result.data); // Update items based on the current page
      setIsLoading(false);
    } catch (e) {
      setErrorText("Failed to fetch data");
      console.error("loadUrls returned an error ", e);
      setIsLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    loadUrls();
  }, [currentPage, searchTerm, loadUrls]);

  const addLink = async () => {
    setErrorText("");
    setIsLoading(true);
    try {
      const result = await axios.post(`http://localhost:4000/addUrl`, {
        url: urlInputValue,
        page: currentPage, // Pass the current page to the server
        limit: ITEMS_LIMIT, // Pass the items per page limit to the server
        searchTerm: searchTerm,
      });
      if (!result.data) {
        throw "No Data";
      }
      setItems(result.data); // Update items based on the current page
      setUrlInputValue("");
      setIsLoading(false);
    } catch (e) {
      setErrorText("Failed to add a link");
      console.error("addLink returned an error ", e);
      setUrlInputValue("");
      setIsLoading(false);
    }
  };

  return (
    <ScrappingAppWrapper>
      <div className="app-title">
        <h1>Scraping Application</h1>
        <Button disabled={isLoading} onClick={() => loadUrls(true)}>Refresh Data</Button>
      </div>
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
          <Button disabled={isLoading || currentPage === 1 } onClick={() => setCurrentPage(currentPage - 1)}>
            Previous Page
          </Button>
          <div className="current-page">{currentPage}</div>
          <Button disabled={isLoading  || items.length  < ITEMS_LIMIT } onClick={() => setCurrentPage(currentPage + 1)}>Next Page</Button>
        </div>
        <div className={"link-input-wrapper"}>
          <Input  disabled={isLoading} onChange={setUrlInputValue} value={urlInputValue} placeholder={"Enter link"} />
          <Button disabled={isLoading || urlInputValue.length === 0} className="link-button" onClick={() => addLink()}>
            Add Link
          </Button>
        </div>
      </div>

      <div className="resultsWrapper">
        <div className="table-titles">
          <div className="img">Image</div>
          <div className="titles-container">
            <div>Title</div>
            <div>Price</div>
            <div>Link</div>
          </div>
        </div>

        {isLoading ? (
          <div className="loader">
            <PacmanLoader color="#98c8ed" />
          </div>
        ) : items?.length > 0 ? (
          <Items items={items} />
        ) : (
          <div className="not-found">{errorText || "No Items Found"}</div>
        )}
      </div>
    </ScrappingAppWrapper>
  );
}

export default ScrapingApp;

