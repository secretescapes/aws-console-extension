var chrome

if (typeof browser === "undefined") {
	var browser = chrome
}

function openOptionsPage(){
	browser.runtime.openOptionsPage();
}

function togglePanel() {
	browser.tabs.executeScript({code: `
		panel = document.getElementById('awsconsoleextensionrole-panel')
		if (panel.style.display == "block") {
			panel.style.display = "none"
		} else {
			panel.style.display = "block"
		}
	`})
}

browser.commands.onCommand.addListener((command) => {
	if (command === 'toggle-panel') {
		togglePanel()
	}
})

browser.runtime.onMessage.addListener((message) => {
	switch (message.action) {
		case "openOptionsPage":
			openOptionsPage();
			break;
		default:
			break;
	}
});

browser.browserAction.onClicked.addListener(togglePanel)
