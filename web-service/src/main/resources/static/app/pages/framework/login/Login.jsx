import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Form, Input, Button, Icon, Spin, Checkbox} from 'antd';
import {observer} from 'mobx-react'
import style from './login.css'
import loginStore from '../../../pages/framework/login/LoginStore';

const FormItem = Form.Item;

@observer
class Login extends Component {

    componentDidMount() {
        window.addEventListener('keydown', (e) => this.onkeydown(e))
    }

    onkeydown(e) {
        // 兼容FF和IE和Opera
        const theEvent = e || window.event;
        const code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code === 13) {
            loginStore.loginSubmit(this.props.form);
            return false;
        }
        return true;
    }

    render() {
        const {isLogging, captchaNum, changeCaptcha, loginSubmit} = loginStore;
        const form = this.props.form;
        const {getFieldDecorator} = form;
        return (
            <div className={style.box}>
                <div className={style.cnt}>
                    <Spin size="large" tip="Logging..." spinning={isLogging}>
                        <Form className="login-form">
                            <FormItem style={{marginTop: '-10px'}}>
                                <p id="huanying">
                                    <span className={style.cnt_one}>欢迎登录</span>
                                    <span className={style.cnt_two}>后台管理>></span>
                                </p>
                                <hr style={{marginTop: '-12px', marginBottom: '-5px'}}/>
                                <span>Tips：可以使用邮箱或者手机号码进行登录</span>
                            </FormItem>
                            <FormItem style={{marginTop: '-20px'}}>
                                {getFieldDecorator('username', {
                                    rules: [{required: true, message: '请输入帐号!'}],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{fontSize: 15}}/>}
                                        placeholder="请输入帐号"
                                    />
                                )}
                            </FormItem>
                            <FormItem style={{marginTop: '-10px'}}>
                                {getFieldDecorator('password', {
                                    rules: [{required: true, message: '请输入密码!'}],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{fontSize: 15}}/>}
                                        type="password"
                                        placeholder="请输入密码"
                                    />
                                )}
                            </FormItem>
                            <FormItem style={{marginTop: '-10px'}}>
                                <div className={style.ver_code}>
                                    {getFieldDecorator('captcha', {
                                        rules: [{required: true, message: '请输入验证码!'}],
                                    })(
                                        <Input
                                            placeholder="请输入验证码"
                                        />
                                    )}
                                    <img src={"/captcha.jpg?v=" + captchaNum} id="oimg"
                                         onClick={changeCaptcha}/>
                                </div>
                            </FormItem>
                            <FormItem style={{marginTop: '-10px'}}>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox>记住我</Checkbox>
                                )}
                                <div style={{float: 'right'}}>
                                    注册│忘记密码
                                </div>
                                <Button style={{width: '100%'}} type="primary"
                                        onClick={() => loginSubmit(form)}
                                        className="login-form-button">
                                    登录系统
                                </Button>
                            </FormItem>
                        </Form>
                    </Spin>
                </div>
            </div>
        );
    }
}


Login = Form.create()(Login);

ReactDOM.render(
    (<Login/>),
    document.getElementById('root')
);