import React, {Component} from 'react'
import {Form} from 'antd';
import PropTypes from 'prop-types'
import Editor from '../../../../common/components/editor/Editor'



const FormItem = Form.Item;

class FormEditor extends Component {

    render() {
        const {formItemLayout, getFieldDecorator, title, id, editorStyle, onChange} = this.props;
        return (
            <FormItem
                {...formItemLayout}
                label={title ? title : '标题'}
            >
                {getFieldDecorator(id ? id : 'test')(
                    <Editor
                        editorStyle={editorStyle ? editorStyle : {height: '100%', maxHeight: '300px'}}
                        editorRef={id ? id : 'test'}
                        onChange={onChange}/>
                )}
            </FormItem>
        )
    }
}

FormEditor.propTypes = {
    editorStyle: PropTypes.object,
    title: PropTypes.string,
    id: PropTypes.string,
    formItemLayout: PropTypes.object,
    onChange: PropTypes.func,
    getFieldDecorator: PropTypes.func
};


export default FormEditor