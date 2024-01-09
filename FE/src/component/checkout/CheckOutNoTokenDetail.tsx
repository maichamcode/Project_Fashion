import React, { useEffect, useState } from "react";
import { useGetOneProductBlockQuery, useGetOneProductQuery } from "../../api/product";
import { useGetOneSizeQuery } from "../../api/size";
import { useGetOneColorQuery } from "../../api/color";
import CurrencyFormatter from "../../utils/FormatTotal";
import { useGetSaleQuery } from "../../api/sale";

const CheckOutNoTokenDetail = ({ data, onTotal }: any) => {
  console.log(data);
  const { data: productData } = useGetOneProductBlockQuery(data?.product_id);
  const { data: sizeData } = useGetOneSizeQuery(data?.productSize);
  const { data: colorData } = useGetOneColorQuery(data?.productColor);
  const { data: sale } = useGetSaleQuery("");
  const saleName = sale?.data?.find(
    (id: any) => id?.sale_id == productData?.data[0]?.sale_id
  )?.sale_distcount;
  const totalSale = (productData?.data[0]?.product_price * saleName) / 100;
  const total = productData?.data[0]?.product_price - totalSale;
  const [tongtien, settongtien] = useState<any>();
  useEffect(() => {
    if (total) {
      const totals = data?.quantity * total;
      settongtien(totals);
      onTotal(totals);
    } else {
      const totals = data?.quantity * productData?.data[0]?.product_price;
      settongtien(totals);
      onTotal(totals);
    }
  }, [total, productData?.data[0]?.product_price]);
  // const productTotal = data?.quantity * productData?.data[0]?.product_price;
  // // Gọi hàm onTotal để cập nhật tổng tiền khi có thay đổi
  // console.log(productTotal);

  // useEffect(() => {
  //   onTotal(productTotal);
  // }, [productTotal]);
  return (
    <>
      {productData?.data[0] ? <li>
        <a href="#" style={{ width: "100%" }}>
          <span style={{ width: "25%" }}> <div style={{ float: "right" }}><CurrencyFormatter amount={tongtien} /></div> </span>
          <span style={{ width: "15%" }}><div style={{ textAlign: "center" }}>{data?.quantity}</div></span>
          <span style={{ width: "20%" }}><div style={{ textAlign: 'center' }}>{colorData?.data[0]?.color_name}</div></span>
          <span style={{ width: "10%" }}><div style={{ textAlign: 'center' }}>{sizeData?.data[0]?.size_name}</div></span>
          <span style={{ width: "30%" }}> {productData?.data[0]?.product_name?.slice(0, 15)}...</span>
        </a>
      </li> :""}
     
    </>
  );
};

export default CheckOutNoTokenDetail;
