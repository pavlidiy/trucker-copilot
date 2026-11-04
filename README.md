# Trucker Copilot

WhatsApp AI co-pilot for US truck drivers whose English is weak. It reads the rate con, tracks detention at the dock, writes to the broker in English, and explains the broker's answer in the driver's language. Built on Muse Spark and Muse Voice Transcribe (Meta Model API) and the WhatsApp Cloud API.

**Before vs. this hackathon.** Before: I had Truck Driver Helper, my profit-calculator app for US truckers (iOS/Android). It is not in this repo and not part of the submission. Built during the hackathon (Oct 26 – Nov 4, 2026), from zero: everything in this repo.

## Try it live on WhatsApp

**[Open the bot: wa.me/18329253256](https://wa.me/18329253256?text=Hi)** (or message **+1 832 925 3256** on WhatsApp)

1. Send `Hi` and pick a language.
2. Send a photo or PDF of a rate con (sample: [`test/fixtures/ratecon-sample.pdf`](test/fixtures/ratecon-sample.pdf)) and tap **Ask for changes**.
3. Share your location ("I'm at the facility"), then share it again later ("I left") to get detention in dollars, and tap **Email broker**.
4. Paste a broker reply, for example `Hi, we can pay $100 detention, please send the signed BOL with in/out times.` and tap **Accept $100**.

You can also send a voice note in any language, like "I arrived at the facility". Demo video: https://youtu.be/I-_qmbcroR0

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
| Understand voice notes in any language | Muse Voice Transcribe over the realtime WebSocket (OGG/Opus → PCM16 24 kHz via ffmpeg), then Muse Spark picks one bot action from a strict enum | The model only chooses an intent; the bot runs the same coded flow as the buttons |
| Explain the broker's answer | Muse Spark, text or screenshot input, `reasoning_effort: minimal` | Returns the offered amount as a number, so the buttons show real money |

## Code

- `src/ai/`: Muse Spark calls (`muse.ts` is the shared Chat Completions + strict JSON helper), `voice.ts` for Muse Voice Transcribe, `intent.ts` for free text and voice
- `src/domain/`: detention math, risk rules, time zones
- `src/bot/`: webhook server, router (one inbound message → replies), Supabase REST client, letter facts
- `src/ui/`, `src/wa/`, `src/i18n/`: screens, WhatsApp message builders with limits enforced, strings per language
- `supabase/migrations/`: Postgres schema (RLS on, service role only)
- `deploy/`: systemd units and setup for a home server behind a Cloudflare tunnel

```sh
npm ci
npm test                        # 22 tests: detention math, risk rules, UI limits in all languages, router flows
npm run preview -- --lang ru    # walk the demo scenario in the terminal, no keys needed
npm run try-ratecon             # read test/fixtures/ratecon-sample.pdf with Muse Spark (needs MUSE_API_KEY)
npm run try-letter -- es        # write a detention claim and read a broker answer
npm run try-voice -- note.ogg   # transcribe a voice note with Muse Voice Transcribe, then route it with Muse Spark
npm start                       # webhook server on :8787 (needs .env, see .env.example)
```
