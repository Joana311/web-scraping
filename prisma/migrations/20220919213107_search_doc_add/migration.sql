-- AlterTable
ALTER TABLE "Exercise"
ADD COLUMN "document" TSVECTOR GENERATED ALWAYS AS (
        setweight(
            to_tsvector('simple', COALESCE(name, '')),
            'A'
        ) || setweight(
            to_tsvector('simple', COALESCE("equipment_name", '')),
            'C'
        ) || setweight(
            to_tsvector('simple', COALESCE(force, '')),
            'B'
        ) || setweight(
            to_tsvector('english', COALESCE(force, '')),
            'B'
        )
    ) STORED;
-- CreateIndex
CREATE INDEX "document_idx" on "Exercise" using GIN("document");
-- CreateFunction
CREATE OR REPLACE FUNCTION search_exercises(search_term text) returns setof "Exercise" as $$
DECLARE foo tsquery;
BEGIN foo := websearch_to_tsquery('simple', search_term);
RETURN QUERY
SELECT *
FROM "Exercise"
WHERE foo @@ document
ORDER BY ts_rank("document", foo) DESC;
END;
$$ language plpgsql;