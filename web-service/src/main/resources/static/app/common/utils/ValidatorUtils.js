const validatorUtils = {};

validatorUtils.validateRules = {
    notEmpty: {
        regex: '/^[^\\s*$]/',
        error: '输入不能为空！'
    },
    onlyEnglish: {
        regex: '/^[A-Za-z]+$/',
        error: '输入只能为英文！'
    },
    onlyEnglishNumUnder: {
        regex: '/^[a-zA-Z0-9_]+$/',
        error: '输入只能是英文、数字、下划线组成！'
    },
    httpFtpHttps: {
        regex: '/(http|ftp|https):\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?/',
        error: 'http|ftp|https 地址错误！'
    }
};

validatorUtils.checkInput = (rule, value, callback, regex, error) => {
    if (value && regex) {
        let re = eval(regex);
        if (re.test(value)) {
            callback();
        } else {
            callback(error ? error : '输入错误！');
        }
    } else {
        callback();
    }
};

validatorUtils.checkInputMap = (rule, value, callback, rules) => {
    validatorUtils.checkInput(rule, value, callback, rules.regex, rules.error);
};

export default validatorUtils;