var code;
var SingletonStyle = {};

SingletonStyle.constructor = function() {
	this.style = document.createElement("style");
	document.head.appendChild(this.style);
};

SingletonStyle.apply = function(rule) {
	this.style.innerHTML = rule;
};

SingletonStyle.size = function(size) {
	this.apply("@page {size: " + size + "}");
};

SingletonStyle.sizePrint = function(size) {
	this.apply("@media print { @page {size: " + size + ";} }");
};

SingletonStyle.scalePrint = function(scaleFactor) {
	this.apply("@media print {.labelTable{transform: scale(" + scaleFactor + ");}}");
};

SingletonStyle.scale = function(scaleFactor) {
	this.apply(".labelTable{transform: scale(" + scaleFactor + ");}");
};

SingletonStyle.setLandscape = function(isLandscape){
	if (isLandscape){
		this.apply("@media print{@page {size: landscape;}}");
	}
};

// Initialization
function initialize() {
	SingletonStyle.constructor();

		//allow tabs in the textarea field
		var el = document.getElementById('inputArea');
		el.onkeydown = function(e) {
			if (e.keyCode === 9) { // tab was pressed
	
				// get caret position/selection
				var val = this.value,
					start = this.selectionStart,
					end = this.selectionEnd;
	
				// set textarea value to: text before caret + tab + text after caret
				this.value = val.substring(0, start) + '\t' + val.substring(end);
	
				// put caret at right position again
				this.selectionStart = this.selectionEnd = start + 1;
	
				// prevent the focus lose
				return false;
	
			}
		};
	
	// Get print config
	var printRows = getQueryString("r");
	var printColumns = getQueryString("c");
	document.getElementById('printRows').innerHTML = ((printRows < 1) ? 1 : printRows);
	document.getElementById('printColumns').innerHTML = ((printColumns < 1) ? 1 : printColumns);
	
	// Get sample data
	var patient = getQueryString("op");
	var sample = getQueryString("os");
	var visit = getQueryString("tp");
	var type = getQueryString("st");
	
	// Parse Sample data
	var numSamples = 0;
	var numPatients = 0;
	var numVisits = 0;
	var numTypes = 0;
	
	if(sample){
		sample = sample.split(',');
		numSamples = sample.length;
	}
	
	if(patient){
		patient = patient.split(',');
		numPatients = patient.length;
	}
	
	if(visit){
		visit = visit.split(',');
		numVisits = visit.length;
	}
	
	if(type){
		type = type.split(',');
		numTypes = type.length;
	}
	
	if(numSamples != numPatients || numSamples != numVisits || numSamples != numTypes){
		   console.log("Fail");
		   alert("Missmatching number of values for Sample ID, Patient ID, Visit and Type. Could not load data.\n\n Sample IDs: " + numSamples + "\n Patient IDs: " + numPatients + "\n Visits: " + numVisits + "\n Types: " + numTypes);
	} else {
		if (numSamples > 0) {
			createAndShowLabels(sample, patient, visit, type);
			writeInputArea(sample, patient, visit, type);
		}
	}
}

// IE compatible accessing of url parameters
function getQueryString() {
	var key = false, res = {}, itm = null;
	var qs = location.search.substring(1); // Get the query string without the ?
	
	if (arguments.length > 0 && arguments[0].length > 1) { // Check for the key as an argument
		key = arguments[0];
	}
	
	var pattern = /([^&=]+)=([^&]*)/g; // Make a regex pattern to grab key/value
	
	// Loop the items in the query string, either find a match to the argument, or build an object with key/value pairs
	while (itm = pattern.exec(qs)) {
		if (key !== false && decodeURIComponent(itm[1]) === key) {
			return decodeURIComponent(itm[2]);
		} else if (key === false) {
			res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
		}
	}
	
	return key === false ? res : null;
}

// Creates and shows labels
function createAndShowLabels(sample, patient, visit, type){
	// Get current row x column setting
	printRows = document.getElementById('printRows').value;
	printColumns = document.getElementById('printColumns').value;
	
	printRows = ((printRows < 1) ? 1 : printRows);
	printColumns = ((printColumns < 1) ? 1 : printColumns);
	
	// Create and show labels
	let newLabels = createLabels(sample, patient, visit, type);
	showLabels(newLabels, printRows, printColumns);

	document.getElementById("labelHeader").innerHTML = "Labels ("+sample.length+")";
}

// Write samples to textarea
function writeInputArea(sample, patient, visit, type){
	numberSamples = sample.length;
	var textArea = document.getElementById('inputArea');
	for (var i = 0; i < numberSamples; i++){
		textArea.value += sample[i] + ';' + patient[i] + ';' + visit[i] + ';' + type[i] + '\n';
	}
}

// Refreshes Labels from inputArea
function refreshLabels(){
	var labelData = readInputArea();
	createAndShowLabels(labelData[0], labelData[1], labelData[2], labelData[3]);
}

// Parses textarea to arrays
function readInputArea(){
	// read textarea and split by linebreak
	var inputLines = document.getElementById('inputArea').value.split('\n');
	
	// initlaize empty arrays
	var sample = [];
	var patient = [];
	var visit = [];
	var type = [];
	
	// Parse lines to arrays
	for (var i = 0; i < inputLines.length; i++){
		// ignore empty lines
		if(inputLines[i].trim() != ''){
			let cells = inputLines[i].split(/[.,;|\t]/);
			
			if (cells.length == 4) {
				sample.push(cells[0]);
				patient.push(cells[1]); 
				visit.push(cells[2]);
				type.push(cells[3]);
			} else {
				// raise exception when a line is faulty
				alert("There were " + cells.length + " parameters set in line " + (i + 1) + ". Please specify only 4 parameters.");
				throw new Error("Too many parameters in a line in the input area.");
			}
		}
	}
	
	return [sample, patient, visit, type];
}

