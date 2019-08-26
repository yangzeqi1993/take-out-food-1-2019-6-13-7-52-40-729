function bestCharge(selectedItems) {
  let bestChargeByWhich;
  let totalPrice = calculateTotalPriceWithoutDiscount(selectedItems);
  let firstDiscountedPrice = minus6IfFull30(totalPrice);
  let secondDiscountedPrice = halfPriceForSpecificItems(totalPrice,selectedItems);

  if(totalPrice===firstDiscountedPrice && totalPrice===secondDiscountedPrice){
    bestChargeByWhich = {price:totalPrice, discount:0};
    return bestChargeByWhich;
  }else if(firstDiscountedPrice <= secondDiscountedPrice){
    bestChargeByWhich = {price:firstDiscountedPrice, discount:1};
    return bestChargeByWhich;
  }else {
    bestChargeByWhich = {price:secondDiscountedPrice, discount:2};
    return bestChargeByWhich;
  }
}

function minus6IfFull30(totalPrice) {
  if(totalPrice >= 30){
    totalPrice -=6;
  }
  return totalPrice;
}

function halfPriceForSpecificItems(totalPrice,selectedItems) {
  let discountPrice = 0;
  let halfPrice = loadPromotions()[1].items;
  for(let i=0; i<halfPrice.length; i++){
    let index = selectedItems.findIndex(element => element.id === halfPrice[i]);
    if(index > -1){
      discountPrice += selectedItems[index].price / 2 * selectedItems[index].count;
    }
  }
  return totalPrice - discountPrice;
}

function checkInput(selectedItemsInfo) {
  return selectedItemsInfo.length > 0;
}

function calculateTotalPriceWithoutDiscount(selectedItemsInfo) {
  let totalPrice = 0;
  for(let i=0; i<selectedItemsInfo.length; i++){
    totalPrice += selectedItemsInfo[i].price * selectedItemsInfo[i].count;
  }
  return totalPrice;
}

function printBill(selectedItemsInfo,bestChargeByWhich){
  let bestCharge = bestChargeByWhich.price;
  switch (bestChargeByWhich.discount) {
    case 1:
      return printBillByFirstDiscount(selectedItemsInfo,bestCharge);
    case 2:
      return printBillBySecondDiscount(selectedItemsInfo,bestCharge);
    default:
      return printBillNoDiscount(selectedItemsInfo,bestCharge);
  }
}

function printBillByFirstDiscount(selectedItemsInfo,bestCharge){
  let savings = calculateTotalPriceWithoutDiscount(selectedItemsInfo) - bestCharge;
  return  "============= 订餐明细 =============\n" +
    getOrderFoodDetails(selectedItemsInfo) +
    "-----------------------------------\n" +
    "使用优惠:\n" +
    loadPromotions()[0].type +`，省${savings}元`+ "\n" +
    "-----------------------------------\n"+
    `总计：${bestCharge}元\n`+
    "==================================="
}

function printBillBySecondDiscount(selectedItemsInfo,bestCharge){
  let savings = calculateTotalPriceWithoutDiscount(selectedItemsInfo) - bestCharge;
  let halfPriceItemsName = getHalfPriceItemsName();
  return  "============= 订餐明细 =============\n" +
    getOrderFoodDetails(selectedItemsInfo) +
    "-----------------------------------\n" +
    "使用优惠:\n" +
    loadPromotions()[1].type + `(${halfPriceItemsName})，省${savings}元`+ "\n" +
    "-----------------------------------\n"+
    `总计：${bestCharge}元\n`+
    "==================================="
}

function printBillNoDiscount(selectedItemsInfo,bestCharge){
  return  "============= 订餐明细 =============\n" +
    getOrderFoodDetails(selectedItemsInfo) +
    "-----------------------------------\n"+
    `总计：${bestCharge}元\n`+
    "==================================="
}

function getOrderFoodDetails(selectedItemsInfo) {
  let orderFoodDetails = "";
  for(let i=0; i<selectedItemsInfo.length; i++){
    orderFoodDetails += getOneLineOrderFoodDetails(selectedItemsInfo[i]);
  }
  return orderFoodDetails
}

function getOneLineOrderFoodDetails(selectedOneItemInfo) {
  return `${selectedOneItemInfo.name} x ${selectedOneItemInfo.count} = ${selectedOneItemInfo.price*selectedOneItemInfo.count}元\n`;
}

function getHalfPriceItemsName() {
  let halfPriceItemsName = "";
  let itemsInfo = loadAllItems();
  let promotionsInfo = loadPromotions()[1].items;
  for(let i=0; i<promotionsInfo.length; i++){
    let index = itemsInfo.findIndex(element => element.id === promotionsInfo[i]);
    if(index > -1){
      let delimiter = "";
      if(i !==promotionsInfo.length-1){
        delimiter = "，"
      }
      halfPriceItemsName += itemsInfo[index].name + delimiter;
    }
  }
  return halfPriceItemsName;
}

// 为测试
function printOutputForTest(inputs) {
  let selectedItemsInfo = inputByRequest(inputs);
  if(checkInput(selectedItemsInfo)){
    let bestChargeByWhich = bestCharge(selectedItemsInfo);
    return printBill(selectedItemsInfo,bestChargeByWhich);
  }else {
    return "请输入信息";
  }
}

// 为测试
function inputByRequest(inputItems) {
  let resultInput = [];
  let itemsInfo = loadAllItems();
  for(let i=0; i<inputItems.length; i++){
    let itemArray = inputItems[i].split(" ");
    let inputId = itemArray[0];
    let inputCount = itemArray[2];
    let index = itemsInfo.findIndex(element => element.id === inputId);
    if(index > -1){
      resultInput.push({id:itemsInfo[index].id, name:itemsInfo[index].name, price:itemsInfo[index].price, count:inputCount})
    }
  }
  return resultInput;
}

