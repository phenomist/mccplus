/*
MCC+ Client for Minecraft Clicker Version 32.2
http://www.trugul.com/
Created By: TehShortbus
Forked by qwerqwerqwer (v26+)
v31 by RonBurgundy

This is for entertainment purposes only. It's also only been tested in Google Chrome but should work in Firefox - don't trust IE.

Special thanks to:
- TehShortbus for starting the codebase
- Dragory for contributing and ChatBreakers for suggestions and testing. (v25-)
- Dragory again for contributing (v26+)
- Phylogenesis for some code
- RonBurgundy for 1-click raiding

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
-- Major: Removed tons of now-obsolete chat features
26.1
-- Removed "you may raid a poor soul" that doesn't work anyway
-- Fixed the postemptive notification, hopefully.
-- Added some magnitude symbols that will never see the light of day
27
-- Major: Integrated Dragory's 10 min in-chat timers.
28
-- Major: Integrated title notifs (thanks to Barry's Mod), minified. My tabs are small.
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
-- Major: Be your own chatbot! Group only.
-- AFK Detection: ">afk"
-- hopefully no longer beta
-- Major thanks to Dragory for several lines of code
29.1
-- ">status"
29.2
-- ">version"
-- PM support!
29.3
-- No longer case sensitive
-- Reusable code???
30
-- Major: Long-awaited 1-click mod (RB's)
-- Currently implemented: 1-click RB's. (You still need to click it though.)
-- Also, battle/raid reports no longer exist, but still are reported to group.

Ron's Branch
30.0
-- 1-click raiding added – thanks RonBurgundy
-- do not spam the button, otherwise no name will be entered to raid, need to wait at least 1 second between clicks do to server lag.
30.1
-- raid messages now goto text box instead of popup
-- raid message history is maintained for current session only
30.2
-- added automatic update to raid name dropdown list once per hour, incase player changes rank, this way user does not need to restart everytime they change rank
-- for the moment there is still 1 popup that could not be entirely gotten rid of, you may see a black box appear then disappear, this is due to how the game is set up and lag time between client and server.
-- currently this is not the most efficient script, maybe someone can find a better way to handle the popups, but it is functional, cuts raid time from 2-3 seconds to about 1 second.

31
-- Major: Added RonBurgundy's 1-click raid code
31.1
-- Refactored dialog parsing + autoclick into more efficient JQuery
31.2
-- Dragory updates shortenAmount
31.3
-- Added some GB policing
-- Hopefully Reset works now
-- Removed some extraneous HTML in the 1-click raid box
-- 1-click raid box no longer reports defenses
31.4 a.k.a. x10pi
-- 1-click raid drop down now remembers last selected player on hourly update(assuming they are still a valid target in range)
-- 1-click raid textbox is adjustable for height and width, default is 5x40:
-- updated link for raid info to goto user specific page
31.5
-- silence
32
-- Major: Shortcuts box
-- Moved 1-click raid to shortcuts box
-- Added a clear raid dialogbox button
-- chatbot fix
-- ">def"
-- ">load"
32.1
-- Hot-loading code still has some issues, hack should kinda prevent that from happening post 32.1
-- moar shortcut box hax
32.2
-- Throttled MCC+bot to 2s/msg
*/

// Settings
var mccPlus_GB_Timeout         = 624;
var mccPlus_Version            = "32.2";
var mccPlus_Version_Date       = "05/20/2015 04:04 PST";
var mccPlus_RBUp = "";
var mccPlus_Raid = "";
var mccPlus_GBUp = "";
var mccPlus_LastClicked = new Date;
var mccPlus_LastDef;
var mccPlus_LastLoad = new Date;
var mccPlus_LastBot = new Date;
var mccPlus_Username = $("b#playerName").text(); // thanks drag 1/2 (^_^)
var mccPlus_CanRB = true;
var mccPlus_silence = false;
if (mccPlus_Username == "nerve") {
  mccPlus_silence = true;
}

if (mccPlus_LastDef == 0) {
  mccPlus_LastDef = new Date;
}

// Let everyone know we loaded.
console.log('MCC+ Initialized! Version '+mccPlus_Version+' ('+mccPlus_Version_Date+')');
setTimeout(function(){ setRaidTimer(); }, 5000);

// Establish client through websocket connection
mccPlusClient = io.connect('http://5.189.137.117:469');

