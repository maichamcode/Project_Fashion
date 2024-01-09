import { Skeleton } from "antd";
import { useGetAllProductOffQuery } from "../../../api/product"

import io from "socket.io-client";
import { useEffect } from "react";
import LitProductOutStanDetail from "./ListProductOutstanDetail";
const socket = io("http://localhost:8080");

const ListProductOutStan = () => {
    const { data: product, isLoading, refetch } = useGetAllProductOffQuery('')
    useEffect(() => {
        socket.on("updatesale", (data: any) => {
            console.log(data);
            
            refetch();
        });
        return () => {
            socket.disconnect();
        };
    }, [refetch]);
    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <h5 className="card-header">Quản lý sản phẩm nổi bật</h5>
                    <div className="table-responsive text-nowrap">
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    <th>Mã sản phẩm</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Giá sản phẩm</th>
                                    <th>Trạng thái nổi bật</th>
                                </tr>
                            </thead>
                            {isLoading ? <Skeleton /> : <><tbody className="table-border-bottom-0">
                                {product?.data.map((data: any) => (
                                    <LitProductOutStanDetail key={data?.product_id} data={data} />
                                ))}
                            </tbody></>}

                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListProductOutStan