/*
// This is crossed out
! This is red: alert or mark things for debugging (ex: tprint)
? This is blue: questions
& This is pink: main structure
^ This is yellow: structure
* This is green: structure
~ This is purple: 
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
		"instant" can't be planned (in allocated RAM) for somewhere in the future, they need to be run now, or put into a queue that will try to run them later

	special case: max threads for processes
		reserved RAM: only to tell a requester au much RAM is available, the reserved RAM can't be reserved for 2 requesters but it can be given to any scripts
			it's not really reserved, it's just telling the requester "If you want, I have that much RAM. I wont keep it free if I need it, but you can take it if its free"
			useful when multiple requesters wants max threads because we can reserve ex: 1/2 the RAM for each which allows both to get as much as they want
	
	step 1: finding available space (Find_space(request))
    	for each time stamps (in allocated_RAM) included by the timing request
        	find all available block of RAM (& remaining RAM)
    	find all continuous block for all time stamps included that can fit the request
    	select the one with smallest remaining RAM on server ()

	step 2: write space found to allocated_RAM
	
	see behavior examples for clarifications on how it's supposed to work

					

*/

//& -----------------------------------------------------------------------------
//&                                   Imports
//& -----------------------------------------------------------------------------
import { NS, PortData } from "@ns";

//~ ------------------------ Type And Interface Import --------------------------
import type { AllRAM } from "./FindAllRAM";
import type {
  ScriptRequest,
  ProcessRequest,
  FreeRequest,
  ReScanRequest,
  RAMRequest,
  PID,
} from "./Requester_types";

//~ ----------------------------- Function import -------------------------------
import { Find_servers, Find_and_compromise, Get_RAM} from './FindAllRAM';


//& -----------------------------------------------------------------------------
//&                      Test functions to test functions
//& -----------------------------------------------------------------------------
let Test = {
  //^ ------------------------------ Write To Port --------------------------------
  Write_to_port: function (i: number) {
    let data: RAMRequest | null = null;
    switch (i) {
      case 1:
        let s: ScriptRequest;
        data = {
          Script: {
            ScriptName: ["test.js", "home"],
            RAM: { Threads: 1, ThreadSize: 1.6, Server: ["home"] },
            Timing: "instant",
            args: [],
          },
        };
        break;
      case 2:
        let r: ProcessRequest;
        data = {
          Process: {
            Requester: 69,
            RAM: { Threads: 5, ThreadSize: 2.6, Server: ["home"] },
            Timing: [56],
          },
        };
        break;
      case 3:
        let f: FreeRequest;
        data = {
          Free: { 31: [{ Server: "home", RAM: 8, Timing: "infinite" }] },
        };
        break;
      case 4:
        let re: ReScanRequest;
        data = { Re_Scan: true };
        break;
    }
    _ns.writePort(2, JSON.stringify(data));
  },

  //^ --------------------------- Next Test Function ------------------------------
};

//& -----------------------------------------------------------------------------
//&                                    MAIN
//& -----------------------------------------------------------------------------
var _ns: NS;
var RAM_state; //!
export async function main(ns: NS): Promise<void> {
  _ns = ns;

  //^ ----------------------------- Initialization --------------------------------
  // finds all available ram (& nuke some servers if they can be nuked)
  let all_RAM = Find_all_RAM();
  //! ns.tprint(all_RAM);

  ns.clearPort(2);
  // 1: script, 2: process, 3: free, 4: re-scan
  Test.Write_to_port(1);

  //& -------------------------------- Main loop ----------------------------------
  RAM_state = {}; //!
  let scripts: any = []; //!
  //while (true){
  //^ ------------------------ Read request from port 2 ---------------------------
  let port_data: string = String(ns.readPort(2));
  ns.tprint("port_data: ", port_data); //! print
  if (port_data != "NULL PORT DATA") {
    // Identify request type
    let request: RAMRequest = JSON.parse(port_data);

    // TODO finish each types of request
    //* --------------------------------- Script ------------------------------------
    if (request.Script) {
      ns.tprint("request.script: ", request.Script); //! print
      Fit_script_in_RAM(request.Script);
    }

    //* --------------------------------- Process -----------------------------------
    else if (request.Process) {
      ns.tprint("request.process: ", request.Process); //! print
      Fit_process_in_RAM(request.Process);
    }

    //* ---------------------------------- Free -------------------------------------
    else if (request.Free) {
      ns.tprint("request.free: ", request.Free); //! print
      RAM_state = Free(request.Free);
    }

    //* --------------------------------- Re_Scan -----------------------------------
    else if (request.Re_Scan) {
      all_RAM = Find_all_RAM();
      ns.tprint("request.re_scan: ", request.Re_Scan); //! print
    }
  }

  //^ ------------------------- Manage running scripts ----------------------------
  // manage running scripts and free their RAm when they stop
  // TODO
  let stopped = Check_stopped_scripts(scripts);
  for (let script of stopped) {
    Free_script(script);
  }

  await ns.sleep(1000);
  //}
}


//& -----------------------------------------------------------------------------
//&                             RAM manager object                               
//& -----------------------------------------------------------------------------
//* Initializing Types ----------------------------------------------------------
type Available_RAM = { 
  [Time: number]: {
    [server: string]: number 
  }
};