// Reset!
mccPlusClient.off('popup'); // gets rid of RB notifs.
mccPlusClient.off('battleresult'); // no more battle result popups. They still get reported ingroup though.
$('#mccPlus_Audio').remove(); // This one actually fulfills reset purposes

// Shortcut Box! Highly suggested that you finish the storyline first.
document.getElementById("vault_container").innerHTML='<center><div id="raid1c"></div></center><div id = "employment" style="margin-top:3px"><div id = "refresh"><table name="soldiers" cellpadding="8" type="tab" class="hidden" style="display: table;"><tbody><tr name="knight"><td><img src="game/img/npc/viking.png" height="32"><br><b>Viking</b><br>$<span name="price">300</span> - KPE: <span name="kpe">4</span></td><td><button name="buy-knight">Buy</button><button name="buymax-knight">Buy Max</button><br>You own <span name="owned"></span><br>Total KPE: <span name="totalKPE"></span></td></tr></table></div><table><tr><td><img src="game/img/npc/steve.png" height="32"><br><b><span name="scientists_price">2 BC</span></b><br>Rate: +<span name="scientistTime">15</span>s<br><center><font size="2"><a href="#" name="scientistBuyMode" style="color: rgb(42, 110, 116);">Change currency type to money</a></font></center></td><td>You own <span name="scientists_owned">87830</span> scientists.<br><button name="hire_scientist">Buy</button> &nbsp;<button name="fire_scientist">Sell</button><br><button name="hirex_scientists">Buy X</button><button name="hiremax_scientists">Buy max</button></td></tr></table></div>'

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

// Subroutines are great (see v30 for new stuff)
function RBHandler() {
  mccPlus_CanRB = false;
  $('a[name="bossPortal"] img').attr('src','http://www.dunsworth.net/trugul/bossPortal_Active.png');
  mccPlus_RBUp = ""; updateTitle();

  setTimeout(function(){
    $('a[name="bossPortal"] img').attr('src','http://www.dunsworth.net/trugul/bossPortal.png');
    setTimeout(function(){
      $('#mccPlus_Audio_RB')[0].play();
      mccPlus_RBUp = "r"; updateTitle();
      mccPlus_CanRB = true;
    },60000);
  },80000); // absolutely non-sustainable solution.
}

// shhh
function silenceConditional(message) {
  if (!mccPlus_silence) {
    mccPlusClient.emit("group_chat_message",message);
  }
  else {
    console.log(message);
  }
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
        silenceConditional('★★ ' + raidResults.u + " CAN BE RAIDED AGAIN");
        mccPlus_Raid = mccPlus_Raid+"!"; updateTitle();
    }, 60 * 10 * 1000);


  } else {
    raidText += "★★ DEFENSE FROM ("+raidResults.u+") & ";
    mccPlus_LastDef = new Date;
    if(raidResults.r){
      raidText += "WON ➨ Killed ("+shortenAmount(raidResults.eK)+") ✦ Lost ("+shortenAmount(raidResults.dK)+")";
    } else {
      raidText += "LOST ➨ Looted ("+shortenAmount(raidResults.money)+") ✦ Killed ("+shortenAmount(raidResults.eK)+") ✦ Lost ("+shortenAmount(raidResults.dK)+")";
    }
    // Tell the group when our own raid defense wears off
    setTimeout(function() {
        silenceConditional("★★ I CAN BE RAIDED AGAIN");
    }, 60 * 10 * 1000);
  }
  silenceConditional(raidText);
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
var unitPrefixes = {
	3: 'K',
	6: 'M',
	9: 'B',
	12: 'T',
	15: 'Qa',
	18: 'Qi'
};

