/* checksum : 6209dd69adc77590b4a61dcdbec006a8 */
@cds.external : true
@Common.ApplyMultiUnitBehaviorForSortingAndFiltering : true
@Capabilities.FilterFunctions : [
  'eq',
  'ne',
  'gt',
  'ge',
  'lt',
  'le',
  'and',
  'or',
  'contains',
  'startswith',
  'endswith',
  'any',
  'all'
]
@Capabilities.SupportedFormats : [ 'application/json', 'application/pdf' ]
@PDF.Features.DocumentDescriptionReference : '../../../../default/iwbep/common/0001/$metadata'
@PDF.Features.DocumentDescriptionCollection : 'MyDocumentDescriptions'
@PDF.Features.ArchiveFormat : true
@PDF.Features.Border : true
@PDF.Features.CoverPage : true
@PDF.Features.FitToPage : true
@PDF.Features.FontName : true
@PDF.Features.FontSize : true
@PDF.Features.HeaderFooter : true
@PDF.Features.IANATimezoneFormat : true
@PDF.Features.Margin : true
@PDF.Features.Padding : true
@PDF.Features.ResultSizeDefault : 20000
@PDF.Features.ResultSizeMaximum : 20000
@PDF.Features.Signature : true
@PDF.Features.TextDirectionLayout : true
@PDF.Features.Treeview : true
@PDF.Features.UploadToFileShare : true
@Capabilities.KeyAsSegmentSupported : true
@Capabilities.AsynchronousRequestsSupported : true
service ZSB_ITEMDETAILS0001 {
  @cds.external : true
  type ZC_ITEMDETAILSOperationControl {
    @Common.Label : 'Dyn. Action Control'
    @Common.Heading : 'Dynamic Action Control'
    @Common.QuickInfo : 'Dynamic Action Property'
    changeFrame : Boolean not null;
    @Common.Label : 'Dyn. Action Control'
    @Common.Heading : 'Dynamic Action Control'
    @Common.QuickInfo : 'Dynamic Action Property'
    printForm : Boolean not null;
  };

  @cds.external : true
  type ZA_PDF {
    filename : String not null;
    @Common.IsUpperCase : true
    @Common.Label : 'SD Document'
    @Common.Heading : 'Document'
    @Common.QuickInfo : 'Sales and Distribution Document Number'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=VBELN'
    invoice : String(10) not null;
    mime_type : String not null;
    pdf_content : LargeBinary not null;
  };

  @cds.external : true
  type ZA_USERPARA {
    @Common.IsUpperCase : true
    @Common.Label : 'Truth Value'
    @Common.QuickInfo : 'Truth Value: True/False'
    change_visi : Boolean not null;
    @Common.IsUpperCase : true
    @Common.Label : 'Truth Value'
    @Common.QuickInfo : 'Truth Value: True/False'
    is_authorized : Boolean not null;
    @Common.IsUpperCase : true
    @Common.Label : 'Customer'
    @Common.QuickInfo : 'Customer Number'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=KUNNR'
    kunnr : String(10) not null;
    lv_user : String(12) not null;
    name1 : String(40) not null;
  };

  @cds.external : true
  type EntityControl {
    @Common.Label : 'Dyn. Method Control'
    @Common.Heading : 'Dynamic Method Control'
    @Common.QuickInfo : 'Dynamic Method Property'
    Deletable : Boolean not null;
    @Common.Label : 'Dyn. Method Control'
    @Common.Heading : 'Dynamic Method Control'
    @Common.QuickInfo : 'Dynamic Method Property'
    Updatable : Boolean not null;
  };

  @cds.external : true
  type SAP__Message {
    code : String not null;
    message : String not null;
    target : String;
    additionalTargets : many String not null;
    transition : Boolean not null;
    @odata.Type : 'Edm.Byte'
    numericSeverity : Integer not null;
    longtextUrl : String;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @Common.Label : 'Item Details'
  @UI.LineItem : [
    { $Type: 'SAP__UI.DataField', Label: 'Model', Value: model },
    { $Type: 'SAP__UI.DataField', Label: 'Frame No', Value: frameno },
    { $Type: 'SAP__UI.DataField', Label: 'Engine No', Value: engineno },
    { $Type: 'SAP__UI.DataField', Label: 'Status', Value: status },
    {
      $Type: 'SAP__UI.DataFieldForAction',
      Label: 'PRINT',
      Action: 'ZSB_ITEMDETAILS0001.printForm(ZSB_ITEMDETAILS0001.ZC_ITEMDETAILSType)',
      InvocationGrouping: #ChangeSet
    }
  ]
  @UI.SelectionFields : [ 'Kunnr', 'invoice', 'frameno' ]
  @Common.Messages : SAP__Messages
  @Capabilities.SearchRestrictions.Searchable : false
  @Capabilities.FilterRestrictions.NonFilterableProperties : [ '__EntityControl', '__OperationControl' ]
  @Capabilities.SortRestrictions.NonSortableProperties : [ '__EntityControl', '__OperationControl' ]
  @Capabilities.UpdateRestrictions.DeltaUpdateSupported : true
  @Capabilities.UpdateRestrictions.Updatable : ![__EntityControl/Updatable]
  @Capabilities.UpdateRestrictions.QueryOptions.SelectSupported : true
  @Capabilities.DeepUpdateSupport.ContentIDSupported : true
  @Capabilities.DeleteRestrictions.Deletable : ![__EntityControl/Deletable]
  entity ZC_ITEMDETAILS {
    @Common.Label : 'Dealer Code'
    @Core.Computed : true
    @Common.IsUpperCase : true
    @Common.ValueListReferences : [
      '../../../../srvd_f4/sap/zi_ovs_vh/0001;ps=''srvd-zsb_itemdetails-0001'';va=''com.sap.gateway.srvd.zsb_itemdetails.v0001.et-zc_itemdetails.kunnr''/$metadata'
    ]
    @Common.Heading : 'Customer'
    @Common.QuickInfo : 'Customer Number'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=KUNNR'
    key Kunnr : String(10) not null;
    @Common.Label : 'Invoice Number'
    @Core.Computed : true
    @Common.IsUpperCase : true
    @Common.ValueListReferences : [
      '../../../../srvd_f4/sap/zi_ovs_invoice_vh/0001;ps=''srvd-zsb_itemdetails-0001'';va=''com.sap.gateway.srvd.zsb_itemdetails.v0001.et-zc_itemdetails.invoice''/$metadata'
    ]
    @Common.Heading : 'Document'
    @Common.QuickInfo : 'Sales and Distribution Document Number'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=VBELN'
    key invoice : String(10) not null;
    @Common.Label : 'VIN Number'
    @Core.Computed : true
    @Common.ValueListReferences : [
      '../../../../srvd_f4/sap/zi_ovs_engine_vh/0001;ps=''srvd-zsb_itemdetails-0001'';va=''com.sap.gateway.srvd.zsb_itemdetails.v0001.et-zc_itemdetails.frameno''/$metadata'
    ]
    key frameno : String(17) not null;
    @Common.IsUpperCase : true
    @Common.Label : 'char 17'
    @Common.QuickInfo : 'Field type char, length 17'
    key engineno : String(17) not null;
    @Common.IsUpperCase : true
    @Common.Label : 'Char'
    @Common.QuickInfo : 'Character field of length 40'
    status : String(40) not null;
    @Common.IsUpperCase : true
    @Common.Label : 'Material'
    @Common.QuickInfo : 'Material Number'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=MATNR'
    model : String(18) not null;
    msg_flag : String(1) not null;
    message_text : String(255) not null;
    @Core.Computed : true
    @UI.HiddenFilter : true
    @UI.Hidden : true
    __EntityControl : EntityControl;
    @Core.Computed : true
    @UI.HiddenFilter : true
    @UI.Hidden : true
    __OperationControl : ZC_ITEMDETAILSOperationControl;
    SAP__Messages : many SAP__Message not null;
  } actions {
    action checkUserAuth(
      lv_user : String(12) not null,
      @Common.IsUpperCase : true
      @Common.Label : 'Truth Value'
      @Common.QuickInfo : 'Truth Value: True/False'
      is_authorized : Boolean not null,
      @Common.IsUpperCase : true
      @Common.Label : 'Truth Value'
      @Common.QuickInfo : 'Truth Value: True/False'
      change_visi : Boolean not null,
      @Common.IsUpperCase : true
      @Common.Label : 'Customer'
      @Common.QuickInfo : 'Customer Number'
      @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=KUNNR'
      kunnr : String(10) not null,
      name1 : String(40) not null
    ) returns ZA_USERPARA not null;
    @Core.OperationAvailable : ![_it/__OperationControl/changeFrame]
    action changeFrame(
      @Common.IsUpperCase : true
      @Common.Label : 'Material'
      @Common.QuickInfo : 'Material Number'
      @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=MATNR'
      matnr : String(40) not null,
      frameno_in : String(17) not null,
      @Common.IsUpperCase : true
      @Common.Label : 'char 17'
      @Common.QuickInfo : 'Field type char, length 17'
      engineno_in : String(17) not null
    ) returns ZC_ITEMDETAILS not null;
    @Core.OperationAvailable : ![_it/__OperationControl/printForm]
    action printForm() returns ZA_PDF not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @Common.Label : 'Value Help for Engine and Frame Details'
  @Capabilities.SearchRestrictions.Searchable : true
  @Capabilities.SearchRestrictions.UnsupportedExpressions : #group 
  @Capabilities.SearchRestrictions.SearchSyntax : 'https://url.sap/odata-search'
  @Capabilities.InsertRestrictions.Insertable : false
  @Capabilities.DeleteRestrictions.Deletable : false
  @Capabilities.UpdateRestrictions.Updatable : false
  @Capabilities.UpdateRestrictions.QueryOptions.SelectSupported : true
  entity ZI_OVS_ENGINE_VH {
    @Common.Label : 'Frame No.'
    @Common.IsUpperCase : true
    @Common.Heading : 'Frame No'
    @Common.QuickInfo : 'Frame No'
    key frameno : String(17) not null;
    @Common.Label : 'Engine No.'
    @Common.IsUpperCase : true
    @Common.QuickInfo : 'Field type char, length 17'
    key engineno : String(17) not null;
    @Common.Label : 'Dealer Code'
    @Common.IsUpperCase : true
    @Common.Heading : 'Customer'
    @Common.QuickInfo : 'Customer Number'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=KUNNR'
    kunnr : String(10) not null;
    @Common.Label : 'Invoice Number'
    @Common.IsUpperCase : true
    @Common.QuickInfo : 'Character Field with Length 10'
    invoice : String(10) not null;
    @Common.Label : 'Material'
    @Common.IsUpperCase : true
    @Common.QuickInfo : 'Field length 18'
    matnr : String(18) not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @Common.Label : 'Search help for Invoice'
  @Capabilities.SearchRestrictions.Searchable : false
  @Capabilities.InsertRestrictions.Insertable : false
  @Capabilities.DeleteRestrictions.Deletable : false
  @Capabilities.UpdateRestrictions.Updatable : false
  @Capabilities.UpdateRestrictions.QueryOptions.SelectSupported : true
  entity ZI_OVS_INVOICE_VH {
    @Common.Label : 'Invoice No.'
    @Common.IsUpperCase : true
    @Common.Heading : 'Document'
    @Common.QuickInfo : 'Sales and Distribution Document Number'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=VBELN'
    key invoice : String(10) not null;
    @Common.Label : 'Billing Date'
    @Common.Heading : 'Created On'
    @Common.QuickInfo : 'Record Created On'
    key dt1 : Date not null;
    @Common.Label : 'Dealer Code'
    @Common.IsUpperCase : true
    @Common.Heading : 'Sold-to'
    @Common.QuickInfo : 'Sold-to Party'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=KUNAG'
    kunnr : String(10) not null;
  };

  @cds.external : true
  @cds.persistence.skip : true
  @Common.Label : 'Search help for Dealer'
  @Capabilities.SearchRestrictions.Searchable : true
  @Capabilities.SearchRestrictions.UnsupportedExpressions : #group 
  @Capabilities.SearchRestrictions.SearchSyntax : 'https://url.sap/odata-search'
  @Capabilities.InsertRestrictions.Insertable : false
  @Capabilities.DeleteRestrictions.Deletable : false
  @Capabilities.UpdateRestrictions.Updatable : false
  @Capabilities.UpdateRestrictions.QueryOptions.SelectSupported : true
  entity ZI_OVS_VH {
    @Common.Label : 'Customer Number'
    @Common.IsUpperCase : true
    @Common.Heading : 'Customer'
    @Common.QuickInfo : 'Customer Number'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=KUNNR'
    key kunnr : String(10) not null;
    @Common.Label : 'Name'
    @Common.Heading : 'Name'
    @Common.QuickInfo : 'Name'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=NAME1_GP'
    name1 : String(35) not null;
    @Common.Label : 'City'
    @Common.Heading : 'City'
    @Common.QuickInfo : 'City'
    @Common.DocumentationRef : 'urn:sap-com:documentation:key?=type=DE&id=ORT01_GP'
    ort01 : String(35) not null;
  };
};

