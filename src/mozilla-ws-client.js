"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = require('ws');

var ws;

var events = require('events');
var eventEmitter = new events.EventEmitter();

var WebSocketClient = (function () {
    function WebSocketClient(connectionUrl) {
        if (connectionUrl != null) {
            ws = new WebSocket(connectionUrl, "webthing", null);
            listenWSMessages();
        } else {
            throw "WebSocket needs a link";
        }
    }

    function subscribeToEvent(eventName) {
        var obj = {
            "messageType": "addEventSubscription",
            "data": {}
        }
        obj["data"][eventName] = {};
        if (ws.readyState !== WebSocket.OPEN) {
            ws.on('open', function() {
              ws.send(JSON.stringify(obj))
            });
      } else {
            ws.send(JSON.stringify(obj))
      }
    }

    function listenWSMessages() {
        ws.on('message', function incoming(data) {
           var obj = JSON.parse(data);
           if(obj.messageType == "event") {
                //event happened emit inner event
                var key = Object.keys(obj.data)[0];
                var data = obj.data[key]['data'];
                if (data == undefined){ data = null}
                eventEmitter.emit('event' + key, data);
           }
        });
    }

    WebSocketClient.prototype.toString = function () {
        return "[WebSocketClient]";
    };
    WebSocketClient.prototype.readResource = function (form) {
        return new Promise(function (resolve, reject) {
        });
    };
    WebSocketClient.prototype.writeResource = function (form, content) {
        return new Promise(function (resolve, reject) {
        });
    };
    WebSocketClient.prototype.invokeResource = function (form, content) {
        return new Promise(function (resolve, reject) {
        });
    };
    WebSocketClient.prototype.unlinkResource = function (form) {
        return new Promise(function (resolve, reject) {
            if(form.rel == "events") {
                //event
                const parts = form.href.split('/events/');
                eventEmitter.removeAllListeners('event' + parts[1]);
                resolve();
            } else {
                resolve();
            }
        });
    };
    WebSocketClient.prototype.subscribeResource = function (form, next, error, complete) {
        const parts = form.href.split('/events/');
        subscribeToEvent(parts[1]);
        eventEmitter.on('event' + parts[1], function (data) {
            var obj = {'type': "application/json", 'body': data}
            next(obj);
        });
    };

    WebSocketClient.prototype.start = function () {
        return true;
    };
    WebSocketClient.prototype.stop = function () {
        return true;
    };
    WebSocketClient.prototype.setSecurity = function (metadata, credentials) {
        if (Array.isArray(metadata)) {
            metadata = metadata[0];
        }
        return true;
    };
    return WebSocketClient;
}());
exports.default = WebSocketClient;
//# sourceMappingURL=ws-client.js.map