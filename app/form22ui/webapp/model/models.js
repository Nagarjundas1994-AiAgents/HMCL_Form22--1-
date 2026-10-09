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
         * Logged-in user, filled from getUserInfo (see Component.js).
         * @returns {sap.ui.model.json.JSONModel} The session model.
         */
        createSessionModel: function () {
            return new JSONModel({ userId: "", isDealer: false, kunnr: "", isEditable: false, welcome: "" });
        }
    };
});
