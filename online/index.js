// NOTE TO SELF: When updating WASM, make sure to add Module.disableEvents in 
// registerOrRemoveHandler/jsEventHandler (around line 8300)

function request(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) callback(xhr.responseText);
    }
    xhr.send();
}

var tabs = [{name: "Computer 0", type: "Terminal", id: 1}]
var terminals = {}
var icon_data = {}
var editor = null
var monaco = null
var languageIds = {}
var currentFile = null
var selectedTab = 0
var changingTab = false
var selectedBrowser = 0

function activateTab(k) {
    currentFile = k
    if (tabs[k].type !== "Terminal") {
        document.getElementById("editor-terminal").style.zIndex = -1000;
        document.getElementById("editor-terminal").style.position = "absolute";
        document.getElementById("editor-content").style.zIndex = 1000;
        document.getElementById("editor-content").style.display = "inherit";
        changingTab = true;
        editor.setValue(tabs[k].content);
        monaco.editor.setModelLanguage(editor.getModel(), languageIds[tabs[k].name.split('.').slice(-1)[0].toLowerCase()]);
        editor.setScrollTop(tabs[k].scroll.top);
        editor.setScrollLeft(tabs[k].scroll.left);
        Module.disableEvents = true;
        changingTab = false;
    } else {
        document.getElementById("editor-terminal").style.zIndex = 1000;
        document.getElementById("editor-terminal").style.position = "relative";
        document.getElementById("editor-content").style.zIndex = -1000;
        document.getElementById("editor-content").style.display = "none";
        if (typeof window.selectRenderTarget === "function") window.selectRenderTarget(tabs[k].id);
        Module.disableEvents = false;
    }
    selectedTab = k
}

function reloadTabs() {
    document.getElementById("editor-tabbar").innerHTML = "";
    if (tabs.length == 0) {
        document.getElementById("editor-content").style.display = "none";
        document.getElementById("editor-default").style.display = "flex";
        document.getElementById("editor-terminal").style.zIndex = -1000;
        document.getElementById("editor-terminal").style.position = "absolute";
        Module.disableEvents = true;
        return;
    } else {
        document.getElementById("editor-default").style.display = "none";
    }
    for (let tabid = 0; tabid < tabs.length; tabid++) {
        let tab = tabs[tabid];
        let ell = document.createElement("div");
        let el = document.createElement("div");
        ell.onclick = function() {
            activateTab(tabid);
            for (var e of document.getElementById("editor-tabbar").children) e.classList = "editor-tab";
            ell.classList = "editor-tab selected";
        }
        if (tabid !== selectedTab) ell.className = "editor-tab";
        else {
            ell.className = "editor-tab selected";
            activateTab(tabid);
        }
        let img = document.createElement("span");
        img.classList = "editor-tab-icon";
        img.style.fontFamily = "Seti-Icons";
        img.style.fontSize = "14pt";
        var ext = tab.name.split('.').slice(-1)[0].toLowerCase();
        if (tab.type === "Terminal") {
            img.style.background = "url(computer.svg)";
            img.style.width = "12px";
        } else if (icon_data.fileNames[tab.name] !== undefined) {
            img.innerHTML = "&#x" + icon_data.iconDefinitions[icon_data.fileNames[tab.name]].fontCharacter.substr(1) + ";";
            img.style.color = icon_data.iconDefinitions[icon_data.fileNames[tab.name]].fontColor;
        } else if (languageIds[ext] !== undefined && icon_data.languageIds[languageIds[ext]] !== undefined) {
            img.innerHTML = "&#x" + icon_data.iconDefinitions[icon_data.languageIds[languageIds[ext]]].fontCharacter.substr(1) + ";";
            img.style.color = icon_data.iconDefinitions[icon_data.languageIds[languageIds[ext]]].fontColor;
        } else if (icon_data.fileExtensions[ext] !== undefined) {
            img.innerHTML = "&#x" + icon_data.iconDefinitions[icon_data.fileExtensions[ext]].fontCharacter.substr(1) + ";";
            img.style.color = icon_data.iconDefinitions[icon_data.fileExtensions[ext]].fontColor;
        } else if (icon_data.languageIds[ext] !== undefined) {
            img.innerHTML = "&#x" + icon_data.iconDefinitions[icon_data.languageIds[ext]].fontCharacter.substr(1) + ";";
            img.style.color = icon_data.iconDefinitions[icon_data.languageIds[ext]].fontColor;
        } else {
            img.innerHTML = "&#x" + icon_data.iconDefinitions["_default"].fontCharacter.substr(1) + ";";
            img.style.color = icon_data.iconDefinitions["_default"].fontColor;
        }
        el.appendChild(img);
        var txt = document.createElement("span");
        txt.innerText = tab.name;
        txt.style.userSelect = "none";
        txt.style.webkitUserSelect = "none";
        el.appendChild(txt);
        let x = document.createElement("span");
        if (tab.type !== "File" || tab.saved) x.classList = "fas fa-times editor-tab-button saved";
        else x.classList = "fas fa-circle editor-tab-button";
        x.onclick = function() {
            tabs.splice(tabid, 1);
            if (selectedTab >= tabs.length) selectedTab = tabs.length - 1;
            reloadTabs();
            event.stopPropagation();
        }
        if (tab.type !== "File" || tab.saved) {
            x.onmouseenter = function() {x.style.opacity = 1;}
            x.onmouseleave = function() {x.style.opacity = null;}
        }
        el.appendChild(x);
        ell.appendChild(el);
        document.getElementById("editor-tabbar").appendChild(ell);
    }
}

