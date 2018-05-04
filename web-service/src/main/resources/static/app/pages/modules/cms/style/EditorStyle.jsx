import React, {Component} from 'react';
import {Form, Input, Divider} from 'antd';
import Editor from '../../../../common/components/editor/Editor'
import validatorUtils from '../../../../common/utils/ValidatorUtils'

const FormItem = Form.Item;

class EditorStyle extends Component {

    state = {
        inputInfo: {}
    };

    onChange = (e, id) => {
        this.state.inputInfo[id] = e.target.value;
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 16},
        };

        const formTailLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 16, offset: 4},
        };

        return (<Form>
                <FormItem
                    {...formItemLayout}
                    label="标题"
                >
                    {getFieldDecorator('title', {
                        rules: [{required: true, message: '请输入标题！', whitespace: true}],
                    })(
                        <Input onChange={(e) => this.onChange(e, 'title')}/>
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
                        <Input onChange={(e) => this.onChange(e, 'id')}/>
                    )}
                </FormItem>

                <FormItem {...formTailLayout}>
                    <Divider style={{color: 'blue'}}>样式预览</Divider>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={this.state.inputInfo.title ? this.state.inputInfo.title : '标题'}
                >
                    {getFieldDecorator(this.state.inputInfo.id ? this.state.inputInfo.id : 'editor')(
                        <Editor editorStyle={{height: '100%', maxHeight: '300px'}}
                                editorRef={this.state.inputInfo.id ? this.state.inputInfo.id : 'editor'}/>
                    )}
                </FormItem>
            </Form>
        )

    }
}

export default EditorStyle = Form.create()(EditorStyle);