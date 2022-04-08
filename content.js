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
	warning.textContent = "There are not items in your Role History, please go to Options and click a switch icon to manually switch to enable this functionality."
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
		filter: grayscale(100%) brightness(50%) sepia(100%)  saturate(700%) contrast(1);
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

	.awsce-globalNav {
		color: #FFFFFF;
		display: inline-flex;
		padding: 9px;
		align-items: center;
		flex-shrink: 0;
		justify-content: center;
	}

	.awsce-search-results {
		margin: 1px;
		padding: 5px;
		font-family: ${fontFamily};
	}
	.awsce-search-results-current {
		border: 2px solid black;
		background: white;
		padding: 10px;
		font-weight: bold;
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
iconDiv.classList.add("globalNav-0385")
iconDiv.classList.add("awsce-globalNav")
iconDiv.classList.add("globalNav-035")


var panel = document.createElement("div")
panel.id = 'awsconsoleextensionrole-panel'

var flex = document.createElement("div")
flex.id = "awsce-role-div"
flex.style.cssText = `
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	padding-left: 20px;
	padding-right: 20px;
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


var grey = document.createElement("div")
grey.id = "awsce-grey"
grey.style.cssText = `
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0.75);
	z-index: 9999;
	display: none;
}
`
var searchbox = document.createElement("input")
searchbox.id = "awsce-search-box"
searchbox.placeholder = "role search"
searchbox.autocomplete = "off"
searchbox.style.cssText = `
	height: 40px;
	width: 100%;
	text-align: center;
	font-family: ${fontFamily};
`
var search = document.createElement("div")
search.id = "awsce-search"
search.style.cssText = `
	margin: auto;
	margin-top: 50px;
	width: 40%;
	background: white;
	padding: 30px;
}
`
var searchresults = document.createElement("div")
searchresults.id = "awsce-search-results"
searchresults.style.cssText = `
	border-top: 1px solid grey;
	margin: auto;
	width: 40%;
	background: white;
	padding: 10px 30px;
	display: none;
}
`

function doSearch() {
	var searchtext = document.getElementById("awsce-search-box").value.trim()

	if (searchtext === "") {
		searchresults.style.display = "none"
		return
	}

	var terms = searchtext.split(/\s+/)
	var results

	if (terms.length) {
		results = document.querySelectorAll("#awsce-role-div input[type=submit]")
		for (term of terms) {
			results = Array.prototype.filter.call(results, item => item.id.includes(term))
		}
	}

	if (results.length) {
		searchresults.style.display = "block"
		searchresults.innerHTML = ''
		for (result of results) {
			var item = document.createElement("p")
			item.innerHTML = result.value
			item.setAttribute("name", result.id)
			item.className = "awsce-search-results"
			searchresults.append(item)
		}
		var first = document.querySelector(".awsce-search-results")
		first.classList.add("awsce-search-results-current")
	} else {
		searchresults.style.display = "none"
	}
}

function searchMove(key) {
	var currentClass = "awsce-search-results-current"
	var current = document.querySelector(`.${currentClass}`)
	if (current) {
		if (key == "ArrowDown") {
			var nextSibling = current.nextSibling
			if (nextSibling) {
				current.classList.remove(currentClass)
				nextSibling.classList.add(currentClass)
			}
		}
		if (key == "ArrowUp") {
			var previousSibling = current.previousSibling
			if (previousSibling) {
				current.classList.remove(currentClass)
				previousSibling.classList.add(currentClass)
			}
		}
	} else {
		var first = document.querySelector(".awsce-search-results")
		first.classList.add(currentClass)
	}
}

function searchEnter() {
	var current = document.querySelector(".awsce-search-results-current")
	var role = document.getElementById(current.getAttribute("name"))
	role.click()
}

searchbox.addEventListener("keyup", event => {
	switch(event.key) {
		case "Home":
		case "End":
		case "ArrowLeft":
		case "ArrowRight":
		case "ArrowDown":
		case "ArrowUp":
			searchMove(event.key)
			break;
		case "Enter":
			searchEnter()
			break;
		case "Escape":
			grey = document.getElementById('awsce-grey')
			search = document.getElementById('awsce-search')
			box = document.getElementById('awsce-search-box')
			grey.style.display = "none"
			search.style.display = "none"
			document.body.style.overflow = ""
			break;
		default:
			doSearch()
	}
})

document.body.prepend(grey)
grey.append(search)
search.append(searchbox)
grey.append(searchresults)

navbar.parentNode.prepend(iconDiv)
