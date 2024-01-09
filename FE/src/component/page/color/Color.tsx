
import { useGetColorQuery } from "../../../api/color"
// import './color.css'


const Color = ({ data, onColor, selectedColor }: any) => {
    const { data: color } = useGetColorQuery('')
    const colorName = color?.data?.find((id: any) => id?.color_id == data)?.color_name
    const handleColor = (data: any, e: any) => {
        e.preventDefault();
        onColor(data)

    }
    return (
        <>
            <button className={`size-option ${selectedColor ? "selected" : ""}`} onClick={(e) => handleColor(data, e)} style={{ borderRadius: 5, backgroundColor: 'white', marginRight:6 }}><a style={{ padding: '8px' }}>{colorName}</a></button>
        </>
    )
}

export default Color