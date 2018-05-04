import React from 'react';
import {observable, action, runInAction} from 'mobx';
import {message} from 'antd';
import fetchUtil from '../../../../common/utils/FetchUtil'

class CustomContentStore {
    @observable selectStyleModalVisible = false;
    @observable styleModalVisible = false;
    @observable styleType;

    @action
    changeSelectStyleModalVisible = (visible) => {
        this.selectStyleModalVisible = visible;
    };

    @action
    changeStyleModalVisible = (visible, styleType) => {
        runInAction(() => {
            this.styleModalVisible = visible;
            this.styleType = styleType;
            if (visible) {
                this.selectStyleModalVisible = false;
            }
        });
    };
}

export default new CustomContentStore()