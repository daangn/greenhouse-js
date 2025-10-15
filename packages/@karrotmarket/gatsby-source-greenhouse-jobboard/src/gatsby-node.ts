import type { GatsbyNode, NodeInput } from 'gatsby';
import type {
  JobQuestion,
  JobQuestionFieldValue,
} from 'greenhouse-jobboard-js';
import { JobBoardClientV1 } from 'greenhouse-jobboard-js';
import type {
  PluginOptions,
  GreenhouseJobBoardJobNodeSource,
  GreenhouseJobBoardDepartmentNodeSource,
} from './types.ts';

const gql = String.raw;

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
  Joi,
}) => {
  return Joi.object({
    boardToken: Joi.string().required(),
    forceGC: Joi.boolean().default(false),
  });
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({
  actions,
  schema,
}, options) => {
  type GreenhouseJobBoardJobCustomFieldMetadataSource = GreenhouseJobBoardJobNodeSource['metadata'][number];

  const selectField = (source: JobQuestion) => {
    return source.fields.find(field => field.type === 'input_file') ?? source.fields[0];
  };

  actions.createTypes(gql`
    enum GreenhouseJobBoardJobCustomFieldType {
      SHORT_TEXT
      LONG_TEXT
      SINGLE_SELECT
      MULTI_SELECT
      YES_NO
      CURRENCY
      DATE
      URL
      USER
      CURRENCY_RANGE
      NUMBER_RANGE
    }
  `);

  actions.createTypes([
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJob',
      interfaces: ['Node'],
      extensions: {
        infer: false,
      },
      fields: {
        ghId: {
          type: 'String!',
          resolve: (source: GreenhouseJobBoardJobNodeSource) => source.ghId.toString(),
        },
        title: {
          type: 'String!',
        },
        boardUrl: {
          type: 'String!',
          resolve: (source: GreenhouseJobBoardJobNodeSource) => source.absolute_url,
          description: 'URL to public Greenhouse job board UI',
        },
        content: {
          type: 'String!',
        },
        updatedAt: {
          type: 'Date!',
          resolve: (source: GreenhouseJobBoardJobNodeSource) => new Date(source.updated_at),
          extensions: {
            dateformat: {},
          },
        },
        questions: {
          type: '[GreenhouseJobBoardJobQuestion!]!',
        },
        locationQuestions: {
          type: '[GreenhouseJobBoardJobQuestion!]!',
        },
        departments: {
          type: '[GreenhouseJobBoardDepartment!]!',
          async resolve(source: GreenhouseJobBoardJobNodeSource, _args, context) {
            const { entries } = await context.nodeModel.findAll({
              type: 'GreenhouseJobBoardDepartment',
              query: {
                filter: {
                  ghId: {
                    in: source.departments.map(department => department.id.toString()),
                  },
                },
              },
            });
            return entries;
          },
        },
        metadata: {
          type: '[GreenhouseJobBoardJobCustomFieldMetadata!]!',
        },
        boardToken: {
          type: 'String!',
        },
      },
    }),
    schema.buildInterfaceType({
      name: 'GreenhouseJobBoardJobQuestion',
      resolveType(source: JobQuestion) {
        const field = selectField(source);
        switch (field.type) {
          case 'input_file':
            return 'GreenhouseJobBoardJobQuestionForAttachment';
          case 'input_text':
            return 'GreenhouseJobBoardJobQuestionForShortText';
          case 'textarea':
            return 'GreenhouseJobBoardJobQuestionForLongText';
          case 'multi_value_single_select':
            const [value1, value2] = field.values;
            if ((value1?.name === 'No' && value1?.value === 0) &&
                (value2?.name === 'Yes' && value2?.value === 1)) {
              return 'GreenhouseJobBoardJobQuestionForYesNo';
            }
            return 'GreenhouseJobBoardJobQuestionForSingleSelect';
          case 'multi_value_multi_select':
            return 'GreenhouseJobBoardJobQuestionForMultiSelect';
          default:
            throw new Error(`Unhandled question type ${field.type}`);
        }
      },
      fields: {
        label: 'String!',
        required: 'Boolean!',
        description: 'String',
        name: {
          type: 'String!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.name;
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionForAttachment',
      interfaces: ['GreenhouseJobBoardJobQuestion'],
      fields: {
        label: 'String!',
        required: 'Boolean!',
        description: 'String',
        name: {
          type: 'String!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.name;
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionForShortText',
      interfaces: ['GreenhouseJobBoardJobQuestion'],
      fields: {
        label: 'String!',
        required: 'Boolean!',
        description: 'String',
        name: {
          type: 'String!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.name;
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionForLongText',
      interfaces: ['GreenhouseJobBoardJobQuestion'],
      fields: {
        label: 'String!',
        required: 'Boolean!',
        description: 'String',
        name: {
          type: 'String!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.name;
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionForSingleSelect',
      interfaces: ['GreenhouseJobBoardJobQuestion'],
      fields: {
        label: 'String!',
        required: 'Boolean!',
        description: 'String',
        name: {
          type: 'String!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.name;
          },
        },
        options: {
          type: '[GreenhouseJobBoardJobQuestionAnswerOption!]!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.values;
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionForMultiSelect',
      interfaces: ['GreenhouseJobBoardJobQuestion'],
      fields: {
        label: 'String!',
        required: 'Boolean!',
        description: 'String',
        name: {
          type: 'String!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.name;
          },
        },
        options: {
          type: '[GreenhouseJobBoardJobQuestionAnswerOption!]!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.values;
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionForYesNo',
      interfaces: ['GreenhouseJobBoardJobQuestion'],
      fields: {
        label: 'String!',
        required: 'Boolean!',
        description: 'String',
        name: {
          type: 'String!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.name;
          },
        },
        options: {
          type: '[GreenhouseJobBoardJobQuestionAnswerOption!]!',
          resolve(source: JobQuestion) {
            const field = selectField(source);
            return field.values;
          },
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionAnswerOption',
      fields: {
        label: {
          type: 'String!',
          description: 'Label of the question answer value',
        },
        value: {
          type: 'String!',
          description: 'Unique id of the question answer value',
          resolve: (source: JobQuestionFieldValue) => source.value.toString(),
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobCustomFieldMetadata',
      extensions: {
        infer: false,
      },
      fields: {
        id: {
          type: 'String!',
          resolve: (source: GreenhouseJobBoardJobCustomFieldMetadataSource) => source.id.toString(),
        },
        name: {
          type: 'String!',
        },
        type: {
          type: 'GreenhouseJobBoardJobCustomFieldType!',
          resolve: (source: GreenhouseJobBoardJobCustomFieldMetadataSource) => source.value_type.toUpperCase(),
        },
        value: {
          type: 'String',
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardDepartment',
      interfaces: ['Node'],
      extensions: {
        infer: false,
      },
      fields: {
        ghId: {
          type: 'String!',
          resolve: (source: GreenhouseJobBoardDepartmentNodeSource) => source.ghId.toString(),
        },
        name: {
          type: 'String!',
          resolve: (source: GreenhouseJobBoardDepartmentNodeSource) => source.name,
        },
        jobs: {
          type: '[GreenhouseJobBoardJob!]!',
          async resolve(source: GreenhouseJobBoardDepartmentNodeSource, _args, context) {
            const { entries } = await context.nodeModel.findAll({
              type: 'GreenhouseJobBoardJob',
              query: {
                filter: {
                  ghId: {
                    in: source.jobs.map(job => job.id.toString()),
                  },
                },
              },
            });
            return entries;
          },
        },
        parentDepartment: {
          type: 'GreenhouseJobBoardDepartment',
          resolve(source: GreenhouseJobBoardDepartmentNodeSource, _args, context) {
            return context.nodeModel.findOne({
              type: 'GreenhouseJobBoardDepartment',
              query: {
                filter: {
                  ghId: {
                    eq: source.parent_id?.toString() ?? null,
                  },
                },
              },
            });
          },
        },
        childDepartments: {
          type: '[GreenhouseJobBoardDepartment!]!',
          async resolve(source: GreenhouseJobBoardDepartmentNodeSource, _args, context) {
            const { entries } = await context.nodeModel.findAll({
              type: 'GreenhouseJobBoardDepartment',
              query: {
                filter: {
                  ghId: {
                    in: source.child_ids.map(id => id.toString()),
                  },
                },
              },
            });
            return entries;
          },
        },
      },
    }),
  ]);
  // TODO: Location
};

export const sourceNodes: GatsbyNode['sourceNodes'] = async ({
  actions,
  createNodeId,
  createContentDigest,
  getNodesByType,
}, options) => {
  // must validated by `pluginOptionsSchema`
  const {
    boardToken,
    forceGC,
  } = options as unknown as PluginOptions;

  const client = new JobBoardClientV1({
    boardToken,
    client: {
      async get(url: URL) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          return data;
        } catch (error) {
          throw new Error(
            `Failed to fetch the job board from ${url.toString()}`,
            { cause: error },
          );
        }
      },
    },
  });

  const jobList = await client.getJobList();
  const jobs = await Promise.all(jobList.map(job => {
    return client.getJobWithQuestions(job.id);
  }));
  const jobNodes: Array<NodeInput & GreenhouseJobBoardJobNodeSource> = jobs.map(job => ({
    ...job,
    boardToken,
    ghId: job.id,
    id: createNodeId(`GreenhouseJobBoardJob:${job.id}`),
    internal: {
      type: 'GreenhouseJobBoardJob',
      contentDigest: createContentDigest(job),
    },
  }));
  for (const node of jobNodes) {
    actions.createNode(node);
  }

  const departmentList = await client.getDepartmentList();
  const departmentNodes: Array<NodeInput & GreenhouseJobBoardDepartmentNodeSource> = departmentList.map(department => ({
    ...department,
    boardToken,
    ghId: department.id,
    id: createNodeId(`GreenhouseJobBoardDepartment:${department.id}`),
    internal: {
      type: 'GreenhouseJobBoardDepartment',
      contentDigest: createContentDigest(department),
    },
  }));
  for (const node of departmentNodes) {
    actions.createNode(node);
  }

  const shouldLeave = new Set<string>([
    ...jobNodes.map(node => node.id),
    ...departmentNodes.map(node => node.id),
  ]);
  const cachedNodes = [
    ...getNodesByType('GreenhouseJobBoardJob'),
    ...getNodesByType('GreenhouseJobBoardDepartment'),
  ];

  for (const node of cachedNodes) {
    if (node.boardToken !== boardToken) {
      continue;
    }

    actions.touchNode(node);

    if (forceGC) {
      if (!shouldLeave.has(node.id)) {
        actions.deleteNode(node);
      }
    }
  }
};
