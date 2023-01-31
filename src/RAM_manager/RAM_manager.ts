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

					

  re-scan requests happens any times a script purchase/upgrade a server or nuke one

*/

//& -----------------------------------------------------------------------------
//&                                   Imports
//& -----------------------------------------------------------------------------
import { NS } from "@ns";

//~ ------------------------ Type And Interface Import --------------------------
import type { AllRAM } from "./Find_All_RAM";
import type {
  ScriptRequest,
  ProcessRequest,
  FreeRequest,
  ReScanRequest,
  RAMRequest,
  PID,
} from "./Requester_types";
import type { RAMState } from './RAM_types';

//~ ----------------------------- Function import -------------------------------
import { Find_servers, Find_and_compromise, Get_RAM} from './Find_All_RAM';



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
  //*let all_RAM = Find_all_RAM();
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
      //*Fit_script_in_RAM(request.Script);
    }

    //* --------------------------------- Process -----------------------------------
    else if (request.Process) {
      ns.tprint("request.process: ", request.Process); //! print
      //*Fit_process_in_RAM(request.Process);
    }

    //* ---------------------------------- Free -------------------------------------
    else if (request.Free) {
      ns.tprint("request.free: ", request.Free); //! print
      //*RAM_state = Free(request.Free);
    }

    //* --------------------------------- Re_Scan -----------------------------------
    else if (request.Re_Scan) {
      //*all_RAM = Find_all_RAM();
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
export type AvailableRAM = { 
  [Time: number]: {
    [server: string]: number 
  }
};

export type ServerThreads = {
  //[nb_free_threads: number]: [server: string, remaining: number][]
  [nb_free_threads: number]: string[]
}

export type TimeInterval = [start_time: number, end_time: number, ...time_stamps: number[]]

export type Timing = "instant" | "infinite" | [StartTime: number, EndTime?: number]

// TODO improve description of properties, methods, etc

// TODO done RAM_Manager._time_.Timestamps_in_interval(...)
// TODO done RAM_Manager._time_.Sorted_times_in_state()

// TODO test RAM_Manager._find_.All_RAM() --> probably don't need to test this one
// TODO test RAM_Manager._find_.Available_RAM()

// TODO finish RAM_Manager._fit_._general_.Fit_any(...)
// TODO finish RAM_Manager._fit_._general_.Add_to_RAM_state(...)

// TODO make RAM_Manager._fit_.Fit_script_in_RAM(...)
// TODO make RAM_Manager._fit_.Fit_process_in_RAM(...)
// TODO make RAM_Manager.Free()
// TODO 

// TODO have a way for external script to see nuked server list



/** Properties start with lowercase, properties containing methods or properties start with "\_" and end with "\_", methods start with uppercase */
export let RAM_Manager = {
  //~ Properties ------------------------------------------------------------------
  // Object properties used by methods
  /** ns object, needed for some functions to work properly */
  ns: {} as NS,
  /** list of every nuked server */
  server_list: [] as string[],
  /** an object containing all nuked servers and their max RAM */
  all_RAM: {} as AllRAM,
  /**  */
  state_of_RAM: {} as RAMState,

  //^ Find Functions --------------------------------------------------------------
  /** Functions used to find some sort of data (about the game, the current state of RAM, ...) */
  _find_: {
    //* Find All RAM ----------------------------------------------------------------
    /** Find all available ram (nuke some servers if they can be nuked) and update RAM_Manager.all_RAM  */
    All_RAM: function() {
	    // get all available server
	    let all_servers = Find_servers(RAM_Manager.ns); // returns an array of all the servers
	    // get all admin/nuke all Nuke-able
	    RAM_Manager.server_list = Find_and_compromise(RAM_Manager.ns, all_servers); // returns an array of all the admin servers
	    // get the RAM of all admin servers
	    RAM_Manager.all_RAM = Get_RAM(RAM_Manager.ns, RAM_Manager.server_list); // returns the RAM of all the admin servers as AllRAM
    },

    //* Find available RAM ----------------------------------------------------------
    /** 
     * Returns how much free RAM is left for every server in every timestamps based on data in RAM_Manager.state_of_RAM.
    */
    Available_RAM: function (): AvailableRAM {
      let all_RAM: AllRAM = RAM_Manager.all_RAM
      let state_of_RAM: RAMState = RAM_Manager.state_of_RAM
      let available_RAM: AvailableRAM = {}

      for (let time in state_of_RAM)
        for (let server in all_RAM) {
          let free = all_RAM[server]
          for (let PID in state_of_RAM[time][server]) {
            let used: number = 0
            used += state_of_RAM[time][server][PID].Script ?? 0;
            used += state_of_RAM[time][server][PID].Process ?? 0;
            free -= used
          }
          if (!available_RAM[time]) available_RAM[time] = {}
          if (free != 0) available_RAM[time][server] = free
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
      //* Fit Any ---------------------------------------------------------------------
      /** !!! */
      // Find space to fit a request into the available RAM
      Fit_any: function (input_request: RAMRequest) {
        let request: ScriptRequest | ProcessRequest | undefined = input_request?.Script ??input_request?.Process
        if (!request) return 
        let request_threads = request.RAM.Threads
        let request_thread_size = request.RAM.ThreadSize

        let available_RAM: AvailableRAM = RAM_Manager._find_.Available_RAM()
        let server_threads: ServerThreads = {}

        // TODO this is a temp measure, to be replaced by the actual way max threads needs to be done
        if (request_threads != 'MAX') {

        let timestamps = RAM_Manager._time_.Timestamps_in_interval(request.Timing, true)

        // Create an object where we keep the lowest amount of threads every servers can hold for the requested time period.
          // This is donne because we want to keep a request on the same server for the entire time it runs, thus only needing to know the amount at the lowest points
          // The numbers of threads is capped at the requested number of threads
        for (let server of RAM_Manager.server_list) {
          let lowest_thread = Infinity
          for (let time of timestamps.slice(2)) {
            let threads = Math.floor(available_RAM[time][server] / request_thread_size)
            lowest_thread = threads < lowest_thread ? (threads < request_threads ? threads : request_threads) : lowest_thread
          }
          server_threads[lowest_thread] == undefined ? server_threads[lowest_thread] = [server] : server_threads[lowest_thread].push(server)
        }

        // This is where we do the actual decision
        // We want the biggest possible continuous block(s) of RAM. 
        // We want to limit wasted RAM by taking the blocks that leave the less remaining amount of RAM in the server(s)

        // TODO remaining RAM, sort by nb of threads, 

        if (server_threads[request_threads]) {
          let remaining = RAM_Manager._fit_._general_.Average_remaining_RAM(server_threads[request_threads], available_RAM, request.Timing)
          // chose the best server (< average remaining RAM)
          let server = server_threads[request_threads].reduce((a, b) => remaining[a] < remaining[b] ? a : b)
          return [server, request_threads, server_threads, remaining]
        }
        else {
          // find a combination of servers that can fit the whole request
          // start with biggest possible block of threads (because we want to maximize multi-threading)
          // then the block of threads the closest to the remaining numbers of threads. Repeat until we reach 0 remaining threads


          let no_solution = false
          if (no_solution) {
            // if no solution found, error/not able to fullfil request
          }
        }
        
        

        }
        return 0
      },

      /** 
       * Calculate the average remaining amount of RAM, for each servers in the server list.
       * 
       * It then returns an object containing the servers as key and the remaining RAM as value
      */
      Average_remaining_RAM: function (server_list: string[], available_RAM: AvailableRAM, timing: "instant" | "infinite" | [StartTime: number, EndTime?: number]): AllRAM {
        // We want the (over time) average of the remaining amount of RAM for each servers after we put in the required amount of threads
        // If we take f(t) as a function of remaining RAM over time, (here f(t) is available_RAM)
        // the average is 1/(end - start) * integral[a->b](f(t)dt)
        // = 1/(end - start) * (the sum of all (/\t * f(t)) )
        // in other words, for each time interval (/\t), multiply the interval by its remaining RAM (f(t)). 
          // add them together and divide by the length of the interval
        
        let [start_time, end_time, ...times] = RAM_Manager._time_.Timestamps_in_interval(timing)
        let remaining: AllRAM = {}
        
        server_list.forEach((server) => {
          let sum = 0;

          // for each time blocks
          for (let i = 0; times.length > i; i++){
            // sum += (end - start) * available_RAM[start]
            let start: number
            let end: number
            let timestamp_start: number

            // if we only have both start & end in the same timestamp: start = start_time, end = end_time, timestamp_start = times[0]
            if (times.length == 1) {
              start = start_time
              end = end_time
              timestamp_start = times[0]
            }
            // for the first one: start = start_time, end = times[i + 1], timestamp_start = times[0]
            else if (i == 0) {
              start = start_time
              end = times[i + 1]
              timestamp_start = times[0]
            }
            // for the last one: start = times[i], end = end_time, timestamp_start = times[i]
            else if (i == times.length - 1) {
              start = times[i]
              end = end_time
              timestamp_start = times[i]
            }
            // for all other: start = times[i], end = times[i + 1], timestamp_start = times[i]
            else {
              start = times[i]
              end = times[i + 1]
              timestamp_start = times[i]
            }
            sum += (end - start) * available_RAM[timestamp_start][server]
          
          }
          // sum /= (end_time - start_time)
          remaining[server] = sum / (end_time - start_time)
        })
        return remaining
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
    sorted_timestamps: [] as number[],

    //* Sort Times ------------------------------------------------------------------
    /** This function updates RAM-Manager.\_time\_.sorted_times with a sorted (ascending) list of every time stamps in state RAM */
    Sorted_timestamps_in_state: function () {
      RAM_Manager._time_.sorted_timestamps = [0]
      RAM_Manager._time_.sorted_timestamps.push(...Object.keys(RAM_Manager.state_of_RAM).map(Number).sort((a, b) => a - b))
    },

    //* Time Blocks In Interval -----------------------------------------------------
    /** 
     * Returns a list of every time stamps that are included in a time interval.
     * 
     * The first element is the start time and the second element is the end time, the rest is all timestamps that include times in the interval.
     * 
     * The timestamps are at the beginning of the time block they represent. 
     * 
     * @param update - set to true to update sorted_times to have up to date times */
    Timestamps_in_interval: function (timing: "instant" | "infinite" | [StartTime: number, EndTime?: number], update?: boolean, testing?: boolean, testing_time?: number): TimeInterval{
      let current_time = performance.now()
      //! manually setting this for testing, change this when  it's finalized
      if (testing && testing_time != undefined) current_time = testing_time
      //! remove this later
      else current_time = 0
      
      // for "instant",
        // because the game updates each ~4ms, we are going to have the starting and ending times be ~32ms later than instant.
        // ex: if current time is 100, start time is 132, end time is 164. This helps prevent collision if the current time is close to a change in RAM
      // for "infinite",
        // start time = current time (performance.now), end time = infinity 
      let start_time: number;
      let end_time: number;

      if (timing == "instant"){
        start_time = current_time + 32
        end_time = start_time + 32
      }
      else if (timing == "infinite"){
        start_time = current_time
        end_time = Infinity
      }
      else {
        start_time = timing[0]
        end_time = timing[1] ?? Infinity
      }

      // check if start & end times are valid values
      // start is before now, we don't like time travel
      if (start_time < current_time) start_time = current_time
      // start is before end
      if (start_time >= end_time) return [start_time, end_time]
      // are they real numbers
      if (Number.isNaN(start_time) || Number.isNaN(end_time)) return [start_time, end_time]

      // handle the update arg
      if (update) RAM_Manager._time_.Sorted_timestamps_in_state()

      // now, using start and end times, find all timestamps in between. 
      // (also include 1 more before and one more after to have the start and end times included, ex: start=110, end=506, [100,120,...,502,508])
      let time_interval: TimeInterval = [start_time, end_time]
      let interval_started: boolean = false
      let interval_ended: boolean = false

      for (let timestamp of RAM_Manager._time_.sorted_timestamps){
        // stop after the element is after the interval
        if (end_time < timestamp) break
        // if start time < time < end time --> add to list
        if (start_time < timestamp && timestamp < end_time){
          time_interval.push(timestamp)
          interval_started = true
        }
        // we add the current time at time_interval[2] so that once we start the interval, we have start time included
        if (!interval_started) time_interval[2] = timestamp
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




