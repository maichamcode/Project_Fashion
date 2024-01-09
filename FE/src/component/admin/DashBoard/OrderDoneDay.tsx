
import { useGetOrderReceivedDayQuery, useGetOrderReceivedQuery } from '../../../api/order'
import OrderDoneDetailDay from './OrderDoneDetailDay'
import { Spin } from 'antd'

const OrderDoneDay = () => {
    const { data: orderdone, isLoading } = useGetOrderReceivedDayQuery(0)

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

                                </Spin> </div> : <>{orderdone?.orders?.map((data: any) => <OrderDoneDetailDay data={data} />)}</>  }

                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderDoneDay