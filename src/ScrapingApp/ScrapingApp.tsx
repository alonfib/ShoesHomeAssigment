import React, { useEffect, useState } from 'react';

const INIT_URLS = [
  "https://www.amazon.com/Nike-Experience-White-Cool-Grey-Reflective-Regular/dp/B00V88DL72/",
  "https://www.ebay.com/itm/Original-Athletic-Nike-Air-Jordan-1-High-Men-Shoes-Basketball-Sneakers-Men-Sport/393064783017"
]

function ScrapingApp() {
  const [urls, setUrls] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState([]);

  // utils func, fetch urls from db
  const fetchUrls = () => {
    // init_urls will be BE response
    setUrls(INIT_URLS)
  }

  useEffect(() => {
    fetchUrls();

  },  [])

  // Function to add a new URL for scraping
  const addUrl = () => {
    // Assuming the URL is entered in a text input field with id "urlInput"
    const newUrl = document.getElementById('urlInput')?.nodeValue;
    if(!!newUrl) {
      setUrls([...urls, newUrl]);
    }
  };

  // Function to perform text queries
  const performSearch = () => {
    // Assuming the search term is entered in a text input field with id "searchInput"
    const results = urls.filter(url => url.includes(searchTerm));

    // setSearchResults(results ??);
  };

  return (
    <div>
      <h1>Scraping Application</h1>
      
      {/* add urls to scrape input component */}
      {/* <h2>Add URLs to Scrape</h2>
      <input type="text" id="urlInput" placeholder="Enter URL" />
      <button onClick={addUrl}>Add</button>
      <h2>Perform Text Queries</h2> */}
      <input
        type="text"
        id="searchInput"
        placeholder="Enter search term"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <button onClick={performSearch}>Search</button>

      <h2>Search Results</h2>
      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default ScrapingApp;
