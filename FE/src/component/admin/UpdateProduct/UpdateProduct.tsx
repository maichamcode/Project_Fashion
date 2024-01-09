import { UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Modal, Select, Upload, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOneProductQuery,
  useUpdateImageProductMutation,
  useUpdateProductMutation,
} from "../../../api/product";
import { useGetAllCatNoPaginationQuery } from "../../../api/category";
import { useEffect, useState } from "react";
import { useGetColorQuery } from "../../../api/color";
import { useGetSizeQuery } from "../../../api/size";
import { useAddActionMutation } from "../../../api/actions";

const UpdateProduct = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [updateProduct] = useUpdateProductMutation();
  const { data: getAllCat } = useGetAllCatNoPaginationQuery("");
  const [catId, setCatId] = useState<any>();
  const { data: getAllColor } = useGetColorQuery("");
  const { data: getAllSize } = useGetSizeQuery("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const { id } = useParams();
  const { data: getOneProduct } = useGetOneProductQuery(id || "");
  console.log(getOneProduct);

  const user = JSON.parse(localStorage.getItem("user")!);
  const [addAction] = useAddActionMutation();
  const [oldProduct, setOldProduct] = useState("");
  useEffect(() => {
    if (getOneProduct) {
      setOldProduct(getOneProduct?.data[0].product_name);
      form.setFieldsValue({
        category_name: getOneProduct?.data[0].category_name,
      });
    }
  }, [getOneProduct]);
  //handle upload image
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

  useEffect(() => {
    if (getOneProduct) {
      const productData = getOneProduct?.data[0];
      form.setFieldsValue({
        name: productData.product_name,
        category_id: productData.category_id,
        price: productData.product_price,
        desc: productData.product_description,
        size_id: productData.size_id,
        color_id: productData.color_id,
        image: productData.image[0],
        outstan: productData.outstan,
        kho: productData.kho,
      });
    }
  }, [getOneProduct]);
  //
  const onFinish = (product: any) => {
    const data = {
      name: product?.name,
      category_id: product.category_id,
      // image: uploadedImages,
      price: product?.price,
      desc: product.desc,
      size_id: product?.size_id,
      color_id: product?.color_id,
      outstan: product?.outstan,
      kho: product?.kho,
    };
    updateProduct({ ...data, id: id })
      .unwrap()
      .then(() => {
        const data1 = {
          user_id: user?.user?.id,
          action: "Update Sản Phẩm",
          old_data: oldProduct,
          new_data: product?.name,
        };
        addAction(data1).unwrap();
        messageApi.open({
          type: "success",
          content:
            "Bạn đã Update product thành công. Chờ 3s để quay về quản trị",
        });
        form.resetFields();
        setTimeout(() => {
          navigate("/admin/product");
        }, 3000);
      });
  };
  const [open, setopen] = useState(false)

  const [updateimageproduct] = useUpdateImageProductMutation()
  const handleOk = () => {
    console.log(uploadedImages?.length);
    
    if (uploadedImages?.length <= 0) {
      messageApi.open({
        type: "error",
        content:
          "Bạn cần phải có ít nhất 1 ảnh!",
      });
      return
    } else {
      updateimageproduct({ image: uploadedImages, id: id })
        .unwrap()
        .then(() => {
          messageApi.open({
            type: "success",
            content:
              "Bạn đã Update image product thành công. Chờ 3s để quay về quản trị",
          });
          form.resetFields();
          setTimeout(() => {
            navigate("/admin/product");
          }, 3000);
        })
    }

  };

  const handleCancel = () => {
    setopen(false);
  };
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card mb-4">
          <h5 className="card-header">Cập nhật Sản Phẩm</h5>
          <Form
            className="card-body"
            style={{ marginTop: "50px" }}
            onFinish={onFinish}
            form={form}
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
                <Input className="form-control" id="html5-text-input" />
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
                <Select style={{ width: "100%" }} onChange={(e) => setCatId(e)}>
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
                ]}
              >
                <Input
                  className="form-control"
                  type="number"
                  id="html5-number-input"
                />
              </Form.Item>
            </div>

            <div className="mb-3 row">
              <label
                htmlFor="html5-datetime-local-input"
                className="col-md-2 col-form-label"
              >
                Màu
              </label>
              <Form.Item
                name="color_id"
                className="col-md-10"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống màu!",
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
                Kích cỡ
              </label>
              <Form.Item
                name="size_id"
                className="col-md-10"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống kích cỡ!",
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
                ]}
              >
                <Input
                  className="form-control"
                  type="number"
                  // placeholder="Kho"
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
                <TextArea className="form-control" id="html5-password-input" />
              </Form.Item>
            </div>

            <Modal
              title="Cập nhật hình ảnh"
              width={800}
              visible={open}
              onOk={handleOk}
              onCancel={handleCancel}

            >
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
            </Modal>
            <div style={{ display: "flex" }}>
              <div style={{ width: "80%", paddingLeft: "30px" }}>
                <Button
                  htmlType="submit"
                  className="btn btn-outline-primary"
                  style={{ height: "40px", marginTop: "20px", width: '90px' }}
                >
                  {contextHolder}
                  Sửa
                </Button> </div>
              <div style={{ height: "40px", marginTop: "20px", float: 'right', width: "30%" }}>
                <a onClick={() => setopen(true)}>Bạn muốn cập nhập hình ảnh sản phẩm này?</a>
              </div>

            </div>

          </Form>

        </div>
      </div>
    </>
  );
};

export default UpdateProduct;
