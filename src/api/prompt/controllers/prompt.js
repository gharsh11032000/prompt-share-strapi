"use strict";

/**
 * prompt controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::prompt.prompt", ({ strapi }) => ({
  // Create a new prompt
  async create(ctx) {
    var { id } = ctx.state.user; //ctx.state.user contains the current authenticated user
    const response = await super.create(ctx);
    const updatedResponse = await strapi.entityService.update(
      "api::prompt.prompt",
      response.data.id,
      { data: { users_permissions_user: id } }
    );
    return updatedResponse;
  },

  // Update a prompt
  async update(ctx) {
    var { id } = ctx.state.user;
    var [prompts] = await strapi.entityService.findMany("api::prompt.prompt", {
      filters: {
        id: ctx.request.params.id,
        users_permissions_user: id,
      },
    });

    if (prompts) {
      const response = await super.update(ctx);
      return response;
    } else {
      return ctx.unauthorized();
    }
  },

  // Delete a prompt
  async delete(ctx) {
    var { id } = ctx.state.user;
    var [prompts] = await strapi.entityService.findMany("api::prompt.prompt", {
      filters: {
        id: ctx.request.params.id,
        users_permissions_user: id,
      },
    });
    if (prompts) {
      const response = await super.delete(ctx);
      return response;
    } else {
      return ctx.unauthorized();
    }
  },

  // Get all prompts of a user
  async me(ctx) {
    try {
      const { user } = ctx.state;

      if (!user) {
        return ctx.badRequest(null, [
          {
            messages: [
              {
                id: "No authorization header was found",
              },
            ],
          },
        ]);
      }

      const data = await strapi.entityService.findMany("api::prompt.prompt", {
        filters: {
          users_permissions_user: user.id,
        },
      });

      if (!data) {
        return ctx.notFound();
      }

      ctx.body = data;
    } catch (error) {
      ctx.badRequest("Me Prompts controller error", { moreDetails: error });
    }
  },

  // Count all prompts
  count(ctx) {
    var { query } = ctx.request;
    return strapi.query("api::prompt.prompt").count({ where: query });
  },
}));
