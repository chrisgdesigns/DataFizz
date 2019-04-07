// Requirements
const fs = require('fs'),
         request = require('request'),
         cheerio = require('cheerio');

// Create json object
let json = {
    name: "",
    price: "",
    description: "",
    dimensions: "",
    imageURLS: "",
    weight: ""
};

// productInfo:
// 1. Accepts Amazon ASIN number
// 2. Requests URL using Request package
// 3. If successful statusCode of 200, execute data gathering from page using Cheerio(jQuery in Node)
// 4. Write data to 'crawlinfo.json' file 
function productInfo(ASIN) {
url = `http://www.amazon.co.uk/gp/product/${ASIN}`;

request(url, function(error, response, html) {
    
    if (response.statusCode == 200) {
        let $ = cheerio.load(html);

        // Name
        let name = $('#title span#productTitle').each(function(index, element) {
            let el = $(this);
            let name = el.text();
            json.name = name;
        });

        // Price
        let price = $('span.inlineBlock-display span.a-color-price').each(function(index, element) {
            let el = $(this);
            let price = el.text();
            json.price = price;

        });

        // Description
        let desc = $('#productDescription').each(function(i, element) {
            let el = $(this);
            let desc = el.text().replace(/\s+/g," ");
            json.description = desc;
        });

        // Product Dimension
        let prodDimension = $("li:contains('Product Dimensions')").each(function(index, element) {
            let el = $(this);
            let prodDimension = el.text().replace(/\s+/g," ");
            json.dimensions = prodDimension;
        });

         // Image URLs
         let images = [];
        let imageURL = $("#booksImageBlock_feature_div img[src*='https://images-na.ssl-images-amazon.com/images/I/']").each(function (index, element) {
            
            let el = $(this).attr('src');
            images.push(el);
            
        });
        json.imageURLS = images;

        // Weight
        let  = $("li:contains('Weight')").each(function(i, element) {
            let el = $(this);
            let weight = el.text();
            json.weight = weight;
        });
        
        // Write json values to crawlinfo.json file
        fs.writeFile('crawlinfo.json', JSON.stringify(json, null, 4), function(err) {
            console.log('Properties saved in crawlinfo.json');
        });
    }
});

}
const products = process.argv.slice(2);
products.forEach(productInfo);

