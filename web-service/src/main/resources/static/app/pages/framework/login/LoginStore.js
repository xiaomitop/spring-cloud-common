import {observable, action, computed} from 'mobx';
import {message} from 'antd';
import fetchUtil from '../../../common/utils/FetchUtil'

class LoginState {
    @observable captchaNum = 0;
    @observable isLogging = false;

    @action
    changeCaptcha = () => {
        this.captchaNum++;
    };
    @action
    changeLoggingState = (state) => {
        this.isLogging = state;
    };

    @action
    loginSubmit = (form) => {
        form.validateFields((err, values) => {
            if (!err) {
                this.changeLoggingState(true);
                let formData = new FormData();
                formData.append('username', values.username);
                formData.append('password', values.password);
                formData.append('captcha', values.captcha);
                fetchUtil.post(`/auth/authentication/form`, formData, (data) => {
                    if (data.retCode === 0) {
                        //props.history.push('/main')
                        window.location.href='/main';
                    } else {
                        this.changeLoggingState(false);
                        message.error(data.data);
                    }
                }, (error) => {
                    this.changeLoggingState(false);
                    this.changeCaptcha();
                    message.error(error.data);
                });
            }
        });
    }
}

export default new LoginState()