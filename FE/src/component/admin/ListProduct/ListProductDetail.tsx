import { Button, Popconfirm, message } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import SizeComponent from "./SizeProduct";
import ColorProduct from "./ColorProduct";
import CategoryProduct from "./CategoryProduct";
import {
  useCancellHideProductMutation,
  useGetProductsQuery,
  useHideProductMutation,
} from "../../../api/product"; // Thay thế import với mutation ẩn sản phẩm
import "./price.css";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { useAddActionMutation } from "../../../api/actions";

const ListProductDetail = ({ data }: any) => {
  const user = JSON.parse(localStorage.getItem("user")!);

  const imageArray = data?.image[0]?.split(",");
  const [isHidden, setIsHidden] = useState(data.isbblock);

  const [cancelHideProduct, { isLoading: isCancellingHide }] =
    useCancellHideProductMutation();
  const [hideProduct, { isLoading: isHiding }] = useHideProductMutation();
  const { data: products } = useGetProductsQuery("");
  const product = products?.data.find(
    (product: any) => product.product_id === data.product_id
  );
  const isBlock = product?.isbblock === true;
  const [messageApi, contextHolder] = message.useMessage();
  const [addAction] = useAddActionMutation();

  const handleToggleHide = () => {
    const productId = data?.product_id;
    const token = user?.accessToken;
    const oldProductName = data?.product_name;
    if (!productId || !token) {
      console.error("product_id hoặc accessToken không hợp lệ.");
      return;
    }

    if (isCancellingHide || isHiding) {
      return;
    }

    if (isHidden) {
      cancelHideProduct({ id: productId, token: token })
        .unwrap()
        .then(() => {
          setIsHidden(false);
          const actionData = {
            user_id: user?.user?.id,
            action: "Bỏ ẩn sản phẩm",
            old_data: null,
            new_data: oldProductName,
          };
          addAction(actionData);
          messageApi.open({
            type: "success",
            content: "Đã bỏ ẩn sản phẩm này!",
          });
        })
        .catch((error) => {
          messageApi.error("Bỏ ẩn sản phẩm không thành công: " + error.message);
        });
    } else {
      hideProduct({ id: productId, token: token })
        .unwrap()
        .then(() => {
          setIsHidden(true);
          const actionData = {
            user_id: user?.user?.id,
            action: "Ẩn sản phẩm",
            old_data: oldProductName,
            new_data: null,
          };
          addAction(actionData);
          messageApi.open({
            type: "success",
            content: "Đã ẩn sản phẩm này!",
          });
        })
        .catch((error) => {
          messageApi.error("Ẩn sản phẩm không thành công: " + error.message);
        });
    }
  };

  return (
    <>
      {contextHolder}
      <tr>
        <td style={{ width: "20%" }}>
          <strong>{data?.product_name?.slice(0, 25)}...</strong>
        </td>

        <td className="product-price">
          <CurrencyFormatter amount={data?.product_price} />
        </td>
        <td>
          <CategoryProduct data={data} />
        </td>
        <td>
          <img src={imageArray[0]} alt="Avatar" width={"100%"} />
        </td>
        <td>
          {data?.color_id?.map((item: any) => (
            <ColorProduct data={item} />
          ))}
        </td>
        <td>
          {data?.size_id?.map((item: any) => (
            <SizeComponent data={item} />
          ))}
        </td>
        <td>
          <strong>{data?.kho}</strong>
        </td>

        <td>
          <Link to={`/admin/product/${data?.product_id}/update`}>
            <button
              type="button"
              className="btn btn-outline-success"
              style={{ fontSize: "12px" }}
            >
              Sửa
            </button>
          </Link>
          <span> </span>
          {isBlock ? (
            <Button
              className="btn btn-outline-success"
              style={{ fontSize: "12px" }}
              onClick={handleToggleHide}
            >
              Bỏ ẩn
            </Button>
          ) : (
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có chắc chắn muốn xóa sản phẩm này?"
              okText="Có"
              cancelText="Không"
              onConfirm={handleToggleHide}
            >
              <Button
                className="btn btn-outline-danger"
                style={{ fontSize: "12px" }}
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </td>
      </tr>
    </>
  );
};

export default ListProductDetail;
