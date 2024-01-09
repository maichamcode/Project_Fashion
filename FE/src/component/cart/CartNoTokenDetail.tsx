import React, { useEffect, useState } from "react";
import { useGetOneProductBlockQuery, useGetOneProductQuery } from "../../api/product";
import { Input, Skeleton, message } from "antd";
import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useGetOneSizeQuery, useGetSizeQuery } from "../../api/size";
import { useGetColorQuery, useGetOneColorQuery } from "../../api/color";
import { useGetSaleQuery } from "../../api/sale";
import CurrencyFormatter from "../../utils/FormatTotal";
import { Link } from "react-router-dom";

const CartNoTokenDetail = ({ data, onTotal }: any) => {
  console.log(data);

  const { data: productData, isLoading } = useGetOneProductBlockQuery(
    data?.product_id
  );
  console.log(productData);

  const imageArray = productData?.data[0]?.image[0]?.split(",");
  const { data: sizeData } = useGetOneSizeQuery(data?.productSize);
  const { data: colorData } = useGetOneColorQuery(data?.productColor);
  //
  const { data: sale } = useGetSaleQuery("");
  console.log(sale);
  const saleName = sale?.data?.find(
    (id: any) => id?.sale_id == productData?.data[0]?.sale_id
  )?.sale_distcount;
  console.log(saleName);
  const totalSale = (productData?.data[0]?.product_price * saleName) / 100;
  const totalSales = productData?.data[0]?.product_price - totalSale;
  console.log(totalSales);

  const [quantity, setQuantity] = useState(data?.quantity);
  const [total, setTotal] = useState(
    data?.quantity * productData?.data[0]?.product_price
  );
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const existingProductIndex = cartItems.findIndex(
    (item: any) =>
      item.product_id == parseInt(data?.product_id) &&
      item?.productSize == data?.productSize &&
      item?.productColor == data?.productColor
  );
  const quantitys = Number(quantity) - Number(data?.quantity);
  console.log(quantitys);
  useEffect(() => {
    cartItems[existingProductIndex].quantity += Number(quantitys);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [quantitys]);
  const productPrice = productData?.data[0]?.product_price; // Giá gốc
  const finalProductPrice = saleName
    ? (productPrice * (100 - saleName)) / 100 // Áp dụng giảm giá
    : productPrice; // Sử dụng giá gốc nếu không có giảm giá

  useEffect(() => {
    const newTotal = quantity * finalProductPrice;
    setTotal(newTotal);
    onTotal(newTotal); // Gửi tổng tiền của sản phẩm đến component cha
  }, [quantity, productData, onTotal]);
  const [messageApi, contextHolder] = message.useMessage();
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    if (newQuantity > productData?.data[0]?.kho) {
      messageApi.open({
        type: "error",
        content: "Bạn không thể tăng số lượng khi trong kho không đủ!",
      });
    } else {
      setQuantity(newQuantity);
    }

  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Lấy mã ASCII của ký tự được nhập
    const charCode = e.charCode;

    // Kiểm tra xem ký tự có phải là số (0-9) hoặc các phím quản lý khác
    const isDigit = charCode >= 48 && charCode <= 57;
    const isControlKey = e.ctrlKey || e.altKey || e.metaKey;
    const isAllowedSpecialKey = [8].includes(charCode); // Chỉ cho phép Backspace

    // Kiểm tra xem ký tự có phải là dấu cộng hoặc dấu trừ không
    const isNotAllowedChar = [43, 45].includes(charCode); // Phím '+', '-'

    if (!isDigit && !isControlKey && !isAllowedSpecialKey && isNotAllowedChar) {
      e.preventDefault(); // Ngăn chặn ký tự không hợp lệ
    }
  };
  const handleRemoveFromCart = (productToRemove: any) => {
    // Lấy danh sách sản phẩm đã lưu trong local storage
    const existingCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    // Loại bỏ sản phẩm cùng product_id nhưng khác size và color
    const updatedCart = existingCart.filter((item: any) => {
      return (
        item.product_id !== productToRemove.product_id ||
        (item.product_id === productToRemove.product_id &&
          (item.productSize !== productToRemove.productSize ||
            item.productColor !== productToRemove.productColor))
      );
    });

    // Lưu danh sách sản phẩm đã cập nhật vào local storage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    // Cập nhật tổng tiền ở component cha
    onTotal(0);
    window.location.reload(); // Làm mới trang
  };

  return (
    <>
      {contextHolder}
      {isLoading ? (
        <Skeleton />
      ) : (
        productData?.data[0] ? <tr>
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
                  to={`/shopProduct/${productData?.data[0]?.product_id}`}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  {productData?.data[0]?.product_name}
                </Link>
              </p>
              <p>size: {sizeData?.data[0]?.size_name}</p>
              <p>color: {colorData?.data[0]?.color_name}</p>
            </div>
          </div>
          <td>
            {totalSales ? (
              <div style={{ display: "flex" }}>
                <h5
                  style={{
                    marginRight: "10px",
                    color: "#888",
                    textDecoration: "line-through",
                  }}
                >
                  <CurrencyFormatter
                    amount={productData?.data[0]?.product_price}
                  />
                </h5>
                <h5 style={{ color: "red" }}>
                  <CurrencyFormatter amount={total} />
                </h5>
              </div>
            ) : (
              <h5>
                <CurrencyFormatter
                  amount={productData?.data[0]?.product_price}
                />
              </h5>
            )}
          </td>
          <td>
            <div className="product_count">
              <Input
                type="number"
                defaultValue={data?.quantity}
                min="1"
                // onKeyDown={(e) => e.preventDefault()}
                onKeyPress={handleKeyPress}
                onChange={handleQuantityChange}
              />
            </div>
          </td>
          <td>
            <CurrencyFormatter amount={total} />
          </td>
          <td className="cart__close" style={{ textAlign: "center" }}>
            <CloseOutlined
              onClick={() =>
                handleRemoveFromCart({
                  product_id: data.product_id,
                  productSize: data.productSize,
                  productColor: data.productColor,
                })
              }
              style={{ fontSize: "24px", color: "black" }}
            />
          </td>
        </tr> : ""

      )}
    </>
  );
};

export default CartNoTokenDetail;
