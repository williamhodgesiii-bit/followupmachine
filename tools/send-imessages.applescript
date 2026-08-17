-- ============================================================
--  Follow-Up Machine — Mac auto-sender  (optional, zero-tap)
-- ============================================================
--  Sends a whole batch of already-personalized iMessages hands-free,
--  through the Messages app on a Mac. No tapping per message.
--
--  One-time setup:
--    • Sign in to iMessage: Messages app > Settings > iMessage.
--    • First run, macOS asks permission to control Messages — click OK.
--    • (Nice-to-have) In Script Editor choose File > Export > File Format:
--      Application. Now it's a double-click app you can keep in your Dock.
--
--  Each time you want to send:
--    1. In Follow-Up Machine, build your batch and tap
--       "Have a Mac? Download a file to auto-send them all."
--       That saves  followup-macsend.txt  to your Downloads.
--    2. Run this script (▶ in Script Editor, or double-click the app).
--       It finds that file in Downloads automatically, shows you the
--       count, and on "Send" fires them all off as iMessage.
--
--  Send-file format (one recipient per line):
--        +15551234567<TAB>Hi Susan, checking in on Jimmy ...
--  (line breaks inside a message are stored as \n and restored on send.)
-- ============================================================

on run
	-- 1. Find the newest followup-macsend*.txt in Downloads; otherwise ask.
	set thePath to ""
	try
		set dl to POSIX path of (path to downloads folder)
		set thePath to do shell script "ls -t " & quoted form of dl & "followup-macsend*.txt 2>/dev/null | head -n 1"
	end try
	if thePath is "" then
		set thePath to POSIX path of (choose file with prompt "Choose your followup-macsend.txt file")
	end if

	set theText to read (POSIX file thePath) as «class utf8»
	set theLines to paragraphs of theText

	-- 2. Collect valid rows first so we can show a count before sending.
	set jobs to {}
	repeat with rawLine in theLines
		set thisLine to (rawLine as text)
		if thisLine is not "" then
			set tabPos to offset of tab in thisLine
			if tabPos > 1 then
				set phoneNum to my trimText(text 1 thru (tabPos - 1) of thisLine)
				set msg to my restoreNewlines(text (tabPos + 1) thru -1 of thisLine)
				if phoneNum is not "" and msg is not "" then set end of jobs to {phoneNum, msg}
			end if
		end if
	end repeat

	if (count of jobs) is 0 then
		display dialog "No messages found in that file." buttons {"OK"} default button "OK" with title "Follow-Up Machine"
		return
	end if

	-- 3. One confirmation, then send them all.
	display dialog "Ready to send " & (count of jobs) & " iMessage(s) through Messages." & return & return & "They go out individually. Continue?" buttons {"Cancel", "Send"} default button "Send" with title "Follow-Up Machine"

	tell application "Messages"
		set iService to 1st account whose service type = iMessage
	end tell

	set sentCount to 0
	set failList to {}
	repeat with j in jobs
		set phoneNum to item 1 of j
		set msg to item 2 of j
		try
			tell application "Messages"
				set theBuddy to participant phoneNum of iService
				send msg to theBuddy
			end tell
			set sentCount to sentCount + 1
			delay 1.2 -- gentle pause so Messages keeps up
		on error
			set end of failList to phoneNum
		end try
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

on trimText(t)
	repeat while t starts with " " or t starts with tab
		set t to text 2 thru -1 of t
	end repeat
	repeat while t ends with " " or t ends with tab
		set t to text 1 thru -2 of t
	end repeat
	return t
end trimText

on joinText(lst, sep)
	set AppleScript's text item delimiters to sep
	set s to lst as text
	set AppleScript's text item delimiters to ""
	return s
end joinText
