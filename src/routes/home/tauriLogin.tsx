import { useEffect, useTransition } from "react"

const delay = (ms: number) => new Promise((r) => setTimeout(() => r(null), ms));

export default function TauriLogin() {
  const [processing, start] = useTransition();

  useEffect(() => {
    start(async () => {
      await delay(5000);
    });
  }, []);

  return <div className="w-full h-full flex flex-col text-center items-center justify-center">
    {
      processing ?
        <>
          <img src="/favicon.png" className='rounded-full w-32 h-32' />
          <h1 className="absolute mt-[12rem] text-lg font-bold">Getting ready</h1>
        </>
        : <>Login</>
    }
  </div>
}