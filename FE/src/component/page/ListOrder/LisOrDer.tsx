
import { useGetOneOrderUserQuery } from "../../../api/order";
import ListOrderDetail from "./ListOrderDetail";

const LisOrDerUser = () => {
    const user = JSON.parse(localStorage.getItem('user')!)
    const { data: order } = useGetOneOrderUserQuery(user?.user?.id)

    return (
        <>
            <section className="breadcrumb " style={{ marginTop: '70px', backgroundColor: '#eeee' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="breadcrumb_iner">
                                <div className="breadcrumb_iner_item" style={{ marginTop: '30px' }}>
                                    <h2>List Order User</h2>
                                    <p>
                                        Trang chủ <span>-</span> Đơn hàng của tôi
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section
                className="favorite_area "
                style={{ padding: "60px", backgroundColor: "#f5f5f5" }}
            >
                <div className="container">
                    <div className="row justify-content-center mb-3">
                        {order?.data?.map((data: any) => <ListOrderDetail data={data}/>)}
                    </div>

                </div>
            </section>
        </>
    )
}

export default LisOrDerUser