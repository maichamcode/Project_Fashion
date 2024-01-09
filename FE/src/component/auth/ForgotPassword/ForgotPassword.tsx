import ClientLayOut from "../../../layout/ClientLayOut/ClientLayOut";
import { Button, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useForgotpasswordMutation, useSendOtpMutation } from "../../../api/auth";
import "../../page/UpdateProfile/UpdateProfile.css"
import { useEffect, useState } from "react";
import { pause } from "../../../utils/pause";
const ForgotPassword = () => {
    const [sendOtp] = useSendOtpMutation();
    const [forgotpassword]= useForgotpasswordMutation<any>()
    const navigate = useNavigate();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(60);
    const [isCounting, setIsCounting] = useState(false);
    const [user_email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [new_password, setnewPassword] = useState('');
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otp, setOtp] = useState<any>()
    const [messageApi, contextHolder] = message.useMessage()
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
            console.error('Lỗi khi gửi email:', error);
            messageApi.open({
                type: 'error',
                content: 'Đã xảy ra lỗi khi gửi email. Vui lòng thử lại sau.'
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
            email:user_email,
            new_password, 
            otp
        }
        forgotpassword(data2)
            .unwrap()
            .then(async () => {
                messageApi.open({
                    type: 'success',
                    content: 'Thay đổi mật khẩu thành công vui lòng đợi....'
                }),
                    await pause(2000)
                navigate('/login')
            })
            .catch(error => {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: error?.data?.message
                })
            })
    };

    return (
        <>
            {contextHolder}
            <div className="col-lg-6 col-md-6" style={{ marginTop: "150px", marginLeft: "27%" }}>
                <div className="login_part_form">
                    <div className="login_part_form_iner">
                        <h3>Quên mật khẩu</h3>
                        <br />
                  
                        <Form
                            className="row contact_form"
                            onFinish={handleSubmit}
                        >
                            <div className="col-md-12 form-group p_star">
                            <p>* Nhập địa chỉ email</p>
                                <Form.Item
                                    name="user_email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập email',

                                        },
                                        {
                                            type: 'email',
                                            message: 'Vui lòng nhập đúng định dạng email',

                                        },
                                    ]}>
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
                                            <button
                                                onClick={handleSendEmail}
                                                className="custom-button"
                                                style={{ marginLeft: "10px", height: '40px' }}
                                                disabled={isButtonDisabled || isCounting}

                                            >
                                                {isCounting ? `${remainingSeconds}s` : "Gửi mã OTP"}
                                            </button>
                                        </div>

                                    </div>
                                </Form.Item>
                            </div>
                            {showOTPInput ? 
                            <div className="col-md-12 form-group p_star">
                                <p>* Nhập mã xác nhận</p>
                                            <Form.Item
                                                name="otp"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập OTP',
                                                    },

                                                ]}
                                            >
                                                <input
                                                    type="otp"
                                                    className="form-control"
                                                    id="otp" name="otp"
                                                    placeholder="Mã OTP"
                                                    // value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                />
                                            </Form.Item>
                                            <p>* Nhập mật khẩu mới</p>
                                            <Form.Item
                                                name="new_password"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập mật khẩu',
                                                    },
                                                    {
                                                        pattern: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
                                                        message: 'Mật khẩu phải có ít nhất 6 ký tự và chứa ít nhất một số và một chữ.',
                                                    }
                                                ]}
                                            >
                                                <input
                                                    type="new_password"
                                                    className="form-control"
                                                    id="new_password" name="new_password"
                                                    placeholder="Mật khẩu mới"
                                                    // value={otp}
                                                    onChange={(e) => setnewPassword(e.target.value)}
                                                />
                                            </Form.Item>
                                            <p>* Xác nhận mật khẩu</p>
                                            <Form.Item
                                                name="confirm_password"
                                                dependencies={['new_password']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập xác nhận mật khẩu',
                                                    },
                                                    ({ getFieldValue }) => ({
                                                        validator(_, value) {
                                                            if (!value || getFieldValue('new_password') === value) {
                                                                return Promise.resolve();
                                                            }
                                                            return Promise.reject(new Error('Xác nhận mật khẩu không khớp'));
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
                                            <button type="submit" value="submit" className="custom-button" style={{width:"100%"}}>
                                                Xác nhận
                                            </button>
                                        </div> : ''
                                        
                                        }
                                         
                        </Form>
                    </div>
                </div>
            </div>
            <ClientLayOut />
        </>

    );
};

export default ForgotPassword;
