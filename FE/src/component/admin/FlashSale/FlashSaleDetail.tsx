
import {
  useAddflashsaleMutation,
  useDeleteFlashSaleMutation,
  useGetFlashSaleQuery,
  useGetSaleQuery,
  useUpdateflashsaleMutation,
  useUpdateflashsaleOKMutation,
} from "../../../api/sale";
import {
  Button,
  DatePicker,
  Popconfirm,
  Space,
  TimePicker,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useAddActionMutation } from "../../../api/actions";
import dayjs from "dayjs";
import {
  differenceInSeconds
} from "date-fns";
import { pause } from "../../../utils/pause";

const ListFlashSaleDetail = ({ data, sales }: any) => {
  const { data: sale, isLoading } = useGetSaleQuery("");
  const user = JSON.parse(localStorage.getItem("user")!);
  const [deleteFlashSale] = useDeleteFlashSaleMutation();
  const [addAction] = useAddActionMutation();
  const HandleFlashSale = () => {
    deleteFlashSale(flashsale?.data[0]?.id)
      .unwrap()
      .then(() => {
        const data1 = {
          user_id: user?.user?.id,
          action: `Delete Flashsale `,
          old_data: `Flash sale danh mục ${data?.category_name}`,
          new_data: null,
        };
        addAction(data1)
        messageApi.open({
          type: "success",
          content: "Hủy lịch thành công!",
        });
      });
  };
  const saleName = sale?.data?.find(
    (item: any) => item?.sale_id == data?.sale_id
  )?.sale_id;

  const [Sale, setSale] = useState<any>();

  const [check, setcheck] = useState(false);

  useEffect(() => {
    if (Sale) {
      setcheck(false);
    } else {
      setcheck(true);
    }
  }, [Sale]);
  const [messageApi, contextHolder] = message.useMessage();
  const [timehstart, settimehstart] = useState<any>();
  const [timemstart, settimemstart] = useState<any>();
  const [datedstart, setdatedstart] = useState<any>();
  const [datemstart, setdatemstart] = useState<any>();

  const [timehend, settimehend] = useState<any>();
  const [timemend, settimemend] = useState<any>();
  const [datedend, setdatedend] = useState<any>();
  const [datemend, setdatemend] = useState<any>();
  const onChangeTimeStart = (time: any) => {
    settimehstart(time.hour());
    settimemstart(time.minute());
  };
  const onChangeDateStart = (time: any) => {
    setdatedstart(time.date());
    setdatemstart(time.month() + 1);
  };
  const onChangeTimeEnd = (time: any) => {
    settimehend(time.hour());
    settimemend(time.minute());
  };
  const onChangeDateEnd = (time: any) => {
    setdatedend(time.date());
    setdatemend(time.month() + 1);
  };
  const [updateflashsale] = useUpdateflashsaleMutation();
  const [addflashsale] = useAddflashsaleMutation();
  const [updatesaleOK] = useUpdateflashsaleOKMutation();
  const [gioend, setgioend] = useState<any>();
  const [giayend, setgiayend] = useState<any>();
  const [ngayend, setngayend] = useState<any>();
  const [phutend, setphutend] = useState<any>();
  const currentTime: any = new Date();
  const { data: flashsale } = useGetFlashSaleQuery("");
  const end = flashsale?.data?.find(
    (data1: any) => data1?.category_id == data?.category_id
  )?.end_time;
  const ends: any = new Date(`${new Date().getFullYear()}-${end}:00`);
  const timeUntilEnd = ends - currentTime
  useEffect(() => {
    setTimeout(() => {
      const days = Math.floor(timeUntilEnd / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeUntilEnd % (1000 * 60)) / 1000);

      setngayend(days);
      setgioend(hours);
      setphutend(minutes);
      setgiayend(seconds);
    }, 1000);
    if (ngayend <= 0 && giayend <= 0 && gioend <= 0 && phutend <= 0) {
      messageApi.open({
        type: "success",
        content:
          "Flash Sale đã kết thúc",
      });
      window.location.href = '/admin/flashsale'
      return
    }
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (validationError) {
      message.error(validationError);
      setValidationError(null);
    }
  }, [validationError]);
  const HandleUpdateSale = async (id: any) => {
    const startTime: any = new Date(
      Date.UTC(2023, datemstart - 1, datedstart, timehstart, timemstart)
    );
    const currentTime: any = new Date();


    if (datedstart <= 0 && timehstart <= 0 && timemstart <= 0) {
      setValidationError(
        "Thời gian không hợp lệ. Thời gian bắt đầu phải lớn hơn thời gian hiện tại ít nhất 2 phút."
      );
      return;
    }
    const endTime = new Date(
      Date.UTC(2023, datemend - 1, datedend, timehend, timemend)
    );
   
    if (flashsale?.data?.length > 0) {
      setValidationError(
        "Chỉ có thể setup flash sale 1 danh mục duy nhất."
      );
      return;
    }

    if (startTime <= currentTime) {
      setValidationError(
        "Thời gian không hợp lệ. Thời gian bắt đầu phải lớn hơn thời gian hiện tại."
      );
      return;
    }

    if (endTime <= startTime) {
      setValidationError(
        "Thời gian không hợp lệ. Thời gian kết thúc phải lớn hơn thời gian bắt đầu."
      );
      return;
    }

    if (differenceInSeconds(endTime, startTime) < 120) {
      setValidationError(
        "Thời gian không hợp lệ. Thời gian kết thúc phải lớn hơn thời gian bắt đầu ít nhất 2 phút."
      );
      return;
    }
    const sale = {
      giostart: timehstart,
      phutstart: timemstart,
      ngaystart: datedstart,
      thangstart: datemstart,
      gioend: timehend,
      phutend: timemend,
      ngayend: datedend,
      thangend: datemend,
      id_cat: id,
      sale_id: Sale,
    };
    const sale1 = {
      starttime: `${datemstart}-${datedstart} ${timehstart}:${timemstart}`,
      endtime: `${datemend}-${datedend} ${timehend}:${timemend}`,
      category_id: id,
      sale_id: Sale,
    };
    addflashsale(sale1);
    updatesaleOK({ category_id: id });
    updateflashsale(sale);
    const data1 = {
      user_id: user?.user?.id,
      action: `Setup Flashsale `,
      old_data: null,
      new_data: `Flash sale danh mục ${data?.category_name}`,
    };
    addAction(data1)
    await pause(3000);
    messageApi.open({
      type: "success",
      content: `Setup Flash Sale cho ngày ${datedstart}/${datemstart} thành công`,
    });
  };
  const start = flashsale?.data?.find(
    (data1: any) => data1?.category_id == data?.category_id
  )?.start_time;
  const status = flashsale?.data?.find(
    (data1: any) => data1?.category_id == data?.category_id
  )?.status;
  const salessss = flashsale?.data?.find(
    (data1: any) => data1?.category_id == data?.category_id
  )?.sale_id;
  const saless = sale?.data?.find(
    (data1: any) => data1?.sale_id == salessss
  )?.sale_name;
  const [gio, setgio] = useState<any>();
  const [ngay, setngay] = useState<any>();
  const [phut, setphut] = useState<any>();
  const [giay, setgiay] = useState<any>();
  const starts: any = new Date(`${new Date().getFullYear()}-${start}:00`);
  const timeUntilStart = starts - currentTime
  useEffect(() => {
    setTimeout(() => {
      const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000);
      setngay(days);
      setgio(hours);
      setphut(minutes);
      setgiay(seconds);
    }, 1000);
  });
  const minutesAsNumber = parseInt(phut, 10);
  return (
    <>
      {contextHolder}
      <tr>
        {isLoading ? (
          ""
        ) : (
          <>
            <td>
              <strong>#{data?.category_id}</strong>
            </td>
            <td>{data?.category_name}</td>
            <td width="20%">
              {sales ? (
                `${start}`
              ) : (
                <Space direction="vertical" style={{ display: "flex" }}>
                  <TimePicker
                    onChange={onChangeTimeStart}
                    defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                    style={{ width: "70%" }}
                  />
                  <DatePicker
                    onChange={onChangeDateStart}
                    style={{ width: "70%" }}
                  />{" "}
                </Space>
              )}
            </td>
            <td width="20%">
              {sales ? (
                `${end}`
              ) : (
                <Space direction="vertical" style={{ display: "flex" }}>
                  <TimePicker
                    onChange={onChangeTimeEnd}
                    defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                    style={{ width: "70%" }}
                  />
                  <DatePicker
                    onChange={onChangeDateEnd}
                    style={{ width: "70%" }}
                  />
                </Space>
              )}
            </td>
            <td width="20%">
              {sales ? (
                `${saless}`
              ) : (
                <select
                  id="largeSelect"
                  className="form-select form-select-lg"
                  defaultValue={saleName ? saleName : ""}
                  style={{ width: "150px", height: "90%" }}
                  onChange={(e) => setSale(e.target.value)}
                >
                  <option value="null">Chọn sale</option>
                  {sale?.data?.map((data: any) => (
                    <option value={data?.sale_id}>{data?.sale_name}</option>
                  ))}
                </select>
              )}
            </td>
            <td>
              {sales ? (
                status == true ? (
                  <div>
                    Flash Sale kết thúc sau
                    <h5>
                      {ngayend}d {gioend}h {phutend}m {giayend}s
                    </h5>
                  </div>
                ) : (
                  <div>
                    Flash Sale bắt đầu sau
                    <h5>
                      {ngay}d {gio}h {minutesAsNumber}m {giay}s
                    </h5>
                  </div>
                )
              ) : (
                <Button
                  onClick={() => HandleUpdateSale(data?.category_id)}
                  disabled={check}
                  style={{ marginLeft: "30px" }}
                >
                  Đặt lịch
                </Button>
              )}
            </td>

            <td>
              {sales ? (
                <Popconfirm
                  title="Hủy lịch hẹn"
                  description="Bạn có muốn hủy không?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={HandleFlashSale}
                >
                  <Button
                    className="btn"
                    style={{
                      fontSize: "12px",
                      marginLeft: "40px",
                      borderColor: "red",
                      color: "red",
                    }}
                  >
                    Hủy
                    {contextHolder}
                  </Button>
                </Popconfirm>
              ) : (
                ""
              )}
            </td>

          </>
        )}
      </tr>
    </>
  );
};

export default ListFlashSaleDetail;
