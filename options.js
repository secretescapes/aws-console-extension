var chrome

if (typeof browser === "undefined") {
	var browser = chrome
}

var isHex = /^([A-FZ0-9]{3}){1,2}$/i;

var regions = document.getElementById("regions")
var regionsConfig = document.getElementById("regionsConfig")
var downloadJSONLabel = document.getElementById("downloadJSONLabel")
var uploadJSONLabel = document.getElementById("uploadJSONLabel")
var saveLabel = document.getElementById("saveLabel")
var cancelLabel = document.getElementById("cancelLabel")
var editLabel = document.getElementById("editLabel")

function handleRegionClick() {
	browser.storage.local.get(['regions'], items => {
		var _regions = items.regions || []

		if (_regions.includes(this.value)) {
			_regions = _regions.filter((v,i,a)=>{
				return v != this.value
			})
		} else {
			_regions.push(this.value)
		}

		browser.storage.local.set({
			regions: _regions
		})
	})
}

function loadRegions() {
	browser.storage.local.get(['regionsList', 'regions'], items => {

		items.regions = items.regions || []
		items.regionsList = items.regionsList || [
			'Global',
			'N. Virginia | us-east-1',
			'Ohio | us-east-2',
			'N. California | us-west-1',
			'Oregon | us-west-2',
			'Cape Town | af-south-1',
			'Hong Kong | ap-east-1',
			'Mumbai | ap-south-1',
			'Tokyo | ap-northeast-1',
			'Seoul | ap-northeast-2',
			'Osaka | ap-northeast-3',
			'Singapore | ap-southeast-1',
			'Sydney | ap-southeast-2',
			'Central | ca-central-1',
			'Frankfurt | eu-central-1',
			'Ireland | eu-west-1',
			'London | eu-west-2',
			'Paris | eu-west-3',
			'Milan | eu-south-1',
			'Stockholm | eu-north-1',
			'Bahrain | me-south-1',
			'S\xE3o Paulo | sa-east-1'
		]

		for (r of items.regionsList) {

			text = r.split('|')[0].trim()

			var br = document.createElement('br')
			var regionInput = document.createElement('input')
			regionInput.type = "checkbox"
			regionInput.id = text
			regionInput.value = text
			regionInput.addEventListener("click", handleRegionClick, false)
			if (items.regions.includes(text)) regionInput.checked = true

			regionsConfig.appendChild(regionInput)
			for (x of r.split('|').reverse()) {
				var regionLabel = document.createElement('label')
				regionLabel.textContent = x.trim()
				regionLabel.style.cssText = `
					padding-left: 4px;
					display: inline-block;
					width: 120px;
				`
				regionsConfig.appendChild(regionLabel)
				regionsConfig.appendChild(br)
			}
		}
	})
}

function deleteDiv() {
	this.parentElement.remove()
}

function colorChange() {
	if (isHex.exec(this.value)) {
		this.style.borderColor = `#${this.value}`
	} else {
		this.style.borderColor = 'transparent'
	}
}

function addRoleRow(groupDiv, role = {}, before) {

	var roleDiv = document.createElement('div')
	roleDiv.className = 'role'

	var inputAccount = document.createElement('input')
	inputAccount.name = 'account'
	inputAccount.type = "text"
	inputAccount.placeholder = "Account ID"

	var inputRole = document.createElement('input')
	inputRole.name = 'role'
	inputRole.type = "text"
	inputRole.placeholder = "Role Name"

	var inputDescription = document.createElement('input')
	inputDescription.name = 'description'
	inputDescription.type = "text"
	inputDescription.placeholder = "Description"

	var inputColor = document.createElement('input')
	inputColor.name = 'color'
	inputColor.type = "text"
	inputColor.placeholder = "hexcolor"
	inputColor.style.borderRight = `28px solid #${role.color}`
	inputColor.addEventListener('input', colorChange, false)

	var roleButtonDelete = document.createElement('div')
	roleButtonDelete.textContent = "X"
	roleButtonDelete.className = 'deleteButton'
	roleButtonDelete.addEventListener('click', deleteDiv, false)

	if (JSON.stringify(role) === '{}') {
		groupDiv.insertBefore(roleDiv, before)
		roleButtonDelete.style.display = "inline-block"
	} else {
		groupDiv.appendChild(roleDiv)

		inputAccount.value = role.account
		inputAccount.disabled = "disabled"

		inputRole.value = role.role
		inputRole.disabled = "disabled"

		inputDescription.value = role.description
		inputDescription.disabled = "disabled"

		inputColor.value = role.color
		inputColor.disabled = "disabled"
	}

	roleDiv.appendChild(inputAccount)
	roleDiv.appendChild(inputRole)
	roleDiv.appendChild(inputDescription)
	roleDiv.appendChild(inputColor)
	roleDiv.appendChild(roleButtonDelete)
	roleDiv.appendChild(document.createElement('br'))
}

function addNewRole() {
	addRoleRow(this.parentElement, {}, this)
}

function addAddRoleButton(groupDiv, add) {
	var roleButtonAdd = document.createElement('div')
	roleButtonAdd.textContent = "New Role"
	roleButtonAdd.className = "addButton"

	groupDiv.appendChild(roleButtonAdd)
	groupDiv.appendChild(document.createElement('br'))
	roleButtonAdd.addEventListener('click', addNewRole, false)

	if (add) {
		roleButtonAdd.style.display = "inline-block"
	}
}

function createEditSection(div, account, roles) {

	groupDiv = addGroupRow(div, account)

	roles.forEach(role => {
		addRoleRow(groupDiv, role)
	})

	addAddRoleButton(groupDiv)
}

function addGroupRow(div, groupName = '', before) {

	var groupDiv = document.createElement('div')
	groupDiv.className = 'group'

	groupDiv.appendChild(document.createElement('br'))

	var group = document.createElement('input')
	group.name = 'group'
	group.type = "text"
	group.placeholder = "Group name"
	group.value = groupName

	var groupButtonDelete = document.createElement('div')
	groupButtonDelete.textContent = "X"
	groupButtonDelete.className = 'deleteButton'
	groupButtonDelete.addEventListener('click', deleteDiv, false)

	groupDiv.appendChild(group)
	groupDiv.appendChild(groupButtonDelete)
	groupDiv.appendChild(document.createElement('br'))

	if (groupName === '') {
		div.insertBefore(groupDiv, before)
		groupButtonDelete.style.display = "inline-block"
	} else {
		div.appendChild(groupDiv)
		group.disabled = "disabled"
	}

	return groupDiv
}

function addGroup() {
	groupDiv = addGroupRow(this.parentElement, '', this.nextSibling)
	addAddRoleButton(groupDiv, true)
}

function load() {
	var div = document.getElementById('accountsConfig')
	div.innerHTML = ''
	regionsConfig.innerHTML = ''

	var addSectionButton = document.createElement('div')
	addSectionButton.className = 'addButton'
	addSectionButton.textContent = 'New Group'
	addSectionButton.addEventListener('click', addGroup, false)

	div.appendChild(addSectionButton)

	browser.storage.local.get(['accounts', 'regionsEnabled'], items => {
		Object.entries(items.accounts||[]).forEach(([account, roles]) => {
			createEditSection(div, account, roles)
		})
		regionsEnabled.checked = items.regionsEnabled || false
		if (items.regionsEnabled) {
			loadRegions()
		}
	})
	regions.style.display = "block"
	downloadJSONLabel.style.display = "block"
	uploadJSONLabel.style.display = "block"
	editLabel.style.display = "block"
	cancelLabel.style.display = "none"
	saveLabel.style.display = "none"
}

function handleEdit() {
	document.querySelectorAll('div[class*=Button]').forEach(item => {
		item.style.display = 'inline-block'
	})
	document.querySelectorAll('input[type=text]').forEach(item => {
		item.disabled = null
	})

	regions.style.display = "none"
	downloadJSONLabel.style.display = "none"
	uploadJSONLabel.style.display = "none"
	editLabel.style.display = "none"
	cancelLabel.style.display = "block"
	saveLabel.style.display = "block"
}
var edit = document.getElementById("edit")
edit.addEventListener("click", handleEdit, false)

var cancel = document.getElementById("cancel")
cancel.addEventListener("click", load, false)

function handleSave() {

	function errorCheck(input) {
		input.style.outline = "white"
		if (input == null || !input.value.length) {
			input.style.outline = "2px solid red"
			error = true
		}
	}

	var groups = document.querySelectorAll('div[class=group]')
	var accounts = {}
	var error = false

	groups.forEach(group => {

		groupInput = group.querySelector('input[name=group]')
		errorCheck(groupInput)

		accounts[groupInput.value] = []

		group.querySelectorAll('div[class=role]').forEach(role => {

			accountInput = role.querySelector('input[name=account]')
			roleInput = role.querySelector('input[name=role]')
			descriptionInput = role.querySelector('input[name=description]')
			colorInput = role.querySelector('input[name=color]')

			errorCheck(accountInput)
			errorCheck(roleInput)
			errorCheck(colorInput)

			if (isHex.exec(colorInput.value)) {
				colorInput.style.outline = "white"
			} else {
				colorInput.style.outline = "2px solid red"
				error = true
			}

			accounts[groupInput.value].push({
				account: accountInput.value,
				role: roleInput.value,
				description: descriptionInput.value,
				color: colorInput.value,
			})
		})
	})

	if (error) {
		alert('Error, some fields have failed validation. Please fix and try again')
		return
	}

	saveAccounts(accounts)
}
var save = document.getElementById("save")
save.addEventListener("click", handleSave, false)

function handleRegionsEnabled() {
	browser.storage.local.set({
		regionsEnabled: regionsEnabled.checked
	})
}
var regionsEnabled = document.getElementById("regionsEnabled")
regionsEnabled.addEventListener("click", handleRegionsEnabled, false)

function handleDownloadJSON() {
	browser.storage.local.get('accounts', items => {
		var json = JSON.stringify(items.accounts, null, 2)
		var blob = new Blob([json], {type: "application/json"})
		var url = URL.createObjectURL(blob)
		browser.downloads.download({
			url: url,
			filename: 'accounts.json',
			conflictAction: 'uniquify'
		})
	})
}
var downloadJSON = document.getElementById("downloadJSON")
downloadJSON.addEventListener("click", handleDownloadJSON, false)

function saveAccounts(accounts) {
	var roleFilterList = new Set()
	Object.entries(accounts).forEach(([group, roles]) => {
		for (role of roles) {
			roleFilterList.add(role.role)
		}
	})

	browser.storage.local.set({
		timestamp: Date.now(),
		accounts: accounts,
		roleFilterList: Array.from(roleFilterList)
	})
}

function handleUploadJSON() {
	var reader = new FileReader()
	reader.onload = (e) => {
		saveAccounts(JSON.parse(e.target.result))
	}
	reader.readAsText(this.files[0], "UTF-8")
}
var uploadJSON = document.getElementById("uploadJSON")
uploadJSON.addEventListener("change", handleUploadJSON, false)

browser.storage.onChanged.addListener(load)
load()
