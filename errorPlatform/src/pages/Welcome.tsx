import { PageContainer,ProCard  } from '@ant-design/pro-components';
import { Card } from 'antd';
import React, { useEffect,useCallback, useState } from 'react';
import { Line,Column } from '@ant-design/charts';
import { getErrorMsg } from '../services/ant-design-pro/api';
import _ from 'lodash'
const Welcome: React.FC = () => {
  const [sourceErrorData,setSourceErrorData] = useState<any>([])
  const [jsErrorData,setJsErrorData] = useState<any>([])
  const [promiseErrorData,setPromiseErrorData] = useState<any>([])
  const takeErrorData = (groupByDate) => {
    const finishData:any = []
    _.forEach(groupByDate, function(v, key) {
      console.log(key);
      finishData.push({day:key,count:v.length})
    });
    return finishData;
  }


  const getErrorData = useCallback(async () => {
    const res = await getErrorMsg()
    console.log(res);
    const sourceError = res.errorData.sourceError
    const jsError = res.errorData.jsError
    const promiseError = res.errorData.promiseError

    const groupByDate = _.groupBy(sourceError,'day')
    const groupByDate1 = _.groupBy(jsError,'day')
    const groupByDate2 = _.groupBy(promiseError,'day')
    console.log(groupByDate);
    const finishData:any = takeErrorData(groupByDate)
    const finishData1:any = takeErrorData(groupByDate1)
    const finishData2:any = takeErrorData(groupByDate2)
    setSourceErrorData(finishData)
    setJsErrorData(finishData1)
    setPromiseErrorData(finishData2)
  },[]) 

  useEffect(() => {
    getErrorData()
  },[])
  
  const config = {
    data:sourceErrorData,
    height: 200,
    xField: 'day',
    yField: 'count',
    color:()=>{
      return '#F4664A';
    },
    point: {
      size: 1,
      shape: 'diamond',
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
  };
  const config1 = {
    data:jsErrorData,
    height: 200,
    xField: 'day',
    yField: 'count',
    color:()=>{
      return '#F4664A';
    },
    point: {
      size: 1,
      shape: 'diamond',
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
  };
  const config2 = {
    data:promiseErrorData,
    height: 200,
    xField: 'day',
    yField: 'count',
    color:()=>{
      return '#F4664A';
    },
    point: {
      size: 1,
      shape: 'diamond',
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
  };
  return (
    <PageContainer>
       <ProCard direction="row" ghost gutter={[8, 8]}>
        <ProCard title="SourceError" extra="" tooltip="资源加载异常" colSpan={8} layout="center" bordered>
          <Column {...config}/>
        </ProCard>
        <ProCard title="JsError" extra="" tooltip="JS 执行异常" colSpan={8} layout="center" bordered>
          <Column {...config1}/>
        </ProCard>
        <ProCard title="PromiseError" extra="" tooltip="Promise 异常" colSpan={8} layout="center" bordered>
          <Column {...config2}/>
        </ProCard>
       </ProCard>
    </PageContainer>
  );
};

export default Welcome;
