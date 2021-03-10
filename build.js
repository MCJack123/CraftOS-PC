const ejs = require("ejs");
const fs = require("fs");
const https = require("https");
const process = require("process");
const details = require("./src/homepage-details.json");

new Promise((resolve, reject) => https.get("https://api.github.com/repos/MCJack123/craftos2/releases/latest", {headers: {"User-Agent": "CraftOS-PC-Build/1.0 nodejs/" + process.version}}, (res) => {if (res.statusCode == 200) resolve(res); else reject(new Error(res.statusMessage));}))
    .then((res) => {
        return new Promise((resolve, reject) => {
            let data = "";
            res.on("data", (d) => data += d);
            res.on("end", () => resolve(data));
            res.on("aborted", () => reject(new Error("Connection aborted")));
            res.on("error", (err) => reject(err));
        });
    }).then((data) => {
        var resp = JSON.parse(data);
        return ejs.renderFile("src/index.ejs", {details: details, tag: resp.tag_name});
    }).then((str) => {
        return new Promise((resolve, reject) => fs.writeFile("index.html", str, {encoding: "utf8"}, (err) => {if (err) reject(err); else resolve();}));
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    });
