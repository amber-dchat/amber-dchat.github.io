import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-react';
import { useRef } from 'react';

export default function Chat() {
  const form = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col h-full w-full py-2">
      {/* Chats */}
      <div className="flex-grow overflow-y-auto overflow-x-clip w-full px-2">
        These are chats
      </div>

      <Separator className="my-2" />

      {/* Chat Box */}
      <form className="min-h-10 max-h-10 md:max-h-40 flex w-full gap-2 px-2" ref={form}>
        <Textarea
          className="resize-none md:max-h-40 md:field-size-content"
          placeholder="Type your message here (Markdown is supported)"
          required
          minLength={3}
          maxLength={1024}
          onKeyDown={(e) => {
            if (e.key == 'Enter' && !e.shiftKey) {
              e.preventDefault();
              form.current?.submit();
            }
          }}
        />
        <Button>
          <SendIcon />
        </Button>
      </form>
    </div>
  );
}
