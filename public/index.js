window.onload = function loadAllItemsInfo(){
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
  if(checkInput(selectedItemsInfo)){
    let bestChargeByWhich = bestCharge(selectedItemsInfo);
    document.getElementById("message").innerHTML = printBill(selectedItemsInfo,bestChargeByWhich);
  }else {
    alert("请输入信息");
  }

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




