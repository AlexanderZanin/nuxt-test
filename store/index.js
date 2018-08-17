import Vuex from 'vuex'
import axios from 'axios'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts
      },
      addPost(state, post) {
        state.loadedPosts.push(post)
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost
      }
    },
    actions: {
      nuxtServerInit({ commit }, context) {
        return axios.get('https://nuxt-blog-d548f.firebaseio.com/posts.json')
          .then(response => {
            const postsArray = [];
            for (const key in response.data) {
              postsArray.push({ ...response.data[key], id: key });
            }
            commit('setPosts', postsArray);
          })
          .catch(e => context.error(e))
      },
      setPosts({ commit }, posts) {
        commit('setPosts', posts)
      },
      editPost({ commit }, editedPost) {
        return axios.put(`https://nuxt-blog-d548f.firebaseio.com/posts/${editedPost.id}.json`, editedPost)
          .then(() => {
            commit('editPost', editedPost)
          })
          .catch(e => console.error(e))
      },
      addPost({ commit }, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        return axios.post('https://nuxt-blog-d548f.firebaseio.com/posts.json', createdPost)
          .then(result => {
            commit('addPost', { ...createdPost, id: result.data.name })
          })
          .catch(e => {
            console.error(e)
          })
      }
    },
    getters: {
      loadedPosts: state => state.loadedPosts
    }
  })
}


export default createStore
