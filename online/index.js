// NOTE TO SELF: When updating WASM, make sure to add Module.disableEvents in 
// registerOrRemoveHandler/jsEventHandler (around line 8300)
// Also, add a try around Fetch.postMessage inside initFetchWorker and call 
// window.disableTerminal() in a catch statement (around line 10950).

var CCPC_ONLINE_VERSION = "v0.9";

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
var openedExplorerItems = {}
var currentImageBlobURL = null
var searchRegex = false
var searchCaseSensitive = false;

function activateTab(k) {
    currentFile = k
    if (tabs[k].type === "Terminal") {
        document.getElementById("editor-terminal").style.zIndex = 1000;
        document.getElementById("editor-terminal").style.position = "relative";
        document.getElementById("editor-content").style.zIndex = -1000;
        document.getElementById("editor-content").style.display = "none";
        document.getElementById("editor-image").style.zIndex = -1000;
        document.getElementById("editor-image").style.display = "none";
        if (typeof window.selectRenderTarget === "function") window.selectRenderTarget(tabs[k].id);
        Module.disableEvents = false;
    } else if (tabs[k].type === "Image") {
        if (currentImageBlobURL !== null) window.URL.revokeObjectURL(currentImageBlobURL);
        currentImageBlobURL = window.URL.createObjectURL(new Blob([FS.readFile(tabs[k].path)], {type: "image/" + tabs[k].path.match(/png$|bmp$|gif$/)}));
        document.getElementById("editor-image-item").src = currentImageBlobURL;
        document.getElementById("editor-terminal").style.zIndex = -1000;
        document.getElementById("editor-terminal").style.position = "absolute";
        document.getElementById("editor-content").style.zIndex = -1000;
        document.getElementById("editor-content").style.display = "none";
        document.getElementById("editor-image").style.zIndex = 1000;
        document.getElementById("editor-image").style.display = "flex";
        Module.disableEvents = true;
    } else {
        document.getElementById("editor-terminal").style.zIndex = -1000;
        document.getElementById("editor-terminal").style.position = "absolute";
        document.getElementById("editor-content").style.zIndex = 1000;
        document.getElementById("editor-content").style.display = "inherit";
        document.getElementById("editor-image").style.zIndex = -1000;
        document.getElementById("editor-image").style.display = "none";
        changingTab = true;
        editor.setValue(tabs[k].content);
        monaco.editor.setModelLanguage(editor.getModel(), languageIds[tabs[k].name.split('.').slice(-1)[0].toLowerCase()]);
        editor.setScrollTop(tabs[k].scroll.top);
        editor.setScrollLeft(tabs[k].scroll.left);
        if (tabs[k].lineNumber !== undefined) {
            editor.revealLine(tabs[k].lineNumber);
            delete tabs[k].lineNumber;
        }
        Module.disableEvents = true;
        changingTab = false;
    }
    selectedTab = k
}

