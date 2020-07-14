import React, {Component} from 'react'
import {Row, Col} from 'antd';
import { Form, Input, message, Modal} from 'antd';
import {observer} from 'mobx-react'

@observer

class Familier extends Component {
	state={
        index:'',
        rows:'',
		detailDialogTitle:'',
		dialogVisible:false,
	}
	componentWillMount(){
		this.props.onRef(this);
	}
	familyShow = (type,row,index) => {
		this.setState({
            dialogVisible: true,
		});
		if(type===1){
            this.setState({
                detailDialogTitle: '新增家庭成员',
                rows:'',
                index:'',
            });
		}else if(type===2){
			this.setState({
                detailDialogTitle: '编辑家庭成员',
                rows:row,
                index:index,
			});
		}
	};
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
            if(!err){
                values.employeeId = this.props.rowVal.id;
                this.props.changeFamilyList(this.state.index,this.state.detailDialogTitle,values);
                this.setState({
                    dialogVisible: false,
                })
                message.success('添加成功');
            }
		});
	};
	handleCancel = () => {
		this.setState({
			dialogVisible: false,
		});
		this.props.form.resetFields();
	};	
	render(){
		const { getFieldDecorator } = this.props.form;
		return (
			<div>
				<Modal title={this.state.detailDialogTitle} visible={this.state.dialogVisible} centered width='960px' onOk={this.handleSubmit} onCancel={this.handleCancel}>
					<Form labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
						<Row>
							<Col span={12}>
								<Form.Item label="姓名">
									{getFieldDecorator('name', {initialValue:this.state.rows.name, rules: [{ required: true, message: '请输入姓名' }],})(<Input placeholder="请输入姓名"/>)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="与员工关系">
									{getFieldDecorator('relation', {initialValue:this.state.rows.relation, rules: [{ required: true, message: '请输入与员工关系' }],})(<Input placeholder="请输入与员工关系"/>)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<Form.Item label="电话号码">
									{getFieldDecorator('phone', {initialValue:this.state.rows.phone, rules: [{ required: true, message: '请输入电话号码' }],})(<Input placeholder="请输入电话号码"/>)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="通信地址">
									{getFieldDecorator('subBranchName', {initialValue:this.state.rows.subBranchName, rules: [{ required: true, message: '请输入通信地址' }],})(<Input placeholder="请输入通信地址"/>)}
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		) 
  }
}

export default Form.create()(Familier)