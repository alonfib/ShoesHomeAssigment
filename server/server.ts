// import { Request, Response } from "express";

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");
const pLimit = require("p-limit");

const app = express();

app.use(express.json());
app.use(cors());

const ebaySelectors: ISelectors = {
  price: ".x-price-primary > span > .ux-textspans",
  title: ".x-item-title > h1 > span",
  img: ".image img",
};

const amazonSelectors: ISelectors = {
  title: "h1 > #productTitle",
  price: ".a-price > span",
  img: ".imgTagWrapper img",
};

interface ISelectors {
  title: string;
  price: string;
  img?: string;
}

interface IDataRow {
  price: string;
  title: string;
  imgSrc: string;
  url: string;
}

interface IGetItemsRequest {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

const DEFAULT_CONCURRENT_REQUESTS = 10;

let URLS_DB: string[] = [
  "https://www.amazon.com/Nike-Experience-White-Cool-Grey-Reflective-%20Regular/dp/B00V88DL72/",
  "https://www.ebay.com/itm/125985930383?hash=item1d5558bc8f:g:NEwAAOSwbrpkk5Ob&amdata=enc%3AAQAIAAAA0A77kdi0VyWSrV1QjJewIZwD4zboV2c9DH9v68jsXsOgtQmosHZ%2Bzvw0pQMmAvppDlVBZySxdPT3rNtMhve3nNL9ao4KKs7gakTcs6PlGjEUkdmMj%2BidU0AfiH0AHnlXAQ31%2Bxih0XYDBidemEmtMg94H2jBy%2Btumc4tgjC%2BZAvBkNVQ5ZORu1%2FZWYOpoRBbVOCXUieNkHTyplRi09QiaQ1gFtitpYhDHpRHUtdRHZySWgU%2FnldxvBbCbJqSCdJH6%2FRpLJg0iUzW52wN%2FPB1RCg%3D%7Ctkp%3ABFBMuMbHtqBi",
];

let MOCK_DB: IDataRow[] = [];

async function getSiteData(
  responseData: string,
  selectors: ISelectors = {
    title: "",
    price: "",
    img: "",
  }
) {
  const $ = cheerio.load(responseData);
  let itemPrice = $(selectors.price).first().text().trim();
  const itemTitle = $(selectors.title).first().text().trim();
  const imgSrc = $(selectors.img).attr().src;

  if (itemPrice.length === 0) {
    itemPrice = "Price not found";
  }
  return { price: itemPrice, title: itemTitle, imgSrc: imgSrc };
}

async function formatData(urls: string[], concurrentRequests: number = DEFAULT_CONCURRENT_REQUESTS) {
  const formattedData: IDataRow[] = [];

  // Function to process a URL and push the result to formattedData
  async function processUrl(url: string) {
    let data: IDataRow = { price: "Price not found", title: "Title not found", imgSrc: "Image not found", url };
    try {
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "axios 0.21.1",
        },
      });

      let siteData = {};
      if (url.includes("amazon")) {
        siteData = await getSiteData(response.data, amazonSelectors);
      } else if (url.includes("ebay")) {
        siteData = await getSiteData(response.data, ebaySelectors);
      }

      data = { ...data, ...siteData };
    } catch (e) {
      console.log("could not load site");
    }

    return data;
  }

  // Create a concurrency limiter
  const limit = pLimit(concurrentRequests);

  // Process each URL with limited concurrency
  const promises = urls.map((url) => limit(() => processUrl(url)));
  const results = await Promise.allSettled(promises);

  for (const result of results) {
    if (result.status === "fulfilled") {
      formattedData.push(result.value);
    }
  }

  return formattedData;
}

// app.get("/", async (req: Request<{}, {}, {}, IGetItemsRequest>, res: Response<IDataRow[]>) => {
app.get("/", async (req: any, res: any) => {
  const { page = 1, limit = 10, searchTerm = "", refresh = false} = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Format data if needed.
  if (MOCK_DB.length !== URLS_DB.length || refresh) {
    // Lets say that URLS = data fetched from db.
    let newDataFromServer = URLS_DB;
    // Fetch all again if we want tro refresh.
    if(!refresh) {
      const savedUrls = MOCK_DB.map((item) => item.url)
      // Make sure I load the sites that are not saved in db to save time.
      newDataFromServer = newDataFromServer.filter((item) => !savedUrls.includes(item));
      if (newDataFromServer.length >  0) {
        URLS_DB = [...URLS_DB, ...newDataFromServer];
      }
    } 

    const formattedData = await formatData(newDataFromServer);

    if(refresh) {
      MOCK_DB = formattedData;
    } else {
      MOCK_DB.push(...formattedData);
    }
  }

  const paginatedData = MOCK_DB.filter((data) => data.title.includes(searchTerm)).slice(startIndex, endIndex);
  res.json(paginatedData);
});

// app.post("/addUrl", async (req: Request, res: Response) => {
app.post("/addUrl", async (req: any, res: any) => {
  const { url } = req.body;
  if (!!url) {
    // TODO: validate url
    const formattedData = await formatData([url]);
    MOCK_DB.push(...formattedData);
    URLS_DB.push(url);
    res.json(MOCK_DB);
  }
});

// app.get("*", (req: Request, res: Response) => {
app.get("*", (req: any, res: any) => {
  res.status(500).json({ message: "error" });
});

app.listen(4000, () => {
  console.log("Proxy server is running on port 4000");
});
