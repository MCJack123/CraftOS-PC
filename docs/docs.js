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
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {document.getElementById("docs-content").innerHTML = marked(this.responseText); location.hash = location.hash;});
    xhr.open("GET", "md/" + location.href.replace(".html", ".md").split("/").reverse()[0]);
    xhr.send();
    var xhr2 = new XMLHttpRequest();
    xhr2.addEventListener("load", function() {document.getElementById("docs-sidebar").innerHTML = marked(this.responseText);});
    xhr2.open("GET", "md/sidebar.md");
    xhr2.send();
}, false);