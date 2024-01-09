import { useEffect, useState } from "react";
import {
  useGetDailyEarningsMutation,
  useGetDailyMutation,
  useGetTotalDayQuery,
  useGetTotalPerMonthQuery,
} from "../../../api/dashboard";
import { useGetOrderDayQuery } from "../../../api/order";
import { useGetSumProductQuery } from "../../../api/product";
import CurrencyFormatter from "../../../utils/FormatTotal";
import { DatePickerProps, Modal } from "antd";
import { DatePicker, Space, Button, Input } from "antd";
import { CalendarOutlined } from "@ant-design/icons";

const DataDay = () => {
  const { data: orderDay } = useGetOrderDayQuery(0);
  const { data: sumProduct } = useGetSumProductQuery(0);
  // console.log(sumProduct);
  const { RangePicker } = DatePicker;
  const { data: totalday } = useGetTotalDayQuery("");
  const [totaldays, settotaldays] = useState(0);
  const [dailyDate] = useGetDailyMutation<any>();
  // console.log(dailyDate);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [selectedDate, setSelectedDate]: any = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startdate, setstartdate] = useState<any>();
  const [enddate, setenddate] = useState<any>();
  useEffect(() => {
    if (selectedDate) {
      const [startDate, endDate] = selectedDate;
      setstartdate(startDate);
      setenddate(endDate);
    }
  }, [selectedDate]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    handleShowRevenue();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleShowRevenue = async () => {
    const data1 = { start_date: startdate, end_date: enddate };
    try {
      const response: any = await dailyDate(data1);
      const fetchedRevenueData = response?.data;
      setRevenueData(fetchedRevenueData);
      setShowRevenue(true);
    } catch (error) {
      // Xử lý lỗi khi không thể lấy được doanh thu
    }
  };

  const onChange = (date: any, dateString: any) => {
    setSelectedDate(dateString);
  };
  //   console.log("doanh thu: ", revenueData);

  useEffect(() => {
    if (totalday?.data?.total_amount_day == null) {
      settotaldays(0);
    } else {
      settotaldays(Number(totalday?.data?.total_amount_day));
    }
  }, [totalday?.data?.total_amount_day]);
  return (
    <>
      <div className="card">
        <div>
          <div style={{ width: "100%" }}>
            <div className="card-body" style={{ width: "100%" }}>
              <h5 className="card-title text">Dữ Liệu Ngày Hôm Nay</h5>
              <Button
                type="primary"
                onClick={showModal}
                icon={<CalendarOutlined />}
                style={{
                  marginLeft: "700px",
                  top: "-40px",
                  backgroundColor: "transparent",
                  color: "#1890ff",
                }}
              />
              <Modal
                title="Doanh thu theo ngày"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Space direction="vertical">
                  <RangePicker onChange={onChange} />
                  {showRevenue && revenueData && (
                    <div className="doanhthu" style={{ top: "-50px" }}>
                      <h4>
                        Số tiền:
                        <CurrencyFormatter
                          amount={revenueData?.data?.total_amount ?? 0}
                        />
                        {/* <Input type="text" value={revenueData.data?.total_amount ?? "Không có doanh thu"} disabled /> */}
                      </h4>
                    </div>
                  )}
                </Space>
              </Modal>
              <div
                style={{ display: "flex", width: "100%", marginTop: "30px" }}
              >
                <p
                  className="mb-4"
                  style={{ width: "33%", textAlign: "center" }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
                    <CurrencyFormatter amount={totaldays ? totaldays : 0} />
                  </span>
                  <p>Doanh số</p>
                </p>
                <p
                  className="mb-4"
                  style={{ width: "33%", textAlign: "center" }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
                    {" "}
                    {sumProduct ? sumProduct?.totalProductIds : 0}
                  </span>
                  <p> Sản Phẩm Đã Bán</p>
                </p>
                <p
                  className="mb-4"
                  style={{ width: "33%", textAlign: "center" }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "1.5em" }}>
                    {" "}
                    {orderDay ? Number(orderDay?.checkoutday_date) : 0}
                  </span>{" "}
                  <p>Đơn Hàng</p>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataDay;
