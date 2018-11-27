---
layout: null
sitemap: false
---

var Indexes = [
  {% assign folders = site.collections | sort: 'order' %}{% for folder in folders %}{% assign docs = folder.docs | sort: 'chapter' %}{% for doc in docs | sort: 'chapter' %}{% if doc.title %}{% unless doc.excluded_in_search %}{% if added %},{% endif %}{% assign added = false %}{
  "title": "{{ doc.title }}",
  "parent": "{{ folder.title }}",
  "category": "{{ folder.label }}",
  "description": "{{doc.description }}",
  "type": "{{doc.type}}",
  "url": "{{ doc.url }}",
  "content": {{ doc.content | strip_html | replace_regex: "[\s/\n]+"," " | strip | jsonify }}
  }{% assign added = true %}{% endunless %}{% endif %}{% endfor %}{% endfor %}
]

var $searchBox = null
var $searchIpt = null
var $searchSug = null

var searchFocus = function() {
  $searchIpt.classList.add('focused')
  if ($searchIpt.value) searchFind()
}

var searchBlur = function() {
  $searchIpt.classList.remove('focused')
  setTimeout(hideSug, 200)
}

var hideSug = function() {
  if (!$searchSug) return
  $searchSug.innerHTML = ''
  $searchBox.removeChild($searchSug)
  $searchSug = null
}

var showSug = function(matches) {
  if (!matches.length) return hideSug()
  if (!$searchSug) {
    $searchSug = document.createElement('ul')
    $searchSug.className = 'suggestions align-right'
  }
  var html = matches.map(function(arr) {
    return [
      '<li class="suggestion"><a href="'+ arr[0] +'">',
        '<span class="page-title">'+ arr[2] +'</span>',
        '<span class="header">&gt; '+ arr[1] +'</span>',
      '</a>'
    ].join('')
  })
  $searchSug.innerHTML = html.join('')
  $searchBox.appendChild($searchSug)
}

var searchFind = function() {
  var val = $searchIpt.value
  if (!val) return hideSug()
  var reg = new RegExp(val)
  var matches = []
  Indexes.forEach(function(idx) {
    var matched = false
    for (var k in idx) {
      var v = idx[k]
      if (reg.test(v)) {
        matched = true
        break
      }
    }
    if (matched) matches.push([idx.url, idx.title, idx.parent])
  })
  showSug(matches)
}

var sbarToggle = function() {
  var bodyClass = document.body.classList
  bodyClass[bodyClass.contains('sidebar-open') ? 'remove' : 'add']('sidebar-open')
}

var init = function() {
  // Search
  $searchBox = document.querySelector('.search-box')
  $searchIpt = $searchBox.querySelector('.search-ipt')
  $searchIpt.addEventListener('focus', searchFocus)
  $searchIpt.addEventListener('blur', searchBlur)
  $searchIpt.addEventListener('input', searchFind)
  // Sidebar
  document.querySelector('.sidebar-button').addEventListener('click', sbarToggle)
  document.querySelector('.sidebar-mask').addEventListener('click', sbarToggle)
}

document.addEventListener('DOMContentLoaded', init)
