/** @param {NS} ns */
// not functionnal
// was trying to do a proto-batcher based on the official documentation
// the doccumentation didn't describe a proto-batcher, but more like a hack manager
// I will come back to this someday


import {Growth_percent, Hack_percent, Hack_time} from "formulas.js";

var terminal_logs = true;

// scripts locations
let weaken_script = "weaken.js";
let weaken_RAM = 1.75;
let weaken_mult = 1; // if there is something that increase the effect of weaken
let grow_script = "grow.js";
let grow_RAM = 1.75;
let hack_script = "hack.js";
let hack_RAM = 1.7;
// copy scripts to servers: already done manually or through another manager/helper

var _ns;
export async function main(ns) {
	_ns = ns;
	// server
	let server = ns.args[0];
    // right now we are manually setting free RAM, this is going to be done by a script (RAM_manager.js) and returned by port?, args?, idk yet
    let allocated_RAM = [{server_name: "myServer-1" , allocated_RAM: 4096}, {server_name: "myServer-2" , allocated_RAM: 4096}];
	await Proto_batching(server, allocated_RAM);

}

// prepare a server
function Prepare(target) {
	// run grow and weaken until money is at max and security at min
    // server
	let min_security = _ns.getServerMinSecurityLevel(target);
    let max_money = _ns.getServerMaxMoney(target);

    // add max server threads for grow/weaken to allocated_RAM
    // allocated_RAM = [["server name", allocated_RAM, hack_thread, grow_thread], ...]
    allocated_RAM.map(function (server_RAM) {
        server_RAM.grow_threads = Math.floor(server_RAM.allocated_RAM/grow_RAM);
        return server_RAM;});
    //_ns.tprint(allocated_RAM);

    // main loop
    let i = 0;
    while (i == 0){
        // player
        let player = _ns.getPlayer();

        // server
        var server = _ns.getServer(target);

        // grow threads
        // calculate the max number of grow threads wich will dictate other parameters
        let grow_threads = 0;
        allocated_RAM.forEach(server_RAM => grow_threads += server_RAM.grow_threads);
        // weaken threads
        let weaken_threads = Math.ceil((hack_security + grow_security) / 0.05)

        if (_ns.getServerSecurityLevel(target) != min_security){
            // weaken
            threads = 0;
            let weaken_time = Hack_time(server, player) * 4;
            for (let server_RAM of allocated_RAM){
                threads = Math.min(server_RAM.grow_threads, weaken_threads);
                if (threads){
                    weaken_threads -= threads;
                    _ns.exec(weaken_script, server_RAM.server_name, threads, target);
                    _ns.tprint(`weakening ${target} with ${threads} threads on ${server_RAM.server_name}`);
                }
            }
            await _ns.sleep(weaken_time * 100);
        }
        else if (_ns.getServerMoneyAvailable(target) < max_money){
            threads = 0;
            let grow_time = Hack_time(server, player) * 3.2;
            for (let server_RAM of allocated_RAM){
                threads = Math.min(server_RAM.grow_threads, grow_threads);
                if (threads){
                    grow_threads -= threads;
                    _ns.exec(grow_script, server_RAM.server_name, threads, target);
                    _ns.tprint(`growing ${target} with ${threads} threads on ${server_RAM.server_name}`);
                }
            }
            await _ns.sleep(grow_time * 100);
            let current_money = _ns.getServerMoneyAvailable(target);
            // verify results
            _ns.tprint(`current money: ${current_money} max: ${max_money} at max?: ${max_money == _ns.getServerMoneyAvailable(target)}%`);
        }
        else {
            return;
        }


        

        //_ns.tprint("H:", hack_threads, " W1:", weaken_hack_threads, " G:", grow_threads, " W2:", weaken_grow_threads);
        _ns.tprint(`target: ${target} G: ${grow_threads} W: ${weaken_threads}`);



    

        // weaken
        threads = 0;
        let weaken_time = Hack_time(server, player) * 4;
        for (let server_RAM of allocated_RAM){
            threads = Math.min(server_RAM.grow_threads, weaken_threads);
            if (threads){
                weaken_threads -= threads;
                _ns.exec(weaken_script, server_RAM.server_name, threads, target);
                _ns.tprint(`weakening ${target} with ${threads} threads on ${server_RAM.server_name}`);
            }
        }
        await _ns.sleep(weaken_time * 100);
        i++;
    }





    
    return;
}


