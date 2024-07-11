import Greet from './greet';
import { JsonEditor } from '@/components/core/json-editor';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Greet />
      {/* <MyCustomCommand />  */}
      <JsonEditor />
    </main>
  );
}
