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
import {
  useGetOneCatQuery,
  useUpdateCategoryMutation,
} from "../../../api/category";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAddActionMutation } from "../../../api/actions";
const UpdateCategory = () => {
  const [form] = Form.useForm();
  const [updateCategory] = useUpdateCategoryMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: getOneCat } = useGetOneCatQuery(id || "");
  const [addAction] = useAddActionMutation();
  const user = JSON.parse(localStorage.getItem("user")!);
  const [oldCategoryName, setOldCategoryName] = useState("");
  const [uploadedImages, setUploadedImages] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  // console.log(user?.user?.id);
  const isImageUploaded = uploadedImages.length > 0;
  const props: any = {
    action: "https://api.cloudinary.com/v1_1/dw6wgytc3/image/upload",
    onChange({ file }: any) {
      if (file.status !== "uploading") {
        // Sử dụng một hàm setState để cập nhật mảng uploadedImages
        setUploadedImages(file.response.secure_url);
        setOriginalImage(file.response.secure_url);
      }
    },
    data: {
      upload_preset: "demo_upload",
      folder: "DUAN",
    },
  };

  useEffect(() => {
    if (getOneCat) {
      setOldCategoryName(getOneCat?.data[0].category_name);
      setOriginalImage(getOneCat?.data[0]?.image);
      form.setFieldsValue({
        category_name: getOneCat?.data[0].category_name,
        image: getOneCat?.data[0]?.image,
      });
    }
  }, [getOneCat]);
  console.log(uploadedImages);

  const onFinish = (product: any) => {
    const data = {
      category_name: product?.category_name,
      image: uploadedImages ? uploadedImages : originalImage,
    };

    updateCategory({ ...data, id: id })
      .unwrap()
      .then(() => {
        const data1 = {
          user_id: user?.user?.id,
          action: "Cập nhật Category",
          old_data: oldCategoryName,
          new_data: product?.category_name,
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
      navigate("/admin/category");
    }, 3000);
  };
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Sửa danh mục</h5>
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
                Tên danh mục
              </label>
              <Form.Item
                className="col-md-10"
                name="category_name"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tên danh mục!",
                  },
                  {
                    min: 3,
                    message: "tên danh mục không được ít hơn 3 ký tự!",
                  },
                ]}
              >
                <Input className="form-control" id="html5-text-input" />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-search-input"
                className="col-md-2 col-form-label"
              >
                Hình ảnh cần được sửa
              </label>
              <div className="col-md-10">
                <img
                  src={originalImage}
                  alt="Ảnh cần được sửa"
                  style={{ width: "30%", height: "auto" }}
                />
              </div>
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
                <Upload.Dragger {...props} multiple>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload.Dragger>
              </Form.Item>
            </div>
            <Button
              htmlType="submit"
              className="btn btn-outline-primary"
              style={{ height: "40px", marginTop: "20px" }}
            >
              {contextHolder}
              Sửa
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateCategory;
