
import { useGetOrderDoneDayQuery, useGetOrderPaceDayQuery, useGetOrderWatingDayQuery } from "../../../api/order"
import { Link } from 'react-router-dom';


const OrderDay = () => {
    const { data: orderPlaceDay } = useGetOrderPaceDayQuery(0)
    const { data: orderWatingDay } = useGetOrderWatingDayQuery(0)
    const { data: orderDoneDay } = useGetOrderDoneDayQuery(0)
    return (
        <>
            <div className="card">
                <div >
                    <div style={{ width: '100%' }}>
                        <div className="card-body" style={{ width: '100%' }}>
                            <h5 className="card-title text">
                                Đơn Hàng Ngày Hôm Nay
                            </h5>
                            <div style={{ display: 'flex', width: '100%', marginTop: '30px' }}>
                                <p className="mb-4" style={{ width: '33%', textAlign: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.5em' }}><Link to="placeorder">{orderPlaceDay ? orderPlaceDay?.data : 0}</Link></span><p>Đơn Hàng Chờ Xác Nhận</p>
                                </p>
                                <p className="mb-4" style={{ width: '33%', textAlign: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.5em' }}><Link to="watingorder">{orderWatingDay ? orderWatingDay?.data : 0}</Link></span><p >Đang Chờ Vận Chuyển</p>
                                </p>
                                <p className="mb-4" style={{ width: '33%', textAlign: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.5em' }}><Link to="doneorder">{orderDoneDay ? orderDoneDay?.data : 0}</Link></span> <p >Đơn Hàng Hoàn Tất</p>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default OrderDay