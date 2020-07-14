import React, {Component} from 'react'
import {Row, Col, Table, Card, message, Spin} from 'antd';
import {observer} from 'mobx-react'
@observer

class WorkCount extends Component {
	state={
		countList:'',
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
		loading:false,
	}
	componentWillMount(){
		this.getPersonalDept();
	}
	getPersonalDept(){
		Api.GET({
			url:`${Config.URLString}/dept/job/listdept`,
			data:{hasCollect:true}
		}).then((res)=>{
			if(res.data.code === '000000'){
				this.getWorkCount(
					res.data.data.map(item => {
						let deptIdArr = [];
						deptIdArr.push(item.id);
						return item.id
					}).join(',')
				)
			}else{
				message.error(res.data.msg);
			}
		})
	}
	getWorkCount = (deptId) => {
		this.setState({
			loading:true,
		})
		Api.GET({
			url:`${Config.URLString}/dept/job/dept/${deptId}`,
			data:{hasCollect:true}
		}).then((res)=>{
			if(res.data.code === '000000'){
				this.setState({
					countList : res.data.data,
					loading:false,
				})
			}else{
				message.error(res.data.msg);
			}
		})
	}
	render(){
		return (
			<div>
				<Row style={{marginBottom:20}}>
					<Col>
						<Card title="上周工作计划" hoverable={true}>
							<Spin spinning={this.state.loading} size="large" tip="努力加载中...">
								<Table columns={this.state.columns} dataSource={this.state.lastWeekJobs || []} pagination={false}/>
							</Spin>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col>
						<Card title="本周工作计划" hoverable={true}>
							<Spin spinning={this.state.loading} size="large" tip="努力加载中...">
								<Table columns={this.state.columns} dataSource={this.state.countList.doingJobs || []} pagination={false}/>
							</Spin>
						</Card>
					</Col>
				</Row>
			</div>
		) 
  }
}

export default WorkCount