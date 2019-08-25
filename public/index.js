window.onload=function loadAllItemsInfo(){
  showItems();
  showPromotions();
};

function showItems() {
  let table = document.getElementById("itemsTable");
  let itemsData = loadAllItems();
  for(let i=0; i<itemsData.length; i++){
    let item = itemsData[i];
    let tr = table.insertRow(table.rows.length);
    let td1 = tr.insertCell(0);
    td1.align = "center";
    let td2 = tr.insertCell(1);
    td2.align = "center";
    let td3 = tr.insertCell(2);
    td3.align = "center";
    let td4 = tr.insertCell(3);
    td4.align = "center";

    td1.innerHTML = item.id;
    td2.innerHTML = item.name;
    td3.innerHTML = item.price;
    td4.innerHTML = "<input type=\"text\" id='item"+i+"' class=\"inputItemNum\" maxlength=\"3\" onkeyup=\"value=value.replace(/[^0-9]/ig,'')\"/>";
  }
}

function showPromotions() {
  let promotionsData = loadPromotions();
  document.getElementById("promotion1").innerHTML = promotionsData[0].type;
  document.getElementById("promotion2").innerHTML = promotionsData[1].type+"："+promotionsData[1].items;
}

function calculatePrice() {
  let selectedItemsInfo = getSelectedItemsInfo();
  let bestChargeByWhich = bestCharge(selectedItemsInfo);
  document.getElementById("message").innerHTML = printBill(selectedItemsInfo,bestChargeByWhich);
}

function clearInfo() {
  let itemsData = loadAllItems();
  for (let i=0; i<itemsData.length; i++){
    document.getElementById(`item${i}`).value = "";
  }
  document.getElementById("message").innerHTML ="";
}

function getSelectedItemsInfo() {
  let selectedItemsInfo = [];
  let itemsInfo = loadAllItems();
  for (let i=0; i<itemsInfo.length; i++){
    let itemNum = document.getElementById(`item${i}`).value;
    if(itemNum > 0){
      selectedItemsInfo.push({id:itemsInfo[i].id, name:itemsInfo[i].name, price:itemsInfo[i].price, count:itemNum})
    }
  }
  return selectedItemsInfo;
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
  return `${selectedOneItemInfo.name} x ${selectedOneItemInfo.count} = ${selectedOneItemInfo.price*selectedOneItemInfo.count}\n`;
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



