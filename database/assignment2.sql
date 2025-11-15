-- Insert new record to the account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES
('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Update record from the account table
UPDATE public.account
SET
    account_type = 'Admin'
WHERE
    account_id = 1;

-- Delete record from the account table
DELETE FROM public.account
WHERE
    account_id = 1;

-- Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors" using a single query.
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors','a huge interior')
WHERE inv_id = 10;

-- Inner join to select the make, model and classification_name from invertory and classification tables
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Update all records in the inventory table to add "/vehicles" to the middle of the file path in the inv_image and inv_thumbnail columns
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/','/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/','/images/vehicles/');