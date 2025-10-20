import Vue from 'vue';
import StringMask from 'string-mask'

Vue.prototype.$mask = StringMask;

Vue.prototype.$put_mask = function(item, type) {
    if (item == undefined) return;
    if (type == "cpf") {
        if (item.length < 14) {
            return StringMask.apply(item, "000.000.000-00");
        } else {
            return StringMask.apply(item, "00.000.000/0000-00");
        }
    } else if (type == "telefone") {
        return StringMask.apply(item, "(00) 0000-0000");
    } else if (type == "celular") {
        return StringMask.apply(item, "(00) 0 0000-0000");
    }
};

Vue.prototype.$money_format = function(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value)
};