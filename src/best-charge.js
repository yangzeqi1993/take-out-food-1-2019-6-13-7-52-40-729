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

