import { Phone } from '../models/Phone'

const getNumbers = (phoneNumbers) => phoneNumbers.map(pn => pn.phoneNumber);

const prepareResponse = (user) => {
  return Object.assign({}, user.dataValues, { phones: getNumbers(user.phones) });
};

const filterNumbers = (a: string[], b: string[]): string[] => a.filter((pn) => !b.includes(pn));

interface IComposePhoneNumbers {
  addNumbers: string[],
  deleteNumbers: string[]
};

const composePhoneNumbers = (dbPhoneNumbers: Phone[] | void, queryPhoneNumbers: string[]): IComposePhoneNumbers => ({
  addNumbers: filterNumbers(queryPhoneNumbers, getNumbers(dbPhoneNumbers)),
  deleteNumbers: filterNumbers(getNumbers(dbPhoneNumbers), queryPhoneNumbers)
})

export {
  prepareResponse,
  getNumbers,
  composePhoneNumbers
};
