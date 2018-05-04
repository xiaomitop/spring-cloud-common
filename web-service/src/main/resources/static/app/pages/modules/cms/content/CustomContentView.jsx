import React, {Component} from 'react';
import {observer, inject} from 'mobx-react'
import {Form, Layout, Tree, Divider, Button, Icon, Input, Modal, List} from 'antd';

import validatorUtils from '../../../../common/utils/ValidatorUtils'
import Editor from '../../../../common/components/editor/Editor'
import {InputStyle, EditorStyle} from '../style/index'

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const {Content, Sider} = Layout;

@inject('customContentStore')
@observer
class CustomContentView extends Component {

    styleView = (styleType, submit) => {
        switch (styleType) {
            case 'input':
                return <InputStyle submit={submit}/>;
            case 'editor':
                return <EditorStyle submit={submit}/>;
        }
    };

    data = [
        {
            key: 'input',
            title: 'Input',
            description: (<Input/>)
        },
        {
            key: 'editor',
            title: 'Editor',
            description: (<Editor editorRef="editor"
                                  editorStyle={{height: '100%', maxHeight: '300px'}}/>)
        }
    ];

    state = {
        visible: false,
        treeData: [
            {title: 'Expand to load', key: '0'},
            {title: 'Expand to load', key: '1'},
            {title: 'Tree Node', key: '2', isLeaf: true},
        ],
    };
    onLoadData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            setTimeout(() => {
                treeNode.props.dataRef.children = [
                    {title: 'Child Node', key: `${treeNode.props.eventKey}-0`},
                    {title: 'Child Node', key: `${treeNode.props.eventKey}-1`},
                ];
                this.setState({
                    treeData: [...this.state.treeData],
                });
                resolve();
            }, 1000);
        });
    };
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

    selectStyleModal = () => {
        const {selectStyleModalVisible, changeSelectStyleModalVisible, changeStyleModalVisible} = this.props.customContentStore;
        return (<Modal
                title="选择需要添加的样式"
                visible={selectStyleModalVisible}
                footer={null}
                width={800}
                onCancel={() => changeSelectStyleModalVisible(false)}
            >
                <div style={{overflow: 'auto', maxHeight: 500}}>
                    <List
                        itemLayout="horizontal"
                        dataSource={this.data}
                        renderItem={item => (
                            <List.Item actions={[<Button
                                type="dashed"
                                style={{float: 'right'}}
                                onClick={() => changeStyleModalVisible(true, item.key)}>选择</Button>]}>
                                <List.Item.Meta style={{width: '100%'}}
                                                title={<a>{item.title}</a>}
                                                description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </Modal>
        )
    };

    test = (values) => {
        console.log("submit", values)
    };

    styleModal = () => {
        const {styleModalVisible, changeStyleModalVisible, styleType} = this.props.customContentStore;
        return (<Modal
                width={1000}
                title="添加样式"
                visible={styleModalVisible}
                onCancel={() => changeStyleModalVisible(false)}
                footer={null}
            >
                {this.styleView(styleType, (values) => this.test(values))}
            </Modal>
        )
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {changeSelectStyleModalVisible} = this.props.customContentStore;
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 12},
        };
        const formTailLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 12, offset: 2},
        };
        return (<Layout style={{padding: '24px 0', background: '#fff'}}>
            <Sider width={200} style={{background: '#fff'}}>
                <div style={{float: 'left', maxWidth: 180}}>
                    <Tree loadData={this.onLoadData}>
                        {this.renderTreeNodes(this.state.treeData)}
                    </Tree>
                </div>
                <Divider style={{height: '100%', float: 'right'}} type="vertical"/>
            </Sider>

            <Content style={{padding: '0 24px', minHeight: 280}}>
                <Form>
                    <FormItem {...formTailLayout}>
                        <Button type="dashed" onClick={() => changeSelectStyleModalVisible(true)}>
                            <Icon type="plus"/> 添加资源类型
                        </Button>
                        <Button type="dashed" style={{marginLeft: 10}}
                                onClick={() => changeSelectStyleModalVisible(true)}>
                            <Icon type="plus"/> 添加属性类型
                        </Button>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="标题"
                    >
                        {getFieldDecorator('title', {
                            rules: [{required: true, message: '请输入标题！', whitespace: true}],
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="id"
                    >
                        {getFieldDecorator('id', {
                            rules: [{required: true, message: '请输入id！', whitespace: true}, {
                                validator: (rule, value, callback) => validatorUtils.checkInputMap(
                                    rule,
                                    value,
                                    callback,
                                    {regex: '/^[a-zA-Z0-9_]+$/', error: '输入只能是字母、数字、下划线！'}
                                )
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>

                    <FormItem {...formTailLayout}>
                        <Divider style={{color: 'blue'}}>资源预览</Divider>
                    </FormItem>

                    <FormItem {...formTailLayout}>
                        <Button type="primary" htmlType="submit">确定提交</Button>
                    </FormItem>
                    {this.selectStyleModal()}
                    {this.styleModal()}
                </Form>
            </Content>
        </Layout>)
    }
}

export default CustomContentView = Form.create()(CustomContentView);
