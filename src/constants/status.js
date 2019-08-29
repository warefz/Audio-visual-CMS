(function (root, factory) {
    if (typeof define === 'function') {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.STATUS = factory();
    }
}(this, function () {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    var status = {
        AGENCY_STATUS: {
            AUDITING: 100,
            REJECTED: 200,
            APPROVED: 300,
            PAID: 400,
            STOPPED: 500
        },
        DEPOSIT_ORDER_STATUS: {
            WAIT_PAY: 100,
            PAID: 200
        },
        TRAINEE_STATUS: {
            NOT_ENTER: 100,
            ENTER: 200,
            INVALID: 300
        },
        WITHDRAW_STATUS: {
            WAIT_APPROVE: 100,
            APPROVED: 200,
            REJECT: 300
        },
        MATERIAL_POST_STATUS: {
            WAIT_POST: 100,
            POSTED: 200
        },
        APPLY_STATUS: {
            NOT_APPLY: 100,
            AUDITING: 200,
            APPROVED: 300,
            FAILED: 400
        }
    };

    return status
}));