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
	eduShow = (type,row,index) => {
		this.setState({
            dialogVisible: true,
		});
		if(type===1){
            this.setState({
                detailDialogTitle: '新增教育经历',
                rows:'',
                index:'',
            });
		}else if(type===2){
			this.setState({
                detailDialogTitle: '编辑教育经历',
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
                this.props.changeEduList(this.state.index,this.state.detailDialogTitle,values);
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
								<Form.Item label="入学时间">
									{getFieldDecorator('startDate', {initialValue:this.state.rows.startDate, rules: [{ required: true, message: '请输入入学时间' }],})(<Input placeholder="请输入入学时间"/>)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="毕业时间">
									{getFieldDecorator('stopDate', {initialValue:this.state.rows.stopDate, rules: [{ required: true, message: '请输入毕业时间' }],})(<Input placeholder="请输入毕业时间"/>)}
								</Form.Item>
							</Col>
						</Row>						
                        <Row>
							<Col span={12}>
								<Form.Item label="毕业院校">
									{getFieldDecorator('school', {initialValue:this.state.rows.school, rules: [{ required: true, message: '请输入毕业院校' }],})(<Input placeholder="请输入毕业院校"/>)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="专业">
									{getFieldDecorator('speciality', {initialValue:this.state.rows.speciality, rules: [{ required: true, message: '请输入专业' }],})(<Input placeholder="请输入专业"/>)}
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<Form.Item label="学历">
									{getFieldDecorator('degree', {initialValue:this.state.rows.degree, rules: [{ required: true, message: '请输入学历' }],})(<Input placeholder="请输入学历"/>)}
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="证书编号">
									{getFieldDecorator('certNo', {initialValue:this.state.rows.certNo, rules: [{ required: true, message: '请输入证书编号' }],})(<Input placeholder="请输入证书编号"/>)}
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