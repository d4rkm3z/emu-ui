import { open } from '@tauri-apps/api/dialog';
import { readTextFile } from '@tauri-apps/api/fs';

export const openFile = async () => {
  try {
    const filePath = await open({
      multiple: false,
      filters: [
        {
          name: 'pos-health#Get-OK',
          extensions: ['json'],
        },
      ],
    }) ?? '';

    if (Array.isArray(filePath)) {
      throw new Error('Incorrect path');
    }

    return await readTextFile(filePath);
  } catch (err) {
    console.error(err);
  }
}
