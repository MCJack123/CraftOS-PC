var nav = false;
function toggleNav() {
    if (nav) {
        document.getElementById("docs-sidebar").className = "";
        document.getElementById("docs-content").className = "";
    } else {
        document.getElementById("docs-sidebar").className = "open";
        document.getElementById("docs-content").className = "gray";
    }
    nav = !nav;
    return false;
}
document.addEventListener("DOMContentLoaded", function() {
    var dir = location.search == "" ? "md" : location.search.substr(1);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {if (this.status != 200) {document.getElementById("docs-content").innerHTML = "<h1>Page Not Found</h1><p>The requested document could not be found.</p>"; return;} document.getElementById("docs-content").innerHTML = marked(this.responseText); if (location.hash != "") location.hash = location.hash; setTimeout(function() {if (dir != "md") for (var elem of document.getElementsByTagName("a")) elem.href += "?" + dir;}, 1);});
    xhr.open("GET", dir + "/" + (location.href.replace(".html", "").replace(/[#?].*/, "") + ".md").split("/").reverse()[0]);
    xhr.send();
    var xhr2 = new XMLHttpRequest();
    xhr2.addEventListener("load", function() {document.getElementById("docs-sidebar").innerHTML = marked(this.responseText);});
    xhr2.open("GET", dir + "/sidebar.md");
    xhr2.send();
    if (dir != "md") for (var elem in document.getElementsByTagName("a")) if (elem.href != undefined) elem.href += "?" + dir;
}, false);