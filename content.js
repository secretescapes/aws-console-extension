var chrome

if (typeof browser === "undefined") {
	var browser = chrome
}

var recentMenu = document.getElementById("awsc-username-menu-recent-roles")
var recentRole = document.getElementById("awsc-recent-role-0")

var comedy = browser.runtime.getURL("images/comedy.png")
var tragedy = browser.runtime.getURL("images/tragedy.png")

var fontFamily = '"Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif'

var cssRed = `
	background-color: red;
	border-radius: 24px;
	padding: 2px 5px;
	color: white;
`

var cssWhite = `
	background-color: white;
	border-radius: 24px;
	padding: 2px 5px;
	color: red;
`

function recentRoleWarning() {

	filtersDiv.innerHTML = ''

	var warning = document.createElement("div")
	warning.textContent = "There must be at least one item in the Role History in order for this functionality to work"
	warning.style.cssText = `
		font-family: "Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif;
		font-size: 15px;
		padding: 10px;
		color: white;
		font-weight: bold;
		width: calc(100% - 105px);
		text-align: center;
	`

	filtersDiv.appendChild(warning)
}

function checkRegion(regions) {
	var currentRegion = document.querySelector("span[data-testid=awsc-nav-regions-menu-button] > span")
	if (!regions.includes(currentRegion.textContent)) {
		currentRegion.style.cssText = cssRed
		setInterval(() => {
			currentRegion.style.cssText = (currentRegion.style.backgroundColor == "red" ? cssWhite : cssRed)
		}, 2000)
	}
}

function addRole(div, account, roleDetails) {

	var title = `${roleDetails.role}@${account}-${roleDetails.description}`.replace(/-*\s*$/, '')

	var accountRole = recentRole.cloneNode(true)
	accountRole.id = "awsc-recent-role-1"
	accountRole.title = title

	var accountForm = accountRole.getElementsByTagName("form")[0]
	var inputs = accountForm.getElementsByTagName("input")

	for (var elem of inputs) {
		if (elem.name == "account") {
			elem.value = roleDetails.account
		}
		if (elem.name == "roleName") {
			elem.value = roleDetails.role
		}
		if (elem.name == "color") {
			elem.value = roleDetails.color
		}
		if (elem.name == "displayName") {
			elem.id = `role-history__list__item__${title}`
			if (elem.value != title) {
				elem.disabled = false
				elem.style.cursor = "pointer"
				elem.style.color = "white"
			}

			elem.title = title
			elem.value = title
			elem.style.fontFamily = fontFamily
		}
	}

	var accountLabel = accountForm.getElementsByTagName("label")[0]
	accountLabel.style.backgroundColor = `#${roleDetails.color}`

	var accountMenu = recentMenu.cloneNode(false)
	accountMenu.appendChild(accountRole)
	div.appendChild(accountMenu)
}

function applyFilter() {
	browser.storage.local.get(['filters'], items => {
		var _filters = items.filters || []

		if (_filters.includes(this.id)) {
			_filters = _filters.filter((v,i,a)=>{
				return v != this.id
			})
		} else {
			_filters.push(this.id)
		}

		browser.storage.local.set({
			filters: _filters
		})
	})

}

function generateFilters(filters, roleFilterList) {

	filtersDiv.innerHTML = ''

	for (filter of roleFilterList) {
		var filterLabel = document.createElement("label")
		filterLabel.setAttribute("for", filter)
		filterLabel.textContent = filter
		filterLabel.style.cssText = `
			padding: 10px;
			border: 1px solid #545b64;
			margin-right: 10px;
			color: white;
			font-family: ${fontFamily};
			font-size: 14px;
			border-radius: 16px;
			cursor: pointer;
		`
		if (filters.includes(filter)) filterLabel.style.borderColor = "#ff8c00"

		var filterButton = document.createElement("input")
		filterButton.id = filter
		filterButton.type = "button"
		filterButton.style.display = "none"
		filterButton.addEventListener("click", applyFilter , false)

		filtersDiv.appendChild(filterButton)
		filtersDiv.appendChild(filterLabel)

	}
}

