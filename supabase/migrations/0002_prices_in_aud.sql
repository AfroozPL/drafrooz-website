-- Switch consultation prices to Australian dollars (same amounts:
-- A$150 / A$350 / A$600) so clients pay, and payouts arrive, in AUD.
update public.services set currency = 'AUD' where currency = 'USD';

alter table public.services alter column currency set default 'AUD';
