sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        /**
         * Logged-in dealer, filled by the checkUserAuth action (see Component.js).
         * @returns {sap.ui.model.json.JSONModel} The session model.
         */
        createSessionModel: function () {
            return new JSONModel({ authorized: false, canChangeDealer: false, kunnr: "", name1: "", welcome: "", error: "" });
        }
    };
});
