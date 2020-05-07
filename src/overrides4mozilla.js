var content_serdes_1 = require("@node-wot/core/dist/content-serdes");
const binding_ws = require("./mozillaWebSocketClientFactory").default;

module.exports = {
    makeChangesToUseMozillaDeviceWithWot: function (td, servient) {
        //content serdes override
        content_serdes_1.default.valueToContent = (function (_super) {
            return function () {
                var obj = arguments[1];
                // change value to object before converting
                if (obj["forms"][0]["rel"] == "property") {
                    var name = obj.getName();
                    var newValue = new Object();
                    newValue[name] = arguments[0];
                    arguments[0] = newValue;
                } else if (obj["forms"][0]["rel"] == "action") {
                    //action
                    var name = obj.getName();
                    var newValue = new Object();
                    newValue[name] = {};
                    newValue[name]["input"] = arguments[0];
                    arguments[0] = newValue;
                }
                return _super.apply(this, arguments);
            };
        })(content_serdes_1.default.valueToContent);

        content_serdes_1.default.contentToValue = (function (_super) {
            return function () {
                var obj = arguments[1];
                if (typeof obj != 'undefined' && obj.hasOwnProperty("forms") && obj["forms"][0]["rel"] == "property") {
                    //property
                    //get the object strip the meaningful data from it
                    var result = _super.apply(this, arguments);
                    var name = obj.getName();
                    result = result[name];
                    return result;
                } else if (obj === undefined) {
                    //action
                    // no meaningful output created return empty
                    return {};
                } else {
                    //events
                    //handled in WS protocol implementation
                    return _super.apply(this, arguments);
                }
            };
        })(content_serdes_1.default.contentToValue);

        //small changes in td to make it usable as Wot Device
        renameLinks(td);
        makeChangesForEvents(td);

        //add mozilla ws binding
        let link = findWSLink(td);
        if (link != "") {
            servient.addClientFactory(new binding_ws(link));
        }
    }
};

//find alternate URL for WebSocket
function findWSLink(td) {
    var link = "";
    var forms = td["forms"];
    for (var key in forms) {
        var innerObj = forms[key]
        if (innerObj.rel === "alternate") {
            link = innerObj.href;
        }
    }
    return link;
}

//to use events href must be a ws url
//http use of events has no long poll
function makeChangesForEvents(td) {
    if (td.hasOwnProperty("events")) {
        //get ws link
        var link = findWSLink(td);
        
        var events = td["events"];
        Object.entries(events).forEach(
            ([key, value]) => {
                //change hrefs for ws
                value["forms"][0]["href"] = link + value["forms"][0]["href"];

                //if event has output data move it to data field
                if (value.hasOwnProperty("type")) {
                    value['data'] = {}
                    value['data']['type'] = value['type'];
                    delete value['type'];
                }
            });
    }
}

//links key should be changed to forms
function renameLinks(obj) {
    Object.entries(obj).forEach(
        ([key, value]) => {
            if (key == "links") {
                obj["forms"] = value;
                delete obj["links"];
            } else if (typeof value == "object") {
                renameLinks(value)
            }
        });
}
