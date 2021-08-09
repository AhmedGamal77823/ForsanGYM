// export data that will be stored
export const state = () => ({
  plans: [],
  activities: [],
  players: [],
  playersNumber:0,
  services: {
    isLoaded:false,
    items: []
  },
  activityPlayers: [],
  servicesIncome: {
    isLoaded:false,
    items: []
  },
  subscriptionsIncome: {
    isLoaded:false,
    items: []
  },
  isActivityPlayerSubscriptionsIncomeLoaded: false,
  totalIncome: 0,
  activityPlayerSubscriptions: {
    count: 0,
    items: []
  },
  playerSubscriptions: {
    count: 0,
    isLoaded:false,
    items: []
  }
})

export const mutations = {
  // Player Section --begin
  setPlayers: function (state, players) {
    state.players = players
  },
  addPlayer: function (state, player) {
    state.players.push(player)
    state.playersNumber++
  },
  editPlayer: function (state, player) {
    let playerNew = Object.assign({}, player)
    playerNew.subscription = Object.assign({}, player.subscription)
    playerNew.subscription.plan = Object.assign({}, player.subscription.plan)
    playerNew.weights = Object.assign([], player.weights)

    for (let i = 0; i < state.players.length; i++) {
      if (state.players[i].id === playerNew.id) {
        state.players.splice(i, 1, playerNew)
        break
      }
    }

  },
  setPlayerSubscriptions(state, subscriptions) {
    state.playerSubscriptions.items = subscriptions
  },
  setPlayersNumber(state, playerNumber){
    state.playersNumber = playerNumber
  },
  // Player Section --end
  deletePlayer: function (state, player_id) {
    state.players = state.players.filter(player => {
      return player.id !== player_id
    })
    state.playersNumber--
  },
  setPlans: function (state, plans) {
    state.plans = plans
  },
  addPlan: function (state, plan) {
    state.plans.push(plan)
  },
  deletePlan: function (state, plan_id) {
    state.plans = state.plans.filter(plan => {
      return plan.id !== plan_id
    })
  },

  setActivityPlayers: function (state, activityPlayers) {
    state.activityPlayers = activityPlayers
  },
  deleteActivityPlayer: function (state, activityPlayer_id) {
    state.activityPlayers = state.activityPlayers.filter(actPlayer => {
      return actPlayer.id !== activityPlayer_id
    })
  },
  SetActivities: function (state, newActivities) {
    state.activities = newActivities
  },
  addActivity: function (state, activity) {
    state.activities.push(activity)
  },
  deleteActivity: function (state, activity_id) {
    state.activities = state.activities.filter(activity => {
      return activity.id !== activity_id
    })
  },

  //  ActivityPlayers -- start

  addNewActivityPlayer: function (state, activityPlayer) {
    state.activityPlayers.push(activityPlayer)
    state.totalIncome += activityPlayer.subscription.price
  },
  editActivityPlayer: function (state, activityPlayer) {
    let holder = state.activityPlayers.findIndex((obj => obj.id === activityPlayer.id))
    state.activityPlayers[holder].name = activityPlayer.name
    state.activityPlayers[holder].id = activityPlayer.id
    state.activityPlayers[holder].subscription = activityPlayer.subscription
    state.totalIncome += activityPlayer.subscription.price
  },
  editActivity: function (state, act) {
    let objIndex = state.activities.findIndex((obj => obj.id === act.id))
    state.activities[objIndex].name = act.name
    state.activities[objIndex].coachName = act.coachName
    state.activities[objIndex].coachPhoneNumber = act.coachPhoneNumber
    state.activities[objIndex].price = act.price
    state.activities[objIndex].description = act.description
  },
  setAllActivityPlayersubscriptions: function (state, res) {
    state.activityPlayerSubscriptions.items = res
  },
  setActivityPlayerSubscriptionsIncome: function(state, todaysSubscriptions){
    for(let i = 0; i < todaysSubscriptions.length; ++i){
      state.totalIncome += todaysSubscriptions[i].price
    }
    state.isActivityPlayerSubscriptionsIncomeLoaded = true
  },
  // Activity Player -- End

  // Services Part :

  SetServices: function (state, services) {
    state.services.items = services
    state.services.isLoaded = true
  },
  AddService: function (state, service) {
      state.services.items.push(service)
  },
  DeleteService: function (state, service_id) {
    state.services.items = state.services.items.filter(service => {
      return service.id !== service_id
    })

    //Update the table of income with DELETED Service
    for (let i = 0; i < state.servicesIncome.items.length; i++) {
      if (service_id === state.servicesIncome.items[i].service.id) {
        state.servicesIncome.items[i].service.name = state.servicesIncome.items[i].service.name + '\n(DELETED)'
        break
      }
    }
  },
  //Service end
  setServicesIncome: function (state, servicesIncome) {
    if(servicesIncome.length>0){
      state.servicesIncome.items = servicesIncome
      for (let i = 0; i < servicesIncome.length; i++) {
        if(!state.servicesIncome.items[i].service ){
          // deleted service
          state.servicesIncome.items[i].service = {name:"Deleted Service"}
        }else{ // updating total income
          state.totalIncome += (servicesIncome[i].soldItems * servicesIncome[i].service.price)

        }
      }
    }
    state.servicesIncome.isLoaded = true
  },
  buyService: function (state, serviceIncome) {
    let objIndex = state.servicesIncome.items.findIndex((obj => obj.id === serviceIncome.id))
    if(objIndex!==-1){
      state.servicesIncome.items.splice(objIndex, 1)
    }
    state.servicesIncome.items.push(serviceIncome)
    state.totalIncome += serviceIncome.service.price
  },
  setSubscriptionsIncome: function (state, todaysSubscriptions) {
    if(todaysSubscriptions.length>0){ // there is subscriptions for today
      const visitedArr = []
      for (let i = 0, arr = todaysSubscriptions; i < arr.length; i++) {
        if (arr[i].plan) {
          // the plan is not deleted :D
          let tmpIncome = 0
          if (visitedArr[arr[i].plan.id] !== undefined) {
            // another subscription of this plan is on the array
            state.subscriptionsIncome.items[visitedArr[arr[i].plan.id]].numberOfSubscriptions++
            state.subscriptionsIncome.items[visitedArr[arr[i].plan.id]].payedMoney += arr[i].payedMoney
            tmpIncome += arr[i].payedMoney
          } else {
            // push subscription to array
            state.subscriptionsIncome.items.push({
              plan: arr[i].plan,
              numberOfSubscriptions: 1,
              payedMoney: arr[i].payedMoney
            })
            visitedArr[arr[i].plan.id] = state.subscriptionsIncome.items.length - 1
            tmpIncome += arr[i].payedMoney
          }
          state.totalIncome += tmpIncome // update totoal income}
        } else {
          // plan is deleted :D
          state.subscriptionsIncome.items.push({
            plan: {
              name: "Deleted Plan"
            },
            numberOfSubscriptions: 1,
            payedMoney: arr[i].payedMoney
          })
          state.totalIncome += arr[i].payedMoney
        }
      }
    }
    state.subscriptionsIncome.isLoaded = true
  },
  addSubscriptionIncome: function (state, subscriptionIncome) {

    for (let i = 0, arr = state.subscriptionsIncome.items; i < arr.length; i++) {
      if (arr[i].plan.id === subscriptionIncome.plan.id) {
        arr[i].numberOfSubscriptions++
        arr[i].payedMoney += subscriptionIncome.payedMoney
        state.totalIncome += subscriptionIncome.payedMoney
        return
      }
    }
    state.subscriptionsIncome.items.push({
      plan: subscriptionIncome.plan,
      numberOfSubscriptions: 1,
      payedMoney: subscriptionIncome.payedMoney
    })
  },

  // player weight area start
  deletePlayerWeight: function (state, playerWeight) {
    const player = state.players.find(player => player.id === playerWeight.player.id)
    let playerWeightsArr = player.weights
    for (let i = 0; i < playerWeightsArr.length; i++) {
      if (playerWeightsArr[i].id === playerWeight.id) {
        playerWeightsArr.splice(i, 1)
        break
      }
    }
    player.weights = playerWeightsArr
  },
  addPlayerWeight: function (state, playerWeight) {

    let playerIndex = null
    for (let i = 0; i < state.players.length; i++) {
      // this loop to search for the player
      if (state.players[i].id === playerWeight.player.id) {
        playerIndex = i
        break;
      }
    }
    state.players[playerIndex].weights.push(playerWeight)
    const tmpArr = Object.assign([], state.players)
    state.players = Object.assign([], [])
    state.players = Object.assign([], tmpArr)
  },
  editPlayerWeight: function (state, playerWeight) {
    const player = state.players.find(player => player.id === playerWeight.player_id)
    let tmpArr = null
    for (let i = 0; i < player.weights.length; i++) {
      if (player.weights[i].id === playerWeight.id) {
        playerWeight.player_id = undefined
        player.weights[i] = playerWeight
        tmpArr = Object.assign([], state.players)
        state.players = Object.assign([], [])
        break
      }
    }
    state.players = tmpArr

  },
  // player weight area end

}

export const actions = {
  async nuxtServerInit({ commit, dispatch }) {
    await dispatch('storeDispatchFunc')
  },

  async storeDispatchFunc({ commit }) {

    try{
      // loading plans
      const plans = await this.$axios.$get('plan/')
      commit('setPlans',plans)
    }catch (err){
      console.log('error on plans load (store/index) :')
      console.log(err)
    }

    // try{
    //
    // }catch (err){
    //  console.log('error on plans load (store/index) :')
    //       console.log(err)
    // }

  },

}


