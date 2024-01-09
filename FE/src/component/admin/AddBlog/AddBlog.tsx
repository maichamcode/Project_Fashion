import { Button, Input, Upload, message } from "antd";
import { Form } from "antd";
import { useAddBlogMutation } from "../../../api/blog";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

const AddBlog = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [addBlog] = useAddBlogMutation();
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState("");
  const user_id = JSON.parse(localStorage.getItem("user")!);
  //   console.log(user_id?.user?.id);
  //handle upload image
  // Kiểm tra xem đã có ít nhất một ảnh được tải lên
  const isImageUploaded = uploadedImages.length > 0;
  const props: any = {
    action: "https://api.cloudinary.com/v1_1/dw6wgytc3/image/upload",
    onChange({ file }: any) {
      if (file.status !== "uploading") {
        // Sử dụng một hàm setState để cập nhật mảng uploadedImages
        setUploadedImages((prevImages): any => [
          ...prevImages,
          file.response.secure_url,
        ]);
      }
    },
    data: {
      upload_preset: "demo_upload",
      folder: "DUAN",
    },
  };
  console.log(uploadedImages);
  const onFinish = (blog: any) => {
    const data = {
      user_id: user_id?.user?.id,
      blog_title: blog.blog_title,
      blog_image: uploadedImages,
      blog_content: blog.blog_content,
    };
    // console.log("Data to send to API:", data);
    addBlog(data)
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Thêm thành công. Chờ 3s quay về danh sách blog!",
        });
        form.resetFields();
      });
    setTimeout(() => {
      navigate("/admin/blog");
    }, 3000);
  };
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Thêm blog</h5>
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
                Tiêu đề
              </label>
              <Form.Item
                className="col-md-10"
                name="blog_title"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tiêu đề blog",
                  },
                  {
                    min: 3,
                    message: "tên blog không được ít hơn 3 ký tự!",
                  },
                ]}
              >
                <Input
                  className="form-control"
                  placeholder="Title..."
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
                name="blog_image"
                className="col-md-10"
                validateTrigger={["onChange", "onBlur"]}
              >
                <Upload.Dragger {...props} multiple accept=".jpg,.png">
                  <Button icon={<UploadOutlined />}>Tải lên</Button>
                </Upload.Dragger>
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Nội dung
              </label>
              <Form.Item
                className="col-md-10"
                name="blog_content"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống nội dung",
                  },
                ]}
              >
                <TextArea
                  className="form-control"
                  placeholder="Content..."
                  id="html5-text-input"
                />
              </Form.Item>
            </div>

            <Button
              htmlType="submit"
              className="btn btn-outline-primary"
              style={{ height: "40px", marginTop: "20px" }}
              disabled={!isImageUploaded}
            >
              {contextHolder}
              Thêm Blog
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddBlog;
