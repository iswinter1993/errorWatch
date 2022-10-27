import React, { useEffect, useCallback, useState } from 'react';
import { ProCard,StatisticCard  } from '@ant-design/pro-components';
import { getErrorMsg } from '../../../../services/ant-design-pro/api';
import _ from 'lodash'
import { Line, Column } from '@ant-design/charts';
import {SafetyOutlined} from '@ant-design/icons'
const ErrorColumnEchart = (props) => {
  const [sourceErrorData, setSourceErrorData] = useState<any>([]);
  const [jsErrorData, setJsErrorData] = useState<any>([]);
  const [promiseErrorData, setPromiseErrorData] = useState<any>([]);
  const takeErrorData = (groupByDate) => {
    const finishData: any = [];
    _.forEach(groupByDate, function (v, key) {
      console.log(key);
      finishData.push({ day: key, count: v.length });
    });
    return finishData;
  };

  const getErrorData = useCallback(async () => {
    const res = await getErrorMsg();
    console.log(res);
    const sourceError = res.errorData.sourceError;
    const jsError = res.errorData.jsError;
    const promiseError = res.errorData.promiseError;

    const groupByDate = _.groupBy(sourceError, 'day');
    const groupByDate1 = _.groupBy(jsError, 'day');
    const groupByDate2 = _.groupBy(promiseError, 'day');
    console.log(groupByDate);
    const finishData: any = takeErrorData(groupByDate);
    const finishData1: any = takeErrorData(groupByDate1);
    const finishData2: any = takeErrorData(groupByDate2);
    setSourceErrorData(finishData);
    setJsErrorData(finishData1);
    setPromiseErrorData(finishData2);
  }, []);

  useEffect(() => {
    getErrorData();
  }, []);

  const config = {
    data: sourceErrorData,
    height: 200,
    xField: 'day',
    yField: 'count',
    color: () => {
      return '#F4664A';
    },
    point: {
      size: 5,
      shape: 'diamond',
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
  };
  const config1 = {
    data: jsErrorData,
    height: 200,
    xField: 'day',
    yField: 'count',
    color: () => {
      return '#F4664A';
    },
    point: {
      size: 1,
      shape: 'diamond',
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
    xAxis: {
        label: {
          autoRotate: false,
        },
      },
    //   slider: {
    //     start: 0.1,
    //     end: 0.2,
    //   },
  };
  const config2 = {
    data: promiseErrorData,
    height: 200,
    xField: 'day',
    yField: 'count',
    color: () => {
      return '#F4664A';
    },
    point: {
      size: 1,
      shape: 'diamond',
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
    xAxis: {
        label: {
          autoRotate: false,
        },
      },
    //   slider: {
    //     start: 0.1,
    //     end: 0.2,
    //   },
  };
  return (
    <ProCard direction="row" title='异常' ghost gutter={[8, 8]}>
      <ProCard 
        title="SourceError"
        extra=""
        tooltip="资源加载异常"
        colSpan={8}
        layout="center"
        bordered
      >
        {
            sourceErrorData.length ? 
            <Column {...config} />
            : 
            <div style={{
                height:200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center'
            }}>
                <SafetyOutlined 
                style={{
                    color: '#52c41a',
                    fontSize:70
                }}
                />
                <div style={{
                    color:'#938f8f',
                    textAlign:'center',
                    marginTop:10
                }}>无异常</div>
            </div>
        }
      </ProCard>
      <ProCard title="JsError" extra="" tooltip="JS 执行异常" colSpan={8} layout="center" bordered>
      {
            jsErrorData.length ? 
            <Column {...config1} />
            : 
            <div style={{
                height:200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center'
            }}>
                <SafetyOutlined 
                style={{
                    color: '#52c41a',
                    fontSize:70
                }}
                />
                <div style={{
                    color:'#938f8f',
                    textAlign:'center',
                    marginTop:10
                }}>无异常</div>
            </div>
        }
      </ProCard>
      <ProCard
        title="PromiseError"
        extra=""
        tooltip="Promise 异常"
        colSpan={8}
        layout="center"
        bordered
      >
        {
            promiseErrorData.length ? 
            <Column {...config2} />
            : 
            <div style={{
                height:200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent:'center'
            }}>
                <SafetyOutlined 
                style={{
                    color: '#52c41a',
                    fontSize:70
                }}
                />
                <div style={{
                    color:'#938f8f',
                    textAlign:'center',
                    marginTop:10
                }}>无异常</div>
            </div>
        }
      </ProCard>
    </ProCard>
  );
};

export default ErrorColumnEchart;