// apparently FS.isDir is broken?
function isDir(path) {
    var a;
    try {
        a = FS.readdir(path);
    } catch {
        return false;
    }
    return a !== undefined;
}

// path = FS path to read, element = UL element to add items to
function updateBrowserLists(path, element) {
    if (selectedBrowser !== 0) return;
    element.innerHTML = "";
    for (let p of FS.readdir(path)) {if (p !== "." && p !== "..") {
        var ell = document.createElement("li");
        var el = document.createElement("span");
        el.classList = "browser-item"
        el.style.justifyItems = "top";
        var txt = document.createElement("span");
        txt.innerText = " " + p;
        if (isDir(FS.absolutePath(p, path))) {
            //el.classList = "fas";
        } else {
            var img = document.createElement("span");
            img.style.fontFamily = "Seti-Icons";
            img.style.fontSize = "14pt";
            img.style.lineHeight = 1.0;
            var ext = p.split('.').slice(-1)[0].toLowerCase();
            if (icon_data.fileNames[p] !== undefined) {
                img.innerHTML = "&#x" + icon_data.iconDefinitions[icon_data.fileNames[p]].fontCharacter.substr(1) + ";";
                img.style.color = icon_data.iconDefinitions[icon_data.fileNames[p]].fontColor;
            } else if (languageIds[ext] !== undefined && icon_data.languageIds[languageIds[ext]] !== undefined) {
                img.innerHTML = "&#x" + icon_data.iconDefinitions[icon_data.languageIds[languageIds[ext]]].fontCharacter.substr(1) + ";";
                img.style.color = icon_data.iconDefinitions[icon_data.languageIds[languageIds[ext]]].fontColor;
            } else if (icon_data.fileExtensions[ext] !== undefined) {
                img.innerHTML = "&#x" + icon_data.iconDefinitions[icon_data.fileExtensions[ext]].fontCharacter.substr(1) + ";";
                img.style.color = icon_data.iconDefinitions[icon_data.fileExtensions[ext]].fontColor;
            } else if (icon_data.languageIds[ext] !== undefined) {
                img.innerHTML = "&#x" + icon_data.iconDefinitions[icon_data.languageIds[ext]].fontCharacter.substr(1) + ";";
                img.style.color = icon_data.iconDefinitions[icon_data.languageIds[ext]].fontColor;
            } else {
                img.innerHTML = "&#x" + icon_data.iconDefinitions["_default"].fontCharacter.substr(1) + ";";
                img.style.color = icon_data.iconDefinitions["_default"].fontColor;
            }
            el.appendChild(img);
        }
        el.appendChild(txt);
        ell.appendChild(el);
        if (isDir(FS.absolutePath(p, path))) {
            var ul = document.createElement("ul");
            ul.classList = "browser-list";
            ul.style.display = "flex";
            updateBrowserLists(FS.absolutePath(p, path), ul);
            ell.appendChild(ul);
        } else {
            ell.onclick = function() {
                for (var tab = 0; tab < tabs.length; tab++) {
                    if (tabs[tab].type === "File" && tabs[tab].path === FS.absolutePath(p, path)) {
                        selectedTab = tab;
                        reloadTabs();
                        return;
                    }
                }
                selectedTab = tabs.push({name: p, path: FS.absolutePath(p, path), content: FS.readFile(FS.absolutePath(p, path), {encoding: "utf8"}), type: "File", scroll: {left: 0, top: 0}, saved: true}) - 1;
                reloadTabs();
            }
        }
        element.appendChild(ell);
    }}
}

