import React from 'react'
import Loadable from 'react-loadable'
import {Loader} from '../components'

const loading = (props) => {
  if (props.pastDelay) {
    return <Loader/>
  }
  return null
}

const Dashboard = Loadable({loading,loader:()=>import('../pages/Dashboard/Dashboard')})
// const Users = Loadable({loading,loader:()=> import('../pages/Users/Users')})

const WorkHistory = Loadable({loading,loader:()=> import('../pages/Work/WorkHistory')})//工作历史
const WorkCount = Loadable({loading,loader:()=> import('../pages/Work/WorkCount')})//工作汇总
const WorkArrange = Loadable({loading,loader:()=> import('../pages/Work/WorkArrange')})//工作安排


const Orgstructure = Loadable({loading,loader:()=> import('../pages/Staffmanage/Orgstructure')})//组织架构
const Roster = Loadable({loading,loader:()=> import('../pages/Staffmanage/Roster')})//花名册


const RoleSetting = Loadable({loading,loader:()=> import('../pages/Role/RoleSetting')})//角色设置


const WorkFlow = Loadable({loading,loader:()=> import('../pages/Workflow/WorkFlow')})//流程设置


export default [
  {
    key: '/app/dashboard',
    title: '工作台',
    zhTitle: '工作台',
    icon: 'dashboard',
    component: Dashboard
  },
  {
    key: '/app/Staffmanage',
    title: '员工管理',
    zhTitle: '员工管理',
    icon: 'user',
    subs: [
      {key: '/app/Staffmanage/orgstructure', parentKey: '/app/Staffmanage', title: '组织架构', component: Orgstructure},
      {key: '/app/Staffmanage/roster', parentKey: '/app/Staffmanage', title: '花名册', component: Roster},
    ]
  },
  {
    key: '/app/work',
    title: '工作管理',
    zhTitle: '工作管理',
    icon: 'desktop',
    subs: [
      {key: '/app/work/arrange', parentKey: '/app/work', title: '工作安排', component: WorkArrange},
      {key: '/app/work/count', parentKey: '/app/work', title: '工作汇总', component: WorkCount},
      {key: '/app/work/history', parentKey: '/app/work', title: '工作历史', component: WorkHistory}
    ]
  },
  {
    key: '/app/role',
    title: '角色管理',
    zhTitle: '角色管理',
    icon: 'setting',
    subs: [
      {key: '/app/role/setting', parentKey: '/app/role', title: '角色设置', component: RoleSetting},
    ]
  },
  {
    key: '/app/workflow',
    title: '流程管理',
    zhTitle: '流程管理',
    icon: 'setting',
    subs: [
      {key: '/app/workflow/setting', parentKey: '/app/workflow', title: '流程设置', component: WorkFlow},
    ]
  },
]
