import { useEffect } from "react";
import { useGetAllCatQuery } from "../../../api/category";
import { useGetOneProductQuery } from "../../../api/product";



const TopProductSale = ({ data, onTotal, onCount }: any) => {
    const { data: oneproduct } = useGetOneProductQuery(data?.product_id)
    const { data: category } = useGetAllCatQuery('')
    const categoryName = category?.data?.find((id: any) => id?.category_id == oneproduct?.data[0]?.category_id)?.category_name
    const imageArray = oneproduct?.data[0]?.image[0]?.split(",");
    useEffect(() => {
        onTotal(oneproduct?.data[0]?.product_price)

    }, [oneproduct?.data[0]?.product_price])
    useEffect(() => {
        onCount(data?.count)
    }, [data?.count])
    return (
        <>
            <li className="d-flex mb-4 pb-1">
                <div className="avatar flex-shrink-0 me-3">
                    <img src={imageArray ? imageArray[0] : ""} alt="" />
                </div>
                <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div className="me-2">
                        <h6 className="mb-0">{oneproduct?.data[0]?.product_name}</h6>
                        <small className="text-muted">{categoryName}</small>
                    </div>
                    <div className="user-progress">
                        <small className="fw-semibold">{data?.count}</small>
                    </div>
                </div>
            </li>
        </>
    )
}

export default TopProductSale