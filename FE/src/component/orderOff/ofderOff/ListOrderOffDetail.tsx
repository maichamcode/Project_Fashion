import { useEffect, useState } from "react";
import { useGetSaleQuery } from "../../../api/sale";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { useGetSizeQuery } from "../../../api/size";
import { Select } from "antd";
import { Option } from "antd/es/mentions";
import { useGetColorQuery } from "../../../api/color";
import { message } from 'antd';
const ListOrderOffDetail = ({ data, index }: any) => {
    const { data: sale } = useGetSaleQuery("");
    const saleName = sale?.data?.find(
        (id: any) => id?.sale_id == data?.sale_id
    )?.sale_distcount;
    const totalSale = (data?.product_price * saleName) / 100;
    const total = data?.product_price - totalSale;
    const [totals, settotals] = useState<any>()
    useEffect(() => {
        if (total) {
            settotals(total);
        } else {
            settotals(data?.product_price)
        }
    }, [total])
    const imageArray = data?.image[0]?.split(",");
    const { data: size } = useGetSizeQuery('')
    const { data: color } = useGetColorQuery('')

    const handleAddToCart = () => {
        if (selectedSize && selectedColor) {
            const productInfo = {
                product_name: data?.product_name,
                totals,
                size: selectedSize,
                color: selectedColor,
                quantity: 1,
            };
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingProductIndex = existingCart.findIndex(
                (item: any) =>
                    item.product_name === productInfo.product_name &&
                    item.size === productInfo.size &&
                    item.color === productInfo.color
            );

            if (existingProductIndex !== -1) {
                // Nếu sản phẩm đã tồn tại, cập nhật quantity
                existingCart[existingProductIndex].quantity += 1;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
                existingCart.push(productInfo);
            }

            localStorage.setItem('cart', JSON.stringify(existingCart));
        } else {
            // Hiển thị thông báo dạng message API nếu kích thước hoặc màu sắc chưa được chọn
            message.error('Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng');
        }
    }

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    return (
        <>
            <tr>
                <td>{index + 1}</td>
                <td ><i className="fab fa-angular fa-lg text-danger me-3"></i> <strong>{data?.product_name}</strong></td>
                <td style={{ width: '10%', }} >
                    <ul style={{ width: '100%', height: '100%' }}>
                        <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            style={{ width: '40%', height: '20%' }}
                            title="Lilian Fuller"
                        >
                            <img src={imageArray ? imageArray[0] : ""} alt="Avatar" style={{ width: '100%', height: '100%' }} />
                        </li>
                    </ul>
                </td>
                <td><CurrencyFormatter amount={totals} /></td>
                <td style={{ width: '10%' }}>
                    <Select
                        style={{ width: '100%' }}
                        onChange={value => setSelectedSize(value)} // Lưu giá trị khi có thay đổi
                    >
                        {size?.data?.map((data: any) => (
                            <Option key={data.size_id} value={data.size_id}> {data?.size_name}</Option>
                        ))}

                    </Select>
                </td>
                <td style={{ width: '10%' }}>
                    <Select
                        style={{ width: '100%' }}
                        onChange={value => setSelectedColor(value)}
                    >
                        {color?.data?.map((data: any) => (
                            <Option key={data.color_id} value={data.color_id}> {data?.color_name}</Option>
                        ))}

                    </Select>
                </td>
                <td>
                    <button onClick={handleAddToCart}>Thêm</button>
                </td>
            </tr>
        </>
    )
}

export default ListOrderOffDetail
