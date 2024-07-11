'use client';

import { useCallback, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from '@/components/ui/button';
import { Command } from '@tauri-apps/api/shell';
import { Textarea } from '@/components/ui/textarea';

export const MyCustomCommand = () => {
  const [data, setData] = useState('');

  const onClickHandler = useCallback(() => {
    invoke('my_custom_command');
  }, []);

  const onClickHandler2 = useCallback(async () => {
    try {
      const output = await new Command('run-emulator', ['help']).execute();

      console.log(output);
      setData(output.stdout);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      <Button onClick={onClickHandler}>Custom command</Button>
      <Button onClick={onClickHandler2}>Custom command 2</Button>

      <Textarea value={data} rows={10} />
    </>
  );
};