// the idea of the proto batcher ist ot do HGW, but "slowly". each (H,G,W) is run as a batch, one after the other.
// (initial idea was HWGW, but its not necessary bc W1 was like 2 threads)
// maybe add smt to calculate grow % with the increase security by hack
async function Proto_batching(target, allocated_RAM) {
    //initiallise vars


    

    // while(true)
        // calculate threads
            // calculate max grow threads
            let grow_threads = Max_grow_threads(allocated_RAM)

// calculate the max number of grow threads that can fit in the allocated RAM
function Max_grow_threads(allocated_RAM){
    let grow_threads = 0;
    allocated_RAM.forEach(server_RAM => grow_threads += server_RAM.grow_threads);
    return grow_threads;
}

            // calculate grow%                                                          //(set server security to 1 so we can scale it later?)
            let grow_percent = Growth_percent(server, player, grow_threads);
            // calculate hack% to get hack threads

            // calculate weaken threads

        // hack

        // grow

        // weaken















    // server
	let min_security = _ns.getServerMinSecurityLevel(target);
    let max_money = _ns.getServerMaxMoney(target);

    // add max server threads for hack & grow/weaken to allocated_RAM
    allocated_RAM.map(function (server_RAM) {
        server_RAM.hack_threads = Math.floor(server_RAM.allocated_RAM/hack_RAM);
        server_RAM.grow_threads = Math.floor(server_RAM.allocated_RAM/grow_RAM);
        return server_RAM;});
    //_ns.tprint(allocated_RAM);






    // main loop
    let i = 0;
    while (i == 0){
        // player
        let player = _ns.getPlayer();

        // server
        var server = _ns.getServer(target);

        //  check at the start if its still max money & min security (if not, prepare server) , repeat HWGW,



        /* grow */
        // calculate the max number of grow threads wich will dictate other parameters
        let grow_threads = 0;
        allocated_RAM.forEach(server_RAM => grow_threads += server_RAM.grow_threads);
        // calculate grow %
        let grow_percent = Growth_percent(server, player, grow_threads);

        /* weak 2 */
        // calculate W2 threads (weaken after grow). + 0.04 security/thread
        let grow_security = 0.004 * grow_threads;
        //let weaken_grow_threads = Math.ceil(grow_security / 0.05)

        /* hack */
        // this means we have to hack until we can grow back in one go

        // we have: 
            // max: maximum money the server can hold
            // min: money the server holds after hack (before grow)
        // max = min + min * grow% --> max = min * (1 + grow%) --> min = max / (1 + grow%)
        // min = max - max * hack% --> min - max = - max * hack% --> (min - max)/ - max = hack%
        // hack% = (min - max)/ - max --> (max / (1 + grow%) - max)/ - max
        let target_hack_percent = (max_money / (1 + grow_percent) - max_money) / (-1 * max_money);
        let hack_percent = Hack_percent(server, player);
        let hack_threads = Math.floor(target_hack_percent / hack_percent);
        let total_hack = hack_percent * hack_threads;

        /* weak 1 */
        // calculate W2 threads (weaken after grow). + 0.04 security/thread
        let hack_security = 0.002 * hack_threads;
        //let weaken_hack_threads = Math.ceil(hack_security / 0.05);
        let weaken_threads = Math.ceil((hack_security + grow_security) / 0.05)

        //_ns.tprint("H:", hack_threads, " W1:", weaken_hack_threads, " G:", grow_threads, " W2:", weaken_grow_threads);
        _ns.tprint(`target: ${target} H: ${hack_threads} G: ${grow_threads} W: ${weaken_threads}`);



        /* start HGW */
        // hack: for each server, start hacks as long as there is theads available on the server and we haven't reached the total hack_thread
        // threads = min(server.hack_threads, total); total -= threads; 
        let threads = 0;
        let hack_time = Hack_time(server, player);
        for (let server_RAM of allocated_RAM){
            threads = Math.min(server_RAM.hack_threads, hack_threads);
            if (threads){
                hack_threads -= threads;
                _ns.exec(hack_script, server_RAM.server_name, threads, target);
                _ns.tprint(`hacking ${target} with ${threads} threads on ${server_RAM.server_name}`);
            }
        }
        await _ns.sleep(hack_time * 100);
        // verify results
        let current_money = _ns.getServerMoneyAvailable(target);
        let percent_hacked = (max_money - current_money) / max_money;
        _ns.tprint(`max money: ${max_money} current: ${current_money} %hacked theoric: ${total_hack /* 100*/}% %hacked experimental: ${percent_hacked * 100}%`);

        // grow
        threads = 0;
        let grow_time = Hack_time(server, player) * 3.2;
        for (let server_RAM of allocated_RAM){
            threads = Math.min(server_RAM.grow_threads, grow_threads);
            if (threads){
                grow_threads -= threads;
                _ns.exec(grow_script, server_RAM.server_name, threads, target);
                _ns.tprint(`growing ${target} with ${threads} threads on ${server_RAM.server_name}`);
            }
        }
        await _ns.sleep(grow_time * 100);
        // verify results
        _ns.tprint(`last money: ${current_money} max: ${max_money} %grow theoric: ${grow_percent /* 100*/}% at max?: ${max_money == _ns.getServerMoneyAvailable(target)}%`);

        // weaken
        threads = 0;
        let weaken_time = Hack_time(server, player) * 4;
        for (let server_RAM of allocated_RAM){
            threads = Math.min(server_RAM.grow_threads, weaken_threads);
            if (threads){
                weaken_threads -= threads;
                _ns.exec(weaken_script, server_RAM.server_name, threads, target);
                _ns.tprint(`weakening ${target} with ${threads} threads on ${server_RAM.server_name}`);
            }
        }
        await _ns.sleep(weaken_time * 100);
        i++;
    }
}





