var nav = false;
function toggleNav() {
    if (nav) {
        document.getElementById("docs-sidebar").className = "";
        document.getElementById("docs-content").className = "";
        document.getElementsByClassName("docs-header")[0].style.position = "sticky";
        document.getElementsByClassName("docs-box")[0].style.marginTop = null;
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    } else {
        document.getElementById("docs-sidebar").className = "open";
        document.getElementById("docs-content").className = "gray";
        document.getElementsByClassName("docs-header")[0].style.position = "fixed";
        document.getElementsByClassName("docs-box")[0].style.marginTop = "50px";
        document.body.style.top = `-${window.scrollY}px`;
        document.body.style.position = 'fixed';
    }
    nav = !nav;
    return false;
}