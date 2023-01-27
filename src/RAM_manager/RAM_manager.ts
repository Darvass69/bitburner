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
//^ Initializing Types ----------------------------------------------------------
type Available_RAM = { 
  [Time: number]: {
    [server: string]: number 
  }
};

type Server_Threads = {
  [nb_free_threads: number]: [server: string, remaining: number][]
}

type TimeInterval = [start_time: number, end_time: number, ...time_stamps: number[]]

// TODO improve description of properties, methods, etc

// TODO test RAM_Manager._find_.All_RAM()
// TODO test RAM_Manager._find_.Available_RAM()
// TODO test RAM_Manager._time_.Sorted_times_in_state()
// TODO finish RAM_Manager._time_.Times_in_interval(...)
// TODO finish RAM_Manager._fit_._general_.Fit(...)
// TODO finish RAM_Manager._fit_._general_.Add_to_RAM_state(...)
// TODO make RAM_Manager._fit_.Fit_script_in_RAM(...)
// TODO make RAM_Manager._fit_.Fit_process_in_RAM(...)
// TODO make RAM_Manager.Free()
// TODO 





/** Properties start with lowercase, properties containing methods or properties start with "_" and end with "_", methods start with uppercase */
let RAM_Manager = {
  //~ Properties ------------------------------------------------------------------
  // Object properties used by methods
  server_list: [] as string[],
  all_RAM: {} as AllRAM,
  state_of_RAM: {} as RAMState,

  //^ Find Functions --------------------------------------------------------------
  /** Functions used to find some sort of data (about the game, the current state of RAM, ...) */
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
    Available_RAM: function (): Available_RAM {
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
  /** Functions used to fit request in RAM (here, fit means "finding an appropriate place") */
  _fit_: {
    //^ General ---------------------------------------------------------------------
    /** General functions used to fit requests in RAM */
    _general_: {
      //* Fit -------------------------------------------------------------------------
      // Find space to fit a request into the available RAM
      Fit: function (request: RAMRequest) {
        let requests: ScriptRequest | ProcessRequest
        let request_threads = request?.Script?.RAM.Threads ?? request?.Process?.RAM.Threads ?? 0
        let request_thread_size = request?.Script?.RAM.ThreadSize ?? request?.Process?.RAM.ThreadSize ?? 0

        let available_RAM: Available_RAM = RAM_Manager._find_.Available_RAM()
        let server_threads: Server_Threads = {}

        // TODO this is a temp measure, to be replaced by the actual way it needs to be done
        if (request_threads != 'MAX') {

        // Create an object where we keep the minimum amount of threads a server can hold at the time (in the request) where the RAM is the smallest 
        // This is donne because we want to keep a request on the same server for the entire time it runs, 
        // thus only needing to know the amount at the lowest points
        // The numbers of threads is capped at the requested number of threads

        // The remaining amount of RAM is, on a graph (time, remaining RAM), area under the graph = for each block, sum of rectangles [time * remaining RAM] / time interval

        for (let server of RAM_Manager.server_list) {
          let min_threads = Infinity
          let remaining_RAM_average = 0


          for (let i:number = 0; i < times.length ; i++) { //! need to start at the start time requested and end at the end time requested
            let threads = Math.floor(available_RAM[times[i]][server] / request_thread_size)
            min_threads = threads < min_threads ? (threads < request_threads ? threads : request_threads) : min_threads
          }
          server_threads[min_threads].push([server, remaining_RAM_average])
        }
        

        // This is where we do the actual decision
        // We want the biggest possible continuous block(s) of RAM. 
        // We want to limit wasted RAM by taking the blocks that leave the less remaining amount of RAM in the server(s)

        // TODO remaining RAM, sort by nb of threads, 

        if (server_threads[request_threads]) {
          // chose the best server (< average remaining RAM)


        }
        else {
          // find a combination of servers that can fit the whole request
          // start with biggest possible threads (because we want to maximize multi-threading)
          // then biggest threads with <= remaining threads, until we reach 0 (if no more <=, we can use > remaining threads)



          if (no_solution) {
            // if no solution found, error/not able to fullfil request
          }
        }
        
        

        }
      },

      //* Add to RAM state ------------------------------------------------------------
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


    //! -----------------------------------------------------------------------------
    /*
    Fit_script_in_RAM: function (request: ScriptRequest) {
      // start simple, find available RAM with t = 0
      Find_available();
    },
    Fit_process_in_RAM: function (request: ProcessRequest) {},
    Free: function (request: FreeRequest) {},
    */
    //! -----------------------------------------------------------------------------

  },

  //^ Time ------------------------------------------------------------------------
  /** functions and property used to read and manipulate times in state_of_RAM */
  _time_: {
    //~ Sorted Times ----------------------------------------------------------------
    sorted_times: [] as number[],

    //* Sort Times ------------------------------------------------------------------
    /** This function updates RAM-Manager._time_.sorted_times with a sorted (ascending) list of every time stamps in state RAM */
    Sorted_times_in_state: function (): number[] {
      return Object.keys(RAM_Manager.state_of_RAM).map(Number).sort((a, b) => a - b)
    },

    //* Time Blocks In Interval -----------------------------------------------------
    /** 
     * Returns a list of every time stamps that include a time interval.
     * 
     * The first element is the start time and the second element is the end time, the rest is all timestamps.
     * 
     * @param update? - set to true to update sorted_times to have up to date times */
    Times_in_interval: function (timing: "instant" | "infinite" | [StartTime: number, EndTime?: number], update?: boolean): TimeInterval{
      if (update) RAM_Manager._time_.Sorted_times_in_state()
      // for instant,
        // because the game updates each ~4ms, we are going to have the starting and ending times be ~32ms later than instant.
        // ex: if current time is 100, start time is 132, end time is 164. This helps prevent collision if the current time is close to a change in RAM
      // for infinite,
        // start time = current time (performance.now), end time = infinity 
      let start_time: number;
      let end_time: number;

      if (timing == "instant"){
        start_time = performance.now() + 32
        end_time = start_time + 32
      }
      else if (timing == "infinite"){
        start_time = performance.now()
        end_time = Infinity
      }
      else {
        start_time = timing[0]
        end_time = timing[1] ?? Infinity
      }

      // now, using start and end times, find all timestamps in between. 
      // (also include 1 more before and one more after to have the start and end times included, ex: start=110, end=506, [100,120,...,502,508])
      let time_interval: TimeInterval = [start_time, end_time]
      let interval_started: boolean = false
      let interval_ended: boolean = false

      for (let time of time_interval){
        // if start time < time < end time --> add to list
        if (start_time < time && time < end_time){
          time_interval.push(time)
          interval_started = true
        }
        // we add the current time at time_interval[2] so that once we start the interval, we have start time included
        else if (!interval_started) time_interval[2] = time
        // after we add the last element, we add time one more time to include end time
        else if(!interval_ended) {
          time_interval.push(time)
          interval_ended = true
        }
      }
      return time_interval
    }
  
}
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




