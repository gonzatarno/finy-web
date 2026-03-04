-- Add icon and icon_color columns to payment_methods table if they don't exist
ALTER TABLE payment_methods
ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT 'Wallet',
ADD COLUMN IF NOT EXISTS icon_color VARCHAR(7) DEFAULT '#6B7280';

-- Update existing payment methods with appropriate icons and colors
UPDATE payment_methods
SET icon = 'Banknote', icon_color = '#10B981'
WHERE UPPER(name) = 'EFECTIVO';

UPDATE payment_methods
SET icon = 'ArrowLeftRight', icon_color = '#3B82F6'
WHERE UPPER(name) = 'TRANSFERENCIA';

UPDATE payment_methods
SET icon = 'CreditCard', icon_color = '#6366F1'
WHERE UPPER(name) = 'DEBITO';

UPDATE payment_methods
SET icon = 'CreditCard', icon_color = '#1E40AF'
WHERE UPPER(name) = 'CREDITO VISA';

UPDATE payment_methods
SET icon = 'CreditCard', icon_color = '#DC2626'
WHERE UPPER(name) = 'CREDITO MASTER';

UPDATE payment_methods
SET icon = 'Smartphone', icon_color = '#FBBF24'
WHERE UPPER(name) = 'MERCADO PAGO';

UPDATE payment_methods
SET icon = 'Wallet', icon_color = '#8B5CF6'
WHERE UPPER(name) = 'OTROS';

UPDATE payment_methods
SET icon = 'CreditCard', icon_color = '#1E40AF'
WHERE UPPER(name) LIKE '%VISA%' AND icon IS NULL;
