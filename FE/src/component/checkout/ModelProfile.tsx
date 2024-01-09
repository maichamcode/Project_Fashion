import { Input, Modal, Form, message, Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetOneUserQuery, useSendOtpMutation, useSigninProfileMutation, useUpdateProfile1Mutation, useUpdateProfileMutation } from '../../api/auth';
import { useGetAllDistrictQuery, useGetAllProvinceQuery, useGetAllWardQuery } from '../../api/countruy';

type Props = {}

const ModelProfile = () => {
    const [isModalOpen, setIsModalOpen] = useState<any>(null);
    console.log(isModalOpen);

    const showModal = () => {
        setIsModalOpen(true);
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [form] = Form.useForm();
    const [signin] = useSigninProfileMutation()
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "[]")
    const { id } = useParams();
    const [uploadedImages, setUploadedImages] = useState([]);
    const { data: getOneUser } = useGetOneUserQuery(user?.user?.id);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(60);
    const [sendOtp] = useSendOtpMutation();
    const [user_email, setEmail] = useState(getOneUser?.data?.user_email);
    const [otp, setOtp] = useState<any>();
    console.log(otp);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [isCounting, setIsCounting] = useState(false);
    console.log(getOneUser);
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
    useEffect(() => {
        form.getFieldsValue(getOneUser?.data)
    }, [getOneUser?.data])
    const { data: province } = useGetAllProvinceQuery("");
    const [provinceId, setprovinceId] = useState<any>();
    const [provinceName, setprovinceName] = useState<any>();
    const [districtId, setdistrictId] = useState<any>();
    const [districtName, setDistrictName] = useState<any>();
    const [wardname, setwardname] = useState<any>();
    const { data: ward } = useGetAllWardQuery(districtId);
    const { data: district } = useGetAllDistrictQuery(provinceId);
    const [updateUser] = useUpdateProfileMutation();
    const [updateUser1] = useUpdateProfile1Mutation();
    const [check, setcheck] = useState('')
    const [diachi, setDiachi] = useState<any>()
    console.log(diachi);
    useEffect(() => {
        if (diachi) {
            setcheck("user_address")
        } else if (!diachi) {
            setcheck("user_addresss")
        } else {
            setcheck("")
        }

    }, [diachi])

    console.log(getOneUser);

    useEffect(() => {
        if (getOneUser) {
            const userData = getOneUser?.data;
            console.log(userData);

            form.setFieldsValue({
                user_lastname: userData.user_lastname,
                user_firstname: userData.user_firstname,
                // user_address: userData.user_address,
                // user_province: provinceName,
                // user_district: districtName,
                // user_ward: wardname,
                user_phone: userData.user_phone,
                email: userData.user_email,
                user_image: userData.user_image[0],
            });
        }
    }, [getOneUser]);

    
    const handleOk = async (users: any) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user')!);
            const emailchanged = storedUser?.user?.user_email !== users.email;

            const data = {
                user_lastname: users?.user_lastname,
                user_image: uploadedImages,
                user_firstname: users?.user_firstname,
                user_phone: users?.user_phone,
                email: users?.email,
                otp: otp
            };

            if (emailchanged) {
                const updatedUser = await updateUser({ ...data, id: storedUser?.user?.id }).unwrap();
                console.log(updatedUser);
                localStorage.removeItem("user");

                const dataAfterSignIn = await signin({
                    user_email: updatedUser?.data?.user_email,
                    user_password: updatedUser?.data?.user_password
                }).unwrap();

                localStorage.setItem('user', JSON.stringify(dataAfterSignIn));
                messageApi.open({
                    type: "success",
                    content: "Cập nhật thông tin người dùng thành công vui lòng đợi...",
                });
                form.resetFields();
              window.location.reload();
            } else {
                const updatedUser1 = await updateUser1({ ...data, id: storedUser?.user?.id }).unwrap();
                console.log(updatedUser1);
                localStorage.removeItem("user");

                const dataAfterSignIn = await signin({
                    user_email: updatedUser1?.data?.user_email,
                    user_password: updatedUser1?.data?.user_password
                }).unwrap();

                localStorage.setItem('user', JSON.stringify(dataAfterSignIn));
                setIsModalOpen(false);
                messageApi.open({
                    type: "success",
                    content: "Cập nhật thông tin người dùng thành công vui lòng đợi...",
                });
                window.location.reload()

            }
        } catch (error: any) {
            console.log(error);
            const errorMessage = (error && error.data && error.data.message) ? error.data.message : "Đã xảy ra lỗi khi cập nhật thông tin người dùng.";
            messageApi.open({
                type: "error",
                content: errorMessage,
            });
        }
    };

    return (
        <>
            <p> <a onClick={() => showModal()}>Bạn có cần sửa thông tin ?</a></p>
            <Modal title="Basic Modal" open={isModalOpen} footer={[]} onCancel={handleCancel}>
                <Form onFinish={handleOk} form={form}>
                    <div className="mb-3 row" style={{ marginTop: "15px" }} >
                        <label htmlFor="html5-text-input" className="col-sm-3 " style={{ fontWeight: "bold" }}>
                            Họ:
                        </label>
                        <div className="col-sm-9">
                            <Form.Item
                                name="user_lastname"
                                rules={[
                                    {
                                        required: true,
                                        message: "Không được để trống Họ!",
                                    },
                                ]}
                            >
                                <Input className="form-control" id="html5-text-input" />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="mb-3 row" style={{ marginTop: "-15px" }}>
                        <label htmlFor="html5-text-input" className="col-sm-3 " style={{ fontWeight: "bold" }}>
                            Tên:
                        </label>
                        <div className="col-sm-9">
                            <Form.Item
                                name="user_firstname"
                                rules={[
                                    {
                                        required: true,
                                        message: "Không được để trống Tên!",
                                    },
                                ]}
                            >
                                <Input className="form-control" id="html5-text-input" />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="mb-3 row" style={{ marginTop: "-15px" }}>
                        <label htmlFor="html5-text-input" className="col-sm-3" style={{ fontWeight: "bold" }}>
                            Email:
                        </label>
                        <div className="col-sm-9">
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Không được để trống Email!",
                                    },
                                ]}
                            >
                                <Input
                                    type="email"
                                    className="form-control"
                                    id="user_email"
                                    name="user_email"
                                    placeholder="Email"
                                    value={user_email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ flex: 1, width: "250px" }}
                                />

                            </Form.Item>
                            <Button
                                onClick={handleSendEmail}
                                className="btn btn-dark"
                                style={{ marginLeft: "270px", height: "38px", width: "22%", marginTop: "-112px" }}
                                disabled={isButtonDisabled || isCounting || !user_email}
                            >
                                {isCounting
                                    ? `${remainingSeconds}s`
                                    : "Gửi OTP"}
                            </Button>
                        </div>
                    </div>
                    {showOTPInput ? (
                        <div className="mb-3 row" style={{ marginTop: "-25px" }}>
                            <label htmlFor="html5-text-input" className="col-sm-3" style={{ fontWeight: "bold" }}>
                                Mã xác nhận:
                            </label>
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
                                    style={{ marginLeft: "126px", marginTop: "-38px", width: "340px" }}
                                />
                            </Form.Item>
                        </div>
                    ) : (
                        ""
                    )}

                    <div className="mb-3 row" style={{ marginTop: "-15px" }}>
                        <label htmlFor="html5-text-input" className="col-sm-3" style={{ fontWeight: "bold" }}>
                            Số điện thoại:
                        </label>
                        <div className="col-sm-9">
                            <Form.Item
                                name="user_phone"
                                rules={[
                                    {
                                        required: true,
                                        message: "Không được để trống Số điện thoại!",
                                    },
                                ]}
                            >
                                <Input className="form-control" id="html5-text-input" />
                            </Form.Item>
                        </div>
                    </div>
                    <div style={{ marginLeft: "30%", border: "none" }}>
                        <button
                            type="submit" value="submit"
                            className="custom-button"
                        >
                            Cập nhật
                        </button>
                        <span style={{ marginLeft: "3px" }}> </span>
                        <Link to="/checkout">
                            <button
                                className="cancel-button"
                            >
                                Huỷ
                            </button>
                        </Link>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default ModelProfile