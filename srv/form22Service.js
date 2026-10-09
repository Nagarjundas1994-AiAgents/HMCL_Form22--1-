const cds = require('@sap/cds')
const remoteCall = require('./extcalls/remoteCall4_form22')

module.exports = class Zform22Service extends cds.ApplicationService {
    init() {
        const { ZC_ITEMDETAILS, ZI_OVS_VH, ZI_OVS_INVOICE_VH, ZI_OVS_ENGINE_VH } = this.entities

        this.on('READ', [ZC_ITEMDETAILS, ZI_OVS_VH, ZI_OVS_INVOICE_VH, ZI_OVS_ENGINE_VH], remoteCall.read)
        this.on('changeFrame', ZC_ITEMDETAILS, remoteCall.changeFrame)
        this.on('printForm', ZC_ITEMDETAILS, remoteCall.printForm)
        this.on('getUserInfo', remoteCall.getUserInfo)

        return super.init()
    }
}
