// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import reducers from './reducers';
import App from './App';


// 创建Redux存储，使用redux-thunk中间件处理异步操作
// compose用于增强store，添加Redux DevTools支持
const store = createStore(reducers, compose(applyMiddleware(thunk)));

// 渲染应用到DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // 将Redux store提供给整个应用
    <Provider store={store}>
        <App />
    </Provider>
);