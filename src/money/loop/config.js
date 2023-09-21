const root = "/money/loop/"

export default { 
	"files": {
		"findServers": root + "findServers.js",
		"findTarget": root + "findTarget.js",
		"findRAM": root + "findRAM.js",

		"manager": root + "manager.js",

		"hack": "loopHack.js",
		"grow": "loopGrow.js",
		"weaken": "loopWeaken.js",
	},
	"ports": {
		"serverList": 1,
		"targetInfo": 2,
		"RAMInfo": 3,
	},
	
	launchDelay: 50,// default is 100
}