// request are interfaces
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

// using | null to force the preview to show the custom names instead of the types
type StartTime = number | null;
type EndTime = number | null;
type Name = string | null;
type Server = string | null;
type PID = number;
type RequestType = "Script" | "Process" | "Free" | "Re_Scan"


/** This is the request sent to tell the manager to open a specified script */
type Script = {
    script_name: [Name, Server];
    RAM: {
        threads: number,
        thread_size: number,
        server: string[],
    };
    timing: "infinite" | "instant" | [StartTime, EndTime];
    args: []
}


/** This is the request send by scripts for more RAM to run more scripts */
type Process = {
    requester: PID
    RAM: {
        threads: number,
        thread_size: number,
        server: string[],
    }
    timing: "infinite" | "instant" | [StartTime, EndTime],
} 


/** This is the request send by scripts to free RAM they requested using Process */
// timing need to be changed to work properly
type Free = {
    [key: PID]: {
        server: string,
        RAM: number,
        timing: "infinite" | "instant" | [StartTime, EndTime],
    }[];
}

// type Re_Scan = number;


/** This is the request sent in port 2 */
interface RAM_request{
    [key: RequestType]: Script | Process | Free //| Re_Scan;
}


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


let free: Free = {
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