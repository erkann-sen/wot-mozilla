const WebThing_Description_ADDRESS = "http://localhost:8888" //change the address with your device address
Helper = require("@node-wot/core").Helpers
Servient = require("@node-wot/core").Servient
const binding_http = require("@node-wot/binding-http");
const override = require('../src/overrides4mozilla');

//Building the servient object
var servient = new Servient();
servient.addClientFactory(new binding_http.HttpClientFactory());
var helper = new Helper(servient);

helper.fetch(WebThing_Description_ADDRESS).then(async (td) => {
    //make Mozilla device compatible with wot
    override.makeChangesToUseMozillaDeviceWithWot(td, servient); 
    //normal wot implementation
    servient.start().then((thingFactory) => {
            thingFactory.consume(td).then((thing) => {
                console.info("=== TD ===");
                console.info(JSON.stringify(td));
                console.info("==========");

                thing.writeProperty("on",true); //write property
                thing.readProperty("on").then((val) => { //read property 
                     console.info("val: "+ JSON.stringify(val));
                })
                thing.invokeAction("fade",{ //invoke an action
                      "brightness": 20,
                      "duration": 1000
                    }
                );
                thing.subscribeEvent("overheated", data => { //subscribe
                    console.info('event overheated returned with data:', data);
                    thing.unsubscribeEvent("overheated"); //unsubscribe
                }).catch((error) => {
                    console.log(error);
                });
            }).catch ((err) => {
            console.error("Script error:", err);
        });
    }).catch((err) => { console.error("Fetch error:", err); });
})
