import React, { useEffect, useState } from "react";
import ClientLayOut from "../../../layout/ClientLayOut/ClientLayOut";
import { pause } from "../../../utils/pause";
import { useSendOtpMutation, useSignupMutation } from "../../../api/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, message } from "antd";
const Register = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [user_firstname, setFirstName] = useState("");
  const [user_lastname, setLastName] = useState("");
  const [user_phone, setPhone] = useState("");
  const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signup] = useSignupMutation<any>();
  const [sendOtp] = useSendOtpMutation();
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState<any>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [isCounting, setIsCounting] = useState(false);
  console.log(otp);

  const handleSendEmail = () => {
    if (isCounting) {
      return;
    }

    // Xử lý gửi email ở đây (nếu cần)

    // Bắt đầu đếm ngược
    setIsCounting(true);

    let countdown = setInterval(() => {
      setRemainingSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdown);
      setIsCounting(false);
      setRemainingSeconds(60);
    }, 60000);
    setIsButtonDisabled(true);
    setShowOTPInput(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 60000);
    try {
      if (user_email) {
        // Gọi sendOtp để gửi mã OTP về user_email
        sendOtp({ user_email });
        console.log("email: ", user_email);
      } else {
      }
    } catch (error) {
      console.error("Lỗi khi gửi email:", error);
      messageApi.open({
        type: "error",
        content: "Đã xảy ra lỗi khi gửi email. Vui lòng thử lại sau.",
      });
    }
  };
  useEffect(() => {
    if (remainingSeconds === 0) {
      setIsCounting(false);
      setRemainingSeconds(60);
    }
  }, [remainingSeconds]);
  const handleSubmit = async () => {
    const data2 = {
      user_lastname: user_lastname,
      user_firstname: user_firstname,
      user_phone: user_phone,
      email: user_email,
      user_password: user_password,
      otp: otp,
    };
    signup(data2)
      .unwrap()
      .then(async () => {
        messageApi.open({
          type: "success",
          content: "Bạn đã đăng ký thành công! Đợi 2s để sang trang đăng nhập!",
        }),
          await pause(2000);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        messageApi.open({
          type: "error",
          content: error?.data?.message,
        });
      });
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
                  <h2>Đăng nhập để tiếp tục truy cập website</h2>
                  <p>Nếu bạn đã có tài khoản hãy đăng nhập</p>
                  <Link to={"/login"} className="btn_3">
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="login_part_form">
                <div className="login_part_form_iner">
                  <h3>Đăng kí ngay</h3>
                  <Form
                    className="row contact_form"
                    action="#"
                    method="post"
                    onFinish={handleSubmit}
                  >
                    <Form.Item
                      name="user_lastname"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập họ",
                        },

                        {
                          min: 2,
                          max: 10,
                          message: "Nhập đúng họ",
                        },
                      ]}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="user_lastname"
                        name="user_lastname"
                        placeholder="Họ"
                        value={user_lastname}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="user_firstname"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên",
                        },
                        {
                          min: 1,
                          message: "Nhập đúng tên",
                        },
                      ]}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="user_firstname"
                        name="user_firstname"
                        placeholder="Tên"
                        value={user_firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="user_phone"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                        {
                          pattern: /^[0-9]+$/,
                          message: "Số điện thoại chỉ được chứa số.",
                        },
                      ]}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="user_phone"
                        name="user_phone"
                        placeholder="Số điện thoại"
                        value={user_phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Item>

                    <div className="col-md-12 form-group p_star">
                      <Form.Item
                        name="user_email"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập email",
                          },
                          {
                            type: "email",
                            message: "Vui lòng nhập đúng định dạng email",
                          },
                        ]}
                      >
                        <div>
                          <div style={{ display: "flex" }}>
                            <input
                              type="email"
                              className="form-control"
                              id="user_email"
                              name="user_email"
                              placeholder="Email"
                              value={user_email}
                              onChange={(e) => setEmail(e.target.value)}
                              style={{ flex: 1 }}
                            />
                            <Button
                              onClick={handleSendEmail}
                              className="btn btn-dark"
                              style={{ marginLeft: "10px", height: "40px" }}
                              disabled={isButtonDisabled || isCounting}
                            >
                              {isCounting
                                ? `${remainingSeconds}s`
                                : "Gửi mã OTP"}
                            </Button>
                          </div>
                        </div>
                      </Form.Item>
                    </div>
                    {showOTPInput ? (
                      <div className="col-md-12 form-group p_star">
                        <Form.Item
                          name="otp"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập OTP",
                            },
                          ]}
                        >
                          <input
                            type="otp"
                            className="form-control"
                            id="otp"
                            name="otp"
                            placeholder="Mã OTP"
                            // value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                          />
                        </Form.Item>
                      </div>
                    ) : (
                      ""
                    )}
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
                              "Mật khẩu phải có ít nhất 6 ký tự và chứa ít nhất một số và một chữ.",
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

                    <div className="col-md-12 form-group p_star">
                      <Form.Item
                        name="confirm_password"
                        dependencies={["user_password"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập xác nhận mật khẩu",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("user_password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Xác nhận mật khẩu không khớp")
                              );
                            },
                          }),
                        ]}
                      >
                        <input
                          type="password"
                          className="form-control"
                          id="confirm_password"
                          name="confirm_password"
                          placeholder="Xác nhận mật khẩu"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </Form.Item>
                    </div>
                    <div className="col-md-12 form-group">
                      <button
                        type="submit"
                        value="submit"
                        className="btn btn-dark"
                        style={{ width: "100%", borderRadius: "20px" }}
                      >
                        Đăng kí
                      </button>
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

export default Register;
