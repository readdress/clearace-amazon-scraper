const csvtojson = require("csvtojson");
const { Parser } = require("json2csv");
const moment = require("moment");
var json2xls = require('json2xls');
const util = require('util');
const fs = require("fs");

(async () => {

    //==================================

    // Merge batches
    // const batches = fs.readdirSync("./batches1Reviewed");
    
    

    // const found = [];
    // const notFound = [];

    // for (let i = 0; i < reviewed.length; i++) {
    //     if (reviewed[i].Found == "1") {
    //         found.push(reviewed[i]);
    //     } else {
    //         notFound.push(reviewed[i]);
    //     }
    // }


    // let input = await csvtojson().fromFile(`./batches1Reviewed/all 8479 units_with price options.csv`);

    // const withPrices = [];
    // const withOutPrices = [];

    // const withOnePriceEach = [];

    // for (let i = 0; i < input.length; i++) {
    //     const item = input[i];
    //     const DataPrice = Number(item.DataPrice1) > 0 ? Number(item.DataPrice1) : Number(item.DataPrice2);
    //     const SpecialPrice = Number(item.SpecialPrice1) > 0 ? Number(item.SpecialPrice1) : Number(item.SpecialPrice2);
    //     withOnePriceEach.push({ASIN: item.ASIN, DataPrice, SpecialPrice});
    // }

    // // console.log(withOnePriceEach.length);

    // const priceMerger = {};
    // const clearPrices = {};
    // const varryingPrices = {};
    // const varryingPricesArray = [];
    // for (let i = 0; i < withOnePriceEach.length; i++) {
    //     const eachOnePrice = withOnePriceEach[i];
        
    //     for (let x = 0; x < withOnePriceEach.length; x++) {
    //         const comp = withOnePriceEach[x];


    //         const max = Math.max(eachOnePrice.SpecialPrice, comp.SpecialPrice);
    //         const min = Math.min(eachOnePrice.SpecialPrice, comp.SpecialPrice);
            

    //         const dif = max - min;
    //         // if (eachOnePrice.ASIN == comp.ASIN && ((eachOnePrice.DataPrice != comp.DataPrice) || (eachOnePrice.SpecialPrice != comp.SpecialPrice))) {
    //         if (eachOnePrice.ASIN == comp.ASIN && dif > 25) {
    //             // console.log(eachOnePrice);
    //             // console.log(comp);
    //             // console.log("\n");
    //             varryingPrices[eachOnePrice.ASIN] = eachOnePrice;
    //             varryingPricesArray.push(eachOnePrice.ASIN);
    //             // console.log(eachOnePrice);
    //             // console.log(comp);
    //             // console.log(dif);
    //             // console.log("\n");
    //             continue;
    //         } else if(eachOnePrice.ASIN == comp.ASIN) {
    //             // clearPrices[eachOnePrice.ASIN] = eachOnePrice;

    //             const existing = priceMerger[eachOnePrice.ASIN];
    //             // console.log("existing", existing);
    //             // console.log("comp", comp);
    //             // console.log("\n");
    //             if (!existing) {
    //                 priceMerger[eachOnePrice.ASIN] = eachOnePrice;
    //             } else {
    //                 priceMerger[existing.ASIN] = {
    //                     ...existing,
    //                     DataPrice: Math.max(existing.DataPrice, comp.DataPrice),
    //                     SpecialPrice: Math.max(existing.SpecialPrice, comp.SpecialPrice)
    //                 }
    //             }
                
    //         }
            
    //     }

        // if (!priceMerger[eachOnePrice.ASIN]) {
        //     priceMerger[eachOnePrice.ASIN] = eachOnePrice;
        //     clearPrices[eachOnePrice.ASIN] = eachOnePrice;
        // } else {

            // const existing = priceMerger[eachOnePrice.ASIN];

            // priceMerger[existing.ASIN] = {
            //     ...existing,
            //     DataPrice: Math.max(existing.DataPrice, eachOnePrice.DataPrice),
            //     SpecialPrice: Math.max(existing.SpecialPrice, eachOnePrice.SpecialPrice)
            // }

        //     if () {

        //     }

        //     // console.log("Existing:", existing);
        //     // console.log("In comming", eachOnePrice);
        //     // console.log("Final", priceMerger[existing.ASIN]);
        //     // console.log("\n");

        // }
    // }

    // console.log("clearPrices", clearPrices);
    // console.log("varryingPrices", varryingPricesArray.length);

    // const priceMergerArray = [];

    // for (let asin in priceMerger) {
    //     console.log(priceMerger[asin]);
    // }
    
    let final = await csvtojson().fromFile(`./batches1Reviewed/FinalWith_EAN_UPC_added.csv`);
    // let csvParser2 = new Parser({ excelStrings: true });
    
    
    fs.writeFileSync(`./batches1Reviewed/FinalWith_EAN_UPC_added-text.xls`, xls, "binary");



  
    
    // const fixed = [];
    // const notFixed = [];
    // const productsWithVarryingPrices = [];
    // for (let i = 0; i < toFix.length; i++) {
    //     const asin = toFix[i].ItemASIN;
    //     if (varryingPricesArray.indexOf(asin) >= 0) {
    //         productsWithVarryingPrices.push(asin);
    //         notFixed.push(toFix[i]);
    //         continue;
    //     }
    //     const fixedPrice = priceMerger[asin];

    //     if (fixedPrice) {
    //         fixed.push({
    //             ...toFix[i],
    //             AmazonPrice: fixedPrice.DataPrice,
    //             ItemSpecialPrice: Math.ceil(fixedPrice.SpecialPrice)
    //         });
    //     } else {
    //         notFixed.push(toFix[i]);
    //     }

    // }

    // console.log(fixed.length);
    // console.log(notFixed.length)

    // let csvParser2 = new Parser();
    // fs.writeFileSync(`./batches1Reviewed/fixed_last.csv`, csvParser2.parse(fixed), "utf-8");

    // let csvParser3 = new Parser();
    // fs.writeFileSync(`./batches1Reviewed/notFixed_last.csv`, csvParser3.parse(notFixed), "utf-8");


















    // console.log(withPrices.length);
    // console.log(withOutPrices.length);

    // let csvParser2 = new Parser();
    // fs.writeFileSync(`./batches1Reviewed/NewBatchFixedPrices_WITH_PRICES.csv`, csvParser2.parse(withPrices), "utf-8");

    // let csvParser3 = new Parser();
    // fs.writeFileSync(`./batches1Reviewed/NewBatchFixedPrices_WITHOUT_PRICES.csv`, csvParser3.parse(withOutPrices), "utf-8");

    // fs.writeFileSync(`./batches1Reviewed/notFound2.csv`, csvParser.parse(notFound), "utf-8");
    // let toRescraped = await csvtojson().fromFile(`./batches1Reviewed/ToRescrape.csv`);
    // let rescraped = await csvtojson().fromFile(`./batches1Reviewed/Rescraped.csv`);
    // console.log("rescraped", rescraped.length);
    // console.log("toRescraped", toRescraped.length);

    // const finishedTemp = [];
    // const toBeRescrapedTemp = [];

    // for (let i = 0; i < toRescraped.length; i++) {
    //     let finished = false
    //     for (let x = 0; x < rescraped.length; x++) {
    //         if (toRescraped[i].ASIN == rescraped[x].ItemASIN) {
    //             finishedTemp.push(toRescraped[i]);
    //             finished = true;
    //         } 
    //     }
    //     if (!finished) {
    //         toBeRescrapedTemp.push(toRescraped[i]);
    //     }
    // }

    // console.log("finishedTemp", finishedTemp.length);
    // console.log("toBeRescrapedTemp", toBeRescrapedTemp.length);

    // let csvParser2 = new Parser();
    // fs.writeFileSync(`./batches1Reviewed/finishedTemp.csv`, csvParser2.parse(finishedTemp), "utf-8");

    // let csvParser3 = new Parser();
    // fs.writeFileSync(`./batches1Reviewed/toBeRescrapedTemp.csv`, csvParser3.parse(toBeRescrapedTemp), "utf-8");

    // const foundNoPrice = [];
    // const foundWithPrice = [];
    // for (let i = 0; i < rescraped.length; i++) {
    //     let price = Number(rescraped[i].AmazonPrice);
    //     if (price > 0) {
    //         foundWithPrice.push(rescraped[i]);
    //     } else {
    //         foundNoPrice.push(rescraped[i]);
    //     }
    // }
    
    //==================================

    // Batching

    // const inputFile = "./New-8000-Items-duplicates-merged-not-scraped.csv";
    // const jsonArray = await csvtojson().fromFile(inputFile);
    // console.log(jsonArray.length);

    // let batchNumber = 1;
    // let batch = [];
    // for (let i = 0; i < jsonArray.length; i++) {
    //     if (batch.length < 200) {
    //         batch.push(jsonArray[i]);
    //     } else {
    //         // Close current batch
    //         const batchName = `Batch-${batchNumber}`;
    //         const csvParser = new Parser();
    //         fs.writeFileSync(`./batches/${batchName}.csv`, csvParser.parse(batch), "utf-8");

    //         // Start new batch
    //         batch = [];
    //         batchNumber += 1;
    //         batch.push(jsonArray[i]);
    //     }
    // }

    // const batchName = `Batch-${batchNumber}`;
    // const csvParser = new Parser();
    // fs.writeFileSync(`./batches/${batchName}.csv`, csvParser.parse(batch), "utf-8");

    //==================================




    
    // const distinct = {};

    // jsonArray.forEach((product) => {
    //     if (distinct[product.ASIN]) {
    //         distinct[product.ASIN].Quantity = (Number(distinct[product.ASIN].Quantity)) + (Number(product.Quantity));
    //     } else {

    //         distinct[product.ASIN] = {
    //             ...product,
    //             Quantity: Number(product.Quantity)
    //         };
    //     }
    // });

    // let total = 0;
    // const distinctArray = [];

    // for (sku in distinct) {
    //     total += distinct[sku].Quantity;
    //     distinctArray.push(distinct[sku]);
    // }
    














    // const database = "all-skus-in-the-database.txt";
    // const excelfile = "distinct-xls-fnsku.txt";

    // const database_fnskus = fs.readFileSync(database, {encoding: "utf-8"}).split("\n");
    // const excelfile_fnskus = fs.readFileSync(excelfile, {encoding: "utf-8"}).split("\n");

    // let fnsku_in_xls_and_db = [];
    // let fnsku_in_xls_not_in_db = [];

    // excelfile_fnskus.forEach((fnsku) => {
    //     if (database_fnskus.indexOf(fnsku) >= 0) {
    //         fnsku_in_xls_and_db.push(fnsku);
    //     } else {
    //         fnsku_in_xls_not_in_db.push(fnsku);
    //     }
    // });

    // fnsku_in_xls_and_db = fnsku_in_xls_and_db.map((sku) => ({
    //     FNSKU: sku
    // }));

    // fnsku_in_xls_not_in_db = fnsku_in_xls_not_in_db.map((sku) => ({
    //     FNSKU: sku
    // }));

    // console.log(fnsku_in_xls_and_db.length);
    // console.log(fnsku_in_xls_not_in_db.length);

    // const csvParser = new Parser();

    // fs.writeFileSync("fnsku_in_xls_and_db.csv", csvParser.parse(fnsku_in_xls_and_db), "utf-8");
    // fs.writeFileSync("fnsku_in_xls_not_in_db.csv", csvParser.parse(fnsku_in_xls_not_in_db), "utf-8");

    // const finalcsv = [];

    // for (let fnsku in distinct) {
    //     finalcsv.push({
    //         FNSKU: fnsku,
    //         occurrence: distinct[fnsku]
    //     });
    // }

    // const csvParser = new Parser();
    // const csv = csvParser.parse(finalcsv);
    // fs.writeFileSync("all-8479-fnsk-distinct-with-count.csv", csv, "utf-8");

    // const jsonArray = await csvtojson().fromFile(file);

    // let objects = [];

    // jsonArray.forEach(entry => {
        
    //     try {
    //         entry.desc = entry.desc.replace(/\\n/g, "");
    //         entry.cate = JSON.parse(entry.cate);

    //         entry.desc = JSON.parse(entry.desc);

    //         for (let key in entry.desc) {
    //             if (key != "ASIN") {
    //                 entry[key] = entry.desc[key]
    //             }
    //         }
    //         delete entry.desc;

    //         entry.images = JSON.parse(entry.image);
    //         entry.extraImages = [];

    //         entry.images.forEach(image => {
    //             if (image.variant == "MAIN") {
    //                 entry.image = image.hiRes ? image.hiRes : image.large ? image.large : "";
    //             } else {
    //                 if (image.hiRes) {
    //                     entry.extraImages.push(image.hiRes);
    //                 } else if (image.large) {
    //                     entry.extraImages.push(image.large);
    //                 }   
    //             }
    //         });
    //         delete entry.images;
    //     } catch (err) {

    //     }

    //     objects.push(entry);
    // });

    // fs.writeFileSync("./clearance44.js", util.inspect(objects), "utf-8");

    // const csvParser = new Parser();

    // objects = objects.map(obj => {
    //     try {
    //         obj.cate = obj.cate.join("|");
    //     } catch(err) {
    //         obj.cate = "";
    //     }

    //     try {
    //         obj.extraImages = obj.extraImages.join(",");
    //     } catch(err) {
    //         obj.extraImages = "";
    //     }
    //     return obj;
    // });
    
    // const csv = csvParser.parse(objects);
    // fs.writeFileSync("./clearance44.csv", csv, "utf-8");
    // fs.appendFile(outputFile, csv, function (err) {});

})()
