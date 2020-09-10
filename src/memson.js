const axios = require("axios");
const { QueryData } = require("./queryData.js");
const { fixUrl } = require("./helpers");

/**
 * Creates a memson client object.
 *
 * @param {string} host          Connection host.
 */
const Memson = host => {
  host = fixUrl(host);

  const instance = {
    /**
         * sets a key/value entry in memson.
         *
         * if an entry for the given key already exists, then it will return the old value.
         *
         * @param {string} key the key to store by.
         * @param {any} val
         * @returns {Promise<object>}
         */

    set: (key, val) => cmdRequest(host, { set: [key, val] }),

    /**
         * Summarizes the memson database.
         *
         * Summarizes the database configuration.
         *
         * @returns {Promise<object>}
         */
    summary: () => getRequest(host, ""),

    /**
         * get the json value associated with key in memson.
         *
         * retrieve json from memson.
         *
         * @param {string} key associatedkey .
         * @returns {Promise<any>}
         */
    get: key => cmdRequest(host, { get: key }),

    /**
         * Remove an entry in memson the tables.
         *
         * Removes an entry in memson and returns back the previous value.
         *
         * @param {string} key memson key
         * @returns {Promise<any>}
         */
    remove: key => {
      return cmdRequest(host, { delete: key });
    },

    /**
         *
         * Sum
         *
         * Adds up all the numbers in the given value.
         * Throws error if any json is not a number.
         *
         * @param {string} cmd
         * @returns {Promise<any>}
         */
    sum: cmd => {
      return cmdRequest(host, { sum: cmd });
    },

    /**
         * Queries json entry data.
         *
         * Queries the database using the given parameters.
         *
         * @param {object} cmd Query command.
         * @returns {Promise<QueryData>}
         */
    query: async qry => {
      return cmdRequest(host, { query: qry });
    },

    /**
         *
         * max
         *
         * finds the highest value in the key/value entry
         *
         * @param {string} key
         * @returns {Promise<any>}
         */
    max: key => {
      return cmdRequest(host, { max: key });
    },

    /**
         *
         * min
         *
         * finds the lowest value in the key/value entry
         *
         * @param {string} key
         * @returns {Promise<any>}
         */
    min: key => {
      return cmdRequest(host, { min: key });
    },

    /**
         *
         * avg
         *
         * calculates the aritemtic mean for the given key/value entry
         *
         * @param {string} key
         * @returns {Promise<number>}
         */
    avg: key => {
      return cmdRequest(host, { avg: key });
    },

    /**
         *
         * dev
         *
         * calculates the standard deviation for the given key/value entry
         *
         * @param {string} key
         * @returns {Promise<number>}
         */
    dev: key => {
      return cmdRequest(host, { avg: key });
    },

    /**
         *
         * var
         *
         * calculates the variance for the given key/value entry
         *
         * @param {string} key
         * @returns {Promise<number>}
         */
    var: key => {
      return cmdRequest(host, { avg: key });
    },

    /**
         *
         * last
         *
         * retrieves the last element of the given key/value entry
         *
         * @param {string} key
         * @returns {Promise<number>}
         */
    last: key => {
      return cmdRequest(host, { last: key });
    },

    /**
         *
         * first
         *
         * retrieves the first element of the given key/value entry
         *
         * @param {string} key
         * @returns {Promise<number>}
         */
    first: key => {
      return cmdRequest(host, { first: key });
    },

    /**
         *
         * unique
         *
         * retrieves unique values of the given key/value entry
         *
         * @param {string} key
         * @returns {Promise<number>}
         */
    unique: key => {
      return cmdRequest(host, { unique: key });
    },
        
    /**
         *
         * unique
         *
         * retrieves unique values of the given key/value entry
         *
         * @param {string} key
         * @returns {Promise<number>}
         */
    eval: cmd => {
      return cmdRequest(host, cmd);
    }          

        
  };

  // Host health check
  instance.summary().catch(error => console.error(error));

  return instance;
};

// Make requests

const getRequest = (host, method, payload) => {
  console.debug(host);
  return handleRequestErrors(axios.get(host + method, payload));
};

const cmdRequest = (host, payload) => {
  return handleRequestErrors(axios.post(`${host}cmd`, payload), payload);
};

// Handle errors

const handleRequestErrors = (response, payload) => {
  return response
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.debug(payload);
      if (!error.response) {
        throw new Error(error.message);
      } else {
        throw new Error(error.response.data.message);
      }
    });
};

module.exports = {
  Memson
};
