// functions expected by LLSWebView

function lineCount(fontSize) {
  var wrapper = document.getElementById('wrapper');
  var linesCount = document.getElementById('lines-count');
  if(!(wrapper && linesCount)) { return; }
  var containerHeight = wrapper.querySelector(".content").offsetHeight;
  var lineHeight = (parseInt(fontSize) || parseInt(document.getElementsByTagName("body")[0].style.fontSize) || 18)*2;
  var nbLine = containerHeight / lineHeight;
  var lines = '';
  for (var i = 0 ; i < nbLine ; i++) {
     lines += '<span class="number">' + (i+1) + '</span><br>'
  }
  linesCount.innerHTML = lines;
}

function changeFontSize(fontOffset) {
  // Change body font size
  var newBodyFontSize = 18 + parseInt(fontOffset);
  document.getElementsByTagName("body")[0].style.fontSize = newBodyFontSize + "px";

  // Refresh line numbers
  lineCount(newBodyFontSize);
}

function toggleDislexic() {
  setDislexic(!document.querySelector('#dyslexie_css'));
}

function setDislexic(dislexie) {
  if (dislexie) {
    var dyslexieCSSLink = document.createElement('link');
    dyslexieCSSLink.href = "css/dyslexie.css";
    dyslexieCSSLink.rel = "stylesheet";
    dyslexieCSSLink.type = "text/css";
    dyslexieCSSLink.id = "dyslexie_css";
    document.head.appendChild(dyslexieCSSLink);
  } else {
    var dyslexieNode = document.querySelector('#dyslexie_css');
    if (dyslexieNode) {
      dyslexieNode.remove();
    }
  }

  lineCount();
}

var highlighter;
function initRangy() {
  if(!rangy) { return; }
  rangy.init();
  highlighter = rangy.createHighlighter(null, "TextRange");
  highlighter.addClassApplier(rangy.createClassApplier("highlight", {
    elementProperties: {
     onclick: function() {
       if(!window.confirm("Voulez-vous supprimer cette sélection ?")) { return; }
       var highlight = highlighter.getHighlightForElement(this);
       highlighter.removeHighlights([highlight]);
       sendSelectionsToNative();
     }
   }
  }));
}

function highlightSelection() {
  if(!highlighter) {
    console.error("No highlighter defined");
    return;
  }
  highlighter.highlightSelection("highlight")[0];
  sendSelectionsToNative();
  // remove selection to close the contextual menu
  rangy.getSelection().removeAllRanges();
}

function sendSelectionsToNative() {
  // as selections can be merged, it's better to send everything every time
  var highlights = highlighter.highlights.map(function(h) {
    return {
      id: h.id,
      text: h.getText()
    }
  });
  highlightCallback.onHighlightChanged(JSON.stringify({
    serialized: highlighter.serialize(),
    highlights: highlights
  }));
}

/** Remove the footnotes references until footnotes are supported */
function removeFootnoteReference() {
  var refs = document.getElementsByTagName('sup');
  for(var i = 0; i < refs.length; i++) {
    var ref = refs[i]
    if(!isNaN(ref.textContent)) {
        console.log("Removed footnote " + ref)
        ref.remove()
        i-- // remove() mutates the `ref` list
    }
  }
}


window.onload = function () {
  initRangy()
  removeFootnoteReference()
  nativeCallback.onLoad()
}
