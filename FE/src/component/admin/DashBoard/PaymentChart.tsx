import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useCountOrderOffQuery, useCountOrderOnlineQuery } from '../../../api/order';
const PaymentChart = () => {
    const { data: online } = useCountOrderOnlineQuery(0)
    const { data: offline } = useCountOrderOffQuery(0)
    const data = [
        { name: 'Online', value: Number(online?.soDonHangThanhToanOnline[0]?.donhangthanhtoanonline) },
        { name: 'Ship Cod', value: Number(offline?.data[0]?.order_payment_offline) },
    ];
    
    const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#FF8042'];
    return (
        <>
            <div className="card-body" style={{ width: '100%' }}>
                <span className="chart-title" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1em', marginTop: '5px', fontWeight: 'bold', }}>Kiểu thah toán</p>
                </span>
                <PieChart width={135} height={145}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={65}
                        fill="#8884d8"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}  />
                        ))}
                    </Pie>
                    <Tooltip />
                    {/* <Legend/> */}
                </PieChart>
               
            </div>
        </>
    )
}

export default PaymentChart