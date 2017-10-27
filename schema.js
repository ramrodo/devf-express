const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools')
const models = require('./db/models');

const typeDefs = `
  type Beer {
    id: ID!,
    name: String!,
    alcohol: Float!,
  }

  input NewBeer {
    name: String!,
    alcohol: Float!,
    type: Int!,
    brand: Int!,
    description: String!,
    volume: Float!,
    price: Float!,
  }

  input UpdateBeer {
    id: Int!,
    name: String,
    alcohol: Float,
    type: Int,
    brand: Int,
    description: String,
    volume: Float,
    price: Float,
  }

  type Query {
    cervezas: [Beer],
    cerveza(id: Int): Beer,
  }

  type Mutation {
    agregarChela(beer: NewBeer): Beer,
    actualizarChela(beer: UpdateBeer): Beer,
  }
`;

const resolvers = {
  Query: {
    cervezas: () => {
      // models.Beer.findAll().then((beers) => {
      //   return beers;
      // });
      return models.Beer.findAll();
    },

    cerveza: (_, args) => {
      return models.Beer.findOne({ where: { id: args.id } });
    },
  },

  Mutation: {
    agregarChela: (_, args) => {
      return models.Beer.create(args.beer);
    },

    actualizarChela: (_, args) => {
      const { beer } = args;
      models.Beer.update(beer, {
        where: {
          id: beer.id,
        },
      });
      return models.Beer.findOne({
        where: {
          id: beer.id,
        },
      });
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
