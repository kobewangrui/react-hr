import React, {Component} from 'react'
import {Row, Col, Button, Table, message, Spin, Modal, Input, InputNumber, Form, DatePicker, Popconfirm} from 'antd';
import moment from 'moment'; // 时间插件  
import {observer} from 'mobx-react'

@observer

class WorkArrange extends Component {
	state={
		detailValue:'',
		title:'新增',
		deptId:'',
		visible:false,
		list:[],
		loading:false,
		formatDate:'',
		columns:[
			{
				title: '重点工作总结',
				dataIndex: 'jobContant',
				key: 'jobContant',
			},
			{
				title: '计划完成时间',
				dataIndex: 'planCompleteDate',
				key: 'planCompleteDate',  
				render: value => value?value.slice(0,10):'',
			},
			{
				title: '实际完成情况',
				dataIndex: 'jobProgress',
				key: 'jobProgress',
				render: value => `${value}%`,
			}, 
			{
				title: '操作',
				dataIndex: '',
				key: 'x',
				render: (text,item) => 
					<span>
						<Button size="small" type="link" onClick={this.addItem.bind(this,2,item)}>编辑</Button>
						<Popconfirm title="是否删除该条数据?" onConfirm={this.deleteItme.bind(this,item.id)} onCancel={this.deleteCancel} okText="确认" cancelText="取消">  
							<Button size="small" type="link">删除</Button>
						</Popconfirm>
					</span>
			},
		],
	}
	componentWillMount(){
		this.getPersonalDept();
	}
	getPersonalDept(){
		Api.GET({
			url:`${Config.URLString}/dept/job/listdept`,
			data:{hasCollect:false}
		}).then((res)=>{
			if(res.data.code === '000000'){
				this.getWorkArr(
					res.data.data.map(item => {
						let deptIdArr = [];
						deptIdArr.push(item.id);
						return item.id
					}).join(',')
				)
				this.setState({
					deptId : res.data.data.map(item => {
						let deptIdArr = [];
						deptIdArr.push(item.id);
						return item.id
					}).join(',')
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}	
	onDateChange = (value,dateString) => {
		this.setState({
			formatDate : dateString
		})
	}
	getWorkArr = (deptId) => {
		this.setState({
			loading:true,
		})
		Api.GET({
			url:`${Config.URLString}/dept/job/dept/${deptId}`,
			data:{hasCollect:false}
		}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					list : res.data.data.doingJobs,
					loading:false,
				})
			}else{
				message.error(res.data.msg);
			}
		})
	} 
	deleteItme = (jobId) => {
		Api.DELETE({
			url:`${Config.URLString}/dept/job/${jobId}`,
		}).then((res)=>{
			if(res.data.code === '000000'){
				message.success('删除成功');
				this.getWorkArr(this.state.deptId);
				message.error(res.data.msg);
			}
		})	
	}
	deleteCancel = () => {
		message.error('取消删除');
	}
	addItem = (type,record) => {
		if(type===1){
			this.props.form.resetFields();
			this.setState({
				formatDate:'',
				detailValue:'',
				visible: true,
				title:'新增',
		  });
		}else if(type===2){
			this.setState({
				formatDate:record.planCompleteDate,
				detailValue:record,
				visible: true,
				title:'编辑',
		  });
		}
	}
	closeDialog = () => {
		this.setState({
		  	visible: false,
		});
		this.props.form.resetFields();
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
		  if (!err) {
			values.planCompleteDate = this.state.formatDate;
			values.deptId = this.state.deptId;
			Api.POST({
				url:`${Config.URLString}/dept/job`,
				data:values
			}).then((res)=>{
				if(res.data.code === '000000'){
					message.success('操作成功');
					this.getWorkArr(this.state.deptId);
					this.setState({
						  visible: false,
					});
				}else{
					message.error(res.data.msg);
				}
			})
		  }
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Row style={{marginBottom:20}}>
					<Col span={2}>
						<Button type="primary" onClick={this.addItem.bind(this,1)}>新增</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<Spin spinning={this.state.loading} size="large" tip="努力加载中...">
							<Table columns={this.state.columns} dataSource={this.state.list} pagination={false}/>
						</Spin>
					</Col>
				</Row>
				<Modal title={this.state.title} visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.closeDialog}>
					<Form labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
						<Row>
							<Col>
								<Form.Item label="重点工作总结">
									{getFieldDecorator('jobContant', {initialValue:this.state.detailValue.jobContant, rules: [{ required: true, message: '请输入重点工作总结' }],})(<Input placeholder="请输入"/>)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Item label="计划完成时间">
									{getFieldDecorator('planCompleteDate', {initialValue:moment(this.state.detailValue.planCompleteDate,'YYYY-MM-DD'), rules: [{ required: true, message: '请输入计划完成时间' }]})(
										<DatePicker format='YYYY-MM-DD' onChange={this.onDateChange}/>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Item label="实际完成情况">
									{getFieldDecorator('jobProgress',{initialValue:this.state.detailValue.jobProgress, rules: [{ required: true, message: '请输入实际完成情况' }],})(<InputNumber max={100} min={0} placeholder="请输入"/>)}
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		) 
  	}
}

export default Form.create()(WorkArrange)