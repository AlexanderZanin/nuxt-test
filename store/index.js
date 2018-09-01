import axios from 'axios';
import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
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
      },
      setToken(state, token) {
        state.token = token
      }
    },
    actions: {
      nuxtServerInit({ commit }, context) {
        return context.app.$axios
          .$get('/posts.json')
          .then(data => {
            const postsArray = [];
            for (const key in data) {
              postsArray.push({ ...data[key], id: key });
            }
            commit('setPosts', postsArray);
          })
          .catch(e => context.error(e))
      },
      setPosts({ commit }, posts) {
        commit('setPosts', posts)
      },
      editPost({ commit }, editedPost) {
        return this.$axios.$put(`/posts/${editedPost.id}.json`, editedPost)
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
        return this.$axios.$post('/posts.json', createdPost)
          .then(data => {
            commit('addPost', { ...createdPost, id: data.name })
          })
          .catch(e => {
            console.error(e)
          })
      },
      authenticateUser({ commit }, authData) {
        let authUrl = authData.isLogin
          ? `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.fbAPIKey}`
          : `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.fbAPIKey}`

        return this.$axios.$post(authUrl, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }).then(result => {
          commit('setToken', result.idToken)
        })
          .catch(e => console.error(e))
      }
    },
    getters: {
      loadedPosts: state => state.loadedPosts
    }
  })
}


export default createStore
