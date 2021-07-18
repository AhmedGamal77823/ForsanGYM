// export data that will be stored
export const state = () => ({
  plans: [],
  activities: [],
  players: [],
  services: [],
})

export const mutations = {
  setPlans: function (state, plans) {
    state.plans = plans
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
  }
}

