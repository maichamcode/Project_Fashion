import { Button, Popconfirm, message } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetOneUserQuery } from "../../../api/auth";
import { UserOutlined } from "@ant-design/icons";
import { useDeleteProductRecyclebinMutation, useRestoreProductMutation } from "../../../api/recyclebin";
import { useGetOneSizeQuery } from "../../../api/size";
import { useGetOneColorQuery } from "../../../api/color";
import { useGetOneCatQuery } from "../../../api/category";
import ColorProductRecyclebin from "./ColorProductRecyclebin";
import CategoryProductRecyclebin from "./CategoryProductRecyclebin";
import SizeProductRecyclebin from "./SizeProductRecyclebin";
import { useAddActionMutation } from "../../../api/actions";
import { useCancellHideProductMutation } from "../../../api/product";

const DataRecyclebin = ({ data }: any) => {

    const [restoreProduct, { isLoading: isDeleting }] = useCancellHideProductMutation();
    const [deleteProduct, { isLoading: isDeletingRecyclebin }] = useDeleteProductRecyclebinMutation();
    const [addAction] = useAddActionMutation()
    const imageArray = data?.image[0]?.split(",");
    const [messageApi, contextHolder] = message.useMessage();

    const ngay = data?.deleted_at?.substring(1, 11);
    const gio = data?.deleted_at?.substring(12, 20);
    const user = JSON.parse(localStorage.getItem("user")!);


    const productName = data?.product_name;
    const productPrice = data?.product_price;
    const productKho = data?.kho;


    const handleRestore = () => {
        const productId = data?.product_id;
        const token = user?.accessToken;
        const oldProductName = data?.product_name;
        console.log("name: ", oldProductName);
        if (isDeleting) {
            return;
        }

        restoreProduct({ id: productId, token: token })
            .unwrap()
            .then(() => {
                const actionData = {
                    user_id: user?.user?.id,
                    action: "Bỏ ẩn sản phẩm",
                    old_data: null,
                    new_data: data?.product?.product_name
                };
                addAction(actionData);
                messageApi.open({
                    type: "success",
                    content: "Đã khôi phục sản phẩm này!",
                });
                window.location.href=('/admin/product/recyclebin')
            })
            .catch((error) => {
                messageApi.error("Khôi phục sản phẩm không thành công: " + error.message);
            });
    };

    const handleDelete = () => {

        if (isDeletingRecyclebin) {
            return; // Đang xử lý việc xoá, không cho phép thực hiện thêm lần nữa
        }

        // Gọi mutation để xoá sản phẩm
        deleteProduct(data?.id)
            .unwrap()
            .then(() => {
                const actionData = {
                    user_id: data?.user_id,
                    // ID của người thực hiện hành động
                    action: "Xóa sản phẩm thùng rác", // Loại hành động
                    old_data: productName,
                    new_data: null// ID của sản phẩm bị xóa
                };
                addAction(actionData)
                console.log(actionData);

                messageApi.open({
                    type: "success",
                    content: "Đã xoá vĩnh viễn sản phẩm này!",
                });
            })
            .catch((error) => {
                messageApi.error("Xoá vĩnh viễn sản phẩm không thành công: " + error.message);
            });
    };



    return (
        <>
            {contextHolder}
            <tr>
                <td>
                    <strong>
                        <UserOutlined style={{ marginRight: "15px", color: 'blue' }} />
                        {user?.user?.user_lastname} {user?.user?.user_firstname}
                    </strong>
                </td>
                <td>
                    <i className="fab fa-lg text-danger me-3"></i>{" "}
                    <strong>{productName}</strong>
                </td>
                <td>{productPrice}</td>
                <td>
                    <CategoryProductRecyclebin data={data} />
                </td>
                <td>
                    <img src={imageArray[0]} alt="Avatar" width={"100%"} />
                </td>
                <td>
                    {data?.color_id?.map((item: any) => (
                        <ColorProductRecyclebin data={item} />
                    ))}
                </td>
                <td>
                    {data?.size_id?.map((item: any) => (
                        <SizeProductRecyclebin data={item} />
                    ))}
                </td>


                <td>{productKho}</td>
                <td>
                    <div className="dropdown">
                        <Popconfirm
                            title="Khôi phục sản phẩm"
                            description="Xác nhận khôi phục sản phẩm?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={handleRestore}
                        >
                            <Button
                                className="btn btn-outline-success"
                                style={{ fontSize: "12px" }}
                            >
                               Khôi phục
                            </Button>
                        </Popconfirm>
                        <span> </span>
                    </div>
                </td>
            </tr>
        </>
    );
};

export default DataRecyclebin;