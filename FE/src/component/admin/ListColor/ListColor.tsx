import { Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { useGetColorQuery } from "../../../api/color";
import ListColorDetail from "./ListColorDetail";

const ListColor = () => {
    const { data: dataColor } = useGetColorQuery([]);
    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <Link to="add" style={{ textDecoration: "none" }}>
                    <Button className="menu-link menu-toggle" style={{ marginBottom: '10px' }}>
                        <i className="menu-icon tf-icons bx bx-plus"></i>
                        <div data-i18n="Authentications">Thêm Color</div>
                    </Button>
                </Link>
                <div className="card">
                    <h5 className="card-header">Danh sách Màu</h5>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID Màu</th>
                                <th>Tên Màu</th>
                                {/* <th>Hành động</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {dataColor?.data?.map((item: any) => (
                                <ListColorDetail data={item} />
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </>
    );
};

export default ListColor;
