import React, {Component} from 'react';
import PropTypes from 'prop-types';
import E from 'wangeditor'; //修改源码4377行

class Editor extends Component {

    componentDidMount() {
        const elem = this.refs[this.props.editorRef];
        const editor = new E(elem);
        // 隐藏“网络图片”tab
        editor.customConfig.showLinkImg = false;
        //给上传的本地图片文件命名的统一名称
        editor.customConfig.uploadFileName = 'file';
        //官方文档上写的是服务器地址，也就是上传图片的方法名
        editor.customConfig.uploadImgServer = '/upload/editorImage';
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = this.props.onChange;
        editor.create();
        //调整样式
        let editorStyle = this.props.editorStyle;
        if (editorStyle) {
            for (const key in editorStyle) {
                elem.lastChild.style[key] = editorStyle[key];
                if (key === 'maxHeight' || key === 'maxWidth') {
                    elem.lastChild.firstChild.style[key] = editorStyle[key];
                }
            }
        }
    }

    render() {
        const {editorRef, className} = this.props;
        return (<div
            className={className}
            ref={editorRef}
            style={{textAlign: 'left'}}>
        </div>);
    }
}

Editor.propTypes = {
    className: PropTypes.string,
    editorRef: PropTypes.string,
    editorStyle: PropTypes.object,
    onChange: PropTypes.func
};

export default Editor;
