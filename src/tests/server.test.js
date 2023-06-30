const chai = require("chai");
const axios = require("axios");
const cheerio = require("cheerio");
const pLimit = require("p-limit");
const { app } = require("../../server/server"); // Assuming your server file is named server.js

const expect = chai.expect;

const limit = pLimit(10); // Use a limit of 10 concurrent requests

describe("Server", function () {
  let server;

  before(function (done) {
    server = app.listen(3000, done);
  });

  after(function (done) {
    server.close(done);
  });

  describe("GET /", function () {
    it("should return an array of items", async function () {
      const response = await axios.get("http://localhost:4000/");
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      if(response.data.length> 0) {
        expect(response.data[0]).to.have.property("title");
        expect(response.data[0]).to.have.property("price");
        expect(response.data[0]).to.have.property("imgSrc");
        expect(response.data[0]).to.have.property("url");
      }
    });
  });

  describe("GET / limit", function () {
    it("should return an array of items", async function () {
      const itemsLimit = 3
      const response = await axios.get("http://localhost:4000/", {
        limit: itemsLimit, 
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      // check if arrat length is less than liit;
      expect(response.data.length).to.equal(itemsLimit); // check also if less to itemsLimit
    
    });
  });

  describe("GET / search", function () {
    it("should return an array of items", async function () {
      const searchTerm = "nanana" 
      const response = await axios.get("http://localhost:4000/",{
        searchTerm: searchTerm,
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      // check if theres urls thats not including search
      const isNotValid = response.data.some(url => !url.includes(searchTerm))
      expect(!inNoteValid)
    });
  });

  
  describe("GET / new page", function () {
    it("should return an array of items", async function () {
      const currentPage = 1;
      const response = await axios.get("http://localhost:4000/", {
        page: currentPage, 
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      const newResponse = await axios.get("http://localhost:4000/", {
        page: currentPage + 1, 
      });
      expect(newResponse.status).to.equal(200);
      expect(newResponse.data).to.be.an("array");
  
      // now check it's not the same data by some logic (check if more than 1 different url)
    });
  });

  describe("Post /addUrl", function () {
    it("should return item details", async function () {
      const response = await axios.post(`http://localhost:3000/addUrl, {
        url: "some url"
      }`);
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an("array");
      if(response.data.length> 0) {
        expect(response.data[0]).to.have.property("title");
        expect(response.data[0]).to.have.property("price");
        expect(response.data[0]).to.have.property("imgSrc");
        expect(response.data[0]).to.have.property("url");

        // I'd also check that new url inside new data 
      }
    });
  });
});