type Server_Threads = {
  [nb_free_threads: number]: string[]
}


/** Properties start with lowercase, properties containing methods start with "_" and end with "_", methods start with uppercase */
let RAM_Manager = {
  //^ Properties ------------------------------------------------------------------
  // Object properties used by methods
  server_list: [] as string[],
  all_RAM: {} as AllRAM,
  state_of_RAM: {} as RAMState,

  //^ Find Functions --------------------------------------------------------------
  // Functions used to find some sort of data (about the game, the current state of RAM, ...)
  _find_: {
    //* Find All RAM ----------------------------------------------------------------
    /** Find all available ram (nuke some servers if they can be nuked) and update RAM_Manager.all_RAM  */
    All_RAM: function() {
	    // get all available server
	    let all_servers = Find_servers(_ns); // returns an array of all the servers
	    // get all admin/nuke all Nuke-able
	    RAM_Manager.server_list = Find_and_compromise(_ns, all_servers); // returns an array of all the admin servers
	    // get the RAM of all admin servers
	    RAM_Manager.all_RAM = Get_RAM(_ns, RAM_Manager.server_list); // returns the RAM of all the admin servers as AllRAM
    },

    //* Find available RAM ----------------------------------------------------------
    /** Find all available RAM for all time slots */
    Available: function (): Available_RAM {
      let all_RAM: AllRAM = RAM_Manager.all_RAM
      let state_of_RAM: RAMState = RAM_Manager.state_of_RAM
      let available_RAM: Available_RAM = {}

      for (let time in state_of_RAM)
        for (let server in state_of_RAM[time]) {
          let free = all_RAM[server]
          for (let PID in state_of_RAM[time][server]) {
            let used: number = 0
            used += state_of_RAM[time][server][PID].Script ?? 0;
            used += state_of_RAM[time][server][PID].Process ?? 0;
            free -= used
          }
          available_RAM[time][server] = free
        }

      return available_RAM;
    },
  },
  

  //^ Fit functions ---------------------------------------------------------------
  // Functions used to fit request in RAM (fit here means "finding an appropriate place")
  _fit_: {
    //* General ---------------------------------------------------------------------
    // General functions used to fit request in RAM
    General: {
      //~ Fit -------------------------------------------------------------------------
      // Find space to fit a request into the available RAM
      Fit: function (request: RAMRequest) {
        let request_threads = request?.Script?.RAM.Threads ?? request?.Process?.RAM.Threads ?? 0
        let request_thread_size = request?.Script?.RAM.ThreadSize ?? request?.Process?.RAM.ThreadSize ?? 0

        let available_RAM: Available_RAM = RAM_Manager._find_.Available()
        let server_threads: Server_Threads = {}

        // TODO this is a temp measure, to be replaced by the actual way it needs to be done
        if (request_threads != 'MAX') {

        // Create an object where we keep the minimum amount of threads a server can hold at the time (in the request) where the RAM is the smallest 
        // This is donne because we want to keep a request on the same server for the entire time it runs, thus only needing to know the amount at the lowest points
        for (let server of RAM_Manager.server_list) {
          let min_threads = Infinity
          for (let time in available_RAM) {
            let threads = available_RAM[time][server] / request_thread_size
            min_threads = threads < min_threads ? (threads < request_threads ? threads : request_threads) : min_threads
          }
          server_threads[min_threads].push(server)
        }
        

        // in server_threads, if server_threads.all is not empty
          // chose the best server
            // < remaining RAM
        // else, get combinations of servers to get to requested RAM
          // we want to have the biggest continuous thread blocks, so start with bigger possible threads
          // then biggest threads with <= remaining threads, until we reach 0 (if no <=, we can use > remaining threads)
        // if no solution found, error/not able to fullfil request

        }
      },

      //~ Add to RAM state ------------------------------------------------------------
      // Add approved request to the approved server(s), time(s), RAM
      Add_to_RAM_state: function (
        Time: number,
        Server: string,
        PID: PID,
        Type: "Script" | "Process" | "Reserved",
        value: number,
        array: [Reserved: number, Priority: number]
      ) {
        let state_of_RAM: RAMState = RAM_Manager.state_of_RAM


        if (Type == "Script" || Type == "Process") {
          let value2 = state_of_RAM[Time][Server][PID][Type];
          if (value2 !== undefined) {
            state_of_RAM[Time][Server][PID][Type] = value + value2;
          }
        }
      },
    }

    //^ ---------------------------- Fit Script In RAM ------------------------------
    //!
    Fit_script_in_RAM: function (request: ScriptRequest) {
      // start simple, find available RAM with t = 0
      Find_available();
    },

    //^ --------------------------- Fit Process In RAM ------------------------------
    Fit_process_in_RAM: function (request: ProcessRequest) {},

    //^ ---------------------------------- Free -------------------------------------
    // !!!
    Free: function (request: FreeRequest) {},
  };
}
//& -----------------------------------------------------------------------------
//&                      Manage Running Scripts Functions
//& -----------------------------------------------------------------------------
//^ -------------------------- Check Stopped Scripts ----------------------------
function Check_stopped_scripts(script: PID): number[] {
  return [1, 2, 3, 4, 5, 6, 7, 8];
}

//^ ------------------------------- Free Script ---------------------------------
function Free_script(script: PID): void {}





function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}