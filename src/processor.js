const csvtojson = require("csvtojson");
const { Parser } = require("json2csv");
const util = require('util');
const fs = require("fs");

(async () => {
    const database = "all-skus-in-the-database.txt";
    const excelfile = "distinct-xls-fnsku.txt";

    const database_fnskus = fs.readFileSync(database, {encoding: "utf-8"}).split("\n");
    const excelfile_fnskus = fs.readFileSync(excelfile, {encoding: "utf-8"}).split("\n");

    let fnsku_in_xls_and_db = [];
    let fnsku_in_xls_not_in_db = [];

    excelfile_fnskus.forEach((fnsku) => {
        if (database_fnskus.indexOf(fnsku) >= 0) {
            fnsku_in_xls_and_db.push(fnsku);
        } else {
            fnsku_in_xls_not_in_db.push(fnsku);
        }
    });

    fnsku_in_xls_and_db = fnsku_in_xls_and_db.map((sku) => ({
        FNSKU: sku
    }));

    fnsku_in_xls_not_in_db = fnsku_in_xls_not_in_db.map((sku) => ({
        FNSKU: sku
    }));

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
