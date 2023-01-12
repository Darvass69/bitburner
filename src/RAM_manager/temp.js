/*
break script PIDs because integer limit?

*/

/* The goals:
	1. finds all available ram (& nuke some if they can be nuked)
	2. allocate ram to different scripts

1: FINDING RAM
	This step is pretty straight forward,
	Find the max RAM of every available server and update it when new servers are nuked/bought and home RAM gets upgraded
		this can be trigered by scripts by sending a "re-scan" request in port 2
			re-scan request = {re-scan: true}

2: ALLOCATING RAM
	always keep ~4GB on home for a launch.js script and manual scripts.

	for each requests, the manager will try to give the requested RAM on a single server. 
	(because some processes benefit from multi-threading, and are worse when seperated)

	a request include a timing element, either "infinite", "instant", [start_time, end_time]


	special case: max threads for processes


    



*/

// add something for instant time?
allocated_RAM = {
    [time1]: {
        [server1]: {
            [PID1]: {
                "script": 1,
                "process": 1,
                "reserved": {amount: 1, prio: 1},
            },
            [PID2]: {
                "script": 1,
                "process": 1,
                "reserved": {amount: 1, prio: 1},
            },
        },
        [server2]: {

        }
    },
    [time2]: {

    }
}
// another version in ports, primary key is the PID of scripts
port_RAM = {
    [PID1]: {
        "script": [server, RAM],
        "process": {}
    },
    [PID2]: {

    }
}



// when fitting,
    // for each time stamps included by the timing request
        // find all available block of RAM (& remaining RAM)
    // find all continuous block for all time stamps included that can fit the request
    // select the one with < remaining RAM on server,
    // 




script =
    {
        script:{
            script_name:["/name.js","server"], 
            RAM:{
                threads: 1,
                thread_size: 1, 
                server:[""]
            },
            timing: "infinite" | "instant" | [start, end],
            args:[]
        }
    }

process = 
    {
        process:{
            requester: pid,
            RAM: {
                threads: 1,
                thread_size: 1,
                server:[""]
            }, 
            timing: "infinite" | "instant" | [start, end]
        }
    }

free = 
    {
        free:{
            requester_PID:[
                {
                    server: "",
                    RAM: 1,
                    timing: "infinite" | "instant" | [start, end]
                }, 
                {
                    "...":"..."
                }
            ]
        }
    }










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
    key.forEach((k) => ns.tprintf(`key = ${k}, value = ${obj[k]}`));
}