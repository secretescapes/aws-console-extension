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

function toggleSearch() {
	browser.tabs.executeScript({code: `
		grey = document.getElementById('awsce-grey')
		search = document.getElementById('awsce-search')
		box = document.getElementById('awsce-search-box')
		if (grey.style.display == "block") {
			grey.style.display = "none"
			search.style.display = "none"
			document.body.style.overflow = ""
		} else {
			grey.style.display = "block"
			search.style.display = "block"
			document.body.style.overflow = "hidden"
			box.focus()
		}
	`})
}

browser.commands.onCommand.addListener((command) => {
	if (command === 'toggle-panel') {
		togglePanel()
	}
	if (command === 'role-search') {
		toggleSearch()
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
