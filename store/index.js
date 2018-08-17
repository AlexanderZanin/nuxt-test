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
      }
    },
    getters: {
      loadedPosts: state => state.loadedPosts
    }
  })
}


export default createStore
