sap.ui.define([
    "sap/ui/core/UIComponent",
    "hmcl/form22ui/model/models",
    "sap/base/Log"
], (UIComponent, models, Log) => {
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

        /**
         * Asks the backend who the logged-in user is and what they may do (checkUserAuth).
         * Any failure keeps the session locked: no form, no Change button.
         */
        async _loadUser() {
            const oSession = this.getModel("session");
            try {
                const oResponse = await fetch(this.getModel().getServiceUrl() + "getUserInfo");
                const oData = await oResponse.json().catch(() => ({}));
                if (!oResponse.ok) {
                    throw new Error(oData.error?.message
                        || this.getModel("i18n").getResourceBundle().getText("userLoadFailed"));
                }
                // OData V4 function responses wrap properties under value or directly in object
                const oResult = oData.value || oData;
                const sUserId = (oResult.userId || "").trim().toUpperCase();
                const bIsDealer = sUserId.startsWith("D");
                oSession.setData({
                    loading: false, authorized: true, error: "",
                    userId: sUserId,
                    isDealer: bIsDealer,
                    // D user: own dealer (id without the D), locked. P user: empty, editable
                    kunnr: bIsDealer ? sUserId.slice(1) : "",
                    isEditable: !bIsDealer,
                    canChange: oResult.canChange === true
                });
            } catch (oError) {
                Log.error("Failed to load User Info", oError, "hmcl.form22ui.Component");
                oSession.setProperty("/loading", false);
                oSession.setProperty("/error", oError.message);
            }
        }
    });
});
