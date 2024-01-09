import { Button, Form, Input, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOneBlogQuery, useUpdateBlogMutation } from "../../../api/blog";
import { UploadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const UpdateBlog = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const user_id = JSON.parse(localStorage.getItem("user")!);
  const { id } = useParams();
  const { data: getOneBlog } = useGetOneBlogQuery(id || "");
  const [uploadedImages, setUploadedImages] = useState("");
  const isImageUploaded = uploadedImages.length > 0;
  const [originalImage, setOriginalImage] = useState("");
  const [updateBlog] = useUpdateBlogMutation();
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
    if (getOneBlog) {
      const blogData = getOneBlog?.data[0];
      setOriginalImage(getOneBlog?.data[0]?.blog_image);
      // console.log(blogData);
      form.setFieldsValue({
        blog_title: blogData.blog_title,
        blog_content: blogData.blog_content,
        blog_image: blogData.blog_image,
      });
    }
  }, [getOneBlog]);
  console.log(uploadedImages);
  
  const onFinish = (blog: any) => {
    const data = {
      user_id: user_id?.user?.id,
      blog_title: blog.blog_title,
      blog_image: uploadedImages ? uploadedImages : originalImage,
      blog_content: blog.blog_content,
    };
    updateBlog({ ...data, id: id })
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content:
            "Bạn đã cập nhập thành công, vui lòng chờ 3s quay lại danh sách blog",
        });
      });
    setTimeout(() => {
      navigate("/admin/blog");
    }, 3000);
  };

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Cập nhập blog</h5>
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
            // disabled={!isImageUploaded}
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

export default UpdateBlog;
