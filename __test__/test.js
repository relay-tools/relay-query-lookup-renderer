'use strict';

const {
    Environment,
    Network,
    RecordSource,
    Store,
    fetchQuery
} = require('relay-runtime');
const getNetworkLayer = require('relay-mock-network-layer');

const schema = `
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # the list of Posts by this author
  }
  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
  # the schema allows the following query:
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }
  # this schema allows the following mutation:
  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`;

const network = Network.create(getNetworkLayer({schema}));

// Create an environment using this network:
const store = new Store(new RecordSource());
const environment = new Environment({network, store});



test('adds 1 + 2 to equal 3', async () => {
    expect(2).toBe(3);
});
