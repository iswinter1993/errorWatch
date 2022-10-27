// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}


//获取报错信息
export async function getErrorMsg(options?: { [key: string]: any }) {
  return request('http://localhost:3000/getError', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getErrorlistMsg(params:any,options?: { [key: string]: any }) {
  return request('http://localhost:3000/getErrorlist', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

//获取用户平台信息
export async function getNavigator(options?: { [key: string]: any }) {
  return request('http://localhost:3000/getNavigator', {
    method: 'GET',
    ...(options || {}),
  });
}

//获取网站性能
export async function getPerformance(options?: { [key: string]: any }) {
  return request('http://localhost:3000/getPerformance', {
    method: 'GET',
    ...(options || {}),
  });
}

//获取错误详情

export async function getErrorDetail(body:any,options?: { [key: string]: any }) {
  return request('http://localhost:3000/queryDetails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

//更改异常状态

export async function changeErrorStatus(body:any,options?: { [key: string]: any }) {
  return request('http://localhost:3000/changeStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}