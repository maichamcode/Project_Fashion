import { useEffect } from 'react';

function useScrollToTopOnMount(data: any) {
    useEffect(() => {
        const handleLinkClick = () => {
            // Cuộn trang lên đầu bằng cách chuyển tới phần đầu trang
            const topElement = document.getElementById('top');
            if (topElement) {
                topElement.scrollIntoView({ behavior: 'smooth' });
            }
        };

        handleLinkClick();
    }, [data]);
}

export default useScrollToTopOnMount;