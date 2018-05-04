import React, {Component} from 'react';
import {observer, inject} from 'mobx-react'
import {Form, Table, Button, Input, Modal, Select, Spin} from 'antd';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Search = Input.Search;

import style from './user.css'

@inject('userStore', 'roleStore')
@observer
class UserView extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '昵称',
            dataIndex: 'nickName',
            key: 'nickName',
            render: text => <a href="#">{text}</a>,
        }, {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        }, {
            title: '手机号',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        }, {
            title: '邮箱',
            dataIndex: 'eMail',
            key: 'eMail',
        }, {
            width: 220,
            title: '操作',
            key: 'action',
            render: (text, record) => (<div className={style.operation}>
                    <Button size="small" type="primary" ghost
                            onClick={() => this.props.userStore.changeAssignModalVisibl(true, record, this.props.roleStore)}>角色</Button>
                    <Button size="small"
                            onClick={() => this.props.userStore.changeAddModalVisible(true, this.props.form, record)}>编辑</Button>
                    <Button size="small" type="danger" ghost onClick={() => this.showConfirm(record)}>删除</Button>
                </div>
            ),
        }];
    }

    componentDidMount() {
        this.props.userStore.queryUserList(1);
    }

    showConfirm(record) {
        // noinspection JSCheckFunctionSignatures
        confirm({
            title: '确定要删除这个帐号?',
            content: '删除帐号信息后所有帐号帐号相关的所有信息都将删除！',
            onOk: () => {
                this.props.userStore.deleteUser(record);
            },
            onCancel() {
            },
        });
    }

    addUserModal() {
        const {
            addModalSubmit,
            addModalVisible,
            changeAddModalVisible,
            handleConfirmBlur,
            checkValidator,
            checkConfirm,
            checkPassword,
            addModalLoading,
            editUser
        } = this.props.userStore;
        const form = this.props.form;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{width: 70}}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        return (<Modal
            title="添加新用户"
            width={600}
            visible={addModalVisible}
            onOk={() => addModalSubmit(form)}
            onCancel={() => changeAddModalVisible(false, form)}
        >
            <Spin size="large" tip="Logging..." spinning={addModalLoading}>
                <Form>
                    <FormItem
                        className={style.hide}
                        {...formItemLayout}
                        label="用户Id"
                        hasFeedback
                    >
                        {getFieldDecorator('id', {
                            initialValue: editUser ? editUser.id : null
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="昵称"
                        hasFeedback
                    >
                        {getFieldDecorator('nickName', {
                            initialValue: editUser ? editUser.nickName : null,
                            rules: [{required: true, message: '请输入昵称!', whitespace: true}],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="帐号"
                        hasFeedback
                    >
                        {getFieldDecorator('username', {
                            initialValue: editUser ? editUser.username : null,
                            validateTrigger: 'onBlur',
                            rules: [
                                {required: true, message: '用户名不能为空！'},
                                {validator: (rule, value, callback) => checkValidator(rule, value, callback, 'username', form)}
                            ]
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="密码"
                        hasFeedback
                    >
                        {getFieldDecorator('password', {
                            initialValue: editUser ? editUser.password : null,
                            rules: [{
                                required: true, message: '请输入密码!',
                            }, {
                                validator: (rule, value, callback) => checkConfirm(rule, value, callback, form),
                            }],
                        })(
                            <Input type="password"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="再次输入密码"
                        hasFeedback
                    >
                        {getFieldDecorator('confirm', {
                            initialValue: editUser ? editUser.confirm : null,
                            rules: [{
                                required: true, message: '请再次输入密码!',
                            }, {
                                validator: (rule, value, callback) => checkPassword(rule, value, callback, form),
                            }],
                        })(
                            <Input type="password" onBlur={handleConfirmBlur}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机号码"
                    >
                        {getFieldDecorator('phoneNumber', {
                            initialValue: editUser ? editUser.phoneNumber : null,
                            validateTrigger: 'onBlur',
                            rules: [
                                {required: true, message: '手机号码不能为空！'},
                                {validator: (rule, value, callback) => checkValidator(rule, value, callback, 'phone', form)}
                            ]
                        })(
                            <Input addonBefore={prefixSelector} style={{width: '100%'}}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="电子邮箱"
                        hasFeedback
                    >
                        {getFieldDecorator('eMail', {
                            initialValue: editUser ? editUser.eMail : null,
                            validateTrigger: 'onBlur',
                            rules: [
                                {required: true, message: '电子邮箱不能为空！'},
                                {validator: (rule, value, callback) => checkValidator(rule, value, callback, 'email', form)}
                            ]
                        })(
                            <Input/>
                        )}
                    </FormItem>
                </Form>
            </Spin>
        </Modal>);
    }

    assignRolesModal() {
        const {
            assignModalVisible,
            changeAssignModalVisibl,
            assignModalSubmit,
            roleRowSelection
        } = this.props.userStore;
        const {
            listData,
            pageSize,
            loading,
            total,
            queryRoleList
        } = this.props.roleStore;
        const columns = [{
            title: '角色名',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            render: text => <a href="#">{text}</a>
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime'
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description'
        }];

        return (<Modal
            width={1000}
            title="分配角色"
            visible={assignModalVisible}
            onOk={() => assignModalSubmit()}
            onCancel={() => changeAssignModalVisibl(false)}
        >
            <Table
                bordered
                columns={columns}
                dataSource={listData.slice()}
                loading={loading}
                rowSelection={roleRowSelection}
                pagination={{  //分页
                    total: total, //数据总数量
                    pageSize: pageSize,  //每页显示几条
                    defaultPageSize: pageSize, //默认显示几条一页
                    onChange(current) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                        queryRoleList(current, true);
                    },
                    showTotal: function () {  //设置显示一共几条数据
                        return '共 ' + total + ' 条数据';
                    }
                }}
            />
        </Modal>);
    }

    render() {
        const {
            listData,
            pageSize,
            loading,
            total,
            queryUserList,
            changeAddModalVisible,
        } = this.props.userStore;
        return (<div>
            <div className={style.head_div}>
                <Search
                    placeholder="搜索用户名、手机号、邮箱"
                    style={{width: 250}}
                    onSearch={value => console.log(value)}
                />
                <Button type="primary" ghost onClick={() => changeAddModalVisible(true)}>添加用户</Button>
            </div>
            <Table
                bordered
                columns={this.columns}
                dataSource={listData.slice()}
                rowKey={row => row.id}
                loading={loading}
                pagination={{  //分页
                    total: total, //数据总数量
                    pageSize: pageSize,  //每页显示几条
                    defaultPageSize: pageSize, //默认显示几条一页
                    onChange(current) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                        queryUserList(current);
                    },
                    showTotal: function () {  //设置显示一共几条数据
                        return '共 ' + total + ' 条数据';
                    }
                }}
            />
            {this.addUserModal()}
            {this.assignRolesModal()}
        </div>)
    }
}

export default UserView = Form.create()(UserView);