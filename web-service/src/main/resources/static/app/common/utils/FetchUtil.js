import fetch from 'isomorphic-fetch';
import {message} from 'antd';

const fetchUtil = {};
fetchUtil.postJson = (url, params, success, fail) => {
    const token = sessionStorage.getItem('token');
    let headers = {};
    if (token !== undefined) {
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + token
        }
    } else {
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }

    fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify(params)
    })
        .then((response) => checkStatus(response)) //把response转为json
        .then((data) => { // 上面的转好的json
            if (data.retCode === 0) {
                returnSuccess(success, data);
            } else {
                returnError(fail, data);
            }
        })
        .catch((error) => {
            if (error instanceof Exception401) {
                returnError(fail, error);
            } else if (error instanceof CommonException) {
                returnError(fail, error);
            } else {
                returnError(fail, {retCode: 404, data: "网络请求异常！"});
            }
        });
};

fetchUtil.post = (url, params, success, fail) => {
    let paramsBody;
    if (params instanceof FormData) {
        paramsBody = params;
    } else {
        paramsBody = new FormData();
        for (const key in params) {
            paramsBody.append(key, params[key]);
        }
    }

    const token = sessionStorage.getItem('token');
    let headers = {};
    if (token !== undefined) {
        headers = {
            "Authorization": "Bearer " + token
        }
    }

    fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: headers,
        body: paramsBody
    })
        .then((response) => checkStatus(response)) //把response转为json
        .then((data) => { // 上面的转好的json
            if (data.retCode === 0) {
                returnSuccess(success, data);
            } else {
                returnError(fail, data);
            }
        })
        .catch((error) => {
            if (error instanceof Exception401) {
                returnError(fail, error);
            } else if (error instanceof CommonException) {
                returnError(fail, error);
            } else {
                returnError(fail, {retCode: 404, data: "网络请求异常！"});
            }
        });
};

fetchUtil.get = (url, success, fail) => {
    const token = sessionStorage.getItem('token');
    let headers = {};
    if (token !== undefined) {
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + token,
        }
    } else {
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }

    fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: headers
    })
        .then((response) => checkStatus(response)) //把response转为json
        .then((data) => { // 上面的转好的json
            if (data.retCode === 0) {
                returnSuccess(success, data);
            } else {
                returnError(fail, data);
            }
        })
        .catch((error) => {
            if (error instanceof Exception401) {
                returnError(fail, error);
            } else if (error instanceof CommonException) {
                returnError(fail, error);
            } else {
                returnError(fail, {retCode: 404, data: "网络请求异常！"});
            }
        });
};

fetchUtil.postUpload = (url, params, callback) => {
    let paramsBody;
    if (params instanceof FormData) {
        paramsBody = params;
    } else {
        paramsBody = new FormData();
        for (const key in params) {
            paramsBody.append(key, params[key]);
        }
    }
    futchUpload(url, {
        method: 'post',
        body: paramsBody
    }, callback.onProgress)
        .then((data) => {
            if (data.retCode === 0) {
                returnSuccess(callback.success, data);
            } else {
                returnError(callback.fail, data);
            }
        })
        .catch((error) => {
            returnError(callback.fail, error);
        });
};

function futchUpload(url, opts = {}, onProgress) {
    return new Promise((res, rej) => {
        let xhr = new XMLHttpRequest();
        xhr.open(opts.method || 'get', url);
        for (let k in opts.headers || {})
            xhr.setRequestHeader(k, opts.headers[k]);
        xhr.onload = e => {
            if (e.target.status < 200 || e.target.status >= 300) {
                res(new CommonException(e.target.status, e.target.responseText));
            } else {
                res(JSON.parse(e.target.responseText))
            }
        };
        xhr.onerror = rej;
        xhr.withCredentials = true;
        if (xhr.upload && onProgress)
            xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
        xhr.send(opts.body);
    });
}

function returnSuccess(success, retData) {
    console.log("data: ", retData);
    if (success) {
        success(retData);
    }
}

function returnError(fail, retData) {
    console.error("error: ", retData);
    if (fail) {
        fail(retData);
    } else {
        message.error(retData.data);
    }
}

function checkStatus(response) {
    //如果是重定向登录页面，直接由游览器重定向地址
    if (response.redirected && response.url.indexOf('/user/login') > -1) {
        window.location.href = response.url;
    } else if (response.status >= 200 && response.status < 300) {
        return response.json();
    } else if (response.status === 401) {
        throw new Exception401(response.status, "无权限操作！");
    } else {
        return response.json().then((data) => {
            return new CommonException(response.status, data);
        });
    }
}

//401异常单独定义
function Exception401(retCode, data) {
    this.data = data;
    this.retCode = retCode;
}

function CommonException(retCode, data) {
    let ret;
    try {
        ret = JSON.parse(data);
    } catch (err) {
        ret = data;
    }
    this.data = ret.data ? ret.data : data;
    this.retCode = ret.retCode ? ret.retCode : retCode;
}

export default fetchUtil;