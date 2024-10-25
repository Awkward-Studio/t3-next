import { CurrentLabour, CurrentPart, UserType } from "./definitions";

export const jobCardStatusKey = [
  { code: 999, description: "All" },
  { code: 0, description: "Job Card Created" },
  { code: 1, description: "Parts Added" },
  { code: 2, description: "Labour Added" },
  { code: 3, description: "Quote Generated" },
  { code: 4, description: "Pro-Forma Invoice Generated" },
  { code: 5, description: "Tax Invoice Generated" },
  { code: 6, description: "Job Card Closed" },
];

export const carMakes = [
  { code: 0, description: "Hyundai" },
  { code: 1, description: "Tata" },
  { code: 2, description: "Volkswagon" },
  { code: 3, description: "BMW" },
  { code: 4, description: "Mercedes" },
];

export const purposeOfVisits = [
  { code: 0, description: "General visit" },
  { code: 1, description: "Bodyshop" },
  { code: 2, description: "Paid service" },
  { code: 3, description: "Running repair" },
];

export const serviceAdvisors = [
  {purposeOfVisitCode : 0, advisors: [
    {name: "atique", email : "atique+serviceadvisor@mindise.co.in"},
    {name: "atique1", email : "atique1+serviceadvisor@mindise.co.in"}
  ]},
  {purposeOfVisitCode : 1, advisors: [
    {name: "omkar", email : "atqiude+serviceAdvisor@mindise.co.in"},
    {name: "atique2", email : "atqifue+serviceAdvisor@mindise.co.in"}
  ]},
  {purposeOfVisitCode : 2, advisors: [
    {name: "omkar1", email : "omkar+serviceadvisor@mindise.co.in"},
    {name: "aatiqu3", email : "atqiue+serviceAdvisor@mindise.co.in"}
  ]},
  {purposeOfVisitCode : 3, advisors: [
    {name: "omkar", email : "omkar+servicerunning@mindise.co.in"},
    {name: "atique4", email : "atqiu86e+serviceAdvisor@mindise.co.in"}
  ]},
];

