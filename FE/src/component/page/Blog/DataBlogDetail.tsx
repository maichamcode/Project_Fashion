import React from "react";
import { Link, useParams } from "react-router-dom";
import { MdSupervisorAccount } from "react-icons/md";
import { FaRegComments } from "react-icons/fa";
import { useGetAllBlogQuery, useGetOneBlogQuery } from "../../../api/blog";
type Props = {};

const DataBlogDetail = ({ data }: any) => {
  const truncatedTitle =
    data?.blog_title.length > 15
      ? `${data?.blog_title.slice(0, 20)}...`
      : data?.blog_title;

  const truncatedContent =
    data?.blog_content.length > 100
      ? `${data?.blog_content.slice(0, 100)}...`
      : data?.blog_content;

  return (
    <>
      <article className="blog_item">
        <div className="blog_item_img">
          <img
            className="card-img rounded-0"
            src={data?.blog_image}
            alt=""
            width={"350px"}
            height={"300px"}
          />
        </div>
        <div className="blog_details">
          <Link
            style={{ textDecoration: "none" }}
            className="d-inline-block"
            to={`/blog/${data?.blog_id}`}
          >
            {/* Apply CSS style for text overflow */}
            <h2
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {truncatedTitle}
            </h2>
          </Link>
          <p>{truncatedContent}</p>
          <p>
            <Link style={{ textDecoration: "none" }} to={`${data?.blog_id}`}>
              Xem thêm
            </Link>
          </p>
        </div>
      </article>
    </>
  );
};

export default DataBlogDetail;
