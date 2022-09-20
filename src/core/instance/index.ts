import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import type { GlobalAPI } from 'types/global-api'

// 此处不用 class 的原因是因为方便后续给 Vue 实例混入实例成员
function Vue(options) {
  if (__DEV__ && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 调用 _init() 方法
  this._init(options)
}

//@ts-expect-error Vue has function type
// 注册 vm 的 _init() 方法，初始化 vm
initMixin(Vue)

//@ts-expect-error Vue has function type
// 注册 vm 的 $data/$props/$set/$delete/$watch
stateMixin(Vue)

//@ts-expect-error Vue has function type
// 初始化事件相关方法
// $on/$once/$off/$emit
eventsMixin(Vue)

//@ts-expect-error Vue has function type
// 初始化生命周期相关的混入方法
// _update/$forceUpdate/$destroy
lifecycleMixin(Vue)

//@ts-expect-error Vue has function type
// 混入 render
// $nextTick/_render
renderMixin(Vue)

export default Vue as unknown as GlobalAPI
