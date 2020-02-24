"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getNumbers = (phoneNumbers) => phoneNumbers.map(pn => pn.phoneNumber);
exports.getNumbers = getNumbers;
const prepareResponse = (user) => {
    return Object.assign({}, user.dataValues, { phones: getNumbers(user.phones) });
};
exports.prepareResponse = prepareResponse;
const filterNumbers = (a, b) => a.filter((pn) => !b.includes(pn));
;
const composePhoneNumbers = (dbPhoneNumbers, queryPhoneNumbers) => ({
    addNumbers: filterNumbers(queryPhoneNumbers, getNumbers(dbPhoneNumbers)),
    deleteNumbers: filterNumbers(getNumbers(dbPhoneNumbers), queryPhoneNumbers)
});
exports.composePhoneNumbers = composePhoneNumbers;
