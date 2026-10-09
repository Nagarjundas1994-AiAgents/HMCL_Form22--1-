using {ZSB_ITEMDETAILS0001 as external} from './external/ZSB_ITEMDETAILS0001.cds';

@requires: 'authenticated-user'
service zform22Service {

    entity ZC_ITEMDETAILS as projection on external.ZC_ITEMDETAILS
    excluding {
        __EntityControl,
        __OperationControl
    }
    actions {
        action changeFrame(matnr: String(40),
                           frameno_in: String(17),
                           engineno_in: String(17)) returns ZC_ITEMDETAILS;
                           
        action printForm() returns external.ZA_PDF;
    };

    entity ZI_OVS_VH as projection on external.ZI_OVS_VH;
    
    entity ZI_OVS_INVOICE_VH as projection on external.ZI_OVS_INVOICE_VH;
    
    entity ZI_OVS_ENGINE_VH as projection on external.ZI_OVS_ENGINE_VH;


    function getUserInfo() returns { userId : String };
                         
}