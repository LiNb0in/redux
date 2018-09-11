import compose from './compose'

/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => { // ...args => reducers or intital state
    const store = createStore(...args) // 创建全局store
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }
    // 给中间件包装的方法
    const middlewareAPI = {
      getState: store.getState, // 取到最新的store
      dispatch: (...args) => dispatch(...args) // dispatch方法
    }
    // 遍历所使用的中间件
    // 注入包装好的方法, 以便在中间件中方便调用
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch) // 将最新的store传入到中间件中

    return {
      ...store,
      dispatch
    }
  }
}
