import React, {Component} from 'react';
import {Form, Input, Divider, Select, Button} from 'antd';
import validatorUtils from '../../../../common/utils/ValidatorUtils'

const Option = Select.Option;
const FormItem = Form.Item;

class InputStyle extends Component {

    state = {
        inputInfo: {
            validateRules: {
                regex: '',
                error: ''
            }
        }
    };

    submit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.styleType = 'input';
                this.props.submit(values);
            }
        });
    };

    onChange = (e, id) => {
        if (id === 'regex') {
            this.state.inputInfo.validateRules.regex = e.target.value;
            this.props.form.setFieldsValue({
                regex: e.target.value,
            });
        } else if (id === 'error') {
            this.state.inputInfo.validateRules.error = e.target.value;
            this.props.form.setFieldsValue({
                error: e.target.value,
            });
        } else {
            this.state.inputInfo[id] = e.target.value;
        }
    };

    onSelect = (value) => {
        this.state.inputInfo.validateRules = validatorUtils.validateRules[value];
        this.props.form.setFieldsValue({
            regex: this.state.inputInfo.validateRules && this.state.inputInfo.validateRules.regex ? this.state.inputInfo.validateRules.regex : '',
            error: this.state.inputInfo.validateRules && this.state.inputInfo.validateRules.error ? this.state.inputInfo.validateRules.error : ''
        });
        console.log("validateRules: ", this.state.inputInfo.validateRules);
        this.setState({});
    };

    data = () => {
        return {
            type: 'input',
            id: this.state.inputInfo.id,
            title: this.state.inputInfo.title,
            validateRules: this.state.inputInfo.validateRules
        }
    };

    render() {
        const validateRules = this.state.inputInfo.validateRules;
        const {getFieldDecorator} = this.props.form;

        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 16},
        };

        const formTailLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 16, offset: 4},
        };

        const selectAfter = (
            <Select defaultValue="" style={{width: 150}} onSelect={this.onSelect}>
                <Option value="">无校验</Option>
                <Option value="notEmpty">不能为空</Option>
                <Option value="onlyEnglish">只能为英文</Option>
                <Option value="onlyEnglishNumUnder">英文数字下划线</Option>
                <Option value="httpFtpHttps">ftp/http/https</Option>
            </Select>
        );

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
                        rules: [{required: true, message: '请输入ID！', whitespace: true},
                            {
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
                <FormItem
                    {...formItemLayout}
                    label="校验规则"
                >
                    {getFieldDecorator('regex')(
                        <Input
                            addonAfter={selectAfter}
                            onChange={(e) => this.onChange(e, 'regex')}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="错误提示"
                >
                    {getFieldDecorator('error')(
                        <Input onChange={(e) => this.onChange(e, 'error')}/>
                    )}
                </FormItem>

                <FormItem {...formTailLayout}>
                    <Divider style={{color: 'blue'}}>样式预览</Divider>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={this.state.inputInfo.title ? this.state.inputInfo.title : '标题'}
                >
                    {getFieldDecorator(this.state.inputInfo.id ? this.state.inputInfo.id : 'input', {
                        rules: [validateRules.regex ?
                            {required: true, message: '输入不能为空！'} : {},
                            {validator: (rule, value, callback) => validatorUtils.checkInputMap(rule, value, callback, validateRules)}],
                    })(
                        <Input/>
                    )}
                </FormItem>

                <FormItem {...formTailLayout}>
                    <Button type="primary" onClick={() => this.submit()}>确定</Button>
                </FormItem>
            </Form>
        );
    }
}

export default InputStyle = Form.create()(InputStyle);