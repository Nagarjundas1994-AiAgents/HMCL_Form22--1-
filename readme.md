# Getting Started

Welcome to your new CAP project.

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`readme.md` | this getting started guide

## Next Steps

- Open a new terminal and run `cds watch`
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start with your domain model, in a CDS file in `db/`

## Learn More

Learn more at <https://cap.cloud.sap>.

Final URL : 

/sap/opu/odata4/sap/zsrv_itemdetails_v4/srvd/sap/zsb_itemdetails/0001/ZC_ITEMDETAILS?$filter=Kunnr eq '0000000001' and invoice eq '0004647347' and frameno eq 'MBLHAW220P4B15723'
{
  "@odata.context" : "$metadata#ZC_ITEMDETAILS",
  "@odata.metadataEtag" : "W/\"20260930112841\"",
  "value" : [
    {
      "#com.sap.gateway.srvd.zsb_itemdetails.v0001.changeFrame" : {

      },
      "#com.sap.gateway.srvd.zsb_itemdetails.v0001.printForm" : {

      },
      "Kunnr" : "1",
      "invoice" : "4647347",
      "frameno" : "MBLHAW220P4B15723",
      "engineno" : "HA11E7P4B20272",
      "status" : "Pending for Printing",
      "model" : "ELECTRIC SC ACPC",
      "msg_flag" : "",
      "message_text" : "",
      "__EntityControl" : {
        "Deletable" : true,
        "Updatable" : true
      },
      "__OperationControl" : {
        "changeFrame" : true,
        "printForm" : true
      },
      "SAP__Messages" : [

      ]
    }
  ]
}
/sap/opu/odata4/sap/zsrv_itemdetails_v4/srvd/sap/zsb_itemdetails/0001/ZC_ITEMDETAILS
{
  "@odata.context" : "$metadata#ZC_ITEMDETAILS",
  "@odata.metadataEtag" : "W/\"20260930112841\"",
  "value" : [
    {
      "#com.sap.gateway.srvd.zsb_itemdetails.v0001.changeFrame" : {

      },
      "#com.sap.gateway.srvd.zsb_itemdetails.v0001.printForm" : {

      },
      "Kunnr" : "",
      "invoice" : "",
      "frameno" : "",
      "engineno" : "",
      "status" : "",
      "model" : "",
      "msg_flag" : "",
      "message_text" : "No records found for the Dealer code  and Invoice Number  . Please check the invoice has a valid form22 printing models",
      "__EntityControl" : {
        "Deletable" : true,
        "Updatable" : true
      },
      "__OperationControl" : {
        "changeFrame" : true,
        "printForm" : true
      },
      "SAP__Messages" : [

      ]
    }
  ]
}

/sap/opu/odata4/sap/zsrv_itemdetails_v4/srvd/sap/zsb_itemdetails/0001/ZI_OVS_ENGINE_VH
{
  "@odata.context" : "$metadata#ZI_OVS_ENGINE_VH",
  "@odata.metadataEtag" : "W/\"20260930112841\"",
  "value" : [
    {
      "frameno" : "MBLHA10AMC9F00357",
      "engineno" : "HA10EJC9F00582",
      "kunnr" : "10066",
      "invoice" : "1231011921",
      "matnr" : "HSPPADRKCCRCRD"
    },
    {
      "frameno" : "MBLHAW130L4L03465",
      "engineno" : "HA11E7P4B20297",
      "kunnr" : "11943",
      "invoice" : "96986687",
      "matnr" : "HSPPRIRSCFIBLA"
    },
    {
      "frameno" : "MBLHAW130L4L03466",
      "engineno" : "HA11E7P4B20297",
      "kunnr" : "11943",
      "invoice" : "96986687",
      "matnr" : "HSPPRIRSCFIBLA"
    },
    {
      "frameno" : "MBLHAW130L4L03467",
      "engineno" : "HA11E7P4B20297",
      "kunnr" : "11943",
      "invoice" : "96986687",
      "matnr" : "HSPPRIRSCFIBLA"
    },
    {
      "frameno" : "MBLHAW220P4B15723",
      "engineno" : "HA11E7P4B20272",
      "kunnr" : "1",
      "invoice" : "4647347",
      "matnr" : "HSPPRIRSCFIBLA"
    },
    {
      "frameno" : "MBLHAW220P4B15737",
      "engineno" : "HA11E7P4B20297",
      "kunnr" : "11943",
      "invoice" : "96999037",
      "matnr" : "HSPPRIRSCFIBLA"
    }
  ]
}

