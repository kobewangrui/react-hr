import React, {Component} from 'react'
import {Row, Col} from 'antd';
import {Form, Input, Button, message, Modal, DatePicker, Upload, Icon, } from 'antd';
import {observer} from 'mobx-react'
const { TextArea } = Input;
@observer

class BecomeForm extends Component {
	state={
		formatDate:'',
		becomeVisible:false,
	}
	componentWillMount(){
		this.props.onRef(this);
	}
	//转正
	becomeDialogShow = (record) => {
		console.log(record)
		this.setState({
			becomeVisible: true,
		});
	};
	becomeSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
		  if (!err) {
			this.props.GetList(1);
		  }
		});
	};
	becomeCancel = () => {
		this.setState({
			becomeVisible: false,
		});
		this.props.form.resetFields();
	};	
	onDateChange = (value,dateString) => {
		this.setState({
			formatDate : dateString
		})
	}
	render(){
		const { getFieldDecorator } = this.props.form;
		const props = {
			name: 'file',
			action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
			headers: {
			  	authorization: 'authorization-text',
			},
			onChange(info){
				if(info.file.status !== 'uploading'){
				  	console.log(info.file, info.fileList);
				}
				if(info.file.status === 'done'){
				  	message.success(`${info.file.name}文件上传成功`);
				}else if(info.file.status === 'error') {
				  	message.error(`${info.file.name}文件上传失败`);
				}
			},
		}
		return (
			<div>
                <Modal title='转正办理' visible={this.state.becomeVisible} centered width='760px' onOk={this.becomeSubmit} onCancel={this.becomeCancel}>
                    <Form labelCol={{ span: 9 }} wrapperCol={{ span: 12 }} onSubmit={this.becomeSubmit}>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="员工姓名"></Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="部门">
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="职位"></Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="入职日期"></Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="转正日期">
                                    {getFieldDecorator('date', {rules: [{ required: true, message: '请选择转正日期' }]})(
                                        <DatePicker format='YYYY-MM-DD' onChange={this.onDateChange}/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="转正意见">
                                    <TextArea placeholder="请输入转正意见" rows={4}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="转正审批单">
                                    {getFieldDecorator('uploadfile', {rules: [{ required: true, message: '请上传转正审批单' }]})(
                                        <Upload {...props}>
                                            <Button><Icon type="upload"/>上传文件</Button>
                                        </Upload>,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>				
                    </Form>
                </Modal>
			</div>
		) 
  }
}

export default Form.create()(BecomeForm)