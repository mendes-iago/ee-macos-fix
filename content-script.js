function injectScript(filePath, tag) {
    const node = document.head || document.documentElement;
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("type", filePath);
    node.appendChild(script);
}

injectScript(chrome.runtime.getUrl("page-script.js"), "body");