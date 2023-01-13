
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
// TODO fix script args
export type ScriptRequest = {
    script_name: [Name: string, Server: string];
    RAM: {
        threads: number,
        thread_size: number,
        server: string[],
    };
    timing: "infinite" | "instant" | [StartTime: number, EndTime: number];
    args: []
}


//^ --------------------------------- Process -----------------------------------
/** This is the request send by scripts for more RAM to run more scripts */
export type ProcessRequest = {
    requester: PID
    RAM: {
        threads: number,
        thread_size: number,
        server: string[],
    }
    timing: "infinite" | "instant" | [StartTime: number, EndTime: number],
} 


//^ ---------------------------------- Free -------------------------------------
/** This is the request send by scripts to free RAM they requested using Process */
// TODO timing need to be changed to work properly
export type FreeRequest = {
    [PID: number]: {
        server: string,
        RAM: number,
        timing: "infinite" | "instant" | [StartTime: number, EndTime: number],
    }[];
}


//^ --------------------------------- Re_scan -----------------------------------
/** This is the request when a manager wants to re-scan all servers */
export type ReScanRequest = boolean;


//^ ---------------------------- RAM Request Type -------------------------------
/** This is the request sent in port 2, only one key should exist for a request */
export interface RAMRequest{
    Script?: ScriptRequest;
    Process?: ProcessRequest;
    Free?: FreeRequest;
    Re_Scan?: ReScanRequest;
};


























/* -------------------------------------------------------------------------- */
// below is just testing the types and interfaces to make sure they work as planned
export async function main(ns: NS): Promise<void> {

let script: ScriptRequest = {
    script_name: ["script.js", "home"],
    RAM: {
        threads: 1,
        thread_size: 1.6,
        server: ["home", ]
    },
    timing: "instant",
    args: [] // args doesn't work
}

let process: ProcessRequest = JSON.parse(String(ns.args[0]));

let RAM_request: RAMRequest = {Script: script}
RAM_request = {Process: process}


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
            server: "server",
            RAM: 1,
            timing: "infinite",
        },
        {
            server: "home",
            RAM: 5,
            timing: "instant",
        },
    ]
}

}