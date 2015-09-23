function getValidators() {
    "use strict";

    var dateFormatsAliases = {
        'yyyy-mm-dd': 'iso',
        'iso-8601': 'iso',
        'mm/dd/yyyy': 'ansi' //ANSI INCITS 30-1997
    };

    var dateFormats = {
        // yyyy-m(m)-d(d)
        iso: function(val) {
            return /^\d\d\d\d\-\d?\d\-\d?\d$/.test(val);
        },

        // m(m)/d(d)/yyyy
        ansi: function(val) {
            return /^\d?\d\/\d?\d\/\d\d\d\d$/.test(val);
        },

        // d(d).m(m).yyyy
        'dd.mm.yyyy': function(val) {
            return /^\d?\d\.\d?\d\.\d\d\d\d$/.test(val);
        }
    };

    return {
        email : function(val, message){
            var reg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

            return reg.test(val) || message || "invalid email";
        },
        range: function(val, min, max, message) {

            message = message || "string length should be between %s and %s chars";

            if (!val || val.length < min || val.length > max) {
                return formatMessage(message, Array.prototype.splice.call(arguments, 1, 2));
            }

            return true;
        },
        capitalLetter: function(val, message){
            return /^[A-Z]/.test(val) || message || "first letter should be capital";
        },
        text: function(val, message){
            return /^[a-z]+$/ig.test(val) || message || "should be a text only";
        },
        url: function(val, message){
            return /^(http|https):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(\#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(val) || message || 'url string is invalid';
        },
        word: function(val, message) {
            return /^\w+$/.test(val) || message || 'word string is invalid';
        },
        date: function(val, format, message) {


            var isValid = false;

            if (!message && !isDateFormat(dateFormatsAliases, dateFormats, format)) {
                message = format;

                // "dispatch" runs next step only if result not existy so need to make null instead of false
                isValid = dispatch(
                    nullable(runDateFormatVal(dateFormatsAliases, dateFormats, 'dd.mm.yyyy')),
                    nullable(runDateFormatVal(dateFormatsAliases, dateFormats, 'ansi')),
                    nullable(runDateFormatVal(dateFormatsAliases, dateFormats, 'iso'))
                )(val);
            } else {
                format = aliasDateFormat(dateFormatsAliases, format);
                isValid = runDateFormat(dateFormatsAliases, dateFormats, format, val);
            }

            return isValid || message || 'date string is invalid';
        }
    };
}

// Date formats functions

function isDateFormat(aliases, formats, format) {
    format = aliasDateFormat(aliases, format);

    return existy(formats[format]);
}

function aliasDateFormat(aliases, format) {
    return existy(aliases[format]) ? aliases[format] : format;
}

function runDateFormat(aliases, formats, format, val) {
    format = format.toLowerCase();
    format = aliasDateFormat(aliases, format);
    return formats[format](val);
}

function runDateFormatVal(aliases, formats, format) {
    return function(val) {
        return runDateFormat(aliases, formats, format, val);
    }
}

// Helpers

function nullable(fn) {
    return function() {
        var r = fn.apply(fn, arguments);
        return r ? r : null;
    };
}


// Functions dispatch and dependencies

function dispatch() {
    var funs = toArray(arguments),
        size = funs.length;

    return function(target) {
        var ret = undefined,
            args = getRest(toArray(arguments));

        for (var funIndex = 0; funIndex < size; funIndex++ ) {
            var fun = funs[funIndex];

            ret = fun.apply(fun, construct(target, args));

            if (existy(ret)) return ret;
        }

        return ret;
    };
}


function toArray(arr){
    return (
        (Array.isArray(arr) && arr)
        || (!Array.isArray(arr) && arr.length && [].slice.call(arr))
        || (typeof arr === 'string' && arr.split(''))
        || (typeof arr === 'object' && [])
    )
}

function getRest(arrOrString){
    return toArray(arrOrString).slice(1);
}

function cat() {
    var args = toArray(arguments),
        head = getFirst(args);

    if (existy(head)){
        return head.concat.apply(head, getRest(args));
    }

    return [];
}

function construct(head, tail) {
    return cat([head], Array.isArray(tail) ? tail : [tail]);
}


function getFirst(arrOrString) {
    return arrOrString[0];
}

function existy(x) {
    return x != null
}
