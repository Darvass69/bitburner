/*
// This is crossed out
& This is pink
! This is red
^ This is yellow
? This is blue
* This is green
~ This is purple
TODO this is orange
*/

/*
break script PIDs because integer limit?

*/

/* The goals:
	1. finds all available ram (& nuke some if they can be nuked)
	2. allocate ram to different scripts

1: FINDING RAM
	This step is pretty straight forward,
	Find the max RAM of every available server and update it when new servers are nuked/bought and home RAM gets upgraded
		this can be triggered by scripts by sending a "re-scan" request in port 2
			re-scan request = {re-scan: true}

2: ALLOCATING RAM
	always keep ~4GB on home for a launch.js script and manual scripts.

	for each requests, the manager will try to give the requested RAM on a single server. 
	(because some processes benefit from multi-threading, and are worse when separated)

	a request include a timing element, either "infinite", "instant", [start_time, end_time]


	special case: max threads for processes


    



*/



// when fitting,
    // for each time stamps included by the timing request
        // find all available block of RAM (& remaining RAM)
    // find all continuous block for all time stamps included that can fit the request
    // select the one with < remaining RAM on server,
    // 





// sort keys in obj
/** @param {NS} ns */
export async function main(ns) {
    const obj = {
        6: "e",
        3: "d",
        0: "a",
        1: "b",
        2: "c",
    };
    // Sort ascending.
    const key = Object.keys(obj).sort((a, b) => a - b);
    key.forEach((k) => ns.tprint(`key = ${k}, value = ${obj[k]}`));
}


