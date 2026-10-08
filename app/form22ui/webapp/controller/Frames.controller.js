sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], (BaseController, History, JSONModel, Filter, FilterOperator, MessageBox, MessageToast) => {
    "use strict";

    const EQ = FilterOperator.EQ;
    const CONTAINS = FilterOperator.Contains;

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
            const { kunnr, invoice } = oEvent.getParameter("arguments");
            this._oView.setData({
                kunnr, invoice, rows: [], selCount: 0, busy: false,
                error: "", noData: "", filterVisible: false, filterValue: "",
                preview: false, pdfs: [], pdfIndex: 0
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

        async _load() {
            const { kunnr, invoice } = this._oView.getData();
            const aFilters = [new Filter("Kunnr", EQ, kunnr), new Filter("invoice", EQ, invoice)];
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
                this._oView.setProperty("/error", aRows.length ? "" : (oEmpty && oEmpty.message_text) || this.getText("noRecords", [kunnr, invoice]));
            } catch (oError) {
                this.showError(oError);
            } finally {
                this._oView.setProperty("/busy", false);
            }
        },

        // ---- toolbar ----------------------------------------------------------------------------

        onToggleFilter() {
            const bVisible = !this._oView.getProperty("/filterVisible");
            this._oView.setProperty("/filterVisible", bVisible);
            if (!bVisible) {
                this._oView.setProperty("/filterValue", "");
                this._applyFilter("");
            }
        },

        onFilter(oEvent) {
            this._applyFilter(oEvent.getParameter("newValue") ?? oEvent.getParameter("query") ?? "");
        },

        _applyFilter(sValue) {
            this.byId("frames").getBinding("items").filter(sValue ? [new Filter({
                filters: ["model", "frameno", "engineno", "status"].map((sPath) => new Filter(sPath, CONTAINS, sValue)),
                and: false
            })] : []);
        },

        onSelectAll() {
            this._selectVisible(true);
        },

        onDeselectAll() {
            this._selectVisible(false);
        },

        _selectVisible(bSelected) {
            this.byId("frames").getBinding("items").getContexts()
                .filter((oContext) => oContext.getProperty("printable"))
                .forEach((oContext) => this._oView.setProperty(oContext.getPath() + "/selected", bSelected));
            this.onSelect();
        },

        onSelect() {
            this._oView.setProperty("/selCount", this._selected().length);
        },

        _selected() {
            return this._oView.getProperty("/rows").filter((oRow) => oRow.selected);
        },

        // ---- print ------------------------------------------------------------------------------

        onPrint() {
            MessageBox.confirm(this.getText("printConfirm"), {
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
            this._oView.setProperty("/busy", true);
            try {
                for (const oRow of aRows) {
                    const oAction = this.getView().getModel().bindContext("zform22Service.printForm(...)", this._aContexts[oRow.i]);
                    await oAction.execute();
                    aPdfs.push({ name: oRow.frameno, url: this.pdfUrl(oAction.getBoundContext().getObject()) });
                }
            } catch (oError) {
                this.showError(oError);
            }
            if (aPdfs.length) {
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
            const oHelp = await this.getDialog("EngineHelp");
            const { kunnr, invoice } = this._oView.getData();
            // offer only frames that are not already in this invoice's list
            const aFilters = [new Filter("kunnr", EQ, kunnr), new Filter("invoice", EQ, invoice)]
                .concat(this._oView.getProperty("/rows").map((oRow) => new Filter("frameno", FilterOperator.NE, oRow.frameno)));
            oHelp.getBinding("items").filter(new Filter({ filters: aFilters, and: true }));
            oHelp.open("");
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
            } catch (oError) {
                this.showError(oError);
            }
            await this._load();
        },

        onChangeCancel(oEvent) {
            oEvent.getSource().getParent().close();
        }
    });
});