function shortenAmount(num) {
	// Remove commas and truncate decimals
	num = num.toString().replace(/,/g, '').replace(/\..+/g, '');

	// Find the closest magnitude with a prefix by subtracting until we find one
	var magnitude = num.slice(1).length;
	while (! unitPrefixes[magnitude] && magnitude > 0) magnitude--;

	if (magnitude > 0) {
		// If we found a prefix, format the number accordingly
		return num.slice(0, -1 * magnitude) + '.' + num.substr(-1 * magnitude, 2) + unitPrefixes[magnitude];
	}

	// Otherwise (usually because the number is <1000) just return the number
	return num;
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
  output = output + seconds + "s";
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
mccpgrouphandler = function(data){  GBStats_CBot("g",data);};
mccpprivhandler = function(data){  GBStats_CBot("p",data);};

function cieq(a,b) { // case insensitive equals
  return a.toLowerCase() == b.toLowerCase();
}

function GBStats_CBot(channel,data) {
  var msg = data.message.replace(/&gt;/g, '>').replace(/&lt;/g, '<'); // thanks drag 2/2 (^_^)
  if (msg[0] == ">"){
    var message = msg.split(' ');
    var requester = data.username;
    var command = message[0] || '';
    command = command.slice(1, command.length);
    var args = message.slice(1, message.length);
    var text = "";
    if (cieq(args[0],mccPlus_Username) || (cieq(mccPlus_Username,requester) && args[0]==undefined)) {
      switch(command.toLowerCase()) {
        case "afk":
          text = args[0] + " has been afk for " + timeProcessor(new Date - mccPlus_LastClicked);
          break;
        case "def":
          text = args[0] + " has not been attacked for " + timeProcessor(new Date - mccPlus_LastDef) + ". They can be attacked again in "+timeProcessor(600000 - (new Date - mccPlus_LastDef));
          break;
        case "load":
          text = args[0] + " has been running this script for " + timeProcessor(new Date - mccPlus_LastLoad);
          break;
        case "status": // fuzzy troopcount counter
          var tc = game.employedSoldiers.knight+game.employedSoldiers.advknight+game.employedSoldiers.templar;
          text = "[TROOPS: " + (tc > 0 ? (tc > 1e11 ? "MANY" : "SOME") : "NONE");
          text += "] [WORKERS: " + (game.workerToggle ? "ON" : "OFF") + "]" + (mccPlus_silence ? "[silence mode]" : "");
          break;
        case "version":
          text = "Running MCC+ version "+mccPlus_Version+".";
          break;
      }
      if (text != "") {
        if ((new Date - mccPlus_LastBot) > 2000) { // throttles individual bots to 2s. Stops shadow-clones, somewhat
          if (channel == "g") {
            mccPlusClient.emit("group_chat_message",text);
          }
          if (channel == "p") {
            mccPlusClient.emit("private_chat_message",{to: requester, message: text});
          }
          mccPlus_LastBot = new Date;
        }

      }
    }
  }
};
// }
// v30: Amazon 1-click ----------------------------------------------------------------------------------------------------------
$(document).off('click', 'a[name="bossPortal"]');
$(document).on('click', 'a[name="bossPortal"]', function() {
		if( !game.bossScenario['active'] && mccPlus_CanRB) {
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
    mccPlusClient.emit("raid",rdnm);
} //end function

function raidclear() {
  document.getElementById("rdmsgs").innerHTML=""
}

mccPlusClient.off('raid_404').off('raid_you').off('raid_novillage'
    ).off('raid_wait').off('raid_toomuch').off('raiderror').off('raid_range');

mccPlusClient.on('raid_404',function(){
			addrdmsg("User not found","The user you want to raid does not exist");
		}).on('raid_you',function(){
			addrdmsg("Seriously?","You can't raid yourself");
		}).on('raid_novillage',function(){
			addrdmsg("No village","The user you want to raid does not have a village");
		}).on('raid_wait',function(){
			addrdmsg("Wait","You need to wait 5 minutes in between raids");
		}).on('raid_toomuch',function(){
			addrdmsg("Too late","You got to the village but its storage had just been emptied. Too bad.");
		}).on('raiderror',function(){
			addrdmsg("Raid error","Please, contact the developers and tell us about this error");
		}).on('raid_range',function(){
			addrdmsg("Wait","You can only attack people who are within 20 positions from you in the leaderboard");
    }).on('battleresult',function(data){
			var template = "{{#or}}{{#r}}You won the raid against {{u}}! You killed {{eK}} enemies, and lost {{dK}} soldiers. You managed to steal ${{money}} from his storage.{{/r}}{{^r}}You lost the raid against {{u}}! You killed {{eK}} enemies, and lost {{dK}} soldiers.{{/r}}{{/or}}";
			Mustache.parse(template);
			addrdmsg("Raid report",Mustache.render(template, data));
    })


function addrdmsg(title, msg) {
  var ritext = msg;
  ritext = ritext.trim();
  document.getElementById("rdmsgs").innerHTML+=ritext + '\n\n';
  document.getElementById("rdmsgs").scrollTop = document.getElementById("rdmsgs").scrollHeight;
}

//add  raid ui
var ruid = ($("b#playerName").text());
httpGet("http://amglb.x10host.com/1clickraids.php?name=" + ruid, function(html)  {
     $('body').append('<br><br><center><div id="raid1c"></div></center>');
document.getElementById("raid1c").innerHTML='<center><h2><a href="http://amglb.x10host.com/display2.php?name='  + ruid + '" target="_blank"><font color="red"><u>Check Raid Info</u></font></a></h2></center><center><table id="rdtbl">';
     document.getElementById("rdtbl").innerHTML='<tr id="rdr">';
     document.getElementById("rdr").innerHTML='<td><select id="rtsel" name="rtsel" style="height:25px; font-weight:bold;">';
     var arraynms = html.split(",");
     var arraynmsL = arraynms.length;
     for (var arrcnt = 0; arrcnt < arraynmsL; arrcnt++) {
          document.getElementById("rtsel").innerHTML+='<option value="' + arraynms[arrcnt] + '">' + arraynms[arrcnt] + '</option>';
     } //end for
     document.getElementById("rdr").innerHTML+='</select></td><td><button onclick="cr1();">RAID</button><button onclick="raidclear();">CLEAR</button></td>';
     document.getElementById("rdtbl").innerHTML+='</tr>';
     document.getElementById("raid1c").innerHTML+='</table>';
     document.getElementById("raid1c").innerHTML+='<textarea id="rdmsgs" rows="10" cols="40"></textarea>';
}) //end function

//auto update raid dropdown list once per hour
setInterval(function() {
	  var rselval = document.getElementById("rtsel").value;
	  httpGet("http://amglb.x10host.com/1clickraids.php?name=" + ruid, function(html)  {
          document.getElementById("rtsel").innerHTML="";
          var arraynms = html.split(",");
	      var arraynmsL = arraynms.length;
  	      for (var arrcnt = 0; arrcnt < arraynmsL; arrcnt++) {
  		      if (arraynms[arrcnt] == rselval) {
		          document.getElementById("rtsel").innerHTML+='<option value="' + arraynms[arrcnt] + '" selected="selected">' + arraynms[arrcnt] + '</option>';
			  } else {
				  document.getElementById("rtsel").innerHTML+='<option value="' + arraynms[arrcnt] + '">' + arraynms[arrcnt] + '</option>';
  		      } //end if
	      } //end for
      }) //end function
}, 1000 * 60 * 60); //end function

// end 1-click raid code

// v32: Shortcut box takes too long to develop

		//credits: http://stackoverflow.com/a/2901298/1748664
function numberFormat(x)
{
	return Math.floor(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).on('click', '#employment a[name|="tab"]', function() {
  document.getElementById("refresh").innerHTML='<table name="soldiers" cellpadding="8" type="tab" class="hidden" style="display: table;"><tbody><tr name="knight"><td><img src="game/img/npc/viking.png" height="32"><br><b>Viking</b><br>$<span name="price">300</span> - KPE: <span name="kpe">4</span></td><td><button name="buy-knight">Buy</button><button name="buymax-knight">Buy Max</button><br>You own <span name="owned"></span><br>Total KPE: <span name="totalKPE"></span></td></tr></table>';
  for( var soldier in items.soldiers )
			{
				var sObj = items.soldiers[soldier];

				$('#employment table[name="soldiers"] tr[name="'+ soldier +'"] span[name="price"]').text(numberFormat(sObj.price));
				$('#employment table[name="soldiers"] tr[name="'+ soldier +'"] span[name="kpe"]').text(numberFormat(sObj.kpe));
				$('#employment table[name="soldiers"] tr[name="'+ soldier +'"] span[name="totalKPE"]').text(numberFormat(items.soldiers[soldier].kpe * game.employedSoldiers[soldier]));
				$('#employment table[name="soldiers"] tr[name="'+ soldier +'"] span[name="owned"]').text(numberFormat(game.employedSoldiers[soldier]));
			}
});
//Hacky!

// Dragory's Hotloading Solution??

var mccp = window.mccp = window.mccp || {};

// Unload the previous version if it's loaded
if (mccp.loaded) mccp.unload();

mccp.load = function() {
  mccp.loaded = true;
  mccPlusClient.on("group_chat_message",mccpgrouphandler);
  mccPlusClient.on("private_chat_message",mccpprivhandler);
};

mccp.unload = function() {
  mccPlusClient.off("group_chat_message",mccpgrouphandler);
  mccPlusClient.off("private_chat_message",mccpprivhandler);
};

mccp.load();
