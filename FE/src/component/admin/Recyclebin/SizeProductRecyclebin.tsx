import React from "react";
import { useGetOneSizeQuery, useGetSizeQuery } from "../../../api/size";

const SizeProductRecyclebin = ({ data }: any) => {
    const { data: getOneSize } = useGetOneSizeQuery(data);

    return (
        <>
            <span className="badge bg-label-primary me-1">
                {getOneSize?.data[0]?.size_name}
            </span>
        </>
    );
};

export default SizeProductRecyclebin;
