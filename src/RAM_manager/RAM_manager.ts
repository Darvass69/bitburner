/*
// This is crossed out
! This is red: alert or mark things for debugging (ex: tprint)
? This is blue: questions
& This is pink: main structure
^ This is yellow: structure
~ This is purple: structure
* This is green:
TODO this is orange: todo
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

	a request include a timing element, either "infinite" "instant" [start_time, end_time]

	special case: max threads for processes

	
	step 1: finding available space (Find_space(request))
    	for each time stamps (in allocated_RAM) included by the timing request
        	find all available block of RAM (& remaining RAM)
    	find all continuous block for all time stamps included that can fit the request
    	select the one with smallest remaining RAM on server ()

	step 2: write space found to allocated_RAM
	

*/

//& -----------------------------------------------------------------------------
//&                                   Imports                                    
//& -----------------------------------------------------------------------------
import { NS, PortData } from "@ns";

//~ ------------------------ Type And Interface Import --------------------------
import type { AllRAM } from "./functions_find_RAM";
import type { PID } from "./Requester_Types";
import type * as Requester from "./Requester_Types";

//~ ----------------------------- Function import -------------------------------
import {Find_servers, Find_and_compromise, Get_RAM} from "./functions_find_RAM";



//& -----------------------------------------------------------------------------
//&                      Test functions to test functions                     
//& -----------------------------------------------------------------------------
let Test = {
	//^ ------------------------------ Write To Port --------------------------------
	Write_to_port: function(i: number){
		let data: Requester.RAMRequest | undefined;
		switch (i) {
			case 1:
				let s: Requester.ScriptRequest;
				data = {Script: {script_name: ["test.js", "home"], RAM: {threads: 1, thread_size: 1.6, server: ["home"]}, timing: "instant", args: []}};
				break;
			case 2:
				let r: Requester.ProcessRequest;
				data = {Process: {requester: 69, RAM: {threads: 5, thread_size: 2.6, server: ["home"]}, timing: "infinite"}};
				break;
			case 3:
				let f: Requester.FreeRequest;
				data = {Free: {31: [{server: "home", RAM: 8, timing: "infinite"}]}}
				break;
			case 4:
				let re: Requester.ReScanRequest;
				data = {Re_Scan: true};
				break;
		}
		_ns.writePort(2, JSON.stringify(data));
	}

	//^ --------------------------- Next Test Function ------------------------------
}


var _ns: NS; 
var RAM_state; //!
//& -----------------------------------------------------------------------------
//&                                    MAIN                                    
//& -----------------------------------------------------------------------------
export async function main(ns: NS): Promise<void> {
	_ns = ns;

	//^ ----------------------------- Initialization --------------------------------
	// finds all available ram (& nuke some servers if they can be nuked)
	let all_RAM = Find_all_RAM();
	//ns.tprint(all_RAM);

	ns.clearPort(2);
	// 1: script, 2: process, 3: free, 4: re-scan
	Test.Write_to_port(1)

	//& -------------------------------- Main loop ----------------------------------
	RAM_state = {}; //!
	let scripts = []; //!
	//while (true){
		//^ ------------------------ Read request from port 2 ---------------------------
		let port_data: string = String(ns.readPort(2));
		ns.tprint("port_data: ", port_data); //! print
		if (port_data != "NULL PORT DATA"){
			// Identify request type
			let request: Requester.RAMRequest = JSON.parse(port_data);

			//~ --------------------------------- Script ------------------------------------
			if (request.Script){
				ns.tprint("request.script: ", request.Script); //! print
				Fit_script_in_RAM(request.Script);
			}

			//~ --------------------------------- Process -----------------------------------
			else if (request.Process){
				ns.tprint("request.process: ", request.Process); //! print
				Fit_process_in_RAM(request.Process);
			}

			//~ ---------------------------------- Free -------------------------------------
			else if (request.Free) {
				ns.tprint("request.free: ", request.Free); //! print
				RAM_state = Free(request.Free);
			}

			//~ --------------------------------- Re_Scan -----------------------------------
			else if (request.Re_Scan){
				all_RAM = Find_all_RAM()
				ns.tprint("request.re_scan: ", request.Re_Scan); //! print
			}
		}

		//^ ------------------------- Manage running scripts ----------------------------
		// manage running scripts and free their RAm when they stop
		let stopped = Check_stopped_scripts(scripts)
		for (let script in stopped){
			Free_script(script);
		}

		await ns.sleep(1000);
	//}
}

//& -----------------------------------------------------------------------------
//&                              Request Functions                               
//& -----------------------------------------------------------------------------
//^ ------------------------------ Find All RAM ---------------------------------
// finds all available ram (& nuke some servers if they can be nuked)
function Find_all_RAM() {
	// get all available server
	let all_servers = Find_servers(_ns); // returns an array of all the servers
	// get all admin/nuke all Nuke-able
	let admin_servers = Find_and_compromise(_ns, all_servers); // returns an array of all the admin servers
	// get the RAM of all admin servers
	let all_RAM = Get_RAM(_ns, admin_servers) // returns the RAM of all the admin servers as AllRAM
	return all_RAM;
}


//^ ---------------------------- Fit Script In RAM ------------------------------
//!
function Fit_script_in_RAM(request: Requester.ScriptRequest) {

}


//^ --------------------------- Fit Process In RAM ------------------------------
function Fit_process_in_RAM(request: Requester.ProcessRequest) {

}


//^ ---------------------------------- Free -------------------------------------
// !!!
function Free(request: Requester.FreeRequest) {

}



//& -----------------------------------------------------------------------------
//&                      Manage Running Scripts Functions                        
//& -----------------------------------------------------------------------------
//^ -------------------------- Check Stopped Scripts ------------------ ----------
function Check_stopped_scripts(script: PID): void{
	
}


//^ ------------------------------- Free Script ---------------------------------
function Free_script(script: PID): void{

}