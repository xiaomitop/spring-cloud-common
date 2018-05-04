import React, {Component} from 'react';
import {observer, inject} from 'mobx-react'
import {Form, Table, Button, Input, Modal, Spin, TreeSelect, Select} from 'antd';

const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const Search = Input.Search;
const TreeNode = TreeSelect.TreeNode;
import style from '../user/user.css'

@inject('permissionStore')
@observer
class PermissionView extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '权限名',
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="#">{text}</a>,
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: type => <div
                style={type === 0 ? {color: '#336666'} : {color: '#660000'}}>{type === 0 ? '菜单' : '请求权限'}</div>,
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        }, {
            title: '权限地址',
            dataIndex: 'url',
            key: 'url',
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        }, {
            width: 150,
            title: '操作',
            key: 'action',
            render: (text, record) => (<div className={style.operation}>
                    <Button size="small" type="primary" ghost
                            onClick={() => this.props.permissionStore.changeAddModalVisible(true, this.props.form, record)}>编辑</Button>
                    <Button size="small" type="danger" ghost onClick={() => this.showConfirm(record)}>删除</Button>
                </div>
            ),
        }];
    }

    componentDidMount() {
        this.props.permissionStore.queryPermissionPage(1, false);
    }

    showConfirm(record) {
        // noinspection JSCheckFunctionSignatures
        confirm({
            title: '确定要删除这条权限信息?',
            content: '删除权限信息后所有角色将不再拥有该权限！',
            onOk: () => {
                this.props.permissionStore.deletePermission(record);
            },
            onCancel() {
            },
        });
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} value={item.value} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item}/>;
        });
    };

    render() {
        const {
            listData,
            pageSize,
            loading,
            total,
            queryPermissionPage,
            addModalSubmit,
            addModalVisible,
            changeAddModalVisible,
            checkValidator,
            addModalLoading,
            treeData,
            editPermission
        } = this.props.permissionStore;
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
                    placeholder="搜索权限名、地址、类型"
                    style={{width: 250}}
                    onSearch={value => console.log(value)}
                />
                <Button type="primary" ghost onClick={() => changeAddModalVisible(true, form)}>添加权限</Button>
            </div>
            <Table
                bordered
                columns={this.columns}
                dataSource={listData.slice()}
                loading={loading}
                rowKey={record => record.id}
                pagination={{  //分页
                    total: total, //数据总数量
                    pageSize: pageSize,  //每页显示几条
                    defaultPageSize: pageSize, //默认显示几条一页
                    onChange(current) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                        queryPermissionPage(current, true);
                    },
                    showTotal: function () {  //设置显示一共几条数据
                        return '共 ' + total + ' 条数据';
                    }
                }}
            />

            <Modal
                title="添加新权限"
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
                            label="权限Id"
                            hasFeedback
                        >
                            {getFieldDecorator('id', {
                                initialValue: editPermission ? editPermission.id : null
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="父权限"
                            hasFeedback
                        >
                            {getFieldDecorator('parentId', {
                                initialValue: editPermission ? editPermission.parentId + '' : '0'
                            })(
                                <TreeSelect
                                    dropdownStyle={{maxHeight: 500, overflow: 'auto'}}
                                    placeholder="无父权限"
                                    allowClear
                                >
                                    <TreeNode title="无父权限" value="0" key="0"/>
                                    {this.renderTreeNodes(treeData)}
                                </TreeSelect>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="权限类型"
                            hasFeedback
                            required={true}
                        >
                            {getFieldDecorator('type', {
                                initialValue: editPermission ? editPermission.type + '' : '0'
                            })(
                                <Select>
                                    <Option value="0">菜单权限</Option>
                                    <Option value="1">请求权限</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="权限名称"
                            hasFeedback
                        >
                            {getFieldDecorator('name', {
                                initialValue: editPermission ? editPermission.name : null,
                                validateTrigger: 'onBlur',
                                rules: [
                                    {required: true, message: '权限名称不能为空！'},
                                    {validator: (rule, value, callback) => checkValidator(rule, value, callback, "roleName", form)}
                                ]
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="权限路径"
                            hasFeedback
                        >
                            {getFieldDecorator('url', {
                                initialValue: editPermission ? editPermission.url : null
                            })(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="菜单图标"
                            hasFeedback
                        >
                            {getFieldDecorator('menuIcon', {
                                initialValue: editPermission ? editPermission.menuIcon : null
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
                                initialValue: editPermission ? editPermission.description : null
                            })(
                                <Input/>
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        </div>)
    }
}

export default PermissionView = Form.create()(PermissionView);