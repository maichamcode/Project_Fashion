import React, { useState } from "react";
import "../../page/Profile/style.css";
import { Button, Form, Input, message } from "antd";
import { useChangePasswordMutation } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
type Props = {};

const ChangePassword = (props: Props) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [ChangePassword] = useChangePasswordMutation();
  const user = JSON.parse(localStorage.getItem("user")!);
  const userId = user?.user?.id;

  const onFinish = (values: any) => {
    const data = {
      userId: userId,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };
    console.log(data);
    ChangePassword({ ...data, id: userId })
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Đổi mật khẩu thành công, chờ 3s quay lại hồ sơ của bạn!",
        });
        form.resetFields();

        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      })
      .catch((error: any) => {
        messageApi.open({
          type: "error",
          content: error?.data?.message,
        });
      });
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
                  <h2>Đổi mật khẩu</h2>
                  <p>
                    Trang chủ <span>-</span> Đổi mật khẩu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Form
        className="formChange"
        name="changePasswordForm"
        onFinish={onFinish}
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button className="buttonChange" htmlType="submit">
            {contextHolder}
            Thay đổi
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ChangePassword;
