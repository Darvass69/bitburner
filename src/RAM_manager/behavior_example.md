# Behavior examples:

See RAM_types.ts for the structure of what is sent to port 1
See Requester_

---

## 1. Normal scripts

ex: map.js

1. In terminal:

	```batch
	run manual_requester.js /map/map.js 
	```

	(because of the ~4GB buffer, manual_requester.js can be run)

2. It sends in port 2

	```js
	{Script: {
		ScriptName : ["/map/map.js", "home"];
		RAM: {
			Threads: 1,
			ThreadSize: 9.45,
			Server: ["home", "n00dles"],
		}
		Timing: "instant",
		args: [],
	}}
	```

3. RAM_manager.js then takes the request from port 2
	- If there is enough space for it to run on one of the requested servers

		`server: ["home", "n00dles"]`

    	- Allocate the ram (write it in an internal variable)
4. Exec the script on the targeted server
   	- Keep the PID and use it as obj key to access all allocated memory to that specific script

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
			Server: ["n00dles", "foodnstuff"],
		}
		Timing: "instant",
	}}
	```

3.	RAM_manager then takes the request from port 2
    - If there is enough free space to fit the whole request on a server
        - fit the request in the server (case 1 in next step)
    - Else, if possible, split the request
		- some threads will go in one server and some into another (case 2)
   	- Else
		- Refuse the request (case 3)

4. Sends to port 1:

   - Case 1: foodnstuff has 8 GB free

		```javascript
		{42: {Process: [["foodnstuff", 8]]}}
		```

   - Case 2: foodnstuff & n00dles have 4 GB free each

		```javascript
		{42: {Process: [["foodnstuff", 4], ["n00dles", 4]]}}
		```

   - Case 3: foodnstuff & n00dles don't have enough free RAM

		<!-- TODO -->
		> > TODO: finish code block
		> > Error message sent to the requester so it knows it has no new RAM? Or just don't return anything?

		```javascript
		//?
		```

## 3. Same as before but with specific timing

ex:  ***

> *** is a placeholder for a type of script I don't have an example for

1. like ex. 1, but with ***

   > for this example, ***'s PID = 69

2. *** sends in port 2 a process request:

	```js
	{Process: {
		Requester: 69;
		RAM: {
			Threads: 2,
			ThreadSize: 4,
			Server: ["home", "joesguns"],
		}
		// starts at time = 0, end at time = 15_00
		Timing: [0, 15_000], 
	}}
	```

3. RAM_manager then takes the request from port 2

	> The internal object that stores the RAM that has been allocated is named RAM_state. Its main keys are each time stamps where the amount of RAM somewhere changes.

    - For each time block that span timing
		> These time block are every time interval between start time and end time
    	- Find the free RAM for each servers
   	- Now try to allocate RAM for a block continuous in time and on the same server
     	- If we find a block on one server that fits, case 1
     	- Else, if we find multiple block (on multiple servers) that fit, case 2
     	- Else, refuse the request (case 3)

4. Sends to port 1:

   - Case 1: home has enough RAM for the entire duration

		```javascript
		{69: {Process: 
			0: [["home", 8]],
			15000: [[]]
		}}
		```

   - Case 2: home & joesguns have 4 GB free each

		```javascript
		{69: {Process: 
			0: [["home", 4], ["joesguns", 4]],
			15000: [[]]
		}}
		```

   - Case 3: home & joesguns don't have enough free RAM

		<!-- TODO -->
		> > TODO: finish code block
		> > Error message sent to the requester so it knows it has no new RAM? Or just don't return anything?

		```javascript
		//?
		```

<!-- TODO -->
<!-- Add examples of how to chose when we have multiple solutions.
	Right now, we take the first solution found -->