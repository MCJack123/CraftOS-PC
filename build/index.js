function ready() {
    setTimeout(() => {
        if (localStorage.getItem("cookieSeen") != "shown") {
            document.getElementById("cookie-banner").style.display = null;
            setTimeout(() => document.getElementById("cookie-banner").classList += "open", 10);
            localStorage.setItem("cookieSeen", "shown");
        }
    }, 200);
    const icons = FaUserAgent.faUserAgent(navigator.userAgent);
    for (let el of document.getElementsByClassName("download-icon")) el.remove();
    document.getElementById("download-button").innerHTML = '<span class="download-icon">' + (icons.platform.name != "tv" ? icons.os.html : '<i class="fab fa-github">') + "</i></span>&nbsp;" + document.getElementById("download-button").innerHTML;
    var link = document.getElementById("download-link");
    var luajit = document.getElementById("download-luajit");
    if (icons.platform.name == "desktop") {
        if (icons.os.name == "apple") {
            link.href = "https://github.com/MCJack123/craftos2/releases/download/latest/CraftOS-PC.dmg";
            luajit.href = `https://github.com/MCJack123/craftos2/releases/download/${GH_TAG}-luajit/CraftOS-PC.dmg`;
            document.getElementById("mac-universal-note").style.display = "block";
        } else if (icons.os.name == "windows") {
            link.href = "https://github.com/MCJack123/craftos2/releases/download/latest/CraftOS-PC-Setup.exe";
            luajit.href = `https://github.com/MCJack123/craftos2/releases/download/${GH_TAG}-luajit/CraftOS-PC-Setup.exe`;
        } else if (icons.os.name == "linux") link.href = "docs/installation#linux";
        else {
            link.href = "https://github.com/MCJack123/craftos2/";
            document.getElementsByClassName("download-text")[0].innerText = "View on GitHub";
            document.getElementById("download-source").remove();
        }
        if (icons.os.name == "apple") {
            document.getElementsByClassName("download-text")[0].innerHTML = document.getElementsByClassName("download-text")[0].innerHTML.replace("View on GitHub", "Download for");
            document.getElementById("download-platform").innerText = "macOS";
        } else if (document.getElementById("download-platform") != undefined) {
            document.getElementsByClassName("download-text")[0].innerHTML = document.getElementsByClassName("download-text")[0].innerHTML.replace("View on GitHub", "Download for");
            document.getElementById("download-platform").innerText = icons.os.name.charAt(0).toUpperCase() + icons.os.name.slice(1);
        }
    } else if (icons.platform.name.startsWith("mobile") || icons.platform.name.startsWith("tablet")) {
        if (icons.os.name == "android") link.href = "https://github.com/MCJack123/craftos2/releases/download/latest/CraftOS-PC.apk";
        else if (icons.os.name == "apple") link.href = "https://apps.apple.com/us/app/craftos-pc/id1565893014";
        else {
            link.href = "https://github.com/MCJack123/craftos2/";
            document.getElementsByClassName("download-text")[0].innerText = "View on GitHub";
            document.getElementById("download-source").remove();
        }
        if (icons.os.name == "apple") {
            document.getElementsByClassName("download-text")[0].innerHTML = document.getElementsByClassName("download-text")[0].innerHTML.replace("View on GitHub", "Download for");
            document.getElementById("download-platform").innerText = "iOS";
        } else if (document.getElementById("download-platform") != undefined) {
            document.getElementsByClassName("download-text")[0].innerHTML = document.getElementsByClassName("download-text")[0].innerHTML.replace("View on GitHub", "Download for");
            document.getElementById("download-platform").innerText = icons.os.name.charAt(0).toUpperCase() + icons.os.name.slice(1);
        }
    } else {
        link.href = "https://github.com/MCJack123/craftos2/";
        document.getElementsByClassName("download-text")[0].innerText = "View on GitHub";
        document.getElementById("download-source").remove();
    }
    document.getElementById("download-link").href = document.getElementById("download-link").href.replace("latest", document.getElementById("current-version").innerText);
}

function acceptCookies() {
    document.getElementById("cookie-banner").classList = "";
    setTimeout(() => document.getElementById("cookie-banner").style.display = "none", 500);
}

// https://gist.github.com/ocundale/13c5a632b3bdb8cadb59
var getBrowserInfo = function(ua){
    var sTempInfo,
        oBrowserInfo = {},
        sBrowserString = ua.match(/(vivaldi|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([0-9|\.]+)/i) || [];

    //trident check (IE11 and below)
    if(/trident/i.test(sBrowserString[1])) {
        sTempInfo = /\brv[ :]+(\d+)/g.exec(ua) || [];
        oBrowserInfo.sName = 'MSIE';
        oBrowserInfo.sVersion = sTempInfo[1];
        return oBrowserInfo;
    }
    if(sBrowserString[1]=== 'Chrome') {
        sTempInfo = ua.match(/\b(OPR|Edge)\/(\d+)/);
        //Opera/Edge case:
        if(sTempInfo !== null) {
            if(sTempInfo.indexOf('Edge')) {
                oBrowserInfo.sName = 'MSIE';   //mark ms edge browser as MSIE
            } else {
                oBrowserInfo.sName = 'Opera';
            }
            oBrowserInfo.sVersion = sTempInfo.slice(1);
            return oBrowserInfo;
        }
    }
    sBrowserString = sBrowserString[2]? [sBrowserString[1], sBrowserString[2]]: [navigator.appName, navigator.appVersion, '-?'];
    sTempInfo = ua.match(/version\/(\d+)/i);
    
    if(sTempInfo!== null) {
        sBrowserString.splice(1, 1, sTempInfo[1]);
    }
    oBrowserInfo.sName = sBrowserString[0];
    oBrowserInfo.sVersion = sBrowserString[1];
    return oBrowserInfo;
};
