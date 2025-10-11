import React from 'react';
import { Result } from 'antd';

const WaitingPage = () => {

    return (
        <div className="flex items-center justify-center h-screen">
            <Result
                status="500"
                title="Vui lòng chờ duyệt lịch học"
                subTitle="Để đảm bảo mọi hoạt động của hệ thống được diễn ra mượt mà nên chúng tôi cần xem xét duyệt lịch học cho bạn. 
                Thời gian duyệt trong vòng 3 giờ kể từ lúc bạn đăng ký. Xin cảm ơn"
            />
        </div>
    );
};

export default WaitingPage;