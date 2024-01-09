import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Modal, Space, Pagination, Skeleton } from 'antd';
import { useGetActionsQuery } from '../../../api/actions';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useGetUserQuery } from '../../../api/auth';
import { useGetActionDailyMutation } from '../../../api/dashboard';
import CurrencyFormatter from '../../../utils/FormatTotal';

const { RangePicker } = DatePicker;

const ListActions = () => {
    const { data: action, isLoading } = useGetActionsQuery('');
    const { data: user } = useGetUserQuery('');
    const [actionDaily] = useGetActionDailyMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRevenue, setShowRevenue] = useState(false);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [startdate, setstartdate] = useState<any>();
    const [enddate, setenddate] = useState<any>();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (selectedDate) {
            const [startDate, endDate] = selectedDate;
            setstartdate(startDate);
            setenddate(endDate);
        }
    }, [selectedDate]);

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const paginatedData =
        action?.data?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

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
            const response: any = await actionDaily(data1);
            const fetchedRevenueData = response?.data;
            setRevenueData(fetchedRevenueData);
            setShowRevenue(true);
        } catch (error) {
            // Handle error when unable to fetch revenue
        }
    };

    const onChange = (date: any, dateString: any) => {
        setSelectedDate(dateString);
    };

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="card">
                    <h5 className="card-header">Danh Sách Hành Động</h5>
                    <Button
                        type="primary"
                        onClick={showModal}
                        icon={<CalendarOutlined />}
                        style={{
                            marginLeft: '1100px',
                            top: '-40px',
                            backgroundColor: 'transparent',
                            color: '#1890ff',
                        }}
                    />
                    <Modal
                        title="Hành động theo ngày"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        width={1000}
                    >
                        <Space direction="vertical">
                            <RangePicker onChange={onChange} />
                            {showRevenue && revenueData && (
                                <div className="doanhthu" style={{ top: '-50px' }}>
                                    <h4>Danh sách hành động:</h4>
                                    <table className="table" style={{ marginLeft: '40px' }}>
                                        <thead className="table-light">
                                            <tr>
                                                <th>Tên Người Thực Hiện</th>
                                                <th>Hành Động</th>
                                                <th>Dữ Liệu Cũ</th>
                                                <th>Dữ Liệu Mới</th>
                                                <th>Thời Gian</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-border-bottom-0">
                                            {revenueData?.data.map((action: any, index: any) => {
                                                const firstname = user?.data?.find((user1: any) => user1?.id == action?.user_id)
                                                    ?.user_firstname;
                                                const lastname = user?.data?.find((user1: any) => user1?.id == action?.user_id)
                                                    ?.user_lastname;
                                                const ngay = action?.action_date?.substring(0, 10);
                                                const gio = action?.action_date?.substring(11, 19);

                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <strong>
                                                                <UserOutlined style={{ marginRight: '15px', color: 'blue' }} />
                                                                {firstname ? `${firstname} ${lastname}` : ''}
                                                            </strong>
                                                        </td>
                                                        <td>{action?.action}</td>
                                                        <td>
                                                            <p style={{ maxWidth: '170px' }}>{action?.old_data ? action?.old_data : 'Trống'}</p>
                                                        </td>
                                                        <td style={{ maxWidth: '170px' }}>{action.new_data ? action.new_data : 'Trống'}</td>
                                                        <td>{ngay}<span style={{ marginLeft: '10px' }}></span>{gio}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Space>
                    </Modal>
                    <div className="table-responsive text-nowrap">
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    <th>Tên Nguời Thực Hiện</th>
                                    <th>Hành Động</th>
                                    <th>Dữ Liệu Cũ</th>
                                    <th>Dữ Liệu Mới</th>
                                    <th>Thời Gian</th>
                                </tr>
                            </thead>
                            {isLoading ? (
                                <Skeleton />
                            ) : (
                                <>
                                    <tbody className="table-border-bottom-0">
                                        {paginatedData?.map((data: any) => {
                                            const firstname = user?.data?.find((user1: any) => user1?.id == data?.user_id)
                                                ?.user_firstname;
                                            const lastname = user?.data?.find((user1: any) => user1?.id == data?.user_id)
                                                ?.user_lastname;
                                            const ngay = data?.action_date?.substring(0, 10);
                                            const gio = data?.action_date?.substring(11, 19);
                                            return (
                                                <tr key={data.id}>
                                                    <td>
                                                        <strong>
                                                            <UserOutlined style={{ marginRight: '15px', color: 'blue' }} />
                                                            {firstname ? `${firstname} ${lastname}` : ''}
                                                        </strong>
                                                    </td>
                                                    <td>{data?.action}</td>
                                                    <td style={{ maxWidth: '150px' }}>{data?.old_data ? data?.old_data : 'Trống'}</td>
                                                    <td style={{ maxWidth: '150px' }}>{data?.new_data ? data?.new_data : 'Trống'}</td>
                                                    <td>{ngay}<span style={{ marginLeft: '10px' }}></span>{gio}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </>
                            )}
                        </table>
                    </div>
                    <div className="pagination-container">
                        <Pagination
                            style={{ marginTop: "5px", marginBottom: "20px", width: "95%" }}
                            current={currentPage}
                            total={action?.data?.length || 0}
                            pageSize={itemsPerPage}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListActions;
