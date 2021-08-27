var chrome

if (typeof browser === "undefined") {
	var browser = chrome
}

const headers = ['Account', 'Role', 'Environment', 'Colour']

var isHex = /^([A-FZ0-9]{3}){1,2}$/i;

var regions = document.getElementById("regions")
var regionsConfig = document.getElementById("regionsConfig")
var downloadJSONLabel = document.getElementById("downloadJSONLabel")
var uploadJSONLabel = document.getElementById("uploadJSONLabel")
var saveLabel = document.getElementById("saveLabel")
var cancelLabel = document.getElementById("cancelLabel")
var editLabel = document.getElementById("editLabel")

function createRoleCol(tr, value, color=false) {
	var td = document.createElement('td')
	td.innerText = value
	tr.appendChild(td)
	if (color) {
		td.style.fontFamily = "Courier New"
		td.style.borderRight = `20px solid #${value}`
	}
}

function createSection(div, account, roles) {

	var card = document.createElement('div')
	div.appendChild(card)

	var cardBody = document.createElement('div')
	cardBody.id = account
	card.appendChild(cardBody)

	var cardHeader = document.createElement('h2')
	cardHeader.innerText = account
	cardBody.appendChild(cardHeader)

	var table = document.createElement('table')
	cardBody.appendChild(table)

	var thead = document.createElement('thead')
	table.appendChild(thead)

	var thead_tr = document.createElement('tr')
	thead.appendChild(thead_tr)

	headers.forEach(header => {
		var th = document.createElement('th')
		th.innerText = header
		thead_tr.appendChild(th)
		if (header == 'Description') {
			th.style.width = '40%'
		} else {
			th.style.width = '20%'
		}
	})

	var tbody = document.createElement('tbody')
	table.appendChild(tbody)

	roles.forEach(role => {
		var tbody_tr = document.createElement('tr')
		tbody.appendChild(tbody_tr)
		createRoleCol(tbody_tr, role.account)
		createRoleCol(tbody_tr, role.role)
		createRoleCol(tbody_tr, role.environment)
		createRoleCol(tbody_tr, role.color, true)
	})

	var br = document.createElement('br')
	div.appendChild(br)
}

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
			'Osaka | ap-northeast-3',
			'Seoul | ap-northeast-2',
			'Singapore | ap-southeast-1',
			'Sydney | ap-southeast-2',
			'Tokyo | ap-northeast-1',
			'Central | ca-central-1',
			'Frankfurt | eu-central-1',
			'Ireland | eu-west-1',
			'London | eu-west-2',
			'Milan | eu-south-1',
			'Paris | eu-west-3',
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

			var regionLabel = document.createElement('label')
			regionLabel.textContent = r
			regionsConfig.appendChild(regionInput)
			regionsConfig.appendChild(regionLabel)
			regionsConfig.appendChild(br)
		}
	})
}

