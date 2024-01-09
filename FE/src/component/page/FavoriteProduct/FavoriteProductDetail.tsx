import { HeartOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useGetOneProductQuery } from "../../../api/product";
import { Spin, message } from "antd";
import {
  useDeleteFavoriteProductMutation,
  useGetFavoriteWithUserQuery,
} from "../../../api/favorite_product";
import { Link } from "react-router-dom";
import product from "../product/product";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { AiFillHeart } from "react-icons/ai";
type Props = {};

const FavoriteProductDetail = ({ data }: any) => {
  // const favorite_product_id = data?.favorite_product_id;
  const { data: getOneProduct } = useGetOneProductQuery(data?.product_id);
  const [deleteProduct] = useDeleteFavoriteProductMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const onHandleDeleteFavoriteProduct = () => {
    // console.log(favorite_product_id);
    const productID = getOneProduct?.data[0]?.product_id;
    deleteProduct(productID)
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Xóa thành công",
        });
      });
    // Xóa trạng thái yêu thích của sản phẩm trong localStorage
    localStorage.removeItem(`favorite_${data.product_id}`);
  };
  const imageArray =
    getOneProduct?.data && getOneProduct.data.length > 0
      ? getOneProduct.data[0].image[0].split(",")
      : [];

  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);
  const [expanded, setExpanded] = useState(false);
  const handleReset = () => {
    setExpanded(false);
  };
  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <div className="col-md-12">
          <div className="card shadow-0 border rounded-3">
            <div className="card-body">
              <div className="row g-0">
                <div className="col-xl-3 col-md-4 d-flex justify-content-center">
                  <div className="bg-image hover-zoom ripple rounded ripple-surface me-md-3 mb-3 mb-md-0">
                    <img src={imageArray[0]} className="w-100" />
                    <a href="#!">
                      <div className="hover-overlay">
                        <div
                          className="mask"
                          style={{
                            backgroundColor: "rgba(253, 253, 253, 0.15)",
                          }}
                        ></div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="col-xl-6 col-md-5 col-sm-7">
                  <h5>{getOneProduct?.data[0]?.product_name}</h5>

                  <p style={{ marginTop: "20px", width: "90%" }}>
                    {expanded
                      ? getOneProduct?.data[0]?.product_description
                      : getOneProduct?.data[0]?.product_description.slice(
                          0,
                          150
                        )}
                    {!expanded &&
                      getOneProduct?.data[0]?.product_description.length >
                        200 && (
                        <span
                          onClick={toggleExpansion}
                          style={{ color: "blue", cursor: "pointer" }}
                        >
                          Xem thêm
                        </span>
                      )}
                    {expanded && (
                      <span
                        onClick={handleReset}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        Thu gọn
                      </span>
                    )}
                  </p>
                </div>
                <div className="col-xl-3 col-md-3 col-sm-5">
                  <div className="d-flex flex-row align-items-center mb-1">
                    <h4 className="mb-1 me-1">
                      <CurrencyFormatter
                        amount={getOneProduct?.data[0]?.product_price}
                      />
                    </h4>
                    {/* <span className="text-danger">
                          <s>$49.99</s>
                        </span> */}
                  </div>
                  {/* <h6 className="text-success">Free shipping</h6> */}
                  <div className="mt-4">
                    <Link to={`/shopProduct/${data?.product_id}`}>
                      <button
                        className="btn btn-primary shadow-0"
                        type="button"
                        style={{ marginRight: "10px" }}
                      >
                        Mua Ngay
                      </button>
                    </Link>
                    <a href="#" className=" btn ">
                      {contextHolder}
                      <AiFillHeart
                        onClick={onHandleDeleteFavoriteProduct}
                        style={{ fontSize: "30px", color: "red" }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FavoriteProductDetail;
