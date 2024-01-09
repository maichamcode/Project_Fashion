import { Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import { useGetProductsNoBlockQuery, useGetProductsQuery } from "../../../api/product";
import ListProductDetail from "./ListProductDetail";
import { SetStateAction, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import unidecode from 'unidecode';
const ListProduct = () => {
  const { data: dataProduct } = useGetProductsNoBlockQuery([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  // const filteredData = dataProduct?.data?.filter((item: any) =>
  //   item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const filteredData = dataProduct?.data?.filter((item: any) =>
    unidecode(item.product_name)
      .toLowerCase()
      .includes(unidecode(searchQuery).toLowerCase())
  );

  const paginatedData = searchActive
    ? filteredData
    : dataProduct?.data?.slice(startIndex, endIndex);

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <Link to="add" style={{ textDecoration: "none" }}>
          <Button
            className="menu-link menu-toggle"
            style={{ marginBottom: "10px", textDecoration: "none" }}
          >
            <i className="menu-icon tf-icons bx bx-plus"></i>
            <div data-i18n="Authentications">Thêm sản phẩm</div>
          </Button>
        </Link>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchActive(e.target.value !== "");
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="card">
          <h5 className="card-header">Danh sách sản phẩm</h5>

          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Tên sản phẩm</th>
                <th>Giá sản phẩm</th>
                <th>Danh mục</th>
                <th>Hình ảnh</th>
                <th>Màu</th>
                <th>Kích cỡ</th>
                <th>Kho</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((item: any) => (
                <ListProductDetail data={item} key={item.product_id} />
              ))}
            </tbody>
          </table>
          {searchActive ? null : ( // Hiển thị phân trang chỉ khi không có tìm kiếm
            <div
              style={{ marginTop: "10px", display: "flex" }}
              className="pagination-container"
            >
              <Pagination
                style={{ marginTop: "5px", marginBottom: "20px", width: "95%" }}
                current={currentPage}
                total={dataProduct?.data?.length || 0}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
              />
              <Link to="recyclebin">
                <DeleteOutlined
                  style={{
                    float: "right",
                    marginTop: "13px",
                    marginBottom: "20px",
                  }}
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ListProduct;
