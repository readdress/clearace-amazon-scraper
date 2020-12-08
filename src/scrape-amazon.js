 const puppeteer = require("puppeteer");
 const { Parser } = require("json2csv");
 const csvtojson = require("csvtojson");
 const request = require("request");
 const fs = require("fs");
 const path = require("path");


// var download = function(uri, filename, callback){
//   try {
//       request.head(uri, function(err, res, body){
//         request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//     });
//   } catch(err) {

//   }
// };

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile) {
    throw "Input file missing";
}

if (!outputFile) {
    throw Error("Output file is missing.");
}


// product.thumbnail = await resultsList.$eval("img.s-image", img => img.src);

async function getDepartments(page) {
    const departments = [];
    const departmentsEL = await page.$$("#departments ul li");
    for (let i = 0; i < departmentsEL.length; i++ ) {
        departments.push(await departmentsEL[i].$eval("a span", span => span.innerText));
    }
    return departments;
}

async function getName(page) {
    const resultsList = await page.$(".s-result-item.s-asin");
    return await resultsList.$eval("h2 a span", h2 => h2.innerText);
}

async function getItemDetailsURL(page) {
    const results = await page.$(".s-result-item.s-asin");
    return await results.$eval("h2 a", a => a.href);
}

async function getItemPrice(page) {
    let price = 0;

    const priceEl = await page.$("#price td .a-color-price");
                
    if (priceEl) {
        price = Number(await page.evaluate(price => price.innerText.replace(/AED\s/, ''), priceEl));
    }

    if (!price) {
        const offersLink = await page.$("#availability [data-action='show-all-offers-display'] a");

        if (offersLink) {
            await offersLink.click();
            await page.waitForTimeout(1000);

            let offers = await page.$$("#aod-offer-list #aod-offer #aod-offer-price .a-price .a-offscreen");
            let offerPrices = [];
            for (offer in offers) {
                const p = await page.evaluate(offer => offer.innerText, offers[offer]);
                offerPrices.push(Number(p.replace(/AED\s/, '')));
            }
            
            price = Math.min(...offerPrices);
        }
    }

    if (!price) {
        const priceContainer = await page.$("#combinedBuyBox #buybox #buyNewSection .offer-price");
        if (priceContainer) {
            const p = await page.evaluate(priceContainer => priceContainer.innerText, priceContainer);
            price = Number(p.replace(/AED\s/, ''));
        }
    }

    return price;
}

async function getDescription(page) {
    let description = [];

    let mainDescription = await page.$$("#feature-bullets ul li");
    if (mainDescription.length) {
        for (let descriptionIndex in mainDescription) {
            description.push(await page.evaluate((el) => {
                return el.getElementsByTagName("span")[0].innerText;
            }, mainDescription[descriptionIndex]));
        }
    }

    let description2 = await page.$$("#productDescription p");
    if (description2.length) {
        description.push(await page.evaluate((el) => el.innerText, description2[0]));
    }
    
    let description3 = await page.$$("#productDescription ul li");
    if (description3.length) {
        for (let descriptionIndex in description3) {
            description.push(await page.evaluate((el) => {
                return el.innerText;
            }, description3[descriptionIndex]));
        }
    }

    let description51 = await page.$$("#iframeContent ul li");
    if (description51.length) {
        for (let descriptionIndex in description51) {
            description.push(await page.evaluate((el) => {
                return el.innerText;
            }, description51[descriptionIndex]));
        }
    }

    let description52 = await page.$$("#iframeContent div span");
    if (description52.length) {
        for (let descriptionIndex in description52) {
            description.push(await page.evaluate((el) => {
                return el.innerText;
            }, description52[descriptionIndex]));
        }
    }

    let description53 = await page.$("#iframeContent");
    if (description53) {
        description.push(await page.evaluate((el) => {
            return el.innerText;
        }, description53));
    }

    let description4 = await page.$$("#editorialReviews_feature_div .a-section .a-section");
    if (description4.length) {
        for (let descriptionIndex in description4) {
            description.push(await page.evaluate((el) => {
                return el.innerText;
            }, description4[descriptionIndex]));
        }
    }

    return description.join(", ").replace(/\n/g, "");
}

async function getImages(page) {
    const images = [];

    // hover on thumbnails to display images then get images
    let thumbs = await page.$$("#altImages > ul > li.imageThumbnail");
    for (let i = 0; i < thumbs.length; i++) {
        await thumbs[i].hover();
    }

    const imagesEL = await page.$$("#main-image-container ul li.image img");
    for (let i = 0; i < imagesEL.length; i++) {
        images.push(await page.evaluate((img) => {
            let image = img.dataset.oldHires;
            return image ? image : img.src;
        }, imagesEL[i]));
    }

    return images;
}

