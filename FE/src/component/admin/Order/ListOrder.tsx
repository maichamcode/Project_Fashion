import { Button, Form, Skeleton, message, Spin, Select, Pagination } from "antd";
import { useGetAllOrderQuery, useGetSearchOrderMutation } from "../../../api/order"
import AdminOrderDetail from "./AdminOrderDetail";
import io from 'socket.io-client';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const socket = io('http://localhost:8080');

const ListOrder = () => {
    const [search, setSearch] = useState<any>(null);
    const [order, setOrder] = useState<any>();
    const [getSearch] = useGetSearchOrderMutation();
    const { data: orders, isLoading, refetch } = useGetAllOrderQuery('');
    const [form] = Form.useForm();
    const [searchLoading, setSearchLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const handleSearch = () => {
        setSearchLoading(true);
        if (order === "") {
            setSearch(null);
        } else if (order) {
            const searchData = {
                order_id: order,
            };
            getSearch(searchData)
                .unwrap()
                .then((data) => {
                    console.log("Search results:", data);
                    setSearch(data);
                    messageApi.open({
                        type: "success",
                        content: data.message,
                    });

                })
                .catch((err:any) => {
                    messageApi.open({
                        type: "error",
                        content: "Không tìm thấy đơn hàng",
                    });
                })
                .finally(() => {
                    setSearchLoading(false);
                });

        }
    };
    const counts = {
        cancell: orders?.orders.filter((order: { status: number; }) => order.status == 0).length,
        confirm: orders?.orders.filter((order: { status: number; }) => order.status == 1).length,
        awaitshipper: orders?.orders.filter((order: { status: number; }) => order.status == 2).length,
        shipping: orders?.orders.filter((order: { status: number; }) => order.status == 3).length,
        shipsuccess: orders?.orders.filter((order: { status: number; }) => order.status == 4).length,
        received: orders?.orders.filter((order: { status: number; }) => order.status == 5).length,
        complete: orders?.orders.filter((order: { status: number; }) => order.status == 6).length,
        bomd: orders?.orders.filter((order: { status: number; }) => order.status == 7).length,
    };
    useEffect(() => {
        socket.on('addorder', (data) => {
            alert(data.message);
            refetch();
        });
        socket.on('cancell', (data) => {
            alert(data.message);
            refetch();
        });
        return () => {
            socket.disconnect();
        };
    }, [refetch]);
    const navigate = useNavigate()
    const handleChange = (value: any) => {
        if (value === 'confirm') {
            navigate('/admin/order/confirm');
        } else if (value === 'awaitshipper') {
            navigate('/admin/order/awaitshipper');
        } else if (value === 'received') {
            navigate('/admin/order/received');
        } else if (value === 'complete') {
            navigate('/admin/order/complete');
        } else if (value === 'cancell') {
            navigate('/admin/order/cancell');
        } else if (value === 'bomd') {
            navigate('/admin/order/bomd');
        } else if (value === 'all') {
            navigate('/admin/order');
        } else if (value === 'shipping') {
            navigate('/admin/order/shippings');
        }
    };
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 15;
    const totalProducts = orders?.orders?.length;
    console.log(totalProducts);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, totalProducts);
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const currentProducts = orders?.orders?.slice(startIndex, endIndex);

    const onPageChange = async (page: any) => {
        setCurrentPage(page);
    };
    return (
        <>
            {contextHolder}

            <div className="container-xxl flex-grow-1 container-p-y" >
                <div className="card" >
                    <h5 className="card-header" style={{ display: 'flex' }}>
                        <div className="input-group ">
                            <Form form={form} onFinish={handleSearch} style={{ width: "85%" }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm đơn hàng theo mã đơn hàng"
                                    onChange={(e: any) => setOrder(e?.target?.value)}
                                />
                            </Form>
                        </div>
                        <div style={{ width: '15%' }} >
                            <Select style={{ height: '40px', width: '100%' }} defaultValue="all"
                                options={[
                                    {
                                        value: 'all',
                                        label: `Tất cả`,
                                    },
                                    {
                                        value: 'confirm',
                                        label: `Đã đặt hàng (${counts?.confirm ? counts?.confirm : 0})`,
                                    },
                                    {
                                        value: 'awaitshipper',
                                        label: `Đã xác nhận (${counts?.awaitshipper ? counts?.awaitshipper : 0})`,
                                    }, {
                                        value: 'shipping',
                                        label: `Vận chuyển (${counts?.awaitshipper ? counts?.shipping : 0})`,
                                    },
                                    {
                                        value: 'received',
                                        label: `Đã nhận hàng  (${counts?.received ? counts?.received : 0})`,
                                    },
                                    {
                                        value: 'complete',
                                        label: `Hoàn tất  (${counts?.complete ? counts?.complete : 0})`,
                                    },
                                    {
                                        value: 'cancell',
                                        label: `Đã huỷ hàng  (${counts?.cancell ? counts?.cancell : 0})`,
                                    },

                                    {
                                        value: 'bomd',
                                        label: `Không nhận  (${counts?.bomd ? counts?.bomd : 0})`,
                                    },
                                ]} onChange={handleChange}>
                            </Select>
                        </div>
                    </h5>
                    <div className="table-responsive text-nowrap">
                        {searchLoading ? (
                            <Spin tip="Loading..." size="large">
                                <div style={{ minHeight: "300px" }} />
                            </Spin>
                        ) : (
                            <table className="table">

                                <thead className="table-light" style={{ width: "100%" }}>
                                    <tr>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Tên Khách Hàng</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Mã đơn hàng</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Số điện thoại</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Số tiền</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Thời gian đặt</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Phương thức thanh toán</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Trạng thái đơn hàng</th>
                                        <th style={{ width: '11.1%', fontSize: '10px' }}>Hành động</th>
                                        <th style={{ width: '11.1%', fontSize: '12px' }}>Chi tiết</th>
                                    </tr>
                                </thead>

                                <tbody className="table-border-bottom-0" style={{ width: "100%" }}>
                                    {search ? ( // Render search results if search is not null
                                        search?.data?.map((order: any) => (
                                            <AdminOrderDetail key={order.order_id} data={order} />
                                        ))
                                    ) : (
                                        // Render original order list if search is null
                                        isLoading ? <Skeleton /> : (
                                            currentProducts?.map((order: any) => (
                                                <AdminOrderDetail key={order?.order_id} data={order} />
                                            ))
                                        )
                                    )}
                                </tbody>

                            </table>
                        )}


                    </div>
                </div>
                {totalProducts > productsPerPage && (
                    <div className="pagination" style={{ paddingTop: '50px' }}>
                        <Spin spinning={isLoading} size="large">
                            <Pagination
                                current={currentPage}
                                pageSize={productsPerPage}
                                total={totalProducts}
                                onChange={onPageChange}
                            />
                        </Spin>
                    </div>
                )}
            </div>
        </>
    )
}
export default ListOrder