import { Router } from 'express';
import Sequelize from 'sequelize';
import { Person } from '../models/Person';
import { Phone } from '../models/Phone';
import { prepareResponse, composePhoneNumbers } from '../utils';

export const persons = Router();
const Op = Sequelize.Op;

persons.post('/', async (req, res, next) => {
  const { phones = [] } = req.body;
  const person: Person | void = await Person.create(req.body).catch(e => next(e));

  if (phones.length) {
    const promises = phones.map((phoneNumber: string): Promise<Phone> =>
      Phone.create({ phoneNumber, userId: person['id'] }));

    await Promise.all(promises).catch(e => next(e));
  }

  return res.status(201).json(person);
});

persons.get('', async (req, res, next) => {
  const phoneOptions = {
    model: Phone
  };
  const personQuery = {}

  // apply filter by phoneNumber
  if (req.query.phone) {
    Object.assign(phoneOptions, { where: { phoneNumber: { [Op.like]: `%${req.query.phone}%` } } })
  }

  // apply filter bu firstName
  if (req.query.firstName) {
    Object.assign(personQuery, { firstName: { [Op.like]: `%${req.query.firstName}%` } })
  }

  const persons: Person[] | void = await Person.findAll({
    where: { ...personQuery },
    include: [phoneOptions]
  })
    .then((persons: Person[] = []): Person[] => persons.map((person: Person) => prepareResponse(person)))
    .catch(e => next(e));

  res.json(persons);
});

persons.get('/:id', async (req, res, next) => {
  const person: Person = await Person.findByPk(req.params.id, {
    include: [
      {
        model: Phone,
        attributes: ['phoneNumber']
      }
    ]
  }).then(person => {
    if ( person === null ) {
      return res.status(404).end('Person not found!');
    }
    return prepareResponse(person);
  }).catch(e => next(e));

  res.json(person);
});

persons.put('/:id', async (req, res, next) => {
  const { phones: queryPhoneNumbers = [] } = req.body;
  const person = await Person.update(req.body, {where: {id: req.params.id}}).catch((e) => next(e));

  if (!person[0]) {
    return res.status(404).end('Person not found!');
  }

  if (queryPhoneNumbers.length) {
    let promises;
    const dbPhoneNumbers = await Phone.findAll({ where: { userId: req.params.id } })
      .catch(e => next(e));

    const { addNumbers = [], deleteNumbers = [] } = composePhoneNumbers(dbPhoneNumbers, queryPhoneNumbers);

    if (addNumbers.length) {
      promises = addNumbers.map(phoneNumber => Phone.create({ phoneNumber, userId: req.params.id }));
    }

    if (deleteNumbers.length) {
      promises = [...promises, ...deleteNumbers.map(phoneNumber => Phone.destroy({ where: { phoneNumber } }))];
    }

    Promise.all(promises).then(() => res.sendStatus(200)).catch((e) => next(e));
  } else {
    res.sendStatus(200);
  }

});

persons.delete('/:id', async (req, res, next)  => {
  const person = await Person.destroy({where: {id: req.params.id}}).catch((e) => next(e));
  if (!person) {
    return res.status(404).end('Person not found!');
  }

  Phone.destroy({ where: { userId: req.params.id } }).catch((e) => next(e));

  res.sendStatus(200);
});
