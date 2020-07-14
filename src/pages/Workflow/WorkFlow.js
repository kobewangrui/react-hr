import React, {Component} from 'react'
import {Row, Col, Button, Table, message, Spin, Form} from 'antd';
import {observer} from 'mobx-react'

@observer

class WorkFlow extends Component {
	state={
		list:[],
		loading:false,
		columns:[
			{
				title: '流程名称',
				dataIndex: 'name',
				key: 'name',
			},
			{
				title: 'workFlowGroup',
				dataIndex: 'workFlowGroup',
				key: 'workFlowGroup',
			},
			{
				title: '状态',
				dataIndex: 'jumpType',
				key: 'jumpType',
			},
			{
				title: '操作',
				dataIndex: '',
				key: 'x',
				render: (text,item) => 
					<span>
						<Button size="small" type="link">编辑</Button>
						<Button size="small" type="link">发布</Button>
						<Button size="small" type="link">退回</Button>
                        <Button size="small" type="link">删除</Button>
					</span>
			},
		],
	}
	componentWillMount(){
		this.getWorkFlowList();
	}
	getWorkFlowList(){
		Api.GET({
			url:`${Config.URLString}/workflow/process`,
            data:{
                pageNow:1,
                pageSize:10,
            }
		}).then((res)=>{
			if(res.data.code === '000000'){
                this.setState({
                    list : res.data.data.list,
                    total:res.data.data.totalCount,
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
					<Col span={2}>
						<Button type="primary">新增</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<Spin spinning={this.state.loading} size="large" tip="努力加载中...">
							<Table columns={this.state.columns} dataSource={this.state.list}/>
						</Spin>
					</Col>
				</Row>
			</div>
		) 
  	}
}

export default Form.create()(WorkFlow)