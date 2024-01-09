import { Carousel, Pagination, Spin } from "antd";
import { Link } from "react-router-dom";
import CurrencyFormatter from "../../../utils/FormatTotal";
import ButtonTym from "../product/ButtonTym";
import { useGetProductSellerQuery } from "../../../api/product";
import { SetStateAction, useState } from "react";
import useScrollToTopOnMount from "../../../utils/useScrollToTopOnMount";
import { ShoppingCartOutlined } from "@ant-design/icons";

const SearchProduct = ({ dataSearch, searchLoading }: any) => {
  const { data: sale, isError: isErrorSeller } = useGetProductSellerQuery("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = dataSearch?.data
    ?.filter((product: any) => product.isbblock === false)
    .slice(startIndex, endIndex);
  return (
    <>
      <div id="top"></div>
      <div style={{ width: "100%" }}>
        {searchLoading ? ( // Kiểm tra xem isLoading có là true hay không
          <Spin tip="Loading..." size="large">
            <div style={{ minHeight: "300px" }} />
          </Spin>
        ) : (
          <div className="row">
            {paginatedData?.map((product: any, index: any) => (
              <div className="col-lg-4" key={index}>
                <div className="single_product_item">
                  <div
                    className="product_slider_img product_sale_overlay"
                    style={{ padding: "10px" }}
                  >
                    {/* Hiển thị sale percentage label */}
                    {product.sale_id && sale?.data && (
                      <p className="product_sale_label">
                        -
                        {
                          sale.data.find(
                            (item: any) => item.sale_id === product.sale_id
                          )?.sale_distcount
                        }
                        %
                      </p>
                    )}
                    {product.image && product.image.length > 0 ? (
                      <div className="product_image_container">
                        <Carousel>
                          {product.image[0]
                            .split(",")
                            .map((imageUrl: any, index: any) => (
                              <div key={index}>
                                <img
                                  src={imageUrl.trim()} // Cắt bỏ khoảng trắng ở đầu và cuối đường dẫn (trim)
                                  className="product_image"
                                  alt={`Product Image ${index}`}
                                />
                              </div>
                            ))}
                        </Carousel>
                      </div>
                    ) : (
                      <div className="product_image_fk">
                        <img
                          src="./Front_End_DATN/null.png"
                          alt="No Image Available"
                        />
                      </div>
                    )}

                    {/* Hiển thị tên sản phẩm */}
                    <div className="product_name">
                      <Link to={`/shopProduct/${product?.product_id}`}>
                        <h4>{product?.product_name?.slice(0, 20)}...</h4>
                      </Link>
                    </div>
                  </div>

                  <div className="single_product_text">
                    {product.sale_id && sale?.data ? (
                      <div className="price">
                        <h3 className="old-price">
                          {" "}
                          <CurrencyFormatter amount={product.product_price} />
                        </h3>
                        <h3 className="new-price">
                          <CurrencyFormatter
                            amount={(
                              parseFloat(product.product_price) *
                              (1 -
                                parseFloat(
                                  sale.data.find(
                                    (item: any) =>
                                      item.sale_id === product.sale_id
                                  )?.sale_distcount
                                ) /
                                100)
                            ).toFixed(2)}
                          />
                        </h3>
                      </div>
                    ) : (
                      <h3>
                        {" "}
                        <CurrencyFormatter amount={product.product_price} />
                      </h3>
                    )}
                    {/* <ButtonTym data={product} /> */}

                    <a
                      href="#"
                      className="add_cart"
                      style={{ display: "flex", marginTop: "-10px" }}
                    >
                      <div
                        style={{
                          width: "80%",
                          fontSize: "0.8em",
                          marginRight: "130px",
                        }}
                      >
                        <Link to={`/shopProduct/${product.product_id}`}>
                          <ShoppingCartOutlined
                            className="black-shopping-cart-icon"
                            style={{ fontSize: "24px", color: "black" }}
                          />
                        </Link>
                      </div>
                      <ButtonTym data={product} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          style={{ marginTop: "5px", marginBottom: "20px", width: "95%" }}
          current={currentPage}
          total={dataSearch?.data?.length || 0}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default SearchProduct;
