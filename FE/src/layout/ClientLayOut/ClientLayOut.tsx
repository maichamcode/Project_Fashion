import "./css/style.css";
import "./css/slick.css";
import "./css/magnific-popup.css";
import "./css/themify-icons.css";
import "./css/flaticon.css";
import "./css/all.css";
import "./css/owl.carousel.min.css";
import "./css/animate.css";
import "./search.css";
// import "./css/bootstrap.min.css";
import {
  FacebookOutlined,
  HeartOutlined,
  MessageOutlined,
  PhoneOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { pause } from "../../utils/pause";
import { useEffect, useState } from "react";
import { useGetAllCatNoPaginationQuery } from "../../api/category";
import { useGetSearchProductCategoryMutation } from "../../api/product";
import { Form } from "antd";
import Search from "../../component/page/Search/Search";
import { useGetOneUserQuery } from "../../api/auth";
import ZaloIcon from "../../component/page/Zalo/zalo";
const ClientLayOut = ({ onSearchs }: any) => {
  const {
    data: category,
    isError,
    isLoading,
  } = useGetAllCatNoPaginationQuery("");
  useEffect(() => {
    if (isError) {
      console.error("error");
    }
    if (isLoading) {
      console.error("Error loading");
    }
  }, [isError, isLoading]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")!);
  const { id } = useParams();
  const { data: getOneUser } = useGetOneUserQuery(id || "");
  // console.log(getOneUser);
  const isLogin = () => {
    const accessToken = user ? user.accessToken : undefined;
    if (accessToken) {
      return true;
    } else {
      return false;
    }
  };
  const LogOut = async () => {
    localStorage.removeItem("user");
    toast.success("Bạn đã đăng xuất!");
    await pause(1500);
    navigate("/");
  };
  const linkTo = false;

  //search
  const [searchCat, setSearchCat] = useState(null);
  const [nameCat, setNameCate] = useState();
  const [getSearchCat, { isLoading: searchLoading }] =
    useGetSearchProductCategoryMutation();
  const [form] = Form.useForm();

  const HandleSearchCat = () => {
    if (nameCat == "") {
      setSearchCat(null);
    } else if (nameCat) {
      const nameData = {
        category_name: nameCat,
      };
      getSearchCat(nameData)
        .unwrap()
        .then((data: any) => {
          setSearchCat(data);
          console.log(data);
          onSearchs(data);
        });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000);

      navigate("/search");
    }
  };

  //end search
  return (
    <>
      <header className="main_menu home_menu">
        <div className="container">
          <div className="row align-items-center">
            <div
              className="col-lg-12"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "90 %",
                height: "10%",
                backgroundColor: "#fff",
                zIndex: 1000,
                paddingLeft: "50px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <nav className="navbar navbar-expand-lg navbar-light">
                <a
                  className="navbar-brand"
                  href="/"
                  style={{
                    width: "9%",
                    fontWeight: "700",
                    fontSize: 30,
                    marginTop: "-10px",
                  }}
                >
                  NO1-STORE
                </a>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="menu_icon">
                    <i className="fas fa-bars"></i>
                  </span>
                </button>

                <div
                  className="collapse navbar-collapse main-menu-item"
                  id="navbarSupportedContent"
                >
                  <ul
                    className="navbar-nav"
                    style={{ marginLeft: "-300px", marginTop: "-5px" }}
                  >
                    <li className="nav-item">
                      <Link
                        to="/"
                        className="nav-link dropdown"
                        style={{ fontSize: "16px" }}
                      >
                        Trang chủ
                      </Link>
                    </li>

                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link dropdown-toggle"
                        to="shopProduct"
                        id="navbarDropdown_1"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style={{ fontSize: "16px" }}
                      >
                        Sản phẩm
                      </Link>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown_1"
                        style={{ fontSize: "16px" }}
                      >
                        {category?.data?.map((category: any) => {
                          return (
                            <Link
                              key={category.category_id}
                              className="dropdown-item"
                              to={`/category/${category.category_id}`}
                            >
                              {category.category_name}
                            </Link>
                          );
                        })}
                      </div>
                    </li>
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="blog.html"
                        id="navbarDropdown_3"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style={{ fontSize: "16px", pointerEvents: "none" }}
                      >
                        pages
                      </a>
                      <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown_2"
                      >
                        <Link
                          className="dropdown-item"
                          to="allnewproduct3days"
                          style={{ pointerEvents: "auto" }}
                        >
                          Sản phẩm mới
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="alloutstan"
                          style={{ pointerEvents: "auto" }}
                        >
                          Sản phẩm nổi bật
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="allsale"
                          style={{ pointerEvents: "auto" }}
                        >
                          Sản phẩm sale
                        </Link>
                      </div>
                    </li>

                    <li className="nav-item dropdown">
                      <Link
                        className="nav-link"
                        to="blog"
                        id="navbarDropdown_2"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        style={{ fontSize: "16px" }}
                      >
                        Tin Tức
                      </Link>
                      {/* <div
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown_2"
                      >
                        <a className="dropdown-item" href="blog">
                          blog
                        </a>
                        <a className="dropdown-item" href="single-blog.html">
                          Single blog
                        </a>
                      </div> */}
                    </li>

                    <li
                      className="nav-item dropdown"
                      style={{ fontSize: "16px" }}
                    >
                      <Link className="nav-link " to={"lienhe"}>
                        Liên hệ
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="hearer_icon d-flex">
                  <Form
                    form={form}
                    onFinish={HandleSearchCat}
                    style={{ marginTop: "-5px" }}
                  >
                    <a
                      href="#"
                      style={{ color: "brown", padding: "8px" }}
                      className="custom-link"
                    >
                      <SearchOutlined style={{ verticalAlign: "middle" }} />

                      {/* <Form form={form} onFinish={HandleSearchCat}> */}
                      <input
                        type="text"
                        className="custom-input"
                        placeholder="Search ..."
                        onChange={(e: any) => setNameCate(e.target.value)}
                      />
                      {/* </Form> */}
                    </a>
                    <Link
                      to={"/favoriteProduct"}
                      style={{ color: "red", padding: "8px" }}
                    >
                      <HeartOutlined />
                    </Link>
                    <Link
                      to={"/cart"}
                      style={{ color: "green", padding: "8px" }}
                    >
                      <ShoppingCartOutlined />
                    </Link>
                  </Form>
                </div>

                {isLogin() ? (
                  <>
                    <ul className="navbar-nav flex-row align-items-center ms-auto">
                      <li className="nav-item navbar-dropdown dropdown-user dropdown ">
                        <a
                          className="nav-link dropdown-toggle hide-arrow"
                          href="javascript:void(0);"
                          data-bs-toggle="dropdown"
                          style={{ marginRight: "50px", marginTop: "-10px" }}
                        >
                          <div
                            style={{
                              width: "100%",
                              overflow: "hidden",
                              marginTop: "2px",
                            }}
                          >
                            <div
                              style={{
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
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
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li style={{ marginRight: "15px" }}>
                            <a className="dropdown-item" href="#">
                              <div className="d-flex">
                                <div
                                  style={{
                                    width: "100%",
                                    overflow: "hidden",
                                    marginTop: "2px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "45px",
                                      height: "45px",
                                      borderRadius: "50%",

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
                                      }}
                                      src={
                                        user?.user?.user_image == "undefined"
                                          ? "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg"
                                          : user?.user?.user_image
                                      }
                                      alt="avt"
                                    />
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <Link to={`profile/${user?.user?.id}/edit`}>
                                    <span
                                      className="fw-semibold d-block"
                                      style={{ marginTop: "10px" }}
                                    >
                                      {user?.user?.user_lastname}{" "}
                                      {user?.user?.user_firstname}
                                    </span>
                                  </Link>
                                  {user?.user?.role === 0 ? (
                                    <small className="text-muted">Admin</small>
                                  ) : null}
                                </div>
                              </div>
                            </a>
                          </li>

                          <li style={{ marginLeft: "-25px" }}>
                            <a className="dropdown-item" href="#">
                              <i className="bx bx-user me-2"></i>
                              <Link
                                style={{ textDecoration: "none" }}
                                to={"profile"}
                              >
                                <span className="align-middle">
                                  Hồ sơ của tôi
                                </span>
                              </Link>
                            </a>
                          </li>
                          <li style={{ marginLeft: "-25px" }}>
                            <a className="dropdown-item" href="#">
                              <i className="bx bx-cog me-2"></i>
                              <Link
                                style={{ textDecoration: "none" }}
                                to={"order"}
                              >
                                <span className="align-middle">
                                  Đơn hàng của tôi
                                </span>
                              </Link>
                            </a>
                          </li>
                          <li>
                            {/* <a className="dropdown-item" href="#">

                            </li>
                            <li>
                              {/* <a className="dropdown-item" href="#">

                                <span className="d-flex align-items-center align-middle">
                                  <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                                  <span className="flex-grow-1 align-middle">
                                    Billing
                                  </span>
                                  <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">
                                    4
                                  </span>
                                </span>
                              </a> */}
                          </li>
                          <li>
                            <div className="dropdown-divider"></div>
                          </li>
                          <li
                            onClick={() => LogOut()}
                            style={{ marginLeft: "-25px" }}
                          >
                            <a className="dropdown-item" href="/">
                              <i className="bx bx-power-off me-2"></i>
                              <span className="align-middle">Đăng xuất</span>
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </>
                ) : (
                  <div className="navbar-nav ml-auto py-0">
                    <Link to="/login" className="nav-item nav-link">
                      Đăng nhập{" "}
                    </Link>
                    {/* <Link to="/register" className="nav-item nav-link">Register</Link> */}
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
        {/* <div className="navbar-nav ml-auto py-0">
          <Link to="/login" className="nav-item nav-link">Login</Link>
          <Link to="/register" className="nav-item nav-link">Register</Link>
        </div> */}
        {/* <div className="search_input" id="search_input_box">
                  <div className="container ">
                      <form className="d-flex justify-content-between search-inner">
                          <input type="text" className="form-control" id="search_input" placeholder="Search Here"/>
                              <button type="submit" className="btn"></button>
                              <span className="ti-close" id="close_search" title="Close Search"></span>
                      </form>
                  </div>
              </div> */}
      </header>
      <Outlet />
      <ZaloIcon />
      <footer
        className="footer_part"
        style={{
          backgroundColor: "black",
          marginTop: "50px",
          // zIndex: 1000,
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="container" style={{ display: "flex" }}>
          <a
            className="navbar-brand"
            href="/"
            style={{
              width: "19%",
              fontWeight: "700",
              fontSize: 30,
              marginTop: "-10px",
              color: "white",
              marginLeft: "-160px",
            }}
          >
            NO1-STORE
          </a>
          <div
            className="row justify-content-around"
            style={{ width: "90%", float: "right", paddingLeft: 90 }}
          >
            <div style={{ width: "30%", paddingTop: 20 }}>
              <div className="single_footer_part">
                <h5 style={{ fontSize: "16px", color: "white" }}>
                  Về chúng tôi
                </h5>
                <ul className="list-unstyled" style={{ fontSize: "14px" }}>
                  <li>
                    <a style={{ textDecoration: "none" }} href="">
                      Công ty TNHH No1-Store Việt Nam
                    </a>
                  </li>
                  <li>
                    <a style={{ textDecoration: "none" }} href="">
                      Địa chỉ: Trịnh Văn Bô, Nam Từ Liêm, Hà Nội
                    </a>
                  </li>

                  <li>
                    <a style={{ textDecoration: "none" }} href="">
                      Điện thoại: 0972.620.091
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div style={{ width: "30%", paddingTop: 20 }}>
              <div className="single_footer_part">
                <h5 style={{ fontSize: "16px", color: "white" }}>
                  Chính sách và quy định
                </h5>
                <ul className="list-unstyled" style={{ fontSize: "14px" }}>
                  <li>
                    <a style={{ textDecoration: "none" }} href="/blog">
                      Cách thức đặt hàng
                    </a>
                  </li>
                  <li>
                    <a style={{ textDecoration: "none" }} href="/blog">
                      Chính sách thành viên
                    </a>
                  </li>
                  <li>
                    <a style={{ textDecoration: "none" }} href="/blog">
                      Chính sách giao hàng
                    </a>
                  </li>
                  <li>
                    <a style={{ textDecoration: "none" }} href="/blog">
                      Quy định đổi trả
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div style={{ width: "30%", paddingTop: 20 }}>
              <div className="single_footer_part">
                <h5 style={{ fontSize: "16px", color: "white" }}>Kết nối</h5>
                <ul className="list-unstyled" style={{ fontSize: "14px" }}>
                  <li>
                    <a style={{ textDecoration: "none" }} href="">
                      Sđt: 0972.620.091
                    </a>
                  </li>
                  <li>
                    <a style={{ textDecoration: "none" }} href="">
                      ĐẶT HÀNG (08:30 - 22:00)
                    </a>
                  </li>
                  <li>
                    <a style={{ textDecoration: "none" }} href="">
                      GÓP Ý, KHIẾU NẠI (08:30 - 22:00)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright_part">
          <div className="container">
            <div className="row">
              <div className="col-lg-8"></div>
              <div className="col-lg-4">
                <div className="footer_icon social_icon">
                  <ul className="list-unstyled">
                    <li>
                      <a
                        href="https://zalo.me/g/qqlizf973"
                        className="single_social_icon"
                      >
                        <PhoneOutlined />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.facebook.com/vuthinhung10052003/"
                        className="single_social_icon"
                      >
                        <FacebookOutlined />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/channel/UCnG5wPsycZUvRuZhnXBzEvw"
                        className="single_social_icon"
                      >
                        <YoutubeOutlined />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://m.me/j/AbaLvz-DYIIRh1_T/"
                        className="single_social_icon"
                      >
                        <MessageOutlined />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ClientLayOut;
