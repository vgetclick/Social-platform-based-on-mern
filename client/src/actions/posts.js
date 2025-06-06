import * as api from '../api';

// 获取所有帖子
export const getPosts = () => async (dispatch) => {
    // 调用API获取帖子数据
    try{
        const { data } = await api.fetchPosts();
        // 分发成功动作，将数据传递到reducer
        dispatch({ type:'FETCH_ALL', payload: data });
    }
    catch(error){
        console.log(error.message);
    }
    
};
// 创建帖子
export const createPost = (post) => async (dispatch) => {
  try {
    // 从localStorage获取token并解析
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('请先登录');
    }

    // 发送创建帖子请求
    const { data } = await api.createPost(post);
    dispatch({ type: 'CREATE', payload: data });
    return Promise.resolve();
  } catch (error) {
    console.log(error.message);
    return Promise.reject(error);
  }
};

// 更新帖子
export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: 'UPDATE', payload: data });
    return Promise.resolve();
  } catch (error) {
    console.log(error.message);
    return Promise.reject(error);
  }
};

// 删除帖子
export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: 'DELETE', payload: id });
  } catch (error) {
    console.log(error.message);
  }
};

// 点赞
export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: 'LIKE', payload: data });
  }
  catch (error) {
    console.log(error.message);
  }
};
