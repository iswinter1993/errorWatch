import { PageContainer, ProCard, ProList } from '@ant-design/pro-components';
import { history } from 'umi';
import { parse } from 'query-string';
import { getErrorDetail } from '@/services/ant-design-pro/api';
import { useEffect, useState, useRef } from 'react';
import { Col, Row, Divider,Tag } from 'antd';
import moment from 'moment';
import './errorDetails.less';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

const TableItem = (props) => {
  const { detail } = props;
  const mycode = useRef(null);
  useEffect(() => {
    if (mycode.current) {
      console.log(mycode);
      Prism.highlightElement(mycode.current);
    }
  });
  return (
    <pre className="language-javascript">
      <code className="language-javascript" ref={mycode}>
        {detail?.errorPosttion?.sourceCode}
      </code>
    </pre>
  );
};

const ListTab = (props) => {
  const { errorList, changeItem,defaultId } = props;
  const [name,setname] = useState()
  useEffect(() => {
    if(defaultId){
        setname(defaultId)
    }
  },[defaultId]);
  return (
    <div className="list-group">
      {errorList?.map((v) => {
        return (
          <div className={`list-item ${name === v.id?'active':''}`} key={v.id} onClick={() => {
            setname(v.id)
            changeItem(v)
            }}>
            <div className="titlebox">
              <div className="title">{v.errorType}</div>
              <div className="des"></div>
            </div>
            <div className="status">
              <div className='time'>{moment(v?.time).format('YYYY-MM-DD HH:mm:ss')}</div>
              <div className='tagbox'>
                {
                    v.status === 'open'&&
                    <Tag color="red">open</Tag>
                }
                {
                    v.status === 'close'&&
                    <Tag color="green">close</Tag>
                }
                {
                    v.status === 'Processing'&&
                    <Tag color="orange">Processing</Tag>
                }
              </div>
            </div>
            <div className="content">{v.msg}</div>
          </div>
        );
      })}
    </div>
  );
};

const Details = (props: any) => {
  const query = parse(history.location.search);
  const { errorKey, type } = query;
  console.log(props, query);
  const [errorList, seterrorList] = useState();
  const [detail, setDetail] = useState<any>();
  const changeItem = (v) => {
    console.log(v);
    setDetail(v)
  };
  const getiosVersion = (v) => {
    const data = v.split(' ');
    console.log(data);
    const version = data.filter((e) => e.includes('_'));
    console.log(version);
    return version[0] || 0;
  };
  const getAndroidVersion = (v) => {
    const data = v.split(';');
    const version = data.filter((e) => e.includes('Android'));
    return version[0] || 0;
  };
  useEffect(() => {
    if (errorKey) {
      getErrorDetail({ errorKey, type }).then((res) => {
        console.log(res);
        res.data.map(v=>{
            v.navigator.sys = v.navigator.appVersion.includes('iPhone')
              ? 'iPhone'
              : 'Android';
            v.navigator.sysVersion =
              v.navigator.sys === 'iPhone'
                ? 'IOS ' + getiosVersion(v.navigator.userAgent)
                : getAndroidVersion(v.navigator.userAgent);

        })
        setDetail(res.data[0]);
        seterrorList(res.data);
      });
    }
  }, [errorKey, type]);
  return (
    <PageContainer>
      <div className="pagebox">
        <ListTab errorList={errorList} defaultId={detail?.id} changeItem={changeItem} />
        <ProCard
          tabs={{
            type: 'card',
          }}
        >
          <ProCard.TabPane key="tab1" tab="基本信息">
            <ProCard split="vertical">
              <ProCard split="horizontal">
                <ProCard
                  title="概要信息"
                  headStyle={{ paddingLeft: 0, paddingRight: 0 }}
                  bodyStyle={{ paddingLeft: 10, paddingRight: 0 }}
                >
                  <Row className="gray-font">
                    <Col span={4}>时间</Col>
                    <Col span={20}>{moment(detail?.time).format('YYYY-MM-DD HH:mm:ss')}</Col>
                  </Row>
                  <Divider />
                  <Row className="gray-font">
                    <Col span={4}>类型</Col>
                    <Col span={20}>{detail?.errorType}</Col>
                  </Row>
                  {detail?.errorType === 'jsError' && (
                    <>
                      <Divider />
                      <Row className="gray-font">
                        <Col span={4}>Map文件</Col>
                        <Col span={20}>{detail?.fileName}</Col>
                      </Row>
                    </>
                  )}
                </ProCard>
                <ProCard
                  title="错误信息"
                  headStyle={{ paddingLeft: 0, paddingRight: 0 }}
                  bodyStyle={{ paddingLeft: 10, paddingRight: 0 }}
                >
                  <Row className="gray-font">
                    <Col span={4}>报错信息</Col>
                    <Col span={20}>{detail?.msg}</Col>
                  </Row>
                  <Divider />
                  <Row className="gray-font">
                    {detail?.errorType === 'jsError' ? (
                      <>
                        <Col span={4}>源文件</Col>
                        <Col span={20}>{detail?.errorPosttion?.page}</Col>
                      </>
                    ) : (
                      detail?.errorType === 'sourceError' && (
                        <>
                          <Col span={4}>资源文件</Col>
                          <Col
                            span={20}
                            style={{
                              wordBreak: 'break-all',
                            }}
                          >
                            {detail?.url}
                          </Col>
                        </>
                      )
                    )}
                  </Row>
                  {detail?.errorType === 'jsError' && (
                    <>
                      <Divider />
                      <Row className="gray-font">
                        <Col span={4}>行号</Col>
                        <Col span={20}>{detail?.errorPosttion?.line}</Col>
                      </Row>
                      <Divider />
                      <Row className="gray-font">
                        <Col span={4}>列号</Col>
                        <Col span={20}>{detail?.errorPosttion?.column}</Col>
                      </Row>
                      <Divider />
                      <Row className="gray-font">
                        <Col span={4}>错误代码</Col>
                        <Col span={20}>
                          <TableItem detail={detail} />
                        </Col>
                      </Row>
                    </>
                  )}
                </ProCard>
              </ProCard>
              <ProCard split="horizontal">
                <ProCard title="设备信息" bodyStyle={{ paddingLeft: 35, paddingRight: 0 }}>
                  <Row className="gray-font">
                    <Col span={4}>操作系统</Col>
                    <Col span={20}>{detail?.navigator.sys}</Col>
                  </Row>
                  <Divider />

                  <Row className="gray-font">
                    <Col span={4}>设备</Col>
                    <Col span={20}>{detail?.navigator.sysVersion}</Col>
                  </Row>
                </ProCard>
                <ProCard title="其他信息" bodyStyle={{ paddingLeft: 35, paddingRight: 0 }}>
                  <Row className="gray-font">
                    <Col span={4}>errorKey</Col>
                    <Col span={20}>{detail?.errorKey}</Col>
                  </Row>
                  <Divider />
                  <Row className="gray-font">
                    <Col span={4}>id</Col>
                    <Col span={20}>{detail?.id}</Col>
                  </Row>
                  <Divider />
                  <Row className="gray-font">
                    <Col span={4}>userAgent</Col>
                    <Col span={20}>{detail?.navigator.userAgent}</Col>
                  </Row>
                </ProCard>
              </ProCard>
            </ProCard>
          </ProCard.TabPane>
          <ProCard.TabPane key="tab2" tab="用户行为">
            内容二
          </ProCard.TabPane>
        </ProCard>
      </div>
    </PageContainer>
  );
};

export default Details;
