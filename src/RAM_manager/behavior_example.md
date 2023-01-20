# Behavior examples:

---

1. normal scripts, ex: map.js

    - in terminal:

	```javascript
	run manual_requester.js /map/map.js 
	(because of the ~4GB buffer, manual_requester.js can be run)
	```

	- it sends in port 2

		```js
		{Script: {
			ScriptName : ["/map/map.js", "home"];
			RAM: {
				Threads: 1,
				ThreadSize: 9.45,
				Server: ["home"],
			}
			Timing: "instant",
			args: [],
		}}
		```

		- RAM_manager.js then takes the request from port 2 and see if there's space
    		- then exec it if it can

2. scripts that run processes (no complex timing), ex: share-controller.js
			(after doing like 1: but with share-controller.js and args = [10], share controller PID = 42)
			share controller sends in port 2 a process request:
				{Process: {
					Requester: 42;
					RAM: { // share controller did some calculations to have max nb of threads for 10 GB
						Threads: 2,
						ThreadSize: 4,
						Server: ["home"],
					}
					Timing: "instant",
				}}
			now RAM_manager.js see if there is enough space and if there is add to port 1:
        port1 += {42: {Process: [["home", 8]]}}
    
3. same as before but with specific timing, ex:  ***
			(after doing like 1: but with ***)
			share controller sends in port 2 a process request:
				{Process: {
					Requester: 42;
					RAM: { // share controller did some calculations to have max nb of threads for 10 GB
						Threads: 2,
						ThreadSize: 4,
						Server: ["home"],
					}
					Timing: [0,15_000], // starts at time=0, end at time=15_000
				}}
			now RAM_manager.js