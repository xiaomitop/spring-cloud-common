import {observable, action, computed, runInAction} from 'mobx';
import {message} from 'antd';
import fetchUtil from '../../../common/utils/FetchUtil'

class UserStore {
    @observable editUser;
    @observable addModalVisible = false;
    @observable addModalLoading = false;
    @observable assignModalVisible = false;
    @observable listData = [];
    @observable loading = false;
    confirmDirty;
    total = 0;
    pageNo = 1;
    pageSize = 10;

    rowSelectMap = { //用于保存角色分配时的选中对象
        userId: null,
        roleIds: {}
    };
    @observable
    roleRowSelection = { //角色分配时的选择回调
        onSelect: (record, selected) => {
            if (selected) {
                this.rowSelectMap.roleIds[record.id] = record.id;
            } else {
                delete this.rowSelectMap.roleIds[record.id];
            }
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            for (const i in changeRows) {
                if (selected) {
                    this.rowSelectMap.roleIds[changeRows[i].id] = changeRows[i].id;
                } else {
                    delete this.rowSelectMap.roleIds[changeRows[i].id];
                }
            }
        },
        getCheckboxProps: record => ({
            defaultChecked: this.rowSelectMap.roleIds[record.id], // Column configuration not to be checked
        })
    };

    @action
    changeAddModalVisible = (visible, form, record) => {
        runInAction(() => {
            if (visible) {
                if (record) {
                    this.editUser = {
                        id: record.id,
                        nickName: record.nickName,
                        username: record.username,
                        password: record.password,
                        confirm: record.password,
                        phoneNumber: record.phoneNumber,
                        eMail: record.eMail
                    };
                }
            } else if (form) {
                this.editUser = null;
                form.resetFields();
            }
            this.addModalVisible = visible;
        })
    };

    @action
    changeAssignModalVisibl = (visible, user, roleStore) => {
        if (visible) {
            this.rowSelectMap = {userId: user.id, roleIds: {}};
            fetchUtil.post(`/user/queryRoleIdsByUserId`, {userId: user.id}, (data) => {
                const roles = data.data;
                if (roles) {
                    for (const i in roles) {
                        this.rowSelectMap.roleIds[roles[i]] = roles[i];
                    }
                }
                runInAction(() => {
                    this.assignModalVisible = visible;
                    if (roleStore) roleStore.queryRoleList(1, true);
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
    queryUserList = (pageNo) => {
        if (pageNo) this.pageNo = pageNo;
        this.loading = true;
        let formData = new FormData();
        formData.append('pageNo', this.pageNo);
        formData.append('pageSize', this.pageSize);
        fetchUtil.post(`/user/queryUserList`, formData, (data) => {
            runInAction(() => {
                this.loading = false;
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
                fetchUtil.postJson(`/user/addUser`, values, (data) => {
                    runInAction(() => {
                        this.addModalLoading = false;
                        this.changeAddModalVisible(false, form);
                        this.queryUserList(1, this.pageSize);
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
    deleteUser = (record) => {
        fetchUtil.post(`/user/deleteUser`, {id: record.id}, () => {
            runInAction(() => {
                console.log("record", record);
                this.listData = this.listData.filter(item => item.id !== record.id);
                console.log("listData", this.listData)
            })
        }, (error) => {
            runInAction(() => {
                message.error(error.data);
            })
        });
    };

    @action
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
    };

    @action
    checkPassword = (rule, value, callback, form) => {
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    };

    @action
    checkConfirm = (rule, value, callback, form) => {
        if (value && this.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };

    @action
    checkValidator = (rule, value, callback, type, form) => {
        let id = form.getFieldValue('id');
        if (type === "username") {
            const regEx = /^[a-zA-Z0-9_]{4,16}$/;
            if (value) {
                if (!regEx.test(value)) {
                    callback('帐号只能是4到16位的英文、数字、下划线!');
                } else {
                    fetchUtil.postJson(`/user/checkUserInfo`, {username: value, id: id ? id : 0}, () => {
                        callback();
                    }, (error) => {
                        callback(error.data);
                    });
                }
            } else {
                callback();
            }
        } else if (type === "phone") {
            const regEx = /^1\d{10}$/;   //正则表达式
            if (value) {
                if (!regEx.test(value)) {
                    callback("手机号码输入错误!");
                } else {
                    fetchUtil.postJson(`/user/checkUserInfo`, {phoneNumber: value, id: id ? id : 0}, () => {
                        callback();
                    }, (error) => {
                        callback(error.data);
                    });
                }
            } else {
                callback();
            }
        } else if (type === "email") {
            const regEx = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/; //正则表达式
            if (value) {
                if (!regEx.test(value)) {
                    callback('请输入正确的邮箱地址!');
                } else {
                    fetchUtil.postJson(`/user/checkUserInfo`, {eMail: value, id: id ? id : 0}, () => {
                        callback();
                    }, (error) => {
                        callback(error.data);
                    });
                }
            } else {
                callback();
            }
        }
    };

    @action
    assignModalSubmit = () => {
        let formData = new FormData();
        const roleIdsMap = this.rowSelectMap.roleIds;
        const roleIds = [];
        for (const key in roleIdsMap) {
            roleIds.push(roleIdsMap[key]);
        }
        formData.append('userId', this.rowSelectMap.userId);
        formData.append('roleIds', roleIds);
        fetchUtil.post(`/user/addUserRole`, formData, () => {
            runInAction(() => {
                this.assignModalVisible = false;
            })
        }, (error) => {
            runInAction(() => {
                message.error(error.data);
            })
        });
    }
}

export default new UserStore()