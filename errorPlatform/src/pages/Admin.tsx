// import { HeartTwoTone, SmileTwoTone } from '@ant-design/icons';
import { ModalForm, PageContainer ,ProTable ,ProForm,ProFormSelect,ProFormInstance} from '@ant-design/pro-components';
import { FormattedMessage} from '@umijs/max';
import React, { useEffect, useRef, useState} from 'react';
import { Tag } from 'antd';
import { Link } from '@umijs/max';
import { getErrorlistMsg,changeErrorStatus } from '@/services/ant-design-pro/api'
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

const TableItem = (props) => {
  const {record} = props;
 
  const mycode = useRef(null);
  useEffect(()=>{
    if(mycode.current){
      console.log(mycode)
      Prism.highlightElement(mycode.current);
    }
  })
  return (
    <pre  className="language-javascript" ><code className='language-javascript' ref={mycode}>{record.errorPosttion.sourceCode}</code></pre>
  )
}

const Admin: React.FC = () => {
  const formdata = useRef<ProFormInstance>(null)
  const ref = useRef<ProFormInstance>(null)
  const tableref = useRef(null)
  const [clickdata, setclickdata] =  useState({})
  const [modalVisit, setModalVisit] = useState(false);
  const editable = (e,v) => {
    e.preventDefault();
    setclickdata(v)
    console.log(formdata)
    setModalVisit(true)
  }
  useEffect(()=>{
    if(formdata.current){
      formdata.current?.setFieldsValue({
        status:clickdata?.status
      })
    }
  },[clickdata])
  const columns:Array<any> = [
    {
      title: 'errorKey',
      dataIndex: 'errorKey',
      valueType: 'text',
      width: 150,
    },
    
    {
      disable: true,
      width:100,
      title: '异常类型',
      dataIndex: 'errorType',
      // filters: true,
      // onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        'all': { text: '全部',status:'all' },
        'jsError': {
          text: 'jsError',
          status:'jsError'
        },
        'promiseError': {
          text: "promiseError",
          status:'promiseError'
        },
        'sourceError': {
          text: "sourceError",
          status:'sourceError'
        },
      },
    },
    {
      title: '错误文件',
      disable: true,
      dataIndex: 'filename',
      valueType:'text',
      render:(text:any, record:any, _ : any, action:any)=>{
        if(record.errorType === 'jsError'){
          return (
            <div>{record.errorPosttion.page}</div>
          )
        }else {
          if(record.errorType === "sourceError"){

            return (
              <div>{record.url}</div>
            )
          }else{
            return(
              <div></div>
            )
          }
        }
      }
    },
    {
      title: '错误信息',
      // ellipsis: true,
      disable: true,
      valueType:'text',
      hideInSearch: true,
      dataIndex:'msg'
    },
    {
      title: '报错数量',
      valueType:'text',
      hideInSearch: true,
      dataIndex:'count'
    },
    // {
    //   title: '错误代码',
    //   valueType:'text',
    //   width:300,
    //   hideInSearch: true,
    //   render:(text:any, record:any, _ : any, action:any)=>{
    //     if(record.errorType === 'jsError'){
    //       return (
    //         <TableItem record={record}/>
    //       )
    //     }else {
    //       return (
    //         <div></div>
    //       )
    //     }
    //   }
    // },
    {
      title: '异常时间',
      key: 'showTime',
      dataIndex: 'time',
      valueType: 'dateTime',
      // sorter: true,
      hideInSearch: true,
    },
    {
      title: '异常时间',
      dataIndex: 'time',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value:any) => {
          return {
            startTime: value?value[0]:null,
            endTime: value?value[1]:null,
          };
        },
      },
    },
    {
      title:'状态',
      width:100,
      dataIndex: 'status',
      valueEnum:{
        'Default': {
          text: '全部',
          status: 'Default',
        },
        'Processing': {
          text:'处理中',
          status: 'Processing',
        },
        'close': {
          text: '已关闭',
          status: 'close',
        },
        'open': {
          text: '未处理',
          status: 'open',
        },
      },
      render:(text:any, record:any, _ : any, action:any)=>{
        return (
          <div>
            {
              record.status === 'open'?
              <Tag color="red">open</Tag>:record.status === 'close' ?
              <Tag color="green">close</Tag>:
              <Tag color="orange">Processing</Tag>
            }
          </div>
        )
      }
      
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text:any, record:any, _ : any, action:any) => [
        <a key={'edit' + record.errorKey} onClick={(e)=>editable(e,record)}>
          编辑
        </a>,
        <Link key={record.errorKey} to={'/admin/sub-page/error-details?errorKey='+record.errorKey + '&type=' + record.errorType}>
          查看
        </Link>
      ],
    },
  ]

  
  return (
    <PageContainer
     
    >
      <ModalForm
        formRef={formdata}
        title={clickdata?.id}
        open={modalVisit}
        onFinish={async (e) => {
          
          const res = await changeErrorStatus({type:clickdata?.errorType,errorKey:clickdata?.errorKey,status:e.status})
          if(res.state === 'success'){
            console.log('提交成功',e,res,tableref);
            tableref.current?.reload();
            return true;
          }else{
            console.log('提交失败',e,res);
            return false;
          }
        }}
        onOpenChange={setModalVisit}
        // initialValues={{
        //   status: clickdata?.status
        // }}
      >
        <ProForm.Group>
          <ProFormSelect
            options={[
              {
                value: 'close',
                label: '已关闭',
              },
              {
                value: 'open',
                label: '未处理',
              },
              {
                value: 'Processing',
                label: '处理中',
              },
            ]}
            width="xs"
            name="status"
            label="error状态"
          />
        </ProForm.Group>
      </ModalForm>
      <ProTable
      actionRef={tableref}
        columns={columns}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter,params);
          const res = await getErrorlistMsg(params)
          console.log(res);
          const arr:any = res.errorData || []
          return {
            data: arr,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: res.total,
          };
        }}
        rowKey='id'
        search={{
          labelWidth: 'auto',
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        // formRef={ref}
        // onReset={()=>{
        //   ref.current?.resetFields();
        // }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
      ></ProTable>
    </PageContainer>
  );
};

export default Admin;
