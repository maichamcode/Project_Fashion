// ZaloIcon.js
import React from 'react';

const ZaloIcon = () => {
    const openZalo = () => {
        window.open('https://zalo.me/g/qqlizf973', '_blank');
    
    };
    const openMess = () => {
        window.open('https://www.facebook.com/messages/t/6664349040344522', '_blank');
    };

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                }}
                onClick={openZalo}
            >
                <img
                    src="https://res.cloudinary.com/dw6wgytc3/image/upload/v1701537792/Icon_of_Zalo.svg_a2evva.png"
                    alt="Zalo Icon"
                    style={{ width: '70%', height: '70%' }}
                />

            </div>
            <div
                style={{
                    position: 'fixed',
                    bottom: '70px',
                    right: '25px',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                }}
                onClick={openMess}
            >
                <img
                    src="https://res.cloudinary.com/dw6wgytc3/image/upload/v1701538243/fe9d715e9a48568fafafdbb3194c586b_gf2inu.png"
                    alt="Messenger Icon"
                    style={{ width: '100%', height: '100%' }}
                />

            </div>
        </>
    );
};

export default ZaloIcon;
