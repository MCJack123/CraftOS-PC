self.onmessage = function() {
    for (let i = 0, found = 0; found < 3; i++) {
        let d = new Date();
        d.setDate(d.getDate() - i <= 0 ? d.getDate() - i - 1 : d.getDate() - i);
        if (d.getTime() < 1582675200000) break; // epoch = 2/26/20 00:00:00
        let xhr = new XMLHttpRequest();
        let path = "CraftOS-PC-Nightly_" + (d.getMonth()+1).toString().padStart(2, '0') + "-" + d.getDate().toString().padStart(2, '0') + "-" + d.getFullYear().toString().slice(-2) + ".exe";
        xhr.open("GET", path, false); // synchronous to preserve order & keep track of number found
        xhr.send();
        if (xhr.status == 200) {
            let a = {}
            a.href = path;
            a.innerText = d.toLocaleDateString(undefined, {month: "long", day: "numeric", year: "numeric"});
            self.postMessage(a);
            found++;
        }
    }
}
