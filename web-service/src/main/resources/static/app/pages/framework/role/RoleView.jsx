import React, {Component} from 'react';
import {observer, inject} from 'mobx-react'
import {Form, Table, Button, Input, Modal, Spin, Tree} from 'antd';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Search = Input.Search;
const TreeNode = Tree.TreeNode;

import style from '../user/user.css'

@inject('roleStore')
@observer
class RoleView extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '角色名',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="#">{text}</a>,
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        }, {
            width: 220,
            title: '操作',
            key: 'action',
            render: (text, record) => (<div className={style.operation}>
                    <Button size="small" type="primary" ghost
                            onClick={() => this.props.roleStore.changeAssignModalVisibl(true, record)}>权限</Button>
                    <Button size="small"
                            onClick={() => this.props.roleStore.changeAddModalVisible(true, this.props.form, record)}>编辑</Button>
                    <Button size="small" type="danger" ghost onClick={() => this.showConfirm(record)}>删除</Button>
                </div>
            ),
        }];
    }

    componentDidMount() {
        this.props.roleStore.queryRoleList(1, true);
    }

    showConfirm(record) {
        // noinspection JSCheckFunctionSignatures
        confirm({
            title: '确定要删除这条角色信息?',
            content: '删除角色信息后所有用户将不再拥有该角色！',
            onOk: () => {
                this.props.roleStore.deleteRole(record);
            },
            onCancel() {
            },
        });
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item}/>;
        });
    };

    assignRolesModal() {
        const {
            assignModalVisible,
            changeAssignModalVisibl,
            assignModalSubmit,
            treeData,
            onCheck,
            checkedKeys
        } = this.props.roleStore;

        return (<Modal
            title="分配权限"
            visible={assignModalVisible}
            onOk={() => assignModalSubmit()}
            onCancel={() => changeAssignModalVisibl(false)}
        >
            <Tree
                checkable
                checkedKeys={checkedKeys.slice()}
                onCheck={onCheck}>
                {this.renderTreeNodes(treeData)}
            </Tree>
        </Modal>);
    }

    render() {
        const {
            listData,
            pageSize,
            loading,
            total,
            queryRoleList,
            addModalSubmit,
            addModalVisible,
            changeAddModalVisible,
            checkValidator,
            addModalLoading,
            editRole
        } = this.props.roleStore;
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
        return (<div>
            <div className={style.head_div}>
                <Search
                    placeholder="搜索角色名"
                    style={{width: 250}}
                    onSearch={value => console.log(value)}
                />
                <Button type="primary" ghost onClick={() => changeAddModalVisible(true, form)}>添加角色</Button>
            </div>
            <Table
                bordered
                columns={this.columns}
                dataSource={listData.slice()}
                loading={loading}
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

            <Modal
                title="添加新角色"
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
                            label="角色Id"
                            hasFeedback
                        >
                            {getFieldDecorator('id', {
                                initialValue: editRole ? editRole.id : null
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="角色名称"
                            hasFeedback
                        >
                            {getFieldDecorator('name', {
                                initialValue: editRole ? editRole.name : null,
                                validateTrigger: 'onBlur',
                                rules: [
                                    {required: true, message: '角色名称不能为空！'},
                                    {validator: (rule, value, callback) => checkValidator(rule, value, callback, form)}
                                ]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="角色描述"
                            hasFeedback
                        >
                            {getFieldDecorator('description', {
                                initialValue: editRole ? editRole.description : null
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
            {this.assignRolesModal()}
        </div>)
    }
}

export default RoleView = Form.create()(RoleView);