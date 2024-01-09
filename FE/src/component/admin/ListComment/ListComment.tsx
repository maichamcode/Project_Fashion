import React, { SetStateAction, useState, useEffect } from "react";
import ListCommentDetail from "./ListCommentDetail";
import { useGetAllCommentQuery } from "../../../api/comment";
import { Pagination, DatePicker } from "antd";

type Props = {};

const ListComment = () => {
  const { data: getAllComment } = useGetAllCommentQuery("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredComments = getAllComment?.data?.filter((comment) => {
    if (startDate && endDate) {
      const adjustedStartDate = new Date(startDate);
      adjustedStartDate.setHours(0, 0, 0, 0);

      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);

      const commentDate = new Date(comment.comment_date);
      return (
        commentDate >= adjustedStartDate && commentDate <= adjustedEndDate
      );
    }
    return true;
  });

  const handlePageChange = (page: SetStateAction<number>, pageSize: any) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredComments?.slice(startIndex, endIndex);

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <h5 className="card-header">Danh Sách Comment</h5>

          <DatePicker.RangePicker
            onChange={(dates) => {
              if (dates) {
                setStartDate(dates[0]);
                setEndDate(dates[1]);
              } else {
                setStartDate(null);
                setEndDate(null);
              }
            }}
          />

          <table className="table">
            <thead>
              <tr>
                <th>ID bình luận</th>
                <th>Tên sản phẩm</th>
                <th>Người dùng</th>
                <th>Nội dung bình luận</th>
                <th>Ngày bình luận</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {paginatedData?.map((data: any) => (
                <ListCommentDetail data={data} />
              ))}
            </tbody>
          </table>
          <hr />
          <div style={{ marginTop: "5px" }} className="pagination-container">
            <Pagination
              style={{ marginBottom: "20px" }}
              current={currentPage}
              total={filteredComments?.length || 0}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListComment;
