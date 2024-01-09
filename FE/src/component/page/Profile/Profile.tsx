import { OrderedListOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";
import { useGetOneUserQuery } from "../../../api/auth";
import { toast } from "react-toastify";
import { pause } from "../../../utils/pause";
import "../UpdateProfile/UpdateProfile.css";
const ProfileUser = () => {
  const { id } = useParams();
  console.log(id);
  const { data: getOneCat } = useGetOneUserQuery(id || "");
  // console.log(getOneCat);
  const user = JSON.parse(localStorage.getItem("user")!);
  const navigate = useNavigate();
  const LogOut = async () => {
    localStorage.removeItem("user");
    toast.success("Bạn đã đăng xuất!");
    await pause(1500);
    navigate("/");
  };
  return (
    <>
      <section className="breadcrumb " style={{ marginTop: "70px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="breadcrumb_iner">
                <div
                  className="breadcrumb_iner_item"
                  style={{ marginTop: "30px" }}
                >
                  <h2>Hồ sơ của tôi</h2>
                  <p>
                    Trang chủ <span>-</span> Hồ sơ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={{ backgroundColor: "#fff", marginTop: "50px" }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-body text-center">
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
                  <h5 className="my-3">
                    {user?.user?.user_lastname} {user?.user?.user_firstname}
                  </h5>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Họ</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {user?.user?.user_lastname}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Tên</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {user?.user?.user_firstname}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {user?.user?.user_email}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Số điện thoại</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {user?.user?.user_phone}
                      </p>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div style={{ marginLeft: "16%" }}>
                <Link to={`${user?.user.id}/edit`}>
                  <button className="custom-button">Cập nhật</button>
                </Link>
                <span style={{ marginLeft: "3px" }}> </span>
                <Link to={"changePassword"}>
                  <button
                    className="custom-button"
                    style={{
                      width: "150px",
                      height: "40px",
                      marginLeft: "20px",
                      marginRight: "20px",
                    }}
                  >
                    Đổi mật khẩu
                  </button>
                </Link>
                <button
                  className="custom-button"
                  style={{
                    width: "150px",
                    height: "40px",
                  }}
                  onClick={() => LogOut()}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileUser;
