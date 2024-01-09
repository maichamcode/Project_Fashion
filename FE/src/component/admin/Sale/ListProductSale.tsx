import { Button, Skeleton, Modal, Space } from "antd";
import { useGetAllProductOffQuery } from "../../../api/product"
import LitProductSaleDetail from "./LitProductSaleDetail";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { CalendarOutlined, PercentageOutlined, PlusOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
import { useGetSaleQuery } from "../../../api/sale";
import UpdateModelSale from "./UpdateModelSale";
const socket = io("http://localhost:8080");

const ListProductSale = () => {
    const { data: sale } = useGetSaleQuery("")
    console.log("sale: ", sale);
    const [showRevenue, setShowRevenue] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        console.log('okok');
        setIsModalOpen(true);
        console.log(isModalOpen);
    };




    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const { data: product, isLoading, refetch } = useGetAllProductOffQuery('')
    useEffect(() => {
        socket.on("updatesale", (data: any) => {
            // console.log(data);

            refetch();
        });
        return () => {
            socket.disconnect();
        };
    }, [refetch]);
    const [check, setcheck] = useState<any>()
    const [id, setid] = useState<any>()
    const HandleClick = (id: any) => {
        setcheck(true)
        setid(id)
        // return 
    }
    const handelcheck = (data: any) => {
        setcheck(data)
    }
    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <Link to="add" style={{ textDecoration: "none" }}>
                    <Button className="menu-link menu-toggle" style={{ marginBottom: '10px' }}>
                        <i className="menu-icon tf-icons bx bx-plus"></i>
                        <div data-i18n="Authentications">Thêm % giảm giá</div>
                    </Button>
                </Link>
                <div className="card">
                    <h5 className="card-header">Quản lý sản phẩm sale</h5>
                    <Button
                        type="primary"
                        onClick={() => showModal()}
                        icon={<UnorderedListOutlined />}
                        style={{
                            marginLeft: '270px',
                            top: '-40px',
                            backgroundColor: 'transparent',
                            color: '#1890ff',
                        }}
                    />
                    {check ? <UpdateModelSale id={id} onCheck={handelcheck} /> : <Modal
                        open={isModalOpen}
                        onCancel={handleCancel}
                        width={500}
                    >
                        <Space direction="vertical">


                            <div className="doanhthu" style={{ top: '-50px', paddingRight:"40px" }}>
                                <h4>Danh sách loại giảm giá:</h4>
                                <table className="table" style={{ marginLeft: '40px' }}>
                                    <thead className="table-light">
                                        <tr>
                                            <th>Tên hình thức giảm giá</th>
                                            <th>Số % giảm</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-border-bottom-0">
                                        {
                                            sale?.data?.map((data: any) => (
                                                <tr>
                                                    <td>{data?.sale_name}</td>
                                                    <td>{data?.sale_distcount}%</td>
                                                    {/* Các cột khác nếu cần */}
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-success"
                                                            style={{ fontSize: "12px" }}
                                                            onClick={() => HandleClick(data?.sale_id)}
                                                        >
                                                            Sửa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </Space>
                    </Modal>}

                    <div className="table-responsive text-nowrap">
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    <th>Mã sản phẩm</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá sản phẩm</th>
                                    <th>Giảm giá</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            {isLoading ? <Skeleton /> : <><tbody className="table-border-bottom-0">
                                {product?.data.map((data: any) => (
                                    <LitProductSaleDetail key={data?.product_id} data={data} />
                                ))}
                            </tbody></>}

                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListProductSale