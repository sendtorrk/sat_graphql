const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const teams = [];
let teamIdCounter = 1;
let assetIdCounter = 1;
let noteIdCounter = 1;

const resolvers = {
  Query: {
    ping: () => `pong`,
    teams: () => teams,
  },

  Mutation: {
    addTeam: (parent, args) => {
      const team = {
        id: `team-${teamIdCounter++}`,
        name: args.name,
        email: args.email,
        assets: [],
      };

      teams.push(team);
      return team;
    },

    deleteTeam: (parent, args) => {
      const teamIdx = teams.findIndex((t) => t.id === args.id);
      const team = teams[teamIdx];

      teams.splice(teamIdx, 1);
      return team;
    },

    addAsset: (parent, args) => {
      const teamId = args.teamId;

      const team = teams.find((e) => e.id === teamId);
      const asset = {
        id: `asset-${assetIdCounter++}`,
        teamId: args.teamId,
        serial: args.serial,
        model: args.model,
        email: args.email,
        notes: [],
      };

      team.assets.push(asset);
      return asset;
    },

    updateAsset: (parent, args) => {
      const assetId = args.assetId;

      let asset = null;
      teams.forEach((t) => {
        asset = t.assets.find((a) => a.id === assetId);
        if (asset) {
          return;
        }
      });

      if (args.serial) {
        asset.serial = args.serial;
      }

      if (args.model) {
        asset.model = args.model;
      }

      if (args.email) {
        asset.email = args.email;
      }

      return asset;
    },

    addNote: (parent, args) => {
      const assetId = args.assetId;

      let asset = null;
      let note = null;
      teams.forEach((t) => {
        asset = t.assets.find((a) => a.id === assetId);
        if (asset) {
          note = {
            id: `note-${noteIdCounter++}`,
            assetId: args.assetId,
            message: args.message,
            email: args.email,
          };

          asset.notes.push(note);

          return;
        }
      });

      return note;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
