import React, { SetStateAction, useState } from "react";

import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useGetAllBlogQuery } from "../../../api/blog";
import BlogDetail from "./DataBlogDetail";
import { Pagination } from "antd";
import DataBlogDetail from "./DataBlogDetail";
const Blog = () => {
  const { data: getAllBlog } = useGetAllBlogQuery([]);
  // console.log(getAllBlog);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
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
  return (
    <>
      <div id="top"></div>
      <section
        className="breadcrumb breadcrumb_bg"
        style={{ marginTop: "70px", backgroundColor: "#eeee" }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="breadcrumb_iner">
                <div className="breadcrumb_iner_item">
                  <h2>Tin tức</h2>
                  <p>
                    Trang chủ <span>-</span> Tin tức
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Main  */}
      <section className="blog_area padding_top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="blog_left_sidebar">
                <div className="row">
                  {paginatedData?.map((data: any) => (
                    <div key={data.blog_id} className="col-lg-4 col-md-6">
                      <DataBlogDetail data={data} />
                    </div>
                  ))}
                </div>
                <Pagination
                  style={{ marginTop: "20px" }}
                  current={currentPage}
                  total={filteredData?.length || 0}
                  pageSize={itemsPerPage}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End Main  */}
    </>
  );
};

export default Blog;


