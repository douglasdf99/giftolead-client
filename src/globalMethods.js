import saveleadsConfig from "../saveleadsConfig";
import axios from "@/axios.js";

let methods = {
    url_redirect: function (local) {
        return window.location.protocol + '//' + window.location.host + '/' + local;
    },
    url_api: function (local) {
        return saveleadsConfig.url_api + '/' + local;
        //return 'http://127.0.0.1:8000/' + local;
    },
    get_img_api: function (local) {
        return saveleadsConfig.url_normal + local;
        //return 'http://127.0.0.1:8000/' + local;
    },
    isNumber: function (evt) {//Obriga o input aceitar apenas números
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
            evt.preventDefault();
        } else {
            return true;
        }
    },
    formatDateBanco: function (value) {
        if (value) {
            return moment(String(value)).format('DD-MM-YYYY')
        }
    },
    formatPrice(value) {
        let val = (value / 1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    arraySelect(response) {
        let arr = [...response];
        let obj = [];
        arr.forEach(item => {
            if (item.name)
                obj.push({id: item.id, label: item.name});
            else
                obj.push({id: item.id, label: item.nome});
        });
        return obj;
    },
    getAvatar(email) {
        let md5 = require('md5');
        email = email.trim();
        email = md5(email);
        return `https://www.gravatar.com/avatar/${email}?d=` + encodeURIComponent('https://api.saveleads.com.br/images/avatar-padrao.png');
    },
    removeAccents(str) {
        let accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
        let accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        str = str.split('');
        str.forEach((letter, index) => {
            let i = accents.indexOf(letter);
            if (i != -1) {
                str[index] = accentsOut[i];
            }
        })
        return str.join('').toUpperCase();
    },
    elapsedTime(startTime) {
        let x = new Date(startTime)
        let now = new Date()
        var timeDiff = now - x
        timeDiff /= 1000

        var seconds = Math.round(timeDiff)
        timeDiff = Math.floor(timeDiff / 60)

        var minutes = Math.round(timeDiff % 60)
        timeDiff = Math.floor(timeDiff / 60)

        var hours = Math.round(timeDiff % 24)
        timeDiff = Math.floor(timeDiff / 24)

        var days = Math.round(timeDiff % 365)
        timeDiff = Math.floor(timeDiff / 365)

        var years = timeDiff

        if (years > 0) {
            return years + (years > 1 ? ' Anos ' : ' Ano ') + 'atrás'
        } else if (days > 0) {
            return days + (days > 1 ? ' Dias ' : ' Dia ') + 'atrás'
        } else if (hours > 0) {
            return hours + (hours > 1 ? ' Hrs ' : ' Hora ') + 'atrás'
        } else if (minutes > 0) {
            return minutes + (minutes > 1 ? ' Mins ' : ' Min ') + 'atrás'
        } else if (seconds > 0) {
            return seconds + (seconds > 1 ? ' seg atrás' : 'Agora')
        }

        return 'Agora'
    },
    verficaExtesoes() {
        var subdomain = window.location.host.split('.')[1] ? window.location.host.split('.')[0] : false;
        let arr = [];
        if(!subdomain)
            subdomain = 'app';
        return new Promise((resolve, reject) => {
            axios.get(`/extensoes/company`, {params: {subdomain: subdomain}})
                .then((response) => {
                    let resultado = response.data.data;
                    resultado.extensoes.forEach(item => {
                        if (item.extensao_type == 'App\\Models\\Extensoes\\Slack') {
                            if (item.ativo == 1)
                                arr.push('slack');
                        } else if (item.extensao_type == 'App\\Models\\Extensoes\\TotalVoice') {
                            if (item.ativo == 1)
                                arr.push('totalvoice');
                        }
                    })
                    resolve(arr);
                })
                .catch((error) => {

                })
        });
    }
};

export default methods