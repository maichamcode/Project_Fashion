import { UserOutlined } from "@ant-design/icons";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { useGetSaleQuery, useUpdatesaleMutation } from "../../../api/sale";
import { Button, Select, SelectProps, Space, message } from "antd";
import { useEffect, useState } from "react";
import { useAddActionMutation } from "../../../api/actions";
import { useGetOneUserQuery } from "../../../api/auth";
import { useGetProductsQuery } from "../../../api/product";

const LitProductSaleDetail = ({ data }: any) => {
  const { data: sale, isLoading } = useGetSaleQuery("");
  // console.log(sale);

  const { data: product } = useGetProductsQuery("");

  const user = JSON.parse(localStorage.getItem("user")!);

  const saleName = sale?.data?.find(
    (item: any) => item?.sale_id == data?.sale_id
  )?.sale_id;
  // console.log(data);

  const saleName2 = sale?.data?.find(
    (item: any) => item?.sale_id == data?.sale_id
  )?.sale_name;
  const [Sale, setSale] = useState<any>();
  // console.log(Sale);

  const [check, setcheck] = useState(false);
  const [SaleUpdate] = useUpdatesaleMutation();
  const [addAction] = useAddActionMutation();
  useEffect(() => {
    if (Sale) {
      setcheck(false);
    } else {
      setcheck(true);
    }
  }, [Sale]);
  const [messageApi, contextHolder] = message.useMessage();
  const HandleUpdateSale = () => {
    const data1 = {
      id: data?.product_id,
      sale_id: Number(Sale),
    };
    SaleUpdate(data1)
      .unwrap()
      .then((data: any) => {
        if (Sale == "null") {
          console.log(data);
          const data2 = {
            user_id: user?.user?.id,
            action: "Bỏ sản phẩm sale",
            old_data: saleName2,
            new_data: data?.data?.sale_id,
          };
          addAction(data2);
        } else {
          console.log(data);
          const saleName1 = product?.data?.find(
            (item: any) => item?.product_id == data?.data?.product_id
          )?.product_name;
          const data2 = {
            user_id: user?.user?.id,
            action: "Thêm sản phẩm sale",
            old_data: null,
            new_data: saleName1,
          };
          addAction(data2);
        }

        messageApi.success("Cập nhập sale thành công!");
      });
  };
  const saleName1 = sale?.data?.find(
    (id: any) => id?.sale_id == data?.sale_id
  )?.sale_distcount;

  const totalSale = Number(data?.product_price * saleName1) / 100;
  const total = Number(data?.product_price) - totalSale;
  const [totalSum, settotalSum] = useState<any>();
  useEffect(() => {
    if (total) {
      settotalSum(total);
    } else {
      settotalSum(data?.product_price);
    }
  }, [total]);
  return (
    <>
      {contextHolder}
      <tr>
        {isLoading ? (
          ""
        ) : (
          <>
            <td>
              {" "}
              <strong>#{data?.product_id}</strong>
            </td>
            <td>{data?.product_name}</td>
            <td width="25%">
              {total ? (
                <div style={{ display: "flex" }}>
                  <del style={{ marginRight: "10px" }}>
                    <CurrencyFormatter amount={data?.product_price} />{" "}
                  </del>{" "}
                  <span> </span> <CurrencyFormatter amount={totalSum} />{" "}
                </div>
              ) : (
                <CurrencyFormatter amount={data?.product_price} />
              )}
            </td>
            <td width="20%">
              <select
                id="largeSelect"
                className="form-select form-select-lg"
                defaultValue={saleName ? saleName : ""}
                style={{ width: "150px", height: "90%" }}
                onChange={(e) => setSale(e.target.value)}
              >
                <option value="null">Chọn sale</option>
                {sale?.data?.map((data: any) => (
                  <option value={data?.sale_id}>{data?.sale_name}</option>
                ))}
              </select>
            </td>
            <td>
              <Button onClick={HandleUpdateSale} disabled={check}>
                Cập Nhập
              </Button>
            </td>
      
          </>
        )}
      </tr>
    </>
  );
};

export default LitProductSaleDetail;
