import { ISelectors } from "./types";

export const ebaySelectors: ISelectors = {
  price: ".x-price-primary > span > .ux-textspans",
  title: ".x-item-title > h1 > span",
  img: ".image img",
};

export const amazonSelectors: ISelectors = {
  title: "h1 > #productTitle",
  price: ".a-price > span",
  img: ".imgTagWrapper img",
};