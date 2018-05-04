import {observable, action, computed, runInAction} from 'mobx';
import {message} from 'antd';
import fetchUtil from '../../../common/utils/FetchUtil'

class RoleStore {
    @observable editRole;
    @observable addModalVisible = false;
    @observable addModalLoading = false;
    @observable assignModalVisible = false;
    @observable listData = [];
    @observable treeData = [];
    @observable checkedKeys = [];
    @observable loading = false;
    roleId;
    total = 0;
    pageNo = 1;
    pageSize = 10;
    parentKeys = {};

    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.checkedKeys = checkedKeys
    };

    @action
    changeAssignModalVisibl = (visible, role) => {
        if (visible) {
            let formData = new FormData();
            formData.append('roleId', role.id);
            fetchUtil.post(`/permission/queryPerTreeList`, formData, (data) => {
                const ret = data.data;
                runInAction(() => {
                    this.roleId = role.id;
                    this.assignModalVisible = visible;
                    this.treeData = this.partsTreeData(ret.permissions);
                    this.checkedKeys = this.partsCheckedKeys(ret.rolePermissionIds);
                    console.log("this.checkedKeys", this.checkedKeys)
                })
            }, (error) => {
                runInAction(() => {
                    message.error(error.data);
                })
            });
        } else {
            this.assignModalVisible = visible;
        }
    };

    @action
    changeAddModalVisible = (visible, form, record) => {
        runInAction(() => {
            if (visible) {
                if (record) {
                    this.editRole = {
                        id: record.id,
                        name: record.name,
                        description: record.description
                    };
                }
            } else if (form) {
                this.editRole = null;
                form.resetFields();
            }
            this.addModalVisible = visible;
        })
    };

    @action
    queryRoleList = (pageNo, isKey) => {
        if (pageNo) this.pageNo = pageNo;
        this.loading = true;
        let formData = new FormData();
        formData.append('pageNo', this.pageNo);
        formData.append('pageSize', this.pageSize);
        fetchUtil.post(`/role/queryRoleList`, formData, (data) => {
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
                fetchUtil.postJson(`/role/addRole`, values, () => {
                    runInAction(() => {
                        this.addModalLoading = false;
                        this.changeAddModalVisible(false, form);
                        this.queryRoleList(1, true);
                        form.resetFields();
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
    deleteRole = (record) => {
        fetchUtil.post(`/role/deleteRole`, {id: record.id}, () => {
            runInAction(() => {
                this.listData = this.treeFilter(this.listData, record.key);
            })
        }, (error) => {
            runInAction(() => {
                message.error(error.data);
            })
        });
    };

    checkValidator = (rule, value, callback, form) => {
        if (value) {
            let id = form.getFieldValue('id');
            fetchUtil.postJson(`/role/checkRoleInfo`, {name: value, id: id ? id : 0}, () => {
                callback();
            }, (error) => {
                callback(error.data);
            });
        } else {
            callback();
        }
    };

    @action
    assignModalSubmit = () => {
        let formData = new FormData();
        formData.append('roleId', this.roleId);
        formData.append('permissionIds', this.checkedKeys);
        fetchUtil.post(`/role/addRolePermission`, formData, () => {
            runInAction(() => {
                this.assignModalVisible = false;
            })
        }, (error) => {
            runInAction(() => {
                message.error(error.data);
            })
        });
    };

    partsTreeData = (data) => {
        const array = [];
        for (const i in data) {
            let treeData = {};
            if (data[i].children) {
                //如果存在子节点证明是父节点保存起来
                this.parentKeys[data[i].id] = data[i].id;
                treeData = {
                    title: data[i].name,
                    key: data[i].id,
                    children: this.partsTreeData(data[i].children)
                };
            } else {
                treeData = {
                    title: data[i].name,
                    key: data[i].id
                };
            }
            array.push(treeData);
        }
        return array;
    };

    //删除树中的节点
    treeFilter(data, id) {
        let newData = data.filter(x => x.key !== id);
        newData.forEach(x => x.children && (x.children = this.treeFilter(x.children, id)));
        return newData
    }

    partsCheckedKeys = (data) => {
        const array = [];
        for (const i in data) {
            if (!this.parentKeys[data[i]])
                array.push(String(data[i]));
        }
        return array;
    };

    generatingKey(data) {
        for (const i in data) {
            data[i].key = Math.random().toString(36).substr(3);
            if (data[i].children) {
                this.generatingKey(data[i].children)
            }
        }
        return data;
    }
}

export default new RoleStore()