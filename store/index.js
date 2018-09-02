import Vuex from 'vuex'
import Cookie from 'js-cookie'

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
      },
      clearToken(state) {
        state.token = null
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
      editPost(vuexContext, editedPost) {
        return this.$axios.$put(`/posts/${editedPost.id}.json?auth=${vuexContext.state.token}`, editedPost)
          .then(() => {
            vuexContext.commit('editPost', editedPost)
          })
          .catch(e => console.error(e))
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        return this.$axios.$post(`/posts.json?auth=${vuexContext.state.token}`, createdPost)
          .then(data => {
            vuexContext.commit('addPost', { ...createdPost, id: data.name })
          })
          .catch(e => {
            console.error(e)
          })
      },
      authenticateUser(vuexContext, authData) {
        let authUrl = authData.isLogin
          ? `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.fbAPIKey}`
          : `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.fbAPIKey}`

        return this.$axios.$post(authUrl, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }).then(result => {
          vuexContext.commit('setToken', result.idToken)
          localStorage.setItem('token', result.idToken)
          localStorage.setItem('tokenExpiration', new Date().getTime() + parseInt(result.expiresIn) * 1000)
          Cookie.set('jwt', result.idToken);
          Cookie.set('expirationDate', new Date().getTime() + parseInt(result.expiresIn) * 1000);
        })
          .catch(e => console.error(e))
      },
      setLogoutTimer({ commit }, duration) {
        setTimeout(() => {
          commit('clearToken')
        }, duration)
      },
      initAuth(vuexContext, req) {
        let token;
        let expirationDate;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='))

          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split('=')[1]
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1]
        } else {
          token = localStorage.getItem('token')
          expirationDate = localStorage.getItem('tokenExpiration')
        }

        if (new Date().getTime() > +expirationDate || !token) {
          console.log('No token or invalid token')
          vuexContext.commit('clearToken')
          return;
        }

        vuexContext.commit('setToken', token)
      }
    },
    getters: {
      loadedPosts: state => state.loadedPosts,
      isAuthenticated(state) {
        return state.token !== null
      }
    }
  })
}


export default createStore
