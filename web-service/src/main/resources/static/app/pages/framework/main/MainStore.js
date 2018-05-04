import {observable, action} from 'mobx';

class MainStore {
    @observable userInfo;


    @action
    setUserInfo = (userInfo) => {
        this.userInfo = userInfo;
    }
}

export default new MainStore()