import React from "react";
import { FormattedNumber } from "react-intl";

const CurrencyFormatter = ({ amount }: any) => (
  <div>
    <FormattedNumber
      value={amount}
      style="currency"
      currency="VND"
      minimumFractionDigits={0}
    />
  </div>
);

export default CurrencyFormatter;
