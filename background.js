var chrome

if (typeof browser === "undefined") {
	var browser = chrome
}

function openOptionsPage(){
	browser.runtime.openOptionsPage();
}

browser.commands.onCommand.addListener((command) => {
	if (command === 'toggle-panel') {
		console.log('toggle-panel')
		browser.tabs.getSelected(null, tab => {
			browser.tabs.executeScript(tab.id, {code: `
				document.getElementById('awsconsoleextensionrole-button').click()
			`})
		})
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
