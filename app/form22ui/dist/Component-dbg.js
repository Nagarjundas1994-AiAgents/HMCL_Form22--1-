sap.ui.define([
    "sap/ui/core/UIComponent",
    "hmcl/form22ui/model/models"
], (UIComponent, models) => {
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

        /** Asks the backend who the logged-in user is and which dealer they may print for. */
        async _loadUser() {
            const oSession = this.getModel("session");
            const oBundle = this.getModel("i18n").getResourceBundle();
            try {
                const oAction = this.getModel().bindContext("/checkUserAuth(...)");
                // the backend action declares all of these as required input
                oAction.setParameter("lv_user", "");
                oAction.setParameter("is_authorized", false);
                oAction.setParameter("change_visi", false);
                oAction.setParameter("kunnr", "");
                oAction.setParameter("name1", "");
                await oAction.execute();
                const oUser = oAction.getBoundContext().getObject();
                oSession.setData({
                    authorized: !!oUser.is_authorized,
                    canChangeDealer: !!oUser.change_visi,
                    kunnr: oUser.kunnr,
                    name1: oUser.name1,
                    welcome: oBundle.getText("welcome", [oUser.name1, oUser.kunnr]),
                    error: oUser.is_authorized ? "" : oBundle.getText("notAuthorized")
                });
            } catch (oError) {
                oSession.setProperty("/error", oBundle.getText("userFailed", [oError.message]));
            }
        }
    });
});
