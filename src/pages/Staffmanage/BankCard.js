import React, {Component} from 'react'
import {Row, Col} from 'antd';
import { Form, Input, message, Modal} from 'antd';
import {observer} from 'mobx-react'

@observer

class BankCard extends Component {
	state={
        index:'',
        rows:'',
		detailDialogTitle:'',
		dialogVisible:false,
	}
	componentWillMount(){
		this.props.onRef(this);
	}
	bankCardShow = (type,row,index) => {
		this.setState({
            dialogVisible: true,
		});
		if(type===1){
            this.setState({
                detailDialogTitle: '新增银行卡',
                rows:'',
                index:'',
            });
		}else if(type===2){
			this.setState({
                detailDialogTitle: '编辑银行卡',
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
                this.props.changeBankList(this.state.index,this.state.detailDialogTitle,values);
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
								<Form.Item label="银行名称">
									{getFieldDecorator('branchName', {initialValue:this.state.rows.branchName, rules: [{ required: true, message: '请输入银行名称' }],})(<Input placeholder="请输入银行名称号"/>)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="银行卡号">
									{getFieldDecorator('cardNo', {initialValue:this.state.rows.cardNo, rules: [{ required: true, message: '请输入银行卡号' }],})(<Input placeholder="请输入银行卡号"/>)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<Form.Item label="账户持有人">
									{getFieldDecorator('holderName', {initialValue:this.state.rows.holderName, rules: [{ required: true, message: '请输入账户持有人' }],})(<Input placeholder="请输入账户持有人"/>)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="支行">
									{getFieldDecorator('subBranchName', {initialValue:this.state.rows.subBranchName, rules: [{ required: true, message: '请输入支行' }],})(<Input placeholder="请输入支行"/>)}
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Modal>
			</div>
		) 
  }
}

export default Form.create()(BankCard)