async function getModelNumber(page) {
    let modelNumber = "";

    const lis = await page.$$("#detailBullets_feature_div ul li");
    const trs = await page.$$("#prodDetails tr");

    if (lis.length) {
        for (let li in lis) {
            const spans = await lis[li].$$("span span");
            if (spans.length) {
                const spanLabel = await page.evaluate((el) => el.innerText, spans[0]);
                if (spanLabel && typeof spanLabel == "string" && /model/i.test(spanLabel)) {
                    if (spans[1]) {
                        modelNumber = await page.evaluate((el) => el.innerText, spans[1]);
                    }
                }
            }
        }
    } else if(trs.length) {
        for (let tr in trs) {
            let th = await trs[tr].$("th");
            let td = await trs[tr].$("td");

            if (th) {
                th = await page.evaluate((el) => el.innerText, th);
                if (th && typeof th == "string" && /model/i.test(th)) {
                    if (td) {
                        modelNumber = await page.evaluate((el) => el.innerText, td);
                    }
                }
            }
        }
    }

    return modelNumber;
}

async function getDateFirstAvailable(page) {
    let date = "";

    const lis = await page.$$("#detailBullets_feature_div ul li");
    const trs = await page.$$("#prodDetails tr");

    if (lis.length) {
        for (let li in lis) {
            const spans = await lis[li].$$("span span");
            if (spans.length) {
                const spanLabel = await page.evaluate((el) => el.innerText, spans[0]);
                if (spanLabel && typeof spanLabel == "string" && /first available/i.test(spanLabel)) {
                    if (spans[1]) {
                        date = await page.evaluate((el) => el.innerText, spans[1]);
                    }
                }
            }
        }
    } else if(trs.length) {
        for (let tr in trs) {
            let th = await trs[tr].$("th");
            let td = await trs[tr].$("td");

            if (th) {
                th = await page.evaluate((el) => el.innerText, th);
                if (th && typeof th == "string" && /first available/i.test(th)) {
                    if (td) {
                        date = await page.evaluate((el) => el.innerText, td);
                    }
                }
            }
        }
    }
    
    return date;
}

async function getItemDimensions(page) {
    let dimensions = "";

    const lis = await page.$$("#detailBullets_feature_div ul li");
    const trs = await page.$$("#prodDetails tr");

    if (lis.length) {
        for (let li in lis) {
            const spans = await lis[li].$$("span span");
            if (spans.length) {
                const spanLabel = await page.evaluate((el) => el.innerText, spans[0]);
                if (spanLabel && typeof spanLabel == "string" && /dimensions/i.test(spanLabel)) {
                    if (spans[1]) {
                        dimensions = await page.evaluate((el) => el.innerText, spans[1]);
                    }
                }
            }
        }
    } else if(trs.length) {
        for (let tr in trs) {
            let th = await trs[tr].$("th");
            let td = await trs[tr].$("td");

            if (th) {
                th = await page.evaluate((el) => el.innerText, th);
                if (th && typeof th == "string" && /dimensions/i.test(th)) {
                    if (td) {
                        dimensions = await page.evaluate((el) => el.innerText, td);
                    }
                }
            }
        }
    }
    
    return dimensions;
}

async function getItemManufacturer(page) {
    let manufacturer = "";

    const lis = await page.$$("#detailBullets_feature_div ul li");
    const trs = await page.$$("#prodDetails tr");

    if (lis.length) {
        for (let li in lis) {
            const spans = await lis[li].$$("span span");
            if (spans.length) {
                const spanLabel = await page.evaluate((el) => el.innerText, spans[0]);
                if (spanLabel && typeof spanLabel == "string" && spanLabel.length < 26 && /Manufacturer/i.test(spanLabel)) {
                    if (spans[1]) {
                        manufacturer = await page.evaluate((el) => el.innerText, spans[1]);
                    }
                }
            }
        }
    } else if(trs.length) {
        for (let tr in trs) {
            let th = await trs[tr].$("th");
            let td = await trs[tr].$("td");

            if (th) {
                th = await page.evaluate((el) => el.innerText, th);
                if (th && typeof th == "string" && th.length < 26 && ((/Manufacture/i.test(th) || /Manufacturer/i.test(th)) && !(/Discontinued/i.test(th)))) {
                    if (td) {
                        manufacturer = await page.evaluate((el) => el.innerText, td);
                    }
                }
            }
        }
    }
    
    return manufacturer;
}

async function getItemBrand(page) {
    let brand = "";

    const lis = await page.$$("#detailBullets_feature_div ul li");
    const trs = await page.$$("#prodDetails tr");

    if (lis.length) {
        for (let li in lis) {
            const spans = await lis[li].$$("span span");
            if (spans.length) {
                const spanLabel = await page.evaluate((el) => el.innerText, spans[0]);
                if (spanLabel && typeof spanLabel == "string" && /Brand/i.test(spanLabel)) {
                    if (spans[1]) {
                        brand = await page.evaluate((el) => el.innerText, spans[1]);
                    }
                }
            }
        }
    } else if(trs.length) {
        for (let tr in trs) {
            let th = await trs[tr].$("th");
            let td = await trs[tr].$("td");

            if (th) {
                th = await page.evaluate((el) => el.innerText, th);
                if (th && typeof th == "string" && /Brand/i.test(th)) {
                    if (td) {
                        brand = await page.evaluate((el) => el.innerText, td);
                    }
                }
            }
        }
    }
    
    return brand;
}

