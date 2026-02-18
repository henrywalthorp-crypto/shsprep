-- Subscription and payment tracking
ALTER TABLE profiles ADD COLUMN subscription_status VARCHAR(20);
ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN subscription_plan VARCHAR(20);
ALTER TABLE profiles ADD COLUMN subscription_ends_at TIMESTAMPTZ;

-- Payment history
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  amount INT NOT NULL, -- cents
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(20) NOT NULL, -- succeeded, failed, refunded
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payment_history
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Service can insert payments" ON payment_history
  FOR INSERT WITH CHECK (true); -- service_role only in practice

CREATE INDEX idx_payment_history_profile ON payment_history(profile_id);
CREATE INDEX idx_payment_history_stripe ON payment_history(stripe_payment_intent_id);
