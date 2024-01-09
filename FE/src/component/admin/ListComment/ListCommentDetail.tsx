import { Button, Popconfirm, message } from "antd";
import React from "react";
import { useGetOneProductQuery } from "../../../api/product";
import { useGetOneUserQuery } from "../../../api/auth";
import { useDeleteCommentMutation } from "../../../api/comment";
import { useAddActionMutation } from "../../../api/actions";
import formatTimeAgo from "../../../utils/FomatTime";
const ListCommentDetail = ({ data }: any) => {
  //   console.log(data);
  const { data: getOneProduct } = useGetOneProductQuery(data?.product_id);
  const { data: getOneUser } = useGetOneUserQuery(data?.user_id);
  const [messageApi, contextHolder] = message.useMessage();
  const [deleteComment] = useDeleteCommentMutation();
  const [addAction] = useAddActionMutation();
  const user = JSON.parse(localStorage.getItem("user")!);
  const ngay = data?.comment_date?.substring(1, 11);
  const parts = ngay.split("-");
  const year = parseInt(parts[0], 10) + 2000;
  const month = parts[1];
  const day = parts[2].split("T")[0];
  const dataNgay = new Date(`${year}-${month}-${day}`);
  const format = dataNgay.toISOString().split("T")[0];
  const gio = data?.comment_date?.substring(12, 20);
  // console.log(gio);

  const HandleComment = () => {
    const commentID = data?.id;
    const oldComment = data?.comment_text;
    deleteComment(commentID)
      .unwrap()
      .then(() => {
        const actionData = {
          user_id: user?.user?.id,
          action: "Xóa comment",
          old_data: oldComment,
          new_data: null,
        };
        addAction(actionData);
        messageApi.open({
          type: "success",
          content: "Xóa thành công",
        });
      });
  };
  return (
    <>
      <tr>
        <td>
          <strong>{data?.id}</strong>
        </td>
        <td>
          <strong>{getOneProduct?.data[0]?.product_name}</strong>
        </td>
        <td>
          <strong>{getOneUser?.data?.user_firstname}</strong>
        </td>
        <td>
          <strong>{data?.comment_text}</strong>
        </td>
        <td>
          <strong>
            {format} - {gio}
          </strong>
        </td>
        <td>
          <div className="dropdown">
            <Popconfirm
              title="Xóa Voucher"
              description="Bạn có muốn xóa không?"
              okText="Yes"
              cancelText="No"
              onConfirm={HandleComment}
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

export default ListCommentDetail;
