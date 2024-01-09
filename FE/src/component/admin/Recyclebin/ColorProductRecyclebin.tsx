import React from "react";
import { useGetOneColorQuery } from "../../../api/color";

const ColorProductRecyclebin = ({ data }: any) => {
    const { data: getOneColor } = useGetOneColorQuery(data);

    return (
        <>
            <span className="badge bg-label-primary me-1">
                {getOneColor?.data[0]?.color_name}
            </span>
        </>
    );
};

export default ColorProductRecyclebin;
