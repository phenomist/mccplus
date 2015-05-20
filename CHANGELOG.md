# Changelog

## Main branch

### 33.1.0
* Removed defense timer messages now that the defense timers were removed from AMG

### 33.0.0
* Added proper support for hot reloading

### 32.2.0
* Throttled MCC+bot to 2s/msg

### 32.1.0
* Hot-loading code still has some issues, hack should kinda prevent that from happening post 32.1
* Moar shortcut box hax

### 32.0.0
* Major: Shortcuts box
* Moved 1-click raid to shortcuts box
* Added a clear raid dialogbox button
* Chatbot fix
* ">def"
* ">load"

### 31.5.0
* Silence

### 31.4.0 a.k.a. x10pi
* 1-click raid drop down now remembers last selected player on hourly update(assuming they are still a valid target in range)
* 1-click raid textbox is adjustable for height and width, default is 5x40:
* Updated link for raid info to goto user specific page

### 31.3.0
* Added some GB policing
* Hopefully Reset works now
* Removed some extraneous HTML in the 1-click raid box
* 1-click raid box no longer reports defenses

### 31.2.0
* Dragory updates shortenAmount

### 31.1.0
* Refactored dialog parsing + autoclick into more efficient JQuery

### 31.0.0
* Major: Added RonBurgundy's 1-click raid code

### 30.0.0
* Major: Long-awaited 1-click mod (RB's)
* Currently implemented: 1-click RB's. (You still need to click it though.)
* Also, battle/raid reports no longer exist, but still are reported to group.

### 29.3.0
* No longer case sensitive
* Reusable code???

### 29.2.0
* ">version"
* PM support!

### 29.1.0
* ">status"

### 29.0.0
* Major: Be your own chatbot! Group only.
* AFK Detection: ">afk"
* Hopefully no longer beta
* Major thanks to Dragory for several lines of code

### 28.3.0 / 28.4.0 / 28.5.0
* Actually fixed the bug? hopefully???
* I give up trying to find a good solution. Or good style. UGGGGGGGGH
* Oops, RB's are 80s not 60s, right... NOT SUSTAINABLE QQ will find better solution later.

### 28.2.0
* Fixed a long-standing RB detection bug, I hope
* Other bugfixing with title notifs

### 28.1.0
* Fixed title notifs not showing
* Commented out some console logs
* Removed some unused vars and stuff

### 28.1.0
* Fixed title notifs not showing
* Commented out some console logs
* Removed some unused vars and stuff

### 28.0.0
* Major: Integrated title notifs (thanks to Barry's Mod), minified. My tabs are small.

### 27.0.0
* Major: Integrated Dragory's 10 min in-chat timers.

### 26.1.0
* Removed "you may raid a poor soul" that doesn't work anyway
* Fixed the postemptive notification, hopefully.
* Added some magnitude symbols that will never see the light of day

### 26.0.0
* Major: Removed tons of now-obsolete chat features

### 25.0.0
BOSSES
* Portal changes images indicating when a RB fight is in progress
* Audio when RB is available, GB lobby can be clicked, GB can be clicked (approximate for last two)
RAIDS
* Raid defense/attack results reported automatically in group chat
* Audio alert when raid is ready

## Ron's branch

### 30.2.0
* Added automatic update to raid name dropdown list once per hour, incase player changes rank, this way user does not need to restart everytime they change rank
* For the moment there is still 1 popup that could not be entirely gotten rid of, you may see a black box appear then disappear, this is due to how the game is set up and lag time between client and server.
* Currently this is not the most efficient script, maybe someone can find a better way to handle the popups, but it is functional, cuts raid time from 2-3 seconds to about 1 second.

### 30.1.0
* Raid messages now goto text box instead of popup
* Raid message history is maintained for current session only

### 30.0.0
* 1-click raiding added – thanks RonBurgundy
* Do not spam the button, otherwise no name will be entered to raid, need to wait at least 1 second between clicks do to server lag.