function generate(accounts, roleFilters) {

	flex.innerHTML = ''

	for (var account in accounts) {

		var div = document.createElement("div")
		div.id = account
		div.style.width = "300px"

		var heading = document.createElement("h2")
		heading.textContent = account
		heading.style.color = "white"
		heading.style.fontFamily = fontFamily
		heading.style.paddingLeft = "20px"

		flex.appendChild(div)
		div.appendChild(heading)

		for (var role in accounts[account]) {
			var data = accounts[account][role]
			if (roleFilters.length && !roleFilters.includes(data.role)) continue
			addRole(div, account, data)
		}
	}
}

function togglePanel() {
	panel = document.getElementById('awsconsoleextensionrole-panel')
	if (panel.style.display == "block") {
		icon.src = tragedy
		panel.style.display = "none"
	} else {
		icon.src = comedy
		panel.style.display = "block"
	}
}

function load() {
	browser.storage.local.get([
		'accounts',
		'filters',
		'roleFilterList',
		'regionsEnabled',
		'regions'
	], items => {

		if (items.regionsEnabled && items.regions) checkRegion(items.regions)

		items.filters = items.filters || []

		if (!recentRole) {
			recentRoleWarning()
			return
		}

		generate(items.accounts,items.filters)
		generateFilters(items.filters, items.roleFilterList)
	})
}

var style = document.createElement("style")
style.type = "text/css"
style.innerHTML = `
	.aws-ce-mask {
		cursor: pointer;
		width: 16px;
		height: 16px;
	}

	.aws-ce-mask:hover {
		content:url(${comedy});
	}

	#awsconsoleextensionrole-panel {
		display: none;
		position: absolute;
		background: #232f3e;
		border-top: 1px solid #545b64;
		width: 100%;
		top: 40px;
		z-index: 9999;
		padding-bottom: 20px;
		min-height: 40px;
	}
`

document.getElementsByTagName('head')[0].appendChild(style);


var icon = document.createElement("img")
icon.src = tragedy
icon.id = "awsconsoleextensionrole-button"
icon.title = "AWS Console Extension Roles"
icon.addEventListener('click', togglePanel, false)
icon.classList.add("aws-ce-mask")

var iconDiv = document.createElement("div")
iconDiv.classList.add("globalNav-034")
iconDiv.classList.add("globalNav-0399")
iconDiv.classList.add("globalNav-031")
iconDiv.classList.add("globalNav-032")


var panel = document.createElement("div")
panel.id = 'awsconsoleextensionrole-panel'

var flex = document.createElement("div")
flex.style.cssText = `
	display: flex;
	width: 100%;
	flex-wrap: wrap;
`
var optionsButton = document.createElement("input")
optionsButton.type = "button"
optionsButton.id = "options"
optionsButton.style.display = "none"
optionsButton.addEventListener("click", () => {
	browser.runtime.sendMessage({"action": "openOptionsPage"});
}, false);

var optionsLabel = document.createElement("label")
optionsLabel.textContent = "Options"
optionsLabel.setAttribute("for", "options")
optionsLabel.style.cssText = `
	position: absolute;
	right: 0;
	padding: 10px;
	border: 1px solid #545b64;
	margin: 10px;
	color: white;
	font-family: ${fontFamily};
	font-size: 14px;
	cursor: pointer;
`

var filtersDiv = document.createElement("div")
filtersDiv.style.cssText = `
	display: flex;
	flex-wrap: wrap;
	border-bottom: 1px solid grey;
	padding: 10px;
	min-height: 38px;
`

document.body.prepend(panel)
panel.appendChild(optionsButton)
panel.appendChild(optionsLabel)
panel.appendChild(filtersDiv)
panel.appendChild(flex)


browser.storage.onChanged.addListener(() => {
	load()
})

load()

iconDiv.appendChild(icon)
var navbar = document.querySelector('a[title="CloudShell"]')
if (navbar == null) {
	navbar = document.querySelector('button[data-testid=awsc-nav-more-menu]').parentNode
}

if (!document.querySelector('button[data-testid=aws-services-list-button]').parentNode.parentNode.classList[0].startsWith('globalNav')) {
	icon.style.cssText = "padding: 10px;"
}

navbar.parentNode.prepend(iconDiv)
