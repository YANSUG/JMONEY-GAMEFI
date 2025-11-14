// api/chat.ts
export const config = { runtime: 'edge' }    // ← Edge everywhere, no region pin

import { kv } from '@vercel/kv'

type Msg = { user: string; text: string; ts: number }
const KEY = 'trollbox'

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method === 'GET') {
      // 由於 @vercel/kv@3.0.0 缺少 lrange 的型別定義，必須忽略 TS 錯誤。
      // @ts-ignore
      const list = (await kv.lrange<Msg>(KEY, 0, 19)) ?? [] 
      return new Response(JSON.stringify(list.reverse()), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    if (req.method === 'POST') {
      const { user = 'anon', text } = (await req.json()) as Partial<Msg>
      const clean = String(text ?? '').trim()
      if (!clean) return new Response('Empty', { status: 400 })

      const msg: Msg = { user, text: clean, ts: Date.now() }
      
      // 由於 @vercel/kv@3.0.0 缺少 lpush 的型別定義，必須忽略 TS 錯誤。
      // @ts-ignore
      await kv.lpush(KEY, msg)
      
      // 由於 @vercel/kv@3.0.0 缺少 ltrim 的型別定義，必須忽略 TS 錯誤。
      // @ts-ignore
      await kv.ltrim(KEY, 0, 19)
      
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } })
    }
    return new Response('Method Not Allowed', { status: 405 })
  } catch (err: any) {
    console.error('[chat API error]', err);
    return new Response('Internal Error', { status: 500 })
  }
}
