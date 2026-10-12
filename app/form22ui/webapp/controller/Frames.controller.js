sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/m/library"
], (BaseController, History, JSONModel, Filter, FilterOperator, MessageBox, MessageToast, mobileLibrary) => {
    "use strict";

    const EQ = FilterOperator.EQ;

    return BaseController.extend("hmcl.form22ui.controller.Frames", {
        onInit() {
            this._oView = new JSONModel();
            this.getView().setModel(this._oView, "view");
            this.getOwnerComponent().getRouter().getRoute("RouteFrames").attachPatternMatched(this._onMatched, this);
        },

        _onMatched(oEvent) {
            if (this._oView.getProperty("/preview")) {
                this.onClosePreview();
            }
            const { kunnr, invoice, frame } = oEvent.getParameter("arguments");
            this._oView.setData({
                kunnr, invoice, frame, rows: [], selCount: 0, busy: false,
                error: "", preview: false, pdfs: [], pdfIndex: 0, printInfo: ""
            });
            this._load();
        },

        onBack() {
            if (History.getInstance().getPreviousHash() !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteMain", {}, true);
            }
        },

        // ---- loading ----------------------------------------------------------------------------

        /** Filters on the invoice key, so the backend can answer for the whole invoice (Change Frame help). */
        _invoiceFilters() {
            const { kunnr, invoice } = this._oView.getData();
            return [new Filter("Kunnr", EQ, kunnr), new Filter("invoice", EQ, invoice)];
        },

        async _load() {
            const { kunnr, invoice, frame } = this._oView.getData();
            // the VIN entered on the first screen is part of the backend filter
            const aFilters = this._invoiceFilters().concat(new Filter("frameno", EQ, frame));
            this._oView.setProperty("/busy", true);
            this._oView.setProperty("/error", "");
            try {
                // keep the list binding alive: the row contexts are what the print/change actions are bound to
                const oBinding = this.getView().getModel().bindList("/ZC_ITEMDETAILS", null, [], [new Filter({ filters: aFilters, and: true })]);
                const aContexts = await oBinding.requestContexts(0, 5000);
                const aObjects = await Promise.all(aContexts.map((oContext) => oContext.requestObject()));
                if (this._oBinding) {
                    this._oBinding.destroy();
                }
                this._oBinding = oBinding;
                this._aContexts = aContexts;

                // the backend answers "no records" with one empty row that only carries message_text
                const aRows = aObjects
                    .map((oItem, i) => ({
                        i, model: oItem.model, frameno: oItem.frameno, engineno: oItem.engineno,
                        status: oItem.status, selected: false, printable: oItem.status !== "Printed"
                    }))
                    .filter((oRow) => oRow.frameno);
                const oEmpty = aObjects.find((oItem) => oItem.message_text);
                this._oView.setProperty("/rows", aRows);
                this._oView.setProperty("/selCount", 0);
                this._oView.setProperty("/error", aRows.length ? "" : (oEmpty && oEmpty.message_text) || this.getText("noRecords", [kunnr, invoice, frame]));
            } catch (oError) {
                this.showError(oError);
            } finally {
                this._oView.setProperty("/busy", false);
            }
        },

        // ---- selection --------------------------------------------------------------------------

        onSelect() {
            this._oView.setProperty("/selCount", this._selected().length);
        },

        _selected() {
            return this._oView.getProperty("/rows").filter((oRow) => oRow.selected);
        },

        // ---- print ------------------------------------------------------------------------------

        onPrint() {
            const aFrames = this._selected().map((oRow) => oRow.frameno);
            MessageBox.warning(this.getText("printConfirm", [aFrames.length, aFrames.join(", ")]), {
                title: this.getText("printConfirmTitle"),
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                emphasizedAction: MessageBox.Action.YES,
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.YES) {
                        this._print();
                    }
                }
            });
        },

        async _print() {
            const aRows = this._selected();
            const aPdfs = [];
            let oRow;
            this._oView.setProperty("/busy", true);
            try {
                for (oRow of aRows) {
                    const oAction = this.getView().getModel().bindContext("zform22Service.printForm(...)", this._aContexts[oRow.i]);
                    await oAction.execute();
                    aPdfs.push({ name: oRow.frameno, url: this.pdfUrl(oAction.getBoundContext().getObject()) });
                }
            } catch (oError) {
                MessageBox.error(this.getText("printFailed", [oRow.frameno, oError.message]));
            }
            if (aPdfs.length) {
                this._oView.setProperty("/printInfo", this.getText("printSuccess", [aPdfs.map((oPdf) => oPdf.name).join(", ")]));
                this._oView.setProperty("/pdfs", aPdfs);
                this._showPdf(0);
                this._oView.setProperty("/preview", true);
            }
            // the backend flips the status of what was printed, even when a later frame failed
            await this._load();
        },

        _showPdf(iIndex) {
            this._oView.setProperty("/pdfIndex", iIndex);
            this.byId("pdfFrame").setContent("<iframe class='f22Pdf' src='" + this._oView.getProperty("/pdfs")[iIndex].url + "'></iframe>");
        },

        onPdfSelect(oEvent) {
            const sName = oEvent.getParameter("selectedItem").getKey();
            this._showPdf(this._oView.getProperty("/pdfs").findIndex((oPdf) => oPdf.name === sName));
        },

        onOpenPdf() {
            const { pdfs, pdfIndex } = this._oView.getData();
            mobileLibrary.URLHelper.redirect(pdfs[pdfIndex].url, true);
        },

        onClosePreview() {
            this._oView.getProperty("/pdfs").forEach((oPdf) => URL.revokeObjectURL(oPdf.url));
            this.byId("pdfFrame").setContent("");
            this._oView.setProperty("/pdfs", []);
            this._oView.setProperty("/preview", false);
        },

        // ---- change frame -----------------------------------------------------------------------

        async onChange() {
            const oRow = this._selected()[0];
            const oDialog = await this.getDialog("ChangeFrame");
            this._oChange = new JSONModel({ row: oRow, frameno: "", engineno: "", matnr: "" });
            oDialog.setModel(this._oChange, "change");
            oDialog.open();
        },

        async onNewFrameHelp() {
            const { kunnr, invoice } = this._oView.getData();
            try {
                const oHelp = await this.getDialog("EngineHelp");
                // offer only frames that are not already in this invoice's list (the page itself shows one VIN only)
                const aInvoice = await this.query("/ZC_ITEMDETAILS", [new Filter({ filters: this._invoiceFilters(), and: true })]);
                const aTaken = new Set(aInvoice.map((oItem) => oItem.frameno).filter(Boolean));
                aTaken.add(this._oChange.getProperty("/row/frameno"));
                const aFilters = [new Filter("kunnr", EQ, kunnr), new Filter("invoice", EQ, invoice)]
                    .concat([...aTaken].map((sFrame) => new Filter("frameno", FilterOperator.NE, sFrame)));
                oHelp.getBinding("items").filter(new Filter({ filters: aFilters, and: true }));
                oHelp.open("");
            } catch (oError) {
                this.showError(oError);
            }
        },

        onNewFramePicked(oEvent) {
            const oEngine = oEvent.getParameter("selectedItem")?.getBindingContext().getObject();
            if (oEngine) {
                this._oChange.setProperty("/frameno", oEngine.frameno);
                this._oChange.setProperty("/engineno", oEngine.engineno);
                this._oChange.setProperty("/matnr", oEngine.matnr);
            }
        },

        async onChangeConfirm(oEvent) {
            const oDialog = oEvent.getSource().getParent();
            const { row, frameno, engineno, matnr } = oDialog.getModel("change").getData();
            this._oView.setProperty("/busy", true);
            try {
                const oAction = this.getView().getModel().bindContext("zform22Service.changeFrame(...)", this._aContexts[row.i]);
                oAction.setParameter("matnr", matnr);
                oAction.setParameter("frameno_in", frameno);
                oAction.setParameter("engineno_in", engineno);
                await oAction.execute();
                oDialog.close();
                MessageToast.show(this.getText("frameChanged", [frameno]));
                // the page is filtered on the VIN, so follow the item to its new VIN (reloads via _onMatched)
                const { kunnr, invoice } = this._oView.getData();
                this.getOwnerComponent().getRouter().navTo("RouteFrames", { kunnr, invoice, frame: frameno }, true);
            } catch (oError) {
                this.showError(oError);
                await this._load();
            }
        },

        onChangeCancel(oEvent) {
            oEvent.getSource().getParent().close();
        }
    });
});
