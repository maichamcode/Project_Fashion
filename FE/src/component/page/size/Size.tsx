
import { useGetSizeQuery } from "../../../api/size";
import './size.css'

const Size = ({ data, onSize, selectedSize }: any) => {
    const { data: size } = useGetSizeQuery('')
    const sizeName = size?.data?.find((id: any) => id?.size_id == data)?.size_name
    const handleSize = (data: any,e:any) => {
        e.preventDefault()
        onSize(data)
    }
    return (
        <>
            <button className={`size-option ${selectedSize ? "selected" : ""}`} onClick={(e) => handleSize(data, e)} style={{ padding: '6px', marginRight: 6, borderRadius: 5, backgroundColor:'white' }}><a style={{ padding: '8px' }}>{sizeName}</a></button>
        </>
    )
}

export default Size