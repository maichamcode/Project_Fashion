import { useAddToCartMutation } from "../../../api/cart";
import { useGetAllProductOffQuery } from "../../../api/product"
import ListCategoryDetail from "../../admin/ListCategory/ListCategoryDetail";
import ListOrderOffDetail from "./ListOrderOffDetail";

const ListOrderOff = () => {
    const { data: productoff } = useGetAllProductOffQuery('')
    console.log(productoff?.data);
    return (
        <>
            <div className="card">
                <h5 className="card-header">Hoverable rows</h5>
                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr style={{ fontWeight: 'bold' }}>

                                <th>STT</th>
                                <th>Tên Sản Phẩm</th>
                                <th>Ảnh</th>
                                <th>Giá Tiền</th>
                                <th>Kích Cỡ</th>
                                <th>Màu Sắc</th>
                                <th>action</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {productoff?.data?.map((data: any,index:any) => (<ListOrderOffDetail data={data} index={index}/>))}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ListOrderOff