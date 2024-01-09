import { Carousel, Pagination, Spin } from "antd";
import { Link } from "react-router-dom";
import CurrencyFormatter from "../../../utils/FormatTotal";
import ButtonTym from "../product/ButtonTym";
import { useGetProductSellerQuery } from "../../../api/product";
import { SetStateAction, useState } from "react";
import "../../../component/page/Search/style.css";
import { ShoppingCartOutlined } from "@ant-design/icons";

const Search = ({ data, searchLoading }: any) => {
  const { data: sale } = useGetProductSellerQuery("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data?.data
    ?.filter((product: any) => product.isbblock === false)
    .slice(startIndex, endIndex);

  return (
    <>
      <div id="top"></div>
      <section
        className="breadcrumb breadcrumb_bg"
        style={{ marginTop: "70px", backgroundColor: "#eeee" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="breadcrumb_iner">
                <div className="breadcrumb_iner_item">
                  <h2>Tìm Kiếm Sản Phẩm</h2>
                  <p>
                    Trang chủ <span>-</span> Tìm kiếm sản phẩm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cat_product_area section_padding">
        <div className="container">
          {searchLoading ? (
            <Spin tip="Loading..." size="large">
              <div style={{ minHeight: "300px" }} />
            </Spin>
          ) : (
            <div className="row">
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((product: any, index: any) => (
                  <div className="col-lg-4" key={index}>
                    <div className="single_product_item">
                      <div
                        className="product_slider_img product_sale_overlay"
                        style={{ padding: "10px" }}
                      >
                        {/* Hiển thị sale percentage label */}
                        {product.sale_id && sale?.data && (
                          <p className="product_sale_label" style={{ marginLeft: "10px" }}>
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
                                      src={imageUrl.trim()}
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
                          <a
                            style={{
                              display: "flex",
                              marginTop: "20px",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                            }}
                            href={`/shopProduct/${product?.product_id}`}
                          >
                            <h4>{product?.product_name?.slice(0, 20)}...</h4>
                          </a>
                        </div>
                      </div>

                      <div
                        className="single_product_text"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        {product.sale_id && sale?.data ? (
                          <div className="price">
                            <h3 className="old-price">
                              {" "}
                              <CurrencyFormatter
                                amount={product.product_price}
                              />
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
                                style={{ fontSize: "24px", color: "black", marginTop: "5px" }}
                              />
                            </Link>
                          </div>
                          <ButtonTym data={product} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-lg-12">
                  <p style={{ textAlign: "center", fontSize: "28px", fontFamily: "Tahoma" }}>
                    Không tìm thấy sản phẩm
                  </p>
                </div>
              )}
            </div>
          )}
          <Pagination
            style={{ marginTop: "5px", marginBottom: "20px", width: "95%" }}
            current={currentPage}
            total={data?.data?.length || 0}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
          />
        </div>
      </section>
    </>
  );
};

export default Search;
