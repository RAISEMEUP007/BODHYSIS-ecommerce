import { getHeaderData, getPriceDataByGroup } from "../api/Product";

export const getPriceTableByBrandAndDate = (priceLogicData:Array<any>, brandId:any, date:Date) => {
  if(!priceLogicData || !priceLogicData.length) return {};
  let selectedPriceLogic = priceLogicData.find(group => 
    group.brand_id == brandId &&
    (group.start_date != null && date >= new Date(group.start_date)) && 
    (group.end_date != null && date <= new Date(group.end_date + " 23:59:59"))
  );

  if(!selectedPriceLogic){
    selectedPriceLogic = priceLogicData.find(group => 
      group.brand_id == brandId &&
      (group.start_date != null && date >= new Date(group.start_date)) && 
      (group.end_date == null )
    );
  }

  if(!selectedPriceLogic){
    selectedPriceLogic = priceLogicData.find(group => 
      group.brand_id == brandId &&
      (group.start_date == null) && 
      (group.end_date != null && date <=new Date(group.end_date + "23:59:59"))
    );
  }

  if(!selectedPriceLogic){
    selectedPriceLogic = priceLogicData.find(group => 
      group.brand_id == brandId &&
      (group.start_date == null && group.end_date == null)
    );
  }

  if (selectedPriceLogic) {
    return selectedPriceLogic.priceTable;
  } else {
    return {};
  }
}

export const calculatePricedEquipmentData = async (headerData:Array<any>, tableId : number|null, equipmentData : Array<any>, startDate:Date | null, endDate:Date | null) => {
  if(startDate === null || endDate === null){
    return equipmentData.map((item)=>({...item, price:0}));
  }
  const pricedEquipmentData = await Promise.all(equipmentData.map(async (item) => {
    const payload = {
      tableId: tableId || 0,
      groupId: item.price_group_id,
    }
    const response:any = await getPriceDataByGroup(payload);
    const rows = await response.json();

    const reversedHeaderData = headerData.slice().reverse();
    const updatedReversedHeaderData = reversedHeaderData.map((item) => {
      const value = rows.find((row:any) => row.point_id === item.id)?.value || 0;
      const pricePMS = item.milliseconds > 0 ? value / item.milliseconds : 0;
      const pricePH = item.milliseconds > 0 ? value / (item.milliseconds / (1000 * 60 * 60)) : 0;
      const pricePD = item.milliseconds > 0 ? value / (item.milliseconds / (1000 * 60 * 60 * 24)) : 0;
      return { ...item, value, pricePH, pricePD };
    });

    console.log("------updatedReversedHeaderData----------------");
    console.log(updatedReversedHeaderData);

    const diff = new Date(endDate).getTime() - new Date(startDate).getTime();

    const basedonPoint  = updatedReversedHeaderData.find((item:any) => {
      if(item.value>0 && item.milliseconds <= diff){
        return item;
      }
    });

    let price = 0;
    if(basedonPoint){
      if(Math.floor(diff/(1000 * 60 * 60 *24)) == 0) price = basedonPoint.pricePH * Math.floor(diff/(1000 * 60 * 60));
      else price = basedonPoint.pricePD * Math.floor(diff/(1000 * 60 * 60 * 24));

      price = Math.round(price*100)/100 * item.quantity;
    }

    //calcualte extras price
    if(item.extras && item.extras.length>0){
      let extrasPrice = item.extras.reduce((total:any, extra:any) => total + extra.fixed_price, 0);
      price += extrasPrice;
    }
    
    return { ...item, price };
  }));
  return pricedEquipmentData;
}