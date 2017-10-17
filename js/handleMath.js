// ***
// MATHS FUNCTIONS
// ***

var isString = function(str) {
    return (typeof str === 'string' || str instanceof String);
}

var debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var handleMathJax = function handleMathJax(string) {
    //string = string.replace(/\\\\/g, '\\\\\\\\') //Replace \\ by \\\\
    renderMathJax();
    return string;
};

var renderMathJax = debounce(function () {
                             window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]); // queue in case
                             }, 200);

var displayBigKatex = function displayBigKatex(string) {
    var result = void 0;
    try {
        result = '<span style=\'text-transform:none\'>' + window.katex.renderToString("\\displaystyle {" + string.split('$$')[1] + "}") + '</span>';
    } catch (err) {
        result = handleMathJax(string);
    } finally {
        return result;
    }
};

var displayNormalKatex = function displayNormalKatex(string) {
    var result = void 0;
    try {
        result = '<span style=\'text-transform:none\'>' + window.katex.renderToString(string.split('$$')[1]) + '</span>';
    } catch (err) {
        result = handleMathJax(string);
    } finally {
        return result;
    }
};

var isMath = function isMath(str) {
    return !!str.match(/\$(.*?)\$/g);
};

var handleMath = function handleMath(string) {
    var inline = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (string && isString(string)) {
        var content = void 0;
        if (isMath(string)) {
            // Handle Special HTML CHAR
            string = string.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&nbsp;/g, ' ');

            // Format old school maths (they only have one dollar but should have two)
            var regex = /\$\$(.*?)\$\$/g;
            if (!string.match(regex)) {
                // do not use str.replace because $$ is interpreted as a pattern (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter)
                string = string.split('$').join('$$');
            }

            if (inline) content = string.replace(regex, displayNormalKatex);else content = string.replace(regex, displayBigKatex);
        } else content = string;
        return content;
    } else return '';
};

// *** WHEN REPLACING THE CODE ABOVE, KEEP THIS *** //
var startMath = function() {
  var contents = document.querySelectorAll('h1, h2, #headline, .content')
  for(var i = 0; i < contents.length; ++i) {
    contents[i].innerHTML = handleMath(contents[i].innerHTML);
  }
};

startMath();