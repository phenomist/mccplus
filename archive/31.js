/*
MCC+ Client for Minecraft Clicker Version 29.2
http://www.trugul.com/
Created By: TehShortbus
Forked by qwerqwerqwer (v26+)
v31 by RonBurgundy

This is for entertainment purposes only. It's also only been tested in Google Chrome but should work in Firefox - don't trust IE.

Special thanks to:
- Dragory for contributing and ChatBreakers for suggestions and testing. (v25-)
- Dragory again for contributing (v26+)
- Phylogenesis for some code
- RonBurgundy for 1-click raiding
- 

v25- Features (new features, see versionlog)
======================
BOSSES
-- Portal changes images indicating when a RB fight is in progress
-- Audio when RB is available, GB lobby can be clicked, GB can be clicked (approximate for last two)
RAIDS
-- Raid defense/attack results reported automatically in group chat
-- Audio alert when raid is ready

Recent Versionlog
======================
26
-- Removed tons of now-obsolete chat features
26.1
-- Removed "you may raid a poor soul" that doesn't work anyway
-- Fixed the postemptive notification, hopefully.
-- Added some magnitude symbols that will never see the light of day
27
-- Integrated Dragory's 10 min in-chat timers.
28
-- Integrated title notifs (thanks to Barry's Mod), minified. My tabs are small.
28.1
-- Fixed title notifs not showing
-- Commented out some console logs
-- Removed some unused vars and stuff
28.2
-- Fixed a long-standing RB detection bug, I hope
-- Other bugfixing with title notifs
28.3 / 28.4 / 28.5
-- Actually fixed the bug? hopefully???
-- I give up trying to find a good solution. Or good style. UGGGGGGGGH
-- Oops, RB's are 80s not 60s, right... NOT SUSTAINABLE QQ will find better solution later.
29
-- AFK Detection
-- Be your own chatbot! Group only.
-- hopefully no longer beta
-- Major thanks to Dragory for several lines of code
29.1
-- ">status"
29.2
-- ">version"
-- Potentially PM support?
29.3
-- No longer case sensitive
-- Reusable code!
30
-- Long-awaited 1-click mod
-- Currently implemented: 1-click RB's. (You still need to click it though.)
-- Also, battle/raid reports no longer exist, but still are reported to group.
31
-- Added RonBurgundy's 1-click raid code
*/

// Settings
var mccPlus_GB_Timeout         = 624;
var mccPlus_Version            = "30beta1";
var mccPlus_Version_Date       = "05/19/2015 02:46 PST";
var magnitudeSymbols           = { 0: '', 1: 'K', 2: 'M', 3: 'B', 4: 'T', 5: 'Qa' , 6: 'Qi', 7: 'Sx', 8: 'Sp', 9: 'Oc', 10: 'No'};
var mccPlus_RBUp = "";
var mccPlus_Raid = "";
var mccPlus_GBUp = "";
var mccPlus_LastClicked = new Date;
var mccPlus_Username = document.getElementById('playerName').innerText.toLowerCase(); // thanks drag 1/2 (^_^)

// Let everyone know we loaded.
console.log('MCC+ Initialized! Version '+mccPlus_Version+' ('+mccPlus_Version_Date+')');
setTimeout(function(){ setRaidTimer(); }, 5000);

// Establish client through websocket connection
mccPlusClient = io.connect('http://5.189.137.117:469');

// Reset!
mccPlusClient.off('popup'); // gets rid of RB notifs.
mccPlusClient.off('battleresult'); // no more battle result popups. They still get reported ingroup though.
$('#mccPlus_Audio').remove(); // This one actually fulfills reset purposes

// Adding Audio Divs
$('body').append('<div id="mccPlus_Audio"></div>');
$('#mccPlus_Audio').append('<audio controls id="mccPlus_Audio_GB" src="http://www.dunsworth.net/trugul/GBS.mp3">Not Supported</audio>')
                   .append('<audio controls id="mccPlus_Audio_RB" src="http://www.dunsworth.net/trugul/RBR.mp3">Not Supported</audio>')
                   .append('<audio controls id="mccPlus_Audio_LO" src="http://www.dunsworth.net/trugul/LO.mp3">Not Supported</audio>')
                   .append('<audio controls id="mccPlus_Audio_RR" src="http://www.dunsworth.net/trugul/RR.mp3">Not Supported</audio>')

