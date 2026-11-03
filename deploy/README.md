# Running the bot on the home server

1. `cp .env.example .env && chmod 600 .env`, then fill in the secrets.
2. `npm ci && npm test`
3. Copy both units to `~/.config/systemd/user/`, then:
   `systemctl --user daemon-reload && systemctl --user enable --now trucker-copilot ngrok`
   and once: `sudo loginctl enable-linger $USER` so they survive logout and reboot.
4. Check: `curl https://$NGROK_DOMAIN/health` answers `ok`.
5. Meta app → WhatsApp → Configuration → Webhook: callback `https://$NGROK_DOMAIN/webhook`,
   verify token = `WA_VERIFY_TOKEN` from `.env`, subscribe to the `messages` field.

Logs: `journalctl --user -u trucker-copilot -f`
