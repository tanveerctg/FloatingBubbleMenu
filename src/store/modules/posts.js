

const state={
    posts:[]
};
const getters={
    allPosts:state=>{
        console.log(localStorage.getItem('posts'));
        const posts=JSON.parse(localStorage.getItem('posts'));
        state.posts=posts;
        console.log(state.posts)
        return state.posts;
    },
    getPost:(state)=>{
        return (id)=>{
            const getPost=state.posts.find(post=>post.id==id);
            return getPost;
        }
    }
};
const actions={
    addPost ({commit},post) {
       let posts=JSON.parse(localStorage.getItem('posts'));
       if(posts){
           posts=[...posts,post];
       }else{
           posts=[post];
       }
       localStorage.setItem('posts',JSON.stringify(posts));

       commit('addPost',post)
    }
};
const mutations={
    addPost:(state,post)=>state.posts ? state.posts.push(post) : state.posts=[post]
};

export default{state,getters,actions,mutations};

// [
//     {id:1,text:'Hello I am tanveer from chittagong.'},
//     {id:2,text:'Hello I am ripon from sylhet.'}
// ]