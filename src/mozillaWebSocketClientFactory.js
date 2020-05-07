"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_client_1 = require("./mozilla-ws-client");
var mozillaWebSocketClientFactory = (function () {
    function mozillaWebSocketClientFactory(connectionUrl) {
        if (connectionUrl === void 0) { connectionUrl = null; }
        this.scheme = "ws";
        this.connectionUrl = null;
        this.connectionUrl = connectionUrl;
    }
    mozillaWebSocketClientFactory.prototype.getClient = function () {
        console.log("WsClientFactory creating client for '" + this.scheme + "'");
        return new ws_client_1.default(this.connectionUrl);
    };
    mozillaWebSocketClientFactory.prototype.init = function () {
        return true;
    };
    mozillaWebSocketClientFactory.prototype.destroy = function () {
        return true;
    };
    return mozillaWebSocketClientFactory;
}());
exports.default = mozillaWebSocketClientFactory;