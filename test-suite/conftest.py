"""
conftest.py — config loading + shared fixtures.

CONFIG LOADING (top of file, runs before test collection):
We load test-suite/.env into the environment HERE, at module top level.
This matters because routes.py binds TARGET / BASE_URL at *import* time —
pytest imports conftest.py before any test module (and thus before routes.py
is imported by the tests), so loading .env here guarantees those values are
present in time. A loader inside a fixture would run too late.

The key fixture is `reset_seed` (autouse): it restores the database to a fixed
known state before each test, so results are identical and order-independent
across all stacks. Reset happens at the DB layer (raw seed.sql), bypassing
whatever ORM a migrated stack generated — keeping the reset mechanism truly
constant across PHP, Next.js, and (manually) Blazor.
"""

import os
import subprocess
import pytest

# --- load .env BEFORE anything reads the environment ----------------------
# override=False: a real shell env var (e.g. TARGET=nextjs pytest) wins over .env,
# so you can override per-run without editing the file.
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"), override=False)

from helpers import DB  # imported after load_dotenv (DB itself reads no env at import)

# --- centralized config (single source of truth) -------------------------
DSN = {
    "host": os.environ.get("DB_HOST", "127.0.0.1"),
    "port": int(os.environ.get("DB_PORT", "3306")),
    "user": os.environ.get("DB_USER", "root"),
    "password": os.environ.get("DB_PASSWORD", ""),
    "database": os.environ.get("DB_NAME", "silent_auction"),
}

SEED_PATH = os.environ.get(
    "SEED_PATH",
    "../plan/phase1/data-model-documentation/seed.sql",
)


@pytest.fixture(autouse=True)
def reset_seed():
    """Restore the fixed seed before each test. Stack-agnostic (DB layer)."""
    _restore_seed()
    yield
    # no teardown needed — next test re-restores


def _restore_seed():
    # MySQL example; swap for psql if Postgres.
    cmd = [
        "mysql",
        f"-h{DSN['host']}",
        f"-P{DSN['port']}",
        f"-u{DSN['user']}",
    ]
    if DSN["password"]:
        cmd.append(f"-p{DSN['password']}")
    cmd.append(DSN["database"])
    with open(SEED_PATH, "rb") as f:
        subprocess.run(cmd, stdin=f, check=True)


@pytest.fixture
def db():
    return DB(DSN)
