import { MockSpace } from '../types/performance.types';

export const spaceMockData: MockSpace[] = [
  {
    id: '69bd78b6-0755-4370-be44-3ab0adab011a',
    userId: 'test-user-id',
    name: 'test',
    edges: JSON.stringify({
      u7c2xras28c: {
        from: '69bd78b6-0755-4370-be44-3ab0adab011a',
        to: '65ol60chol8',
      },
      an5uhqliqpm: {
        from: '69bd78b6-0755-4370-be44-3ab0adab011a',
        to: 'ousnj3faubc',
      },
    }),
    nodes: JSON.stringify({
      '69bd78b6-0755-4370-be44-3ab0adab011a': {
        id: '69bd78b6-0755-4370-be44-3ab0adab011a',
        x: 0,
        y: 0,
        type: 'head',
        name: 'test space',
        src: '69bd78b6-0755-4370-be44-3ab0adab011a',
      },
      '65ol60chol8': {
        id: '65ol60chol8',
        type: 'note',
        x: 283.50182393227146,
        y: -132.99774870089817,
        name: 'note',
        src: 'c1ddbb14-689a-49ac-a2fc-a14aebb1c4ed',
      },
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
