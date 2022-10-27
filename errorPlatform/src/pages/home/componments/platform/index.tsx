import React, { useEffect, useCallback, useState } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { getNavigator } from '../../../../services/ant-design-pro/api';
import { TinyArea } from '@ant-design/charts';
import _ from 'lodash';
import { Statistic } from 'antd';

const PlatformEchart = (props) => {
  const [iosData, setIosData] = useState([]);
  const [androidData, setAndroidData] = useState([]);

  const takeNavigatorData = (groupByDate) => {
    const finishData: any = [0,1,2];
    _.forEach(groupByDate, function (v, key) {
      console.log(key);
      finishData.push(v.length);
    });
    console.log(finishData);
    return finishData;
  };

  const visitcount = (v) => {
    const num = _.reduce(
      v,
      function (sum, n) {
        return sum + n;
      },
      0,
    );
    return num;
  };

  const getNavigatorData = useCallback(async () => {
    const res = await getNavigator();
    console.log(res);
    const ios = res.Navigator.ios;
    const Android = res.Navigator.Android;
    const iosByDate = _.groupBy(ios, 'day');
    const AndroidByDate1 = _.groupBy(Android, 'day');
    const finishiosData: any = takeNavigatorData(iosByDate);
    const finishAndroidData: any = takeNavigatorData(AndroidByDate1);
    setIosData(finishiosData);
    setAndroidData(finishAndroidData);
  }, []);

  useEffect(() => {
    getNavigatorData();
  }, []);

  const config = {
    height: 60,
    autoFit: false,
    data: iosData,
    smooth: true,
    areaStyle: {
        fill: '#d6e3fd',
      },
  };
  const config1 = {
    height: 60,
    autoFit: false,
    data: androidData,
    smooth: true,
    areaStyle: {
        fill: '#d6e3fd',
      },
  };
  return (
    <ProCard direction="row" title='平台' ghost gutter={[8, 8]}>
      <ProCard
        title={
          <div
            style={{
              color: '#938f8f',
            }}
          >
            IOS
          </div>
        }
        extra={
          <div
            style={{
              color: '#938f8f',
            }}
          >
            访问量
          </div>
        }
        colSpan={12}
        layout="center"
        bordered
        direction="column"
      >
        <Statistic
          value={visitcount(iosData)}
          style={{
            alignSelf: 'flex-start',
          }}
        />
        <TinyArea {...config} />
      </ProCard>
      <ProCard
        title={
          <div
            style={{
              color: '#938f8f',
            }}
          >
            Android
          </div>
        }
        extra={
          <div
            style={{
              color: '#938f8f',
            }}
          >
            访问量
          </div>
        }
        colSpan={12}
        layout="center"
        bordered
        direction="column"
      >
        <Statistic
          value={visitcount(androidData)}
          style={{
            alignSelf: 'flex-start',
          }}
        />
        <TinyArea {...config1} />
      </ProCard>
    </ProCard>
  );
};

export default PlatformEchart;
