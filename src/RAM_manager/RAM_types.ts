export async function main(ns: NS): Promise<void> {}
// allocated_RAM is type ?

/*
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
*/

/* -------------------------------------------------------------------------- */
/*                      Declaring types for the requests                      */
/* -------------------------------------------------------------------------- */

/* --------------------------- Usefull small types -------------------------- */



/* ------------------------------ Useless types ----------------------------- */
// using | null to force the preview to show the custom names instead of the types
// none of these are required/they don't do anything
// ? change null to undefined? what's the difference?
type StartTime = number | null;
type EndTime = number | null;
type Name = string | null;
type Server = string | null;
type PID = number;


/* ------------------------------- Script type ------------------------------ */
/** This is the request sent to tell the manager to open a specified script */
// TODO fix script args
type ScriptRequest = {
    script_name: [Name, Server];
    RAM: {
        threads: number,
        thread_size: number,
        server: string[],
    };
    timing: "infinite" | "instant" | [StartTime, EndTime];
    args: []
}


/* ------------------------------ Process type ------------------------------ */
/** This is the request send by scripts for more RAM to run more scripts */
type ProcessRequest = {
    requester: PID
    RAM: {
        threads: number,
        thread_size: number,
        server: string[],
    }
    timing: "infinite" | "instant" | [StartTime, EndTime],
} 


/* -------------------------------- Free type ------------------------------- */
/** This is the request send by scripts to free RAM they requested using Process */
// TODO timing need to be changed to work properly
type FreeRequest = {
    [key: PID]: {
        server: string,
        RAM: number,
        timing: "infinite" | "instant" | [StartTime, EndTime],
    }[];
}


/* ------------------------------ Re_Scan type ------------------------------ */
/** This is the request when a manager wants to re-scan all servers */
type ReScanRequest = boolean;


/* ---------------------------- RAM Request type ---------------------------- */
/** This is the request sent in port 2, only one key should exist for a request */
interface RAMRequest{
    Script?: ScriptRequest;
    Process?: ProcessRequest;
    Free?: FreeRequest;
    Re_Scan?: ReScanRequest;
};


























/* -------------------------------------------------------------------------- */
// bellow is just testing the types and interfaces to make sure they work as I planned

let script: ScriptRequest = {
    script_name: ["script.js", "home"],
    RAM: {
        threads: 1,
        thread_size: 1.6,
        server: ["home", ]
    },
    timing: "instant",
    args: [] // args doesnt work
}

declare let process: ProcessRequest;

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