const ejs = require("ejs");
const fetch = require("node-fetch");
const fs = require("fs/promises");
const highlight = require("highlight.js/lib/core");
const marked = require("marked");
const process = require("process");
const details = require("./src/homepage-details.json");
const docsInfo = require("./src/docs-info.json");

highlight.registerLanguage('c++', require("highlight.js/lib/languages/cpp"));
highlight.registerLanguage('lua', require("highlight.js/lib/languages/lua"));
highlight.registerLanguage('json', require("highlight.js/lib/languages/json"));
highlight.registerLanguage('sh', require("highlight.js/lib/languages/bash"));
marked.setOptions({
    highlight: function(code, lang) {
        return highlight.highlight(lang, code).value;
    }
});

fetch("https://api.github.com/repos/MCJack123/craftos2/releases/latest", {headers: {"User-Agent": "CraftOS-PC-Build/1.0 nodejs/" + process.version}})
    .then(res => res.json())
    .then(json => ejs.renderFile("src/index.ejs", {details: details, tag: json.tag_name}))
    .then(str => fs.writeFile("build/index.html", str, {encoding: "utf8"}))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

Promise.all([
    fs.readFile("docs/sidebar.md", {encoding: "utf8"}),
    fs.readdir("docs/md")
]).then(res => {
    let sidebar = marked(res[0]);
    for (let file of res[1]) {
        if (file !== "sidebar.md") {
            fs.readFile("docs/md/" + file, {encoding: "utf8"})
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
