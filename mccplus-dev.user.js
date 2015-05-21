// ==UserScript==
// @name       MCC+ Dev
// @version    0.1
// @match      http://trugul.com/
// @match      http://trugul.com/index.php
// ==/UserScript==

function loadScript() {
	var req = new XMLHttpRequest();

	req.addEventListener('load', function(ev) {
		var response = ev.target.responseText;
		var script = document.createElement('script');
		script.innerHTML = response;
		document.body.appendChild(script);
	});

	req.addEventListener('error', function(ev) {
		console.log("Loading dev version failed, falling back to the regular one");
		var script = document.createElement('script');
		script.src = 'https://rawgit.com/phenomist/mccplus/master/mccplus.js?t=' + (new Date()).getTime().toString();
		document.body.appendChild(script);
	});

	req.open('GET', 'http://127.0.0.1:4000/mccplus.js?t=' + (new Date()).getTime().toString());
	req.send();
}

var hotReloadButton = document.createElement('a');
hotReloadButton.innerText = 'Reload MCC+';
hotReloadButton.href = 'javascript:void(0)';
hotReloadButton.addEventListener('click', loadScript);

var hotReloadButtonContainer = document.createElement('li');
hotReloadButtonContainer.appendChild(hotReloadButton);

document.querySelector('#navbar .nav').appendChild(hotReloadButtonContainer);

loadScript();
