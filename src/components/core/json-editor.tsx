'use client';

import dynamic from 'next/dynamic'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { openFile } from '@/utils/open-file';
// import { JsonForms } from '@jsonforms/react';
import { JsonSchema } from '@jsonforms/core';
import { resolveResource } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/api/fs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

const JsonForms = dynamic(
  () => import('@jsonforms/react').then(mod => mod.JsonForms),
  { ssr: false }
);

// const uiSchema = {
//   type: 'ListWithDetail',
//   scope: '#/properties/mappings',
//   options: {
//     detail: {
//       type: 'VerticalLayout',
//       elements: [
//         {
//           type: 'Control',
//           scope: '#/properties/response/properties/jsonBody/properties/cardNumber',
//           label: 'cardNumber'
//         },
//       ]
//     }
//   }
// };

const uiSchema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/mappings',
      options: {
        detail: {
          type: 'VerticalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/response/properties/jsonBody/properties/cardNumber',
              label: 'cardNumber'
            },
          ]
        }
      }
    }
  ]
}

const renderers = [
  ...materialRenderers,
]

const SCHEMA_PATH = 'data/schema.json';

const useGetResourceData = (path: string): JsonSchema | undefined => {
  const [data, setData] = useState<JsonSchema | undefined>()

  useMemo(async (): Promise<void> => {
    try {
      const resourcePath = await resolveResource(path)
      const content = JSON.parse(await readTextFile(resourcePath));

      setData(content);
    } catch (err) {
      console.log(err)
      setData(undefined);
    }
  }, [path]);

  return data;
}

export const JsonEditor = () => {
  const schema = useGetResourceData(SCHEMA_PATH);

  const [errors, setErrors] = useState<any>();
  const [fileContent, setFileContent] = useState<any>();
  const onOpenHandler = useCallback(async () => {
    try {
      const contents = await openFile();

      if (contents) setFileContent(JSON.parse(contents));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (schema) console.log({ uiSchema })
  }, [schema])

  console.log(fileContent)

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 w-full items-stretch gap-2">
        <Button onClick={onOpenHandler}>Open file</Button>
        <Button disabled>Save</Button>
      </div>
      <div className={'py-4'} />

      <div>
        {fileContent && schema && <JsonForms
          schema={schema}
          uischema={uiSchema}
          data={fileContent}
          renderers={renderers}
          cells={materialCells}
          onChange={({ data, errors }) => {
            setFileContent(data);
            setErrors(errors);
            console.log(data, errors)
          }}
        />}
      </div>

      {/*<div className={'grid grid-cols-2 gap-4'}>*/}
      {/*  <div className="grid w-full max-w-sm items-center gap-1.5">*/}
      {/*    <Label htmlFor="card_number">Card number</Label>*/}
      {/*    <Input type="card_number" id="card_number" placeholder="Card number" />*/}
      {/*  </div>*/}

      {/*  <div className="grid w-full max-w-sm items-center gap-1.5">*/}
      {/*    <Label htmlFor="plasticID">Plastic ID</Label>*/}
      {/*    <Input type="plasticID" id="plasticID" placeholder="Plastic ID" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      {errors?.length > 0 && <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {errors.map((item: any, index: number) => {
            return <div key={index}>{item?.message}</div>
          })}
        </AlertDescription>
      </Alert>}
    </div>
  );
};
