(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{"0mN4":function(e,t,a){"use strict";a("OGtf")("fixed",(function(e){return function(){return e(this,"tt","","")}}))},"6Gk8":function(e,t,a){"use strict";a("f3/d"),a("0mN4");var i=a("FGIg"),r=(a("q1tI"),a("9eSz")),n=a.n(r),s=a("qKvR"),o=a("p3AD"),d={name:"1t5j630",styles:"display:flex;justify-content:space-around;margin:0.25rem;width:100%;"},l={name:"gokeqi",styles:"box-shadow:none;"},c={name:"gokeqi",styles:"box-shadow:none;"},f={name:"j7qwjs",styles:"display:flex;flex-direction:column;"},A={name:"1m3g4j3",styles:"text-align:center;margin-bottom:0.25rem;"},u={name:"1uk1gs8",styles:"margin:0;"};t.a=function(){var e=i.data,t=e.site.siteMetadata.author;return Object(s.b)("div",{css:Object(s.a)("display:flex;align-items:flex-end;margin-bottom:",Object(o.a)(2.5),";")},Object(s.b)("div",{css:Object(s.a)("display:flex;flex-direction:column;align-items:center;justify-content:center;margin-right:",Object(o.a)(.5),";")},Object(s.b)(n.a,{fixed:e.avatar.childImageSharp.fixed,alt:t.name,style:{marginBottom:0,width:"50px",height:"50px",borderRadius:"100%"},imgStyle:{borderRadius:"50%"}}),Object(s.b)("div",{css:d},Object(s.b)("a",{href:"https://github.com/nicholaspung",target:"_blank",rel:"noopener noreferrer",css:l},Object(s.b)(n.a,{fixed:e.github.childImageSharp.fixed,alt:'Icons made by <a href="https://www.flaticon.com/authors/dave-gandy" title="Dave Gandy">Dave Gandy</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>'})),Object(s.b)("a",{href:"https://linkedin.com//in/nicholas-pung",target:"_blank",rel:"noopener noreferrer",css:c},Object(s.b)(n.a,{fixed:e.linkedin.childImageSharp.fixed,alt:'Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>',style:{filter:"grayscale(100%)"}})))),Object(s.b)("div",{css:f},Object(s.b)("p",{css:A},"Hi"," ",Object(s.b)("span",{role:"img","aria-label":"wave-hands"},"👋")," ","I'm Nicholas."),Object(s.b)("p",{css:u},"I'm a full-stack developer, who likes to build projects to use day-to-day. I'm extremely interested in integrating health with software, so my primary focus is on learning how to use hardware and software to drive human behavior in a positive direction.")))}},"9eSz":function(e,t,a){"use strict";a("rGqo"),a("yt8O"),a("Btvt"),a("XfO3"),a("EK0E"),a("INYr"),a("0mN4");var i=a("TqRt");t.__esModule=!0,t.default=void 0;var r,n=i(a("PJYZ")),s=i(a("VbXa")),o=i(a("8OQS")),d=i(a("pVnL")),l=i(a("q1tI")),c=i(a("17x9")),f=function(e){var t=(0,d.default)({},e),a=t.resolutions,i=t.sizes,r=t.critical;return a&&(t.fixed=a,delete t.resolutions),i&&(t.fluid=i,delete t.sizes),r&&(t.loading="eager"),t.fluid&&(t.fluid=E([].concat(t.fluid))),t.fixed&&(t.fixed=E([].concat(t.fixed))),t},A=function(e){var t=e.media;return!!t&&(m&&!!window.matchMedia(t).matches)},u=function(e){var t=e.fluid,a=e.fixed;return g(t||a).src},g=function(e){if(m&&function(e){return!!e&&Array.isArray(e)&&e.some((function(e){return void 0!==e.media}))}(e)){var t=e.findIndex(A);if(-1!==t)return e[t];var a=e.findIndex((function(e){return void 0===e.media}));if(-1!==a)return e[a]}return e[0]},p=Object.create({}),h=function(e){var t=f(e),a=u(t);return p[a]||!1},b="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype,m="undefined"!=typeof window,y=m&&window.IntersectionObserver,S=new WeakMap;function w(e){return e.map((function(e){var t=e.src,a=e.srcSet,i=e.srcSetWebp,r=e.media,n=e.sizes;return l.default.createElement(l.default.Fragment,{key:t},i&&l.default.createElement("source",{type:"image/webp",media:r,srcSet:i,sizes:n}),l.default.createElement("source",{media:r,srcSet:a,sizes:n}))}))}function E(e){var t=[],a=[];return e.forEach((function(e){return(e.media?t:a).push(e)})),[].concat(t,a)}function v(e){return e.map((function(e){var t=e.src,a=e.media,i=e.tracedSVG;return l.default.createElement("source",{key:t,media:a,srcSet:i})}))}function x(e){return e.map((function(e){var t=e.src,a=e.media,i=e.base64;return l.default.createElement("source",{key:t,media:a,srcSet:i})}))}function I(e,t){var a=e.srcSet,i=e.srcSetWebp,r=e.media,n=e.sizes;return"<source "+(t?"type='image/webp' ":"")+(r?'media="'+r+'" ':"")+'srcset="'+(t?i:a)+'" '+(n?'sizes="'+n+'" ':"")+"/>"}var R=function(e,t){var a=(void 0===r&&"undefined"!=typeof window&&window.IntersectionObserver&&(r=new window.IntersectionObserver((function(e){e.forEach((function(e){if(S.has(e.target)){var t=S.get(e.target);(e.isIntersecting||e.intersectionRatio>0)&&(r.unobserve(e.target),S.delete(e.target),t())}}))}),{rootMargin:"200px"})),r);return a&&(a.observe(e),S.set(e,t)),function(){a.unobserve(e),S.delete(e)}},j=function(e){var t=e.src?'src="'+e.src+'" ':'src="" ',a=e.sizes?'sizes="'+e.sizes+'" ':"",i=e.srcSet?'srcset="'+e.srcSet+'" ':"",r=e.title?'title="'+e.title+'" ':"",n=e.alt?'alt="'+e.alt+'" ':'alt="" ',s=e.width?'width="'+e.width+'" ':"",o=e.height?'height="'+e.height+'" ':"",d=e.crossOrigin?'crossorigin="'+e.crossOrigin+'" ':"",l=e.loading?'loading="'+e.loading+'" ':"",c=e.draggable?'draggable="'+e.draggable+'" ':"";return"<picture>"+e.imageVariants.map((function(e){return(e.srcSetWebp?I(e,!0):"")+I(e)})).join("")+"<img "+l+s+o+a+i+t+n+r+d+c+'style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture>'},B=l.default.forwardRef((function(e,t){var a=e.src,i=e.imageVariants,r=e.generateSources,n=e.spreadProps,s=e.ariaHidden,o=l.default.createElement(O,(0,d.default)({ref:t,src:a},n,{ariaHidden:s}));return i.length>1?l.default.createElement("picture",null,r(i),o):o})),O=l.default.forwardRef((function(e,t){var a=e.sizes,i=e.srcSet,r=e.src,n=e.style,s=e.onLoad,c=e.onError,f=e.loading,A=e.draggable,u=e.ariaHidden,g=(0,o.default)(e,["sizes","srcSet","src","style","onLoad","onError","loading","draggable","ariaHidden"]);return l.default.createElement("img",(0,d.default)({"aria-hidden":u,sizes:a,srcSet:i,src:r},g,{onLoad:s,onError:c,ref:t,loading:f,draggable:A,style:(0,d.default)({position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"},n)}))}));O.propTypes={style:c.default.object,onError:c.default.func,onLoad:c.default.func};var Q=function(e){function t(t){var a;(a=e.call(this,t)||this).seenBefore=m&&h(t),a.isCritical="eager"===t.loading||t.critical,a.addNoScript=!(a.isCritical&&!t.fadeIn),a.useIOSupport=!b&&y&&!a.isCritical&&!a.seenBefore;var i=a.isCritical||m&&(b||!a.useIOSupport);return a.state={isVisible:i,imgLoaded:!1,imgCached:!1,fadeIn:!a.seenBefore&&t.fadeIn},a.imageRef=l.default.createRef(),a.placeholderRef=t.placeholderRef||l.default.createRef(),a.handleImageLoaded=a.handleImageLoaded.bind((0,n.default)(a)),a.handleRef=a.handleRef.bind((0,n.default)(a)),a}(0,s.default)(t,e);var a=t.prototype;return a.componentDidMount=function(){if(this.state.isVisible&&"function"==typeof this.props.onStartLoad&&this.props.onStartLoad({wasCached:h(this.props)}),this.isCritical){var e=this.imageRef.current;e&&e.complete&&this.handleImageLoaded()}},a.componentWillUnmount=function(){this.cleanUpListeners&&this.cleanUpListeners()},a.handleRef=function(e){var t=this;this.useIOSupport&&e&&(this.cleanUpListeners=R(e,(function(){var e=h(t.props);t.state.isVisible||"function"!=typeof t.props.onStartLoad||t.props.onStartLoad({wasCached:e}),t.setState({isVisible:!0},(function(){t.setState({imgLoaded:e,imgCached:!(!t.imageRef.current||!t.imageRef.current.currentSrc)})}))})))},a.handleImageLoaded=function(){var e,t,a;e=this.props,t=f(e),a=u(t),p[a]=!0,this.setState({imgLoaded:!0}),this.props.onLoad&&this.props.onLoad()},a.render=function(){var e=f(this.props),t=e.title,a=e.alt,i=e.className,r=e.style,n=void 0===r?{}:r,s=e.imgStyle,o=void 0===s?{}:s,c=e.placeholderStyle,A=void 0===c?{}:c,u=e.placeholderClassName,p=e.fluid,h=e.fixed,b=e.backgroundColor,m=e.durationFadeIn,y=e.Tag,S=e.itemProp,E=e.loading,I=e.draggable,R=!1===this.state.fadeIn||this.state.imgLoaded,Q=!0===this.state.fadeIn&&!this.state.imgCached,k=(0,d.default)({opacity:R?1:0,transition:Q?"opacity "+m+"ms":"none"},o),C="boolean"==typeof b?"lightgray":b,N={transitionDelay:m+"ms"},G=(0,d.default)({opacity:this.state.imgLoaded?0:1},Q&&N,{},o,{},A),L={title:t,alt:this.state.isVisible?"":a,style:G,className:u,itemProp:S};if(p){var U=p,z=g(p);return l.default.createElement(y,{className:(i||"")+" gatsby-image-wrapper",style:(0,d.default)({position:"relative",overflow:"hidden"},n),ref:this.handleRef,key:"fluid-"+JSON.stringify(z.srcSet)},l.default.createElement(y,{"aria-hidden":!0,style:{width:"100%",paddingBottom:100/z.aspectRatio+"%"}}),C&&l.default.createElement(y,{"aria-hidden":!0,title:t,style:(0,d.default)({backgroundColor:C,position:"absolute",top:0,bottom:0,opacity:this.state.imgLoaded?0:1,right:0,left:0},Q&&N)}),z.base64&&l.default.createElement(B,{ariaHidden:!0,ref:this.placeholderRef,src:z.base64,spreadProps:L,imageVariants:U,generateSources:x}),z.tracedSVG&&l.default.createElement(B,{ariaHidden:!0,ref:this.placeholderRef,src:z.tracedSVG,spreadProps:L,imageVariants:U,generateSources:v}),this.state.isVisible&&l.default.createElement("picture",null,w(U),l.default.createElement(O,{alt:a,title:t,sizes:z.sizes,src:z.src,crossOrigin:this.props.crossOrigin,srcSet:z.srcSet,style:k,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:S,loading:E,draggable:I})),this.addNoScript&&l.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:j((0,d.default)({alt:a,title:t,loading:E},z,{imageVariants:U}))}}))}if(h){var V=h,M=g(h),P=(0,d.default)({position:"relative",overflow:"hidden",display:"inline-block",width:M.width,height:M.height},n);return"inherit"===n.display&&delete P.display,l.default.createElement(y,{className:(i||"")+" gatsby-image-wrapper",style:P,ref:this.handleRef,key:"fixed-"+JSON.stringify(M.srcSet)},C&&l.default.createElement(y,{"aria-hidden":!0,title:t,style:(0,d.default)({backgroundColor:C,width:M.width,opacity:this.state.imgLoaded?0:1,height:M.height},Q&&N)}),M.base64&&l.default.createElement(B,{ariaHidden:!0,ref:this.placeholderRef,src:M.base64,spreadProps:L,imageVariants:V,generateSources:x}),M.tracedSVG&&l.default.createElement(B,{ariaHidden:!0,ref:this.placeholderRef,src:M.tracedSVG,spreadProps:L,imageVariants:V,generateSources:v}),this.state.isVisible&&l.default.createElement("picture",null,w(V),l.default.createElement(O,{alt:a,title:t,width:M.width,height:M.height,sizes:M.sizes,src:M.src,crossOrigin:this.props.crossOrigin,srcSet:M.srcSet,style:k,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:S,loading:E,draggable:I})),this.addNoScript&&l.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:j((0,d.default)({alt:a,title:t,loading:E},M,{imageVariants:V}))}}))}return null},t}(l.default.Component);Q.defaultProps={fadeIn:!0,durationFadeIn:500,alt:"",Tag:"div",loading:"lazy"};var k=c.default.shape({width:c.default.number.isRequired,height:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string,media:c.default.string}),C=c.default.shape({aspectRatio:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,sizes:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string,media:c.default.string});Q.propTypes={resolutions:k,sizes:C,fixed:c.default.oneOfType([k,c.default.arrayOf(k)]),fluid:c.default.oneOfType([C,c.default.arrayOf(C)]),fadeIn:c.default.bool,durationFadeIn:c.default.number,title:c.default.string,alt:c.default.string,className:c.default.oneOfType([c.default.string,c.default.object]),critical:c.default.bool,crossOrigin:c.default.oneOfType([c.default.string,c.default.bool]),style:c.default.object,imgStyle:c.default.object,placeholderStyle:c.default.object,placeholderClassName:c.default.string,backgroundColor:c.default.oneOfType([c.default.string,c.default.bool]),onLoad:c.default.func,onError:c.default.func,onStartLoad:c.default.func,Tag:c.default.string,itemProp:c.default.string,loading:c.default.oneOf(["auto","lazy","eager"]),draggable:c.default.bool};var N=Q;t.default=N},FGIg:function(e){e.exports=JSON.parse('{"data":{"avatar":{"childImageSharp":{"fixed":{"base64":"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAUABQDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAAF/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAABG4yjBlQVFAqj/8QAHRAAAgEEAwAAAAAAAAAAAAAAAgMEAAERExIjQv/aAAgBAQABBQKMteC0lTA4GrNx9yD7FsJdykHsr//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8BH//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8BH//EAB0QAAIBBAMAAAAAAAAAAAAAAAABEQMhIlECEBL/2gAIAQEABj8Cmpd6I5U4IV0KGLJSbMT0rPr/xAAcEAEAAgIDAQAAAAAAAAAAAAABABEhMUFRgcH/2gAIAQEAAT8hqiX1wg8cQPkJG6GNUKSnEBcJW9XNOxhS1LQvGFSGjHEW23c//9oADAMBAAIAAwAAABCzzzz/xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAEDAQE/EB//xAAUEQEAAAAAAAAAAAAAAAAAAAAg/9oACAECAQE/EB//xAAdEAEBAAIDAAMAAAAAAAAAAAABEQAhMUFhUbHB/9oACAEBAAE/EAtB3FB+uAJ7KAZ48MZzysRT3FXhB0SEycUJerj6uXSIgQWus0e2nIbJZ8+4kfkI4SavmIiKmqu1z//Z","width":100,"height":100,"src":"/portfolio2/static/4f1e6f5e80709d63cbf73e3d00b0ba4f/b315d/profile-pic.jpg","srcSet":"/portfolio2/static/4f1e6f5e80709d63cbf73e3d00b0ba4f/b315d/profile-pic.jpg 1x,\\n/portfolio2/static/4f1e6f5e80709d63cbf73e3d00b0ba4f/dcd9a/profile-pic.jpg 1.5x,\\n/portfolio2/static/4f1e6f5e80709d63cbf73e3d00b0ba4f/8295c/profile-pic.jpg 2x"}}},"github":{"childImageSharp":{"fixed":{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABtUlEQVQ4y5WUTShEYRSGr7l+UtgqGws1lJSUsqGGrUIRpShlMwsRC4osbG2sKKbUTLPBxkIUaqIUSkhSbOxkQSmDGcZ79Z7pzDf3Mk49fXfO3z33nPONZWWKrZ6rQBCEwDbYAatgBNR4xGSIj2cliIA4SHnwAdZAtRGblawLPDPoCyQ8+KTPK+g3k0rJvS6VJFVwis9JF79h8/PrwDuNR2AUXPyS6BqMgT2la9KfvK8MU9QVgW4QAH7SAvpACX2CKu5YkgWokArnqc+zvEX6NcMYGWCHo1wyEg6qftgM1tiqV51q6s4ZdZRXquwz6/8SM+PjapLRv5ZVST7PRbVmj5YxwQ2vRXUReWlIrZjTtp+sUvJ5DgMxB3Oo4u/0ykiVrXQs8Ph0mzZHGo3YA0c5zh8vPB9AfQ4V1oIbxrzxnHMMFVTc8y7f0hjhlSpWSQrBAG2SJKHWzi+O01SG+Lf1xN8x1VPp2ZZxHc0LkZZdGtoZ3GxUJ/2cUMssyU5UX9NvLgOndFhgb9uUjyScNG7WJSg3182nerSs1mDFZeKzyh4GpV6XQS9zA1gHQ8pZ7D1gky3Jiv0G8Jmqjvo/zIUAAAAASUVORK5CYII=","width":25,"height":25,"src":"/portfolio2/static/a93fc7025f7c8f23f9c9d4606fb8098f/b5811/github-logo.png","srcSet":"/portfolio2/static/a93fc7025f7c8f23f9c9d4606fb8098f/b5811/github-logo.png 1x,\\n/portfolio2/static/a93fc7025f7c8f23f9c9d4606fb8098f/33eba/github-logo.png 1.5x,\\n/portfolio2/static/a93fc7025f7c8f23f9c9d4606fb8098f/8ba1e/github-logo.png 2x"}}},"linkedin":{"childImageSharp":{"fixed":{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAABKNAAASjQEphQ1dAAACYElEQVQ4y5VUO2tUQRQ+0QhKFCuJBEFECxXBzs4ihVXS2aYSUka0cGaTTTaQSmyCP0JbG52zWTUxRtHKB4KVDxBREQnio0h27x2/c2b23tnLouvAx5mZc+ab78zjEFmeAn4BHmiTdVmwnMe5ru2HPPFvkXHTpGRzdz0Zzmhh3dPcfa/WNv2ApIKM6lhn3CYVE7MtsctQeBZ2Hs7tCum/FGZqoaxNCw+E/QalzbglaqzLfHsAhWUmqmTxkQwuRqL9aq2b0NRLwrxHlXF5nyMRQu5o/tY97lXIN2l+LRy2RYx1HU2rd4M2xlnPRkX+sti41+hfBZ5QfdVTbcXrcYhPxrO4PDkGsbVWuDy9UN3MdwlzXWj5O1AHLgOXgK/AW+ACFuBpuUX0PwEN4BzG45ifQf99yJADqaqTp2L4TU/Klp8Bt5NLGkbMcao2y4eAj6pa0g+E97zuZHkvsCMGvgRakWxXMW94BOOdMWZP9F8JF4gzLQndO/R3J4peYLwSSYYjwSQgcWvwjyUqz0RRiULzV8KhAPeKGhuelp56Pe+S8Gj8rn4wwrDoIPBF4xsPJb3rpc8dxvxvqjX/g9DwKMafVUX4CMvJZgMQWgahSxWORoX9CU2VMNzyCEiGkltOCcdKwg2JT1LmIxBUEHb0HdrKOzR4h8bdSRbtiw87KDR8LfEdCDU1EHZ/yjdgHDgJladhPwDP0T8FewKYAH5qvHxHy7dAeizE83n0t7vlaysq9Jq6vHg9gmb4y9KX/ypIi0Dqk1oaCskPUTgNbBZFwkhpkmJZlKesYktio/FhjZAZnvkD+IqeYMY547sAAAAASUVORK5CYII=","width":25,"height":25,"src":"/portfolio2/static/30c453b7f5fbdb09ea0cb42a5dc7a6e5/b5811/linkedin.png","srcSet":"/portfolio2/static/30c453b7f5fbdb09ea0cb42a5dc7a6e5/b5811/linkedin.png 1x,\\n/portfolio2/static/30c453b7f5fbdb09ea0cb42a5dc7a6e5/33eba/linkedin.png 1.5x,\\n/portfolio2/static/30c453b7f5fbdb09ea0cb42a5dc7a6e5/8ba1e/linkedin.png 2x"}}},"site":{"siteMetadata":{"author":{"name":"Nicholas Pung"}}}}}')},INYr:function(e,t,a){"use strict";var i=a("XKFU"),r=a("CkkT")(6),n="findIndex",s=!0;n in[]&&Array(1)[n]((function(){s=!1})),i(i.P+i.F*s,"Array",{findIndex:function(e){return r(this,e,arguments.length>1?arguments[1]:void 0)}}),a("nGyu")(n)},OGtf:function(e,t,a){var i=a("XKFU"),r=a("eeVq"),n=a("vhPU"),s=/"/g,o=function(e,t,a,i){var r=String(n(e)),o="<"+t;return""!==a&&(o+=" "+a+'="'+String(i).replace(s,"&quot;")+'"'),o+">"+r+"</"+t+">"};e.exports=function(e,t){var a={};a[e]=t(o),i(i.P+i.F*r((function(){var t=""[e]('"');return t!==t.toLowerCase()||t.split('"').length>3})),"String",a)}}}]);
//# sourceMappingURL=cd7d5f864fc9e15ed8adef086269b0aeff617554-e0bf75c22e55b8018f62.js.map