async function getItemDiscontinued(page) {
    let discontinued = "";

    const lis = await page.$$("#detailBullets_feature_div ul li");
    const trs = await page.$$("#prodDetails tr");

    if (lis.length) {
        for (let li in lis) {
            const spans = await lis[li].$$("span span");
            if (spans.length) {
                const spanLabel = await page.evaluate((el) => el.innerText, spans[0]);
                if (spanLabel && typeof spanLabel == "string" && /Discontinued/i.test(spanLabel)) {
                    if (spans[1]) {
                        discontinued = await page.evaluate((el) => el.innerText, spans[1]);
                    }
                }
            }
        }
    } else if(trs.length) {
        for (let tr in trs) {
            let th = await trs[tr].$("th");
            let td = await trs[tr].$("td");

            if (th) {
                th = await page.evaluate((el) => el.innerText, th);
                if (th && typeof th == "string" && /Discontinued/i.test(th)) {
                    if (td) {
                        discontinued = await page.evaluate((el) => el.innerText, td);
                    }
                }
            }
        }
    }
    
    return discontinued;
}


async function scrape(browser, urlTemplate, fnsku) {
    const page = await browser.newPage();
    page.setUserAgent("Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36");
    
    const url = urlTemplate.replace("{fnsku}", fnsku);
    await page.goto(url);
    await page.waitForSelector("div.nav-logo-base.nav-sprite");

    const Item = {
        Found: 0,
        ItemASIN: fnsku,
        ItemName: "",
        ItemQuantity: 0,
        AmazonPrice: 0,
        ItemSpecialPrice: 0,
        ItemEAN: "",
        ItemSKU: "",
        ModelNumber: "",
        LotNumber: 400,
        ItemStatus: 0,
        ItemDescription: "",
        ItemDepartments: [],
        DateFirstAvailable: "",
        ItemManufacturer: "",
        ItemDimensions: "",
        ItemDiscontinued: "",
        ItemBrand: "",
        ItemImages: [],
        url: url,
    };

    // Check if Item available
    const html = await page.content();
    if (html.indexOf("widgetId=messaging-messages-no-results") < 0) {
        Item.Found = 1;

        // Get departments
        Item.ItemDepartments = await getDepartments(page);
        
        // Get name
        Item.ItemName = await getName(page);
        
        // Get Item details URL
        const ItemDetailURL = await getItemDetailsURL(page);

        if (ItemDetailURL) {
            Item.url = ItemDetailURL;

            await page.goto(ItemDetailURL, { waitUntil: "load" });

            // Get price
            Item.AmazonPrice = await getItemPrice(page);

            // Get description
            Item.ItemDescription = await getDescription(page);

            // Get images
            Item.ItemImages = await getImages(page);

            // Get model number
            Item.ModelNumber =await getModelNumber(page);

            // Get date first available
            Item.DateFirstAvailable = await getDateFirstAvailable(page);

            // Get dimensions
            Item.ItemDimensions = await getItemDimensions(page);

            // Get manufacturer
            Item.ItemManufacturer = await getItemManufacturer(page);

            // Get brand
            Item.ItemBrand = await getItemBrand(page);

            // Get ItemDiscontinued
            Item.ItemDiscontinued = await getItemDiscontinued(page);
        }
    }

    page.close();

    return Item;
}

async function getItemInfo(browser, csvParser, itemIn) {
    try {
        const urlTemplate = "https://www.amazon.ae/s?k={fnsku}&language=en_AE";
        const urlTemplateArabic = "https://www.amazon.ae/s?k={fnsku}&language=ar_AE";

        const itemEng = await scrape(browser, urlTemplate, itemIn.ASIN);
        const itemArabic = await scrape(browser, urlTemplateArabic, itemIn.ASIN);

        itemEng.ItemQuantity = Number(itemIn.Quantity);

        itemEng.ItemNameArabic = itemArabic.ItemName
        itemEng.ItemDescriptionArabic = itemArabic.ItemDescription;
        
        itemEng.ItemDepartments = itemEng.ItemDepartments.join("|");
        itemEng.ItemImages = itemEng.ItemImages.join(",");
        itemEng.AmazonPrice = Number(itemEng.AmazonPrice);
        itemEng.ItemSpecialPrice = Math.ceil(itemEng.AmazonPrice/2.00);
        
        fs.appendFile(outputFile, csvParser.parse(itemEng), function (err) {});
        console.log(itemEng);
        console.log("\n");
    } catch (err) {
        if (err.name == "TimeoutError") {
            console.log(`${itemIn.ASIN} Timed out.`)
            console.log("Retrying. ...");
            getItemInfo(browser, csvParser, itemIn);
        } else {
            console.error(err);
        }
    }
}

(async () => {
    // const fnskus = fs.readFileSync(file, {encoding: "utf-8"}).split("\n");
    const itemsIn = await csvtojson().fromFile(inputFile);
    const browser = await puppeteer.launch();
    const csvParser = new Parser();

    for (let i = 0; i < itemsIn.length; i++) {
        await getItemInfo(browser, csvParser, itemsIn[i]);
    }

    browser.close();
})();
