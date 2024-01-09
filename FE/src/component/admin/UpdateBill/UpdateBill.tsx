import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetBillByIdQuery,
  useGetOneBillQuery,
  useUpdateBillMutation,
} from "../../../api/bill";

type Props = {};

const UpdateBill = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: getOneBill } = useGetOneBillQuery(id || "");
  //   console.log(getOneBill);
  const [updateBill] = useUpdateBillMutation();
  useEffect(() => {
    if (getOneBill) {
      const billData = getOneBill?.data;
      //   console.log(billData);
      form.setFieldsValue({
        user_phone: billData.user_phone,
        province: billData.province,
        district: billData.district,
        address: billData.address,
        ward: billData.ward,
      });
    }
  }, [getOneBill]);
  const onFinish = (bill: any) => {
    updateBill({ ...bill, id: id })
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content:
            "Bạn đã cập nhập thành công, vui lòng chờ 3s để quay lại danh sách hóa đơn",
        });
        setTimeout(() => {
          navigate("/admin/bill");
        }, 3000);
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: `${error?.data?.message}`,
        });
      });
  };
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Sửa Bill</h5>
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
                Số điện thoại{" "}
              </label>
              <Form.Item className="col-md-10" name="user_phone" rules={[]}>
                <Input className="form-control" id="html5-text-input" />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Tỉnh{" "}
              </label>
              <Form.Item className="col-md-10" name="province" rules={[]}>
                <Input className="form-control" id="html5-text-input" />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Huyện{" "}
              </label>
              <Form.Item className="col-md-10" name="district" rules={[]}>
                <Input className="form-control" id="html5-text-input" />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Xã{" "}
              </label>
              <Form.Item className="col-md-10" name="ward" rules={[]}>
                <Input className="form-control" id="html5-text-input" />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Địa chỉ{" "}
              </label>
              <Form.Item className="col-md-10" name="address" rules={[]}>
                <Input className="form-control" id="html5-text-input" />
              </Form.Item>
            </div>

            <Button
              htmlType="submit"
              className="btn btn-outline-primary"
              style={{ height: "40px", marginTop: "20px" }}
            >
              {contextHolder}
              Câp Nhập Hóa Đơn
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateBill;
