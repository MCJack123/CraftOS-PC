self.onmessage = function() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.github.com/repos/MCJack123/CraftOS-PC/contents/build/nightly");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.READY && xhr.status == 200) {
            let data = JSON.parse(xhr.responseText);
            data.sort(function(a, b) {
                if (a.name === "index.js" || a.name === "index.html") return -1;
                if (b.name === "index.js" || b.name === "index.html") return 1;
                let as = new Date(a.name.match(/%d{2}-%d{2}-$d{2}/).replace('-', '/'));
                let bs = new Date(b.name.match(/%d{2}-%d{2}-$d{2}/).replace('-', '/'));
                return as.getTime() - bs.getTime();
            });
            for (let i = 0; i < data.length; i++) self.postMessage({innerText: data[i].name, href: data[i].download_url});
        }
    }
    xhr.send();
}
