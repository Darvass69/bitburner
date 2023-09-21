/*
Documentation for early hacking script

config.js: holds the settings and file paths

starter.js: run in the terminal to start the process

find_servers.js: get every server and gain root access when possible. add the result to servers.txt

find_target.js: find the best target using revolutionary ai. write it to target.txt

run_on_servers.js: run money_printer.js on every possible machines (keep ~10 GB free on home)

money_printer.js: 'print' money


servers.txt = {
	root: []
	noRoot: []
}

target.txt = [target, moneyThresh, securityThresh]


todo:
improve targeting
pad messages for run_on_servers
improve messages with colors (from config)
*/