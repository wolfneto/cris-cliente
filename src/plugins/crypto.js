import Vue from 'vue';
var CryptoJS = require("crypto-js");

Vue.prototype.$crypto = CryptoJS;
Vue.prototype.$crypto_key = "inthefade";


Vue.prototype.$crypto_encrypt = function(value) {
    value = CryptoJS.AES.encrypt(value, 'inthefade').toString();
    return value;
};

Vue.prototype.$crypto_decrypt = function(value, obj) {
    value = CryptoJS.AES.decrypt(value, 'inthefade');
    if (obj) {
        return JSON.parse(value.toString(CryptoJS.enc.Utf8))
    }
    return value.toString(CryptoJS.enc.Utf8);
};