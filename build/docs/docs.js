var nav = false;
function toggleNav() {
    if (nav) {
        document.getElementById("docs-sidebar").className = "";
        document.getElementById("docs-content").className = "";
        document.getElementById("docs-content").onclick = null;
        document.getElementsByClassName("docs-header")[0].style.position = null;
        document.getElementsByClassName("docs-box")[0].style.marginTop = null;
        const scrollY = document.body.style.top;
        document.body.style.position = null;
        document.body.style.top = null;
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    } else {
        document.getElementById("docs-sidebar").className = "open";
        document.getElementById("docs-content").className = "gray";
        document.getElementById("docs-content").onclick = toggleNav;
        document.getElementsByClassName("docs-header")[0].style.position = "fixed";
        document.getElementsByClassName("docs-box")[0].style.marginTop = "50px";
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.position = 'fixed';
    }
    nav = !nav;
    return false;
}