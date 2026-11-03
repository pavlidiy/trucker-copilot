-- Broker letters and what the bot waits for next from the driver.

alter table drivers add column awaiting text;            -- null | letter_edit | broker_answer

alter table loads add column letter jsonb;               -- { kind, subject, body, translation } last draft
alter table loads add column claimed_cents integer;      -- detention asked from the broker
alter table loads add column recovered_cents integer;    -- what the broker agreed to pay
