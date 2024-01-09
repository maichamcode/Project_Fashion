import { Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import ListCategoryDetail from "./ListCategoryDetail";
import {
  useGetAllCatNoPaginationQuery,
  useGetCategoryQuery,
} from "../../../api/category";

const ListCategory = () => {
  const { data: dataCategory } = useGetAllCatNoPaginationQuery([]);
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <Link to="add"  style={{ textDecoration:"none" }}>
          <Button className="menu-link menu-toggle" style={{ marginBottom: '10px' }}>
            <i className="menu-icon tf-icons bx bx-plus"></i>
            <div data-i18n="Authentications">Thêm danh mục</div>
          </Button>
        </Link>
        <div className="card">
          <h5 className="card-header">Danh sách danh mục</h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID danh mục</th>
                <th>Tên danh mục</th>
                <th>Hình ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {dataCategory?.data?.map((item: any) => (
                <ListCategoryDetail data={item} />
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
};

export default ListCategory;
