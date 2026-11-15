# Recommendation and model plan

## Baseline and candidates

Create a versioned catalog and precomputed popularity list using training data only. MVP scores all 1,000 eligible items with a vectorized batch; this is intentionally bounded. Larger catalogs require a measured candidate retrieval design. Filter unavailable items before scoring and break ties by item_id.

Train a logistic regression baseline using user aggregates, item popularity, category match from category_affinity_1h, and item category encoding. Save the exact feature order, normalization, catalog mapping, training cutoff, dependency versions, seed, and metrics with the artifact. Serving validates these before loading.

## Training examples

Generate explicit synthetic impression records with request_id, user_id, item_id, shown_at, and position. An impression is positive if a linked click, play, or purchase occurs within 30 minutes; otherwise negative only after that label window closes. Do not treat unexposed catalog items as observed negatives. Generator actions link to impressions through an optional impression_id added in M1's schema.

Use temporal train/validation/test splits with a 30-minute purge gap between partitions. Fit encoders and normalization only on training. Feature joins require as_of <= shown_at AND available_at <= shown_at; use online_available_at when evaluating observed serving state. Select the latest eligible revision and exclude the outcome event from its own features. Recomputed event-time history alone cannot establish historical availability.

## Evaluation and promotion

Compare popularity and learned model on the same held-out impression candidate groups. Report NDCG@10, Recall@10, catalog coverage, fallback rate, sample counts, and user-level bootstrap confidence intervals. Report ranking metrics only for groups with positive labels and disclose the number excluded. Separately report all-negative groups and classification calibration.

Promotion requires schema compatibility, finite bounded scores, no serving latency regression, reproducible artifacts, and improved held-out NDCG@10 with uncertainty disclosed. Synthetic quality does not establish real-world value. If improvement fails, retain fallback and diagnose; do not tune on the test set or invent success.

Use immutable model directories and an explicit active-version pointer. Load a replacement fully and validate before atomically swapping; preserve the last good version. Local artifact hashes protect integrity, but never load untrusted pickle/joblib artifacts.
