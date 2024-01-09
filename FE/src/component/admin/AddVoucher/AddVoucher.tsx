import { Button, Input, message, Form, Select } from "antd";
import React, { useState } from "react";
import { useAddVoucherMutation } from "../../../api/voucher";
import { useNavigate } from "react-router-dom";

const AddVoucher = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [addVoucher] = useAddVoucherMutation();
  const navigate = useNavigate();

  const onFinish = (voucher: any) => {
    console.log(voucher?.amount);
    
    if (voucher?.amount > 500000 || voucher?.amount < 10000) {
      messageApi.open({
        type: "error",
        content: "Số tiền voucher không được vượt quá 500.000đ và nhỏ hơn 10.000đ",
      });
      return;
    } else {
      const data = {
        voucher_code: `Mã giảm giá ${voucher.name}K`,
        voucher_amount: voucher.amount,
        voucher_status: voucher.status,
      };
      addVoucher(data)
        .unwrap()
        .then(() => {
          messageApi.open({
            type: "success",
            content: "Thêm thành công. Chờ 3s quay về danh sách voucher!",
          });
          form.resetFields();
        });

      setTimeout(() => {
        navigate("/admin/voucher");
      }, 3000);
    }

  };
  const validateAmount = async (_: any, value: any) => {
    if (value < 0) {
      // message.error("Số tiền giảm không được là số âm");
      return Promise.reject("Số tiền giảm không được là số âm");
    }

    return Promise.resolve();
  };

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Thêm mã giảm giá</h5>
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
                Mã giảm giá
              </label>
              <Form.Item
                className="col-md-10"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tên mã giảm giá",
                  },
                  {
                    min: 1,
                    message: "Tên mã giảm giá không được ít hơn 1 ký tự!",
                  },
                ]}
              >
                <Input
                  className="form-control"
                  placeholder="Mã giảm giá..."
                  id="html5-text-input"
                />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Số tiền giảm
              </label>
              <Form.Item
                className="col-md-10"
                name="amount"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống giá giảm",
                  },
                  { validator: validateAmount },
                ]}
              >
                <Input
                  className="form-control"
                  placeholder="Giá giảm giá..."
                  id="html5-text-input"
                  type="number"
                />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Trạng thái mã
              </label>
              <Form.Item
                className="col-md-10"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống trạng thái mã",
                  },
                ]}
              >
                <Select
                  //   className="form-control"
                  placeholder="Chọn trạng thái giảm giá..."
                  style={{ margin: "0" }} // Thêm phần style này để loại bỏ margin
                >
                  <Select.Option value="active">Kích hoạt</Select.Option>
                  <Select.Option value="inactive">
                    Không kích hoạt
                  </Select.Option>
                  {/* Thêm các tùy chọn khác tại đây */}
                </Select>
              </Form.Item>
            </div>

            <Button
              htmlType="submit"
              className="btn btn-outline-primary"
              style={{ height: "40px", marginTop: "20px" }}
            >
              {contextHolder}
              Thêm mã giảm giá
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddVoucher;
