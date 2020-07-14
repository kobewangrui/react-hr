import React, {Component} from 'react'
import {Row, Col} from 'antd';
import { Form, Button, message, Select, Table, Pagination, Spin } from 'antd';
import {observer} from 'mobx-react'
const { Option } = Select;
@observer

class Workhistory extends Component {
	state={
		recordList:[],
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
		],
		pagenow:1,
		pageSize:20,
		deptId:'',
		jobStatus:'',
		deptlist:[],
		toTal:0,
		loading:false,
	}
	componentWillMount(){
		this.getHistoryRecord(1);
		this.getDeptList();
	}
	getDeptList = () =>{
		this.setState({
			loading:true,
		})
		Api.GET({url:`${Config.URLString}/dept`}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					deptlist : res.data.data || [],
					loading:false
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}
	getHistoryRecord = (page) => {
		this.setState({
			loading:true,
		})
		Api.GET({url:`${Config.URLString}/dept/job/history`,data:{
			pageNow:page,
			pageSize:this.state.pageSize,
			deptId:this.state.deptId.id,
			jobStatus:this.state.jobStatus,
		}}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					recordList : res.data.data.list || [],
					toTal:res.data.data.totlaCount,
					loading:false,
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}
	deptVochange = item => {
		this.setState({
			deptId : item,
		})
	}
	workstatechange = item => {
		this.setState({
			jobStatus : item,
		})
	}
	handleSubmit = () => {
		this.setState({
			pagenow : 1,
		})
		this.getHistoryRecord(1);
	};
	resetForm = () => {
		this.setState({
			pagenow:1,
			deptId : '',
			jobStatus : '',
		})
		this.getHistoryRecord(1);
	};
	pageChange = page =>{
		this.setState({
			pagenow : page,
		})
		this.getHistoryRecord(page);
	}
	render() {
		return (
			<div>
				<Row style={{marginBottom:20}}>
					<Form layout="inline">
						<Col span={4}>
							<Form.Item label="部门">
								<Select placeholder="请选择所在部门" value={this.state.deptId} onChange={this.deptVochange} style={{ width: '120px' }}>
									{this.state.deptlist.map((item,index) => <Option value={item} key={index}>{item.name}</Option>)}
								</Select>							
							</Form.Item>
						</Col>
						<Col span={5}>
							<Form.Item label="完成情况">
								<Select placeholder="请选择完成情况" value={this.state.jobStatus} onChange={this.workstatechange} style={{ width: '120px' }}>
									<Option value="0" key="0">计划中</Option>
									<Option value="1" key="1">进行中</Option>
									<Option value="2" key="2">未完成</Option>
									<Option value="1024" key="1024">完成</Option>
								</Select>								
							</Form.Item>
						</Col>
						<Col span={2}>
							<Form.Item>
								<Button type="primary" onClick={this.handleSubmit}>查询</Button>
		  					</Form.Item>
						</Col>
						<Col span={1}>
							<Form.Item>
								<Button htmlType="submit" onClick={this.resetForm}>重置</Button>
		  					</Form.Item>
						</Col>
					</Form>
				</Row>
				<Row>
					<Col>
						<Spin spinning={this.state.loading} size="large" tip="努力加载中...">
							<Table columns={this.state.columns} dataSource={this.state.recordList} pagination={false}/>
						</Spin>
					</Col>
				</Row>				
				<Row type="flex" justify="end" style={{marginTop:10}}>
					<Col>
						<Pagination pageSize={this.state.pageSize} current={this.state.pagenow} onChange={this.pageChange} total={this.state.toTal} showTotal={total => `共 ${total} 条`}/>
					</Col>
				</Row>
			</div>
		) 
  }
}

export default Workhistory