# WebAssembly Port & CraftOS-PC Online
CraftOS-PC v2.2.3 added experimental WebAssembly support to CraftOS-PC, and v2.3 includes official support. With v2.3, a new online client is available on the website that runs completely in your web browser.

## CraftOS-PC Online
CraftOS-PC Online is a browser-based IDE for CraftOS-PC that has an interface similar to Visual Studio Code with the ability to display terminal tabs. Computer data is saved in the browser and will persist across reloads. It works with all versions of Google Chrome and derivatives, Firefox 70 or earlier, and Firefox 74 or later with `browser.tabs.remote.useCrossOriginEmbedderPolicy` and `browser.tabs.remote.useCrossOriginOpenerPolicy` enabled in `about:config`. (It does not support Firefox 71-73, old Microsoft Edge, or Safari.)

**[You can access CraftOS-PC Online at https://www.craftos-pc.cc/online/.](https://www.craftos-pc.cc/online/)**

## Building WebAssembly port
To build CraftOS-PC for WebAssembly, you must have the following prerequisites installed:
* C++ compiler with GNU Make support
* Emscripten SDK
* Build of [Poco](https://pocoproject.org) for Emscripten
* Build of OpenSSL for Emscripten
* [CraftOS-PC ROM](https://github.com/MCJack123/craftos2-rom) downloaded

1. Configure the source files: `./configure --enable-wasm --with-wasm-poco=<path to Poco build with lib/ & include/> --with-wasm-openssl=<path to OpenSSL build with lib/ & include/> --with-wasm-rom=<path to CraftOS-PC ROM>`
2. `make`
3. Output will be at `craftos.html` and `craftos.wasm`