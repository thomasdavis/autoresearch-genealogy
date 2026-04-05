"""
Retroactively populate the documents and chunks tables for files that were
ingested through the extraction pipeline but never stored in documents/chunks.

This does NOT re-extract. It just stores the raw text so it's searchable.

Usage:
    source .venv-goks/bin/activate && export $(cat .env | xargs)
    python3 scripts/goks/backfill_documents.py [directory_or_glob]

Examples:
    python3 scripts/goks/backfill_documents.py /tmp/cifhs_batch*.md
    python3 scripts/goks/backfill_documents.py resources/cifhs/qld/
"""

import sqlite3
import hashlib
import sys
import re
from pathlib import Path
from typing import Optional

DB_PATH = Path(__file__).parent.parent.parent / "research.db"


def chunk_text(text: str, max_chars: int = 2000, overlap: int = 300) -> list[str]:
    """Same chunking logic as extract.py for consistency."""
    if len(text) <= max_chars:
        return [text] if len(text) >= 50 else []
    chunks = []
    start = 0
    while start < len(text):
        end = start + max_chars
        chunk = text[start:end]
        if len(chunk) >= 50:
            chunks.append(chunk)
        start = end - overlap
    return chunks


def extract_title(content: str, path: str) -> str:
    """Extract title from markdown frontmatter or first heading, or filename."""
    # Try YAML frontmatter title
    m = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if m:
        return m.group(1).strip()
    # Fall back to filename
    return Path(path).stem


def extract_doc_type(content: str, path: str) -> str:
    """Extract doc_type from YAML frontmatter or guess from path."""
    m = re.search(r'^type:\s*(.+)$', content, re.MULTILINE)
    if m:
        return m.group(1).strip()
    if 'cifhs' in path.lower():
        return 'source-data'
    return 'unknown'


def extract_tags(content: str) -> str:
    """Extract tags from YAML frontmatter."""
    m = re.search(r'^tags:\s*\[(.+)\]$', content, re.MULTILINE)
    if m:
        return f'[{m.group(1)}]'
    return '[]'


def backfill_file(conn: sqlite3.Connection, file_path: str, dry_run: bool = False) -> dict:
    """Add a file to documents and chunks tables if not already there."""
    path = Path(file_path)
    if not path.exists():
        return {"status": "missing", "path": file_path}

    content = path.read_text(errors="replace")
    content_hash = hashlib.md5(content.encode()).hexdigest()

    # Check if already in documents
    existing = conn.execute(
        "SELECT id FROM documents WHERE path = ? OR content_hash = ?",
        (str(file_path), content_hash)
    ).fetchone()

    if existing:
        return {"status": "already_exists", "path": file_path, "doc_id": existing[0]}

    title = extract_title(content, file_path)
    doc_type = extract_doc_type(content, file_path)
    tags = extract_tags(content)

    if dry_run:
        chunks = chunk_text(content)
        return {"status": "would_add", "path": file_path, "title": title,
                "doc_type": doc_type, "chunks": len(chunks)}

    # Insert document
    cur = conn.execute(
        "INSERT INTO documents (path, title, doc_type, created, content, content_hash, tags) VALUES (?, ?, ?, datetime('now'), ?, ?, ?)",
        (str(file_path), title, doc_type, content, content_hash, tags)
    )
    doc_id = cur.lastrowid

    # Chunk and insert
    chunks = chunk_text(content)
    for i, chunk in enumerate(chunks):
        conn.execute(
            "INSERT INTO chunks (document_id, chunk_index, content) VALUES (?, ?, ?)",
            (doc_id, i, chunk)
        )

    conn.commit()
    return {"status": "added", "path": file_path, "doc_id": doc_id,
            "title": title, "chunks": len(chunks)}


def main():
    import glob

    if len(sys.argv) < 2:
        print("Usage: python3 backfill_documents.py <path_or_glob> [--dry-run]")
        sys.exit(1)

    pattern = sys.argv[1]
    dry_run = "--dry-run" in sys.argv

    # Resolve files
    if '*' in pattern:
        files = sorted(glob.glob(pattern))
    elif Path(pattern).is_dir():
        files = sorted(str(p) for p in Path(pattern).rglob("*") if p.is_file())
    else:
        files = [pattern]

    if not files:
        print(f"No files matched: {pattern}")
        sys.exit(1)

    print(f"{'[DRY RUN] ' if dry_run else ''}Backfilling {len(files)} files into documents/chunks tables")

    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA journal_mode=WAL")

    added = 0
    skipped = 0
    missing = 0
    total_chunks = 0

    for f in files:
        result = backfill_file(conn, f, dry_run=dry_run)
        status = result["status"]
        if status in ("added", "would_add"):
            added += 1
            total_chunks += result.get("chunks", 0)
            print(f"  + {Path(f).name}: {result.get('title', '?')} ({result.get('chunks', 0)} chunks)")
        elif status == "already_exists":
            skipped += 1
        elif status == "missing":
            missing += 1
            print(f"  ! MISSING: {f}")

    print(f"\nDone. Added: {added}, Skipped: {skipped}, Missing: {missing}, Total chunks: {total_chunks}")

    conn.close()


if __name__ == "__main__":
    main()
