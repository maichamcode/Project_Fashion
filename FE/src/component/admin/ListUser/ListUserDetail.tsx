import { Switch, message } from "antd";
import React, { useEffect, useState } from "react";
import { useAddActionMutation } from "../../../api/actions";
import { useBlockUserMutation, useGetUserQuery } from "../../../api/auth";


const ListUserDetail = ({ data }: any) => {
  const { data: users } = useGetUserQuery('');
  // const user = JSON.parse(localStorage.getItem('user')!);
  const user = users?.data.find((user: any) => user.id === data.id);
  const isBlock = user?.block === true;
  const [loading, setLoading] = useState(false);

  const [Block, setBlock] = useState<any>();

  const [check, setCheck] = useState(false);
  const [updateBlock] = useBlockUserMutation();
  const [addAction] = useAddActionMutation();

  useEffect(() => {
    if (Block) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }, [Block]);

  const [messageApi, contextHolder] = message.useMessage();

  const HandleUpdateBlock = (checked: boolean) => {
    console.log(checked);

    setLoading(true);
    const data1 = {
      id: data?.id,
      block: checked
    };

    updateBlock(data1)
      .unwrap()
      .then((data: any) => {
        const actionText = checked ? "Chặn người dùng" : "Bỏ chặn người dùng";
        if (checked) {
          const data2 = {
            user_id: user?.id,
            action: "Chặn người dùng",
            old_data: user?.user_phone,
            new_data: null,
          };
          addAction(data2);
          console.log(data2);
        } else {
          const data2 = {
            user_id: user?.id,
            action: "Bỏ chặn người dùng",
            old_data: null,
            new_data: user?.user_phone,
          };

          addAction(data2);
          console.log(data2);
        }


        messageApi.success('Cập nhật trạng thái người dùng thành công!');
      })
      .finally(() => {
        setLoading(false); // Kết thúc hiệu ứng loading
      })
      .catch((error) => {
        console.log(error);
        messageApi.open({
          type: "error",
          content: error?.data?.message,
        });
      });
  };

  return (
    <>
      {contextHolder}
      <tr>
        <td>
          <strong>{data.id}</strong>
        </td>
        <td>
          <strong>{data.user_lastname}</strong>
        </td>
        <td>
          <strong>{data.user_firstname}</strong>
        </td>
        <td>
          <span className="badge bg-label-primary me-1">{data.user_email}</span>
        </td>
        <td>
          <strong>{data.user_phone}</strong>
        </td>
        <td >
          <Switch
            checked={isBlock}
            onChange={HandleUpdateBlock}
            // style={{ marginLeft: "50px" }}
            loading={loading}
          />
        </td>
      </tr>
    </>
  );
};

export default ListUserDetail;
