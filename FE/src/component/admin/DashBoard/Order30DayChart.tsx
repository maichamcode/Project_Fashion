
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts"
import { useGetOrder7DayQuery } from "../../../api/order"


const Order30DayChart = () => {
    const { data: order7day } = useGetOrder7DayQuery(0)
    const data = order7day?.data?.map((data: any) => ({
        "name": data?.date,
        "order": Number(data?.total_products)
    })) || []

    return (
        <>
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="card" style={{ paddingLeft:'5px'}}>
                        <span className="chart-title" style={{ fontSize: '1em', marginTop: '5px', fontWeight: 'bold' }}>
                            Đơn hàng trong 7 ngày qua
                        </span>
                        <LineChart width={400} height={180} data={data}
                            margin={{ top: 20, right: 54, left: -34, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" style={{fontSize:'0.8em'}} />
                            <Tooltip />
                            <YAxis style={{ fontSize: '0.8em' }} />
                            <Line type="monotone" dataKey="order" stroke="#8884d8" />
                        </LineChart>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Order30DayChart