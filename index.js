var details = [
    {
        "image": "image1.png",
        "title": "Fast Emulation of ComputerCraft",
        "text": "CraftOS-PC is a native ComputerCraft emulator written in C++. It uses the official Lua 5.1 source code to run CraftOS, which gets rid of many bugs that plague the Java implementation of Lua used in ComputerCraft. Using C++ also allows CraftOS-PC to run quicker than any other Java implementation of ComputerCraft, performing up to 90% faster than CCEmuX and CC: Tweaked in Minecraft."
    },
    {
        "image": "peripherals.png",
        "title": "Full Peripheral Support with Directory Mounting",
        "text": "CraftOS-PC supports many of the peripherals available in ComputerCraft, including monitors, printers, disk drives, modems, and more. You can connect and disconnect peripherals using the attach and detach commands from the shell. The <pre>periphemu</pre> API can also be used to manipulate peripherals from Lua."
    },
    {
        "image": "multicomputer.png",
        "title": "Support for Multiple Computers",
        "text": "CraftOS-PC can run multiple emulated computers that are completely separated from each other. Each computer gets its own filesystem and local configuration using an ID number, just like ComputerCraft. Computers can be created and attached just like any other peripheral, using either the attach command or the <pre>periphemu</pre> API."
    },
    {
        "image": "gfx.png",
        "title": "All-New Graphics Mode",
        "text": "CraftOS-PC introduces a new graphics mode that allows bitmapped pixel access to the terminal with up to 256 colors available to use. When in graphics mode, the screen has a resolution 6 times wider and 9 times taller than the text size of the terminal. This allows a base resolution of 306x171 pixels on a standard sized terminal."
    },
    {
        "image": "screenshot.gif",
        "title": "Built-In Screenshots & GIF Recorder",
        "text": "CraftOS-PC includes a built-in screenshot and GIF recording tool. No longer do you need to open Snipping Tool or use recgif; CraftOS-PC can do it for you. You can press F2 to take a screenshot or F3 to toggle GIF recording, which will be saved to .craftos/screenshots in your home directory. GIFs are restricted to a maximum length of 15 seconds to save memory usage."
    },
    {
        "image": "config.png",
        "title": "Highly Configurable",
        "text": "CraftOS-PC allows you to configure every part of the ComputerCraft experience. The config command and API allow access to the configuration directly from inside CraftOS. The configuration is stored as plain JSON in <pre>~/.craftos/config</pre>, so it's easily editable even outside the ComputerCraft environment."
    },
    {
        "image": "extension.png",
        "title": "Extensible",
        "text": "CraftOS-PC features a plugin API, allowing extending the functionality of CraftOS through the use of C++ code. One example of a plugin available is a compatibility layer for CCEmuX: it emulates the <pre>ccemux</pre> API, allowing programs designed for it to work with CraftOS-PC. It may also be possible for some C Lua libraries to work with CraftOS-PC. See the documentation for more details."
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
        text.innerHTML = detail.text;
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