import {observable, action, runInAction} from 'mobx';
import {message} from 'antd';
import fetchUtil from '../../../common/utils/FetchUtil'

class MainLayoutStore {
    @observable roleMenu = [];
    breadcrumb = [{name: '首页', key: 0}];

    @action
    menuOnClick = (data) => {
        this.breadcrumb = data.item.props.breadcrumb;
    };

    @action
    queryUserInfo = (mainStore) => {
        fetchUtil.post(`/user/queryUserInfo`, null, (data) => {
            runInAction(() => {
                if (data.retCode === 0) {
                    this.roleMenu = data.data.menu;
                    mainStore.setUserInfo(data.data.userInfo);
                } else {
                    this.changeLoggingState(false);
                    message.error(data.data);
                }
            })
        }, (error) => {
            message.error(error.data);
        });
    };

    @action
    headMenuOnClick = (item) => {
        switch (item.key) {
            case 'logout':
                fetchUtil.post(`/user/logout`, null, () => {
                    window.location.href = "/user/login";
                }, (error) => {
                    message.error(error.data);
                });
                break;
        }
    }

}

export default new MainLayoutStore()