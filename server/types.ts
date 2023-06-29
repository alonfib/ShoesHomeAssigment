export interface ISelectors {
  title: string;
  price: string;
  img?: string;
}

export interface IDataRow {
  price: string;
  title: string;
  imgSrc: string;
  url: string;
}

export interface IGetItemsRequest {
  page?: number,
  limit?: number,
  searchTerm?: string
}

export interface IAddUrl {
  url: string
}
