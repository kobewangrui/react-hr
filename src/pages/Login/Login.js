import React, {PureComponent, Fragment} from 'react'
import {Button, Row, Form, Input, message} from 'antd'
import styles from './Login.module.less'
import {setToken} from '../../utils/tools'
import {FormattedMessage} from 'react-intl'
import {inject} from 'mobx-react'

const FormItem = Form.Item

@inject('rootStore')
@Form.create()
class Login extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault()
    const {form} = this.props
    const {validateFieldsAndScroll} = form
    validateFieldsAndScroll(async (errors, values) => {
      if (errors) {
        return
      }
      const result = await Api.PUT({url:`${Config.URLString}/login`,data:values}, {mock: true})
      if(result.data.code === '000000'){
        message.success('登录成功');
        setToken(result)
        this.props.history.replace('/app/dashboard')
      }else{
          message.error(result.data.msg);
      }
    })
  }

  render() {
    const {form} = this.props
    const {getFieldDecorator} = form
    return (
      <Fragment>
        <div className={styles.form}>
          <div className={styles.logo}>
            {/* <img alt='logo' src={config.logoPath}/> */}
            <span>{Config.siteName}</span>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
                rules: [{required: true}]
              })(
                <Input
                  placeholder={`Username`}
                />
              )}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [{required: true}]
              })(
                <Input
                  type='password'
                  placeholder={`Password`}
                />
              )}
            </FormItem>
            <Row>
              <Button
                type='primary'
                htmlType={'submit'}
              >
                <FormattedMessage id='intl.signIn'/>
              </Button>
              <p>
                <span>Username：yjd</span>
                <span>Password：abcd</span>
              </p>
            </Row>
          </Form>
        </div>
        <div className={styles.footer}>
          <footer className={styles['footer-view']}>
            <div className={styles['footer-view-links']}>
              <span onClick={() => {this.props.rootStore.changeLocale('en')}}>English</span>
              <span onClick={() => {this.props.rootStore.changeLocale('zh')}}>中文</span>
            </div>
          </footer>
        </div>
      </Fragment>
    )
  }
}

export default Login
