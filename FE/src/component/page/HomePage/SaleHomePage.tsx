import React from 'react'
import CurrencyFormatter from '../../../utils/FormatTotal'
import { Link } from 'react-router-dom'
import { ShoppingCartOutlined } from '@ant-design/icons'
import ButtonTym from '../product/ButtonTym'
import { useGetProductSellerQuery } from '../../../api/product'
const SaleHomePage = ({product}:any) => {
    const { data: sale } = useGetProductSellerQuery(product?.sale_id);
    return (
        <>
            <div className="col-lg-3" key={product.product_id}>
                {product.sale_id && sale?.data && (
                    <p
                        className="product_sale_label"
                        style={{ top: "0px", marginLeft: "10px" }}
                    >
                        -
                        {
                            sale.data.find(
                                (item: any) => item.sale_id === product.sale_id
                            ).sale_distcount
                        }
                        %
                    </p>
                )}
                <div className="single_product_item">
                    {
                        /* Thêm kiểm tra product.image để đảm bảo rằng sản phẩm có hình ảnh */
                        product.image && product.image.length > 0 ? (
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
                        )
                    }

                    {/* Hiển thị tên sản phẩm */}
                    <div
                        className="product_name"
                        style={{ marginTop: "20px" }}
                    >
                        <Link
                            style={{ textDecoration: "none" }}
                            to={`/shopProduct/${product.product_id}`}
                        >
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

                    <div
                        className="single_product_text"
                        style={{ marginTop: "-30px", height: "110px" }}
                    >
                        {product.sale_id && sale?.data ? (
                            <div className="price">
                                <h3
                                    className="old-price"
                                    style={{ opacity: "0.5" }}
                                >
                                    {" "}
                                    <CurrencyFormatter
                                        amount={product.product_price}
                                    />
                                </h3>
                                <h3
                                    className="new-price"
                                    style={{ color: "black", fontWeight: "400" }}
                                >
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
                            <h3
                                style={{ textAlign: "center", fontWeight: "400" }}
                            >
                                {" "}
                                <CurrencyFormatter
                                    amount={product?.product_price}
                                />{" "}
                            </h3>
                        )}

                        <a
                            href="#"
                            className="add_cart"
                            style={{ display: "flex", marginTop: "-10px" }}
                        >
                            <div style={{ width: "80%", fontSize: "0.8em" }}>
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
        </>
    )
}

export default SaleHomePage