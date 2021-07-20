// export data that will be stored
export const state = () => ({
  plans: [],
  ActivePlans:[],
  activities: [],
  players: [],
  services: [],
})

export const mutations = {
  setPlans: function (state, plans) {
    state.plans = plans
  },
  setActivePlans:function (state, plans){
    state.ActivePlans = plans
  },
  setPlayers: function (state, players) {
    state.players = players
  },
  addPlan: function (state, plan) {
    state.plans.push(plan)
  },
  deletePlan: function (state , plan_id) {
    state.plans = state.plans.filter(plan => {
      return plan.id !== plan_id
    })
  },
  deletePlayer: function (state , player_id) {
    state.players = state.players.filter(player => {
      return player.id !== player_id
    })
  },
  addPlayer:function (state, player){
    this.state.players.push(player)
  }
}

