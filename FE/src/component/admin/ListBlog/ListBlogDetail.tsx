import { Button, Popconfirm, message } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useDeleteBlogMutation } from "../../../api/blog";

type Props = {};

const ListBlogDetail = ({ data }: any) => {
  const ngay = data?.blog_date?.substring(1, 11);
  const gio = data?.blog_date?.substring(12, 20);
  const parts = ngay.split("-");
  const year = parseInt(parts[0], 10) + 2000;
  const month = parts[1];
  const day = parts[2].split("T")[0];
  const dataNgay = new Date(`${year}-${month}-${day}`);
  const format = dataNgay.toISOString().split("T")[0];
  const [messageApi, contextHolder] = message.useMessage();
  const [deleteBlog] = useDeleteBlogMutation();
  const image = data?.blog_image;
  console.log(image);

  const Handleblog = () => {
    const blog_id = data?.blog_id;
    deleteBlog(blog_id)
      .unwrap()
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Xóa thành công",
        });
      });
  };

  const truncatedContent =
    data?.blog_content.length > 50
      ? `${data?.blog_content.slice(0, 50)}...`
      : data?.blog_content;
  return (
    <>
      <tr>
        <td>
          <strong>{data?.blog_id}</strong>
        </td>
        <td>
          <strong>{data?.blog_title}</strong>
        </td>
        <td>
          <strong>{truncatedContent}</strong>
        </td>
        <td>
          <img src={image} alt="Avatar" width={"100%"} />
        </td>
        <td>
          <strong>
            {format}-{gio}
          </strong>
        </td>
        <td>
          <div className="dropdown">
            <Link to={`/admin/blog/${data?.blog_id}/update`}>
              <button
                type="button"
                className="btn btn-outline-success"
                style={{ fontSize: "12px" }}
              >
                Sửa
              </button>
            </Link>
            <span> </span>
            <Popconfirm
              title="Xóa Blog"
              description="Bạn có muốn xóa không?"
              okText="Yes"
              cancelText="No"
              onConfirm={Handleblog}
            >
              <Button
                className="btn btn-outline-danger"
                style={{ fontSize: "12px" }}
              >
                Xoá
                {contextHolder}
              </Button>
            </Popconfirm>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ListBlogDetail;