function load() {
	var div = document.getElementById('accounts')
	div.innerHTML = ''
	regionsConfig.innerHTML = ''
	browser.storage.local.get(['accounts', 'regionsEnabled'], items => {
		regionsEnabled.checked = items.regionsEnabled || false
		if (items.regionsEnabled) {
			loadRegions()
		}
		Object.entries(items.accounts||[]).forEach(([account, roles]) => {
			createSection(div, account, roles)
		})

		regions.style.display = "block"
		downloadJSONLabel.style.display = "block"
		uploadJSONLabel.style.display = "block"
		editLabel.style.display = "block"
		cancelLabel.style.display = "none"
		saveLabel.style.display = "none"
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

	if (JSON.stringify(role) === '{}') {
		groupDiv.insertBefore(roleDiv, before)
	} else {
		groupDiv.appendChild(roleDiv)
	}

	var inputAccount = document.createElement('input')
	inputAccount.name = 'account'
	inputAccount.type = "text"
	inputAccount.placeholder = "Account ID"
	if (role.account) inputAccount.value = role.account

	var inputRole = document.createElement('input')
	inputRole.name = 'role'
	inputRole.type = "text"
	inputRole.placeholder = "Role Name"
	if (role.role) inputRole.value = role.role

	var inputEnvironment = document.createElement('input')
	inputEnvironment.name = 'environment'
	inputEnvironment.type = "text"
	inputEnvironment.placeholder = "Description"
	if (role.environment) inputEnvironment.value = role.environment

	var inputColor = document.createElement('input')
	inputColor.name = 'color'
	inputColor.type = "text"
	inputColor.placeholder = "Icon Hex Color"
	inputColor.style.borderRight = `28px solid #${role.color}`
	inputColor.addEventListener('input', colorChange, false)
	if (role.color) inputColor.value = role.color

	var roleButtonDelete = document.createElement('div')
	roleButtonDelete.textContent = "Remove Role"
	roleButtonDelete.className = 'deleteButton'
	roleButtonDelete.addEventListener('click', deleteDiv, false)

	roleDiv.appendChild(inputAccount)
	roleDiv.appendChild(inputRole)
	roleDiv.appendChild(inputEnvironment)
	roleDiv.appendChild(inputColor)
	roleDiv.appendChild(roleButtonDelete)
	roleDiv.appendChild(document.createElement('br'))
}

function addNewRole() {
	addRoleRow(this.parentElement, {}, this)
}

function addAddRoleButton(groupDiv) {
	var roleButtonAdd = document.createElement('div')
	roleButtonAdd.textContent = "Add Role"
	roleButtonAdd.className = "addButton"

	groupDiv.appendChild(roleButtonAdd)
	groupDiv.appendChild(document.createElement('br'))
	roleButtonAdd.addEventListener('click', addNewRole, false)
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

	if (groupName === '') {
		div.insertBefore(groupDiv, before)
	} else {
		div.appendChild(groupDiv)
	}

	groupDiv.appendChild(document.createElement('br'))

	var group = document.createElement('input')
	group.name = 'group'
	group.type = "text"
	group.placeholder = "Group name"
	group.value = groupName

	var groupButtonDelete = document.createElement('div')
	groupButtonDelete.textContent = "Remove Group"
	groupButtonDelete.className = 'deleteButton'
	groupButtonDelete.addEventListener('click', deleteDiv, false)

	groupDiv.appendChild(group)
	groupDiv.appendChild(groupButtonDelete)
	groupDiv.appendChild(document.createElement('br'))

	return groupDiv
}

function addGroup() {
	groupDiv = addGroupRow(this.parentElement, '', this.nextSibling)
	addAddRoleButton(groupDiv)
}

function handleEdit() {
	var div = document.getElementById('accounts')
	div.innerHTML = ''

	var addSectionButton = document.createElement('div')
	addSectionButton.className = 'addButton'
	addSectionButton.textContent = 'Add Group'
	addSectionButton.addEventListener('click', addGroup, false)

	div.appendChild(addSectionButton)

	browser.storage.local.get(['accounts', 'regionsEnabled'], items => {
		Object.entries(items.accounts||[]).forEach(([account, roles]) => {
			createEditSection(div, account, roles)
		})
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
			environmentInput = role.querySelector('input[name=environment]')
			colorInput = role.querySelector('input[name=color]')

			errorCheck(accountInput)
			errorCheck(roleInput)
			errorCheck(environmentInput)
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
				environment: environmentInput.value,
				color: colorInput.value,
			})
		})
	})

	if (error) {
		alert('Error, some fields have failed validation. Please fix and try again')
		return
	}

	browser.storage.local.set({
		timestamp: Date.now(),
		accounts: accounts
	})
}
var save = document.getElementById("save")
save.addEventListener("click", handleSave, false)

function handleReset() {
	if (confirm('Are you sure you want to reset? This will remove all your account information')) {
		browser.storage.local.set({
			accounts: {}
		})
	}
}
var reset = document.getElementById("reset")
reset.addEventListener("click", handleReset, false)

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

function handleUploadJSON() {
	var reader = new FileReader()
	reader.onload = (e) => {
		browser.storage.local.set({
			accounts: JSON.parse(e.target.result)
		})
	}
	reader.readAsText(this.files[0], "UTF-8")
}
var uploadJSON = document.getElementById("uploadJSON")
uploadJSON.addEventListener("change", handleUploadJSON, false)

browser.storage.onChanged.addListener(load)

load()
