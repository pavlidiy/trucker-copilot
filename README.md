# trucker-copilot
WhatsApp AI co-pilot for truck drivers — reads rate cons, tracks detention, emails brokers. Built with Muse Spark on Meta Model API.

## Bot interface

Menu variant C: under each reply the driver gets up to two buttons for the next step of the load, plus "☰ Menu" (a six-row list). Each screen in the spec is a function in `src/ui/screens.ts` that returns WhatsApp Cloud API message payloads.

- `src/wa/`: builders for WhatsApp messages (buttons, lists, CTA, location request), with limits enforced
- `src/ui/`: screens, button ids, which buttons show at each load stage
- `src/i18n/`: every string the driver sees, one file per language
- `src/domain/`: detention math and the data the screens render

```sh
npm install
npm run preview -- --lang ru        # walk the demo scenario in the terminal
npm run preview -- --lang en --json # raw API payloads
npm test
```
