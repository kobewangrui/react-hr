import React, {Component} from 'react'
import {Row, Col} from 'antd';
import { Table, Form, Input, Select, Button, message, Modal, Divider, DatePicker} from 'antd';
import {observer} from 'mobx-react'
import moment from 'moment'; // 时间插件  
import BankCard from './BankCard'//银行卡
import Familier from './Familier'//家庭成员
import Education from './Education'//教育经历
const { Option } = Select;

@observer

class RosterForm extends Component {
	state={
		isDisabled:false,
		rows:'',
		detailDialogTitle:'',
		detailVisible:false,
		deptVoObj:'',
		detail:'',
		deptlist:[],
		deptpostlist:[],
        formatDate:'',
		employeeBankCardVos:[],
		employeeFamilyVos:[],
		employeeEduExpVos:[],
		eduColumns:[
			{
				title: '入学时间',
				dataIndex: 'startDate',
				key: 'startDate',
			},
			{
				title: '毕业时间',
				dataIndex: 'stopDate',
				key: 'stopDate',    
			},
			{
				title: '毕业院校',
				dataIndex: 'school',
				key: 'school',
			},
			{
				title: '专业',
				dataIndex: 'speciality',
				key: 'speciality',
			},
			{
				title: '学历',
				dataIndex: 'degree',
				key: 'degree',
			},
			{
				title: '证书编号',
				dataIndex: 'certNo',
				key: 'certNo',
			},
			{
				title: '操作',
				dataIndex: '',
				key: '',
				render: (text,record,index) => 
					<span key={index}>
						<Button type="link" size="small" onClick={this.addEdu.bind(this,2,record,index)} disabled={this.state.isDisabled}>编辑</Button>
						<Button type="link" size="small" onClick={this.deleteEdu.bind(this,index)} disabled={this.state.isDisabled}>删除</Button>
					</span>
			},
		],
		familyColumns:[
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: '与员工关系',
				dataIndex: 'relation',
				key: 'relation',    
			},
			{
				title: '电话号码',
				dataIndex: 'phone',
				key: 'phone',
			},
			{
				title: '通信地址',
				dataIndex: 'address',
				key: 'address',
			},
			{
				title: '操作',
				dataIndex: '',
				key: '',
				render: (text,record,index) => 
					<span key={index}>
						<Button type="link" size="small" onClick={this.addFamily.bind(this,2,record,index)} disabled={this.state.isDisabled}>编辑</Button>
						<Button type="link" size="small" onClick={this.deleteFamily.bind(this,index)} disabled={this.state.isDisabled}>删除</Button>
					</span>
			},
		],
        bankcardColumns:[
			{
				title: '银行名称',
				dataIndex: 'branchName',
				key: 'branchName',
			},
			{
				title: '银行账号',
				dataIndex: 'cardNo',
				key: 'cardNo',    
			},
			{
				title: '账户持有人',
				dataIndex: 'holderName',
				key: 'holderName',
			},
			{
				title: '支行',
				dataIndex: 'subBranchName',
				key: 'subBranchName',
			},
			{
				title: '操作',
				dataIndex: '',
				key: '',
				render: (text,record,index) => 
					<span key={index}>
						<Button type="link" size="small" onClick={this.addBankCard.bind(this,2,record,index)} disabled={this.state.isDisabled}>编辑</Button>
						<Button type="link" size="small" onClick={this.deleteBankCard.bind(this,index)} disabled={this.state.isDisabled}>删除</Button>
					</span>
			},
		],
	}
	componentWillMount(){
		this.props.onRef(this);
	}
	onRefBank = (ref) => {
        this.childBank = ref;
	}
	onRefFamily = (ref) => {
        this.childFamily = ref;
	}
	onRefEdu = (ref) => {
        this.childEdu = ref;
	}
	addEdu = (type,row,index) => {
		this.childEdu.eduShow(type,row,index);
	}
	deleteEdu = (index) =>{
		this.state.employeeEduExpVos.splice(index,1);
		this.setState({
			employeeEduExpVos:this.state.employeeEduExpVos
		})
	}
	addFamily = (type,row,index) => {
		this.childFamily.familyShow(type,row,index);
	}
	deleteFamily = (index) =>{
		this.state.employeeFamilyVos.splice(index,1);
		this.setState({
			employeeFamilyVos:this.state.employeeFamilyVos
		})
	}
	addBankCard = (type,row,index) => {
		this.childBank.bankCardShow(type,row,index);
	}
	deleteBankCard = (index) =>{
		this.state.employeeBankCardVos.splice(index,1);
		this.setState({
			employeeBankCardVos:this.state.employeeBankCardVos
		})
	}
	getDeptList = () =>{
		Api.GET({url:`${Config.URLString}/dept`}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					deptlist : res.data.data || [],
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}
	getDeptPostList = (deptId) => {
		Api.GET({url:`${Config.URLString}/dept/${deptId}/deptpost`}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					deptpostlist : res.data.data || [],
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}
	dialogShow = (type,row) => {
		this.props.form.resetFields();
		if(type===1){
		this.setState({
			detailDialogTitle: '新员工录入表单',
			detail:'',
			deptVoObj:'',
			formatDate:'',
			employeeBankCardVos:[],
			employeeFamilyVos:[],
			employeeEduExpVos:[],
			isDisabled:false,
		});
		}else if(type===2){
			this.setState({
				detailDialogTitle: '员工信息编辑表单',
				employeeBankCardVos:[],
				employeeFamilyVos:[],
				employeeEduExpVos:[],
				isDisabled:false,
			});
			this.getDetail(row);
		}else if(type===3){
			this.setState({
				detailDialogTitle: '员工信息查看表单',
				employeeBankCardVos:[],
				employeeFamilyVos:[],
				employeeEduExpVos:[],
				isDisabled:true,
			});
			this.getDetail(row);
		}
		this.setState({
			detailVisible: true,
			rows:row,
		});
		this.getDeptList();
	};
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
		  if (!err) {
			values.entryTime = this.state.formatDate;
			values.deptVo = this.state.deptVoObj;
			values.deptPostVo = ((arg)=>{
				for(let i=0; i<this.state.deptpostlist.length;i++){
					if(this.state.deptpostlist[i].id===arg){
						return this.state.deptpostlist[i]
					}
				}
			})(values.deptPostVo)

			values.employeeBankCardVos = this.state.employeeBankCardVos;
			values.employeeFamilyVos = this.state.employeeFamilyVos;
			values.employeeEduExpVos = this.state.employeeEduExpVos;
			if(this.state.detailDialogTitle==='新员工录入表单'){
				  delete values.id;
				Api.POST({
					url:`${Config.URLString}/hr/employee`,
					data:values
				}).then((res)=>{
					if(res.data.code === '000000'){
						this.props.GetList(1);
						message.success('操作成功');
						this.setState({
							detailVisible: false,
						});
					}else{
						message.error(res.data.msg);
					}
				})
			}else if(this.state.detailDialogTitle==='员工信息编辑表单'){
				  values.id = this.state.rows.id;
				Api.POST({
					url:`${Config.URLString}/hr/employee/${this.state.rows.id}`,
					data:values
				}).then((res)=>{
					if(res.data.code === '000000'){
						this.props.GetList(1);
						message.success('操作成功');
						this.setState({
							detailVisible: false,
						});
					}else{
						message.error(res.data.msg);
					}
				})
			}
		  }
		});
	};
	changebanklist = (index,title,value) => {
		if(title==='新增银行卡'){
			this.setState({
				employeeBankCardVos: [...this.state.employeeBankCardVos,value]
			})
		}else if(title==='编辑银行卡'){
			var items = this.state.employeeBankCardVos;
			items[index] = value;
			this.setState({
				items: items
			});
		}
	}
	changefamilylist = (index,title,value) => {
		if(title==='新增家庭成员'){
			this.setState({
				employeeFamilyVos: [...this.state.employeeFamilyVos,value]
			})
		}else if(title==='编辑家庭成员'){
			var items = this.state.employeeFamilyVos;
			items[index] = value;
			this.setState({
				items: items
			});
		}
	}
	changeEdulist = (index,title,value) => {
		if(title==='新增教育经历'){
			this.setState({
				employeeEduExpVos: [...this.state.employeeEduExpVos,value]
			})
		}else if(title==='编辑教育经历'){
			var items = this.state.employeeEduExpVos;
			items[index] = value;
			this.setState({
				items: items
			});
		}
	}
	handleCancel = () => {
		this.setState({
			detailVisible: false,
		});
		this.props.form.resetFields();
	};	
	getDeptList = () => {
		Api.GET({url:`${Config.URLString}/dept`}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					deptlist : res.data.data || [],
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}
	getDetail = (row) => {
		Api.GET({url:`${Config.URLString}/hr/employee/${row.id}`}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					detail : res.data.data,
					employeeBankCardVos:res.data.data.employeeBankCardVos,
					employeeFamilyVos:res.data.data.employeeFamilyVos,
					employeeEduExpVos:res.data.data.employeeEduExpVos,
					formatDate: res.data.data.entryTime,
					deptVoObj:res.data.data.deptVo,
				})
				this.deptVochange(Object.values(Object.assign({},res.data.data.deptVo))[0]);
			}else{
				message.error(res.data.msg);
			}
		})
	}
	getDeptPostList = (deptId) => {
		Api.GET({url:`${Config.URLString}/dept/${deptId}/deptpost`}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					deptpostlist : res.data.data || [],
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}
	deptVochange = item => {
		for(let i=0; i<this.state.deptlist.length;i++){
			if(this.state.deptlist[i].id===item){
				this.setState({
					deptVoObj:this.state.deptlist[i],
				})
			}
		}
		this.getDeptPostList(item)
	}
	onDateChange = (value,dateString) => {
		this.setState({
			formatDate : dateString
		})
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Modal title={this.state.detailDialogTitle} visible={this.state.detailVisible} centered width='960px' onOk={this.handleSubmit} onCancel={this.handleCancel}>
					<Form labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
						<Divider orientation="left">基础信息</Divider>
						<Row>
							<Col span={8}>
								<Form.Item label="工号">
									{getFieldDecorator('jobNum', {initialValue:this.state.detail.jobNum, rules: [{ required: true, message: '请输入员工工号' }],})(<Input placeholder="请输入员工工号" disabled={this.state.isDisabled}/>)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="姓名">
									{getFieldDecorator('realName', {initialValue:this.state.detail.realName, rules: [{ required: true, message: '请输入姓名' }],})(<Input placeholder="请输入姓名" disabled={this.state.isDisabled}/>)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="性别">
									{getFieldDecorator('sex', {initialValue:JSON.stringify(this.state.detail.sex), rules: [{ required: true, message: '请选择性别' }],})(
										<Select placeholder="请选择性别" disabled={this.state.isDisabled}>
											<Option key="1" value="1">男</Option>
											<Option key="1" value="2">女</Option>
										</Select>									
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Form.Item label="所在部门">
									{getFieldDecorator('deptVo', {initialValue:Object.values(Object.assign({},this.state.detail.deptVo))[0], rules: [{ required: true, message: '请选择所在部门' }],})(
										<Select placeholder="请选择所在部门" onChange={this.deptVochange} disabled={this.state.isDisabled}>
											{this.state.deptlist.map((item,index) => <Option value={item.id} key={index}>{item.name}</Option>)}
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="职位">
									{getFieldDecorator('deptPostVo', {initialValue:Object.values(Object.assign({},this.state.detail.deptPostVo))[0], rules: [{ required: true, message: '请选择职位' }],})(
										<Select placeholder="请选择职位" disabled={this.state.isDisabled}>
											{this.state.deptpostlist.map((item,index) => <Option value={item.id} key={index}>{item.name}</Option>)}
										</Select>	
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="入职日期">
									{getFieldDecorator('entryTime',{initialValue:moment(this.state.detail.entryTime,'YYYY-MM-DD'), rules: [{ required: true, message: '请选择入职日期' }]})(
										<DatePicker format='YYYY-MM-DD' onChange={this.onDateChange} disabled={this.state.isDisabled}/>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Form.Item label="身份证号">
									{getFieldDecorator('cardNo', {initialValue:this.state.detail.cardNo, rules: [{ required: true, message: '请输入身份证号' }],})(
										<Input placeholder="请输入身份证号" disabled={this.state.isDisabled}/>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="联系电话">
									{getFieldDecorator('phoneNo', {initialValue:this.state.detail.phoneNo, rules: [{ required: true, message: '请输入联系电话' }],})(
										<Input placeholder="请输入联系电话" disabled={this.state.isDisabled}/>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="婚姻状况">
									{getFieldDecorator('maritalStatus', {initialValue:JSON.stringify(this.state.detail.maritalStatus), rules: [{ required: true, message: '请选择婚姻状况' }],})(
										<Select placeholder="请选择婚姻状况" disabled={this.state.isDisabled}>
											<Option key="1" value="1">未婚</Option>
											<Option key="1" value="2">已婚</Option>
											<Option key="1" value="4">离异</Option>
										</Select>										
									)}
								</Form.Item>
							</Col>
						</Row>
						<Divider orientation="left">辅助信息</Divider>
						<Row>
							<Col span={8}>
								<Form.Item label="户口所在地">
									{getFieldDecorator('householdAddr',{initialValue:this.state.detail.householdAddr})(
										<Input placeholder="请输入户口所在地" disabled={this.state.isDisabled}/>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="籍贯">
									{getFieldDecorator('jiguan',{initialValue:this.state.detail.jiguan})(
										<Input placeholder="请输入籍贯" disabled={this.state.isDisabled}/>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="政治面貌">
									{getFieldDecorator('politicCountenance',{initialValue:this.state.detail.politicCountenance})(
										<Input placeholder="请选择政治面貌" disabled={this.state.isDisabled}/>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={8}>
								<Form.Item label="民族">
									{getFieldDecorator('nation',{initialValue:this.state.detail.nation})(
										<Input placeholder="请输入民族" disabled={this.state.isDisabled}/>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="户口性质">
									{getFieldDecorator('householdType',{initialValue:this.state.detail.householdType})(
										<Input placeholder="请输入户口性质" disabled={this.state.isDisabled}/>
									)}
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label="个人邮箱">
									{getFieldDecorator('personEmail',{initialValue:this.state.detail.personEmail})(
										<Input placeholder="请输入个人邮箱" disabled={this.state.isDisabled}/>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Divider orientation="left">银行卡信息</Divider>
						<Row>
							<Col>
								<Table rowKey={(record, index)=>index} bordered columns={this.state.bankcardColumns} dataSource={this.state.employeeBankCardVos} pagination={false}/>
							</Col>
						</Row>
						<Row style={{marginTop:'10px'}}>
							<Col>
								<Button icon="plus" type="primary" block onClick={this.addBankCard.bind(this,1)} disabled={this.state.isDisabled}>新增银行卡</Button>
							</Col>
						</Row>
						<Divider orientation="left">家庭成员</Divider>
						<Row>
							<Col>
								<Table rowKey={(record, index)=>index} bordered columns={this.state.familyColumns} dataSource={this.state.employeeFamilyVos} pagination={false}/>
							</Col>
						</Row>
						<Row style={{marginTop:'10px'}}>
							<Col>
								<Button icon="plus" type="primary" block onClick={this.addFamily.bind(this,1)} disabled={this.state.isDisabled}>新增家庭成员</Button>
							</Col>
						</Row>
						<Divider orientation="left">教育经历</Divider>
						<Row>
							<Col>
								<Table rowKey={(record, index)=>index} bordered columns={this.state.eduColumns} dataSource={this.state.employeeEduExpVos} pagination={false}/>
							</Col>
						</Row>
						<Row style={{marginTop:'10px'}}>
							<Col>
								<Button icon="plus" type="primary" block onClick={this.addEdu.bind(this,1)} disabled={this.state.isDisabled}>新增教育经历</Button>
							</Col>
						</Row>
					</Form>
				</Modal>
				<BankCard changeBankList={this.changebanklist} onRef={this.onRefBank} rowVal={this.state.rows}/>
				<Familier changeFamilyList={this.changefamilylist} onRef={this.onRefFamily} rowVal={this.state.rows}/>
				<Education changeEduList={this.changeEdulist} onRef={this.onRefEdu} rowVal={this.state.rows}/>
			</div>
		) 
  }
}

export default Form.create()(RosterForm)