export const carMakeModels = [
  {
    company: "Maruti Suzuki",
    models: [
      "ALTO",
      "ALTO 800",
      "BALENO",
      "CELERIO",
      "CELERIO X",
      "CIAZ",
      "DZIRE",
      "EECO",
      "ERTIGA",
      "ERTIGA (NEW)",
      "ESTEEM",
      "A-STAR",
      "GYPSY",
      "IGNIS",
      "M 800",
      "OMNI",
      "RITZ",
      "S-CROSS",
      "S-PRESSO",
      "SWIFT",
      "SWIFT (NEW)",
      "SWIFT DZIRE",
      "SWIFT DZIRE (NEW)",
      "SX4",
      "VITARA BREZZA",
      "WAGON R",
      "WAGON-R (NEW)",
      "XL6",
      "ZEN",
      "ZEN ESTILO",
    ],
  },
  {
    company: "Audi",
    models: [
      "A6",
      "A8L",
      "Q2",
      "Q8",
      "Q8 Celebration",
      "RS 7 Sportback",
      "RS Q8",
    ],
  },
  {
    company: "BMW",
    models: [
      "2 Series Gran Coupe",
      "3 Series",
      "3 Series GT",
      "5 Series",
      "6 Series GT",
      "7 Series",
      "8 Series Gran Coupe",
      "M Plus",
      "X1",
      "X3",
      "X4",
      "X5",
      "X6",
      "X7",
      "Z4 Roadster",
    ],
  },
  {
    company: "Datsun",
    models: ["Go", "Go+", "Redi-Go"],
  },
  {
    company: "Fiat",
    models: ["Abarth Punto", "Avventura", "Linea", "Punto Evo", "Urban Cross"],
  },
  {
    company: "Ford",
    models: ["Aspire", "EcoSport", "Endeavour", "Figo", "Freestyle", "Mustang"],
  },
  {
    company: "Honda",
    models: ["Amaze", "City", "Civic", "CR-V", "Jazz", "WR-V"],
  },
  {
    company: "Hyundai",
    models: [
      "Aura",
      "Creta",
      "Elantra",
      "Eon",
      "Grand i10",
      "Grand i10 NIOS",
      "I20",
      "Kona Electric",
      "Santro",
      "Tucson",
      "Venue",
      "Verna",
      "Xcent Prime",
    ],
  },
  {
    company: "Jeep",
    models: ["Compass", "Wrangler"],
  },
  {
    company: "Kia",
    models: ["Carnival", "Seltos", "Sonet"],
  },
  {
    company: "Mahindra",
    models: [
      "Alturas G4",
      "Bolero",
      "KUV100",
      "Marazzo",
      "Nuvo Sport",
      "Scorpio",
      "Thar",
      "TUV300",
      "Verito",
      "XUV300",
      "XUV500",
    ],
  },
  {
    company: "MG",
    models: ["Gloster", "Hector", "Hector Plus", "ZS", "ZSN"],
  },
  {
    company: "Nissan",
    models: ["GT-R", "Kicks", "Micra", "Sunny"],
  },
  {
    company: "Renault",
    models: ["Duster", "Kiger", "Kwid", "Triber"],
  },
  {
    company: "Skoda",
    models: ["Karoq", "Kodiaq", "Octavia", "Rapid", "Superb"],
  },
  {
    company: "Tata",
    models: ["Altroz", "Harrier", "Nexon", "Nexon EV", "Tiago", "Tigor"],
  },
  {
    company: "Toyota",
    models: [
      "Camry Hybrid",
      "Fortuner",
      "Fortuner TRD",
      "Glanza",
      "Innova Crysta",
      "Innova Crysta Leadership Edition",
      "Urban Cruiser",
      "Vellfire",
      "Yaris",
    ],
  },
  {
    company: "Volkswagen",
    models: [
      "Ameo",
      "Jetta",
      "Passat",
      "Polo",
      "Polo GT",
      "Tiguan",
      "T-Roc",
      "Vento",
    ],
  },
  {
    company: "Chevrolet",
    models: [
      "Beat",
      "Tavera",
      "Cruze",
      "Sail",
      "Spark",
      "Camaro",
      "Enjoy",
      "Trailblazer",
      "Aveo",
      "Aveo U-VA",
      "Captiva",
      "Optra",
      "Optra SRV",
      "Corvette",
      "Sail U-Va",
    ],
  },
];

export const policyProviders = [
  "Acko General Insurance Co. Ltd.",
  "Bajaj Allianz General Insurance",
  "Bharti AXA General Insurance Company Ltd.",
  "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD",
  "Go Digit General Insurance Ltd.",
  "Edelweiss General Insurance Co. Ltd.",
  "Future Generali General Insurance",
  "Iffco Tokio General Insurance Co. Ltd.",
  "Kotak Mahindra General Insurance Co. Ltd.",
  "LIBERTY GENERAL INSURANCE LIMITED",
  "NATIONAL INSURANCE COMPANY LIMITED",
  "THE NEW INDIA ASSURANCE CO LTD",
  "The Oriental Insurance Co. Ltd.",
  "Raheja QBE General Insurance Co. Ltd.",
  "Reliance General Insurance Co Ltd",
  "SBI General Insurance Co. Ltd.",
  "Shriram General Insurance Co. Ltd.",
  "Tata AIG General Insurance Co. Ltd.",
  "United India Insurance Co. Ltd.",
  "Universal Sompo General Insurance Co. Ltd.",
  "HDFC ERGO GEN INS CO LTD",
  "ICICI LOMBARD GENERAL INS CO LTD",
  "Royal Sundaram General Insurance Co. Ltd.",
  "OLA FLEET TECHNOLOGIES PVT LTD",
  "Magma HDI General Insurance Co. Ltd.",
  "Navi General Insurance Ltd.",
  "National Insurance Company Ltd",
  "ZUNO GENERAL INSURANCE LIMITED",
  "ZURICH KOTAK GENERAL INSURANCE COMPANY (INDIA) LIMITED",
];

