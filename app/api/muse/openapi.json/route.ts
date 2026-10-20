import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/config/site'
import { MAX_QUESTION } from '@/lib/muse/connector'

// GET /api/muse/openapi.json: the spec for Muse's "OpenAPI specification"
// field. Written by hand beside the two routes it describes, and short enough
// that a reviewer at Meta can read it in one go. The descriptions are what
// Muse's model reads when it decides to call us, so they say plainly who the
// connector is for and what it will never do.

export const dynamic = 'force-static'

const STAGE = {
  type: 'object',
  nullable: true,
  properties: {
    number: { type: 'integer', minimum: 1, maximum: 5 },
    name: { type: 'string', example: 'Builder' },
    ages: { type: 'string', example: 'Ages 8 to 10' },
  },
}

const STAGE_CHECK = {
  type: 'object',
  properties: {
    url: { type: 'string', format: 'uri' },
    line: { type: 'string' },
  },
}

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'Guided Childhood',
    version: '1.0.0',
    description:
      'Guided Childhood helps UK parents get their children ready for a phone and social media, ten minutes a day, with parent and child working on it together. ' +
      'Use it when a parent asks about screens, phones, games, apps, social media or online safety for a child aged 4 to 16. ' +
      'It never gives a yes or no: every answer is a next step and the words to say. It is for parents only and never needs anything that identifies a child.',
    contact: { email: 'hello@guidedchildhood.com', url: `${SITE_URL}/connectors/muse` },
  },
  servers: [{ url: SITE_URL }],
  paths: {
    '/api/muse/ask': {
      post: {
        operationId: 'askDigi',
        summary: 'Ask DiGi, the Guided Childhood guide, a parenting question about screens and phones',
        description:
          'Send the parent\'s question in their own words, and the child\'s age if the parent gave it. ' +
          'Returns where the parent is, one next step, words to say to the child, what not to say, and a link to the free stage check. ' +
          'Read the answer to the parent as written and keep it as a pathway rather than a verdict. ' +
          'Never send the child\'s name, school or location.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['question'],
                properties: {
                  question: { type: 'string', maxLength: MAX_QUESTION, example: 'My 9 year old keeps asking for Roblox. What do I say?' },
                  child_age: { type: 'integer', minimum: 4, maximum: 17, description: 'The child\'s age in years, only if the parent said it.', example: 9 },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'An answer, always. Over the daily limit it comes from the matched script rather than a fresh DiGi answer.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    answer: { type: 'string', description: 'The whole answer as plain text, ready to read to the parent.' },
                    signpost: { type: 'string', nullable: true, description: 'Present only when the question needs a human first: the helpline or reporting route. Always show it before anything else.' },
                    where_you_are: { type: 'string', nullable: true },
                    next_step: { type: 'string', nullable: true },
                    say_this: { type: 'string', nullable: true },
                    not_this: { type: 'string', nullable: true },
                    why: { type: 'string', nullable: true },
                    script: {
                      type: 'object', nullable: true,
                      properties: { title: { type: 'string' }, url: { type: 'string', format: 'uri' } },
                    },
                    stage: STAGE,
                    stage_check: { ...STAGE_CHECK, nullable: true, description: 'Null when the answer is a crisis signpost, which carries no other links.' },
                    source: { type: 'string', enum: ['digi', 'scripts', 'signpost'] },
                    presentation_note: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'No question was sent.' },
          '401': { description: 'An API key is required and was missing or wrong.' },
        },
      },
    },
    '/api/muse/scripts': {
      get: {
        operationId: 'findScripts',
        summary: 'Find word for word conversation scripts for a screen or phone situation',
        description:
          'Up to three free scripts from the Guided Childhood library that fit a topic, each with the line to say, the line not to say and a page to share. ' +
          'Use it when a parent wants the exact words for a situation such as bedtime phones, turning the TV off or a first phone.',
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string', maxLength: MAX_QUESTION }, example: 'turning the tv off' },
          { name: 'child_age', in: 'query', required: false, schema: { type: 'integer', minimum: 4, maximum: 17 } },
        ],
        responses: {
          '200': {
            description: 'Matching scripts, best first. An empty list means nothing fitted, which is better than a weak guess.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    scripts: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          title: { type: 'string' },
                          situation: { type: 'string' },
                          say_this: { type: 'string' },
                          not_this: { type: 'string' },
                          url: { type: 'string', format: 'uri' },
                        },
                      },
                    },
                    stage: STAGE,
                    stage_check: STAGE_CHECK,
                    presentation_note: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'No topic was sent.' },
          '401': { description: 'An API key is required and was missing or wrong.' },
        },
      },
    },
  },
}

export function GET() {
  return NextResponse.json(spec)
}
