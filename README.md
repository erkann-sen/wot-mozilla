# Wot Mozilla 

A code to make Mozilla WebThing Devices consumeable and useable with node-wot library

## Get Ready
* Get the latest node.js
```bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```
* Clone the repository
	`git clone https://github.com/erkann-sen/wot-mozilla.git`
* Install packages
	`npm install`

## Usage 

* Find the description of your Mozilla WebThing Device, it is in the base URL of device.
	If you do not have any device to use jump to example section.
* Before the consuming the description call:
`makeChangesToUseMozillaDeviceWithWot(<the WebThing Description>, <your servient object>);`
	Check example/index.js for extra information.
* After this step everything works as in a usual WoT device

### Example
1. Create a Mozilla WebThing 
If you do not have a Mozilla WebThing follow here, else jump to step 2
* Go to example/mozilla device folder
* run `npm install webthing`
* run `node index.js` to expose the Mozilla WebThing

2. Consume The WebThing
* Go in example folder and check index.js file, control if the URL inside is correct
* index.js contains one example for every interaction
* run `node index.js` to consume your device

