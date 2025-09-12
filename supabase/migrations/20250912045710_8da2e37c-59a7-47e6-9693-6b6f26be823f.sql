-- Make phone column nullable in profiles table since it's not required during signup
ALTER TABLE public.profiles ALTER COLUMN phone DROP NOT NULL;