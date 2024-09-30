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

export const amtHelper = (
  price: number,
  quantity: number,
  gst: number,
  value?: string
) => {
  // console.log("QUANTITY", quantity);
  let amtPreGst = price * quantity;
  let amtPostGst = amtPreGst * (1 + gst / 100);
  amtPostGst = Math.round(amtPostGst * 100) / 100;

  if (value) {
    return amtPostGst;
  } else {
    return <div>&#8377;{amtPostGst}</div>;
  }
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
