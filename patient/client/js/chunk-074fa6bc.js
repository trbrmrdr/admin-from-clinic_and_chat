(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-074fa6bc"],{1325:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("form",{staticClass:"auth",on:{submit:function(e){return e.preventDefault(),t.submit(e)}}},[a("g-breadcrumbs",{attrs:{link:{name:"welcome"}}},[t._v("На главную")]),a("div",{staticClass:"text"},[t._v("Для того чтобы начать чат "),a("g-router-link",{staticClass:"g-btn-primary switch",attrs:{to:{name:"auth",params:{type:"signup"}}}},[t._v("введите ФИО")]),t._v(" или если вы уже пользовались сервисом - "),a("g-router-link",{staticClass:"g-btn-primary switch",attrs:{to:{name:"auth",params:{type:"login"}}}},[t._v("войдите в свой профиль")])],1),"login"==t.type?[a("div",{staticClass:"g-field"},[a("label",[t._v("Логин")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.username,expression:"username"}],domProps:{value:t.username},on:{input:function(e){e.target.composing||(t.username=e.target.value)}}})]),a("div",{staticClass:"g-field"},[a("label",[t._v("Пароль")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.password,expression:"password"}],attrs:{type:"password"},domProps:{value:t.password},on:{input:function(e){e.target.composing||(t.password=e.target.value)}}})])]:"signup"==t.type?[a("div",{staticClass:"g-field"},[a("label",[t._v("Введите ФИО")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.fio,expression:"fio"}],domProps:{value:t.fio},on:{input:function(e){e.target.composing||(t.fio=e.target.value)}}})])]:t._e(),a("button",{staticClass:"g-btn-primary submit",attrs:{type:"submit"}},[t._v("Войти")])],2)},s=[],n=a("1da1"),i=(a("96cf"),a("bc3a"),{data:function(){return{fio:null,username:null,password:null,error:null}},computed:{type:function(){return this.$store.getters["router/active"].page.params.type}},methods:{submit:function(){this.error=null,"login"==this.type?this.login():"signup"==this.type&&this.signup()},login:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("user/login",{username:t.username,password:t.password});case 2:a=e.sent,a.error?t.error=a.error.text:t.$store.dispatch("router/set",t.$store.state.router.redirect);case 4:case"end":return e.stop()}}),e)})))()},signup:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("user/signup",{fio:t.fio});case 2:a=e.sent,a.error?t.error=a.error.text:t.$store.dispatch("router/set",t.$store.state.router.redirect);case 4:case"end":return e.stop()}}),e)})))()}}}),o=i,u=(a("4f43"),a("2877")),c=Object(u["a"])(o,r,s,!1,null,"c1d7deaa",null);e["default"]=c.exports},"4f43":function(t,e,a){"use strict";a("e8c8")},e8c8:function(t,e,a){var r=a("ff12");r.__esModule&&(r=r.default),"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var s=a("499e").default;s("62a9d0d6",r,!0,{sourceMap:!1,shadowMode:!1})},ff12:function(t,e,a){var r=a("24fb");e=r(!1),e.push([t.i,".auth[data-v-c1d7deaa]{padding:20px}.breadcrumbs[data-v-c1d7deaa],.title[data-v-c1d7deaa]{margin-bottom:15px}.title[data-v-c1d7deaa]{font-size:18px;font-weight:500;text-align:center}.text[data-v-c1d7deaa]{font-size:16px;margin-bottom:30px}.switch[data-v-c1d7deaa]{margin:5px 0}.g-field[data-v-c1d7deaa]{margin-bottom:10px}.submit[data-v-c1d7deaa]{width:100%;margin-top:10px}",""]),t.exports=e}}]);