-- ============================================================
--  Follow-Up Machine — Mac auto-sender (OPTIONAL, advanced)
-- ============================================================
--  What it does:
--    Sends a batch of already-personalized iMessages, fully hands-free,
--    using the Messages app on a Mac. Zero taps per message.
--
--  You only need this if you have a Mac AND want to skip the
--  one-tap-per-message step. On an iPhone you don't need it at all.
--
--  How to use:
--    1. In the Follow-Up Machine app, build your batch as usual and,
--       on the send screen, tap "Download Mac send-file".
--       That saves a file named  followup-macsend.txt
--    2. Make sure the Messages app on your Mac is signed in to iMessage
--       (Messages > Settings > iMessage).
--    3. Open this file in the "Script Editor" app (already on every Mac)
--       and press the ▶ Run button. Pick the followup-macsend.txt file
--       when prompted.
--    4. The first time, macOS asks permission for the script to control
--       Messages — click OK / Allow.
--
--  The send-file format is one recipient per line:
--        +15551234567<TAB>Hi Susan, just checking in ...
--  (line breaks inside a message are stored as \n and restored on send.)
-- ============================================================

on run
	set theFile to choose file with prompt "Choose your Follow-Up send-file (followup-macsend.txt)"
	set theText to read theFile as «class utf8»
	set theLines to paragraphs of theText

	set sentCount to 0
	set failList to {}

	tell application "Messages"
		set iService to 1st account whose service type = iMessage
	end tell

	repeat with rawLine in theLines
		set thisLine to (rawLine as text)
		if thisLine is not "" then
			set tabPos to offset of tab in thisLine
			if tabPos > 0 then
				set phoneNum to text 1 thru (tabPos - 1) of thisLine
				set msg to text (tabPos + 1) thru -1 of thisLine
				set msg to my restoreNewlines(msg)
				try
					tell application "Messages"
						set theBuddy to participant phoneNum of iService
						send msg to theBuddy
					end tell
					set sentCount to sentCount + 1
					delay 1.2 -- gentle pause so Messages keeps up & sends stay individual
				on error
					set end of failList to phoneNum
				end try
			end if
		end if
	end repeat

	set summary to "Sent " & sentCount & " message(s)."
	if (count of failList) > 0 then ¬
		set summary to summary & return & (count of failList) & " could not be sent: " & my joinText(failList, ", ")
	display dialog summary buttons {"OK"} default button "OK" with title "Follow-Up Machine"
end run

-- turn the literal characters backslash-n back into real line breaks
on restoreNewlines(t)
	set AppleScript's text item delimiters to "\\n"
	set parts to text items of t
	set AppleScript's text item delimiters to return
	set t to parts as text
	set AppleScript's text item delimiters to ""
	return t
end restoreNewlines

on joinText(lst, sep)
	set AppleScript's text item delimiters to sep
	set s to lst as text
	set AppleScript's text item delimiters to ""
	return s
end joinText
