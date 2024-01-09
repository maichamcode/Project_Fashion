import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useProductinCategoryQuery } from '../../../api/category'
import './CategoryChart.css'
const CategoryChart = () => {
    const { data: categoryproducts } = useProductinCategoryQuery(0)
    const COLORS = ['#0088FE', '#FF8042', 'pink', 'red', 'blue', 'green', 'yellow', 'violet', '#FFBB28'];
    const data = categoryproducts?.categoryCounts?.map((category: any) => ({
        "name": category?.category_name,
        "value": Number(category?.product_count)
    })) || []
    return (
        <>
            <div className="card-body" style={{ width: '100%' }}>
                <span className="chart-title" style={{textAlign: 'center' }}>
                    <p style={{ fontSize: '1em', marginTop: '5px', fontWeight: 'bold', }}>Danh mục</p> 
                </span>
                <PieChart width={135} height={145}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={0}
                        outerRadius={65}
                    >
                        {data.map((entry: any, index: any) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
              
            </div>
        </>
    )
}

export default CategoryChart