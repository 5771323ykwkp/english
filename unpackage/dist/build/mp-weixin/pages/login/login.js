(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/login/login"],{"16e4":function(t,n,e){"use strict";var o;e.d(n,"b",(function(){return i})),e.d(n,"c",(function(){return r})),e.d(n,"a",(function(){return o}));var i=function(){var t=this,n=t.$createElement;t._self._c},r=[]},"1c11":function(t,n,e){"use strict";var o=e("f465"),i=e.n(o);i.a},3517:function(t,n,e){"use strict";e.r(n);var o=e("4f8c"),i=e.n(o);for(var r in o)"default"!==r&&function(t){e.d(n,t,(function(){return o[t]}))}(r);n["default"]=i.a},4230:function(t,n,e){},4835:function(t,n,e){"use strict";(function(t){e("b3d6");o(e("66fd"));var n=o(e("9d74"));function o(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("543d")["createPage"])},"4f8c":function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=r(e("a34a")),i=r(e("8f24"));function r(t){return t&&t.__esModule?t:{default:t}}function a(t,n,e,o,i,r,a){try{var u=t[r](a),s=u.value}catch(c){return void e(c)}u.done?n(s):Promise.resolve(s).then(o,i)}function u(t){return function(){var n=this,e=arguments;return new Promise((function(o,i){var r=t.apply(n,e);function u(t){a(r,o,i,u,s,"next",t)}function s(t){a(r,o,i,u,s,"throw",t)}u(void 0)}))}}var s={data:function(){return{username:"",password:"",codes:[{num:1,color:"#000",rotate:"10deg",size:"16px"},{num:2,color:"#000",rotate:"10deg",size:"16px"},{num:3,color:"#000",rotate:"10deg",size:"16px"},{num:4,color:"#000",rotate:"10deg",size:"16px"}],options:["请选择登录用户类型"],optionsValues:["","yonghu"],index:0,roleNum:0}},onLoad:function(){var t=["请选择登录用户类型"],n=i.default.list();this.menuList=n;for(var e=0;e<this.menuList.length;e++)"是"==this.menuList[e].hasFrontLogin&&(t.push(this.menuList[e].roleName),this.roleNum++);1==this.roleNum&&(this.index=1),this.options=t,this.styleChange()},methods:{styleChange:function(){this.$nextTick((function(){}))},onRegisterTap:function(n){t.setStorageSync("loginTable",n),this.$utils.jump("../register/register")},onForgetTap:function(){this.$utils.jump("../forget/forget")},onLoginTap:function(){var n=this;return u(o.default.mark((function e(){var i;return o.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n.optionsValues[n.index]){e.next=3;break}return n.$utils.msg("请选择登陆用户类型"),e.abrupt("return");case 3:return e.next=5,n.$api.login("".concat(n.optionsValues[n.index]),{username:n.username,password:n.password});case 5:return i=e.sent,t.removeStorageSync("useridTag"),t.setStorageSync("token",i.token),t.setStorageSync("nickname",n.username),t.setStorageSync("nowTable","".concat(n.optionsValues[n.index])),e.next=12,n.$api.session("".concat(n.optionsValues[n.index]));case 12:i=e.sent,t.setStorageSync("userid",i.data.id),i.data.vip&&t.setStorageSync("vip",i.data.vip),t.setStorageSync("role","".concat(n.options[n.index])),n.$utils.tab("../index/index");case 17:case"end":return e.stop()}}),e)})))()},optionsChange:function(t){this.index=t.target.value}}};n.default=s}).call(this,e("543d")["default"])},"9d74":function(t,n,e){"use strict";e.r(n);var o=e("16e4"),i=e("3517");for(var r in i)"default"!==r&&function(t){e.d(n,t,(function(){return i[t]}))}(r);e("1c11"),e("d8c0");var a,u=e("f0c5"),s=Object(u["a"])(i["default"],o["b"],o["c"],!1,null,"3fbe1209",null,!1,o["a"],a);n["default"]=s.exports},d8c0:function(t,n,e){"use strict";var o=e("4230"),i=e.n(o);i.a},f465:function(t,n,e){}},[["4835","common/runtime","common/vendor"]]]);