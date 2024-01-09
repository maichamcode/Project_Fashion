import React, { SetStateAction, useState } from "react";
import ListVoucherDetail from "./ListVoucherDetail";
import { useGetAllVoucherQuery } from "../../../api/voucher";
import { Link } from "react-router-dom";
import { Button, Pagination } from "antd";

type Props = {};

const ListVoucher = () => {
  const { data: getAllVoucher } = useGetAllVoucherQuery("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = getAllVoucher?.data?.slice(startIndex, endIndex);
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <Link to="add" style={{ textDecoration: "none" }}>
          <Button
            className="menu-link menu-toggle"
            style={{ marginBottom: "10px" }}
          >
            <i className="menu-icon tf-icons bx bx-plus"></i>
            <div data-i18n="Authentications">Thêm voucher</div>
          </Button>
        </Link>
        <div className="card">
          <h5 className="card-header">Danh Sách Voucher</h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID mã giảm giá</th>
                <th>Mã giảm giá</th>
                <th>Giá được giảm</th>
                <th>Trạng thái mã giảm giá</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {paginatedData?.map((data: any) => (
                <ListVoucherDetail data={data} />
              ))}
            </tbody>
          </table>
          <hr />
          <div style={{ marginTop: "5px" }} className="pagination-container">
            <Pagination
              style={{ marginBottom: "20px" }}
              current={currentPage}
              total={getAllVoucher?.data?.length || 0}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListVoucher;
