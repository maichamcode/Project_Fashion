import React from "react";
import CurrencyFormatter from "../../utils/FormatTotal";

const VoucherDetail = ({ data }: any) => {
  return (
    <>
      <option>{data?.voucher_code}</option>
    </>
  );
};

export default VoucherDetail;
