
export default (posts=[],action)=>{
    switch(action.type){
        case 'FETCH_ALL':
            // 返回API获取的所有帖子
            return action.payload;
        case 'CREATE':
            return [...posts,action.payload];// 新增帖子
        case 'UPDATE':
        case 'LIKE':
            return posts.map((post)=>post._id===action.payload._id ? action.payload:post); // 更新帖子
        case 'DELETE':
            return posts.filter((post)=>post._id!==action.payload); // 删除帖子
            default:
            return posts;
    }
}  