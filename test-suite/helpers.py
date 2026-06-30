"""
helpers.py — the four capabilities every assertion needs.

1. fetch_text  — GET a URL, normalize HTML to searchable plain text
2. pdf_text    — fetch a PDF endpoint, extract text
3. db          — direct DB read (side-effect / sentinel checks)
4. contains / absent — assertion primitives over normalized text
"""

import io
import re
import requests
from bs4 import BeautifulSoup

TIMEOUT = 30


# --- 1. fetch + normalize -------------------------------------------------
def fetch_text(url: str, method: str = "GET", **kwargs) -> str:
    """Fetch a page and return normalized, tag-stripped, whitespace-collapsed text.

    Normalization is what makes assertions robust to legitimate markup
    differences between PHP and Next.js: <td>Acme</td> and
    <div class="cell">Acme</div> both yield '... Acme ...'.
    """
    resp = requests.request(method, url, timeout=TIMEOUT, **kwargs)
    resp.raise_for_status()
    return normalize(resp.text)


def fetch_raw(url: str, method: str = "GET", **kwargs) -> requests.Response:
    """When you need status / headers / redirects rather than body text."""
    return requests.request(
        method, url, timeout=TIMEOUT, allow_redirects=False, **kwargs
    )


def normalize(html: str) -> str:
    text = BeautifulSoup(html, "html.parser").get_text(separator=" ")
    return re.sub(r"\s+", " ", text).strip()


# --- 2. PDF text ----------------------------------------------------------
def pdf_text(url: str, method: str = "GET", **kwargs) -> str:
    """Fetch a PDF and return its extracted text (whitespace-normalized).

    Supports POST (method="POST", data=...) for endpoints that stream a PDF in
    response to a form submission — e.g. the legacy tax-receipt print flow,
    which takes $_POST['donorIds'][] rather than a GET id.
    """
    import pdfplumber

    resp = requests.request(method, url, timeout=TIMEOUT, **kwargs)
    resp.raise_for_status()
    out = []
    with pdfplumber.open(io.BytesIO(resp.content)) as pdf:
        for page in pdf.pages:
            out.append(page.extract_text() or "")
    return re.sub(r"\s+", " ", " ".join(out)).strip()


# --- 3. direct DB read ----------------------------------------------------
class DB:
    """Thin read-only DB accessor for side-effect/sentinel assertions.

    Swap the connect() body for your driver (pymysql / psycopg2). Keep it
    READ-ONLY in tests — the seed fixture owns all writes/resets.
    """

    def __init__(self, dsn: dict):
        self.dsn = dsn

    def connect(self):
        import pymysql  # or: import psycopg2

        return pymysql.connect(**self.dsn)

    def scalar(self, sql: str, params: tuple = ()):
        with self.connect() as conn, conn.cursor() as cur:
            cur.execute(sql, params)
            row = cur.fetchone()
            return row[0] if row else None

    def rows(self, sql: str, params: tuple = ()):
        with self.connect() as conn, conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchall()


# --- 4. assertion primitives ---------------------------------------------
def contains(text: str, *needles: str):
    for n in needles:
        assert n in text, f"expected to find {n!r} in page text"


def absent(text: str, *needles: str):
    for n in needles:
        assert n not in text, f"expected {n!r} to be ABSENT from page text"
