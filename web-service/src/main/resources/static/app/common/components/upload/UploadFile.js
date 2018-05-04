import React, {Component} from 'react';
import PropTypes from 'prop-types'
import InputFile from './InputFile'

class UploadFile extends Component {

    addFile = () => {
        this.refs.input.click()
    };

    render() {
        const {children, multiple, accept, onChange, className} = this.props;
        return (React.createElement('div', {
                onClick: this.addFile,
                className: className
            },
            React.createElement(InputFile, {
                ref: "input",
                multiple: multiple,
                accept: accept,
                onChange: onChange
            })
            , children));
    }
}

UploadFile.propTypes = {
    accept: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    onChange: PropTypes.func
};

export default UploadFile;