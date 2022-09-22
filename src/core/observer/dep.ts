/*
 * @Author: yanding.li David.Jackson.Lyd@gmail.com
 * @Date: 2022-09-20 21:42:12
 * @LastEditors: yanding.li David.Jackson.Lyd@gmail.com
 * @LastEditTime: 2022-09-22 22:08:08
 * @FilePath: \vue2-core\src\core\observer\dep.ts
 * @Description:
 *
 * Copyright (c) 2022 by yanding.li David.Jackson.Lyd@gmail.com, All Rights Reserved.
 */
import { remove } from '../util/index'
import config from '../config'
import { DebuggerOptions, DebuggerEventExtraInfo } from 'v3'

let uid = 0
// dep 是个可观察对象，可以有多个指令订阅它

/**
 * @internal
 */
export interface DepTarget extends DebuggerOptions {
  id: number
  addDep(dep: Dep): void
  update(): void
}

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * @internal
 */
export default class Dep {
  // 静态属性，watcher 对象
  static target?: DepTarget | null
  id: number
  // dep 实例对应的 watcher 对象/订阅者数组
  subs: Array<DepTarget>

  constructor() {
    this.id = uid++
    this.subs = []
  }

  // 添加新的订阅者 watcher 对象
  addSub(sub: DepTarget) {
    this.subs.push(sub)
  }

  // 移除订阅者
  removeSub(sub: DepTarget) {
    remove(this.subs, sub)
  }

  // 将观察对象和 watcher 建立依赖
  depend(info?: DebuggerEventExtraInfo) {
    if (Dep.target) {
      // 如果 target 存在，把 dep 对象添加到 watcher 的依赖中
      Dep.target.addDep(this)
      if (__DEV__ && info && Dep.target.onTrack) {
        Dep.target.onTrack({
          effect: Dep.target,
          ...info
        })
      }
    }
  }

  // 发布通知
  notify(info?: DebuggerEventExtraInfo) {
    // stabilize the subscriber list first
    // 首先稳定订阅者列表
    const subs = this.subs.slice() // 克隆数组
    if (__DEV__ && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    // 调用每个订阅者的update方法实现更新
    for (let i = 0, l = subs.length; i < l; i++) {
      if (__DEV__ && info) {
        const sub = subs[i]
        sub.onTrigger &&
          sub.onTrigger({
            effect: subs[i],
            ...info
          })
      }
      subs[i].update()
    }
  }
}

// Dep.target 用来存放目前正在使用的watcher
// 全局唯一，并且一次也只能有一个watcher被使用
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack: Array<DepTarget | null | undefined> = []

// 入栈并将当前 watcher 赋值给 Dep.target
// 父子组件嵌套的时候先把父组件对应的 watcher 入栈，
// 再去处理子组件的 watcher，子组件的处理完毕后，再把父组件对应的 watcher 出栈，继续操作
export function pushTarget(target?: DepTarget | null) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  // 出栈操作
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
