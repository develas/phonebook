import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _9205100c = () => interopDefault(import('..\\pages\\users\\index.vue' /* webpackChunkName: "pages_users_index" */))
const _799d30e2 = () => interopDefault(import('..\\pages\\users\\_id.vue' /* webpackChunkName: "pages_users__id" */))
const _d0110d5c = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/users",
    component: _9205100c,
    name: "users"
  }, {
    path: "/users/:id",
    component: _799d30e2,
    name: "users-id"
  }, {
    path: "/",
    component: _d0110d5c,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
