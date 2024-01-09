import {
    Button,
    Form,
    Input,
    message,
} from "antd";

import { useNavigate } from "react-router-dom";
import { useAddActionMutation } from "../../../api/actions";
import { useAddSizeMutation } from "../../../api/size";
const AddSize = () => {
    const [form] = Form.useForm();
    const [addSize] = useAddSizeMutation();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [addAction] = useAddActionMutation();
    const user = JSON.parse(localStorage.getItem("user")!);
    const onFinish = (size: any) => {
        const data = {
            size_name: size.name,
        };

        addSize(data)
            .unwrap()
            .then(() => {
                const data1 = {
                    user_id: user?.user?.id,
                    action: "Thêm Size",
                    old_data: null,
                    new_data: size?.name,
                };

                addAction(data1)
                    .unwrap()
                    .then(() => {
                        messageApi.open({
                            type: "success",
                            content:
                                "Bạn đã thêm Size thành công. Chờ 3s để quay về quản trị",
                        });
                        form.resetFields();
                        setTimeout(() => {
                            navigate("/admin/size");
                        }, 3000);
                    })
                    .catch((error) => {
                        messageApi.open({
                            type: "error",
                            content: `Lỗi khi thêm hành động: ${error.message}`,
                        });
                    });
            })
            .catch((error) => {
                messageApi.error(error.response?.data?.message || 'Lỗi khi thêm kích thước');
            });

    };

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card mb-4">
                    <h5 className="card-header">Thêm Size</h5>
                    <Form
                        className="card-body"
                        style={{ marginTop: "50px" }}
                        form={form}
                        onFinish={onFinish}
                    >
                        <div className="mb-3 row">
                            <label
                                htmlFor="html5-text-input"
                                className="col-md-2 col-form-label"
                            >
                                Tên Size
                            </label>
                            <Form.Item
                                className="col-md-10"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Không được để trống tên size",
                                    },
                                ]}
                            >
                                <Input
                                    className="form-control"
                                    placeholder="Tên Size..."
                                    id="html5-text-input"
                                />
                            </Form.Item>
                        </div>
                        <Button
                            htmlType="submit"
                            className="btn btn-outline-primary"
                            style={{ height: "40px", marginTop: "20px" }}
                        >
                            {contextHolder}
                            Thêm Size
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default AddSize;
