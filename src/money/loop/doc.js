/*
Document for loop

config.js: holds the settings, file paths and port numbers *ALWAYS UPDATE WITH portTypes.ts*

manager.js: run in the terminal to start the process and keep updating the ratios
	starts findServers.js and findTarget.js when needed (can also take requests from ports)

findServers.js: get every server and gain root access when possible. add the result to a port

findTarget.js: find the best target using revolutionary ai. write it to a port

findRAM.js: find all available RAM and send it to a port



1:	write: findServers.js
		read only: manager.js
		content: serverList, list the server in the form {root: [], noRoot: []}


2:	write: findTarget.js
		read only: manager.js
		content: target, the targeted server in the form "target"

3:	write: findRAM.js
		read only: /money/loop/manager.js
		content: RAMInfo,the available RAM to be used by loop in the form {server: RAM}[]



	TODO
	//add server type to RAMInfo (player, hacked)
	in RAMInfo, add bought servers to player
	in findServer, add bought servers in isWeak?

	in findRAM and findTarget, add line to make sure port isn't empty

	combine findRAM, findTarget, findServers into a mega script

	have scripts report (in port 4) how much/how long to do their things, and graph security + money (% of max?)

	don't kill everything on home, only some scripts

	problems with ports not being cleared? test if ports fill up


	improve to dynamically use new RAM and be able to change ratio on the fly
	better starting of scripts (calculate intervals)


*/