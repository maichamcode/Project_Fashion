import React, { SetStateAction, useEffect, useState } from "react";
import "./ListUser.css";
import ListUserDetail from "./ListUserDetail";
import { useGetUserQuery, useSendOtpMutation, useSignupMutation } from "../../../api/auth";
import { Button, Modal, Pagination, Space, Form, message, Skeleton } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import Register from "../../auth/Register/Register";
import { pause } from "../../../utils/pause";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
const socket = io("http://localhost:8080");

const ListUser = () => {
    const { data: dataUser, isLoading, refetch } = useGetUserQuery([]);
    useEffect(() => {
        socket.on("blockuser", (data: any) => {
            console.log(data);

            refetch();
        });
        return () => {
            socket.disconnect();
        };
    }, [refetch]);
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage()
    const [currentPage, setCurrentPage] = useState(1);
    const [showRevenue, setShowRevenue] = useState(false);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [selectedDate, setSelectedDate]: any = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user_firstname, setFirstName] = useState('');
    const [user_lastname, setLastName] = useState('');
    const [user_phone, setPhone] = useState('')
    const [user_email, setEmail] = useState('');
    const [user_password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signup] = useSignupMutation<any>()
    const [sendOtp] = useSendOtpMutation();
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [otp, setOtp] = useState<any>()
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(60);
    const [isCounting, setIsCounting] = useState(false);
    const itemsPerPage = 5;
    const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
        setCurrentPage(page);
    };
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
            user_lastname: user_lastname,
            user_firstname: user_firstname,
            user_phone: user_phone,
            email: user_email,
            user_password: user_password,
            otp: otp
        }
        signup(data2)
            .unwrap()
            .then(async () => {
                messageApi.open({
                    type: 'success',
                    content: 'Đăng kí thành công vui lòng đợi...'
                }),
                    await pause(2000)
                handleCancel()
                navigate('/admin/user')
            })
            .catch(error => {
                console.log(error);
                messageApi.open({
                    type: 'error',
                    content: error?.data?.message
                })
            })
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        handleSubmit()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = dataUser?.data?.slice(startIndex, endIndex);


    return (
        <>
            {contextHolder}
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <h5 className="card-header">Danh sách người dùng</h5>
                    <Button
                        type="primary"
                        onClick={showModal}
                        icon={<UserAddOutlined />}
                        style={{ marginLeft: "260px", top: "-40px", backgroundColor: "transparent", color: "#1890ff" }}
                    />
                    <Modal title="Đăng kí người dùng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                        <Space direction="vertical" >
                            <Form className="row contact_form" action="#" method="post" onFinish={handleSubmit}>
                                <Form.Item
                                    name="user_lastname"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập họ',
                                        },

                                        {
                                            min: 2,
                                            max: 10,
                                            message: 'Nhập đúng họ'
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
                                            message: 'Vui lòng nhập tên',
                                        },
                                        {
                                            min: 1,
                                            message: 'Nhập đúng tên'
                                        },

                                    ]}>
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
                                            message: 'Vui lòng nhập số điện thoại',
                                        },
                                        {
                                            pattern: /^[0-9]+$/,
                                            message: 'Số điện thoại chỉ được chứa số.',
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
                                                <Button
                                                    onClick={handleSendEmail}
                                                    className="btn btn-primary"
                                                    style={{ marginLeft: "10px", height: '40px' }}
                                                    disabled={isButtonDisabled || isCounting}

                                                >
                                                    {isCounting ? `${remainingSeconds}s` : "Gửi mã OTP"}
                                                </Button>
                                            </div>

                                        </div>
                                    </Form.Item>
                                </div>
                                {showOTPInput ? <div className="col-md-12 form-group p_star">
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
                                </div> : ''}
                                <div className="col-md-12 form-group p_star">
                                    <Form.Item
                                        name="user_password"
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
                                            type="password"
                                            className="form-control"
                                            id="user_password" name="user_password"
                                            placeholder="Mật khẩu"
                                            value={user_password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="col-md-12 form-group p_star">
                                    <Form.Item
                                        name="confirm_password"
                                        dependencies={['user_password']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập xác nhận mật khẩu',
                                            },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('user_password') === value) {
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
                                </div>

                                {/* <div className="creat_account d-flex align-items-center">
                                                <input type="checkbox" id="f-option" name="selector" /><label htmlFor="f-option">Đồng ý với tất cả các điều khoản</label>
                                            </div> */}
                                <button type="submit" value="submit" className="btn_3">
                                    Đăng kí
                                </button>


                            </Form>
                        </Space>
                    </Modal>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID người dùng</th>
                                <th>Họ người dùng</th>
                                <th>Tên người dùng</th>
                                <th>Email người dùng</th>
                                <th>Số điện thoại người dùng</th>
                                <th>Chặn</th>
                            </tr>
                        </thead>
                        {isLoading ? <Skeleton /> : <><tbody className="table-border-bottom-0">
                            {paginatedData?.map((data: any) => (
                                <ListUserDetail key={data?.id} data={data} />
                            ))}
                        </tbody></>}
                    </table>
                    <hr />
                    <div style={{ marginTop: "5px" }} className="pagination-container">
                        <Pagination
                            style={{ marginBottom: "20px" }}
                            current={currentPage}
                            total={dataUser?.data?.length || 0}
                            pageSize={itemsPerPage}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>

            </div>
        </>
    );
};

export default ListUser;
