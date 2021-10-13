import type { GatsbyNode, NodeInput } from 'gatsby';
import type {
  Job,
  JobQuestion,
  JobContentFields,
  JobQuestionField,
  JobQuestionFields,
} from 'greenhouse-jobboard-js';
import { JobBoardClientV1 } from 'greenhouse-jobboard-js';
import type { PluginOptions, GreenhouseJobBoardJobNodeSource } from './types';
import got from 'got';

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
        metadata: {
          type: '[GreenhouseJobBoardJobCustomFieldMetadata!]!',
        },
        boardToken: {
          type: 'String!',
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestion',
      extensions: {
        infer: false,
      },
      fields: {
        label: {
          type: 'String!',
        },
        required: {
          type: 'Boolean!',
        },
        fields: {
          type: '[GreenhouseJobBoardJobQuestionField!]!'
        },
      },
    }),
    schema.buildInterfaceType({
      name: 'GreenhouseJobBoardJobQuestionField',
      resolveType(source: JobQuestionField) {
        switch (source.type) {
          case 'input_file':
            return 'GreenhouseJobBoardJobQuestionFileInputField';
          case 'input_text':
            return 'GreenhouseJobBoardJobQuestionTextInputField';
          case 'input_hidden':
            return 'GreenhouseJobBoardJobQuestionHiidenInputField';
          case 'textarea':
            return 'GreenhouseJobBoardJobQuestionTextareaField';
          case 'multi_value_single_select':
            return 'GreenhouseJobBoardJobQuestionSingleSelectField';
          case 'multi_value_multi_select':
            return 'GreenhouseJobBoardJobQuestionMultiSelectField';
        }
      },
      fields: {
        name: {
          type: 'String!',
        },
        description: {
          type: 'String',
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionFieldValue',
      fields: {
        name: {
          type: 'String!',
          description: 'Label of the question answer value',
        },
        value: {
          type: 'Int!',
          description: 'Unique id of the question answer value',
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionFileInputField',
      interfaces: ['GreenhouseJobBoardJobQuestionField'],
      fields: {
        name: {
          type: 'String!',
        },
        description: {
          type: 'String',
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionTextInputField',
      interfaces: ['GreenhouseJobBoardJobQuestionField'],
      fields: {
        name: {
          type: 'String!',
        },
        description: {
          type: 'String',
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionHiddenInputField',
      interfaces: ['GreenhouseJobBoardJobQuestionField'],
      fields: {
        name: {
          type: 'String!',
        },
        description: {
          type: 'String',
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionTextareaField',
      interfaces: ['GreenhouseJobBoardJobQuestionField'],
      fields: {
        name: {
          type: 'String!',
        },
        description: {
          type: 'String',
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionSingleSelectField',
      interfaces: ['GreenhouseJobBoardJobQuestionField'],
      fields: {
        name: {
          type: 'String!',
        },
        description: {
          type: 'String',
        },
        options: {
          type: '[GreenhouseJobBoardJobQuestionFieldValue!]!',
          resolve: (source: JobQuestion) => source.fields,
        },
      },
    }),
    schema.buildObjectType({
      name: 'GreenhouseJobBoardJobQuestionMultiSelectField',
      interfaces: ['GreenhouseJobBoardJobQuestionField'],
      fields: {
        name: {
          type: 'String!',
        },
        description: {
          type: 'String',
        },
        options: {
          type: '[GreenhouseJobBoardJobQuestionFieldValue!]!',
          resolve: (source: JobQuestion) => source.fields,
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
  ]);
  // TODO: Department
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
        const response = await got(url.toString(), { responseType: 'json' });
        return response.body;
      },
    },
  });

  const jobList = await client.getJobList();
  const jobs = await Promise.all(jobList.map(job => {
    return client.getJobWithQuestions(job.id);
  }));

  const jobNodes: NodeInput[] = jobs.map(job => ({
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

  if (forceGC) {
    const shouldLeave = new Set<string>(jobNodes.map(node => node.id));
    const cachedNodes = getNodesByType('GreenhouseJobBoardJob');
    for (const node of cachedNodes) {
      if (node.boardToken !== boardToken) {
        continue;
      }
      if (!shouldLeave.has(node.id)) {
        actions.deleteNode(node);
      }
    }
  }
};
