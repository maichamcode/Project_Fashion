function formatTimeAgo(timestamp: any) {
    const currentTime:any = new Date();
    const targetTime:any = new Date(timestamp);
    const timeDifference = (currentTime - targetTime) / 1000;

    if (timeDifference < 60) {
        return `${Math.floor(timeDifference)}giây `;
    } else if (timeDifference < 3600) {
        return `${Math.floor(timeDifference / 60)}phút `;
    } else if (timeDifference < 86400) {
        return `${Math.floor(timeDifference / 3600)}giờ `;
    } else {
        return `${Math.floor(timeDifference / 86400)}ngày `;
    }
}

export default formatTimeAgo