-- Add icon and icon_color columns to payment_methods table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payment_methods' AND column_name = 'icon'
  ) THEN
    ALTER TABLE payment_methods ADD COLUMN icon VARCHAR(50) DEFAULT 'Wallet';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'payment_methods' AND column_name = 'icon_color'
  ) THEN
    ALTER TABLE payment_methods ADD COLUMN icon_color VARCHAR(7) DEFAULT '#6B7280';
  END IF;
END $$;

-- Update existing payment methods with appropriate icons and colors
UPDATE payment_methods SET icon = 'Banknote', icon_color = '#10B981' WHERE UPPER(name) = 'EFECTIVO' AND icon = 'Wallet';
UPDATE payment_methods SET icon = 'ArrowLeftRight', icon_color = '#3B82F6' WHERE UPPER(name) = 'TRANSFERENCIA' AND icon = 'Wallet';
UPDATE payment_methods SET icon = 'CreditCard', icon_color = '#6366F1' WHERE UPPER(name) = 'DEBITO' AND icon = 'Wallet';
UPDATE payment_methods SET icon = 'CreditCard', icon_color = '#1E40AF' WHERE UPPER(name) = 'CREDITO VISA' AND icon = 'Wallet';
UPDATE payment_methods SET icon = 'CreditCard', icon_color = '#DC2626' WHERE UPPER(name) = 'CREDITO MASTER' AND icon = 'Wallet';
UPDATE payment_methods SET icon = 'Smartphone', icon_color = '#FBBF24' WHERE UPPER(name) = 'MERCADO PAGO' AND icon = 'Wallet';
UPDATE payment_methods SET icon = 'Wallet', icon_color = '#8B5CF6' WHERE UPPER(name) = 'OTROS' AND icon = 'Wallet';
UPDATE payment_methods SET icon = 'CreditCard', icon_color = '#1E40AF' WHERE UPPER(name) LIKE '%VISA%' AND UPPER(name) != 'CREDITO VISA' AND icon = 'Wallet';
