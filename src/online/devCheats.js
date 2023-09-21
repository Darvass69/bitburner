/** @param {NS} ns */
export async function main(ns) {
  const orig = React.createElement;
  const origState = React.useState;
  let stateCalls = 0;
  let resolve;
  const nextLevelHook = (callNumber, fn, parentThis, parentArgs) => {
    React.createElement = orig;
    // This proxy will wrap the GameRoot function component.
    const wrapped = new Proxy(fn, {
      apply(target, thisArg, args_) {
        // Install next-level hooks *only* on first call. The wrapped component
        // remains present in the tree, even after the exploit finishes!
        if (stateCalls === 0) {
          React.useState = function (...args) {
            stateCalls++;
            const state = origState.call(this, ...args);
            // The specified useState returns the page
            if (stateCalls === callNumber) {
              resolve(state);
              React.useState = origState;
            }
            return state;
          }
        }
        return target.apply(thisArg, args_);
      }
    });
    return orig.call(parentThis, wrapped, ...parentArgs.slice(1));
  }
  React.createElement = function (...args) {
    const fn = args[0];
    const stringFn = (typeof fn === "function") ? String(fn) : null;
    if (stringFn?.includes("Trying to go to a page without the proper setup")) {
      // 2.3.1 and earlier GameRoot code: We have a single page, which is stored as
      // the 2nd useState call.
      return nextLevelHook(2, fn, this, args);
    } else if (stringFn?.includes("Routing is currently disabled")) {
      // 2.3.2 GameRoot code: There is a history stack of pages, stored as the 1st
      // useState call.
      return nextLevelHook(1, fn, this, args);
    }
    return orig.call(this, ...args);
  }
  const resultP = Promise.race([
    new Promise((res) => resolve = res),
    ns.asleep(5000).then(() => { throw Error("Something unknown went wrong while running exploit") })])
    .finally(() => {
      React.createElement = orig;
      React.useState = origState;
    });
  // Force a rerender
  ns.ui.setTheme(ns.ui.getTheme());
  const [state, setState] = await resultP;
  if (typeof state === "string") {
    // 2.3.1 and older
    setState("Dev");
  } else if (typeof state === "number") {
    // Even older versions used numbers
    setState(8);
  } else if (Array.isArray(state)) {
    // 2.3.2 uses a stack
    setState([{ page: "Dev" }, ...state]);
  } else {
    ns.tprintf("ERROR: Exploit succeeded, but got an unknown result for the type of page");
  }
}