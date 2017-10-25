const schemaDef = `
  type Beer {
    id: ID!
    name: String!
    alcohol: Float!
    type: Type
  }

  type Query {
    cervezas: [Beer]
    cerveza(id: Int): Beer
  }
`;

module.exports = schemaDef;