// Play audio when GB gets near
mccPlusClient.on('globalBossCountdown',function(time){
  if(time==600){
    mccPlus_GBUp = ""; updateTitle();
    setTimeout(function(){ $('#mccPlus_Audio_GB')[0].play(); mccPlus_GBUp = "G"; updateTitle();},((mccPlus_GB_Timeout+45) * 1000));
    setTimeout(function(){ $('#mccPlus_Audio_LO')[0].play(); mccPlus_GBUp = "L"; updateTitle();},(mccPlus_GB_Timeout * 1000));
  }
});

// Popup Handling - Mostly for just RB detection
// RB handling when you perform the emit now, so this is probably obsolete code

/*
mccPlusClient.on('popup',function(popupObj){
  if(popupObj.title == 'SCENARIO #1'){
    RBHandler();
  }
});
*/

// Subroutines are great (see v30 for new stuff)
function RBHandler() {
  $('a[name="bossPortal"] img').attr('src','http://www.dunsworth.net/trugul/bossPortal_Active.png');
  mccPlus_RBUp = ""; updateTitle();

  setTimeout(function(){
    $('a[name="bossPortal"] img').attr('src','http://www.dunsworth.net/trugul/bossPortal.png');
    setTimeout(function(){
      $('#mccPlus_Audio_RB')[0].play();
      mccPlus_RBUp = "r"; updateTitle();
    },60000);
  },80000); // absolutely non-sustainable solution.
}

// Publish raid results to your Group Chat
mccPlusClient.on('battleresult',function(raidResults){
  var raidText = "";
  if(raidResults.or){
    setTimeout(function(){ setRaidTimer(); }, 5000);
    raidText += "★★ ATTACK ON ("+raidResults.u+") & ";

    if(raidResults.r){
      raidText += "WON ➨ Looted ("+shortenAmount(raidResults.money)+") ✦ Killed ("+shortenAmount(raidResults.eK)+") ✦ Lost ("+shortenAmount(raidResults.dK)+")";
    } else {
      raidText += "LOST ➨ Lost ("+shortenAmount(raidResults.dK)+") ✦ Killed ("+shortenAmount(raidResults.eK)+")";
    }

    // Tell the group when the target's raid defense wears off
    setTimeout(function() {
        mccPlusClient.emit('group_chat_message', '★★ ' + raidResults.u + " CAN BE RAIDED AGAIN");
        mccPlus_Raid = mccPlus_Raid+"!"; updateTitle();
    }, 60 * 10 * 1000);


  } else {
    raidText += "★★ DEFENSE FROM ("+raidResults.u+") & ";
    if(raidResults.r){
      raidText += "WON ➨ Killed ("+shortenAmount(raidResults.eK)+") ✦ Lost ("+shortenAmount(raidResults.dK)+")";
    } else {
      raidText += "LOST ➨ Looted ("+shortenAmount(raidResults.money)+") ✦ Killed ("+shortenAmount(raidResults.eK)+") ✦ Lost ("+shortenAmount(raidResults.dK)+")";
    }
    // Tell the group when our own raid defense wears off
    setTimeout(function() {
        mccPlusClient.emit('group_chat_message', "★★ I CAN BE RAIDED AGAIN");
    }, 60 * 10 * 1000);
  }
  mccPlusClient.emit('group_chat_message',raidText);
});

// Set Raid Timer
function setRaidTimer(){
  var timeTilRaid = (300000 - new Date().getTime() + game.lastRaid);
  mccPlus_Raid = ""; updateTitle();
  // console.log('Setting Raid Timer - Time Until Raid: '+timeTilRaid/1000+' seconds.');
  setTimeout(function(){
    // console.log('Raid Ready');
    mccPlus_Raid = "R"+mccPlus_Raid; updateTitle();
    $('#mccPlus_Audio_RR')[0].play();
  },timeTilRaid);
}

// Title Updater derived a bit from Barry's Mod
function updateTitle(){
  window.document.title = mccPlus_RBUp + mccPlus_GBUp + mccPlus_Raid + " | A Mining Game";
}

