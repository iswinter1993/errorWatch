import React, { useEffect, useCallback, useState, useRef } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { getPerformance } from '../../../../services/ant-design-pro/api';
import {
  DashboardTwoTone,
  BuildTwoTone,
  TabletTwoTone,
  ExclamationCircleTwoTone,
} from '@ant-design/icons';
import './index.less';
import { Gauge } from '@ant-design/charts';
const Performance = (props: any) => {
  const [CLS, setCLS] = useState<any>();
  const [FID, setFID] = useState<any>();
  const [LCP, setLCP] = useState<any>();

  /**
   * good 75-100
   * need important 50-74
   * poor 0-49
   * **/
  const scoreLCPState = {
    good: (v: any) => {
      const score = ((2500 - v.performanceData.value) / 2500) * 25 + 75;
      return score;
    },
    'needs-improvement': (v: any) => {
      const score = ((1500 - (v.performanceData.value - 2500)) / 1500) * 24 + 50;
      return score;
    },
    poor: (v: any) => {
      const score = 49 - (v.performanceData.value - 4000) / 1000;
      return score;
    },
  };
  const scoreFIDState = {
    good: (v: any) => {
      const score = ((100 - v.performanceData.value) / 100) * 25 + 75;
      return score;
    },
    'needs-improvement': (v: any) => {
      const score = ((200 - (v.performanceData.value - 100)) / 200) * 24 + 50;
      return score;
    },
    poor: (v: any) => {
      const score = 49 - (v.performanceData.value - 300) / 100;
      return score;
    },
  };
  const scoreCLSState = {
    good: (v: any) => {
      const score = ((0.1 - v.performanceData.value) / 0.1) * 25 + 75;
      return score;
    },
    'needs-improvement': (v: any) => {
      const score = ((0.15 - (v.performanceData.value - 0.1)) / 0.15) * 24 + 50;
      return score;
    },
    poor: (v: any) => {
      const score = 49 - (v.performanceData.value - 0.25) / 0.1;
      return score;
    },
  };
  const getLCPScore = (v: any) => {
    const score = scoreLCPState[v.performanceData.rating](v);
    console.log('score', Math.floor(score));

    return Math.floor(score);
  };
  const getFIDScore = (v: any) => {
    const score = scoreFIDState[v.performanceData.rating](v);
    console.log('score', Math.floor(score));

    return Math.floor(score);
  };
  const getCLSScore = (v: any) => {
    const score = scoreCLSState[v.performanceData.rating](v);
    console.log('score', Math.floor(score));

    return Math.floor(score);
  };

  const getPerformanceData = useCallback(async () => {
    const res = await getPerformance();
    console.log(res);
    if (res.state === 'success') {
      const { cls, fid, lcp }: any = res.performanceData;
      if (cls.performanceData) setCLS(getCLSScore(cls));
      if (fid.performanceData) setFID(getFIDScore(fid));
      if (lcp.performanceData) setLCP(getLCPScore(lcp));
    }
  }, []);

  useEffect(() => {
    getPerformanceData();
  }, []);

  const ticks = [0, 1 / 3, 2 / 3, 1];
  const color = ['#F4664A', '#f4b04a', '#30BF78'];
  const config = {
    height: 100,
    // radius: 0.75,
    percent: LCP / 100,
    range: {
      color: 'l(0) 0:#F4664A 0.5:#f4b04a 1:#30BF78',
    },

    gaugeStyle: {
      lineCap: 'round',
    },
    indicator: false,
    statistic: {
      title: {
        formatter: ({ percent }: any) => {
          return percent * 100;
        },
        offsetY: -30,
        style: ({ percent }: any) => {
          return {
            fontSize: '36px',
            color: percent < 49 / 100 ? color[0] : percent < 75 / 100 ? color[1] : color[2],
          };
        },
      },
    },
  };
  const config1 = {
    height: 100,
    // radius: 0.75,
    percent: CLS / 100,
    range: {
      color: 'l(0) 0:#F4664A 0.5:#f4b04a 1:#30BF78',
    },

    gaugeStyle: {
      lineCap: 'round',
    },
    indicator: false,
    statistic: {
      title: {
        formatter: ({ percent }: any) => {
          return percent * 100;
        },
        offsetY: -30,
        style: ({ percent }: any) => {
          return {
            fontSize: '36px',
            color: percent < 49 / 100 ? color[0] : percent < 75 / 100 ? color[1] : color[2],
          };
        },
      },
    },
  };
  const config2 = {
    height: 100,
    // radius: 0.75,
    percent: FID / 100,
    range: {
      color: 'l(0) 0:#F4664A 0.5:#f4b04a 1:#30BF78',
    },

    gaugeStyle: {
      lineCap: 'round',
    },
    indicator: false,
    statistic: {
      title: {
        formatter: ({ percent }: any) => {
          return percent * 100;
        },
        offsetY: -30,
        style: ({ percent }: any) => {
          return {
            fontSize: '36px',
            color: percent < 49 / 100 ? color[0] : percent < 75 / 100 ? color[1] : color[2],
          };
        },
      },
    },
  };

  return (
    <ProCard direction="row" title='性能' ghost gutter={[8, 8]}>
      <ProCard
        title={
          <div className="title">
            <DashboardTwoTone className="dashboard" />
            LCP
          </div>
        }
        tooltip="显示最大内容元素所需时间 (衡量网站初次载入速度)"
        colSpan={8}
      >
        {LCP ? (
          <Gauge {...config} />
        ) : (
          <div className="emp">
            <ExclamationCircleTwoTone />
            <div className="txt">暂无数据</div>
          </div>
        )}
      </ProCard>
      <ProCard
        title={
          <div className="title">
            <BuildTwoTone className="dashboard" />
            CLS
          </div>
        }
        tooltip="累计布局位移 (衡量网页元件视觉稳定性)"
        colSpan={8}
      >
        {CLS ? (
          <Gauge {...config1} />
        ) : (
          <div className="emp">
            <ExclamationCircleTwoTone />
            <div className="txt">暂无数据</div>
          </div>
        )}
      </ProCard>
      <ProCard
        title={
          <div className="title">
            <TabletTwoTone className="dashboard" />
            FID
          </div>
        }
        tooltip="首次输入延迟时间 (衡量网站互动顺畅程度)"
        colSpan={8}
      >
        {FID ? (
          <Gauge {...config2} />
        ) : (
          <div className="emp">
            <ExclamationCircleTwoTone />
            <div className="txt">暂无数据</div>
          </div>
        )}
      </ProCard>
    </ProCard>
  );
};

export default Performance;
