import React, { SetStateAction, useState } from "react";
import ListBlogDetail from "./ListBlogDetail";
import { Link } from "react-router-dom";
import { Button, Pagination } from "antd";
import { useGetAllBlogQuery } from "../../../api/blog";
import "../../admin/ListBlog/style.css";
type Props = {};

const ListBlog = (props: Props) => {
  const { data: getAllBlog } = useGetAllBlogQuery("");
  console.log(getAllBlog?.data);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  const filteredData = getAllBlog?.data?.filter((item: any) =>
    item.blog_title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const paginatedData = searchActive
    ? filteredData
    : getAllBlog?.data?.slice(startIndex, endIndex);
  // const paginatedData = getAllBlog?.data?.slice(startIndex, endIndex);
  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <Link to="add">
          <Button
            className="menu-link menu-toggle"
            style={{ marginBottom: "10px" }}
          >
            <i className="menu-icon tf-icons bx bx-lock-open-alt"></i>
            <div data-i18n="Authentications">Thêm Blog</div>
          </Button>
        </Link>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Blog"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchActive(e.target.value !== ""); // Đặt searchActive thành true nếu có giá trị tìm kiếm
              setCurrentPage(1); // Đặt lại trang về trang đầu khi thay đổi tìm kiếm
            }}
          />
        </div>
        <div className="card">
          <h5 className="card-header">Danh Sách Blog</h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Nội dung</th>
                <th>Image</th>
                <th>Ngày đăng</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {paginatedData?.map((data: any) => (
                <ListBlogDetail data={data} />
              ))}
            </tbody>
          </table>
          <hr />
          <div style={{ marginTop: "5px" }} className="pagination-container">
            <Pagination
              style={{ marginBottom: "20px" }}
              current={currentPage}
              total={getAllBlog?.data?.length || 0}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListBlog;
