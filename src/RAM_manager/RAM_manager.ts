import { NS } from "@ns";

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

	a request include a timing element, either "infinite" "instant" [start_time, end_time]

	special case: max threads for processes

	
	step 1: finding available space (Find_space(request))
    	for each time stamps (in allocated_RAM) included by the timing request
        	find all available block of RAM (& remaining RAM)
    	find all continuous block for all time stamps included that can fit the request
    	select the one with smallest remaining RAM on server ()

	step 2: write space found to allocated_RAM
	

*/


// test functions
var Test = {
	Write_to_port: function(i: number){
		let data;
		switch (i) {
			case 1:
				//{script: {script_name: [name, server], RAM: {threads: , thread_size: ,server: ""}, args: []}};
				data = {script: {script_name: ["test.js", "home"], RAM: {threads: 1, thread_size: 1.6, server: "home"}, timing: "instant", args: []}};
				break;
			case 2:
				//{process: {requester: pid, RAM: {threads: , thread_size: ,server: ""}}};
				data = {process: {requester: 69, RAM: {threads: 5, thread_size: 2.6, server: ["home"]}}};
				break;
			case 3:
				// {free:}

				break;
			case 4:
				data = {re_scan: true};
				break;
		}
		_ns.writePort(2, JSON.stringify(data));
	}
}




import {Find_servers, Find_and_compromise, Get_RAM} from "function_find_RAM.ts";

var _ns: NS; 
var RAM_state;
export async function main(ns: NS): Promise<void> {
	_ns = ns;
	
	/* initialisation */ 
	// finds all available ram (& nuke some servers if they can be nuked)
	let all_RAM = Find_all_RAM();
	//ns.tprint(all_RAM);

	ns.clearPort(2);
	// 1: script, 2: process, 3: free, 4: re-scan
	Test.Write_to_port(1)


	RAM_state = {};
	let scripts = [];
	//while (true){
		// read the request from port 2
		let port_data = ns.readPort(2);
		ns.tprint("port_data: ", port_data);
		if (port_data != "NULL PORT DATA"){

			let request = JSON.parse(port_data);
			// identify the request type
			if (request.script){
				ns.tprint("request.script: ", request.script);
				Fit_script_in_RAM(request.script);
			}
			else if (request.process){
				ns.tprint("request.process: ", request.process);
				Fit_process_in_RAM(request.process);
			}
			else if (request.free) {
				ns.tprint("request.free: ", request.free);
				RAM_state = Free(request.free);
			}
			else if (request.re_scan){
				all_RAM = Find_all_RAM()
				ns.tprint("request.re_scan: ", request.re_scan);
			}
		}

		// manage stopped script
		let stopped = Check_stopped_scripts(scripts)
		for (let script in stopped){
			Free(script);
		}

		await ns.sleep(1000);
	//}
}

// finds all available ram (& nuke some servers if they can be nuked)
function Find_all_RAM() {
	// get all available server
	let all_servers = Find_servers(_ns); // returns an array of all the servers
	// get all admin/nuke all nukable
	let admin_server = Find_and_compromise(_ns, all_servers); // returns an array of all the admin servers
	// get the RAM of all accessible servers
	let all_RAM = Get_RAM(_ns, admin_server) // returns the RAM of all the admin servers in the form:{server1: RAM, server2: RAM, ... }
	return all_RAM;
}


// !!!
function Free() {

}

// {script_name: [name, server], RAM: {threads: , thread_size: ,server: [""]}, timing: “”,args: []}
function Fit_script_in_RAM(request) {

}

function Fit_process_in_RAM(request) {

}
