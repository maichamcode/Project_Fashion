import React from 'react'
import { Area, Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts'
import { useGetTotalPerDayQuery } from '../../../api/dashboard'


const TotalperdayChart = () => {
    const { data: topproductperday } = useGetTotalPerDayQuery(0)
    console.log("7 ngay", topproductperday);
    const data = topproductperday?.data?.map((product: any) => ({
        "name": product?.date,
        "Total": Number(product?.total_amount_day)
    })) || []

    return (
        <>
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="card" style={{ paddingLeft: '5px' }}>
                        <span className="chart-title" style={{ fontSize: '1em', marginTop: '5px', fontWeight: 'bold' }}>
                            Doanh thu trong 7 ngày
                        </span>
                        <ComposedChart width={400} height={250} data={data}
                            margin={{ top: 20, right: 54, left: -10, bottom: 5 }} >
                            <XAxis dataKey="name"  style={{ fontSize: '0.8em' }}/>
                            <YAxis  style={{ fontSize: '0.8em' }}/>
                            <Tooltip />
                            {/* <Legend /> */}
                            <CartesianGrid stroke="#f5f5f5" />
                         
                            <Bar dataKey="Total" barSize={20} fill="#413ea0"  />
                        </ComposedChart>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TotalperdayChart