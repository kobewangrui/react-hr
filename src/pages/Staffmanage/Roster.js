import React, {Component} from 'react'
import {Row, Col} from 'antd';
import { Table, Form, Input, Button, message, Pagination, Spin } from 'antd';
import {observer} from 'mobx-react'
import PersonForm from './RosterForm'
import BecomeForm from './BecomeForm'//转正
import TransferForm from './TransferForm'//转岗
import LiveForm from './LiveForm'//离职
@observer

class WorkCount extends Component {
	state={
		rows:'',
		list:[],
		pagesize:20,
		toTal:0,
		pagenow:1,
		phonesearch:'',
		namesearch:'',
		columns:[
			{
				title: '工号',
				dataIndex: 'jobNum',
				key: 'jobNum',
			},
			{
				title: '姓名',
				dataIndex: 'realName',
				key: 'realName',
			},
			{
				title: '职位',
				dataIndex: 'deptPostVo',
				key: 'deptPostVo',
				render: value => {if(value) return value.name},
			},
			{
				title: '所在部门',
				dataIndex: 'deptVo',
				key: 'deptVo',
				render: value => {if(value) return value.name},
			},
			{
				title: '性别',
				dataIndex: 'sex',
				key: 'sex',
				render: value => value===1?'男':'女',
			},
			{
				title: '入职时间',
				dataIndex: 'entryTime',
				key: 'entryTime',
			},
			{
				title: '操作',
				dataIndex: '',
				key: '',
				render: (text,record,index) => 
					<span key={index}>
						<Button type="link" size="small" onClick={this.dialogShows.bind(this,2,record)}>编辑</Button>
						<Button type="link" size="small" onClick={this.dialogShows.bind(this,3,record)}>查看</Button>
						<Button type="link" size="small" onClick={this.becomeDialogShows.bind(this,record)}>转正</Button>
						<Button type="link" size="small" onClick={this.transferDialogShows.bind(this,record)}>转岗</Button>
						<Button type="link" size="small" onClick={this.liveDialogShows.bind(this,record)}>离职</Button>
					</span>
			},
		],
		formatDate:'',
		becomeVisible:false,
		resigningVisible:false,
		transferVisible:false,
		loading:false,
	}
	componentWillMount(){
		this.getlist(1);
	}
	onRef = (ref) => {
        this.child = ref;
    }
	onRefone = (ref) => {
        this.childone = ref;
    }
	onReftwo = (ref) => {
        this.childtwo = ref;
    }
	onRefthree = (ref) => {
        this.childthree = ref;
    }
	dialogShows = (type,row) => {
		this.child.dialogShow(type,row);
	};
	//转正
	becomeDialogShows = (record) => {
		this.childone.becomeDialogShow(record);
	};
	//转岗
	transferDialogShows = (record) => {
		this.childtwo.transferDialogShow(record);
	};
	//离职
	liveDialogShows = (record) => {
		this.childthree.liveDialogShow(record);
	};
	getlist = (page) => {
		this.setState({
			loading : true,
		})
		Api.GET({
			url:`${Config.URLString}/hr/employee`,
			data:{
				phonesearch:this.state.phonesearch,
				namesearch:this.state.namesearch,
				pagenow:page,
				pagesize:this.state.pagesize,
			}
		}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					list : res.data.data.list || [],
					toTal:res.data.data.totlaCount,
					loading:false,
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}
	pageChange = page =>{
		this.setState({
			pagenow : page,
		})
		this.getlist(page);
	}
	nameChange = (event) => {
		this.setState({
			namesearch:event.target.value,
		})
	}
	phoneChange = (event) => {
		this.setState({
			phonesearch:event.target.value,
		})
	}
	searchList = () => {
		this.setState({
			pagenow:1,
		})
		this.getlist(1);
	};
	resetForm = () => {
		this.setState({
			phonesearch:'',
			namesearch:'',
			pagenow:1,
		})
		this.getlist(1);
	};
	render(){
		return (
			<div>
				<Row style={{marginBottom:20}}>
					<Form layout="inline">
						<Col span={5}>
							<Form.Item label="姓名：">
								<Input value={this.state.namesearch} onChange={this.nameChange} placeholder="请输入姓名"/>
							</Form.Item>
						</Col>
						<Col span={5}>
							<Form.Item label="手机号：">
								<Input value={this.state.phonesearch} onChange={this.phoneChange} placeholder="请输入手机号"/>
							</Form.Item>
						</Col>
						<Col span={2}>
							<Form.Item>
								<Button onClick={this.searchList}>查询</Button>
		  					</Form.Item>
						</Col>
						<Col span={2}>
							<Form.Item>
								<Button onClick={this.resetForm}>重置</Button>
		  					</Form.Item>
						</Col>
						<Col span={2}>
							<Form.Item>
								<Button type="primary" icon="plus" onClick={this.dialogShows.bind(this,1)}>新员工</Button>
		  					</Form.Item>
						</Col>
						<Col span={1}>
							<Form.Item>
								<Button htmlType="submit">批量导入</Button>
		  					</Form.Item>
						</Col>
					</Form>
				</Row>
				<Row>
					<Col>
						<Spin spinning={this.state.loading} size="large" tip="努力加载中...">
							<Table rowKey={(record, index)=>index} bordered columns={this.state.columns} dataSource={this.state.list} pagination={false}/>
						</Spin>
					</Col>
				</Row>
				<Row type="flex" justify="end" style={{marginTop:10}}>
					<Col>
						<Pagination pageSize={this.state.pagesize} current={this.state.pagenow} onChange={this.pageChange} total={this.state.toTal} showTotal={total => `共 ${total} 条`}/>
					</Col>
				</Row>
				<PersonForm GetList={this.getlist} onRef={this.onRef}/>{/* 新增、编辑、查看 */}
				<BecomeForm GetList={this.getlist} onRef={this.onRefone}/>{/* 转正 */}
				<TransferForm GetList={this.getlist} onRef={this.onReftwo}/>{/* 转岗 */}
				<LiveForm GetList={this.getlist} onRef={this.onRefthree}/>{/* 离职 */}
			</div>
		) 
  }
}

export default Form.create()(WorkCount)