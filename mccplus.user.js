// ==UserScript==
// @name       MCC+
// @version    0.1
// @match      http://trugul.com/
// @match      http://trugul.com/index.php
// ==/UserScript==

function loadScript() {
	var script = document.createElement('script');
	script.src = 'https://rawgit.com/phenomist/mccplus/master/mccplus.js?t=' + (new Date()).getTime().toString();
	document.body.appendChild(script);
}

var hotReloadButton = document.createElement('a');
hotReloadButton.innerText = 'Reload MCC+';
hotReloadButton.href = 'javascript:void(0)';
hotReloadButton.addEventListener('click', loadScript);

var hotReloadButtonContainer = document.createElement('li');
hotReloadButtonContainer.appendChild(hotReloadButton);

document.querySelector('#navbar .nav').appendChild(hotReloadButtonContainer);

loadScript();
