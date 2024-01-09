import { Button, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import { useGetRecyclebinQuery } from "../../../api/recyclebin";
import DataRecyclebin from "./DataRecyclebin";
import { SetStateAction, useState } from "react";
import { useGetProductsBlockQuery } from "../../../api/product";

const ListRecyclebin = () => {
  const { data: dataRecycle } = useGetProductsBlockQuery([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page
  const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = dataRecycle?.data?.slice(startIndex, endIndex);
  // console.log(paginatedData);

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <h5 className="card-header">Thùng rác</h5>
          <div className="card-body">
            <div className="table-responsive text-nowrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tên Người Dùng</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Hình ảnh</th>
                    <th>Màu </th>
                    <th>Kích cỡ</th>
                    <th>Kho</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.map((item: any) => (
                    <DataRecyclebin data={item} />
                  ))}
                </tbody>
              </table>
              <div
                style={{ marginTop: "10px" }}
                className="pagination-container"
              >
                <Pagination
                  current={currentPage}
                  total={dataRecycle?.data?.length || 0}
                  pageSize={itemsPerPage}
                  onChange={handlePageChange}
                />{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListRecyclebin;
