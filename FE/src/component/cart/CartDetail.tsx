import { useEffect, useState } from "react";
import { useGetColorQuery } from "../../api/color";
import { useGetOneProductBlockQuery, useGetOneProductQuery } from "../../api/product";
import { useGetSaleQuery } from "../../api/sale";
import { useGetSizeQuery } from "../../api/size";
import { Button, Input, Popconfirm, Skeleton, message } from "antd";
import { useAddToCartMutation, useDeleteCartMutation } from "../../api/cart";
import CurrencyFormatter from "../../utils/FormatTotal";
import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const CartDetail = ({ data, onTotal, quantity, onCheck }: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: product, isLoading } = useGetOneProductBlockQuery(
    data?.product?.product_id
  );
  console.log(product);

  const user = JSON.parse(localStorage.getItem("user")!);
  const { data: size } = useGetSizeQuery("");
  const { data: color } = useGetColorQuery("");
  const imageArray = product?.data[0]?.image[0]?.split(",");
  const sizeName = size?.data?.find(
    (id: any) => id?.size_id == data?.product?.size
  )?.size_name;
  const colorName = color?.data?.find(
    (id: any) => id?.color_id == data?.product?.color
  )?.color_name;
  const { data: sale } = useGetSaleQuery("");
  const saleName = sale?.data?.find(
    (id: any) => id?.sale_id == product?.data[0]?.sale_id
  )?.sale_distcount;
  const totalSale = (product?.data[0]?.product_price * saleName) / 100;
  const total = product?.data[0]?.product_price - totalSale;
  const [tongtien, settongtien] = useState(
    data?.quantity * product?.data[0]?.product_price
  );
  const [addtocart] = useAddToCartMutation();
  const [check, setcheck] = useState(false);
  const [deleteCart] = useDeleteCartMutation();

  useEffect(() => {
    if (total) {
      if (quantity) {
        const totals = quantity * total;
        settongtien(totals);
        onTotal(totals);
      } else {
        const totals = data?.quantity * total;
        settongtien(totals);
        onTotal(totals);
      }
    } else {
      if (quantity) {
        const totals = quantity * product?.data[0]?.product_price;
        settongtien(totals);
        onTotal(totals);
      } else {
        const totals = data?.quantity * product?.data[0]?.product_price;
        settongtien(totals);
        onTotal(totals);
      }
    }
  });
  const HandleQuantity = (data2: any) => {
    const quantity1 = data2.target.value;
    if (quantity1 > product?.data[0]?.kho) {
      messageApi.open({
        type: "error",
        content: "Sản phẩm trong kho không đủ!",
      });
    } else {
      if (quantity1 <= 0) {
        onCheck(true);
        messageApi.open({
          type: "error",
          content: "Số Lượng Đơn Sản Phẩm Phải Lơn Hơn 0",
        });
      } else {
        onCheck(false);
        const quantity = Number(quantity1) - Number(data?.quantity);
        if (quantity < 0) {
          const quantity2 = Number(data?.quantity) + quantity;
          const productColor = data?.product?.color;
          const productSize = data?.product?.size;
          const data1 = {
            product_id: product?.data[0].product_id,
            productColor: productColor,
            productSize: productSize,
            quantity: quantity,
          };
          const token = user?.accessToken;
          const all = { data: data1, token: token };
          setcheck(true);
          addtocart(all)
            .unwrap()
            .then(() => {
              setcheck(false);
              if (total) {
                if (quantity) {
                  const totals = quantity * total;
                  onTotal(totals);
                } else {
                  const totals = data?.quantity * total;
                  onTotal(totals);
                }
              } else {
                if (quantity) {
                  const totals = quantity * product?.data[0]?.product_price;
                  onTotal(totals);
                } else {
                  const totals =
                    data?.quantity * product?.data[0]?.product_price;
                  onTotal(totals);
                }
              }
            });
        } else if (quantity > 0) {
          const productColor = data?.product?.color;
          const productSize = data?.product?.size;
          const data1 = {
            product_id: product?.data[0].product_id,
            productColor: productColor,
            productSize: productSize,
            quantity: quantity,
          };
          const token = user?.accessToken;
          const all = { data: data1, token: token };
          setcheck(true);
          addtocart(all)
            .unwrap()
            .then(() => {
              setcheck(false);
              if (total) {
                if (quantity) {
                  const totals = quantity * total;
                  onTotal(totals);
                } else {
                  const totals = data?.quantity * total;
                  onTotal(totals);
                }
              } else {
                if (quantity) {
                  const totals = quantity * product?.data[0]?.product_price;
                  onTotal(totals);
                } else {
                  const totals =
                    data?.quantity * product?.data[0]?.product_price;
                  onTotal(totals);
                }
              }
            });
        }
      }
    }
  };
  const confirm = (id: any) => {
    deleteCart(id)
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Xóa thành công!",
        });
        window.location.reload(); // Làm mới trang
      });
  };
  return (
    <>
      {contextHolder}
      {isLoading ? (
        <Skeleton />
      ) : (
        product?.data[0] ? <tr >
          <td >
            <div className="media">
              <div className="d-flex" style={{ width: "30%" }}>
                <img
                  style={{ width: "80%" }}
                  src={imageArray ? imageArray[0] : ""}
                  alt=""
                />
              </div>
              <div className="media-body">
                <p style={{ fontWeight: "bold" }}>
                  <Link
                    to={`/shopProduct/${product?.data[0]?.product_id}`}
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    {product?.data[0]?.product_name?.slice(0, 20)}
                  </Link>
                </p>
                <p>Kích cỡ: {sizeName}</p>
                <p>Màu: {colorName}</p>
              </div>
            </div>
          </td>
          <td>
            {total ? (
              <div style={{ display: "flex" }}>
                <h5
                  style={{
                    marginRight: "10px",
                    color: "#888",
                    textDecoration: "line-through",
                  }}
                >
                  <CurrencyFormatter amount={product?.data[0]?.product_price} />
                </h5>
                <h5 style={{ color: "red" }}>
                  <CurrencyFormatter amount={total} />
                </h5>
              </div>
            ) : (
              <h5>
                <CurrencyFormatter amount={product?.data[0]?.product_price} />
              </h5>
            )}
          </td>
          <td>
            <div className="product_count">
              <Input
                type="number"
                defaultValue={data?.quantity}
                min="1"
                onChange={HandleQuantity}
                disabled={check}
              />
            </div>
          </td>
          <td>
            <h5>
              <CurrencyFormatter amount={tongtien} />
            </h5>
          </td>

          <td className="cart__close">
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có muốn xóa sản phẩm này không?"
              onConfirm={() => confirm(data?.id)}
              okText="Yes"
              cancelText="No"
            >
              <CloseOutlined style={{ fontSize: "24px", color: "black" }} />
            </Popconfirm>
          </td>
        </tr> : ""

      )}
    </>
  );
};

export default CartDetail;
