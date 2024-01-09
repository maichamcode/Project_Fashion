import React, { useState } from "react";
import ClientLayOut from "../../../layout/ClientLayOut/ClientLayOut";
import { useSigninMutation, useSigninnotokenMutation } from "../../../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pause } from "../../../utils/pause";
import { Button, Form, message } from "antd";
const Login = ({ onLogin }: any) => {
  const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [signin] = useSigninMutation();
  const [rememberMe, setRememberMe] = useState(false);
  const [signinnotoken] = useSigninnotokenMutation()
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (rememberMe) {
      signinnotoken({ user_email, user_password })
        .unwrap()
        .then(async (user) => {
          messageApi.open({
            type: "success",
            content: "Bạn đã đăng nhập thành công! Vui lòng đợi...",
          });
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.removeItem("cartItems");
          onLogin(user?.user.role)
          if (user?.user.role === 0) {
            navigate("admin");
          } else {
            navigate("/");
          }
        })
        .then(() => {
          const user = JSON.parse(localStorage.getItem("user")!);
          if (user?.user.role === 0) {
            return pause(1000).then(() => navigate("/admin"));
          } else if (user?.user.role === 1) {
            return pause(1000).then(() => navigate("/"));
          }
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: "error",
            content: error?.data?.message,
          });
        });
    } else {
      signin({ user_email, user_password })
        .unwrap()
        .then(async (user) => {
          messageApi.open({
            type: "success",
            content: "Bạn đã đăng nhập thành công! Vui lòng đợi...",
          });
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.removeItem("cartItems");
          onLogin(user?.user.role)
          if (user?.user.role === 0) {
            navigate("admin");
          } else {
            navigate("/");
          }
        })
        .then(() => {
          const user = JSON.parse(localStorage.getItem("user")!);
          if (user?.user.role === 0) {
            return pause(1000).then(() => navigate("/admin"));
          } else if (user?.user.role === 1) {
            return pause(1000).then(() => navigate("/"));
          }
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: "error",
            content: error?.data?.message,
          });
        });
    }

  };
  return (
    <>
      {contextHolder}

      <section className="login_part padding_top">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6">
              <div className="login_part_text text-center">
                <div className="login_part_text_iner">
                  <h2>Đây là lần đâu bạn đến?</h2>
                  <p>
                    Nếu đúng là vậy thì hãy đăng kí tài khoản để cho chúng tôi có thể hỗ trợ bạn những dịch vụ tốt nhất
                  </p>
                  <Link to={"/register"} className="btn_3" style={{ border: "1px solid black", boxShadow: "none" }}>
                    Tạo tài khoản
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="login_part_form">
                <div className="login_part_form_iner">
                  <h3>
                    Chào mừng bạn ! <br /> Hãy đăng nhập ngay
                  </h3>
                  <Form className="row contact_form" onFinish={handleSubmit}>
                    <div className="col-md-12 form-group p_star">
                      <Form.Item
                        name="user_email"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập email",

                          },
                          {
                            type: 'email',
                            message: 'Vui lòng nhập đúng định dạng email',

                          },
                        ]}
                      >
                        <input
                          type="email"
                          className="form-control"
                          id="user_email"
                          name="user_email"
                          placeholder="Email"
                          value={user_email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Item>
                    </div>

                    <div className="col-md-12 form-group p_star">
                      <Form.Item
                        name="user_password"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu",
                          },
                          {
                            pattern: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
                            message:
                              " Mật khẩu phải có 6 kí tự trở lên và có số",
                          },
                        ]}
                      >
                        <input
                          type="password"
                          className="form-control"
                          id="user_password"
                          name="user_password"
                          placeholder="Mật khẩu"
                          value={user_password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-md-12 form-group">
                      <div className="creat_account d-flex align-items-center">
                        <input
                          type="checkbox"
                          id="f-option"
                          name="selector"
                          checked={rememberMe} 
                          onChange={(e) => setRememberMe(e.target.checked)} 
                        />
                        <label htmlFor="f-option">Remember me</label>
                      </div>
                      <button type="submit" value="submit" className="btn_3" style={{ backgroundColor: "#1e272e", border: "none", boxShadow: "none", color: "white" }}>
                        Đăng nhập
                      </button>
                      <Link to={"/forgotpassword"} style={{ marginLeft: "280px" }}>Quên mật khẩu</Link>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ClientLayOut />
    </>
  );
};

export default Login;
