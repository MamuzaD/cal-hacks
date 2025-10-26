#!/usr/bin/env python3
"""
Simple scraper for QuiverQuant politician pages.

Usage:
  python scrape_quiver.py --input path/to/input.csv --output path/to/output.csv

Input CSV should contain at least a Name column and a Bioguide ID column. The script will try to detect common Bioguide column names: 'Bioguide', 'bioguide', 'bioguide_id', 'bioguideId'.

Output CSV will have columns: Name, Net Worth Est., Last Traded

Notes:
 - This scraper uses simple HTML heuristics and may need adjustment if QuiverQuant changes their markup.
 - Be respectful of site terms and rate limits; the script sleeps between requests.
"""

from __future__ import annotations

import argparse
import logging
import re
import time
from typing import Optional, Dict, Tuple
from urllib.parse import quote

import pandas as pd
import requests
from bs4 import BeautifulSoup


USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)


def fetch_quiver_info(name: str, bioguide: str, session: requests.Session, timeout: int = 15) -> tuple[Optional[str], Optional[str]]:
    """Fetch Net Worth Est. and Last Traded for a politician.

    Returns (net_worth_str, last_traded_str) or (None, None) on failure.
    """
    quoted_name = quote(name)
    url = f"https://www.quiverquant.com/congresstrading/politician/{quoted_name}-{bioguide}"
    logging.debug("Fetching %s", url)
    try:
        r = session.get(url, headers={"User-Agent": USER_AGENT}, timeout=timeout)
        r.raise_for_status()
    except Exception as e:
        logging.warning("Request failed for %s: %s", url, e)
        return None, None

    soup = BeautifulSoup(r.text, "html.parser")

    def _get_after_label(regex: str) -> Optional[str]:
        # Find a text node that matches the label, then try to find the nearby value.
        label_node = soup.find(text=re.compile(regex, re.I))
        if not label_node:
            return None

        # Common patterns: label in one element and value in sibling or next element
        parent = label_node.parent
        # Look for immediate sibling elements with text
        for sib in parent.next_siblings:
            if getattr(sib, 'get_text', None):
                txt = sib.get_text(strip=True)
                if txt:
                    return txt
            elif isinstance(sib, str):
                s = sib.strip()
                if s:
                    return s

        # Sometimes value is inside the same parent element but in a <span> or <div>
        val = parent.find_next(text=True)
        if val:
            text = val.strip()
            if text:
                return text

        # As a last resort, search for nearby dollar amounts or dates in the entire page
        return None

    net = _get_after_label(r"Net Worth Est|Net Worth")
    last = _get_after_label(r"Last Traded|Last Trade|Last Trade Date")

    # Heuristics: if net is None, try to find the first $XXXX pattern near the top
    if not net:
        top_text = soup.get_text(separator="\n")[:4000]
        m = re.search(r"\$[0-9,]+(?:\.[0-9]{2})?", top_text)
        if m:
            net = m.group(0)

    # Normalize whitespace
    if net:
        net = net.replace('\n', ' ').strip()
    if last:
        last = last.replace('\n', ' ').strip()

    return net, last


def detect_bioguide_col(df: pd.DataFrame) -> Optional[str]:
    candidates = ["Bioguide", "bioguide", "bioguide_id", "bioguideId", "BIOGUIDE"]
    for c in candidates:
        if c in df.columns:
            return c
    # Try heuristics: a column with values matching the Bioguide pattern (letter + digits)
    for col in df.columns:
        sample = df[col].astype(str).dropna().head(20).tolist()
        if all(re.match(r"[A-Za-z]\d+", s) for s in sample if s):
            return col
    return None


def main():
    parser = argparse.ArgumentParser(description="Scrape QuiverQuant politician pages for Net Worth and Last Traded")
    parser.add_argument("--input", "-i", required=True, help="Input CSV path (must contain Name and Bioguide columns)")
    parser.add_argument("--output", "-o", default="quiver_politician_networth.csv", help="Output CSV path")
    parser.add_argument("--delay", "-d", type=float, default=1.0, help="Delay (seconds) between requests")
    parser.add_argument("--max", type=int, default=0, help="Max rows to process (0 = all)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose logging")
    args = parser.parse_args()

    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO, format="%(levelname)s: %(message)s")

    df = pd.read_csv(args.input)
    if "Name" not in df.columns:
        # Try some common alternatives
        name_cols = [c for c in df.columns if c.lower() in ("name", "full_name", "politician")]
        if name_cols:
            df = df.rename(columns={name_cols[0]: "Name"})
        else:
            logging.error("No Name column found in input CSV")
            return

    bioguide_col = detect_bioguide_col(df)
    if not bioguide_col:
        logging.error("Could not detect a Bioguide column. Please include a Bioguide ID column (e.g. 'P000197').")
        return
    if bioguide_col != "Bioguide":
        df = df.rename(columns={bioguide_col: "Bioguide"})

    out_rows = []
    session = requests.Session()

    total_rows = len(df) if args.max == 0 else min(len(df), args.max)
    logging.info("Processing %d rows (deduping fetches by Bioguide)", total_rows)

    subset = df.head(total_rows)

    # Build unique Bioguide list (trimmed) and preserve order
    bioguide_series = subset["Bioguide"].astype(str).str.strip()
    unique_biogs = []
    seen = set()
    for v in bioguide_series.tolist():
        if not v:
            continue
        if v not in seen:
            seen.add(v)
            unique_biogs.append(v)

    logging.info("Unique Bioguide count: %d", len(unique_biogs))

    # Fetch once per unique Bioguide and cache results
    cache: Dict[str, Tuple[str, str]] = {}
    for bg in unique_biogs:
        # pick a representative name for the Bioguide (first match)
        rep = subset[bioguide_series == bg]
        if rep.empty:
            name = ""
        else:
            name = str(rep.iloc[0].get("Name", "")).strip()

        if not name:
            logging.info("Skipping fetch for Bioguide %s: no name found", bg)
            cache[bg] = ("", "")
            continue

        net, last = fetch_quiver_info(name, bg, session)
        logging.info("Fetched %s (%s): Net=%s  Last=%s", name, bg, net, last)
        cache[bg] = (net or "", last or "")
        time.sleep(args.delay)

    # Map cached results back to each input row (preserve duplicates in output)
    for idx, row in subset.iterrows():
        name = str(row.get("Name", "")).strip()
        bioguide = str(row.get("Bioguide", "")).strip()
        if not name or not bioguide:
            logging.info("Skipping row %s: missing name or bioguide", idx)
            continue

        net, last = cache.get(bioguide, ("", ""))
        out_rows.append({"Name": name, "Net Worth Est.": net, "Last Traded": last})

    out_df = pd.DataFrame(out_rows)
    out_df.to_csv(args.output, index=False)
    logging.info("Wrote %d rows to %s", len(out_df), args.output)


if __name__ == "__main__":
    main()
