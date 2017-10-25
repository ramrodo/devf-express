const express = require('express');
const params = require('strong-params');
const bodyParser = require('body-parser');
const models = require('../db/models');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(params.expressMiddleware());

router.get('/', (req, res, next) => {
  models.Beer.findAll().then((beers) => {
    res.send({ beers });
  });
});

router.post('/', (req, res, next) => {
  const { parameters } = req;
  const beerParams = parameters
    .require('beer')
    .permit(
      'name',
      'alcohol',
      'type',
      'brand',
      'description',
      'volume',
      'price',
    ).value();
  models.Beer.create(beerParams)
    .then((beer) => {
      res.status(201).send({ beer });
    })
    .catch((err) => {
      res.status(400).send({ error: err.message });
    });
});

router.put('/:id', (req, res, next) => { // parameter, callback
  const { parameters } = req; // parameters de body
  const beerParams = parameters.require('beer').permit('name').value();
  const beerId = req.params.id; // params de la url
  const beerQuery = {
    where: {
      id: beerId,
    },
  };
  // Todo sequelize lo maneja con Promesas
  models.Beer.findOne(beerQuery).then((beer) => {
    if (!beer) { res.send.status(404).send({ error: 'Beer not found' }); }
    beer.update(beerParams)
      .then((updatedBeer) => {
        res.status(202).send({ beer: updatedBeer });
      })
      .catch(err => res.status(400).send({ error: err.message }));
  });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  models.Beer.destroy({
    where: {
      id,
    },
  })
    .then(() => res.status(204).send());
});

module.exports = router;
