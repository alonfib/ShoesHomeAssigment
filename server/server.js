const express = require("express");
const axios = require("axios");
const cors = require("cors");
const cheerio = require("cheerio");

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
  return { price: itemPrice, title: itemTitle };
}

async function getAmazonData(responseData) {
  const $ = cheerio.load(responseData);
  const itemPrice = $(".a-price > span").first().text();
  const itemTitle = $("h1 > #productTitle").text().trim();
  return { price: itemPrice, title: itemTitle };
}

async function formatData (urls) {
  const formattedData = await Promise.all(
    urls.map(async (url) => {
      let data = { price: "Price not found", title: "Title not found", url };
      try {
        const response = await axios.get(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "axios 0.21.1",
          },
        });

        //TODO: add validation if site not exist \ missing http \ missig https

        let siteData = {};
        if (url.includes("amazon")) {
          siteData = await getAmazonData(response.data);
        } else if (url.includes("ebay")) {
          siteData = await getEbayData(response.data);
        }

        data = { ...data, ...siteData };
        console.log("data", data);
      } catch (e) {
        console.log("could not load site");
      }

      return data;
    })
  );

  return formattedData
}

app.get("/", async (req, res) => {
  if (SAVED_DATA.length !== URLS.length) {
    const formattedData = await formatData(URLS)
    res.json(formattedData);
    SAVED_DATA = formattedData;
  } else {
    res.json(SAVED_DATA);
  }
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