export const getAllCarMakes = () => {
  let makes: string[] = [];

  carMakeModels.map((make) => makes.push(make.company));

  return makes;
};

export const taxAmtHelper = (
  price: number,
  quantity: number,
  gst: number,
  discount?: number,
  value?: string
) => {
  // console.log("QUANTITY", quantity);
  let amtPreGst = price * quantity;

  if (discount) {
    amtPreGst = amtPreGst * (1 - discount / 100);
  }

  let amtPostGst = amtPreGst * (1 + gst / 100);
  amtPostGst = roundToTwoDecimals(Number(amtPostGst));

  if (value) {
    return amtPostGst;
  } else {
    return <div>&#8377;{Number(amtPostGst)}</div>;
  }
};

export const amtHelperWithoutTax = (
  price: number,
  quantity: number,
  discount?: number
) => {
  let amtPreGst = price * quantity;
  if (discount) {
    amtPreGst = amtPreGst * (1 - discount / 100);
  }

  amtPreGst = roundToTwoDecimals(Number(amtPreGst));

  return amtPreGst;
};

export const objToStringArr = (obj: any[]) => {
  let newArr: string[] = [];
  obj.map((a) => newArr.push(JSON.stringify(a)));
  return newArr;
};

export const stringToObj = (strings: string[]) => {
  let newObjArr: any[] = [];
  strings.map((a) => newObjArr.push(JSON.parse(a)));
  return newObjArr;
};

export const getButtonText = (
  userAccess: string,
  isAdding: boolean,
  forPartsManager: boolean
) => {
  // if(userAccess == "parts"){
  switch (userAccess) {
    case "parts":
      if (isAdding && forPartsManager) {
        return <div>Add</div>;
      } else {
        return <div>Edit</div>;
      }

    case "biller":
      if (isAdding) {
        return <div>Add</div>;
      } else {
        return <div>Edit</div>;
      }

    default:
      return <></>;
  }
  // }else{}
};

export const calcAllAmts = (parts: CurrentPart[], labour: CurrentLabour[]) => {
  let partsAmtPreTax: number = 0,
    labourAmtPreTax: number = 0,
    partsAmtPostTax: number = 0,
    labourAmtPostTax: number = 0;

  parts.map((part: any) => {
    partsAmtPreTax =
      partsAmtPreTax +
      amtHelperWithoutTax(part.mrp, part.quantity, part.discount);
    partsAmtPostTax = partsAmtPostTax + part.amount;
  });

  labour.map((work: any) => {
    labourAmtPreTax =
      labourAmtPreTax + amtHelperWithoutTax(work.mrp, work.quantity);
    labourAmtPostTax = labourAmtPostTax + work.amount;
  });

  partsAmtPreTax = roundToTwoDecimals(Number(partsAmtPreTax));
  partsAmtPostTax = roundToTwoDecimals(Number(partsAmtPostTax));
  labourAmtPreTax = roundToTwoDecimals(Number(labourAmtPreTax));
  labourAmtPostTax = roundToTwoDecimals(Number(labourAmtPostTax));

  return { partsAmtPreTax, partsAmtPostTax, labourAmtPreTax, labourAmtPostTax };
};

export const getUserAccess = (user: UserType) => {
  // console.log("USER ACCESS - ", user);
  return user.labels[0];
};

export const splitInsuranceAmt = (amount: number, insurance: number) => {
  // console.log("USER ACCESS - ", user);
  let insuranceAmt = (insurance / 100) * amount;
  let customerAmt = amount - insuranceAmt;

  insuranceAmt = roundToTwoDecimals(Number(insuranceAmt));
  customerAmt = roundToTwoDecimals(Number(customerAmt));

  return { insuranceAmt, customerAmt };
};

export const roundToTwoDecimals = (num: number) => {
  return Math.round(num * 100) / 100;
};

// Running repair
// Paid service
// Bodyshop
// General visit


export function convertToStrings<T>(array: T[]): string[] {
  return array.map(item => JSON.stringify(item));
}

export function convertStringsToArray(array: string[] | undefined): any {
  return array?.map(item => JSON.parse(item));
}