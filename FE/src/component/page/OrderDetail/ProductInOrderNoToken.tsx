import { useGetOneProductQuery } from "../../../api/product";
import { useGetOneSizeQuery } from "../../../api/size";
import { useGetOneColorQuery } from "../../../api/color";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { useGetSaleQuery } from "../../../api/sale";
import { useEffect, useState } from "react";
const ProductInOrderNoToken = ({ data }: any) => {
  console.log(data);
  const { data: productData } = useGetOneProductQuery(data?.product_id);
  const imageArray = productData?.data[0]?.image[0]?.split(",");
  const productTotal = data?.quantity * productData?.data[0]?.product_price;
  const { data: sizeData } = useGetOneSizeQuery(data?.size);
  const { data: colorData } = useGetOneColorQuery(data?.color);
  const { data: sale } = useGetSaleQuery("");
  const saleName = sale?.data?.find(
    (id: any) => id?.sale_id == productData?.data[0]?.sale_id
  )?.sale_distcount;
  const totalSale = (productData?.data[0]?.product_price * saleName) / 100;

  const total = productData?.data[0]?.product_price - totalSale;
  const [totals, settotals] = useState<any>();
  useEffect(() => {
    if (total) {
      settotals(data?.quantity * total);
    } else {
      settotals(data?.quantity * productData?.data[0]?.product_price);
    }
  }, [productData?.data[0]?.product_price]);
  console.log(totals);

  return (
    <>
      <tr>
        <td>
          <div className="d-flex mb-2">
            <div className="flex-shrink-0">
              <img
                src={imageArray ? imageArray[0] : ""}
                alt=""
                width="65"
                className="img-fluid"
              />
            </div>
            <div className="flex-lg-grow-1 ms-3">
              <h6 className="small mb-0">
                <a href="#" className="text-reset">
                  {productData?.data[0]?.product_name}
                </a>
              </h6>
              <div className="small">
                <span className="d-block">
                  Màu: {colorData?.data[0]?.color_name}
                </span>
                <span className="d-block">
                  Kích cỡ: {sizeData?.data[0]?.size_name}{" "}
                </span>
              </div>
            </div>
          </div>
        </td>
        <td className="text-end">x{data?.quantity}</td>
        <td className="text-end">
          <CurrencyFormatter amount={totals} />
        </td>
      </tr>
    </>
  );
};

export default ProductInOrderNoToken;
