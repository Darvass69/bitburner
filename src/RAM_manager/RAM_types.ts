// allocated_RAM is type ?

type RAM = number | null;

// internal object used to regulate allocated RAM and keep track of things
//? add something for instant time?
type RAMState = {
    [Time: number]: {
        [Server: string]: {
            [PID: number]: {
                Script?: number;
                Process?: number;
                Reserved?: [Reserved: number, Priority: number]
            }
        }
    }
}

// for port 1, same as RAM state but primary key is the PID of scripts
// TODO test time integration in the type
type PortRAM = {
    [PID: number]:{
        Script: [Server: string, RAM: number];
        Process?: {
            [Time: number]: [Server: string, RAM: number][]
        };
        Reserved?: [Server: string, RAM: number, Priority: number][];
    }
}


/* 
TODO
let portRAM: PortRAM = {
    41: {

    },
}

*/
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// below is just testing the types and interfaces to make sure they work as planned
// example of allocated RAM
let allocatedRAM: RAMState = {
    5656: {
        home: {
            41:{
                Script: 8,
                Reserved: [8, 1]
            },
            55: {
                Script: 8,
                Process: 3,
            },
            66: {
                Script: 1.6
            },
            67: {
                Script: 1.6
            },
            68: {
                Script: 1.6
            },
            69: {
                Script: 1.6
            },
        },
        n00dles: {
            41:{
                Reserved: [4, 1]
            },
        },
        joesguns: {
            41:{
                Reserved: [8, 1]
            },
        }
    },
    6555: {
        home: {
            41:{
                Script: 8,
                Reserved: [8, 1]
            },
            68: {
                Script: 1.6
            },
            69: {
                Script: 1.6
            },
        },
        n00dles: {
            41:{
                Reserved: [4, 1]
            },
        },
        joesguns: {
            41:{
                Reserved: [8, 1]
            },
        }
    }
}


/*
// add something for instant time?
allocated_RAM = {
    [time1]: {
        [server1]: {
            [PID1]: {
                "script": 1.6,
                "process": 1.6,
                "reserved": {amount: 1.6, priority: 1},
            },
            [PID2]: {
                "script": 1,
                "process": 1,
                "reserved": {amount: 1, priority: 1},
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

