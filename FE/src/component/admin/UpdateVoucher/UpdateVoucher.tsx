import { Button, Input, message, Form, Select } from "antd";
import React, { useEffect, useState } from "react";
// import { useAddVoucherMutation } from "../../../api/voucher";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOneVoucherQuery,
  useUpdateVoucherMutation,
} from "../../../api/voucher";

const UpdateVoucher = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: getOneVoucher } = useGetOneVoucherQuery(id || "");
  const [updateVoucher] = useUpdateVoucherMutation();

  useEffect(() => {
    if (getOneVoucher) {
      const voucherData = getOneVoucher?.data[0];
      // console.log(voucherData);
      form.setFieldsValue({
        voucher_code: voucherData.voucher_code,
        voucher_amount: voucherData.voucher_amount,
        voucher_status: voucherData.voucher_status,
      });
    }
  }, [getOneVoucher]);

  const onFinish = (voucher: any) => {
    updateVoucher({ ...voucher, id: id })
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content:
            "Bạn đã cập nhập thành công, vui lòng chờ 3s quay lại danh sách voucher",
        });
      });
    setTimeout(() => {
      navigate("/admin/voucher");
    }, 3000);
  };
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Sửa voucher</h5>
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
                name="voucher_code"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tên mã giảm giá",
                  },
                  {
                    min: 3,
                    message: "tên mã giảm giá không được ít hơn 3 ký tự!",
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
                Giá tiền giảm
              </label>
              <Form.Item
                className="col-md-10"
                name="voucher_amount"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống giá giảm",
                  },
                ]}
              >
                <Input
                  className="form-control"
                  placeholder="Giá giảm giá..."
                  id="html5-text-input"
                />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Trạng thái mã giảm giá
              </label>
              <Form.Item
                className="col-md-10"
                name="voucher_status"
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
              Câp Nhập mã giảm giá
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateVoucher;
