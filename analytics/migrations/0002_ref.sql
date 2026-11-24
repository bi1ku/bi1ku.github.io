-- ?ref= (or utm_source) tag from the landing URL, e.g. bi1ku.github.io/?ref=linkedin
ALTER TABLE visits ADD COLUMN ref TEXT;
CREATE INDEX visits_ref ON visits(ref);
