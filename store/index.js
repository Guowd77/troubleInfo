import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);
const store = new Vuex.Store({
	state:{
		userName:'',
		oldPassword:'',
		oldAccount:''
	},
	mutations:{
		setName(state,data){
			state.userName=data
		},
		setAccout(state,data){
			state.oldAccount=data
		},
		setAccout(state,data){
			state.oldPassword=data
		}
	},
	actions:{
		setName(context,data){
			context.commit('setName',data)
		}
	}
})
export default store