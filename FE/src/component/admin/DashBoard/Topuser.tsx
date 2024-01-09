import { useGetoneuserQuery } from "../../../api/dashboard";

const TopUser = ({ data }: any) => {
  const { data: oneUser } = useGetoneuserQuery(data?.user_id);
  // console.log(data);
  // const imageArray = oneUser?.data[0]?.image[0]?.split(",");

  return (
    <>
      <li className="d-flex mb-4 pb-1" style={{paddingTop:10}}>
        <div className="avatar flex-shrink-0 me-3">
          {/* <img src={imageArray ? imageArray[0] : ""} alt="" /> */}
        </div>
        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
          <div className="me-2">
            <h6 className="mb-0">
              {oneUser?.data?.user_firstname}
              {oneUser?.data?.user_lastname}
            </h6>
          </div>
          <div className="user-progress">
            <small className="fw-semibold"><span style={{fontSize:16, fontWeight: 'bold'}}>{data?.order_count}</span> đơn hàng</small>
          </div>
        </div>
      </li>
    </>
  );
};

export default TopUser;
