function ready() {
    setTimeout(() => {
        if (localStorage.getItem("cookieSeen") != "shown") {
            document.getElementById("cookie-banner").classList += "open";
            localStorage.setItem("cookieSeen", "shown");
        }
    }, 200);    
    const icons = FaUserAgent.faUserAgent(navigator.userAgent);
    document.getElementById("download-button").innerHTML = '<span class="download-icon">' + (icons.platform.name == "desktop" ? icons.os.html : '<i class="fab fa-github">') + "</i></span>&nbsp;" + document.getElementById("download-button").innerHTML;
    var link = document.getElementById("download-link");
    if (icons.platform.name == "desktop") {
        if (icons.os.name == "apple") {
            link.href = "https://github.com/MCJack123/craftos2/releases/download/latest/CraftOS-PC.dmg";
            document.getElementById("mac-universal-note").style.display = "block";
        }
        else if (icons.os.name == "windows") link.href = "https://github.com/MCJack123/craftos2/releases/download/latest/CraftOS-PC-Setup.exe";
        else if (icons.os.name == "linux") link.href = "docs/installation#linux";
        else {
            link.href = "https://github.com/MCJack123/craftos2/";
            document.getElementsByClassName("download-text")[0].innerText = "View on GitHub";
            document.getElementById("download-source").remove();
        }
        if (icons.os.name == "apple") document.getElementById("download-platform").innerText = "macOS";
        else if (document.getElementById("download-platform") != undefined) document.getElementById("download-platform").innerText = icons.os.name.charAt(0).toUpperCase() + icons.os.name.slice(1);
    } else {
        link.href = "https://github.com/MCJack123/craftos2/";
        document.getElementsByClassName("download-text")[0].innerText = "View on GitHub";
        document.getElementById("download-source").remove();
    }
    document.getElementById("download-link").href = document.getElementById("download-link").href.replace("latest", document.getElementById("current-version").innerText);
}

function acceptCookies() {
    document.getElementById("cookie-banner").classList = "";
}
