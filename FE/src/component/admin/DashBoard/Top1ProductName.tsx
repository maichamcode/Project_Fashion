import React from "react";
import { useGetOneProductQuery } from "../../../api/product";

type Props = {};

const Top1ProductName = ({ product_id, total }: any) => {
  const { data: getOneProduct } = useGetOneProductQuery(product_id);
  const imageArray = getOneProduct?.data[0]?.image[0]?.split(",");

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={imageArray ? imageArray[0] : ""}
        alt=""
        width={"40px"}
        style={{ marginLeft: "20px", marginRight: "30px", marginTop: "10px" }}
      />
      <div
        style={{
          //   width: "100px", // Thay đổi giới hạn chiều rộng theo ý bạn muốn
          whiteSpace: "nowrap",
          //   overflow: "hidden",
          //   textOverflow: "ellipsis",
          marginRight: "5px",
        }}
      >
        {getOneProduct?.data[0]?.product_name}
      </div>
      <div style={{ marginLeft: "20px" }}>{total}</div>
    </div>
  );
};

export default Top1ProductName;
