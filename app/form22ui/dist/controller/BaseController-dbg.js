sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], (Controller, Fragment, MessageBox) => {
    "use strict";

    return Controller.extend("hmcl.form22ui.controller.BaseController", {
        getText(sKey, aArgs) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey, aArgs);
        },

        showError(oError) {
            MessageBox.error(oError.message || String(oError));
        },

        /** Reads a whole entity set (with filters) from the OData V4 model as plain objects. */
        async query(sPath, aFilters) {
            const oBinding = this.getView().getModel().bindList(sPath, null, [], aFilters);
            try {
                const aContexts = await oBinding.requestContexts(0, 1000);
                return await Promise.all(aContexts.map((oContext) => oContext.requestObject()));
            } finally {
                oBinding.destroy();
            }
        },

        /** Loads a fragment once per controller and attaches it to the view (models are inherited). */
        async getDialog(sName) {
            this._mDialogs = this._mDialogs || {};
            if (!this._mDialogs[sName]) {
                this._mDialogs[sName] = Fragment.load({
                    name: "hmcl.form22ui.fragment." + sName,
                    controller: this
                }).then((oDialog) => {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                });
            }
            return this._mDialogs[sName];
        },

        /** Turns the base64 PDF returned by the printForm action into a blob URL for the preview. */
        pdfUrl(oPdf) {
            const sBinary = atob(oPdf.pdf_content.replace(/-/g, "+").replace(/_/g, "/"));
            const aBytes = Uint8Array.from(sBinary, (sChar) => sChar.charCodeAt(0));
            return URL.createObjectURL(new Blob([aBytes], { type: oPdf.mime_type }));
        }
    });
});
