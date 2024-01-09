import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  UploadProps,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router-dom";
import { useAddSaleMutation } from "../../../api/sale";
import { useAddActionMutation } from "../../../api/actions";
const AddProductSale = () => {
  const [form] = Form.useForm();
  const [addsale] = useAddSaleMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [addAction] = useAddActionMutation();
  const user = JSON.parse(localStorage.getItem("user")!);
  const onFinish = (sale: any) => {
    const data = {
      sale_distcount: sale.sale_distcount,
      sale_name: sale.sale_name,
    };
    console.log(data);
    
    addsale(data)
      .unwrap()
      .then(() => {
        const data1 = {
          user_id: user?.user?.id,
          action: "Thêm Sale",
          old_data: null,
          new_data: sale.sale_name,
        };
        addAction(data1).unwrap();
        messageApi.open({
          type: "success",
          content:
            "Bạn đã thêm category thành công. Chờ 3s để quay về quản trị",
        });
        form.resetFields();
        setTimeout(() => {
          navigate("/admin/sale");
        }, 3000);
      })
      .catch(error => {
        console.log(error);
        messageApi.open({
            type: 'error',
            content: error?.data?.message
        })
    });
  };
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Thêm % giảm giá</h5>
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
                Tên loại giảm giá
              </label>
              <Form.Item
                className="col-md-10"
                name="sale_name"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tên danh mục",
                  },
                  {
                    min: 3,
                    message: "Tên sản phẩm không được ít hơn 3 ký tự!",
                  },
                  // {
                  //   validator: (_, value) => {
                  //     if (/^\d+$/.test(value)) {
                  //       return Promise.reject(
                  //         "Tên loại giảm giá không thể là toàn số"
                  //       );
                  //     }
                  //     return Promise.resolve();
                  //   },
                  // },
                ]}
              >
                <Input
                  className="form-control"
                  placeholder="Tên loại giảm giá..."
                  id="html5-text-input"
                />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                % giảm giá
              </label>
              <Form.Item
                className="col-md-10"
                name="sale_distcount"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống % giảm giá",
                  },
                  {
                    pattern: /^[0-9]+$/, // Chỉ cho phép nhập số
                    message: 'Vui lòng chỉ nhập số cho % giảm giá',
                },
                  // {
                  //   validator: (_, value) => {
                  //     if (/^\d+$/.test(value)) {
                  //       return Promise.reject(
                  //         "Tên danh mục không thể là toàn số"
                  //       );
                  //     }
                  //     return Promise.resolve();
                  //   },
                  // },
                ]}
              >
                <Input
                  className="form-control"
                  placeholder="% giảm giá..."
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
              Thêm giảm giá
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default AddProductSale