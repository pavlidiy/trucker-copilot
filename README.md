# Trucker Copilot

WhatsApp AI co-pilot for US truck drivers whose English is weak. It reads the rate con, tracks detention at the dock, writes to the broker in English, and explains the broker's answer in the driver's language. Built on Muse Spark (Meta Model API) and the WhatsApp Cloud API.

Unpaid detention costs US drivers $1.1–1.3B a year (DOT OIG, 2018). Immigrant drivers lose more: they sign rate cons they can't fully read, and they don't argue with brokers by email.

## What the driver does

1. **Sends a photo or PDF of the rate con.** Muse Spark extracts the terms into a strict JSON schema, with the exact quote and page for every clause. Code (not the model) decides what is risky: no guaranteed detention pay, late fees, lumper paid by the driver, no TONU, rate per mile. The driver gets the verdict in their language, with buttons to ask the broker for changes or to book.
2. **Shares location at the facility.** The bot logs arrival in the facility's time zone, says when free time ends, and pings the driver when it does, with a button to warn the broker. Sharing location again logs departure and computes detention per minute.
3. **Taps "Email broker".** Code computes minutes and dollars per stop. Muse Spark writes a short, firm English letter around those facts and retells it in the driver's language. The driver copies it into their email.
4. **Pastes or screenshots the broker's answer.** Muse Spark explains it in the driver's language: how much is offered, what documents are asked for. The driver accepts, asks for the full amount (Muse writes the counter), or answers in their own words. Accepted money is counted under "Money recovered".

17 languages: en, ru, uk, zh, hi, es, ar, fr, bn, pt, id, pa, uz, pl, ro, tr, ht. Only en and ru have had a native review so far.

## How Meta AI is used

| Task | Model call | What keeps it honest |
| --- | --- | --- |
| Read rate con (photo or multi-page PDF) | Muse Spark, image + file input, `json_schema` strict | Every clause carries a verbatim quote and page number; risk rules live in `src/domain/risks.ts` |
| Write broker letters (4 kinds) | Muse Spark, structured output `{subject, body, translation}` | All numbers are computed in code and passed as facts; the prompt forbids inventing any |
| Explain the broker's answer | Muse Spark, text or screenshot input, `reasoning_effort: minimal` | Returns the offered amount as a number, so the buttons show real money |

## Code

- `src/ai/`: Muse Spark calls (`muse.ts` is the shared Chat Completions + strict JSON helper)
- `src/domain/`: detention math, risk rules, time zones
- `src/bot/`: webhook server, router (one inbound message → replies), Supabase REST client, letter facts
- `src/ui/`, `src/wa/`, `src/i18n/`: screens, WhatsApp message builders with limits enforced, strings per language
- `supabase/migrations/`: Postgres schema (RLS on, service role only)
- `deploy/`: systemd units and setup for a home server behind a Cloudflare tunnel

```sh
npm ci
npm test                        # 21 tests: detention math, risk rules, UI limits in all languages, router flows
npm run preview -- --lang ru    # walk the demo scenario in the terminal, no keys needed
npm run try-ratecon             # read test/fixtures/ratecon-sample.pdf with Muse Spark (needs MUSE_API_KEY)
npm run try-letter -- es        # write a detention claim and read a broker answer
npm start                       # webhook server on :8787 (needs .env, see .env.example)
```
