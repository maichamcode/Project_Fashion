import { UserOutlined } from '@ant-design/icons'
import React from 'react'
import { useGetOrderPlaceQuery } from '../../../api/order'
import OrderPlaceDetailDay from './OrderPlaceDetailDay'
import { Spin } from 'antd'

type Props = {}

const OrderPlaceDay = (props: Props) => {
    const { data: orderplace, isLoading } = useGetOrderPlaceQuery(0)

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <h5 className="card-header">Danh Sách Đặt Hàng</h5>
                    <div className="table-responsive text-nowrap">
                        <table className="table">
                            <thead className="table-light">

                                <tr>
                                    <th>Tên Khách Hàng</th>
                                    <th>Số tiền</th>
                                    <th>Thời gian đặt</th>
                                    <th>Phương thức thanh toán</th>
                                    <th>Trạng thái đơn hàng</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                {isLoading ? <div style={{ minHeight: "70px", marginLeft: '250%', marginTop: '10px' }}><Spin tip="Loading..." size="large">
                                </Spin> </div> : <> {orderplace?.orders?.map((data: any) => <OrderPlaceDetailDay data={data} />)}</>}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderPlaceDay