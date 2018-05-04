import fetchUtil from './FetchUtil'

const bucketName = 'web-common';
const region = 'http://oss-cn-beijing.aliyuncs.com';
const ossUtils = {};
let ossClient;
/*直接上传到阿里云OSS 需要html中添加
<script src="http://gosspublic.alicdn.com/aliyun-oss-sdk.min.js"></script>
*/
ossUtils.uploadFile = (key, file) => {
    initClient((ossClient) => {
        console.log("ossClient: ", ossClient);
        ossClient.multipartUpload(key, file, {
            progress: progress
        }).then(function (res) {
            console.log('upload success: %j', res);
        });
    });
};


const initClient = (callback) => {
    if (!ossClient) {
        fetchUtil.post(`/oss/queryCredentials`, null, (data) => {
            console.log("data: ", data);
            const credentials = data.data;
            ossClient = new OSS.Wrapper({
                accessKeyId: credentials.accessKeyId,
                accessKeySecret: credentials.accessKeySecret,
                stsToken: credentials.securityToken,
                endpoint: region,
                bucket: bucketName
            });
            if (callback) {
                callback(ossClient);
            }
        });
    } else {
        if (callback) {
            callback(ossClient);
        }
    }
};

let progress = function (p) {
    return function (done) {
        console.log("progress", Math.floor(p * 100) + '%');
        done();
    }
};

export default ossUtils;