function updateTerminalList() {
    if (selectedBrowser !== 1) return;
    document.getElementById("browser-root").innerHTML = "";
    for (let terms in terminals) {
        let term = (typeof terms == "string" ? parseInt(terms) : terms);
        var el = document.createElement("li");
        el.classList = "browser-item";
        el.style.justifyItems = "top";
        el.innerText = terminals[term];
        el.onclick = function() {
            for (var tab = 0; tab < tabs.length; tab++) {
                if (tabs[tab].type === "Terminal" && tabs[tab].id === term) {
                    selectedTab = tab;
                    reloadTabs();
                    return;
                }
            }
            selectedTab = tabs.push({name: terminals[term], id: term, type: "Terminal"}) - 1;
            reloadTabs();
        }
        document.getElementById("browser-root").appendChild(el);
    }
}

function sidebarSelect(num) {
    selectedBrowser = num;
    for (var el of document.getElementById("sidebar").children) el.classList = "sidebar-button";
    document.getElementById("sidebar").children[num].classList = "sidebar-button selected";
    if (num === 0) {
        document.getElementById("browser-title").innerText = "Explorer";
        document.getElementById("browser-root").innerHTML = '<li style="margin-left: 0px; padding-left: 0px;"><span class="browser-title">Computer 0</span><ul class="browser-list" id="browser-temp-root"></ul></li>';
        updateBrowserLists("/user-data/computer/0", document.getElementById("browser-temp-root"));
        CollapsibleLists.applyTo(document.getElementById("browser-root"));
    } else if (num === 1) {
        document.getElementById("browser-title").innerText = "Terminals";
        updateTerminalList();
    }
}

window.onWindowCreate = function(id, title) {
    terminals[id] = title.replace("CraftOS Terminal: ", "");
    this.updateTerminalList();
}

window.onWindowDestroy = function(id) {
    delete terminals[id];
    var reload = false;
    for (var tabid = 0; tabid < this.tabs.length; tabid++) {
        if (this.tabs[tabid].type == "Terminal" && this.tabs[tabid].id == id) {
            this.tabs.splice(tabid--, 1);
            reload = true;
        }
    }
    if (reload) this.reloadTabs();
    this.updateTerminalList();
}

require.config({ paths: { 'vs': 'vendor/vs' }});

require(['vs/editor/editor.main'], function() {
    window.monaco = monaco
    editor = monaco.editor.create(document.getElementById('editor-content'), {
        value: "",
        language: 'javascript',
        theme: 'vs-dark'
    });
    var ids = monaco.languages.getLanguages();
    for (var id of ids) {
        if (id.extensions !== undefined) {
            for (var ext of id.extensions) {
                languageIds[ext.replace(/^\./, "")] = id.id;
            }
        }
    }
    editor.onDidChangeModelContent(() => {
        if (!changingTab) {
            tabs[selectedTab].content = editor.getModel().getValue();
            var wasSaved = tabs[selectedTab].saved;
            tabs[selectedTab].saved = false;
            if (wasSaved) reloadTabs();
        }
    });
    editor.onDidScrollChange((ev) => {if (!changingTab) tabs[selectedTab].scroll = {left: ev.scrollLeft, top: ev.scrollTop}});
    editor.onKeyDown((ev) => {
        if (!changingTab && ev.code === "KeyS" && (ev.metaKey || ev.ctrlKey) && tabs[selectedTab].type == "File") {
            console.log("Saved!");
            FS.writeFile(tabs[selectedTab].path, tabs[selectedTab].content);
            tabs[selectedTab].saved = true;
            reloadTabs();
        }
    })
    request("vendor/seti/vs-seti-icon-theme.json", function(data) {
        icon_data = JSON.parse(data);
        reloadTabs();
    });
});

