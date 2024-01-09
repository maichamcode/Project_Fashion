import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { useNavigate } from "react-router-dom";
import { useAddProductMutation } from "../../../api/product";
import { useGetAllCatNoPaginationQuery } from "../../../api/category";
import { useGetColorQuery } from "../../../api/color";
import { useGetSizeQuery } from "../../../api/size";
import { useState } from "react";
import { useAddActionMutation } from "../../../api/actions";

const AddProduct = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [addProduct] = useAddProductMutation();
  const { data: getAllCat } = useGetAllCatNoPaginationQuery("");
  const [catId, setCatId] = useState<any>();
  const { data: getAllColor } = useGetColorQuery("");
  const { data: getAllSize } = useGetSizeQuery("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")!);
  const [addAction] = useAddActionMutation();

  let image: any = [];

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
  const validatePrice = async (_: any, value: any) => {
    if (value < 0) {
      // message.error("Số tiền giảm không được là số âm");
      return Promise.reject("Giá không được là số âm");
    }

    return Promise.resolve();
  };
  const validateKho = async (_: any, value: any) => {
    if (value < 0) {
      // message.error("Số tiền giảm không được là số âm");
      return Promise.reject("Kho không được là số âm");
    }

    return Promise.resolve();
  };
  //
  const onFinish = (product: any) => {
    const data = {
      name: product?.name,
      category_id: product.category_id,
      image: uploadedImages,
      price: product?.price,
      desc: product.desc,
      size_id: product?.size_id,
      color_id: product?.color_id,
      kho: product?.kho,
    };
    addProduct(data)
      .unwrap()
      .then(() => {
        const data1 = {
          user_id: user?.user?.id,
          action: "Thêm Sản Phẩm",
          old_data: null,
          new_data: product?.name,
        };
        addAction(data1).unwrap();
        messageApi.open({
          type: "success",
          content: "Bạn đã thêm product thành công. Chờ 3s để quay về quản trị",
        });
        form.resetFields();
        setTimeout(() => {
          navigate("/admin/product");
        }, 3000);
      });
  };

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Thêm Mới Sản Phẩm</h5>
          <Form
            className="card-body"
            style={{ marginTop: "50px" }}
            onFinish={onFinish}
          >
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Tên Sản Phẩm
              </label>
              <Form.Item
                className="col-md-10"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tên sản phẩm!",
                  },
                  {
                    min: 3,
                    message: "tên sản phẩm không được ít hơn 3 ký tự!",
                  },
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
                htmlFor="html5-datetime-local-input"
                className="col-md-2 col-form-label"
              >
                Danh Mục
              </label>
              <Form.Item
                name="category_id"
                className="col-md-10"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống danh mục!",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Danh mục"
                  onChange={(e) => setCatId(e)}
                >
                  {getAllCat?.data?.map((item: any) => (
                    <Option key={item.category_id} value={item.category_id}>
                      {item.category_name}
                    </Option>
                  ))}
                </Select>
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
                <Upload.Dragger {...props} multiple accept=".jpg,.png">
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload.Dragger>
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-email-input"
                className="col-md-2 col-form-label"
              >
                Giá Sản Phẩm
              </label>
              <Form.Item
                className="col-md-10"
                name="price"
                rules={[
                  { required: true, message: "Không được để trống price!" },
                  { validator: validatePrice },
                ]}
              >
                <Input
                  className="form-control"
                  type="number"
                  placeholder="Giá sản phẩm"
                  id="html5-number-input"
                />
              </Form.Item>
            </div>

            <div className="mb-3 row">
              <label
                htmlFor="html5-datetime-local-input"
                className="col-md-2 col-form-label"
              >
                Color
              </label>
              <Form.Item
                name="color_id"
                className="col-md-10"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống Color!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Color"
                >
                  {getAllColor?.data?.map((item: any) => (
                    <Option key={item.color_id} value={item.color_id}>
                      {item.color_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-datetime-local-input"
                className="col-md-2 col-form-label"
              >
                Size
              </label>
              <Form.Item
                name="size_id"
                className="col-md-10"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống Size!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Size"
                >
                  {getAllSize?.data?.map((item: any) => (
                    <Option key={item.size_id} value={item.size_id}>
                      {item.size_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-email-input"
                className="col-md-2 col-form-label"
              >
                Kho
              </label>
              <Form.Item
                className="col-md-10"
                name="kho"
                rules={[
                  { required: true, message: "Không được để trống kho!" },
                  { validator: validateKho },
                ]}
              >
                <Input
                  className="form-control"
                  type="number"
                  placeholder="Kho"
                  id="html5-number-input"
                />
              </Form.Item>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="html5-text-input"
                className="col-md-2 col-form-label"
              >
                Mô Tả Sản Phẩm
              </label>
              <Form.Item
                className="col-md-10"
                name="desc"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống mô tả!",
                  },
                  { min: 3, message: "mô tả không được ít hơn 3 ký tự!" },
                ]}
              >
                <TextArea
                  className="form-control"
                  placeholder="Mô tả sản phẩm"
                  id="html5-password-input"
                />
              </Form.Item>
            </div>

            {/* <div className="mb-3 row">
              <label
                htmlFor="html5-datetime-local-input"
                className="col-md-2 col-form-label"
              >
                Khuyến mãi
              </label>
              <Form.Item name="promorions_id" className="col-md-10">
                <Select style={{ width: "100%" }}>
                  <Option value="0">Không áp dụng</Option>

                  <option>1</option>
                </Select>
              </Form.Item>
            </div> */}

            <Button
              htmlType="submit"
              className="btn btn-outline-primary"
              style={{ height: "40px", marginTop: "20px" }}
              disabled={!isImageUploaded}
            >
              {contextHolder}
              Thêm Sản Phẩm
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
