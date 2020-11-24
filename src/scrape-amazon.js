 const puppeteer = require("puppeteer");
 const { Parser } = require("json2csv");
 const fs = require("fs");


const file = process.argv[2];
const outputFile = process.argv[3];

if (!file) {
    throw "Please provide URL as a first argument";
}

if (!outputFile) {
    throw Error("Output file is missing.");
}


try {
    const csvParser = new Parser();

    const urlTemplate = "https://www.amazon.ae/s?k={fnsku}";

    (async () => {
        const fnskus = fs.readFileSync(file, {encoding: "utf-8"}).split("\n");

        const browser = await puppeteer.launch();

        for (let i = 0; i < fnskus.length; i++) {
            const fnsku = fnskus[i];

            const page = await browser.newPage();
            page.setUserAgent("Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36");
            
            const url = urlTemplate.replace("{fnsku}", fnsku);
            await page.goto(url);
            await page.waitForSelector("div.nav-logo-base.nav-sprite");

            let product = {
                fnsku: fnsku,
                name: "",
                amazonPrice: 0,
                departments: [],
                description: "",
                thumbnail: "",
                images: [],
                url: url,
            };

            // Check if product was found
            const html = await page.content();
            if (html.indexOf("widgetId=messaging-messages-no-results") < 0) {

                // Get departments
                const departments = await page.$$("#departments ul li");
                for (let i = 0; i < departments.length; i++ ) {
                    product.departments.push(await departments[i].$eval("a span", span => span.innerText));
                }

                const resultsList = await page.$(".s-result-item.s-asin");

                product.name = await resultsList.$eval("h2 a span", h2 => h2.innerText);
                product.thumbnail = await resultsList.$eval("img.s-image", img => img.src);

                const productDetailURL = await resultsList.$eval("h2 a", a => a.href);
                if (productDetailURL) {
                    product.url = productDetailURL

                    await page.goto(productDetailURL, { waitUntil: "load" });
                    
                    product = await page.evaluate(async (product) => {

                        // Get price
                        const priceEl = document.querySelector("#price td .a-color-price");
                        
                        if (priceEl) {
                            product.amazonPrice = priceEl.innerText.replace(/AED\s/, '');
                        } 
                        
                        // Get description
                        let mainDescription = document.getElementById("feature-bullets");
                        if (mainDescription) {
                            mainDescription.querySelectorAll("ul li").forEach(description => {
                                product.description += " " + description.getElementsByTagName("span")[0].innerText + ",";
                            });
                        }

                        let description = document.getElementById("productDescription");
                        if (description) {
                            product.description += description.querySelectorAll("p")[0].innerText;
                        }
                        
                        let descriptionLi = document.getElementById("productDescription");
                        if (descriptionLi) {
                            descriptionLi = descriptionLi.querySelectorAll("ul li");
                            for (let i = 0; i < descriptionLi.length; i++) {
                                product.description += " " + descriptionLi[i].innerText + ",";
                            }
                        }

                        return product;
                    }, product);

                    // Get price if missing
                    if (!product.amazonPrice) {
                        const offersLink = await page.$("#availability [data-action='show-all-offers-display'] a");
                        if (offersLink) {
                            await offersLink.click();
                            await page.waitForTimeout(1000);

                            let offers = await page.$$("#aod-offer-list #aod-offer #aod-offer-price .a-price .a-offscreen");
                            let offerPrices = [];
                            for (offer in offers) {
                                const price = await page.evaluate(offer => offer.innerText, offers[offer]);
                                offerPrices.push(price.replace(/AED\s/, ''));
                            }
                            
                            product.amazonPrice = Math.min(...offerPrices);
                        }
                    }

                    // Get images
                    // hover on thumbnails to display images then get images
                    let thumbs = await page.$$("#altImages > ul > li.imageThumbnail");
                    for (let i = 0; i < thumbs.length; i++) {
                        await thumbs[i].hover();
                    }
                    const images = await page.$$("#main-image-container ul li.image img");
                    for (let i = 0; i < images.length; i++) {
                        product.images.push(await page.evaluate((img) => img.src, images[i]));
                    }
                }
            }

            page.close();

            product.departments = product.departments.join(" | ");
            product.images = product.images.join(", ");
            product.amazonPrice = Number(product.amazonPrice);

            const csv = csvParser.parse(product);
            fs.appendFile(outputFile, csv, function (err) {});

        };

        browser.close();
    })();

} catch (err) {
    console.error(err);
}
