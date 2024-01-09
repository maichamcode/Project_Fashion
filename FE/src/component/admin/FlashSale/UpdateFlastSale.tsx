import { Button, Skeleton, Modal, Space, Input, Form, message } from "antd";
import { useGetAllProductOffQuery, useGetOneProductQuery } from "../../../api/product"
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { useGetOneSaleQuery, useGetSaleQuery, useSaleupdatesMutation, useUpdatesaleMutation } from "../../../api/sale";
import { useAddActionMutation } from "../../../api/actions";

const socket = io("http://localhost:8080");

const UpdateFlashSale = ({ id, onCheck }: any) => {

    const [isModalOpen, setIsModalOpen] = useState(true); // Mở modal khi trang được tải lên

    const { data: getonesale, isLoading, refetch } = useGetOneSaleQuery(id);
    console.log(getonesale);

    useEffect(() => {
        socket.on("updatesale", (data: any) => {
            refetch();
        });
        return () => {
            socket.disconnect();
        };
    }, [refetch]);



    const [form] = Form.useForm();
    const [updateSale] = useSaleupdatesMutation();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    // const { data: getOneCat } = useGetOneCatQuery(id || "");
    const [addAction] = useAddActionMutation();
    const user = JSON.parse(localStorage.getItem("user")!);
    const [oldSaleDistCount, setOldSaleDistcount] = useState("");
    const [oldSaleName, setOldSaleName] = useState("");
    // console.log(user?.user?.id);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onFinish(values); // Trigger form submission when OK button is clicked
                onCheck(false);
            })
            .catch((errorInfo) => {
                console.log("Validation failed:", errorInfo);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        onCheck(false)
    };
    useEffect(() => {
        if (getonesale) {
            setOldSaleName(getonesale?.data[0].sale_name);
            form.setFieldsValue({
                sale_name: getonesale?.data[0].sale_name,
                sale_distcount: getonesale?.data[0]?.sale_distcount
            });
        }

    }, [getonesale]);


    const onFinish = (sale: any) => {
        const data = {
            sale_name: sale?.sale_name,
            sale_distcount: sale?.sale_distcount,
        };

        updateSale({ ...data, id: id })
            .unwrap()
            .then(() => {
                const data1 = {
                    user_id: user?.user?.id,
                    action: "Cập nhật Category",
                    old_data: oldSaleDistCount,
                    new_data: sale?.sale_name,
                };

                addAction(data1).unwrap();
                messageApi.open({
                    type: "success",
                    content:
                        "Bạn đã cập nhập thành công, vui lòng chờ 3s quay về trang quản trị!",
                });
            });
        form.resetFields();
        setTimeout(() => {
            setIsModalOpen(false);
            onCheck(false)
        }, 1500);

    };

    return (
        <>

            <Modal
                title="Cập nhật hình thức giảm giá"
                width={800}
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}

            >
                <Form
                    onFinish={onFinish}
                    form={form}
                    className="card-body"
                    style={{ marginTop: "50px" }}
                >

                    <div className="mb-3 row">
                        <label
                            htmlFor="html5-text-input"
                            className="col-md-2 col-form-label"
                        >
                            Tên hình thức giảm giá
                        </label>
                        <Form.Item
                            className="col-md-10"
                            name="sale_name"
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: "Không được để trống tên giảm giá!",
                        //     }
                        // ]}
                        >
                            <Input className="form-control" id="html5-text-input" />
                        </Form.Item>
                    </div>
                    <div className="mb-3 row">
                        <label
                            htmlFor="html5-text-input"
                            className="col-md-2 col-form-label"
                        >
                            % SALE
                        </label>
                        <Form.Item
                            className="col-md-10"
                            name="sale_distcount"

                        >
                            <Input className="form-control" id="html5-text-input" />
                        </Form.Item>
                    </div>
                    {/* <Button
                        htmlType="submit"
                        className="btn btn-outline-primary"
                        style={{ height: "40px", marginTop: "20px" }}
                    >
                        {contextHolder}
                        Sửa
                    </Button> */}
                </Form>
            </Modal>
        </>
    );
};

export default UpdateFlashSale;
