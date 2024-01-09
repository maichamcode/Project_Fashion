import { Bar, BarChart, CartesianGrid, LabelList, Legend, Tooltip, XAxis, YAxis } from "recharts"
import { useGetTotalPerMonthQuery } from "../../../api/dashboard"

const ProductChart = () => {
    const { data: topproductpermonth } = useGetTotalPerMonthQuery(0)
    const formatCurrency = (value: any) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const data = topproductpermonth?.data?.map((product: any) => ({
        "name": product?.month,
        "Total": Number(product?.total_amount_month)
    })) || [];
    return (
        <>
            <div className="card" style={{ width: '100%' }}>
                <div style={{ marginTop: '15px' }}>
                    <div style={{ width: '100%' }}>
                        <span className="chart-title" style={{ marginLeft: '20px', fontSize: '1em', fontWeight: 'bold' }}>
                            Doanh Thu Trong 1 Năm
                        </span>
                        <div className="card-body" style={{ width: '100%' }}>

                            <BarChart width={1100} height={250} data={data} >
                                <CartesianGrid strokeDasharray="3" />
                                <XAxis dataKey="name" style={{ fontSize: '0.8em' }} />
                                <YAxis style={{ fontSize: '0.8em' }} />
                                <Tooltip formatter={formatCurrency} />
                                <Bar dataKey="Total" fill="#82ca9d" />
                            </BarChart>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductChart