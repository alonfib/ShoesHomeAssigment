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

let URLS_DB: string[] = [];

const FETCH_DATA: string[] = [
  "https://www.amazon.com/Nike-Experience-White-Cool-Grey-Reflective-%20Regular/dp/B00V88DL72/",
  "https://www.ebay.com/itm/125985930383?hash=item1d5558bc8f:g:NEwAAOSwbrpkk5Ob&amdata=enc%3AAQAIAAAA0A77kdi0VyWSrV1QjJewIZwD4zboV2c9DH9v68jsXsOgtQmosHZ%2Bzvw0pQMmAvppDlVBZySxdPT3rNtMhve3nNL9ao4KKs7gakTcs6PlGjEUkdmMj%2BidU0AfiH0AHnlXAQ31%2Bxih0XYDBidemEmtMg94H2jBy%2Btumc4tgjC%2BZAvBkNVQ5ZORu1%2FZWYOpoRBbVOCXUieNkHTyplRi09QiaQ1gFtitpYhDHpRHUtdRHZySWgU%2FnldxvBbCbJqSCdJH6%2FRpLJg0iUzW52wN%2FPB1RCg%3D%7Ctkp%3ABFBMuMbHtqBi",

  "https://www.ebay.com/itm/256125579994?var=556096113399&_trkparms=amclksrc%3DITM%26aid%3D1110006%26algo%3DHOMESPLICE.SIM%26ao%3D1%26asc%3D251362%26meid%3Dc063022ab0df4222b155be49cfa69ad8%26pid%3D101195%26rk%3D4%26rkt%3D12%26sd%3D125985930383%26itm%3D556096113399%26pmt%3D1%26noa%3D0%26pg%3D2047675%26algv%3DSimplAMLv11WebTrimmedV3MskuWithLambda85KnnRecallV1V4ItemNrtInQueryAndCassiniVisualRankerAndBertRecall%26brand%3DNike&_trksid=p2047675.c101195.m1851&amdata=cksum%3A256125579994c063022ab0df4222b155be49cfa69ad8%7Cenc%3AAQAIAAABQNaJCFP3eaFlNU%252FMPxRY0TCMczVKEUB5MsBytoCwPnd71M08lfrVO4PuTCchnU42KC4W4fZqxBROE%252BM7tSL%252BgZgL1kWiIUBRsEpydVTA61DhOJDUizwNgM7HKYQEqSaBlGcEb5MIWmX%252Fn8VW14Mbid8Pf4SlmMWkqqkijRkyLWedEulWlYzXiZXvFsP%252ByJNBHCuSyVj9NU8uiaRkGKsb3irdcakn%252F1GFPp66xqJjoQ7ZS8%252BDt5YgDHP%252BxyS8tywwVqojXF3wsU21VkKMeLTIyFBCKtcJlL1BWMqhprGKev4WY4tbESVcTybUsSkuOKsuRozvuMpc5%252BpVtQJkjZr0727wpRJt7WdDHyN2Hj%252FfJJNUlBHhU%252BF4il%252BGKaUlL6PRf70Zvezq%252BRVVxfGB1cnmHAEx4xBY1SBglX7N63ClDkOj%7Campid%3APL_CLK%7Cclp%3A2047675",
  "https://www.ebay.com/itm/275850905471?_trkparms=amclksrc%3DITM%26aid%3D1110006%26algo%3DHOMESPLICE.SIM%26ao%3D1%26asc%3D251362%26meid%3Da7e98e8772ca4691b25c47ebd6ec0094%26pid%3D101195%26rk%3D2%26rkt%3D12%26sd%3D235068219442%26itm%3D275850905471%26pmt%3D1%26noa%3D0%26pg%3D2047675%26algv%3DSimplAMLv11WebTrimmedV3MskuWithLambda85KnnRecallV1V4ItemNrtInQueryAndCassiniVisualRankerAndBertRecall%26brand%3DPRADA&_trksid=p2047675.c101195.m1851&amdata=cksum%3A275850905471a7e98e8772ca4691b25c47ebd6ec0094%7Cenc%3AAQAIAAABQNaJCFP3eaFlNU%252FMPxRY0TCMczVKEUB5MsBytoCwPnd71M08lfrVO4PuTCchnU42KC4W4fZqxBROE%252BM7tSL%252BgZgL1kWiIUBRsEpydVTA61DhOJDUizwNgM7HKYQEqSaBlADyx14NHoSaOFWKUZ2CpWXpfcy1cHwbYNuPGGBxkgXNrjey0qaxUTc73V%252BJ2VYgolkvqLbHlx2ynOZ41sNuw%252F%252FPq49G154YQAcEYqz3baYWU6aDAH6YYPpfZTtLsDsUQrpoNrakMORyuBQIeKk0cyje0MQz4%252B8LW7SPgCirMDfUkCSnkHVrmnPYBF%252BURUmpNBxbUO4%252FKKK4%252FlGqmaxfnS5UuLRibhImNuHROv3L3J%252BA%252B3ZZhTqd%252B9rl56lk8bTIEkX%252FC6DYY%252BmKaKTNC3zpg%252FO3SbiK9aijw3%252Ba8k%252BH5NhJ%7Campid%3APL_CLK%7Cclp%3A2047675",
  "https://www.ebay.com/itm/314644519457?_trkparms=amclksrc%3DITM%26aid%3D1110018%26algo%3DHOMESPLICE.COMPLISTINGS%26ao%3D1%26asc%3D250942%26meid%3D9925b52dbfe04681bff63c5a1a9c6f52%26pid%3D101196%26rk%3D3%26rkt%3D12%26sd%3D275850905471%26itm%3D314644519457%26pmt%3D1%26noa%3D0%26pg%3D2047675%26algv%3DPromotedCompV5WithHighAdFeeWithKnnRecallV1PostRankerMode1RecallFamilyWithImageBatchHotClickRecallV2%26brand%3DPRADA&_trksid=p2047675.c101196.m2219&amdata=cksum%3A3146445194579925b52dbfe04681bff63c5a1a9c6f52%7Cenc%3AAQAIAAABQFA0K9EYYmWdjE6l1%252BGUOS5A0CymjdgVbi5XHUMRcW99HH09XVSCjTjq1kyEio%252FYqXUw2fXH92oyB9xHeaDf61gtSe1vrAox0XFmZTD809x%252FpbrvoyroabU1MyT%252FPwdEFYKU9ZAApc6V6TXcQYWgGph8nxzi7l05qwHby2zuBO2BRlShBNgyk9DuCDv7xoGJVOvc4NBtpw39uhGrz1BWF7qVrIZ8rWt2PvXU8qhH%252FfbYG6lf9qwRal%252FaWOR%252BN9U6mZc19o5YdiLeYDsG6N0dDMKH3vnqOqVg%252FKM7gELh%252FEAkIcUSF2hSNbMGp36%252BYVBAHdi0zJ%252FLMa6RuSzeIgra0h03DyjLdduZL%252FCwFZmSQi1oeKVkWHGKN7D9p5LzP1EN%252FScVuCGaTmGDv0r7FQYGUuAXyZ83gSEMSYdt3UAddMvy%7Campid%3APL_CLK%7Cclp%3A2047675",
  "https://www.amazon.com/FINOTAR-Running-Lightweight-Breathable-Sneakers/dp/B0B1MMMQQT/ref=d_pd_di_sccai_cn_sccl_1_4/135-8015018-9831921?pd_rd_w=NrcGs&content-id=amzn1.sym.e13de93e-5518-4644-8e6b-4ee5f2e0b062&pf_rd_p=e13de93e-5518-4644-8e6b-4ee5f2e0b062&pf_rd_r=71W1QKAP0EDJRN2VSZ4E&pd_rd_wg=6Ggir&pd_rd_r=1cab73c3-2735-473e-ab0f-34a804a21195&pd_rd_i=B0B1MMMQQT&psc=1",
  "https://www.amazon.com/dp/B07XZ7QKKT/ref=sspa_dk_detail_3?psc=1&pd_rd_i=B07XZ7QKKT&pd_rd_w=QimNB&content-id=amzn1.sym.386c274b-4bfe-4421-9052-a1a56db557ab&pf_rd_p=386c274b-4bfe-4421-9052-a1a56db557ab&pf_rd_r=X3E9Y97865B2Z90BTWM6&pd_rd_wg=sklPq&pd_rd_r=cb2f40d8-4637-4a8a-8eb4-7c2afa187b18&s=shoes&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfdGhlbWF0aWM&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUE1S0FSOUdYR1U4UFkmZW5jcnlwdGVkSWQ9QTA4MDM5MzBEQ081MllWQlRYTEEmZW5jcnlwdGVkQWRJZD1BMDgyNTg5OTI5STA0UDhHNVhEQjcmd2lkZ2V0TmFtZT1zcF9kZXRhaWxfdGhlbWF0aWMmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl",
  "https://www.amazon.com/dp/B09VPHLLL1/ref=sspa_dk_detail_3?psc=1&pd_rd_i=B09VPHLLL1&pd_rd_w=Eim2E&content-id=amzn1.sym.386c274b-4bfe-4421-9052-a1a56db557ab&pf_rd_p=386c274b-4bfe-4421-9052-a1a56db557ab&pf_rd_r=P4AFJE1W79928C87DNPR&pd_rd_wg=0rQpV&pd_rd_r=bb579d16-a102-4d0f-98d9-5b77f426412e&s=shoes&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfdGhlbWF0aWM&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyVkhSMjVVNDBCRlJEJmVuY3J5cHRlZElkPUEwMzk5MzU1MU5ITDdOTjVSN1JaVyZlbmNyeXB0ZWRBZElkPUEwMTYwMjA4NVVDN05ZMlQ3WVhGJndpZGdldE5hbWU9c3BfZGV0YWlsX3RoZW1hdGljJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==",
  "https://www.amazon.com/dp/B09C1RS7C2/ref=sspa_dk_detail_6?psc=1&pd_rd_i=B09C1RS7C2&pd_rd_w=bQMDV&content-id=amzn1.sym.386c274b-4bfe-4421-9052-a1a56db557ab&pf_rd_p=386c274b-4bfe-4421-9052-a1a56db557ab&pf_rd_r=Y704193AFJH6MSQ0KXKW&pd_rd_wg=p8nh3&pd_rd_r=415267ea-2de7-4b92-8c34-05103f35ad81&s=shoes&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWxfdGhlbWF0aWM&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExSllGMjdaOEcxM1FaJmVuY3J5cHRlZElkPUEwNjQ4NzkxM0taTEY3UlFLNzRLSyZlbmNyeXB0ZWRBZElkPUEwNzQyNDU5M0cwRzUyNlc4S1g1SSZ3aWRnZXROYW1lPXNwX2RldGFpbF90aGVtYXRpYyZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=",
  "https://www.amazon.com/dp/B0C1V1YGDJ/ref=sspa_dk_detail_1?psc=1&pd_rd_i=B0C1V1YGDJ&pd_rd_w=41lqR&content-id=amzn1.sym.0d1092dc-81bb-493f-8769-d5c802257e94&pf_rd_p=0d1092dc-81bb-493f-8769-d5c802257e94&pf_rd_r=R21VXC7BYF7Q0TT5QPBQ&pd_rd_wg=mIFjT&pd_rd_r=0c3db667-c286-4270-9b59-479d3831c41a&s=shoes&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWwy",
  "https://www.ebay.com/itm/155636824816?hash=item243cad7af0:g:eOQAAOSwnqZkd3sH&amdata=enc%3AAQAIAAAA0BRvEraP%2BVIkaqR3oM9f9P8iGCI6%2FcRaSrJ4zEygo1TIwxJ6lcXPKtfelkurS%2F%2F3UkDOVRhv4P5hOHMOHWEjZwZTkDybOVHUuHxNBWuSq7WQWwAzPdI5VxubfRauLxpUnBjxu3nl1Iay7ccJz9F%2FojnDGxZFgnJhb0h48hKUYfyba91IA%2B1MkLDQ77zQMOn27kExZbAmneD3HEYNGsNbjTXh%2BmUIR1o3F5Xkwiiv9DSG3FanvoGd%2B%2FtEfsduTcUtE%2FGD%2BUs5EPzaf5mgnfWnHdQ%3D%7Ctkp%3ABFBMgOeivaFi",
  "https://www.ebay.com/itm/155596573646?hash=item243a474bce%3Ag%3A-fAAAOSw%7EelkmcXo&_trkparms=%2526rpp_cid%253D63ae0485b4fecb049abf9a2c&var=455868503966",
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
  const { page = 1, limit = 10, searchTerm = "", refresh = false } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  //fetch from server
  const fetchedData = [...FETCH_DATA];
  URLS_DB = fetchedData;

  if (refresh) {
    const formattedNewData = await formatData(fetchedData);
    MOCK_DB  = formattedNewData
  } else if (URLS_DB.length === 0 || MOCK_DB.length !== URLS_DB.length) {
    const savedUrls = MOCK_DB.map((item) => item.url);
    const newData = URLS_DB.filter((url) => !savedUrls.includes(url));
    const formattedNewData = await formatData(newData);
    MOCK_DB.push(...formattedNewData);
  }

  const paginatedData = MOCK_DB.filter((data) => data.title.includes(searchTerm)).slice(startIndex, endIndex);
  res.json(paginatedData);
});

// app.post("/addUrl", async (req: Request, res: Response) => {
app.post("/addUrl", async (req: any, res: any) => {
  const { url, page, limit, searchTerm } = req.body;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  if (!!url) {
    // TODO: validate url
    const formattedData = await formatData([url]);
    MOCK_DB.push(...formattedData);
    URLS_DB.push(url);
    const paginatedData = MOCK_DB.filter((data) => data.title.includes(searchTerm)).slice(startIndex, endIndex);
    res.json(paginatedData);
  }
});

// app.get("*", (req: Request, res: Response) => {
app.get("*", (req: any, res: any) => {
  res.status(500).json({ message: "error" });
});

app.listen(4000, () => {
  console.log("Proxy server is running on port 4000");
});