/*
Hacking managers (proto-batchers)
Difficulty: Medium to Hard

Pros:

RAM-efficient
No risk of overhacking
Manager doubles as a deployer, and easily takes advantage of fresh RAM
Easy to use once created
Cons:

Difficult to implement: requires good understanding of how in-game hacking works
Inconsistent RAM use: growing requires a lot, hacking much less, and weakening very little
Not as efficient without Formulas.exe
Hacking manager algorithms separate the scripts that control the hacks and the scripts that do the actual hacking. By putting all calculations into a master script 
it’s possible to slim down the hacking scripts, as well as to launch exactly as many as needed for the server at the moment, optimizing RAM use.

Unlike the previous methods, which rely on a hack script that runs forever in a loop, manager’s hack scripts simply launch their process once:

hack(target) // or grow, or weaken
The code for the manager, however, is more complex.

loop forever {
    if security is not minimum {
        determine how many threads we need to lower security to the minimum
        find available ram for those threads
        copy the weaken script to the server(s) with RAM
        launch the weaken script(s)
        sleep until weaken is finished
    } else if money is not maximum {
        do the same thing, but with the grow script
    } else {
        do the same thing, but with the hack script
    }
}
The idea here it to use methods like hackAnalyze and growthAnalyze or methods from formulas to avoid using more threads (and thus, RAM) than necessary, and to not 
overhack the server.

In order to find available RAM, the manager needs to be able to scan the network to find all servers with RAM and root access. After that is done, the manager copies 
hacking scripts over and launches them at the target, and waits until they are finished; this can be done by utilizing formulas to find out the time required, or by 
saving PIDs of the scripts launched, and checking if they’re still running periodically.

Only one manager should be launched per target, but multiple managers can be used to target multiple servers.


*/