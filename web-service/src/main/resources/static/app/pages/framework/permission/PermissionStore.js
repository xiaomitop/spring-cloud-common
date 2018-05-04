import {observable, action, computed, runInAction} from 'mobx';
import {message} from 'antd';
import fetchUtil from '../../../common/utils/FetchUtil'

class PermissionStore {
    @observable editPermission;
    @observable addModalVisible = false;
    @observable addModalLoading = false;
    @observable listData = [];
    @observable treeData = [];
    @observable loading = false;
    total = 0;
    pageNo = 1;
    pageSize = 10;

    @action
    changeAddModalVisible = (visible, form, record) => {
        if (visible) {
            fetchUtil.post(`/permission/queryPerTreeList`, {"roleId": 0}, (data) => {
                const ret = data.data;
                runInAction(() => {
                    if (record) {
                        this.editPermission = {
                            id: record.id,
                            parentId: record.parentId,
                            type: record.type,
                            name: record.name,
                            url: record.url,
                            menuIcon: record.menuIcon,
                            description: record.description
                        };
                    }
                    this.addModalVisible = visible;
                    this.treeData = this.partsTreeData(ret.permissions);
                })
            }, (error) => {
                runInAction(() => {
                    message.error(error.data);
                })
            });
        } else {
            runInAction(() => {
                //弹出框消失，清空表单
                form.resetFields();
                this.addModalVisible = visible;
                this.editPermission = null;
            })
        }
    };

    @action
    queryPermissionPage = (pageNo, isKey) => {
        if (pageNo) this.pageNo = pageNo;
        this.loading = true;
        let formData = new FormData();
        formData.append('pageNo', this.pageNo);
        formData.append('pageSize', this.pageSize);
        fetchUtil.post(`/permission/queryPermissionPage`, formData, (data) => {
            runInAction(() => {
                this.loading = false;
                if (isKey) {
                    data.data = this.generatingKey(data.data);
                }
                this.listData = data.data;
                this.total = data.total;
            })
        }, (error) => {
            runInAction(() => {
                this.loading = false;
                message.error(error.data);
            })
        });
    };

    @action
    addModalSubmit = (form) => {
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.addModalLoading = true;
                fetchUtil.postJson(`/permission/addPermission`, values, () => {
                    runInAction(() => {
                        this.addModalLoading = false;
                        this.changeAddModalVisible(false, form);
                        this.queryPermissionPage(1, false);
                    })
                }, (error) => {
                    runInAction(() => {
                        this.addModalLoading = false;
                        message.error(error.data);
                    })
                });
            }
        });
    };

    @action
    checkValidator = (rule, value, callback, type, form) => {
        if (type === "roleName") {
            if (value) {
                let id = form.getFieldValue('id');
                fetchUtil.post(`/permission/checkPermissionInfo`, {name: value, id: id ? id : 0}, () => {
                    callback();
                }, (error) => {
                    callback(error.data);
                });
            } else {
                callback();
            }
        }
    };

    @action
    deletePermission = (record) => {
        fetchUtil.post(`/permission/deletePermission`, {id: record.id}, () => {
            runInAction(() => {
                this.listData = this.treeFilter(this.listData, record.id);
            })
        }, (error) => {
            runInAction(() => {
                message.error(error.data);
            })
        });
    };

    generatingKey(data) {
        data.forEach(x => {
            x.key = Math.random().toString(36).substr(3);
            if (x.children) {
                this.generatingKey(x.children)
            }
        });
        return data;
    }

    //删除树中的节点
    treeFilter(data, id) {
        let newData = data.filter(x => x.id !== id);
        newData.forEach(x => x.children && (x.children = this.treeFilter(x.children, id)));
        return newData
    }

    partsTreeData = (data) => {
        const array = [];
        data.forEach(x => {
            let treeData = {};
            if (x.children) {
                treeData = {
                    title: x.name,
                    value: x.id.toString(),
                    key: x.id,
                    children: this.partsTreeData(x.children)
                };
            } else {
                treeData = {
                    title: x.name,
                    value: x.id.toString(),
                    key: x.id
                };
            }
            array.push(treeData);
        });
        return array;
    };
}

export default new PermissionStore()