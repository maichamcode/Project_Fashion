import React, { SetStateAction, useState } from "react";
import { useGetBillQuery } from "../../../api/bill";
import { Pagination } from "antd";
import ListBillDetail from "./ListBillDetail";

type Props = {};

const ListBill = (props: Props) => {
  const { data: getBill } = useGetBillQuery("");
  console.log(getBill);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = getBill?.data?.slice(startIndex, endIndex);
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <h5 className="card-header">Danh Sách Bill</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Bill_id</th>
                <th>Order_id</th>
                <th>Số điện thoại</th>
                <th>Tỉnh</th>
                <th>Huyện</th>
                <th>Xã</th>
                <th>Địa chỉ</th>

                <th>Hành động</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {paginatedData?.map((data: any) => (
                <ListBillDetail data={data} />
              ))}
            </tbody>
          </table>
          <hr />
          <div style={{ marginTop: "5px" }} className="pagination-container">
            <Pagination
              style={{ marginBottom: "20px" }}
              current={currentPage}
              total={getBill?.data?.length || 0}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListBill;
