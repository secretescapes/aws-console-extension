var chrome

if (typeof browser === "undefined") {
	var browser = chrome
}

const headers = ['Account', 'Role', 'Environment', 'Colour']

var regions = document.getElementById("regions")

function createRoleCol(tr, value) {
	var td = document.createElement('td')
	td.innerText = value
	tr.appendChild(td)
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
		createRoleCol(tbody_tr, role.color)
	})

	var br = document.createElement('br')
	div.appendChild(br)
}

function loadRegions() {
	browser.storage.local.get(['regionsList', 'regions'], items => {

		var regionsList = items.regionsList || [
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

		for (r of regionsList) {

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
			regions.appendChild(regionInput)
			regions.appendChild(regionLabel)
			regions.appendChild(br)
		}
	})
}

function load() {
	var div = document.getElementById('accounts')
	div.innerHTML = ''
	regions.innerHTML = ''
	browser.storage.local.get(['accounts', 'regionsEnabled'], items => {
		regionsEnabled.checked = items.regionsEnabled
		if (items.regionsEnabled) {
			loadRegions()
		}
		Object.entries(items.accounts).forEach(([account, roles]) => {
			createSection(div, account, roles)
		})
	})
}

function handleDownload() {
	browser.storage.local.get('accounts', (res) => {
		var json = JSON.stringify(res.accounts)
		var blob = new Blob([json], {type: "application/json"})
		var url = URL.createObjectURL(blob)
		browser.downloads.download({
			url: url,
			filename: 'accounts.json',
			conflictAction: 'uniquify'
		})
	})
}
var download = document.getElementById("download")
download.addEventListener("click", handleDownload, false)

function handlePicked() {
	var reader = new FileReader()
	reader.onload = (e) => {
		browser.storage.local.set({
			accounts: JSON.parse(e.target.result)
		})
	}
	reader.readAsText(this.files[0], "UTF-8")
}
var filePicker = document.getElementById("picker")
filePicker.addEventListener("change", handlePicked, false)

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


browser.storage.onChanged.addListener(() => {
	load()
})

load()
