import React, { useEffect, useState } from "react";
import {
    useGetAllOutstanQuery,
    useGetAllSaleQuery,
    useGetOneProductQuery,
    useGetProductSellerQuery,
    useGetProductsNoBlockQuery,
} from "../../../api/product";
import { Spin, Pagination, Carousel } from "antd";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import {
    useAddFavoriteProductMutation,
    useGetFavoriteWithUserQuery,
} from "../../../api/favorite_product";
import ButtonTym from "../product/ButtonTym";
import CurrencyFormatter from "../../../utils/FormatTotal";
import useScrollToTopOnMount from "../../../utils/useScrollToTopOnMount";
import { useGetSaleQuery } from "../../../api/sale";

const DataProductOutstan = ({
    selectedCategory,
    selectedColor,
    selectedSize,
    minPrice,
    maxPrice,
    productsort,
}: any) => {
    const { data: products, isError, isLoading } = useGetAllOutstanQuery("");
    const productsData = productsort || products;
    // const { data: sale, isError: isErrorSeller } = useGetProductSellerQuery("");
    const { data: allSales } = useGetSaleQuery("");

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
    useEffect(() => {
        if (isError) {
            console.log("sale: ", products);

            console.error("Error fetching products");
        }
        if (isError) {
            console.error("Error fetching sale");
        }
    }, [isError]);

    const filteredProducts = productsData?.data?.filter((product: any) => {
        const isNotBlocked = !product.isbblock;

        if (isNotBlocked) {
            if (minPrice && maxPrice) {
                const productPrice = parseFloat(product.product_price);
                return (
                    productPrice >= parseFloat(minPrice) &&
                    productPrice <= parseFloat(maxPrice)
                );
            }

            if (selectedCategory && selectedColor && selectedSize) {
                return (
                    product.category_id === selectedCategory &&
                    product.color_id.includes(selectedColor)
                );
            } else if (selectedCategory) {
                return product.category_id === selectedCategory;
            } else if (selectedColor) {
                return product.color_id.includes(selectedColor);
            } else if (selectedSize) {
                return product.size_id.includes(selectedSize);
            } else {
                return true;
            }
        }

        return false;
    });

    const totalProducts = productsData?.data?.length;
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, totalProducts);
    const currentProducts = filteredProducts?.slice(startIndex, endIndex);

    const onPageChange = async (page: any) => {
        setCurrentPage(page);
    };

    useScrollToTopOnMount(currentPage);

    return (
        <div>
            <div id="top"></div>
            <div style={{ width: "100%" }}>
                {isLoading ? (
                    <Spin tip="Loading..." size="large">
                        <div style={{ minHeight: "300px" }} />
                    </Spin>
                ) : (
                    <div className="row">
                        {currentProducts?.map((product: any, index: any) => (
                            <div className="col-lg-4" key={index}>
                                <div className="single_product_item">
                                    <div
                                        className="product_slider_img product_sale_overlay"
                                        style={{ padding: "10px" }}
                                    >
                                        {product.sale_id && allSales?.data && (
                                            <p className="product_sale_label">
                                                -{allSales.data.find((item: any) => item.sale_id === product.sale_id).sale_distcount}%
                                            </p>
                                        )}
                                        {product.image && product.image.length > 0 ? (
                                            <div className="product_image_container">
                                                <img
                                                    src={product.image[0].split(",")[0].trim()}
                                                    className="product_image"
                                                    alt={`Product Image`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="product_image_fk">
                                                <img
                                                    src="./Front_End_DATN/null.png"
                                                    alt="No Image Available"
                                                />
                                            </div>
                                        )}

                                        <div className="product_name">
                                            <Link to={`/shopProduct/${product?.product_id}`}>
                                                <h4
                                                    style={{
                                                        fontSize: "20px",
                                                        color: "black",
                                                        textAlign: "center",
                                                        fontFamily: "Tahoma",
                                                    }}
                                                >
                                                    {product?.product_name?.slice(0, 20)}...
                                                </h4>
                                            </Link>
                                        </div>
                                    </div>
                                    <div
                                        className="single_product_text"
                                        style={{ marginTop: "-30px", height: "110px" }}
                                    >
                                        {product.sale_id && allSales?.data ? (
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
                                                                    allSales.data.find(
                                                                        (item: any) =>
                                                                            item.sale_id === product.sale_id
                                                                    ).sale_distcount
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

                {totalProducts > productsPerPage && (
                    <div className="pagination">
                        <Spin spinning={isLoading} size="large">
                            <Pagination
                                current={currentPage}
                                pageSize={productsPerPage}
                                total={totalProducts}
                                onChange={onPageChange}
                            />
                        </Spin>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataProductOutstan;
