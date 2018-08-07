var moment = require('moment');

module.exports = {
    generateMessage = (from, text) => {
        return { from, text }
    },

    generateLocationMessage = (from, latitude, longitude) => {
        return {
            from,
            url: '${latitude} dan ${longitude}',
            createdAt: moment().valueOf()
        }
    }
}