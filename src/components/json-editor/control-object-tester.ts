import { and, rankWith } from '@jsonforms/core';
import { schemaTypeIs, uiTypeIs } from '@jsonforms/core/src/testers/testers';

export default rankWith(
  3, //increase rank as needed
  and(uiTypeIs('Control'), schemaTypeIs('object'))
);
