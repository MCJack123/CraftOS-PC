var details = [
    {
        "image": "image1.png",
        "title": "Fast Emulation of ComputerCraft",
        "text": "text"
    },
    {
        "image": "peripherals.png",
        "title": "Full Peripheral Support with Directory Mounting",
        "text": "text"
    },
    {
        "image": "multicomputer.png",
        "title": "Support for Multiple Computers",
        "text": "text"
    },
    {
        "image": "gfx.png",
        "title": "All-New Graphics Mode",
        "text": "text"
    },
    {
        "image": "screenshot.gif",
        "title": "Built-In Screenshots & GIF Recorder",
        "text": "text"
    },
    {
        "image": "config.png",
        "title": "Highly Configurable",
        "text": "text"
    },
    {
        "image": "extension.png",
        "title": "Extensible",
        "text": "text"
    }
];

function showDetails() {
    var box = document.getElementById("details-box");
    for (var detail of details) {
        var node = document.createElement("div");
        node.className = "details-entry";
        var block = document.createElement("div");
        block.className = "details-image-container";
        var image = document.createElement("img");
        image.className = "details-image";
        image.src = "images/" + detail.image;
        block.appendChild(image);
        node.appendChild(block);
        var desc = document.createElement("div");
        desc.className = "details-content";
        var title = document.createElement("h2");
        title.className = "details-title";
        title.innerText = detail.title;
        desc.appendChild(title);
        var text = document.createElement("p");
        text.className = "details-text";
        text.innerText = detail.text;
        desc.appendChild(text);
        node.appendChild(desc);
        box.appendChild(node);
        if (detail.image != "screenshot.gif") {
            var mimage = document.createElement("img");
            mimage.className = "scrolling-image";
            mimage.src = "images/" + detail.image;
            document.getElementById("scrolling-content").appendChild(mimage);
        }
    }
    document.getElementById("scrolling-content").innerHTML += document.getElementById("scrolling-content").innerHTML;
}

function setLatest() {
    var resp = JSON.parse(this.responseText);
    console.log("Latest version is " + resp.tag_name);
    document.getElementById("current-version").innerText = resp.tag_name;
    document.getElementById("download-link").href = document.getElementById("download-link").href.replace("latest", resp.tag_name);
}

function getLatest() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", setLatest);
    xhr.open("GET", "https://api.github.com/repos/MCJack123/craftos2/releases/latest");
    xhr.send();
}

function ready() {
    getLatest();
    showDetails();
    const icons = FaUserAgent.faUserAgent(navigator.userAgent);
    document.getElementById("download-button").innerHTML = '<span class="download-icon">' + icons.os.html + "</span></i>&nbsp;" + document.getElementById("download-button").innerHTML;
    var link = document.getElementById("download-link");
    if (icons.platform.name == "desktop") {
        if (icons.os.name == "apple") link.href = "https://github.com/MCJack123/craftos2/releases/download/latest/CraftOS-PC.dmg";
        else if (icons.os.name == "windows") link.href = "https://github.com/MCJack123/craftos2/releases/download/latest/CraftOS-PC-Setup.exe";
        else if (icons.os.name == "linux") link.href = "linux-instructions.html";
        else console.log("Unknown platform " + icons.os.name);
        if (icons.os.name == "apple") document.getElementById("download-platform").innerText = "macOS";
        else document.getElementById("download-platform").innerText = icons.os.name.charAt(0).toUpperCase() + icons.os.name.slice(1);
    } else {
        link.href = "javascript:alert('Unsupported platform.')";
        document.getElementById("download-platform").innerText = "Unknown"
    }
}