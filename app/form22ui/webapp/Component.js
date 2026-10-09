sap.ui.define([
    "sap/ui/core/UIComponent",
    "hmcl/form22ui/model/models",
    "sap/m/MessageBox",
    "sap/base/Log"
], (UIComponent, models, MessageBox, Log) => {
    "use strict";

    return UIComponent.extend("hmcl.form22ui.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            this.setModel(models.createSessionModel(), "session");

            // views wait on this before reading the session model
            this.userReady = this._loadUser();

            // enable routing
            this.getRouter().initialize();
        },

        /** Asks the backend who the logged-in user is, same as HMCL_TAN_MAINTENANCE (_fetchUserInfo). */
        async _loadUser() {
            const oSession = this.getModel("session");
            try {
                const oResponse = await fetch(this.getModel().getServiceUrl() + "getUserInfo");
                const oData = await oResponse.json();
                if (!oResponse.ok) {
                    const oError = new Error(oData?.error?.message || "Access Denied: Invalid User ID");
                    oError.status = oResponse.status;
                    throw oError;
                }
                // OData V4 function responses wrap properties under value or directly in object
                const oResult = oData.value || oData;
                const sUserId = (typeof oResult === "string" ? oResult : oResult?.userId || "").trim().toUpperCase();
                const bIsDealer = sUserId.startsWith("D");
                oSession.setData({
                    userId: sUserId,
                    isDealer: bIsDealer,
                    // D user: own dealer (id without the D), locked. P user: empty, editable
                    kunnr: bIsDealer ? sUserId.slice(1) : "",
                    isEditable: !bIsDealer,
                    welcome: this.getModel("i18n").getResourceBundle().getText("welcome", [sUserId])
                });
            } catch (oError) {
                Log.error("Failed to load User Info", oError, "hmcl.form22ui.Component");
                if (oError.status === 403) {
                    // TAN reloads on close; Fiori lint forbids location.reload()
                    MessageBox.error(oError.message, { title: "Authorization Failure" });
                } else {
                    oSession.setData({ userId: "", isDealer: false, kunnr: "", isEditable: true, welcome: "" });
                }
            }
        }
    });
});
