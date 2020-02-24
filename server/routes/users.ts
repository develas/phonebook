import { Router } from 'express';
const Sequelize = require('sequelize');
import { User } from '../models/User';
import { Phone } from '../models/Phone';
import { prepareResponse, composePhoneNumbers } from '../utils';

export const users = Router();
const Op = Sequelize.Op;

users.post('/', async (req, res, next) => {
  const { phones = [] } = req.body;
  const user = await User.create(req.body).catch((e => next(e)));

  if (phones.length) {
    const promises = phones.map(phoneNumber => Phone.create({ phoneNumber, userId: user['id'] }));
    await Promise.all(promises).catch(e => next(e));
  }

  return res.status(201).json(user);
});

users.get('', async (req, res, next) => {
  const phoneOptions = {
    model: Phone
  };
  const userQuery = {}

  // apply filter by phoneNumber
  if (req.query.phone) {
    Object.assign(phoneOptions, { where: { phoneNumber: { [Op.like]: `%${req.query.phone}%` } } })
  }

  // apply filter bu firstName
  if (req.query.firstName) {
    Object.assign(userQuery, { firstName: { [Op.like]: `%${req.query.firstName}%` } })
  }

  const users = await User.findAll({
    where: { ...userQuery },
    include: [phoneOptions]
  })
    .then(users => (users || []).map(user => prepareResponse(user)))
    .catch(e => next(e));

  res.json(users);
});

users.get('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Phone,
        attributes: ['phoneNumber']
      }
    ]
  }).then(user => {
    if ( user === null ) {
      return res.status(404).end('User not found!');
    }
    return prepareResponse(user);
  }).catch(e => {console.log('error', e); next(e)});

  res.json(user);
});

users.put('/:id', async (req, res, next) => {
  const { phones: queryPhoneNumbers = [] } = req.body;
  const user = await User.update(req.body, {where: {id: req.params.id}}).catch((e) => next(e));

  if (!user[0]) {
    return res.status(404).end('User not found!');
  }

  if (queryPhoneNumbers.length) {
    let promises;
    const dbPhoneNumbers = await Phone.findAll({ where: { userId: req.params.id } }).catch(e => next(e));
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

users.delete('/:id', async (req, res, next)  => {
  const user = await User.destroy({where: {id: req.params.id}}).catch((e) => next(e));
  if (!user) {
    return res.status(404).end('User not found!');
  }

  Phone.destroy({ where: { userId: req.params.id } }).catch((e) => next(e));

  res.sendStatus(200);
});
