module.exports = {
  helpdeskApi: {
    input: "https://localhost:7287/swagger/v1/swagger.json",
    output: {
      target: "./src/api/generated/helpdesk.ts",
      client: "axios",
      mode: "tags-split",
      schemas: "./src/api/model",
      clean: false,
      mutator: {
        path: "./src/api/axios-instance.ts",
        name: "customInstance",
      },
    },
  },
};
