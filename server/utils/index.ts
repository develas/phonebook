import { Phone } from '../models/Phone'

const getNumbers = (phoneNumbers): string[] => phoneNumbers.map(pn => pn.phoneNumber);

const prepareResponse = (person) => {
  return Object.assign({}, person.dataValues, { phones: getNumbers(person.phones) });
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
