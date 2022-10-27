import { PageContainer,ProCard  } from '@ant-design/pro-components';
import React, { useEffect,useCallback, useState } from 'react';
import { Space } from 'antd';
import ErrorColumnEchart from './componments/errorEchart'
import PlatformEchart from './componments/platform'
import Performance from './componments/performance'
const Welcome: React.FC = () => {
  
  return (
    <PageContainer>
        <Space direction="vertical" size={20} style={{display:'flex'}}>
            <Performance />
            <PlatformEchart />
            <ErrorColumnEchart />
        </Space>
    </PageContainer>
  );
};

export default Welcome;
