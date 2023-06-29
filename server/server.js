const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");
const pLimit = require('p-limit');

const app = express();

app.use(express.json());
app.use(cors());

const URLS = [
  "https://www.amazon.com/Nike-Experience-White-Cool-Grey-Reflective-%20Regular/dp/B00V88DL72/",
  "https://www.ebay.com/itm/125985930383?hash=item1d5558bc8f:g:NEwAAOSwbrpkk5Ob&amdata=enc%3AAQAIAAAA0A77kdi0VyWSrV1QjJewIZwD4zboV2c9DH9v68jsXsOgtQmosHZ%2Bzvw0pQMmAvppDlVBZySxdPT3rNtMhve3nNL9ao4KKs7gakTcs6PlGjEUkdmMj%2BidU0AfiH0AHnlXAQ31%2Bxih0XYDBidemEmtMg94H2jBy%2Btumc4tgjC%2BZAvBkNVQ5ZORu1%2FZWYOpoRBbVOCXUieNkHTyplRi09QiaQ1gFtitpYhDHpRHUtdRHZySWgU%2FnldxvBbCbJqSCdJH6%2FRpLJg0iUzW52wN%2FPB1RCg%3D%7Ctkp%3ABFBMuMbHtqBi",
];

// send from here if allready has
let SAVED_DATA = [];

async function getEbayData(responseData) {
  const $ = cheerio.load(responseData);
  const itemPrice = $(".x-price-primary > span > .ux-textspans").first().text();
  const itemTitle = $(".x-item-title > h1 > span").first().text();
  const imgSrc = $(".image img").attr().src;
  return { price: itemPrice, title: itemTitle, imgSrc: imgSrc };
}

async function getAmazonData(responseData) {
  const $ = cheerio.load(responseData);
  const itemPrice = $(".a-price > span").first().text();
  const itemTitle = $("h1 > #productTitle").text().trim();
  const imgSrc = $(".imgTagWrapper img").attr().src;
  return { price: itemPrice, title: itemTitle, imgSrc: imgSrc };
}

async function formatData(urls, concurrentRequests = 10) {
  const formattedData = [];

  // Function to process a URL and push the result to formattedData
  async function processUrl(url) {
    let data = { price: "Price not found", title: "Title not found", url };
    try {
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "axios 0.21.1",
        },
      });

      let siteData = {};
      if (url.includes("amazon")) {
        siteData = await getAmazonData(response.data);
      } else if (url.includes("ebay")) {
        siteData = await getEbayData(response.data);
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
  const promises = urls.map(url => limit(() => processUrl(url)));
  const results = await Promise.allSettled(promises);

  for (const result of results) {
    if (result.status === "fulfilled") {
      formattedData.push(result.value);
    }
  }

  return formattedData;
}

// app.get("/", async (req, res) => {
//   if (SAVED_DATA.length !== URLS.length) {
//     const formattedData = await formatData(URLS)
//     res.json(formattedData.filter);
//     SAVED_DATA = formattedData;
//   } else {
//     res.json(SAVED_DATA);
//   }
// });

// app.get("/search", async (req, res) => {
//   const { searchTerm } = req.query;

//     res.json(SAVED_DATA.filter(data => data.title.includes(searchTerm)));
// });

app.get("/", async (req, res) => {
  const { page = 1, limit = 10, searchTerm = ""} = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  if (SAVED_DATA.length !== URLS.length) {
    const formattedData = await formatData(URLS);
    SAVED_DATA = formattedData;
  }

  const paginatedData = SAVED_DATA.filter(data => data.title.includes(searchTerm)).slice(startIndex, endIndex);
  res.json(paginatedData);
});



app.post("/addUrl", async (req, res) => {
  const { url } = req.body;
  if (!!url) {
    // TODO: validate url
    const formattedData = await formatData([url]);
    SAVED_DATA.push(formattedData[0]);
    URLS.push(url);
    res.json(SAVED_DATA);
  }
});

app.get("*", (req, res) => {
  res.status(500).json({ message: "error" });
});

app.listen(4000, () => {
  console.log("Proxy server is running on port 4000");
});
