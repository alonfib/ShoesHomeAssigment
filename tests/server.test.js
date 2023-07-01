const chai = require("chai");
const axios = require("axios");
const { app } = require("../server/server.ts"); s// Assuming your server file is named server.js

const expect = chai.expect;

describe("Server", function () {
  let server;

  before(function (done) {
    server = app.listen(3000, done);
  });

  after(function (done) {
    server.close(done);
  });

  describe("GET /", function () {
    it("should return an array of items (10 max right now)", async function () {
      const response = await axios.get("http://localhost:3000/");
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      if (response.data.length > 0) {
        expect(response.data[0]).to.have.property("title");
        expect(response.data[0]).to.have.property("price");
        expect(response.data[0]).to.have.property("imgSrc");
        expect(response.data[0]).to.have.property("url");
      }
    });
  });

  describe("GET / limit", function () {
    it("should return a limited array of items", async function () {
      const itemsLimit = 3
      const response = await axios.get("http://localhost:3000/", {
        limit: itemsLimit,
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      expect(response.data.length).to.be.below(itemsLimit + 1); // check also if less to itemsLimit

    });
  });

  describe("GET / search", function () {
    it("should return searched array of items", async function () {
      const searchTerm = "nanana"
      const response = await axios.get("http://localhost:3000/", {
        searchTerm: searchTerm,
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      const isNotValid = response.data.some(url => !url.includes(searchTerm))
      expect(!isNotValid).to.be.true;
    });
  });


  describe("GET / new page", function () {
    it("should return new page", async function () {
      const currentPage = 1;
      const response = await axios.get("http://localhost:3000/", {
        params: {
          page: currentPage,
        },
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");

      const newResponse = await axios.get("http://localhost:3000/", {
        params: {
          page: currentPage + 1,
        },
      });
      expect(newResponse.status).to.equal(200);
      expect(newResponse.data).to.be.an("array");

      // Check if more than one URL is different between the two responses
      const differentUrls = response.data.filter(
        (url) => !newResponse.data.includes(url)
      );
      expect(differentUrls.length).to.be.greaterThan(1);
    });
  });

describe("Post /addUrl", function () {
  it("should return item details", async function () {
    const postUrl = "postUrl";

    const response = await axios.post("http://localhost:3000/addUrl", {
      url: postUrl,
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an("array");
    expect(response.data[0]).to.have.property("title");
    expect(response.data[0]).to.have.property("price");
    expect(response.data[0]).to.have.property("imgSrc");
    expect(response.data[0]).to.have.property("url");

    // Check if any object in response.data has the url property set to "postUrl"
    const hasPostUrl = response.data.some(
      (item) => item.url === postUrl
    );
    expect(hasPostUrl).to.be.true;
  });
});
});
