import axios from "axios";
import cheerio from "cheerio";

export interface ExtractionModel {
  titleSelector: string;
  priceSelector: string;
}

const fetchProductDetails = async (url: string) => {
  try {
    const response = await axios.get(`http://localhost:4000/getItems`, {
      params:{
        url
      }
    });

    console.log("response")
    

    // const response = await fetch(`http://localhost:4000/fetch-url?url=${encodeURIComponent(url)}`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const parseHtml = async (url: string, extractionModel: ExtractionModel) => {
    const a = fetchProductDetails(url);
    const returnObject = { title: "unknown", price: "unknown", url };
    return returnObject
};