/sap/opu/odata4/sap/zsrv_itemdetails_v4/srvd/sap/zsb_itemdetails/0001/ZI_OVS_INVOICE_VH

{
  "@odata.context" : "$metadata#ZI_OVS_INVOICE_VH",
  "@odata.metadataEtag" : "W/\"20260930112841\"",
  "value" : [
    {
      "invoice" : "10037",
      "dt1" : "2005-11-04",
      "kunnr" : "90613861"
    },
    {
      "invoice" : "4647347",
      "dt1" : "2026-08-31",
      "kunnr" : "1"
    },
    {
      "invoice" : "90613860",
      "dt1" : "2005-11-04",
      "kunnr" : "10066"
    },
    {
      "invoice" : "96986687",
      "dt1" : "2018-10-30",
      "kunnr" : "11943"
    },
    {
      "invoice" : "96999037",
      "dt1" : "2018-10-30",
      "kunnr" : "11943"
    }
  ]
}
/sap/opu/odata4/sap/zsrv_itemdetails_v4/srvd/sap/zsb_itemdetails/0001/ZI_OVS_VH

{
  "@odata.context" : "$metadata#ZI_OVS_VH",
  "@odata.metadataEtag" : "W/\"20260930112841\"",
  "value" : [
    {
      "kunnr" : "1",
      "name1" : "SATISH KUMAR",
      "ort01" : ""
    },
    {
      "kunnr" : "6",
      "name1" : "jghjg",
      "ort01" : "?tyuty"
    },
    {
      "kunnr" : "11",
      "name1" : "ABN AMRO BANK",
      "ort01" : "NEW DELHI"
    },
    {
      "kunnr" : "12",
      "name1" : "HDFC BANK LIMITED",
      "ort01" : "NEW DELHI"
    },
    {
      "kunnr" : "13",
      "name1" : "STANDARD CHARTERED BANK",
      "ort01" : "NEW DELHI"
    },
    {
      "kunnr" : "14",
      "name1" : "BANK OF AMERICA",
      "ort01" : "NEW DELHI"
    },
    {
      "kunnr" : "15",
      "name1" : "CITIBANK",
      "ort01" : "NEW DELHI"
    },
    {
      "kunnr" : "16",
      "name1" : "ICICI BANK LIMITED",
      "ort01" : "NEW DELHI"
    },
    {
      "kunnr" : "17",
      "name1" : "BANK OF TOKYO-MITSUBISHI LIMITED",
      "ort01" : "NEW DELHI"
    },
    {
      "kunnr" : "20",
      "name1" : "Amazon India Pvt. Ltd.",
      "ort01" : "Gurugram"
    },
    {
      "kunnr" : "1000",
      "name1" : "Hero Moto Corp",
      "ort01" : "Vasant Kunj-Phase II, New Delhi"
    },
    {
      "kunnr" : "1101",
      "name1" : "HMCL - Jaipur Office",
      "ort01" : "Jaipur-Rajasthan"
    },
    {
      "kunnr" : "1197",
      "name1" : "HMCL - Bengaluru Office2",
      "ort01" : "Bengaluru- Karnataka"
    },
    {
      "kunnr" : "1199",
      "name1" : "HMCL - Bengaluru Office1",
      "ort01" : "Bengaluru- Karnataka"
    },
    {
      "kunnr" : "1201",
      "name1" : "HMCL - Chandigarh Office",
      "ort01" : "MOHALI, PUNJAB"
    },
    {
      "kunnr" : "1202",
      "name1" : "HMCL - Kharar Office",
      "ort01" : "KHARAR"
    },
    {
      "kunnr" : "1203",
      "name1" : "HMCL - Chandigarh Office",
      "ort01" : "CHANDIGARH"
    },
    {
      "kunnr" : "1301",
      "name1" : "HMCL - Delhi Office",
      "ort01" : "Gurugram"
    },
    {
      "kunnr" : "1401",
      "name1" : "HMCL - Lucknow Office",
      "ort01" : "Lucknow"
    },
    {
      "kunnr" : "1402",
      "name1" : "HMCL - Lucknow 2 Office",
      "ort01" : "Lucknow"
    },
    {
      "kunnr" : "1501",
      "name1" : "HMCL - Haryana Office",
      "ort01" : "Gurugram-Haryana"
    },
    {
      "kunnr" : "1601",
      "name1" : "HMCL -Dehradun Office",
      "ort01" : "Dehradun-Uttarakhand"
    },
    {
      "kunnr" : "1701",
      "name1" : "HMCL - Varanasi Office",
      "ort01" : "Varanasi"
    },
    {
      "kunnr" : "1901",
      "name1" : "HMCL-NOIDA OFFICE",
      "ort01" : "NOIDA"
    },
    {
      "kunnr" : "2101",
      "name1" : "HMCL - Kochi Office",
      "ort01" : "Kochi-Kerala"
    },
    {
      "kunnr" : "2201",
      "name1" : "HMCL - Bengaluru Office",
      "ort01" : "Bengaluru- Karnataka"
    },
    {
      "kunnr" : "2202",
      "name1" : "HMCL - Hubli Office",
      "ort01" : "Hubli"
    },
    {
      "kunnr" : "2301",
      "name1" : "HMCL - Chennai Office",
      "ort01" : "Chennai-Tamil Nadu"
    },
    {
      "kunnr" : "2302",
      "name1" : "HMCL - Coimbatore Office",
      "ort01" : "Coimbatore"
    },
    {
      "kunnr" : "2401",
      "name1" : "HMCL - Hyderabad Office",
      "ort01" : "Hyderabad-Telangana"
    },
    {
      "kunnr" : "2402",
      "name1" : "HMCL - Vijayvada Office",
      "ort01" : "Vijayvada-Andhra Pradesh"
    },
    {
      "kunnr" : "3101",
      "name1" : "HMCL - Ranchi Office",
      "ort01" : "Ranchi-Jharkhand"
    },
    {
      "kunnr" : "3201",
      "name1" : "HMCL - Bhubaneswar Office",
      "ort01" : "Bhubaneswar-Odisha"
    },
    {
      "kunnr" : "3301",
      "name1" : "HMCL - Kolkata Office",
      "ort01" : "Kolkata-West Bengal"
    },
    {
      "kunnr" : "3401",
      "name1" : "HMCL - Assam & NE Office",
      "ort01" : "Kamrup, Guwahati,"
    },
    {
      "kunnr" : "3601",
      "name1" : "HMCL - Patna Office",
      "ort01" : "PATNA-BIHAR"
    },
    {
      "kunnr" : "3602",
      "name1" : "HMCL - Patna 2 Office",
      "ort01" : "PATNA-BIHAR"
    },
    {
      "kunnr" : "4101",
      "name1" : "HMCL - Mumbai Office",
      "ort01" : " ANDHERI EAST, MUMBAI, Mumbai City"
    },
    {
      "kunnr" : "4201",
      "name1" : "HMCL - Vadodara Office",
      "ort01" : "Vadodara-Gujarat"
    },
    {
      "kunnr" : "4202",
      "name1" : "HMCL - Rajkot Office",
      "ort01" : "Rajkot"
    },
    {
      "kunnr" : "4300",
      "name1" : "HMCL - Pune Zonal Office",
      "ort01" : "Pune-Maharashtra"
    },
    {
      "kunnr" : "4301",
      "name1" : "HMCL - Pune Office",
      "ort01" : "Pune"
    },
    {
      "kunnr" : "4302",
      "name1" : "HMCL - Nagpur Office",
      "ort01" : "Nagpur"
    },
    {
      "kunnr" : "4303",
      "name1" : "HMCL - Raipur Office",
      "ort01" : "Raipur-Chhattisgarh"
    },
    {
      "kunnr" : "4401",
      "name1" : "HMCL - Bhopal Office",
      "ort01" : "Bhopal-Madhya Pradesh"
    },
    {
      "kunnr" : "4501",
      "name1" : "HMCL - Udaipur Office",
      "ort01" : "Udaipur"
    },
    {
      "kunnr" : "4601",
      "name1" : "HMCL - Indore Office",
      "ort01" : "Indore"
    },
    {
      "kunnr" : "10000",
      "name1" : "JASWANT MOTORS",
      "ort01" : "JALANDHAR"
    },
    {
      "kunnr" : "10001",
      "name1" : "SPEEDWAYS",
      "ort01" : "AMRITSAR"
    },
    {
      "kunnr" : "10002",
      "name1" : "S.NIHAL SINGH MOTORS",
      "ort01" : "LUDHIANA"
    },
    {
      "kunnr" : "10003",
      "name1" : "S.GOEL& GOEL",
      "ort01" : "PATIALA"
    },
    {
      "kunnr" : "10004",
      "name1" : "N.S. MOTORS",
      "ort01" : "LUDHIANA"
    },
    {
      "kunnr" : "10005",
      "name1" : "KAMAL ENTERPRISES",
      "ort01" : "BATHINDA"
    },
    {
      "kunnr" : "10006",
      "name1" : "R K MAHAJAN ENTERPRISES",
      "ort01" : "JALANDHAR"
    },
    {
      "kunnr" : "10007",
      "name1" : "K.S.MOTOR CYCLE DIVISION",
      "ort01" : "FEROZEPUR"
    },
    {
      "kunnr" : "10008",
      "name1" : "KALSI MOTORS",
      "ort01" : "LUDHIANA"
    },
    {
      "kunnr" : "10009",
      "name1" : "B M ENTERPRISES",
      "ort01" : "PATHANKOT"
    },
    {
      "kunnr" : "10010",
      "name1" : "DUGGAL AUTOMOBILES(REGD)",
      "ort01" : "GURDASPUR"
    },
    {
      "kunnr" : "10011",
      "name1" : "SURYA MOTORS",
      "ort01" : "ABOHAR"
    },
    {
      "kunnr" : "10012",
      "name1" : "FARID SERVICE STATION",
      "ort01" : "FARIDKOT"
    },
    {
      "kunnr" : "10013",
      "name1" : "FARID SERVICE STATION (AUTO DIVISIO",
      "ort01" : "MOGA"
    },
    {
      "kunnr" : "10014",
      "name1" : "RELIABLE MOTORS",
      "ort01" : "NANGAL DAM"
    },
    {
      "kunnr" : "10015",
      "name1" : "SHIVAM AUTO.",
      "ort01" : "ROHTAK"
    },
    {
      "kunnr" : "10016",
      "name1" : "YUVA MOTORS PRIVATE LIMITED",
      "ort01" : "FARIDABAD"
    },
    {
      "kunnr" : "10017",
      "name1" : "NIRMAL MOTORS",
      "ort01" : "KARNAL"
    },
    {
      "kunnr" : "10018",
      "name1" : "CHAUDHARY AUTOMOBILES",
      "ort01" : "HISSAR"
    },
    {
      "kunnr" : "10019",
      "name1" : "KHANNA AUTOMOBILES",
      "ort01" : "JAGADHRI"
    },
    {
      "kunnr" : "10020",
      "name1" : "ASSOCIATED AUTOMOBILES",
      "ort01" : "AMBALA"
    },
    {
      "kunnr" : "10021",
      "name1" : "SAI ENTERPRISES",
      "ort01" : "AMBALA CANTT"
    },
    {
      "kunnr" : "10022",
      "name1" : "AUTO NEEDS",
      "ort01" : "GURGAON"
    },
    {
      "kunnr" : "10023",
      "name1" : "JAYA AUTOMOBILES",
      "ort01" : "BHIWANI"
    },
    {
      "kunnr" : "10024",
      "name1" : "SHREE BALA JEE AUTOMOBILES",
      "ort01" : "FATEHABAD"
    },
    {
      "kunnr" : "10025",
      "name1" : "AUTO DEALS",
      "ort01" : "NARNAUL"
    },
    {
      "kunnr" : "10026",
      "name1" : "SAMTA AUTOMOBILES",
      "ort01" : "SONEPAT"
    },
    {
      "kunnr" : "10027",
      "name1" : "SAHIB MOTORS",
      "ort01" : "PANIPAT"
    },
    {
      "kunnr" : "10028",
      "name1" : "GAURAV AUTOMOBILES",
      "ort01" : "KURUKSHETRA"
    },
    {
      "kunnr" : "10029",
      "name1" : "VIRENDRA AUTOMOBILES",
      "ort01" : "REWARI"
    },
    {
      "kunnr" : "10030",
      "name1" : "NATIONAL AUTOMOBILES",
      "ort01" : "JIND"
    },
    {
      "kunnr" : "10031",
      "name1" : "CHAUDHARY AUTO AGENCY",
      "ort01" : "KAITHAL"
    },
    {
      "kunnr" : "10032",
      "name1" : "DEEP AUTOMOBILES",
      "ort01" : "SIRSA"
    },
    {
      "kunnr" : "10033",
      "name1" : "KHANNA AUTOMOBILES",
      "ort01" : "LADWA"
    },
    {
      "kunnr" : "10034",
      "name1" : "SUNIL AUTO SALES (P) LTD.",
      "ort01" : "LUCKNOW"
    },
    {
      "kunnr" : "10035",
      "name1" : "NORTHERN MOTORS",
      "ort01" : "KANPUR"
    },
    {
      "kunnr" : "10036",
      "name1" : "U.S AGRAWAL & CO.",
      "ort01" : "VARANASI"
    },
    {
      "kunnr" : "10037",
      "name1" : "SWAMI MOTORS",
      "ort01" : "KANPUR"
    },
    {
      "kunnr" : "10038",
      "name1" : "SARASWATI MOTORS",
      "ort01" : "ALLAHABAD"
    },
    {
      "kunnr" : "10039",
      "name1" : "BRIGHT MOTORS",
      "ort01" : "LUCKNOW"
    },
    {
      "kunnr" : "10040",
      "name1" : "JAI KUMAR ARUN KUMAR P. LTD.",
      "ort01" : "MEERUT"
    },
    {
      "kunnr" : "10041",
      "name1" : "KIPPS SALES (P) LTD.",
      "ort01" : "BAREILLY"
    },
    {
      "kunnr" : "10042",
      "name1" : "BRIJ AUTOMOBILES",
      "ort01" : "GORAKHPUR"
    },
    {
      "kunnr" : "10043",
      "name1" : "ATMARAM AUTO ENTERPRISES",
      "ort01" : "AGRA"
    },
    {
      "kunnr" : "10044",
      "name1" : "DOON VALLEY MOTORS",
      "ort01" : "DEHRADUN"
    },
    {
      "kunnr" : "10045",
      "name1" : "JAWAHAR MOTORS",
      "ort01" : "MORADABAD"
    },
    {
      "kunnr" : "10046",
      "name1" : "BOMBAY AUTOMOBILES",
      "ort01" : "RAI BARELI"
    },
    {
      "kunnr" : "10047",
      "name1" : "GLOBE AGENCIES",
      "ort01" : "GHAZIABAD"
    },
    {
      "kunnr" : "10048",
      "name1" : "AGARWAL AUTO SALES",
      "ort01" : "SITAPUR"
    },
    {
      "kunnr" : "10049",
      "name1" : "MITTAL AGENCIES",
      "ort01" : "MUZAFFARNAGAR"
    },
    {
      "kunnr" : "10050",
      "name1" : "SUN MOTORS",
      "ort01" : "LUCKNOW"
    },
    {
      "kunnr" : "10051",
      "name1" : "SURI AUTOMOBILES",
      "ort01" : "JHANSI"
    },
    {
      "kunnr" : "10052",
      "name1" : "G.B. AUTOMOBILES",
      "ort01" : "BALLIA"
    }
  ],
  "@odata.nextLink" : "ZI_OVS_VH?$skiptoken=100"
}



## Form 22 app

Run `npm start` (or `cds watch`) and open <http://localhost:4004/hmcl.form22ui/index.html>.

All calls go through `srv/extcalls/remoteCall4_form22.js` to the real `ZSB_ITEMDETAILS0001` OData service via the `BAS` destination
(same pattern as HMCL_TAN_MAINTENANCE). Users must start with `P` (internal) or `D` (dealer, limited to the Kunnr
returned by the backend's `checkUserAuth`).
