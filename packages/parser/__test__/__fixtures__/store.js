export default {
    getters: {
        // @vuese
        // Returns a correctly formatted object
        formattedObject(state) {}
    },
    actions: {
        // @vuese
        // Grabs the action from the API
        // @arg the url to get
        async fetchObject({ commit, state }, url) {}
    },
    mutations: {
        // @vuese
        // Set the object in the store
        // @arg object with key/value to set
        MUTATE_OBJECT(state, { key, value }) {}
    },
    state: {
        // stores the object
        stateObject: {}
    }
};
