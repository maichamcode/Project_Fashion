import { useEffect, useState } from "react";
import { useGetOneProductQuery } from "../../api/product";
import { useGetSaleQuery } from "../../api/sale";
import { useGetColorQuery } from "../../api/color";
import { useGetSizeQuery } from "../../api/size";
import CurrencyFormatter from "../../utils/FormatTotal";
import { useParams } from "react-router-dom";
import { useGetOneOrderQuery } from "../../api/order";

const BillDetail = ({ data, index }: any) => {
  const { data: size } = useGetSizeQuery("");
  const { data: color } = useGetColorQuery("");
  const sizeName = size?.data?.find(
    (id: any) => id?.size_id == data?.size
  )?.size_name;
  const colorName = color?.data?.find(
    (id: any) => id?.color_id == data?.color
  )?.color_name;
  const [tongtien, settongtien] = useState<any>();
  // const
  useEffect(() => {
   if(data?.quantity){
     settongtien(data?.price * data?.quantity)
   }
  }, [data?.quantity]);
  return (
    <>
      <tr>
        <th scope="row">{index + 1}</th>
        <td>
          {data?.name}
          <p>
            {sizeName}, {colorName}
          </p>
        </td>
        <td>x{data?.quantity}</td>
        <td>
          <CurrencyFormatter amount={tongtien} />
        </td>
      </tr>
    </>
  );
};

export default BillDetail;
