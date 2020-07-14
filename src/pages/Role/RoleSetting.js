import React, {Component} from 'react'
import {Row, Col, Table, message, Spin, Button, Popconfirm, Modal, Form, Input} from 'antd';
import {observer} from 'mobx-react'
@observer

class RoleSetting extends Component {
	state={
		visibles:false,
		list:'',
		title:'新增',
		loading:false,
		detailValue:'',
		formData:{},
		visible:false,
		columns:[
			{
				title: '编号',
				dataIndex: 'id',
				key: 'id',
			},
			{
				title: '角色名称',
				dataIndex: 'name',
				key: 'name',  
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				key: 'createTime',  
			},
			{
				title: '状态',
				dataIndex: 'status',
				key: 'status',
				render:value => value===1?'启用':'禁用'
			},  
			{
				title: '描述',
				dataIndex: 'remark',
				key: 'remark',
			},  
			{
				title: '操作',
				dataIndex: '',
				key: 'x',
				render: (text,item) => 
					<span>
						<Button size="small" type="link" onClick={this.addItem.bind(this,2,item)}>编辑</Button>
						<Button size="small" type="link" onClick={this.authShow.bind(this)}>授权</Button>
						<Popconfirm title="是否删除该条数据?" onConfirm={this.deleteItme.bind(this,item.id)} onCancel={this.deleteCancel} okText="确认" cancelText="取消">  
							<Button size="small" type="link">删除</Button>
						</Popconfirm>
					</span>
			},
		],
	}
	componentWillMount(){
		this.roleList();
	}
	authShow = () => {
		this.setState({
			visibles:true
		})
		Api.GET({
			url:`${Config.URLString}/admin/resources`,
		}).then((res)=>{
			if(res.data.code === '000000'){
				console.log(res.data);
			}else{
				message.error(res.data.msg);
			}
		})
	}
	closeDialogs = () => {
		this.setState({
		  	visibles: false,
		});
	}
	handleSubmits = () => {
		alert('submit');
	}
	deleteItme = (id) => {
		Api.DELETE({
			url:`${Config.URLString}/admin/roles/${id}`,
		}).then((res)=>{
			if(res.data.code === '000000'){
				message.success('删除成功');
				this.roleList();
			}else{
				message.error(res.data.msg);
			}
		})	
	}
	deleteCancel = () => {
		message.error('取消删除');
	}
	closeDialog = () => {
		this.setState({
		  	visible: false,
		});
		this.props.form.resetFields();
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
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if(this.state.title==='新增'){
					let para  = new URLSearchParams();
					para.append('name',values.rolename);
					para.append('remark',values.remark);
					Api.POST({
						url:`${Config.URLString}/admin/roles`,
						data:para
					}).then((res)=>{
						if(res.data.code === '000000'){
							message.success('操作成功');
							this.roleList();
							this.setState({
								visible: false,
							});
						}else{
							message.error(res.data.msg);
						}
					})
				}else if(this.state.title==='编辑'){
					Api.PUT({
						url:`${Config.URLString}/admin/roles/${this.state.detailValue.id}`,
						data:values
					}).then((res)=>{
						if(res.data.code === '000000'){
							message.success('操作成功');
							this.roleList();
							this.setState({
								visible: false,
							});
						}else{
							message.error(res.data.msg);
						}
					})
				}
			}
		});
	}
	roleList = () => {
		this.setState({
			loading:true,
		})
		Api.GET({
			url:`${Config.URLString}/admin/roles`,
			data:{
				pageNow:1,
				pageSize:20,
			}
		}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					list : res.data.data,
					loading:false,
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
			<Modal title="角色权限" visible={this.state.visibles} onOk={this.handleSubmits} onCancel={this.closeDialogs}>
				<Form labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmits}>
					<Row>
						<Col>
							<Form.Item label="名称">
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Item label="备注">
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
			<Modal title={this.state.title} visible={this.state.visible} onOk={this.handleSubmit} onCancel={this.closeDialog}>
				<Form labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
					<Row>
						<Col>
							<Form.Item label="名称">
								{getFieldDecorator('rolename', {initialValue:this.state.detailValue.name, rules: [{ required: true, message: '请输入名称' }],})(<Input placeholder="请输入"/>)}
							</Form.Item>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Item label="备注">
								{getFieldDecorator('remark', {initialValue:this.state.detailValue.remark, rules: [{ required: true, message: '请输入备注' }],})(<Input placeholder="请输入"/>)}
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
			<Row style={{marginBottom:20}}>
				<Col span={2}>
					<Button type="primary" onClick={this.addItem.bind(this,1)}>新增</Button>
				</Col>
			</Row>
				<Row style={{marginBottom:20}}>
					<Col>
						<Spin spinning={this.state.loading} size="large" tip="努力加载中...">
							<Table columns={this.state.columns} dataSource={this.state.list || []} pagination={false}/>
						</Spin>
					</Col>
				</Row>
			</div>
		) 
  }
}

export default Form.create()(RoleSetting)