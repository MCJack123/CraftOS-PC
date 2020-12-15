var details = [
    {
        "image": "image1.png",
        "title": "Fast Emulation of ComputerCraft",
        "text": "CraftOS-PC is a native ComputerCraft emulator written in C++. It uses the official Lua 5.1 source code to run CraftOS, which gets rid of many bugs that plague the Java implementation of Lua used in ComputerCraft. Using C++ also allows CraftOS-PC to run quicker than any other Java implementation of ComputerCraft, performing up to 90% faster than CCEmuX and CC: Tweaked in Minecraft."
    },
    {
        "image": "peripherals.png",
        "title": "Full Peripheral Support with Directory Mounting",
        "text": "CraftOS-PC supports many of the peripherals available in ComputerCraft, including monitors, printers, disk drives, modems, and more. You can connect and disconnect peripherals using the attach and detach commands from the shell. The <pre>periphemu</pre> API can also be used to manipulate peripherals from Lua. In addition, the mount and unmount commands and the <pre>mounter</pre> API allow mounting real directories inside the CraftOS environment."
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
        "text": "CraftOS-PC includes a built-in screenshot and GIF recording tool. No longer do you need to open Snipping Tool or use recgif; CraftOS-PC can do it for you. You can press F2 to take a screenshot or F3 to toggle GIF recording, which will be saved to .craftos/screenshots in your home directory. GIFs are restricted to a maximum length of 15 seconds by default to save memory usage, but this can be modified in the configuration."
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
    },
    {
        "image": "debugger_demo.png",
        "title": "Brand-New Debugger",
        "text": "CraftOS-PC v2.2 introduces the debugger peripheral, which allows you to set breakpoints, step through programs, and print messages to the debug console without modifying the main computer's screen. This can be extremely useful for finding that one little problem in your program. For more information on how to use it, see the full documentation for the debugger."
    },
    {
        "image": "online.png",
        "title": "CraftOS-PC Online",
        "text": "With the release of CraftOS-PC v2.3 comes CraftOS-PC Online, a version of CraftOS-PC that runs directly in your browser. It runs in an IDE similar to Visual Studio Code, and supports file browsing and editing, opening multiple windows, screenshots, downloading & uploading files, and more. It works in most modern browsers with WebAssembly and shared memory support. You can access CraftOS-PC Online at <a href=\"https://www.craftos-pc.cc/online/\">https://www.craftos-pc.cc/online/</a>."
    }
];

function showDetails() {
    var box = document.getElementById("details-box");
    for (var detail of details) {
        var node = document.createElement("div");
        node.className = "details-entry";
        var block = document.createElement("div");
        block.className = "details-image-container";
        if (detail.image.endsWith("png")) {
            var container = document.createElement("picture");
            container.className = "details-image";
            var source_webp = document.createElement("source");
            source_webp.srcset = "images/webp/" + detail.image.replace("png", "webp");
            source_webp.type = "image/webp";
            container.appendChild(source_webp);
            var source_png = document.createElement("source");
            source_png.srcset = "images/" + detail.image;
            source_png.type = "image/png";
            container.appendChild(source_png);
            var img = document.createElement("img");
            img.className = "details-image";
            img.src = "images/" + detail.image;
            img.alt = detail.title;
            container.appendChild(img);
            block.appendChild(container);
        } else {
            var img = document.createElement("img");
            img.className = "details-image";
            img.src = "images/" + detail.image;
            img.alt = detail.title;
            block.appendChild(img);
        }
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
            var container = document.createElement("picture");
            container.className = "scrolling-image";
            var source_webp = document.createElement("source");
            source_webp.srcset = "images/webp/" + detail.image.replace("png", "webp");
            source_webp.type = "image/webp";
            container.appendChild(source_webp);
            var source_png = document.createElement("source");
            source_png.srcset = "images/" + detail.image;
            source_png.type = "image/png";
            container.appendChild(source_png);
            var img = document.createElement("img");
            img.className = "scrolling-image";
            img.src = "images/" + detail.image;
            img.alt = detail.title;
            container.appendChild(img);
            document.getElementById("scrolling-content").appendChild(container);
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
}