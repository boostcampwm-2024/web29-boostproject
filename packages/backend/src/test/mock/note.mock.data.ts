import { MockNote } from '../types/performance.types';

export const noteMockData: MockNote[] = [
  {
    id: 'c1ddbb14-689a-49ac-a2fc-a14aebb1c4ed',
    userId: 'test-user-id',
    name: 'test-name',
    content:
      'AoIB+Ia//AoABwDujav1AwAGAQD4hr/8CgAEhPiGv/wKBAPthYyB+Ia//AoFAoT4hr/8CgcG7Iqk7Yq4h+6Nq/UDAAMJcGFyYWdyYXBoBwD4hr/8CgoGAQD4hr/8CgsDgfiGv/wKCgEABIH4hr/8Cg8BgfiGv/wKDgKE+Ia//AoWA+yXhIH4hr/8ChcChPiGv/wKGQPssq2B+Ia//AoaA4T4hr/8Ch0H64KY6rKMIIH4hr/8CiAChPiGv/wKIgTquLQggfiGv/wKJASE+Ia//AooA+usuIH4hr/8CikChPiGv/wKKwPsnpCB+Ia//AosAYT4hr/8Ci0D7Je0gfiGv/wKLgGE+Ia//AovA...', // Base64 encoded content
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'a4ac29f1-0504-43f4-b087-f47cf99b8186',
    userId: 'test-user-id',
    name: 'test-name',
    content: 'Different base64 encoded content...',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
