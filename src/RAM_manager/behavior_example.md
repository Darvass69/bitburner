# Behavior examples:

See RAM_types.ts for the structure of what is sent to port 1
See Requester_

---

## 1. Normal scripts

ex: map.js

1. In terminal:

	```batch
	run manual_requester.js /map/map.js 
	(because of the ~4GB buffer, manual_requester.js can be run)
	```

2. It sends in port 2

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

3. RAM_manager.js then takes the request from port 2
	- If there is enough space for it to run
    	- Allocate the ram (write it in an internal variable)
    	- Exec the script on the targeted server

## 2. Scripts that run processes (no complex timing)

ex: share-controller.js

1. do like example 1, but with the args being

	```batch
	share-controller.js 10
	```

	> for this example, the share controller's PID = 42

2. share controller sends in port 2 a process request:

	```javascript
	// share controller calculated max nb of threads(2) for 10 GB
	{Process: {
		Requester: 42;
		RAM: { 
			Threads: 2,
			ThreadSize: 4,
			Server: ["home"],
		}
		Timing: "instant",
	}}
	```

3.	RAM_manager then takes the request from port 2

	- If there is enough free space

		- Send to port 1:

			```javascript
			{42: {Process: [["home", 8]]}}
			```

4. same as before but with specific timing, ex:  ***
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