function reloadTabs() {
    document.getElementById("editor-tabbar").innerHTML = "";
    if (tabs.length == 0) {
        document.getElementById("editor-content").style.display = "none";
        document.getElementById("editor-image").style.display = "none";
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
        el.style.flexGrow = 1;
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
        ell.appendChild(el);
        ell.appendChild(x);
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
    for (var el of element.children) {
        var text = el.querySelector(".browser-item");
        text = (text.children[0].style.fontFamily === "Seti-Icons") ? text.children[1] : text.children[0];
        if (el.classList.contains("collapsibleListOpen")) openedExplorerItems[FS.absolutePath(text.innerText.replace(/^ /g, ""), path)] = true;
        else if (el.classList.contains("collapsibleListClosed")) openedExplorerItems[FS.absolutePath(text.innerText.replace(/^ /g, ""), path)] = false;
    }
    element.innerHTML = "";
    for (let p of FS.readdir(path)) {if (p !== "." && p !== "..") {
        var ell = document.createElement("li");
        var el = document.createElement("span");
        el.classList = "browser-item";
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
        } else if (p.endsWith(".png") || p.endsWith(".bmp") || p.endsWith(".jpg") || p.endsWith(".webp") || p.endsWith(".gif")) {
            el.onclick = function() {
                for (var tab = 0; tab < tabs.length; tab++) {
                    if (tabs[tab].type === "Image" && tabs[tab].path === FS.absolutePath(p, path)) {
                        selectedTab = tab;
                        reloadTabs();
                        return;
                    }
                }
                selectedTab = tabs.push({name: p.replace(/\.png$|\.bmp$|\.gif$/g, ""), path: FS.absolutePath(p, path), type: "Image"}) - 1;
                reloadTabs();
            }
        } else {
            el.onclick = function() {
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
        el.classList = "browser-item terminal";
        el.style.justifyItems = "top";
        el.style.paddingLeft = "10px";
        var img = document.createElement("img");
        img.src = "computer.svg";
        img.width = 16;
        img.height = 16;
        var txt = document.createElement("span");
        txt.style.marginLeft = 4;
        txt.innerText = terminals[term];
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
        el.appendChild(img);
        el.appendChild(txt);
        document.getElementById("browser-root").appendChild(el);
    }
}

function updateScreenshotList() {
    if (selectedBrowser !== 3) return;
    document.getElementById("browser-root").innerHTML = "";
    if (!isDir("/user-data/screenshots")) return;
    for (let f of FS.readdir("/user-data/screenshots")) {
        if (f === "." || f === "..") continue;
        let el = document.createElement("li");
        el.classList = "browser-item";
        el.style.paddingLeft = "10px";
        let img = document.createElement("i");
        img.classList = f.endsWith(".gif") ? "fas fa-film" : "far fa-image";
        let txt = document.createElement("span");
        txt.style.marginLeft = 4;
        txt.innerText = f.replace(/\.png$|\.bmp$|\.gif$/g, "");
        el.onclick = function() {
            for (var tab = 0; tab < tabs.length; tab++) {
                if (tabs[tab].type === "Image" && tabs[tab].path === f) {
                    selectedTab = tab;
                    reloadTabs();
                    return;
                }
            }
            selectedTab = tabs.push({name: f.replace(/\.png$|\.bmp$|\.gif$/g, ""), path: FS.absolutePath(f, "/user-data/screenshots"), type: "Image"}) - 1;
            reloadTabs();
        }
        el.appendChild(img);
        el.appendChild(txt);
        document.getElementById("browser-root").appendChild(el);
    }
}

function openCollapsibleList(b) {
    var c = b.classList.contains("collapsibleListClosed"), a = b.getElementsByTagName("ul");
    [].forEach.call(a, function(a) {
        for(var d = a; "LI" !== d.nodeName; ) d = d.parentNode;
        d === b && (a.style.display = c ? "block" : "none");
    });
    b.classList.remove("collapsibleListOpen");
    b.classList.remove("collapsibleListClosed");
    0 < a.length && b.classList.add("collapsibleList" + (c ? "Open" : "Closed"));
}

function updateBrowserCollapsibles(path, element) {
    if (element.parentElement.parentElement.id === "browser-root") openCollapsibleList(element.parentElement);
    for (var el of element.children) {
        var text = el.querySelector(".browser-item");
        text = (text.children[0].style.fontFamily === "Seti-Icons") ? text.children[1] : text.children[0];
        if (openedExplorerItems[FS.absolutePath(text.innerText.replace(/^ /g, ""), path)] === true) openCollapsibleList(el);
        if (el.classList.contains("collapsibleListClosed") || el.classList.contains("collapsibleListOpen")) updateBrowserCollapsibles(FS.absolutePath(text.innerText.replace(/^ /g, ""), path), el.querySelector("ul"));
    }
}

var DISABLE_PROPAGATION = 'onkeydown="event.stopPropagation()" onkeyup="event.stopPropagation()" onkeypress="event.stopPropagation()"';

function sidebarSelect(num) {
    selectedBrowser = num;
    for (var el of document.getElementById("sidebar").children) el.classList = "sidebar-button";
    document.getElementById("sidebar").children[num].classList = "sidebar-button selected";
    if (num === 0) { // file browser
        document.getElementById("browser-title").innerText = "Explorer";
        document.getElementById("browser-root").innerHTML = '<li style="margin-left: 0px; padding-left: 0px;" onmouseenter="document.getElementsByClassName(\'browser-title-buttons\')[0].style.display = \'inherit\'" onmouseleave="document.getElementsByClassName(\'browser-title-buttons\')[0].style.display = \'none\'"><span class="browser-title">Computer 0<span class="browser-title-buttons" style="display: none"><i class="far fa-file" onclick="event.stopPropagation(); newFile()"><i class="fas fa-plus" style="position: relative; font-size: 7pt; left: -13pt; top: -3pt"></i></i> <i class="far fa-folder" style="padding-left: 5px;" onclick="event.stopPropagation(); newFolder()"><i class="fas fa-plus" style="position: relative; font-size: 7pt; left: -16pt; top: -3pt"></i></i> <i class="fas fa-redo-alt" onclick="event.stopPropagation(); sidebarSelect(0)"></i></span></span><ul class="browser-list" id="browser-temp-root"></ul></li>';
        updateBrowserLists("/user-data/computer/0", document.getElementById("browser-temp-root"));
        CollapsibleLists.applyTo(document.getElementById("browser-root"));
        updateBrowserCollapsibles("/user-data/computer/0", document.getElementById("browser-temp-root"));
    } else if (num === 1) { // terminal browser
        document.getElementById("browser-title").innerText = "Terminals";
        updateTerminalList();
    } else if (num === 2) { // search panel
        document.getElementById("browser-title").innerText = "Search";
        document.getElementById("browser-root").innerHTML = `<div style="display: block"><input type="text" id="browser-search-find" placeholder="Search" oninput="event.stopPropagation(); findText()" ${DISABLE_PROPAGATION}><code id="browser-search-regex" class="off" onclick="toggleRegex()">.*</code><br><input type="text" id="browser-search-replace" placeholder="Replace" ${DISABLE_PROPAGATION}><i class="fas fa-sync-alt disabled" id="browser-search-replace-button" onclick="replaceText()"></i></div><ul id="browser-search-matches"></ul>`
    } else if (num === 3) { // screenshot browser
        document.getElementById("browser-title").innerText = "Screenshots";
        updateScreenshotList();
    } else if (num === 4) { // file upload/download
        document.getElementById("browser-title").innerText = "Upload/Download";
        document.getElementById("browser-root").innerHTML = `<div style="display: block"><span class="browser-title">Download</span><br><div style="padding-left: 10px">
<input type="number" value="0" min="0" id="browser-download-id" placeholder="Computer ID" style="width: 25%">
<button type="button" onclick="downloadZip(document.getElementById('browser-download-id').value)">Download ZIP</button>
</div><br><span class="browser-title">Upload</span><br><div style="padding-left: 10px">
<input type="file" id="browser-upload-file" multiple><br>
<input type="text" placeholder="Parent directory" id="browser-upload-path" oninput="event.stopPropagation()" ${DISABLE_PROPAGATION}><br>
<button type="button" onclick="uploadFile()">Upload File</button></div></div>`;
    }
}

function newFile() {
    let p = prompt("Enter the path of the new file:");
    if (p == null) return;
    let path = FS.absolutePath(p, "/user-data/computer/0");
    FS.createFile(FS.analyzePath(path).parentPath, p.match(/[^/]+$/)[0], {}, true, true);
    FS.syncfs(false, ()=>{});
    sidebarSelect(0);
    for (var tab = 0; tab < tabs.length; tab++) {
        if (tabs[tab].type === "File" && tabs[tab].path === path) {
            selectedTab = tab;
            reloadTabs();
            return;
        }
    }
    selectedTab = tabs.push({name: path.match(/[^/]+$/)[0], path: path, content: "", type: "File", scroll: {left: 0, top: 0}, saved: true}) - 1;
    reloadTabs();
}

function newFolder() {
    let p = prompt("Enter the path of the new folder:", null);
    if (p == null) return;
    FS.mkdir(FS.absolutePath(p, "/user-data/computer/0"));
    FS.syncfs(false, ()=>{});
    sidebarSelect(0);
}

function packZip(zip, path) {
    for (let f of FS.readdir(path)) {
        if (f == "." || f == "..") continue;
        if (isDir(FS.absolutePath(f, path))) packZip(zip.folder(f), FS.absolutePath(f, path));
        else zip.file(f, FS.readFile(FS.absolutePath(f, path)));
    }
}

function downloadZip(id) {
    var zip = new JSZip();
    packZip(zip, "/user-data/computer/" + id);
    zip.generateAsync({type: "blob"}).then((content) => saveAs(content, "CCPC-Online_computer-" + id + ".zip"));
}

function uploadFile() {
    for (let f of document.getElementById("browser-upload-file").files) {
        let p = FS.absolutePath(f.name, document.getElementById("browser-upload-path").value.replace(/^\//, "") == "" ? "/user-data/computer/0" : 
                                        FS.absolutePath(document.getElementById("browser-upload-path").value.replace(/^\//, ""), "/user-data/computer/0"));
        f.arrayBuffer().then((buffer) => {FS.writeFile(p, new Uint8Array(buffer)); FS.syncfs(false, ()=>{});});
    }
}

function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push({start: index, end: index + searchStrLen});
        startIndex = index + searchStrLen;
    }
    return indices;
}

function getMatches(path, pattern, base) {
    base = base.replace(/^\//, "");
    let retval = {};
    for (let f of FS.readdir(path)) {
        if (f === "." || f === "..") continue;
        if (isDir(FS.absolutePath(f, path))) {
            let m = getMatches(FS.absolutePath(f, path), pattern, base === "" ? f : base + "/" + f);
            for (let k in m) retval[k] = m[k];
        } else {
            let file = null
            try {file = FS.readFile(FS.absolutePath(f, path), {encoding: "utf8"});} catch {continue;}
            if (file === null) continue;
            let indices = [];
            if (searchRegex) {
                var regex = new RegExp(pattern, "g" + (searchCaseSensitive ? "" : "i")), result;
                while ((result = regex.exec(file)))
                    indices.push({start: result.index, end: result.index + result[0].length});
            } else indices = getIndicesOf(pattern, file, searchCaseSensitive);
            let lines = file.split('\n');
            for (let m of indices) {
                if (retval[base === "" ? f : base + "/" + f] === undefined) retval[base === "" ? f : base + "/" + f] = [];
                let l = file.substring(0, m.start).split('\n')
                let obj = {lineNumber: l.length - 1, start: m.start - l.slice(0, l.length-1).join('\n').length - (l.length === 1 ? 0 : 1), end: m.end - l.slice(0, l.length-1).join('\n').length - (l.length === 1 ? 0 : 1)};
                obj.line = lines[obj.lineNumber];
                retval[base === "" ? f : base + "/" + f].push(obj);
            }
        }
    }
    return retval;
}

var safetext = (text) => text.toString().replace(/[<>"'\r\n& ]/g, (chr) => '&' + ({'<': 'lt', '>': 'gt', '"': 'quot', '\'': 'apos', '&': 'amp', '\r': '#10', '\n': '#13', ' ': 'nbsp'})[chr] + ';');

function findText() {
    document.getElementById("browser-search-matches").innerHTML = "";
    let pattern = document.getElementById("browser-search-find").value;
    if (pattern === "") {
        document.getElementById("browser-search-replace-button").classList = "fas fa-sync-alt disabled";
        return;
    } else document.getElementById("browser-search-replace-button").classList = "fas fa-sync-alt enabled";
    try {if (searchRegex) new RegExp(pattern);} catch {return;}
    let matches = getMatches("/user-data/computer/0", pattern, "");
    for (let file in matches) {
        let el = document.createElement("li");
        let title = document.createElement("span");
        title.className = "browser-item";
        let p = file.match(/[^/]+$/)[0];
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
        let txt = document.createElement("span");
        //txt.className = "browser-search-match-title-text";
        txt.innerText = p;
        title.appendChild(img);
        title.appendChild(txt);
        if (file.indexOf("/") >= 0) {
            let path = document.createElement("span");
            path.className = "browser-search-match-title-path";
            path.innerText = file.replace(/\/[^/]+$/, "");
            title.appendChild(path);
        }
        el.appendChild(title);
        let ul = document.createElement("ul");
        //ul.classList = "browser-list";
        //ul.style.display = "flex";
        for (let m of matches[file]) {
            let ell = document.createElement("li");
            ell.classList = "browser-item browser-search-match-item";
            ell.innerHTML = safetext(m.line.substring(Math.max(0, m.start - 15), m.start)) + '<span class="browser-search-match-string">' + safetext(m.line.substring(m.start, m.end)) + '</span>' + safetext(m.line.substring(m.end));
            ell.onclick = function() {
                console.log(FS.absolutePath(file, "/user-data/computer/0"));
                for (var tab = 0; tab < tabs.length; tab++) {
                    if (tabs[tab].type === "File" && tabs[tab].path === FS.absolutePath(file, "/user-data/computer/0")) {
                        selectedTab = tab;
                        editor.revealLine(m.lineNumber);
                        editor.setPosition({column: m.start, lineNumber: m.lineNumber});
                        reloadTabs();
                        return;
                    }
                }
                selectedTab = tabs.push({name: p, path: FS.absolutePath(file, "/user-data/computer/0"), content: FS.readFile(FS.absolutePath(file, "/user-data/computer/0"), {encoding: "utf8"}), type: "File", scroll: {left: m.start, top: m.lineNumber*19}, saved: true, lineNumber: m.lineNumber}) - 1;
                reloadTabs();
            }
            ul.appendChild(ell);
        }
        el.appendChild(ul);
        document.getElementById("browser-search-matches").appendChild(el);
    }
}

function replaceInFiles(path, find, replace) {
    for (let file of FS.readdir(path)) {
        if (file === "." || file === "..") continue;
        if (isDir(FS.absolutePath(file, path))) replaceInFiles(FS.absolutePath(file, path), find, replace);
        else {
            let f = FS.readFile(FS.absolutePath(file, path), {encoding: "utf8"});
            if (f === null || f.search(find) == -1) continue;
            FS.writeFile(FS.absolutePath(file, path), f.replace(find, replace));
            for (var tab = 0; tab < tabs.length; tab++) {
                if (tabs[tab].type === "File" && tabs[tab].path === FS.absolutePath(file, path)) {
                    tabs[tab].content = tabs[tab].content.replace(find, replace);
                }
            }
        }
    }
}

function replaceText() {
    if (document.getElementById("browser-search-find").value === "") return;
    try {if (searchRegex) new RegExp(pattern);} catch {return;}
    replaceInFiles("/user-data/computer/0", searchRegex ? new RegExp(document.getElementById("browser-search-find").value, "g" + (searchCaseSensitive ? "" : "i")) : document.getElementById("browser-search-find").value, document.getElementById("browser-search-replace").value);
    FS.syncfs(false, ()=>{});
    reloadTabs();
    activateTab(selectedTab);
    findText();
}

function toggleRegex() {
    searchRegex = !searchRegex;
    if (searchRegex) document.getElementById("browser-search-regex").classList = "on";
    else document.getElementById("browser-search-regex").classList = "off";
    findText();
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
            FS.writeFile(tabs[selectedTab].path, tabs[selectedTab].content);
            FS.syncfs(false, ()=>{});
            tabs[selectedTab].saved = true;
            reloadTabs();
            ev.preventDefault();
        } else if (ev.code == "Slash" && ev.ctrlKey && ev.altKey && ev.shiftKey) {
            alert("CraftOS-PC Online version " + CCPC_ONLINE_VERSION + ". Copyright (c) 2019-" + (new Date()).getFullYear() + " JackMacWindows.");
            ev.stopPropagation();
            ev.preventDefault();
        }
    });
    window.onresize = (e) => editor.layout();
    request("vendor/seti/vs-seti-icon-theme.json", function(data) {
        icon_data = JSON.parse(data);
        reloadTabs();
    });
});

document.addEventListener("keydown", (ev) => {if (ev.keyCode == 113 || ev.keyCode == 114) ev.preventDefault()})

// Check for browser support
window.disableTerminal = function() {
    var str = `<h1>Browser not supported</h1><p>Your browser does not support running CraftOS-PC Online. `;
    if (navigator.userAgent.indexOf("Firefox") === -1 && navigator.userAgent.indexOf("Chrome") === -1) 
        str += `CraftOS-PC Online is verified to work on the latest versions of <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>, <a href="https://www.google.com/chrome/">Google Chrome</a>, and <a href="https://www.microsoft.com/en-us/edge">Microsoft Edge</a>. If you're using a different (or older) browser, try using one of these instead.`;
    else if ((navigator.userAgent.indexOf("Firefox") !== -1 && ((parseInt(navigator.userAgent.match(/Firefox\/(\d+)/)[1]) >= 55 && parseInt(navigator.userAgent.match(/Firefox\/(\d+)/)[1]) < 57) || parseInt(navigator.userAgent.match(/Firefox\/(\d+)/)[1]) < 46)) || (navigator.userAgent.indexOf("Chrome") !== -1 && parseInt(navigator.userAgent.match(/Chrome\/(\d)+/)[1] < 68))) 
        str += `Your browser is too old. Please upgrade to a newer version:<ul><li><a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a></li><li><a href="https://www.google.com/chrome/">Google Chrome</a></li></ul>`;
    else if (navigator.userAgent.indexOf("Firefox") !== -1) 
        str += `Make sure the following options are enabled in <code>about:config</code>:<ul><li><code>javascript.options.shared_memory</code></li>${parseInt(navigator.userAgent.match(/Firefox\/(\d+)/)[1]) >= 57 ? "<li><code>dom.postMessage.sharedArrayBuffer.withCOOP_COEP</code></li>" : ""}<li><code>browser.tabs.remote.useCrossOriginEmbedderPolicy</code></li><li><code>browser.tabs.remote.useCrossOriginOpenerPolicy</code></li></ul>`;
    str += `</p>`;
    document.getElementById("editor-terminal").innerHTML = str;
    document.getElementById("editor-terminal").style.display = "block";
    document.getElementById("editor-terminal").style.color = "#eeeeee";
    document.getElementById("editor-terminal").style.padding = "20px";
}

if (window.SharedArrayBuffer === undefined || (navigator.userAgent.indexOf("Firefox") !== -1 && parseInt(navigator.userAgent.match(/Firefox\/(\d+)/)[1]) >= 72 && !crossOriginIsolated)) disableTerminal();
