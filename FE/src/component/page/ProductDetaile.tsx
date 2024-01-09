import {
  useGetCountProductOrderQuery,
  useGetOneProductQuery,
  useGetRelatedProductQuery,
} from "../../api/product";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Skeleton, message } from "antd";
import { useGetAllCatQuery } from "../../api/category";
import Size from "./size/Size";
import Color from "./color/Color";
import { Key, useEffect, useState } from "react";
import { useAddToCartMutation, useGetCartQuery } from "../../api/cart";
import { useGetSaleQuery } from "../../api/sale";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useScrollToTopOnMount from "../../utils/useScrollToTopOnMount";
import {
  CarOutlined,
  FieldTimeOutlined,
  HeartOutlined,
  MoneyCollectOutlined,
  SendOutlined,
  ShoppingCartOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import "./productdetail.css";
import CurrencyFormatter from "../../utils/FormatTotal";
import ListComment from "./Comment/ListComment";
import {
  useAddCmtMutation,
  useGetCommentProductQuery,
} from "../../api/comment";
import TextArea from "antd/es/input/TextArea";
import { useGetOneChekoutProductQuery } from "../../api/checkout";
import { pause } from "../../utils/pause";
import ButtonTym from "./product/ButtonTym";
import ButtonTymProductDetail from "./product/ButtonTymProductDetail";
import { useGetAllOrderQuery } from "../../api/order";
const ProductDetail = () => {
  const { id }: any = useParams();
  const { data, isLoading } = useGetOneProductQuery(id);
  const imageArray = data?.data[0]?.image[0]?.split(",");
  const { data: category } = useGetAllCatQuery("");
  const { data: related } = useGetRelatedProductQuery(id);
  console.log(related);

  const categoryName = category?.data?.find(
    (id: any) => id?.category_id == data?.data[0]?.category_id
  )?.category_name;
  const [quantity, setquantity] = useState(1);

  const [sizes, setsize] = useState<any>();
  const [colors, setcolor] = useState<any>();
  const user = JSON.parse(localStorage.getItem("user")!);
  const [addtocart] = useAddToCartMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: sale } = useGetSaleQuery("");
  const saleName = sale?.data?.find(
    (id: any) => id?.sale_id == data?.data[0]?.sale_id
  )?.sale_distcount;
  const totalSale = (data?.data[0]?.product_price * saleName) / 100;
  const total = data?.data[0]?.product_price - totalSale;
  const [selectedColor, setSelectedColor] = useState(null);
  const color = (id: any) => {
    setcolor(id);
    setSelectedColor(id);
  };
  const [selectedSize, setSelectedSize] = useState(null);
  const size = (sizeId: any) => {
    setsize(sizeId);
    setSelectedSize(sizeId);
  };
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  console.log(cartItems);

  const [checkbutton, setcheckbutton] = useState(false);
  const userid = user?.user?.id;
  const { data: cart } = useGetCartQuery(userid);
  const check = cart?.data?.find((data: any) => data?.product?.product_id == id)
  console.log(check);
  const check1 = cartItems?.find((data: any) => data?.product_id == id)
  console.log(check1);
 

  const HandleAddToCart = async () => {
    console.log();
    if (quantity > data?.data[0]?.kho) {
      messageApi.open({
        type: "error",
        content: "Bạn không thể thêm vào giỏ hàng khi trong kho không đủ!",
      });

    } else if (Number(check?.quantity + quantity) > data?.data[0]?.kho) {
      messageApi.open({
        type: "error",
        content: "Dường như sản phẩm này đã có trong giỏ hàng rồi!",
      });
    } else if (Number(check1?.quantity) + Number(quantity) > data?.data[0]?.kho) {
      messageApi.open({
        type: "error",
        content: "Dường như sản phẩm này đã có trong giỏ hàng rồi!",
      });
    } else {
      if (user) {
        const data1 = {
          product_id: parseInt(id),
          quantity: quantity || 1,
          productColor: colors,
          productSize: sizes,
        };
        const token = user?.accessToken;
        const all = { data: data1, token: token };
        if (sizes == undefined) {
          messageApi.open({
            type: "error",
            content: "Bạn cần chọn size sản phẩm trước!",
          });
        } else if (colors == undefined) {
          messageApi.open({
            type: "error",
            content: "Bạn cần chọn màu sắc sản phẩm trước!",
          });
        } else {
          setcheckbutton(true);
          addtocart(all)
            .unwrap()
            .then(async () => {
              messageApi.open({
                type: "success",
                content: "Thêm vào giỏ hàng thành công!",
              });
              await pause(2000);
              setcheckbutton(false);
            })
            .catch(({ data }: any) => {
              // Đã thêm dấu '{' ở đây
              messageApi.open({
                type: "error",
                content: data?.message,
              });
            });
        }
      } else {
        if (sizes == undefined) {
          message.error("Bạn cần chọn size sản phẩm trước!");
        } else if (colors == undefined) {
          message.error("Bạn cần chọn màu sắc sản phẩm trước!");
        } else {
          setcheckbutton(true);
          const checkvalue = cartItems?.find(
            (data: any) =>
              data?.product_id == id &&
              data?.productSize == sizes &&
              data?.productColor == colors
          );
          console.log(checkvalue, cartItems);
          const existingProductIndex = cartItems.findIndex(
            (item: any) =>
              item.product_id == parseInt(id) &&
              item?.productSize == sizes &&
              item?.productColor == colors
          );
          console.log(existingProductIndex);
          if (existingProductIndex !== -1) {
            cartItems[existingProductIndex].quantity += Number(quantity);
          } else {
            const data1 = {
              product_id: parseInt(id),
              quantity: Number(quantity),
              productColor: colors,
              productSize: sizes,
            };
            await cartItems.push(data1);
          }
          console.log(cartItems);
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          message.success("Đã thêm sản phẩm vào giỏ hàng!", 2);
          await pause(2000);
          setcheckbutton(false);
        }
      }
    }
  };
  const [checknow, setchecknow] = useState();
  const navigate = useNavigate();
  const HandleAddToCart1 = async () => {
    if (quantity > data?.data[0]?.kho) {
      messageApi.open({
        type: "error",
        content: "Kho không đủ sản phẩm!",
      });
    } else {
      if (sizes == undefined) {
        messageApi.open({
          type: "error",
          content: "Bạn cần chọn size sản phẩm trước!",
        });
      } else if (colors == undefined) {
        messageApi.open({
          type: "error",
          content: "Bạn cần chọn màu sắc sản phẩm trước!",
        });
      } else {
        setcheckbutton(true);
        const data1: any = {
          product_id: parseInt(id),
          quantity: quantity || 1,
          productColor: colors,
          productSize: sizes,
        };
        localStorage.setItem("buynow", JSON.stringify(data1));
        const buynow = JSON.parse(localStorage.getItem("buynow")!);
        console.log(buynow);
        window.location.href = "/ordernow";
      }
    }
  };
  const khoValue = data?.data[0]?.kho;
  const [expanded, setExpanded] = useState(false);
  const handleReset = () => {
    setExpanded(false);
  };
  useScrollToTopOnMount(data);
  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  const { data: comment } = useGetCommentProductQuery(id);
  const [showMore, setShowMore] = useState(false);
  const data1 = comment?.data;
  const visibleComments = showMore ? data1 : data1?.slice(0, 3);
  const handleShowMore = () => {
    setShowMore(true);
  };
  const { data: checkoutproduct } = useGetOneChekoutProductQuery(id);
  const { data: orrder } = useGetAllOrderQuery("");
  const checkCmt = checkoutproduct?.data?.find(
    (id: any) => id?.user_id == user?.user?.id
  )?.id;
  const checkcmt = orrder?.orders.find(
    (data: any) => data?.checkout_id == checkCmt && data?.status == 6
  )?.order_id;
  console.log(checkcmt);

  const [content, setContent] = useState<any>();
  const [cmt, { isLoading: cmting }] = useAddCmtMutation();
  const handleCmt = () => {
    const data1 = {
      content: content,
      user_id: user?.user?.id,
      product_id: id,
    };
    cmt(data1)
      .unwrap()
      .then(() => {
        messageApi.success("Bạn đã thêm bình luận thành công!");
      })
      .catch((error: any) => {
        console.log(error);
        messageApi.open({
          type: "error",
          content: error?.data?.message,
        });
      });
    setContent("");
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = e.charCode;
    const isDigit = charCode >= 48 && charCode <= 57;
    const isControlKey = e.ctrlKey || e.altKey || e.metaKey;
    const isAllowedSpecialKey = [8].includes(charCode);
    const isNotAllowedChar = [43, 45].includes(charCode);
    if (!isDigit && !isControlKey && !isAllowedSpecialKey && isNotAllowedChar) {
      e.preventDefault();
    }
  };
  const { data: countProductOrder } = useGetCountProductOrderQuery(id);
  const [showComments, setShowComments] = useState(false);

  const handleTabClick = () => {
    setShowComments(true);
  };
  const handleBuyNow = () => { };
  return (
    <>
      <div id="top"></div>
      {contextHolder}
      <section
        className="breadcrumb breadcrumb_bg"
        style={{ marginTop: "70px", backgroundColor: "#eeee" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="breadcrumb_iner">
                <div className="breadcrumb_iner_item">
                  <h2>Chi tiết sản phẩm</h2>
                  <p>
                    Trang chủ <span>-</span> Chi tiết sản phẩm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isLoading ? (
        <Skeleton />
      ) : (
        <section>
          <div
            className="product_image_area section_padding"
            style={{ height: "100%" }}
          >
            <div className="container">
              <div className="row s_product_inner justify-content-between">
                <div style={{ width: "50%" }}>
                  <div className="product_slider_img">
                    <div className="image-carousel">

                      <div style={{ border: "none", width: "100%" }}>
                        <Carousel width={470}>
                          {imageArray
                            .slice(0)
                            .map(
                              (
                                image: string | undefined,
                                index: Key | null | undefined
                              ) => (
                                <div key={index} style={{ border: "none" }}>
                                  <img
                                    style={{
                                      border: "none",
                                      width: "100%",
                                      height: "100%",
                                    }}
                                    src={image}
                                    alt={`Small Image ${index}`}
                                  />
                                </div>
                              )
                            )}
                        </Carousel>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ width: "50%" }}>
                  <div className="s_product_text">
                    <h3>{data?.data[0]?.product_name}</h3>
                    <hr />
                    <li
                      style={{
                        fontSize: "12px",
                        color: "#a3a5a7",
                        marginBottom: "20px",
                        display: "block",
                      }}
                    >
                      <span>Kho</span> : {data?.data[0]?.kho}
                      <span style={{ marginLeft: 20 }}>
                        Đã mua :{" "}
                        <span style={{ fontWeight: 500, color: "red" }}>
                          {countProductOrder?.totalQuantity
                            ? countProductOrder?.totalQuantity
                            : "0"}
                        </span>
                      </span>
                      {khoValue && khoValue <= 5 && (
                        <span style={{ color: "red", marginLeft: "5px" }}>
                          Sắp hết hàng
                        </span>
                      )}
                    </li>
                    {total ? (
                      <div style={{ display: "flex" }}>
                        <h2 style={{ color: "#000000", fontWeight: 600 }}>
                          <CurrencyFormatter amount={total} />
                        </h2>
                        <h2
                          style={{
                            marginRight: "10px",
                            color: "#aaaa",
                            fontWeight: 400,
                            textDecoration: "line-through",
                            fontSize: "12px",
                            padding: "5px 10px ",
                          }}
                        >
                          <CurrencyFormatter
                            amount={data?.data[0]?.product_price}
                          />
                        </h2>

                        {saleName ? (
                          <div
                            style={{
                              backgroundColor: "red",
                              width: "9%",
                              height: "9%",
                              textAlign: "center",
                              color: "white",
                              fontSize: "13px",
                            }}
                          >
                            -{saleName}%
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      <h2 style={{ color: "#000000", fontWeight: 600 }}>
                        <CurrencyFormatter
                          amount={data?.data[0]?.product_price}
                        />
                      </h2>
                    )}
                    <ul className="list" style={{ marginBottom: "20px" }}>
                      <li style={{ marginBottom: "20px" }}>
                        <a className="active" href="#">
                          <span>Danh mục</span> : {categoryName}
                        </a>
                      </li>

                      <li style={{ marginBottom: "20px" }}>
                        <a href="#">
                          <span>Kích cỡ</span>
                          {data?.data[0]?.size_id?.map(
                            (data: any, index: any) => (
                              <Size
                                key={index}
                                data={data}
                                onSize={size}
                                selectedSize={data === selectedSize}
                              />
                            )
                          )}
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span>Màu</span>
                          {data?.data[0]?.color_id?.map((data: any) => (
                            <Color
                              data={data}
                              onColor={color}
                              selectedColor={data === selectedColor}
                            />
                          ))}
                        </a>
                      </li>
                    </ul>

                    <div
                      className="card_area d-flex justify-content-between align-items-center"
                      style={{ marginTop: 50 }}
                    >
                      <div className="product_count">
                        <input
                          className="input-number"
                          type="number"
                          onChange={(e: any) => setquantity(e.target.value)}
                          defaultValue={1}
                          min="1"
                          // onKeyDown={(e) => e.preventDefault()}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <Button
                        className="btn_3"
                        style={{
                          height: "50px",
                          backgroundColor: "black",
                          border: "none",
                          boxShadow: "none",
                        }}
                        onClick={() => HandleAddToCart()}
                        disabled={checkbutton}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                      <Button
                        className="btn_3"
                        style={{
                          height: "50px",
                          backgroundColor: "black",
                          border: "none",
                          boxShadow: "none",
                        }}
                        onClick={() => HandleAddToCart1()}
                        disabled={checkbutton}
                      >
                        Mua ngay
                      </Button>

                      {/* <a href="" className="like_us">
                        <HeartOutlined
                          style={{ fontSize: "24px", color: "black" }}
                        />
                      </a> */}
                      <ButtonTymProductDetail data={data} />
                    </div>
                    <div
                      style={{
                        border: "1px solid #888888",
                        borderRadius: 10,
                        padding: 15,
                        marginTop: "50px",
                      }}
                    >
                      <div style={{ marginBottom: "10px" }}>
                        <span
                          style={{
                            fontSize: "14px",
                            marginLeft: 0,
                            textTransform: "uppercase",
                            color: "#26BB4E",

                            display: "block",
                            fontWeight: "normal",
                          }}
                        >
                          GỌI ĐỂ MUA HÀNG NHANH HƠN
                        </span>
                        <a
                          href="tell:0972.620.091"
                          style={{
                            fontSize: 24,
                            color: "black",
                            fontWeight: 600,
                          }}
                        >
                          0972.620.091
                        </a>
                        <span style={{ fontSize: 12, color: "gray" }}>
                          {" "}
                          (8h30 : 18h30){" "}
                        </span>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <span
                          style={{
                            fontSize: "14px",
                            marginLeft: 0,
                            textTransform: "uppercase",
                            color: "#26BB4E",
                            marginBottom: "10px",
                            display: "block",
                            fontWeight: "normal",
                          }}
                        >
                          CHÍNH SÁCH BÁN HÀNG
                        </span>
                        <div style={{ display: "flex", marginBottom: 10 }}>
                          <CarOutlined
                            style={{ fontSize: 24, marginRight: 8 }}
                          />
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              marginRight: 8,
                            }}
                          >
                            Giao hàng miễn phí
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: "gray",
                              lineHeight: 2.5,
                            }}
                          >
                            (Hóa đơn trên 3.000.000)
                          </span>
                        </div>
                        <div style={{ display: "flex", marginBottom: 10 }}>
                          <FieldTimeOutlined
                            style={{ fontSize: 24, marginRight: 8 }}
                          />
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              marginRight: 8,
                            }}
                          >
                            Đổi trả miễn phí 14 ngày
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: "gray",
                              lineHeight: 2.5,
                            }}
                          >
                            (Với mua online)
                          </span>
                        </div>
                        <div style={{ display: "flex", marginBottom: 10 }}>
                          <MoneyCollectOutlined
                            style={{ fontSize: 24, marginRight: 8 }}
                          />
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 14,
                              marginRight: 8,
                            }}
                          >
                            Thanh toán COD
                          </span>
                          <span
                            style={{
                              fontSize: 10,
                              color: "gray",
                              lineHeight: 2.5,
                            }}
                          >
                            (Hoặc chuyển khoản)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section
            className="product_description_area"
            style={{ marginTop: -120 }}
          >
            <div className="container">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="review-tab"
                    data-toggle="tab"
                    href="#review"
                    role="tab"
                    aria-controls="review"
                    aria-selected="false"
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    Mô Tả
                  </a>
                </li>
              </ul>
              <p style={{ marginTop: "20px", width: "70%", marginLeft: 50 }}>
                {expanded
                  ? data?.data[0]?.product_description
                  : data?.data[0]?.product_description.slice(0, 350)}
                {!expanded &&
                  data?.data[0]?.product_description.length > 350 && (
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
          </section>
          <section
            className="product_description_area"
            style={{ marginTop: -100 }}
          >
            <div className="container">
              <ul
                className="nav nav-tabs"
                id="myTab"
                role="tablist"
                style={{ marginBottom: "-20px" }}
              >
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="review-tab"
                    data-toggle="tab"
                    href="#review"
                    role="tab"
                    aria-controls="review"
                    aria-selected="false"
                    style={{
                      backgroundColor: "black",
                      border: "none",
                      boxShadow: "none",
                    }}
                    onClick={handleTabClick}
                  >
                    Bình Luận
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className={`tab-pane fade ${showComments ? "show active" : ""
                    }`}
                  id="review"
                  role="tabpanel"
                  aria-labelledby="review-tab"
                >
                  {/* <hr style={{ color: "white" }} /> */}
                  <div className="row" style={{ marginTop: "3%" }}>
                    <div className="col-lg-6">
                      <div className="review_list">
                        {visibleComments?.map((data: any, index: any) => (
                          <ListComment key={index} data={data} />
                        ))}
                        {!showMore && data1?.length > 3 && (
                          <Button
                            onClick={handleShowMore}
                            style={{
                              border: "none",
                              color: "blue",
                              marginTop: "-10px",
                              marginBottom: "10px",
                            }}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {checkcmt && user ? (
                    <>
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            width: "5%",
                            overflow: "hidden",
                            marginTop: "7px",
                          }}
                        >
                          <div
                            style={{
                              width: "45px",
                              height: "45px",
                              margin: "0 auto",
                              overflow: "hidden",
                              border: "1px solid white",
                            }}
                          >
                            <img
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                                borderRadius: "50%",
                              }}
                              src={
                                user?.user?.user_image == "undefined" ||
                                  user?.user?.user_image == ""
                                  ? "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg"
                                  : user?.user?.user_image
                              }
                              alt="avt"
                            />
                          </div>
                        </div>
                        <TextArea
                          style={{
                            marginBottom: "2%",
                            marginTop: "5px",
                            width: "80%",
                            border: "1px solid gray",
                            borderRadius: "20px",
                          }}
                          value={content}
                          placeholder="Viết bình luận..."
                          onChange={(e) => setContent(e.target.value)}
                        ></TextArea>
                        <SendOutlined
                          style={{
                            width: "10%",
                            // lineHeight: "40%",
                            marginLeft: "40px",
                            fontSize: 30,
                            marginTop: -15,
                          }}
                          onClick={handleCmt}
                        >
                          {cmting ? "Đang viết..." : "Đăng"}
                        </SendOutlined>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </section>
        </section>
      )}

      <section className="product_list best_seller">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section_tittle text-center">
                <h2>Sản Phẩm Liên Quan</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center latest_product_inner">
            {related?.data?.relatedProducts?.map((product: any) => {
              const imageArray = product?.image[0]?.split(",");
              const saleItem = sale?.data.find(
                (item: any) => item.sale_id === product.sale_id
              );
              const saleDiscount = saleItem ? saleItem.sale_distcount : 0;

              // Calculate the discounted price
              const originalPrice = product.product_price;
              const discountedPrice =
                originalPrice - (originalPrice * saleDiscount) / 100;

              return (
                <div className="col-lg-3" key={product.product_id}>
                  <div className="single_product_item">
                    <div
                      className="product_image_container"
                      style={{ position: "relative" }}
                    >
                      <img src={imageArray ? imageArray[0] : ""} alt="" />
                      {saleDiscount !== 0 && (
                        <div
                          className="sale-percentage"
                          style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            backgroundColor: "red",
                            borderRadius: "5px",
                            width: "50px",
                            height: "40px",
                          }}
                        >
                          <p
                            style={{
                              color: "white",
                              textAlign: "center",
                              marginTop: "5px",
                            }}
                          >
                            -{saleDiscount}%
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="product_name" style={{ marginTop: "20px" }}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/shopProduct/${product.product_id}`}
                      >
                        <h4
                          style={{
                            fontSize: "20px",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          {product?.product_name?.slice(0, 20)}...
                        </h4>
                      </Link>
                    </div>
                    <div className="single_product_text">
                      {saleDiscount !== 0 ? (
                        <div className="price">
                          <h3 className="old-price" style={{ opacity: "0.5" }}>
                            {" "}
                            <CurrencyFormatter amount={product.product_price} />
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
                        <h3 style={{ textAlign: "center" }}>
                          <CurrencyFormatter amount={product.product_price} />
                        </h3>
                      )}
                      <a
                        href="#"
                        className="add_cart"
                        style={{ display: "flex" }}
                      >
                        <div style={{ width: "70%", fontSize: "0.8em" }}>
                          <Link to={`/shopProduct/${product.product_id}`}>
                            <ShoppingCartOutlined
                              className="black-shopping-cart-icon"
                              style={{
                                fontSize: "24px",
                                color: "black",
                                marginLeft: "50px",
                                height: "30px",
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
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
