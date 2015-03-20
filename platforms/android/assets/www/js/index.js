/**
 * Global Variables
 */
var selectedCategory = "";
var selectedCategoryText = "";
var selectedSubCategory = "";
var capturedImage = "";
var latitude = 0;
var longitude = 0;
var watchID = 0;
var title = "";
var csvPath = "";
var IMEI = 0;
var phone = 0;

// TODO I. IMEI number, II. Phone number

/**
 * Finds/Calculate data and sends mail
 */
function exportMail() {
	title = document.getElementById('title').value;
	findSelectedSubCategory();
	cordova.exec(imeiSuccess, imeiFailure, "CustomPlugin", "getImeiNumber",
			[ "" ]);
	cordova.exec(phNoSuccess, phNoFailure, "CustomPlugin", "getPhoneNumber",
			[ "" ])
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFileSystem,
			failToGet);

}
/**
 * On Successfully opening the file system
 * 
 * @param fileSystem
 */
function gotFileSystem(fileSystem) {
	fileSystem.root.getFile("Bhuvan.csv", {
		create : true,
		exclusive : false
	}, gotFileEntry, failToGet);
}

/**
 * On successfully getting a file
 * 
 * @param fileEntry
 */
function gotFileEntry(fileEntry) {
	csvPath = fileEntry.toURL(); // Copying Opened file path
	console.log(csvPath);
	fileEntry.createWriter(gotFileWriter, failToGet);
}

/**
 * Writes Data in opened file
 * 
 * @param writer
 */
function gotFileWriter(writer) {
	writer.write("Title,Location,Category,Sub Category\n" + title + ","
			+ latitude + ":" + longitude + "," + selectedCategoryText + ","
			+ selectedSubCategory);
	writer.onwriteend = function(evt) {
		sendMail(); // On success of writing data. Sends mail
	};
}
/**
 * If any problem occurs
 * 
 * @param error
 */
function failToGet(error) {
	console.log(error.code);
}

/**
 * Triggers Mail
 */
function sendMail() {
	var body = "<h1>Dear Sir/Madam,</h1><b>Title: </b>" + title
			+ ",<br><b>Location: </b>" + latitude + "," + longitude
			+ " ,<br><b>Category: </b>" + selectedCategoryText
			+ ",<br><b>Sub Category: </b>" + selectedSubCategory
			+ "<br><b>Phone IMEI No: </b>" + IMEI + "<br><h1>Thanks</h1>";
	window.plugin.email.open({
		app : 'gmail',
		subject : 'Congratulations',
		body : body,
		attachments : [ capturedImage, csvPath ],
		isHtml : true
	});
}

/**
 * Request current location
 */
function getLocation() {
	navigator.geolocation.getCurrentPosition(geolocationSuccess,
			geolocationError);
}
/**
 * If current location is successfully fetched
 * 
 * @param position
 *            <p>
 *            Contains current position details
 *            </p>
 */
function geolocationSuccess(position) {
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	document.getElementById('locationDiv').innerHTML = latitude + ","
			+ longitude;
}
/**
 * If there is any error while fetching current location
 * 
 * @param error
 *            <p>
 *            Error message
 *            </p>
 */
function geolocationError(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}
/**
 * Open Camera app to capture image
 */
function getPicture() {
	navigator.camera.getPicture(onPictureSuccess, onPictureFail, {
		quality : 100,
		destinationType : Camera.DestinationType.FILE_URI,
		targetWidth : 300,
		targetHeight : 300,
		correctOrientation : true
	});
}
/**
 * Sets image to the img element with id='capturedImage'
 * 
 * @param imageURI
 *            <p>
 *            Captured Image URI
 *            </p>
 */
function onPictureSuccess(imageURI) {
	capturedImage = imageURI;
	var image = document.getElementById('capturedImage');
	image.src = imageURI;
}

/**
 * If the Capturing process fail this method is called
 * 
 * @param message
 *            <p>
 *            Error Message
 *            </p>
 */
function onPictureFail(message) {
	alert('Failed because: ' + message);
}

/**
 * On select of Radio Buttons. Enable send mail button if "Yes" selected Disable
 * send mail button if "NO" selected
 * 
 * @param selected
 *            <p>
 *            Radio button value
 *            </p>
 */
function showSendMail(selected) {
	if (selected.indexOf("YES") > -1) {
		document.getElementById("sendMailButton").disabled = false;
	} else {
		document.getElementById("sendMailButton").disabled = true;
	}
}

/**
 * On select of Category1
 * <ol>
 * <li> copy selected category name to global variable selectedCategoryText
 * </li>
 * <li> Shows respective sub category and hide remaining </li>
 * </ol>
 */
function loadSubCategory() {
	var categorySelect = document.getElementById('categorySelect');
	selectedCategory = categorySelect.options[categorySelect.selectedIndex].value;
	selectedCategoryText = categorySelect.options[categorySelect.selectedIndex].text;
	if (selectedCategory != 0) {
		document.getElementById('subCategory' + selectedCategory).style.display = 'block';
	}
	for ( var i = 1; i < 9; i++) {
		var id = 'subCategory' + i;
		if (i == selectedCategory) {
			continue;
		}
		document.getElementById(id).style.display = 'none';
	}
}

/**
 * This method will be use full to calculate/find which Category2 has been
 * selected
 */
function findSelectedSubCategory() {
	var subCategorySelectElements = document
			.getElementsByClassName('subCategorySelect');
	var categorySelect = document.getElementById('categorySelect');
	selectedCategory = categorySelect.options[categorySelect.selectedIndex].value;
	selectedSubCategory = subCategorySelectElements[selectedCategory - 1].options[subCategorySelectElements[selectedCategory - 1].selectedIndex].text;
}

/**
 * Custom Plugin
 * 
 * @param phoneNumber
 */

function phNoSuccess(phoneNumber) {
	console.log(phoneNumber);
	if (phoneNumber.length > 9) {
		phone = phoneNumber;
	} else {
		phone = "NA";
	}
}

function phNoFailure(error) {
	console.log(error);
}

function imeiSuccess(imeiNumber) {
	IMEI = imeiNumber;
}

function imeiFailure(error) {
	console.log(error);
}