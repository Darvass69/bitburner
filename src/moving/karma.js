/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    while (true) {
        var karma = ns.heart.break();
        ns.clearLog();
        ns.print('Current Karma : ',karma);
        await ns.sleep(250);
    }
}