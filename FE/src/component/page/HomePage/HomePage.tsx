import React, { useEffect, useRef, useState } from "react";
import { Button, Carousel, Form, Spin, message } from "antd";
import "./home.css";
import {
  useGet8NewProductsQuery,
  useGetOneProductQuery,
  useGetOutstanQuery,
  useGetProductSellerQuery,
  useGetProductsNoBlock1Query,
  useGetProductsNoBlockQuery,
} from "../../../api/product";
import "../../../layout/ClientLayOut/css/all.css";

import { Link, useNavigate, useParams } from "react-router-dom";
import "../../page/UpdateProfile/UpdateProfile.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import ButtonTym from "../product/ButtonTym";
import useScrollToTopOnMount from "../../../utils/useScrollToTopOnMount";
import { useGetSearchOrderMutation } from "../../../api/order";
import { useGetFlashSaleQuery, useGetSaleQuery } from "../../../api/sale";
import { pause } from "../../../utils/pause";
import SaleHomePage from "./SaleHomePage";

const HomePage = ({ onSearchs }: any) => {
  const [searchOrder, setSearchOrder] = useState(null);
  const [OrderId, setOrderId] = useState();
  const [form] = Form.useForm();
  const [getSearch] = useGetSearchOrderMutation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const HandleSearchOrder = (e: any) => {
    e.preventDefault();
    if (OrderId == "") {
      setSearchOrder(null);
    } else if (OrderId) {
      const nameData = {
        order_id: OrderId,
      };
      getSearch(nameData)
        .unwrap()
        .then((data: any) => {
          setSearchOrder(data);
          navigate(`/order/${OrderId}/searchorder`);
          onSearchs(data);
        })
        .catch((error: any) => {
          console.log(error);
          messageApi.open({
            type: "error",
            content: error?.data?.message,
          });
        });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000);
    }
  };
  const { data: productnoblock } = useGetProductsNoBlock1Query("");
  const { data: productnoblocks } = useGetProductsNoBlockQuery("");
  const { data: products, isError: isErrorOutstanding } =
    useGetOutstanQuery("");

  const id = useParams();
  const { data: getOneProduct } = useGetOneProductQuery(id);
  // console.log(getOneProduct);

  const { data: sale, isError: isErrorSeller } = useGetProductSellerQuery("");

  const { data: newProducts, isError: isErrorNew } =
    useGet8NewProductsQuery("");
  const [expanded, setExpanded] = useState(false);
  const handleReset = () => {
    setExpanded(false);
  };
  useScrollToTopOnMount(products);
  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  // Sử dụng useState để theo dõi trạng thái loading của newProducts
  const [isLoadingNewProducts, setIsLoadingNewProducts] = useState(true);

  const carouselRef = useRef<any>(null);

  const nextSlide = () => {
    carouselRef.current?.next();
  };

  const prevSlide = () => {
    carouselRef.current?.prev();
  };
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllProductsSale, setShowAllProductsSale] = useState(false);
  const [showAllProductsOutstan, setShowAllProductsOutstan] = useState(false);
  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };
  const handleSale = () => {
    setShowAllProductsSale(!showAllProductsSale);
  };
  const handleOutStan = () => {
    setShowAllProductsOutstan(!showAllProductsOutstan);
  };

  useEffect(() => {
    console.log("Sale data:", sale);

    if (isErrorOutstanding) {
      console.error("Error fetching outstanding products");
    }
    if (isErrorSeller) {
      console.error("Error fetching seller products");
    }
  }, [isErrorOutstanding, isErrorSeller]);

  // Trong useEffect riêng cho newProducts, cài đặt setIsLoadingNewProducts khi dữ liệu đã tải xong
  useEffect(() => {
    if (!isErrorNew && newProducts) {
      setIsLoadingNewProducts(false);
    }
  }, [isErrorNew, newProducts]);
  const { data: flashsale } = useGetFlashSaleQuery("");
  console.log(flashsale);

  const [isFlipped, setIsFlipped] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const endflashsales = flashsale?.data?.find(
    (data: any) => data?.status == false
  )?.end_time;
  const [countdown, setCountdown] = useState<any>({});
  const [flipped, setFlipped] = useState(false);
  const [isseconds, setisseconds] = useState(false);
  const [isminutes, setminutes] = useState(false);
  const [ishours, sethours] = useState(false);
  const [isdays, setdays] = useState(false);
  const [timeUntilEnds, settimeUntilEnds] = useState<any>();
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (flashsale?.data && flashsale.data.length > 0) {
        const now: any = new Date();
        const end: any = new Date(
          `${new Date().getFullYear()}-${flashsale?.data[0]?.end_time}:00`
        );
        const timeUntilEnd = end - now;
        settimeUntilEnds(timeUntilEnd);
        if (now < end) {
          setTimeRemaining(formatTimeDuration(timeUntilEnd));
          setIsFlipped(!isFlipped);
        }
      }
    };

    const timerInterval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [flashsale, isFlipped]);
  useEffect(() => {
    const setuptime = () => {
      const now: any = new Date();
      const end: any = new Date(
        `${new Date().getFullYear()}-${flashsale?.data[0]?.end_time}:00`
      );
      const timeUntilEnd = end - now;
      const days = Math.floor(timeUntilEnd / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeUntilEnd % (1000 * 60)) / 1000);
      console.log(countdown?.minutes, minutes);
      if (days <= 0 && seconds <= 0 && hours <= 0 && minutes <= 0) {
        messageApi.open({
          type: "success",
          content: "Flash Sale đã kết thúc",
        });
        window.location.href = "/";
        return;
      }
      if (countdown?.seconds != seconds) {
        setisseconds(true);
      } else {
        setisseconds(false);
      }
      if (countdown?.minutes != minutes) {
        setminutes(true);
      } else {
        setminutes(false);
      }
      if (countdown?.hours != hours) {
        sethours(true);
      } else {
        sethours(false);
      }
      if (countdown?.days != days) {
        setdays(true);
      } else {
        setdays(false);
      }
    };
    const flipInterval = setInterval(() => {
      setuptime();
    }, 1000);
    return () => {
      clearInterval(flipInterval);
    };
  }, [countdown]);
  const formatTimeDuration = (duration: number) => {
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    setCountdown({ days, hours, minutes, seconds });
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };
  const [timeRemainingstart, setTimeRemainingstart] = useState<string | null>(
    null
  );
  const startflashsales = flashsale?.data?.find(
    (data: any) => data?.status == false
  )?.start_time;
  const [timestarts, settimestarts] = useState<any>({});
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (flashsale?.data && flashsale.data.length > 0) {
        const now: any = new Date();
        const start: any = new Date(
          `${new Date().getFullYear()}-${startflashsales}:00`
        );
        const timeUntilEnd = start - now;
        setTimeRemainingstart(formatTimeDurationstart(timeUntilEnd));
        setIsFlipped(!isFlipped);
        console.log(timeUntilEnd);
      }
    };
    const timerInterval = setInterval(() => {
      calculateTimeRemaining();
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [flashsale, isFlipped]);

  const formatTimeDurationstart = (duration: number) => {
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    settimestarts({ days, hours, minutes, seconds });
    if (days <= 0 && seconds <= 0 && hours <= 0 && minutes <= 0) {
      messageApi.open({
        type: "success",
        content: "Flash Sale đã bắt đầu",
      });
      window.location.href = "/";
    }
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const startflashsale = flashsale?.data?.find(
    (data: any) => data?.status == false
  );
  const endflashsale = flashsale?.data?.find(
    (data: any) => data?.status == true
  );
  console.log(isminutes);

  return (
    <>
      <section className="" style={{ marginTop: "-4%" }}>
        <div className="">
          <div className="row align-items-center">
            <div className="">
              <Carousel ref={carouselRef} autoplay>
                <div className="single_banner_slider">
                  <div className="banner_image">
                    <img
                      src="https://res.cloudinary.com/due9gb9nq/image/upload/v1698914932/1-compressed-compressed_vizoti.jpg"
                      alt=""
                      style={{ height: "88%", marginTop: "80px" }}
                    />
                  </div>
                </div>
                <div className="single_banner_slider">
                  <div className="banner_image">
                    <img
                      src="https://res.cloudinary.com/due9gb9nq/image/upload/v1698914930/2-compressed-compressed_xoilbl.jpg"
                      alt=""
                      style={{ height: "88%", marginTop: "80px" }}
                    />
                  </div>
                </div>

                <div className="single_banner_slider_1">
                  <div className="banner_image">
                    <img
                      src="https://res.cloudinary.com/due9gb9nq/image/upload/v1698914931/3-compressed-compressed_il6xiw.jpg"
                      alt=""
                      style={{ height: "88%", marginTop: "80px" }}
                    />
                  </div>
                </div>

                <div className="single_banner_slider_2">
                  <div className="banner_image">
                    <img
                      src="https://res.cloudinary.com/due9gb9nq/image/upload/v1698914933/4-compressed-compressed_ronddl.jpg"
                      alt=""
                      style={{ height: "88%", marginTop: "80px" }}
                    />
                  </div>
                </div>

                <div className="single_banner_slider_3">
                  <div className="banner_image">
                    <img
                      src="https://res.cloudinary.com/dw6wgytc3/image/upload/v1703006889/z4990812848477_109e79adfeb3ff45ca39483f7a73d5ae_yyrfez.jpg"
                      alt=""
                      style={{ height: "88%", marginTop: "80px" }}
                    />
                  </div>
                </div>
              </Carousel>
              <Button
                onClick={prevSlide}
                icon={<IoIosArrowBack />}
                className="carousel-button prev"
              />
              <Button
                onClick={nextSlide}
                icon={<IoIosArrowForward />}
                className="carousel-button next"
              />
            </div>
          </div>
        </div>
      </section>
      {/* flash sale */}
      {flashsale?.data?.length > 0 && startflashsale && !endflashsale ? (
        <>
          <div
            style={{ textAlign: "center", paddingTop: 100, paddingBottom: 20 }}
          >
            <h2>Flash Sale</h2>
          </div>
          <div className="single_banner_slider_3">
            <div style={{ textAlign: "center" }}>
              <div
                className="flip-card-front"
                style={{
                  position: "absolute",
                  top: "1120px",
                  left: "40%",
                  display: "flex",
                }}
              >
                <h3 style={{ color: "white", padding: "0 40px" }}>
                  {timestarts?.days ? timestarts?.days : 0}d
                </h3>
                <h3 style={{ color: "white", padding: "0 10px" }}>
                  {timestarts?.hours ? timestarts?.hours : 0}h
                </h3>
                <h3 style={{ color: "white", padding: "0 40px" }}>
                  {timestarts?.minutes ? timestarts?.minutes : 0}m
                </h3>
                <h3 style={{ color: "white", padding: "0 10px" }}>
                  {timestarts?.seconds ? timestarts?.seconds : 0}s
                </h3>
              </div>
              <img
                src="https://res.cloudinary.com/dw6wgytc3/image/upload/v1701538661/Grey_Simple_Fashion_Collection_Email_Header_fzkyt6.png"
                alt=""
                style={{ height: "60%", width: "95%" }}
              />
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {flashsale?.data?.length > 0 && endflashsale ? (
        <section
          className="feature_part padding_top"
          style={{ marginTop: "-50px" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="section_tittle">
                  <h2>Flash Sale</h2>
                  <div
                    className={`flip-card `}
                    style={{ textAlign: "center", margin: "0 auto" }}
                  >
                    <div className="flip-card-inners">
                      <div
                        className={`flip-card-front `}
                        style={{ width: "100%" }}
                      >
                        <div className={`countdown-container`}>
                          <div className={`countdown-item flipped`}>
                            <div
                              className={`countdown-item-inner  ${isdays ? "flippeds1" : ""
                                }`}
                              style={{ position: "absolute", zIndex: 1 }}
                            ></div>
                            <span
                              style={{
                                color: "white",
                                position: "relative",
                                zIndex: 2,
                              }}
                            >
                              {countdown?.days}d
                            </span>
                          </div>
                          <div className={`countdown-item flipped`}>
                            <div
                              className={`countdown-item-inner  ${ishours ? "flippeds1" : ""
                                }`}
                              style={{ position: "absolute", zIndex: 1 }}
                            ></div>
                            <span
                              style={{
                                color: "white",
                                position: "relative",
                                zIndex: 2,
                              }}
                            >
                              {countdown?.hours}h
                            </span>
                          </div>
                          <div className={`countdown-item flipped`}>
                            <div
                              className={`countdown-item-inner  ${isminutes ? "flippeds1" : ""
                                }`}
                              style={{ position: "absolute", zIndex: 1 }}
                            ></div>
                            <span
                              style={{
                                color: "white",
                                position: "relative",
                                zIndex: 2,
                              }}
                            >
                              {countdown?.minutes}m
                            </span>
                          </div>

                          <div className={`countdown-item flipped`}>
                            <div
                              className={`countdown-item-inner  ${isseconds ? "flippeds" : ""
                                }`}
                              style={{ position: "absolute", zIndex: 1 }}
                            ></div>
                            <span
                              style={{
                                color: "white",
                                position: "relative",
                                zIndex: 2,
                              }}
                            >
                              {countdown?.seconds}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {isLoadingNewProducts ? (
              <Spin tip="Loading..." size="large">
                <div style={{ minHeight: "300px" }} />
              </Spin>
            ) : (
              <div className="row align-items-center latest_product_inner">
                {sale?.data?.slice(0, showAllProducts ? sale.data.length : 4) &&
                  productnoblock?.data
                    .filter((product: { sale_id: any }) => !!product.sale_id)
                    .map((product: any) => {
                      const saleItem = sale?.data.find(
                        (item: any) => item.sale_id === product.sale_id
                      );
                      const saleDiscount = saleItem
                        ? saleItem.sale_distcount
                        : null;
                      const imageArray = product?.image[0]?.split(",");

                      const discountedPrice = saleDiscount
                        ? (
                          parseFloat(product.product_price) *
                          (1 - parseFloat(saleDiscount) / 100)
                        ).toFixed(2)
                        : product.product_price;

                      return (
                        <div className="col-lg-3" key={product.product_id}>
                          <p
                            className="product_sale_label"
                            style={{ top: "0px" }}
                          >
                            -
                            {
                              sale.data.find(
                                (item: any) => item.sale_id === product.sale_id
                              )?.sale_distcount
                            }
                            %
                          </p>
                          <div className="single_product_item">
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
                                    <CurrencyFormatter
                                      amount={product.product_price}
                                    />
                                  </h3>
                                  <h3
                                    className="new-price"
                                    style={{
                                      color: "black",
                                      fontWeight: "400",
                                    }}
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
                                  style={{
                                    textAlign: "center",
                                    fontWeight: "400",
                                  }}
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
                                <div
                                  style={{ width: "80%", fontSize: "0.8em" }}
                                >
                                  <Link
                                    to={`/shopProduct/${product.product_id}`}
                                  >
                                    <ShoppingCartOutlined
                                      className="black-shopping-cart-icon"
                                      style={{
                                        fontSize: "24px",
                                        color: "black",
                                      }}
                                    />
                                  </Link>
                                </div>
                                <ButtonTym data={product} />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                <div
                  className="col-lg-12 text-center"
                  style={{ marginTop: "20px" }}
                >
                  <button
                    className="custom-button"
                    onClick={toggleShowAllProducts}
                  >
                    <Link to='allsale' style={{ textDecoration: 'none', color: 'white' }}> Xem thêm
                    </Link>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : (
        ""
      )}
      <section
        className="feature_part padding_top"
        style={{ marginTop: "-50px" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section_tittle">
                <h2>SẢN PHẨM MỚI</h2>
              </div>
            </div>
          </div>
          {isLoadingNewProducts ? (
            <Spin tip="Loading..." size="large">
              <div style={{ minHeight: "300px" }} />
            </Spin>
          ) : (
            <div className="row align-items-center latest_product_inner">
              {newProducts?.data
                ?.filter((product: any) => !product.isbblock)
                ?.slice(0, showAllProducts ? newProducts.data.length : 4)
                .map((product: any, index: any) => (
                  <div className="col-lg-3" key={index}>
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
                        {/* Hiển thị giá và nút "Thêm vào giỏ hàng" */}
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
                ))}
              {newProducts?.data?.length > 4 && (
                <div
                  className="col-lg-12 text-center"
                  style={{ marginTop: "20px" }}
                >
                  <button
                    className="custom-button"
                    onClick={toggleShowAllProducts}
                  >
                    {showAllProducts ? "Thu gọn" : "Xem thêm"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section
        className="product_list section_padding"
        style={{ marginTop: "-80px" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section_tittle text-center">
                <h2>SẢN PHẨM NỔI BẬT</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center latest_product_inner ">
            {products?.data
              ?.filter((product: any) => !product.isbblock)
              ?.slice(0, showAllProductsOutstan ? products.data.length : 4)
              .map((product: any) => {
                const imageArray = product?.image[0]?.split(",");
                return (
                  <div className="col-lg-3" key={product.product_id}>
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
                        {/* Hiển thị giá và nút "Thêm vào giỏ hàng" */}
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
                );
              })}
            {products?.data?.length > 4 && (
              <div
                className="col-lg-12 text-center"
                style={{ marginTop: "20px" }}
              >
                <button
                  className="custom-button"
                  onClick={handleOutStan}
                >
                  {showAllProductsOutstan ? "Thu gọn" : "Xem thêm"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {contextHolder}
      <Form
        form={form}
        onFinish={HandleSearchOrder}
        style={{ marginTop: "-5px" }}
      >
        <section className="our_offer section_padding">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-lg-6 col-md-6">
                <div className="offer_img">
                  <img src="" alt="" />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="offer_text">
                  <h2 style={{ color: "white" }}>Hãy nhập mã đơn hàng!</h2>
                  <div className="date_countdown">
                    <div id="timer">
                      <div id="days" className="date"></div>
                      <div id="hours" className="date"></div>
                      <div id="minutes" className="date"></div>
                      <div id="seconds" className="date"></div>
                    </div>
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập mã đơn hàng của bạn"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      onChange={(e: any) => setOrderId(e.target.value)}
                    />
                    <div className="input-group-append">
                      <a
                        href="#"
                        className="input-group-text btn_2"
                        style={{
                          backgroundColor: "gray",
                          textDecoration: "none",
                        }}
                        onClick={HandleSearchOrder}
                      // id="basic-addon2"
                      >
                        Tìm ngay
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Form>
      <section className="product_list best_seller section_padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section_tittle text-center">
                <h2 style={{ textAlign: "center" }}>SẢN PHẨM GIẢM GIÁ</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center latest_product_inner ">
            {sale?.data
              ?.filter((product: any) => !product.isbblock)
              ?.slice(0, showAllProductsSale ? sale.data.length : 4)
              .map((product: any) => {
                const imageArray = product?.image[0]?.split(",");
                return (
                  <SaleHomePage key={product.product_id} product={product} />
                );
              })}
            {sale?.data?.length > 4 && (
              <div
                className="col-lg-12 text-center"
                style={{ marginTop: "20px" }}
              >
                <button
                  className="custom-button"
                  onClick={handleSale}
                >
                  {showAllProductsSale ? "Thu gọn" : "Xem thêm"}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
