import React, {Component} from 'react';
import {Upload, Icon, Modal, Button} from 'antd';
import FileInput from '../../../common/components/upload/UploadFile'
import fetchUtil from '../../../common/utils/FetchUtil'

class TestUplodView extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [{
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        }],
    };

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    botton = () => {
        fetchUtil.postUpload("http://web-common.oss-cn-beijing.aliyuncs.com/test");
    };

    handleChange = ({fileList}) => this.setState({fileList})
    handleChange2 = (event) => {
        console.log('Selected file:', event.target.files[0]);
        //ossUtils.uploadFile('test', event.target.files[0]);
        fetchUtil.postUpload("/upload/file", {'file': event.target.files[0]}, {
            onProgress: (event) => {
                console.log('event222: ', event.loaded / event.total * 100);
            },
            success: (data) => {
                console.log("data222222: ", data);
            },
            fail: (error) => {
                console.error("error22222: ", error);
            }
        });
    };

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/upload/file"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>

                <Button onClick={this.botton}><Icon type="upload"/>下载</Button>
                <FileInput name="myImage"
                           placeholder="My Image"
                           className="inputClass"
                           onChange={this.handleChange2}>
                    <Button><Icon type="upload"/>Upload</Button>
                </FileInput>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}

export default TestUplodView;