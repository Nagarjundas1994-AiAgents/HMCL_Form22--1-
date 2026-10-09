sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
], (BaseController, JSONModel, Filter, FilterOperator, MessageToast) => {
    "use strict";

    const EQ = FilterOperator.EQ;
    const CONTAINS = FilterOperator.Contains;

    // form fields in screen order; each is flagged when empty while a field to its right is filled
    const FIELDS = [
        { key: "kunnr", prefix: "dealer", message: "enterDealer" },
        { key: "invoice", prefix: "invoice", message: "enterInvoice" },
        { key: "frame", prefix: "frame", message: "enterVin" }
    ];

    return BaseController.extend("hmcl.form22ui.controller.Main", {
        onInit() {
            this._oView = new JSONModel({
                // step 1: dealer + invoice, step 2: invoice locked, VIN visible
                step: 1, kunnr: "", name1: "", dealerUnknown: false, invoice: "", frame: ""
            });
            this.getView().setModel(this._oView, "view");
            this._validate();

            // default to the logged-in dealer
            this.getOwnerComponent().userReady.then(() => this._resetDealer());
        },

        // ---- validation ---------------------------------------------------------------------------

        /**
         * Runs on every change event. Flags every empty field that sits left of a filled one;
         * with bAll (Continue / Proceed) every empty visible field is flagged.
         */
        _validate(bAll) {
            const oData = this._oView.getData();
            const aFields = FIELDS.slice(0, oData.step === 1 ? 2 : 3);
            const iLast = aFields.map((oField) => !!oData[oField.key]).lastIndexOf(true);
            let bValid = true;
            aFields.forEach((oField, i) => {
                const bMissing = !oData[oField.key] && (bAll || i < iLast);
                let sError = "";
                if (bMissing) {
                    sError = this.getText(oField.message);
                } else if (oField.key === "kunnr" && oData.dealerUnknown) {
                    sError = this.getText("dealerUnknown", [oData.kunnr]);
                }
                bValid = bValid && !sError && !!oData[oField.key];
                this._oView.setProperty("/" + oField.prefix + "State", sError ? "Error" : "None");
                this._oView.setProperty("/" + oField.prefix + "Error", sError);
            });
            return bValid;
        },

        // ---- invoice details form -----------------------------------------------------------------

        async onDealerChange(oEvent) {
            const sKunnr = oEvent.getParameter("value").trim().toUpperCase();
            this._setDealer(sKunnr, "");
            if (this._oView.getProperty("/step") === 2) {
                // another dealer means another invoice: back to step 1 with the invoice unlocked
                this._oView.setProperty("/step", 1);
                this._oView.setProperty("/frame", "");
            }
            this._validate();
            if (!sKunnr) {
                return;
            }
            try {
                const [oDealer] = await this.query("/ZI_OVS_VH", [new Filter("kunnr", EQ, sKunnr)]);
                // ignore the answer if the user typed something else meanwhile
                if (this._oView.getProperty("/kunnr") === sKunnr) {
                    this._setDealer(sKunnr, oDealer ? oDealer.name1 : "", !oDealer);
                    this._validate();
                }
            } catch (oError) {
                this.showError(oError);
            }
        },

        onInvoiceChange(oEvent) {
            this._oView.setProperty("/invoice", oEvent.getParameter("value").trim().toUpperCase());
            this._validate();
        },

        onFrameChange(oEvent) {
            this._oView.setProperty("/frame", oEvent.getParameter("value").trim().toUpperCase());
            this._validate();
        },

        /** Step 1 -> 2: locks the invoice and reveals the VIN field. */
        onContinue() {
            if (this._validate(true)) {
                this._oView.setProperty("/step", 2);
                this._validate();
            }
        },

        onChangeInvoice() {
            this._oView.setProperty("/step", 1);
            this._oView.setProperty("/invoice", "");
            this._oView.setProperty("/frame", "");
            this._validate();
            this.byId("invoice").focus();
        },

        /** Back to the logged-in dealer with an empty form. */
        onRefresh() {
            this._oView.setProperty("/step", 1);
            this._oView.setProperty("/invoice", "");
            this._oView.setProperty("/frame", "");
            this._resetDealer();
        },

        onProceed() {
            if (!this._validate(true)) {
                return;
            }
            const { kunnr, invoice } = this._oView.getData();
            this.getOwnerComponent().getRouter().navTo("RouteFrames", { kunnr, invoice });
        },

        _resetDealer() {
            this._setDealer(this.getOwnerComponent().getModel("session").getProperty("/kunnr"), "");
            this._validate();
        },

        _setDealer(sKunnr, sName, bUnknown) {
            this._oView.setProperty("/kunnr", sKunnr);
            this._oView.setProperty("/name1", sName);
            this._oView.setProperty("/dealerUnknown", !!bUnknown);
        },

        // ---- dealer / invoice value helps ---------------------------------------------------------

        async onDealerHelp() {
            const oDialog = await this.getDialog("DealerHelp");
            this._openHelp(oDialog, null);
        },

        onDealerSearch(oEvent) {
            const sValue = oEvent.getParameter("value");
            oEvent.getSource().getBinding("items").filter(sValue ? [new Filter({
                filters: [new Filter("kunnr", CONTAINS, sValue), new Filter("name1", CONTAINS, sValue)],
                and: false
            })] : []);
        },

        onDealerPicked(oEvent) {
            const oDealer = oEvent.getParameter("selectedItem")?.getBindingContext().getObject();
            if (oDealer) {
                this._setDealer(oDealer.kunnr, oDealer.name1);
                this._validate();
            }
        },

        async onInvoiceHelp() {
            const sKunnr = this._oView.getProperty("/kunnr");
            if (!sKunnr) {
                this._validate(true);
                return;
            }
            const oDialog = await this.getDialog("InvoiceHelp");
            this._openHelp(oDialog, [new Filter("kunnr", EQ, sKunnr)]);
        },

        onInvoiceSearch(oEvent) {
            const sValue = oEvent.getParameter("value");
            const aFilters = [new Filter("kunnr", EQ, this._oView.getProperty("/kunnr"))];
            if (sValue) {
                aFilters.push(new Filter("invoice", CONTAINS, sValue));
            }
            oEvent.getSource().getBinding("items").filter(new Filter({ filters: aFilters, and: true }));
        },

        onInvoicePicked(oEvent) {
            const oInvoice = oEvent.getParameter("selectedItem")?.getBindingContext().getObject();
            if (oInvoice) {
                this._oView.setProperty("/invoice", oInvoice.invoice);
                this._validate();
            }
        },

        _openHelp(oDialog, aFilters) {
            oDialog.getBinding("items").filter(aFilters || []);
            oDialog.open("");
        },

        // ---- VIN (frame) search dialog ------------------------------------------------------------

        async onVinHelp() {
            const { kunnr, invoice } = this._oView.getData();
            if (!kunnr || !invoice) {
                this._validate(true);
                MessageToast.show(this.getText("needDealerInvoice"));
                return;
            }
            const oDialog = await this.getDialog("VinHelp");
            const oVin = new JSONModel({
                frame: "", engine: "", date: "", invoiceDate: "", results: [], title: "", selected: false, criteria: true
            });
            oDialog.setModel(oVin, "vin");
            oDialog.open();
            try {
                // the billing date of the invoice is the dispatch date of its frames
                const [oInvoice] = await this.query("/ZI_OVS_INVOICE_VH", [new Filter({
                    filters: [new Filter("kunnr", EQ, kunnr), new Filter("invoice", EQ, invoice)], and: true
                })]);
                oVin.setProperty("/invoiceDate", oInvoice ? oInvoice.dt1 : "");
                await this._vinSearch(oVin);
            } catch (oError) {
                this.showError(oError);
            }
        },

        async onVinSearch() {
            const oVin = (await this.getDialog("VinHelp")).getModel("vin");
            try {
                await this._vinSearch(oVin);
            } catch (oError) {
                this.showError(oError);
            }
        },

        async onVinReset() {
            const oVin = (await this.getDialog("VinHelp")).getModel("vin");
            oVin.setProperty("/frame", "");
            oVin.setProperty("/engine", "");
            oVin.setProperty("/date", "");
            this.onVinSearch();
        },

        async onVinToggle() {
            const oVin = (await this.getDialog("VinHelp")).getModel("vin");
            oVin.setProperty("/criteria", !oVin.getProperty("/criteria"));
        },

        async _vinSearch(oVin) {
            const { kunnr, invoice } = this._oView.getData();
            const { frame, engine, date, invoiceDate } = oVin.getData();
            const aFilters = [new Filter("kunnr", EQ, kunnr), new Filter("invoice", EQ, invoice)];
            if (frame) {
                aFilters.push(new Filter("frameno", CONTAINS, frame.toUpperCase()));
            }
            if (engine) {
                aFilters.push(new Filter("engineno", CONTAINS, engine.toUpperCase()));
            }
            const aRows = await this.query("/ZI_OVS_ENGINE_VH", [new Filter({ filters: aFilters, and: true })]);
            const sShown = invoiceDate.split("-").reverse().join(".");
            const aResults = (date && date !== invoiceDate ? [] : aRows)
                .map((oRow) => ({ matnr: oRow.matnr, frameno: oRow.frameno, engineno: oRow.engineno, date: sShown }));
            oVin.setProperty("/results", aResults);
            oVin.setProperty("/title", this.getText("vinResults", [aResults.length]));
            oVin.setProperty("/selected", false);
        },

        onVinSelect(oEvent) {
            oEvent.getSource().getModel("vin").setProperty("/selected", true);
        },

        onVinOk(oEvent) {
            const oDialog = oEvent.getSource().getParent();
            const oItem = oDialog.getContent().find((oControl) => oControl.isA("sap.m.Table")).getSelectedItem();
            if (oItem) {
                this._oView.setProperty("/frame", oItem.getBindingContext("vin").getProperty("frameno"));
                this._validate();
            }
            oDialog.close();
        },

        onVinCancel(oEvent) {
            oEvent.getSource().getParent().close();
        }
    });
});