// Shorten input - Thanks to Dragory!
function shortenAmount(totalAmt){
  var magnitude, rounded, decimals, symbol;
  var shortenDecimalCount = 2;

  // Remove commas and truncate pre-existing decimals
  totalAmt = totalAmt.toString().replace(/,/g, '').replace(/\.[0-9]+/, '');

  // Figure out the magnitude from the number string length (minus one because 999 999 isn't a million yet)
  magnitude = Math.floor((totalAmt.length - 1) / 3);
  while (! magnitudeSymbols[magnitude] && magnitude > 0) magnitude--;

  // "Round" by removing the smaller numbers, leaving only one "decimal"
  // The fallbacks to 1000 are failsafes for numbers < 1000
  rounded = totalAmt.slice(0, (-3 * magnitude || 1000));
  decimals = totalAmt.substr((-3 * magnitude || 1000), shortenDecimalCount);
  if (decimals.match(/^0+$/) === null && decimals !== '') rounded += '.' + decimals;

  symbol = magnitudeSymbols[magnitude];

  return rounded.toString() + symbol;
}

// v29: AFK detection, chatbot framework! --------------------------------------------------------------------------------------

$(document).click(function(e) { mccPlus_LastClicked = new Date });

function timeProcessor(time){ // duration in milliseconds, as an integer
  var output = "";
  var seconds = Math.floor(time/1000);
  var minutes = Math.floor(seconds/60);
  var hours = Math.floor(minutes/60);
  var days = Math.floor(hours/24); //cmon you shouldn't need this
  var weeks = Math.floor(days/7); //pls!
  seconds = seconds%60;
  output = output + seconds + "s ";
  if (minutes>0) {
  minutes = minutes%60;
  output = minutes + "m "+output;
  if (hours>0) {
  hours = hours%24;
  output = hours + "h "+output;
  if (days>0) {
  days = days%7;
  output = days + "d "+output;
  if (weeks>0) {
  output = weeks + "w "+output;
  }}}}
  return output;
};

// derived from Phylogenesis's GBStats mod
mccPlusClient.on("group_chat_message",function(data){
  GBStats_CBot("g",data);
});
mccPlusClient.on("private_chat_message",function(data){
  GBStats_CBot("p",data);
});

function GBStats_CBot(channel,data) {
  var msg = data.message.replace(/&gt;/g, '>').replace(/&lt;/g, '<'); // thanks drag 2/2 (^_^)
  if (msg[0] == ">"){
    var message = msg.split(' ');
    var requester = data.username;
    var command = message[0] || '';
    command = command.slice(1, command.length);
    var args = message.slice(1, message.length);
    var text = "";
    args[0] = args[0].toLowerCase();
    if (args [0] == mccPlus_Username) {
      switch(command.toLowerCase()) {
        case "afk":
          text = args[0] + " has been afk for " + timeProcessor(new Date - mccPlus_LastClicked);
          break;
        case "status": // fuzzy troopcount counter
          var tc = game.employedSoldiers.knight+game.employedSoldiers.advknight+game.employedSoldiers.templar;
          text = "[TROOPS: " + (tc > 0 ? (tc > 1e11 ? "MANY" : "SOME") : "NONE");
          text += "] [WORKERS: " + (game.workerToggle ? "ON" : "OFF") + "]";
          break;
        case "version":
          text = "Running version "+mccPlus_Version+".";
          break;
      }
      if (channel == "g") {
        mccPlusClient.emit("group_chat_message",text);
      }
      if (channel == "p") {
        mccPlusClient.emit("private_chat_message",{to: requester, message: text});
      }
    }
  }
};

// v30: Amazon 1-click ----------------------------------------------------------------------------------------------------------
$(document).off('click', 'a[name="bossPortal"]');
$(document).on('click', 'a[name="bossPortal"]', function() {
		if( !game.bossScenario['active'] ) {
			mccPlusClient.emit('summonBoss', true);
      RBHandler();
    }
		});

// begin 1-click raid code

