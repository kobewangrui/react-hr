import React, {Component} from 'react'
import { Tree, Input, message, Spin} from 'antd';
const { TreeNode } = Tree;
const { Search } = Input;

class SearchTree extends Component {
	state = {
		searchValue: '',
		expandedKeys:[],
		autoExpandParent:true,
		dataList:[],
		treeData:[],
		loading:false,
	};
	componentWillMount(){
		this.getData();
	}
	getData = () => {//格式化数据
		this.setState({
			loading:true,
		})
		Api.GET({url:`${Config.URLString}/hr/dept`}).then((res)=>{
			if(res.data.code === '000000'){
				let arr = res.data.data.subDepts || [];
				let newArr = [];
				for(let i=0; i<arr.length; i++){
					newArr.push({
						key:arr[i].id,
						title:arr[i].name,
						children:[],
					})
					let arrChild = arr[i].subDepts;
					if(arrChild){//若一级部门有下级部门，则展示下级部门
						for(let j=0; j<arrChild.length; j++){
							newArr[i].children.push({
								key:arrChild[j].id,
								title:arrChild[j].name,
								children:[],
							})
							let arrChilds = arrChild[j].employeePosts;
							if(arrChilds){//若二级部门有下级部门，则展示下级部门
								for(let o=0; o<arrChilds.length; o++){
									newArr[i].children[j].children.push({
										key:arrChilds[o].employeeVo.id,
										title:arrChilds[o].employeeVo.realName,
									})
								}
							}else{//若二级部门无下级部门，则直接展示二级部门员工
								let arrChildij = arrChild[j].employeePosts;
								if(arrChildij){
									for(let ij=0; ij<arrChildij.length; ij++){
										newArr[i].children.push({
											key:arrChildij[ij].employeeVo.id,
											title:arrChildij[ij].employeeVo.realName,
										})
									}
								}
							}
						}
					}else{//若一级部门无下级部门，则直接展示一级部门员工
						let arrChildip = arr[i].employeePosts;
						if(arrChildip){
							for(let ip=0; ip<arrChildip.length; ip++){
								newArr[i].children.push({
									key:arrChildip[ip].employeeVo.id,
									title:arrChildip[ip].employeeVo.realName,
								})
							}
						}
					}
				}
				this.setState({
					treeData:[{
						key:res.data.data.id,
						title:res.data.data.name,
						children:newArr,
					}],
					loading:false
				})
				this.generateList([{
					key:res.data.data.id,
					title:res.data.data.name,
					children:newArr,
				}]);
			}else{
				message.error(res.data.msg);
			}
		})
	}
	getParentKey = (key, tree) => {
		let parentKey;
		for(let i = 0; i < tree.length; i++){
			const node = tree[i];
			if(node.children){
				if(node.children.some(item => item.key === key)){
					parentKey = node.key;
				}else if(this.getParentKey(key, node.children)){
					parentKey = this.getParentKey(key, node.children);
				}
			}
		}
		return parentKey;
	};
	generateList = data => {
		for (let i = 0; i < data.length; i++) {
			const node = data[i];
			const { key,title } = node;
			this.state.dataList.push({ key: key, title: title });
			if(node.children){
			this.generateList(node.children);
		}
	}
	};
	search = e => {//搜索
		const { value } = e.target;
		const expandedKeys = this.state.dataList.map(item => {
			if(item.title.indexOf(value)>-1){
			  	return this.getParentKey(item.key, this.state.treeData);
			}
			return null;
		}).filter((item, i, self) => item && self.indexOf(item) === i);
		this.setState({
			expandedKeys,
			searchValue: value,
			autoExpandParent: true,
		});
	};
	onExpand = expandedKeys => {//手动展开
		this.setState({
		  expandedKeys,
		  autoExpandParent: false,
		});
	};

  render() {
	const loop = data =>
		data.map(item => {
		const index = item.title.indexOf(this.state.searchValue);
		const beforeStr = item.title.substr(0, index);
		const afterStr = item.title.substr(index + this.state.searchValue.length);
		const title =
			index > -1 ? (
			<span>
				{beforeStr}
				<span style={{ color:'blue' }}>{this.state.searchValue}</span>
				{afterStr}
			</span>
			) : (
			<span>{item.title}</span>
			);
		if (item.children) {
			return (
			<TreeNode key={item.key} title={title}>
				{loop(item.children)}
			</TreeNode>
			);
		}
		return <TreeNode key={item.key} title={title} />;
	});
    return (
      <div>
        <Search style={{ marginBottom: 8, width:300}} placeholder="请输入内容" onChange={this.search}/>
			<Spin spinning={this.state.loading} size="large" tip="努力加载中...">
				<Tree onExpand={this.onExpand} autoExpandParent={this.state.autoExpandParent} expandedKeys={this.state.expandedKeys}>
					{loop(this.state.treeData)}
				</Tree>
			</Spin>
	  </div>
    );
  }
}

export default SearchTree