// Takes list of label elements and orders it in table
function showLabels(newLabels, numRows, numColumns){
	const multiLabelArea = document.getElementById('multiLabelArea');
	
	// Remove old labels
	while (multiLabelArea.firstChild) {
		multiLabelArea.removeChild(multiLabelArea.lastChild);
	}
	
	// Show new labels
	var nextLabel = 0;
	var pageNumber = 0;
	while (nextLabel < newLabels.length) {
		var pageWrapper = document.createElement('div');
		pageWrapper.className = 'pageWrapper';
		pageWrapper.id = 'pageWrapper-' + pageNumber;
	
		var labelTable = document.createElement('table');
		labelTable.className = 'labelTable';
		labelTable.id = "labelTable-" + pageNumber;
		pageNumber = pageNumber + 1;

		for (var r = 0; r < numRows; r++){
			let row = document.createElement('tr');
			
			for(var c = 0; c < numColumns; c++){
				let cell = document.createElement('td');

				if (nextLabel >= newLabels.length) {
					var dummylabel = createLabels([""], [""], [""], [""])[0];
					dummylabel.style["visibility"] = "hidden";
					cell.appendChild(dummylabel);
				} else {
					cell.appendChild(newLabels[nextLabel]);
				}
				
				nextLabel++;
				row.appendChild(cell);
			}
			
			labelTable.appendChild(row);
		}
		
		pageWrapper.appendChild(labelTable);
		multiLabelArea.appendChild(pageWrapper);

		// If there is only one label per page, change to landscape
		if (numColumns*numRows == 1) {
			document.getElementById(pageWrapper.id).style["width"] = "28.7cm";
			document.getElementById(pageWrapper.id).style["height"] = "20cm";
		} else {
			document.getElementById(pageWrapper.id).style["width"] = "20cm";
			document.getElementById(pageWrapper.id).style["height"] = "28.7cm";
		}
	} // End of while loop
	
	var pageWra = document.getElementById("pageWrapper-0");
	var style = pageWra.currentStyle || window.getComputedStyle(pageWra);
	var padding = parseInt(style.paddingLeft) + parseInt(style.paddingRight);
	
	pageWidthInPx = document.getElementById("pageWrapper-0").offsetWidth - padding;
	widthLabelTable = document.getElementById("labelTable-0").clientWidth;

	scaleFactor = pageWidthInPx / widthLabelTable;
	SingletonStyle.scale(scaleFactor);
}

// Creates a list of label elements
function createLabels(sample, patient, visit, type) {
	var newLabels = []
	
	numberSamples = sample.length;
	for (var i = 0; i < numberSamples; i++){
		
		// Create new div, table and row
		let divNewLabel = document.createElement('div');
		divNewLabel.className = "labelFrame";

		// Set spacing between rows and columns
		let col_spacing_value = document.getElementById('col_spacing_value').value;
		let row_spacing_value = document.getElementById('row_spacing_value').value;
		divNewLabel.style.marginRight = col_spacing_value + 'px';
		divNewLabel.style.marginBottom = row_spacing_value + 'px';

		let table = document.createElement('table');
		table.className = "innerLabelTable";
		let row = document.createElement('tr');
		
		// Right Cell --------------------
		let rightCell = document.createElement('td');
		rightCell.style = "width: 100%;";
		
		let divSampleId = document.createElement('div');
		divSampleId.style = "font-size: 150%;";
		divSampleId.innerHTML = "&nbsp;<b>" + sample[i] + "</b><br>";
		
		let divPatientId = document.createElement('div');
		divPatientId.innerHTML = "&nbsp;<b>Patient:&nbsp</b>" + patient[i];
		
		let divVisit = document.createElement('div');
		divVisit.innerHTML = "&nbsp;<b>Visit:&nbsp</b>" + visit[i];
		
		let divType = document.createElement('div');
		divType.innerHTML = "&nbsp;<b>Type:&nbsp</b>" + type[i];
		
		rightCell.appendChild(divSampleId);
		rightCell.appendChild(divPatientId);	
		rightCell.appendChild(divVisit);	
		rightCell.appendChild(divType);
		// ------------------------------
		
		// Left Cell --------------------
		let leftCell = document.createElement('td');
		
		let divCode = document.createElement('div');
		divCode.className = 'divCode';
		
		let codeMode = document.querySelector('input[name="code"]:checked').value;
		if (codeMode == 'QR_code') {
			var svgNode = QRCode({
								msg :  sample[i]
								,dim :   46
								,pad :   1
								,mtx :   1
								,ecl :  "H"
								,ecb :   0
								,pal : ["#000000", "#ffffff"]
								,vrb :   0
							});
						divCode.appendChild(svgNode)
			//code.clear();
			//code.makeCode(sample[i]);
		} else if (codeMode == 'DM_code'){
			var svgNode = DATAMatrix({
						 msg :  sample[i]
						,dim :   46
						,rct :   0
						,pad :   1
						,pal : ["#000000", "#ffffff"]
						,vrb :   0
					});
			divCode.appendChild(svgNode);
		}else {
			var svgNode = BARCode({
						msg  : sample[i]
						,dim  : [ 13, 46 ]
						,pad  : [ 16, 1 ]
					});
			divCode.appendChild(svgNode);
		}
		
		leftCell.appendChild(divCode);
		// ------------------------------
		
		row.appendChild(leftCell);
		row.appendChild(rightCell);
		
		table.appendChild(row);
		divNewLabel.appendChild(table);

		newLabels.push(divNewLabel);
	} // End of for loop
	
	return newLabels;
}

document.addEventListener("DOMContentLoaded", function() {
	initialize();
});