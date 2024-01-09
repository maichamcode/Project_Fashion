import { UserOutlined } from "@ant-design/icons";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { Button, Select, Switch, message } from 'antd';
import { useEffect, useState } from "react";
import { useAddActionMutation } from "../../../api/actions";
import { useGetProductsQuery, useUpdateOutstanMutation } from "../../../api/product";

const LitProductOutStanDetail = ({ data }: any) => {
    const { data: products } = useGetProductsQuery('');
    const user = JSON.parse(localStorage.getItem('user')!);
    const product = products?.data.find((product: any) => product.product_id === data.product_id);
    const isOutstan = product?.outstan === true;
    const [loading, setLoading] = useState(false);
    // const OutStan = product?.data[0]?.outstan;
    // console.log(OutStan);

    const [Outstan, setOutstan] = useState<any>();
    console.log(Outstan);

    const [check, setCheck] = useState(false);
    const [updateOutstan] = useUpdateOutstanMutation();
    const [addAction] = useAddActionMutation();

    useEffect(() => {
        if (Outstan) {
            setCheck(false);
        } else {
            setCheck(true);
        }
    }, [Outstan]);

    const [messageApi, contextHolder] = message.useMessage();

    const HandleUpdateOutstan = (checked: boolean) => {
        console.log(checked);

        setLoading(true);
        const data1 = {
            id: data?.product_id,
            outstan: checked
        };

        updateOutstan(data1)
            .unwrap()
            .then((data: any) => {
                const actionText = checked ? "Đặt sản phẩm nổi bật" : "Bỏ sản phẩm nổi bật";
                if (checked) {
                    const data2 = {
                        user_id: user?.user?.id,
                        action: "Thêm sản phẩm nổi bật",
                        old_data: null,
                        new_data: "Sản phẩm đang nổi bật",
                    };
                    addAction(data2);
                } else {
                    const data2 = {
                        user_id: user?.user?.id,
                        action: "Gỡ sản phẩm nổi bật",
                        old_data: "Sản phẩm đang nổi bật",
                        new_data: "Sản phẩm không nổi bật",
                    };
                    addAction(data2);
                }


                messageApi.success('Cập nhật trạng thái nổi bật thành công!');
            })
            .finally(() => {
                setLoading(false); // Kết thúc hiệu ứng loading
            })
    };

    const total = Number(data?.product_price);
    const [totalSum, setTotalSum] = useState<any>();

    useEffect(() => {
        if (total) {
            setTotalSum(total);
        } else {
            setTotalSum(data?.product_price);
        }
    }, [total]);

    return (
        <>
            {contextHolder}
            <tr>
                <td><strong>#{data?.product_id}</strong></td>
                <td>{data?.product_name}</td>
                <td width="25%">
                    <CurrencyFormatter amount={data?.product_price} />

                </td>
                <td >
                    <Switch
                        checked={isOutstan}
                        onChange={HandleUpdateOutstan}
                        style={{ marginLeft: "50px" }}
                        loading={loading}
                    />
                </td>


                <td></td>
                <td></td>
            </tr>
        </>
    )
}

export default LitProductOutStanDetail;