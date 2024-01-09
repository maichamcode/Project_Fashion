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
import { useAddCategoryMutation } from "../../../api/category";
import { useNavigate } from "react-router-dom";
import { useAddActionMutation } from "../../../api/actions";
import { useState } from "react";
const AddCategory = () => {
  const [form] = Form.useForm();
  const [addCategory] = useAddCategoryMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [addAction] = useAddActionMutation();
  const [uploadedImages, setUploadedImages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")!);
  const isImageUploaded = uploadedImages.length > 0;
  const props: any = {
    action: "https://api.cloudinary.com/v1_1/dw6wgytc3/image/upload",
    onChange({ file }: any) {
      if (file.status !== "uploading") {
          // Sử dụng một hàm setState để cập nhật mảng uploadedImages
          setUploadedImages(
              file.response.secure_url
          );
      }
  },
    data: {
      upload_preset: "demo_upload",
      folder: "DUAN",
    },
  };
  const onFinish = (category: any) => {
    const data = {
      category_name: category.name,
      image:uploadedImages
    };
    addCategory(data)
      .unwrap()
      .then(() => {
        const data1 = {
          user_id: user?.user?.id,
          action: "Thêm Category",
          old_data: null,
          new_data: category?.name,
        };
        addAction(data1).unwrap();
        messageApi.open({
          type: "success",
          content:
            "Bạn đã thêm category thành công. Chờ 3s để quay về quản trị",
        });
        form.resetFields();
        setTimeout(() => {
          navigate("/admin/category");
        }, 3000);
      });
  };
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Thêm Danh Mục</h5>
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
                Tên danh mục
              </label>
              <Form.Item
                className="col-md-10"
                name="name"
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
                  //   pattern: /^[a-zA-Z0-9]+$/, // Kiểm tra nếu chỉ chứa chữ cái và số
                  //   message: "Tên danh mục chỉ được chứa chữ cái và số",
                  // },
                  // {
                  //   validator: (_, value) => {
                  //     if (/\s/.test(value)) {
                  //       return Promise.reject(
                  //         "Tên danh mục không được chứa khoảng trắng"
                  //       );
                  //     }
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
                  placeholder="Tên Sản Phẩm..."
                  id="html5-text-input"
                />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-search-input"
                className="col-md-2 col-form-label"
              >
                Hình ảnh
              </label>
              <Form.Item
                name="image"
                className="col-md-10"
                validateTrigger={["onChange", "onBlur"]}
              >
                <Upload.Dragger {...props} multiple >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload.Dragger>
              </Form.Item>
            </div>
            <Button
              htmlType="submit"
              className="btn btn-outline-primary"
              style={{ height: "40px", marginTop: "20px" }}
              disabled={!isImageUploaded}
            >
              {contextHolder}
              Thêm danh mục
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
