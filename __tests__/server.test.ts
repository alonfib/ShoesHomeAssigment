const request = require("supertest");
const SERVER_URL = "http://localhost:4000";

describe("Connect Server", function () {
  describe("GET /", function () {
    it("Should return an array of items (10 max right now)", async function () {
      const response = await request(SERVER_URL).get("/").expect(200)
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty("title");
        expect(response.body[0]).toHaveProperty("price");
        expect(response.body[0]).toHaveProperty("imgSrc");
        expect(response.body[0]).toHaveProperty("url");
      }
    });
  });

  describe("GET / limit", function () {
    it("Should return a limited array of items", async function () {
      const limit = 3;
      const response = await request(SERVER_URL).get("/").query({ limit: limit }).expect(200)
      expect(response.body.length).toBeLessThanOrEqual(limit);
    });
  });

  describe("GET / search", function () {
    it("Should return searched array of items", async function () {
      const searchTerm = "Mans"
      const response = await request(SERVER_URL).get("/").query({ searchTerm: searchTerm }).expect(200)
      // Check if there is a url that not including our search
      const isNotValid = response.body.some(url => !url.includes(searchTerm))
      expect(!isNotValid).toBeTruthy;
    });
  });


  describe("GET / new page", function () {
    it("Should return new page", async function () {
      const currentPage = 1;
      const firstPageResponse = await request(SERVER_URL).get("/").query({ page: currentPage }).expect(200)
      const secondPageResponse = await request(SERVER_URL).get("/").query({ page: currentPage }).expect(200)

      // // Check if more than one URL is different between the two responses.
      const differentUrls = firstPageResponse.body.filter(
        (url) => !secondPageResponse.body.includes(url)
      );
      expect(differentUrls.length).toBeGreaterThanOrEqual(1);
    });
  });

describe("Post /addUrl", function () {
  it("Should return items with new item first & formated well", async function () {
    // a string from SupportedSites enum
    const postUrl = "amazon";
    request(SERVER_URL).post("/addUrl").send({
      url: postUrl
    }).expect(function(res) {
      // New item should be the new first item.
      expect(res.body[0].url).toEqual(postUrl);
      expect(res.body[0]).toHaveProperty("url");
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("price");
      expect(res.body[0]).toHaveProperty("imgSrc");
    }).expect(200);
  });
});
});
