const ejs = require("ejs");
const fetch = require("node-fetch");
const fs = require("fs/promises");
const highlight = require("highlight.js/lib/core");
const imageSize = require("image-size");
const {marked} = require("marked");
const process = require("process");
const details = require("./src/homepage-details.json");
const docsInfo = require("./src/docs-info.json");

highlight.registerLanguage('c', require("highlight.js/lib/languages/c"));
highlight.registerLanguage('c++', require("highlight.js/lib/languages/cpp"));
highlight.registerLanguage('lua', require("highlight.js/lib/languages/lua"));
highlight.registerLanguage('json', require("highlight.js/lib/languages/json"));
highlight.registerLanguage('sh', require("highlight.js/lib/languages/bash"));
marked.setOptions({
    highlight: function(code, lang) {
        if (lang !== "") return highlight.highlight(lang, code).value;
    }
});

let sizes = {}
fs.readdir("build/images").then(imageFiles => {
    for (let file of imageFiles) if (file !== "webp" && file !== ".DS_Store") sizes[file.replace(".png", "")] = imageSize("build/images/" + file);

    fetch("https://api.github.com/repos/MCJack123/craftos2/releases/latest", {headers: {"User-Agent": "CraftOS-PC-Build/1.0 nodejs/" + process.version}})
        .then(res => res.json())
        .then(json => ejs.renderFile("src/index.ejs", {details: details, tag: json.tag_name, imageSizes: sizes}))
        .then(str => fs.writeFile("build/index.html", str, {encoding: "utf8"}))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}).catch(err => {
    console.error(err);
    process.exit(1);
});

Promise.all([
    fs.readFile("docs/sidebar.md", {encoding: "utf8"}),
    fs.readdir("docs")
]).then(res => {
    let sidebar = marked(res[0]);
    for (let file of res[1]) {
        if (file !== "sidebar.md") {
            fs.readFile("docs/" + file, {encoding: "utf8"})
                .then(data => ejs.renderFile("src/docs.ejs", {info: docsInfo[file.match(/[^%.]+/)], sidebar: sidebar, content: marked(data)}))
                .then(data => fs.writeFile("build/docs/" + file.replace(".md", ".html"), data, {encoding: "utf8"}))
                .catch(err => {
                    console.error(err);
                    process.exit(1);
                });
        }
    }
}).catch(err => {
    console.error(err);
    process.exit(1);
});

fs.readdir("build/nightly").then(data => {
    let windata = [], androiddata = [];
    data.forEach(el => {
        if (el.endsWith(".exe")) windata.push(el);
        else if (el.endsWith(".apk")) androiddata.push(el);
    });
    windata.sort(function(a, b) {
        let as = new Date(a.match(/\d{2}-\d{2}-\d{2}/)[0].replace(/-/g, '/'));
        let bs = new Date(b.match(/\d{2}-\d{2}-\d{2}/)[0].replace(/-/g, '/'));
        return bs.getTime() - as.getTime();
    });
    androiddata.sort(function(a, b) {
        let as = new Date(a.match(/\d{2}-\d{2}-\d{2}(_\d{1,2}.\d{2})?/)[0].replace(/-/g, '/').replace(/_/g, " ").replace(/\./g, ":"));
        let bs = new Date(b.match(/\d{2}-\d{2}-\d{2}(_\d{1,2}.\d{2})?/)[0].replace(/-/g, '/').replace(/_/g, " ").replace(/\./g, ":"));
        return bs.getTime() - as.getTime();
    });
    let entries = "", entriesAndroid = "";
    for (let i = 0; i < windata.length; i++) {
        let text = (new Date(windata[i].match(/\d{2}-\d{2}-\d{2}/)[0].replace(/-/g, '/'))).toLocaleDateString(undefined, {month: "long", day: "numeric", year: "numeric"});
        entries += `            <li><a href="${windata[i]}">${text}</a></li>\n`
    }
    for (let i = 0; i < androiddata.length; i++) {
        let text = (new Date(androiddata[i].match(/\d{2}-\d{2}-\d{2}/)[0].replace(/-/g, '/'))).toLocaleDateString(undefined, {month: "long", day: "numeric", year: "numeric"});
        entriesAndroid += `            <li><a href="${androiddata[i]}">${text}</a></li>\n`
    }
    return ejs.renderFile("src/nightly.ejs", {entries: entries, entriesAndroid: entriesAndroid});
}).then(data => fs.writeFile("build/nightly/index.html", data, {encoding: "utf8"}))
.catch(err => {
    console.error(err);
    process.exit(1);
});
