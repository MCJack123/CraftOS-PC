const ejs = require("ejs");
const fetch = require("node-fetch");
const fs = require("fs/promises");
const highlight = require("highlight.js/lib/core");
const imageSize = require("image-size");
const marked = require("marked");
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
        return highlight.highlight(lang, code).value;
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
}).catch(err => {
    console.error(err);
    process.exit(1);
});

fetch("https://api.github.com/repos/MCJack123/CraftOS-PC/contents/build/nightly").then(res => res.json()).then(data => {
    data.sort(function(a, b) {
        if (!a.name.endsWith(".exe")) return -1;
        if (!b.name.endsWith(".exe")) return 1;
        let as = new Date(a.name.match(/\d{2}-\d{2}-\d{2}/)[0].replace(/-/g, '/'));
        let bs = new Date(b.name.match(/\d{2}-\d{2}-\d{2}/)[0].replace(/-/g, '/'));
        return bs.getTime() - as.getTime();
    });
    let entries = "";
    for (let i = 0; i < data.length; i++) {
        if (data[i].name === "index.html" || data[i].name === "index.js") continue;
        let text = (new Date(data[i].name.match(/\d{2}-\d{2}-\d{2}/)[0].replace(/-/g, '/'))).toLocaleDateString(undefined, {month: "long", day: "numeric", year: "numeric"});
        entries += `            <li><a href="${data[i].name}">${text}</a></li>\n`
    }
    return ejs.renderFile("src/nightly.ejs", {entries: entries});
}).then(data => fs.writeFile("build/nightly/index.html", data, {encoding: "utf8"}))
.catch(err => {
    console.error(err);
    process.exit(1);
});
