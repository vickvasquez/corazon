// StyleFix 1.0 & PrefixFree 1.0.4 / by Lea Verou / MIT license
(function() {
    if (window.addEventListener) {
        var h = window.StyleFix = {
            link: function(a) {
                try {
                    if (!/\bstylesheet\b/i.test(a.rel) || !a.sheet.cssRules) return
                } catch (b) {
                    return
                }
                var c = a.getAttribute("href") || a.getAttribute("data-href"),
                    f = c.replace(/[^\/]+$/, ""),
                    e = a.parentNode,
                    d = new XMLHttpRequest;
                d.open("GET", c);
                d.onreadystatechange = function() {
                    if (d.readyState === 4) {
                        var b = d.responseText;
                        if (b && a.parentNode) {
                            b = h.fix(b, true, a);
                            f && (b = b.replace(/url\((?:'|")?(.+?)(?:'|")?\)/gi, function(a, b) {
                                return !/^([a-z]{3,10}:|\/)/i.test(b) ? 'url("' + f + b + '")' : a
                            }), b = b.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)" + f, "gi"), "$1"));
                            var c = document.createElement("style");
                            c.textContent = b;
                            c.media = a.media;
                            c.disabled = a.disabled;
                            e.insertBefore(c, a);
                            e.removeChild(a)
                        }
                    }
                };
                d.send(null);
                a.setAttribute("data-inprogress", "")
            },
            styleElement: function(a) {
                var b = a.disabled;
                a.textContent = h.fix(a.textContent, true, a);
                a.disabled = b
            },
            styleAttribute: function(a) {
                var b = a.getAttribute("style"),
                    b = h.fix(b, false, a);
                a.setAttribute("style", b)
            },
            register: function(a) {
                this.fixers = this.fixers || [];
                this.fixers.push(a)
            },
            fix: function(a, b) {
                for (var c = 0; c < this.fixers.length; c++) a = this.fixers[c](a, b) || a;
                return a
            },
            camelCase: function(a) {
                return a.replace(/-([a-z])/g, function(a, c) {
                    return c.toUpperCase()
                }).replace("-", "")
            },
            deCamelCase: function(a) {
                return a.replace(/[A-Z]/g, function(a) {
                    return "-" + a.toLowerCase()
                })
            }
        };
        (function() {
            function a(a, c) {
                return [].slice.call((c || document).querySelectorAll(a))
            }
            setTimeout(function() {
                a('link[rel~="stylesheet"]').forEach(StyleFix.link)
            }, 10);
            document.addEventListener("DOMContentLoaded",

                function() {
                    a('link[rel~="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);
                    a("style").forEach(StyleFix.styleElement);
                    a("[style]").forEach(StyleFix.styleAttribute)
                }, false)
        })()
    }
})();
(function(h) {
    if (window.StyleFix && window.getComputedStyle) {
        var a = window.PrefixFree = {
            prefixCSS: function(b, c) {
                function f(c, d, e, f) {
                    c = a[c];
                    c.length && (c = RegExp(d + "(" + c.join("|") + ")" + e, "gi"), b = b.replace(c, f))
                }
                var e = a.prefix;
                f("functions", "(\\s|:)", "\\s*\\(", "$1" + e + "$2(");
                f("keywords", "(\\s|:)", "(\\s|;|\\}||$)", "$1" + e + "$2$3");
                f("properties", "(^|\\{|\\s|;)", "\\s*:", "$1" + e + "$2:");
                if (a.properties.length) {
                    var d = RegExp("\\b(" + a.properties.join("|") + ")(?!:)", "gi");
                    f("valueProperties", "\\b", ":(.+?);", function(a) {
                        return a.replace(d,
                            e + "$1")
                    })
                }
                c && (f("selectors", "", "\\b", a.prefixSelector), f("atrules", "@", "\\b", "@" + e + "$1"));
                return b = b.replace(RegExp("-" + e, "g"), "-")
            },
            prefixSelector: function(b) {
                return b.replace(/^:{1,2}/, function(b) {
                    return b + a.prefix
                })
            },
            prefixProperty: function(b, c) {
                var f = a.prefix + b;
                return c ? StyleFix.camelCase(f) : f
            }
        };
        (function() {
            var b = {},
                c = "",
                f = 0,
                e = [],
                d = getComputedStyle(document.documentElement, null),
                i = document.createElement("div").style,
                j = function(a) {
                    e.indexOf(a) === -1 && e.push(a);
                    if (a.indexOf("-") > -1) {
                        var d = a.split("-");
                        if (a.charAt(0) === "-") {
                            var a = d[1],
                                g = ++b[a] || 1;
                            b[a] = g;
                            for (f < g && (c = a, f = g); d.length > 3;) d.pop(), g = d.join("-"), StyleFix.camelCase(g) in i && (a = e, a.indexOf(g) === -1 && a.push(g))
                        }
                    }
                };
            if (d.length > 0)
                for (var g = 0; g < d.length; g++) j(d[g]);
            else
                for (var h in d) j(StyleFix.deCamelCase(h));
            a.prefix = "-" + c + "-";
            a.Prefix = StyleFix.camelCase(a.prefix);
            e.sort();
            a.properties = [];
            for (g = 0; g < e.length; g++) {
                h = e[g];
                if (h.charAt(0) !== "-") break;
                h.indexOf(a.prefix) === 0 && (d = h.slice(a.prefix.length), StyleFix.camelCase(d) in i || a.properties.push(d))
            }
            a.Prefix == "Ms" && !("transform" in i) && !("MsTransform" in i) && "msTransform" in i && a.properties.push("transform", "transform-origin");
            a.properties.sort()
        })();
        (function() {
            function b(a, b) {
                e[b] = "";
                e[b] = a;
                return !!e[b]
            }
            var c = {
                    "linear-gradient": {
                        property: "backgroundImage",
                        params: "red, teal"
                    },
                    calc: {
                        property: "width",
                        params: "1px + 5%"
                    },
                    element: {
                        property: "backgroundImage",
                        params: "#foo"
                    }
                },
                f = {
                    initial: "color",
                    "zoom-in": "cursor",
                    "zoom-out": "cursor",
                    box: "display",
                    flexbox: "display",
                    "inline-flexbox": "display"
                };
            c["repeating-linear-gradient"] = c["repeating-radial-gradient"] = c["radial-gradient"] = c["linear-gradient"];
            a.functions = [];
            a.keywords = [];
            var e = document.createElement("div").style,
                d;
            for (d in c) {
                var i = c[d],
                    h = i.property,
                    i = d + "(" + i.params + ")";
                !b(i, h) && b(a.prefix + i, h) && a.functions.push(d)
            }
            for (var g in f) h = f[g], !b(g, h) && b(a.prefix + g, h) && a.keywords.push(g)
        })();
        (function() {
            function b(a) {
                e.textContent = a + "{}";
                return !!e.sheet.cssRules.length
            }
            var c = {
                    ":read-only": null,
                    ":read-write": null,
                    ":any-link": null,
                    "::selection": null
                },
                f = {
                    keyframes: "name",
                    viewport: null,
                    document: 'regexp(".")'
                };
            a.selectors = [];
            a.atrules = [];
            var e = h.appendChild(document.createElement("style")),
                d;
            for (d in c) {
                var i = d + (c[d] ? "(" + c[d] + ")" : "");
                !b(i) && b(a.prefixSelector(i)) && a.selectors.push(d)
            }
            for (var j in f) i = j + " " + (f[j] || ""), !b("@" + i) && b("@" + a.prefix + i) && a.atrules.push(j);
            h.removeChild(e)
        })();
        a.valueProperties = ["transition", "transition-property"];
        h.className += " " + a.prefix;
        StyleFix.register(a.prefixCSS)
    }
})(document.documentElement);