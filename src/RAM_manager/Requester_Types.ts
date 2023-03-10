//& -----------------------------------------------------------------------------
//&                      Declaring Types For The Requests
//& -----------------------------------------------------------------------------

//^ ------------------------------ Useless Types --------------------------------
//~ using | null to force the preview to show the custom names instead of the types
//~ none of these are required/they don't do anything
//~ change null to undefined? what's the difference?
// export type StartTime = number | null;
// export type EndTime = number | null;
// export type Name = string | null;
// export type Server = string | null;
export type PID = number;

//^ --------------------------------- Script -----------------------------------
/** This is the request sent to tell the manager to open a specified script */
// TODO fix script args, maybe any[]?
export type ScriptRequest = {
  ScriptName: [Name: string, Server: string];
  RAM: {
    Threads: number;
    ThreadSize: number;
    Server: string[];
  };
  Timing: "infinite" | "instant" | [StartTime: number, EndTime?: number];
  args: any;
};

//^ --------------------------------- Process -----------------------------------
/** This is the request send by scripts for more RAM to run more scripts */
export type ProcessRequest = {
  Requester: PID;
  RAM: {
    Threads: number | "MAX";
    ThreadSize: number;
    Server: string[];
  };
  Timing: "infinite" | "instant" | [StartTime: number, EndTime?: number]; // StartTime can be 0
};

//^ ---------------------------------- Free -------------------------------------
/** This is the request send by scripts to free RAM they requested using Process */
// TODO timing need to be changed to work properly
export type FreeRequest = {
  [PID: number]: {
    Server: string;
    RAM: number;
    Timing: "infinite" | "instant" | [StartTime: number, EndTime?: number]; // StartTime can be 0
  }[];
};

//^ --------------------------------- Re_scan -----------------------------------
/** This is the request when a manager wants to re-scan all servers */
export type ReScanRequest = boolean;

//^ ---------------------------- RAM Request Type -------------------------------
/** This is the request sent in port 2, only one key should exist for a request */
export interface RAMRequest {
  Script?: ScriptRequest;
  Process?: ProcessRequest;
  Free?: FreeRequest;
  Re_Scan?: ReScanRequest;
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// below is just testing the types and interfaces to make sure they work as planned
// this is temporary
import { NS, PortData } from "@ns";
export async function main(ns: NS): Promise<void> {
  let script: ScriptRequest = {
    ScriptName: ["script.js", "home"],
    RAM: {
      Threads: 1,
      ThreadSize: 1.6,
      Server: ["home"],
    },
    Timing: "instant",
    args: [], // args doesn't work
  };

  let process: ProcessRequest = JSON.parse(String(ns.args[0]));

  let RAM_request: RAMRequest = { Script: script };
  RAM_request = { Process: process };

  /*
RAM_request = {
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
*/

  let free: FreeRequest = {
    36: [
      {
        Server: "server",
        RAM: 1,
        Timing: "infinite",
      },
      {
        Server: "home",
        RAM: 5,
        Timing: "instant",
      },
    ],
  };
}
