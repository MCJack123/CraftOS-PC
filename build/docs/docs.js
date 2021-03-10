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