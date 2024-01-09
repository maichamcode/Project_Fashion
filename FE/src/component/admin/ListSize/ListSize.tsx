import { Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { useGetSizeQuery } from "../../../api/size";
import ListSizeDetail from "./ListSizeDetail";

const ListSize = () => {
    const { data: dataSize } = useGetSizeQuery([]);
    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <Link to="add" style={{ textDecoration: "none" }}>
                    <Button className="menu-link menu-toggle" style={{ marginBottom: '10px' }}>
                        <i className="menu-icon tf-icons bx bx-plus"></i>
                        <div data-i18n="Authentications">Thêm Size</div>
                    </Button>
                </Link>
                <div className="card">
                    <h5 className="card-header">Danh sách size</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID Size</th>
                                <th>Tên Size</th>
                                {/* <th>Hành động</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {dataSize?.data?.map((item: any) => (
                                <ListSizeDetail data={item} />
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </>
    );
};

export default ListSize;
