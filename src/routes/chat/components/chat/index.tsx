import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-react';
import { useRef } from 'react';
import { useChats } from '../../chatsProvider';
import Splash from './splash';
import { useMediaQuery } from '@/hooks/use-media-query';

export default function Chat() {
  const form = useRef<HTMLFormElement>(null);
  const { room } = useChats();

  return (
    <div className="flex flex-col h-full w-full py-2">
      {/* Chats */}
      <div className="flex-grow overflow-y-auto overflow-x-clip w-full flex flex-col px-2">
        {room ? <>These are chats</> : <Splash />}
      </div>

      <Separator className="my-2" />

      {/* Chat Box */}
      <form className="min-h-10 max-h-10 md:max-h-40 flex w-full gap-2 px-2" ref={form}>
        <Textarea
          className="resize-none md:max-h-40 md:field-size-content"
          placeholder={`Type your message here ${useMediaQuery("(min-width: 468px)") ? "(Markdown is supported)" : ""}`}
          required
          minLength={3}
          maxLength={1024}
          onKeyDown={(e) => {
            if (e.key == 'Enter' && !e.shiftKey) {
              e.preventDefault();
              form.current?.submit();
            }
          }}
          disabled={!room}
        />
        <Button disabled={!room} type="submit" className='h-10 w-10 p-[0.6rem]'>
          <SendIcon className='h-8 w-8' />
        </Button>
      </form>
    </div>
  );
}
