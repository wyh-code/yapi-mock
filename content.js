function injectScript(fileName) {
	const file_path = chrome.runtime.getURL(fileName)
	const script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", file_path);
	document.getElementsByTagName('body')[0].appendChild(script)
}
function injectScript(fileName) {
	const file_path = chrome.runtime.getURL(fileName)
	const script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", file_path);
	document.getElementsByTagName('body')[0].appendChild(script)
}

function injectCss(fileName) {
	const file_path = chrome.runtime.getURL(fileName)
	const link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("href", file_path);
	document.getElementsByTagName('head')[0].appendChild(link)
}

// 注入form脚本
injectScript("./form.js");

setTimeout(() => {
	// 注入脚本
	injectScript("./inject.js");
}, 1000)

// 注入样式
injectCss("./inject.css");
