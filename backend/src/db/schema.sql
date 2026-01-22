-- Rassidi Database Schema
-- رصيدي - رصيدك ما يضيعش

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100),
  language VARCHAR(2) DEFAULT 'ar' CHECK (language IN ('ar', 'fr')),
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP,
  biometric_enabled BOOLEAN DEFAULT FALSE,
  totp_secret VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Customers (hanout owner's customers)
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  -- For offline sync
  local_id VARCHAR(50),
  last_synced_at TIMESTAMP
);

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_deleted_at ON customers(deleted_at);

-- Debts
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  note TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  paid_via VARCHAR(20) CHECK (paid_via IN ('customer', 'sadaqa', 'partial')),
  sadaqa_donor_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  -- For offline sync
  local_id VARCHAR(50),
  last_synced_at TIMESTAMP
);

CREATE INDEX idx_debts_customer_id ON debts(customer_id);
CREATE INDEX idx_debts_user_id ON debts(user_id);
CREATE INDEX idx_debts_is_paid ON debts(is_paid);
CREATE INDEX idx_debts_created_at ON debts(created_at);

-- Sadaqa queue (FIFO - oldest debts first)
CREATE TABLE sadaqa_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debt_id UUID UNIQUE NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_remaining DECIMAL(10,2) NOT NULL,
  is_eligible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sadaqa_queue_eligible ON sadaqa_queue(is_eligible, created_at);

-- Sadaqa donations history
CREATE TABLE sadaqa_donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES users(id),
  debt_id UUID NOT NULL REFERENCES debts(id),
  amount DECIMAL(10,2) NOT NULL,
  is_anonymous BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sadaqa_donations_donor ON sadaqa_donations(donor_id);

-- Sync log for offline-first
CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(10) NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  data JSONB,
  synced_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sync_log_user_synced ON sync_log(user_id, synced_at);

-- Chat history for AI support
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_user ON chat_messages(user_id, created_at);

-- WhatsApp reminders log
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  debt_id UUID REFERENCES debts(id),
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent'
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER debts_updated_at BEFORE UPDATE ON debts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