//get url contents
function httpGet(theUrl, callback)
{
     var xmlhttp;

     if (window.XMLHttpRequest)
     {// code for IE7+, Firefox, Chrome, Opera, Safari
          xmlhttp=new XMLHttpRequest();
     } else {// code for IE6, IE5
          xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
     }
     xmlhttp.onreadystatechange=function()
     {
          if (xmlhttp.readyState==4 && xmlhttp.status==200)
          {
               callback(xmlhttp.responseText);
          }
     }
     xmlhttp.open("GET", theUrl);
     xmlhttp.send();
} //end function

//1 click raid
function cr1() {
     var rdnm = document.getElementById("rtsel").value;
     var rb1 = document.getElementsByName("raid_button");
     rb1[0].click();
     var rb2 = document.getElementsByName("raid_user");
     rb2[0].value = rdnm;
     var btns = document.getElementsByName("buttons");
     var inht = btns[0].innerHTML;
     var srch1 = 'button name="';
     var srch2 = '"';
     if (inht.search(srch1) > -1) {
          var prs1 = inht.slice(inht.search(srch1)+srch1.length);
	  if (prs1.search(srch2) > -1) {
	       var prs2 = prs1.search(srch2);
	       var prs3 = prs1.substring(0,prs2);
	       var rb2 = document.getElementsByName(prs3);
	       rb2[0].click();
    	       //add raid message to textbox
	       var rmsghd = document.getElementsByName("store_content");
	       rmsghd[0].style.display = "none";

	       setTimeout(function() {
	            var rb3 = document.getElementsByName("continue");
		    rb3[0].click();
	       }, 200);

	       setTimeout(function() {
	            var rmsg = document.getElementsByName("content");
	     	    var rihtm = rmsg[0].innerHTML;
		    var ridiv = document.createElement("div");
		    ridiv.innerHTML = rihtm;
		    var ritext = ridiv.textContent || ridiv.innerText || "";
		    ritext = ritext.trim();
		    document.getElementById("rdmsgs").innerHTML+=ritext + '\n\n';
		    document.getElementById("rdmsgs").scrollTop = document.getElementById("rdmsgs").scrollHeight;
		    rmsghd[0].style.display = "block";
		}, 1000);
          } //end if
      } //end if
} //end function


//add buttons
var ruid = ($("b#playerName").text());

httpGet("http://amglb.x10host.com/1clickraids.php?name=" + ruid, function(html)  {
     $('body').append('<br><br><center><div id="raid1c"></div></center>');
     document.getElementById("raid1c").innerHTML='<center><h2><font color="red">1-Click Raid Targets</font></h2></center><center><h2><a href="http://amglb.x10host.com" target="_blank"><font color="red"><u>Check Raid Info</u></font></a></h2></center><center><table id="rdtbl">';
     document.getElementById("rdtbl").innerHTML='<tr id="rdr">';
     document.getElementById("rdr").innerHTML='<td><select id="rtsel" name="rtsel" style="height:25px; font-weight:bold;">';
     var arraynms = html.split(",");
     var arraynmsL = arraynms.length;
     for (var arrcnt = 0; arrcnt < arraynmsL; arrcnt++) {
          document.getElementById("rtsel").innerHTML+='<option value="' + arraynms[arrcnt] + '">' + arraynms[arrcnt] + '</option>';
     } //end for
     document.getElementById("rdr").innerHTML+='</select></td><td><button onclick="cr1();">RAID</button></td>';
     document.getElementById("rdtbl").innerHTML+='</tr>';
     document.getElementById("raid1c").innerHTML+='</table>';
     document.getElementById("raid1c").innerHTML+='<textarea id="rdmsgs" rows="10" cols="40"></textarea>';
}) //end function

//auto update raid dropdown list once per hour
setInterval(function() {
     httpGet("http://amglb.x10host.com/1clickraids.php?name=" + ruid, function(html)  {
          document.getElementById("rtsel").innerHTML="";
          var arraynms = html.split(",");
	  var arraynmsL = arraynms.length;
	  for (var arrcnt = 0; arrcnt < arraynmsL; arrcnt++) {
	     document.getElementById("rtsel").innerHTML+='<option value="' + arraynms[arrcnt] + '">' + arraynms[arrcnt] + '</option>';
	  } //end for
      }) //end function
}, 1000 * 60 * 60); //end function

// end 1-click raid code
