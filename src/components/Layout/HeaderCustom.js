import React, {Component, Fragment} from 'react'
import {Avatar, Layout, Icon, Menu} from 'antd'
import { withRouter } from 'react-router-dom'
import styles from './HeaderCustom.module.less'
import { message } from 'antd';
import PropTypes from 'prop-types'
import {inject} from 'mobx-react'
import {FormattedMessage} from 'react-intl'

const {Header} = Layout

@inject('rootStore')
class HeaderCustom extends Component {
  static propTypes = {
    user: PropTypes.object,
    collapsed: PropTypes.bool,
    onCollapseChange: PropTypes.func,
    onSignOut: PropTypes.func
  }


  handleClickMenu = (e) => {
      const result = Api.GET({url:`${Config.URLString}/userLogout`}, {mock: true})
      result.then((res)=>{
        if(res.data.code === '000000'){
          message.success(res.data.data);
          this.props.history.replace('/login')
          this.props.onSignOut()//removeToken
        }else{
            message.error(res.data.data);
        }      
      })
  }
  changeLocale = (e) => {
    const {rootStore} = this.props
    rootStore.changeLocale(e.key)
  }

  render() {
    const {languages} = Config.i18n
    const {rootStore} = this.props
    const currentLanguage = languages.find(
      item => item.key === rootStore.locale
    )
    return (
      <Header className={styles.header}>
        <div
          className={styles.button}
          onClick={this.props.onCollapseChange}
        >
          <Icon
            className={styles.trigger}
            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
          />
        </div>
        <div className={styles['right-container']}>
          <Menu
            mode='horizontal'
            theme='light'
            selectedKeys={[currentLanguage.key]}
            onClick={this.changeLocale}
          >
            <Menu.SubMenu title={<Avatar size='small' src={currentLanguage.flag}/>}>
              {languages.map(item => (
                <Menu.Item key={item.key}>
                  <Avatar
                    size='small'
                    style={{marginRight: 8}}
                    src={item.flag}
                  />
                  {item.title}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          </Menu>
          <Menu
            mode='horizontal'
            theme='light'
            onClick={this.handleClickMenu}
          >
            <Menu.SubMenu
              key='avatar'
              title={
                <Fragment>
                  <span style={{color: 'rgb(153, 153, 153)', marginRight: 4}}></span>
                  <span>{this.props.user.userName}</span>
                  <Avatar
                    style={{marginLeft: 8}}
                    src={this.props.user.avatar}
                  />
                </Fragment>}
            >
              <Menu.Item key='SignOut'>
                <FormattedMessage id='intl.signOut'/>
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
      </Header>
    )
  }
}

export default withRouter(HeaderCustom)
