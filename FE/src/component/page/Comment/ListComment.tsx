import { useEffect, useState } from "react";
import { useGetOneUserQuery } from "../../../api/auth";
import formatTimeAgo from '../../../utils/FomatTime';


const ListComment = ({ data }: any) => {
    const { data: user } = useGetOneUserQuery(data?.user_id)
    const ngay = data?.comment_date?.substring(0, 10);
    const gio = data?.comment_date?.substring(11, 19);
    const timestamp = `${ngay} ${gio}`;
    const [time, settime] = useState<any>()
    useEffect(() => {
        const timer = setInterval(() => {
            const result = formatTimeAgo(timestamp);
            settime(result)
        }, 1000); // Cập nhật mỗi giây

        return () => clearInterval(timer);
    }, []);
    console.log(user?.user?.user_image);
    
    return (
        <>
            <div className="review_item" style={{marginLeft:'20px'}}>
                <div className="media" style={{ background: '#fff' }}>
                    <div style={{ width: '12%', overflow: 'hidden' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: "50%", margin: '0 auto', overflow: "hidden", border: '1px solid white' }}>
                            <img style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                                src={user?.data?.user_image == "undefined" || user?.data?.user_image =="" ? "https://inkythuatso.com/uploads/thumbnails/800/2023/03/6-anh-dai-dien-trang-inkythuatso-03-15-26-36.jpg" : user?.data?.user_image}
                                alt="avt"
                            />
                        </div>

                    </div>
                    <div style={{ marginLeft: '10px', backgroundColor: '#eeee', padding:' 5px 20px', minWidth:'30px',borderRadius:'20px'}}>
                        <h5 style={{ marginBottom: '-5px', marginTop: '4px',color:'black', fontSize:14, fontWeight: 600}}>{user?.data?.user_lastname} {user?.data?.user_firstname}</h5>
                        <span style={{ color: 'black', fontWeight:300, fontSize:13 }}>
                            {data?.comment_text}
                        </span>
                    </div>
                    
                </div>
                <span style={{ fontSize: '0.8em', marginLeft: '80px' ,fontWeight:400, marginTop: -5}}>{time} trước</span>
                <hr style={{height:0.01, color:'#eeee'}}/>
            </div>
            

        </>
    )
}

export default ListComment