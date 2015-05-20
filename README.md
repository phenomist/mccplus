# mccplus
An addon for A Mining Game, formerly known as Minecraft Clicker.

I will make this look better when I am not sleep-deprived and have time.

MCC+ Client for Minecraft Clicker Version 32.2

http://www.trugul.com/

Created By: TehShortbus

Forked by qwerqwerqwer (v26+) <- this is phenomist, by the way

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

-- do not spam the button, otherwise no name will be entered to raid, need to wait at least 1 second between clicks do to 
server lag.

30.1

-- raid messages now goto text box instead of popup

-- raid message history is maintained for current session only

30.2

-- added automatic update to raid name dropdown list once per hour, incase player changes rank, this way user does not need 
to restart everytime they change rank

-- for the moment there is still 1 popup that could not be entirely gotten rid of, you may see a black box appear then 
disappear, this is due to how the game is set up and lag time between client and server.

-- currently this is not the most efficient script, maybe someone can find a better way to handle the popups, but it is 
functional, cuts raid time from 2-3 seconds to about 1 second.

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
