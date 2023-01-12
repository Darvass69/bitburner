/** @param {NS} ns */

import * as Formulas from "formulas.js";


export function Test(){
	return {key: "value"}
}



var _ns;
export async function main(ns) {
	_ns = ns;
	ns.tprint("Starting test script here");


	/*
	let port = 1;
	ns.writePort(1, "hello");
	ns.tprint(ns.peek(port));
	//ns.tprint(ns.readPort(port));
	//ns.tprint(ns.readPort(port));
	*/

	/*
	while (true){
		var time = performance.now();
		await ns.tprint(time);
		await ns.sleep(1000);
	}
	*/

	//ns.tprint(ns.getRunningScript().pid);
	// ns.tprint(ns.pid);		ns.pid is in dev

	//var data = "[1,2,3]";
	//ns.write("test-log.txt", JSON.stringify(data), "w");
	
	/*
	var read = JSON.parse(ns.read("test-log.txt"));
	ns.tprint(read);
	*/




	/*
	let test = Test();
	ns.tprint(test)
	ns.tprint(test.key)
	ns.tprint(Test().key)

	
	let player = ns.getPlayer();
    let server = ns.getServer("n00dles");

	test = Formulas.Hack_time(server, player); // (server, player);
	ns.tprint(test);
	/*



	// https://stackoverflow.com/questions/41549996/how-can-i-import-a-namespace










	/*
	let allocated_RAM = [["myServer-1" , 4096], ["myServer-2" , 4096]];
	let free_RAM = 0;
    allocated_RAM.forEach( server => free_RAM += server[1])
    ns.tprint(allocated_RAM, free_RAM);
	*/

	/*
	var colors = ["38;5;55", "38;5;4", "38;5;6", "38;5;14"]
	var i = 1;
	for (var color of colors){
		ns.tprint("\x1b[" + color + "m" + i)
		i++;
	}
	*/

	/* all characters */
	//var n = "38;5;160"
	//ns.tprint("\x1b[" + n + "mhey");

	/*
	ns.write("test-log.txt","", "w");
	var m = "";
	var caract_in_line = 50;
	for (var i = parseInt("0x0000"); i < parseInt("0xFFFF"); i++){
		for (var j = 0; j < caract_in_line; j++, i++){
			m = m.concat((`${String.fromCodePoint(i)}`));
		}
		ns.tprint(m);
		ns.write("test-log.txt", m + "\n", "a");
		m = "";
	}
	*/


	

	/*
	var a = [
    ["a", 33],  
    ["\u274C", 44],
    ["\u00EF", 51]
	];

	var i;
	for (i=0;i<a.length;i++) {
    ns.tprint(unicodeLiteral(a[i][0]) + "");
	}
	*/



	/*
	// test 1
	var test1 = ns.scan();
	ns.tprint("test 1: ",test1);

	// test 2
	var test2 = ns.scan("omega-net");
	ns.tprint("test 2: a. ", "omega-net", " b. ", test2);
	*/

	/*
	var data = "[1,2,3]";
	ns.write("test-log.txt", JSON.stringify(data), "w");
	
	var read = JSON.parse(ns.read("test-log.txt"));
	ns.tprint(read);
	*/

	/*
	var target = "silver-helix";
	ns.tprint(ns.getServerMinSecurityLevel(target));
	ns.tprint(ns.getServerMaxMoney(target));
	await ns.hack(target);
	*/

	/*
	ns.tprint(ns.fileExists("BruteSSH.exe"))
	ns.tprint(ns.fileExists("FTPCrack.exe"))
	ns.tprint(ns.fileExists("relaySMTP.exe"))
	ns.tprint(ns.fileExists("HTTPWorm.exe"))
	ns.tprint(ns.fileExists("SQLInject.exe"))
	*/
	
	/*
	ns.tprintf('INFO---available log colors:')
    ns.tprintf('INFOthey only need to be at the start')
    ns.tprintf(`otherwise INFO or others won't work`)
    ns.tprintf('WARN this is a warning')
    ns.tprintf('WARNING this is also warning')
    ns.tprintf('ERROR this is an error')
	*/
	
	
}




/* Creates a uppercase hex number with at least length digits from a given number */
function fixedHex(number, length){
    var str = number.toString(16).toUpperCase();
    while(str.length < length)
        str = "0" + str;
    return str;
}

/* Creates a unicode literal based on the string */    
function unicodeLiteral(str){
    var i;
    var result = "";
    for( i = 0; i < str.length; ++i){
        /* You should probably replace this by an isASCII test */
        if(str.charCodeAt(i) > 126 || str.charCodeAt(i) < 32)
            result += "\\u" + fixedHex(str.charCodeAt(i),4);
        else
            result += str[i];
    }

    return result;
}