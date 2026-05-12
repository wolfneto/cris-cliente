import Vue from 'vue';
var Moment = require('moment');

Vue.prototype.$moment_now_db = function(value) {
    return Moment().utcOffset("-06:00").format("YYYY-MM-DD HH:mm:ss");
};

Vue.prototype.$moment_now = function(value) {
    return Moment().utcOffset("-06:00").format("DD/MM/YYYY HH:mm:ss");
};

Vue.prototype.$moment_format = function(value) {
    return Moment(value).format("DD/MM/YYYY")
};

Vue.prototype.$moment_format_time = function(value) {
    return Moment(value).utcOffset("-00:00").format("DD/MM/YYYY HH:mm:ss")
};

Vue.prototype.$moment_compare = function(value) {
    let dateNow = Moment(new Date());
    return dateNow.diff(value, 'days');
};

Vue.prototype.$moment_format_sub_2 = function(value) {
    return Moment(value).utcOffset("-02:00").format("DD/MM/YYYY HH:mm:ss");
};

Vue.prototype.$moment_format_subtract_days = function(value1, value2) {
    let dia = Moment(value1).subtract(value2, 'days');
    return Moment(dia).format("DD/MM/YYYY")
};

// Format date/time in SÃ£o Paulo time zone (UTC-3)
Vue.prototype.$moment_format_sao_paulo = function(value) {
    return Moment(value).utcOffset("-03:00").format("DD/MM/YYYY HH:mm:ss");
};